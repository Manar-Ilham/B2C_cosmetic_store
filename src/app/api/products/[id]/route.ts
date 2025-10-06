import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import mongoose from "mongoose";
import users, { type User } from "@/lib/models/users";

async function resolveId(params: unknown): Promise<string | undefined> {
  return (await params as { id?: string } | undefined)?.id;
}

export async function GET(_req: Request, { params }: { params: unknown }) {
  await connect();
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const doc = await users.findById(id).select("-password").lean();
  if (!doc) return NextResponse.json({ message: "User not found" }, { status: 404 });
  return NextResponse.json(doc, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: unknown }) {
  await connect();
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const body = (await request.json().catch(() => ({}))) as Partial<Pick<User, "firstName" | "lastName" | "phone" | "avatar">>;
    const updates: Partial<User> = {};
    if (typeof body.firstName === "string") updates.firstName = body.firstName;
    if (typeof body.lastName === "string") updates.lastName = body.lastName;
    if (typeof body.phone === "string") updates.phone = body.phone;
    if (typeof body.avatar === "string") updates.avatar = body.avatar;

    if (Object.keys(updates).length === 0) return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });

    const updated = await users.findByIdAndUpdate(id, updates, { new: true }).select("-password").lean();
    if (!updated) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: unknown }) {
  await connect();
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const deleted = await users.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}