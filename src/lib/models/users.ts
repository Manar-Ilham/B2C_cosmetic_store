import { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
    isActive: { type: Boolean, default: true },

    firstName: String,
    lastName: String,
    phone: String,
    avatarUrl: String,
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: Date,

    addresses: [AddressSchema],

    // seller fields
    storeName: String,
    storeLogo: String,
    storeBanner: String,
    businessType: { type: String, enum: ["individual", "company"] },
    bio: String,
    ratings: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },

    // buyer fields
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);


const UserModel = models.User || model("User", UserSchema);

export const User = UserModel;
export default UserModel;