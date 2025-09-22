import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { users } from "../../../../../lib/users";


export async function POST(req) {
  try {
    const body = await req.json();
    const { fullname, email,phoneNumber, password, role } = body;

    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), fullname, email,phoneNumber, password: hashedPassword, role: role || "acheteur" };

    users.push(newUser);

    return NextResponse.json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email, phoneNumber:newUser.phoneNumber, role: newUser.role }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
