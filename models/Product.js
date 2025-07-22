import mongoose from "mongoose";
const { Schema } = mongoose;

const specSchema = new Schema({
  colorId:   String,
  title:     String, // màu
  quantity:  { type: Number, default: 0 },
  imgList:   [String],
  sizes:     [String], // Bổ sung trường sizes
}, { _id: false });

const productSchema = new Schema({
  SKU:         { type: String, unique: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  subCategory: { type: String },
  description: { type: String, required: true },
  rating:      { type: Number, default: 0 },
  specs:       [specSchema],
  tags:        [String],
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);