import { NextResponse } from "next/server";
import { connect} from "@/lib/mongoose";
import User from "@/lib/models/users";
import { loginSchema } from "@/schemas/auth";
import { comparePassword } from "@/lib/auth/hash";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connect();
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  user.lastLogin = new Date();
  await user.save();

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
  });

  setAuthCookies(res, access, refresh);
  return res;
}
