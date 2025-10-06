import { Schema, model, models, Types, InferSchemaType } from "mongoose";

const VariantSchema = new Schema({
  name: { type: String, required: true },   // ex : "Size"
  value: { type: String, required: true },  // ex : "M"
  price: Number,
  stock: Number,
});

const ImageSchema = new Schema({
  url: { type: String, required: true },
  alt: String,
});

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: String,

    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    quantity: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "active", "out_of_stock", "archived"], default: "draft" },

    images: [ImageSchema],
    videos: [String],

    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    tags: [String],

    seller: { type: Schema.Types.ObjectId, ref: "User" },
    storeName: String,

    variants: [VariantSchema],

    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingOptions: [
      {
        method: String,
        price: Number,
        estimatedDays: Number,
      },
    ],

    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type Product = InferSchemaType<typeof ProductSchema>;
export default models.Product || model("Product", ProductSchema);
