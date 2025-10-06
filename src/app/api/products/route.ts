import { NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import products, { type Product } from "@/lib/models/products";


type ProductInput = Partial<Pick<Product, "title" | "description" | "price" | "category" | "images" | "quantity">>;


export async function GET(request: Request) {
  await connect();
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
      ];
    }

    const items = await products.find(filter as any).lean();
    return NextResponse.json({ total: items.length, items }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}


export async function POST(request: Request) {
  await connect();
  try {
    const body = (await request.json().catch(() => ({}))) as ProductInput;
    const { title, description, price, category, images, quantity } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ message: "title is required" }, { status: 400 });
    }
    if (price == null || typeof price !== "number") {
      return NextResponse.json({ message: "price is required and must be a number" }, { status: 400 });
    }

    const doc = await products.create({
      title,
      description: description ?? "",
      price,
      category: category ?? null,
      images: images ?? [],
      quantity: typeof quantity === "number" ? quantity : 0,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}