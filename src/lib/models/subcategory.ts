
import { Schema, model, models } from "mongoose";
const SubcategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});
export default models.Subcategory || model("Subcategory", SubcategorySchema);
