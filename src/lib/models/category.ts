// src/models/Category.ts
import { Schema, model, models } from "mongoose";


const CategorySchema = new Schema({
   name: { 
    type: String, 
    unique: true, 
    required: true
  },


   slug: { 
    type: String, 
    unique: true }
  
  });
export default models.Category || model("Category", CategorySchema);

