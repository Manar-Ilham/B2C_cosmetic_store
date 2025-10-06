import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import Category from "@/lib/models/category";

export async function GET() {
  await connect();
  try {
    const items = await Category.find().lean();
    return NextResponse.json({ total: items.length, items }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connect();
  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string; slug?: string };
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ message: "name is required" }, { status: 400 });
    }

    const doc = await Category.create({ name: body.name, slug: body.slug ?? undefined });
    return NextResponse.json(doc, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}