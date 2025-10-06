import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import Category from "@/lib/models/category";

async function resolveId(params: unknown): Promise<string | undefined> {
  return (await params as { id?: string } | undefined)?.id;
}

export async function GET(_req: Request, { params }: { params: unknown }) {
  await connect();
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const doc = await Category.findById(id).lean();
    if (!doc) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: unknown }) {
  await connect();
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string; slug?: string };
    const updates: Record<string, unknown> = {};
    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.slug === "string") updates.slug = body.slug;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const updated = await Category.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!updated) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err?.code === 11000) return NextResponse.json({ message: "Slug or name already in use" }, { status: 409 });
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: unknown }) {
  await connect();
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    const deleted = await Category.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}