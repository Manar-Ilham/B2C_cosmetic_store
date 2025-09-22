import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../../../../../lib/users";


const SECRET = process.env.JWT_SECRET || "dev_secret"; // use .env.local later

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = users.find((u) => u.email === email);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
