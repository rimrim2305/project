import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  userName:  { type: String, required: true }, 
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
