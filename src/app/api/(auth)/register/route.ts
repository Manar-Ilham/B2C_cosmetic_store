import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import User from "@/lib/models/users";
import { registerSchema } from "@/schemas/auth";
import { hashPassword } from "@/lib/auth/hash";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connect();
  const body = await req.json();

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, firstName, lastName, role } = parsed.data;

  const exists = await User.findOne({ email }).lean();
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, firstName, lastName, role });

  const access  = signAccessToken(user._id.toString(), user.role);
  const refresh = signRefreshToken(user._id.toString(), user.role);

  const res = NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }, { status: 201 });

  setAuthCookies(res, access, refresh);
  return res;
}
