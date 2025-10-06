import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import mongoose from "mongoose";
import users from "@/lib/models/users";
// ...existing code...

async function getId(params: any) {
  const { id } = await params;
  return id as string | undefined;
}

export async function GET(request: Request, { params }: { params: any }) {
  await connect();
  try {
    const id = await getId(params);
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const user = await users.findById(id).select("-password").lean();
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: any }) {
  await connect();
  try {
    const id = await getId(params);
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const { firstName, phone, ...rest } = body;

    // Allow only specific fields to be updated
    const updates: any = {};
    if (typeof firstName === "string") updates.firstName = firstName;
    if (typeof phone === "string") updates.phone = phone;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const updated = await users.findByIdAndUpdate(id, updates, { new: true }).select("-password").lean();
    if (!updated) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: any }) {
  await connect();
  try {
    const id = await getId(params);
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const deleted = await users.findByIdAndDelete(id).select("-password").lean();
    if (!deleted) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
