import mongoose from "mongoose";
const { Schema } = mongoose;

const cartProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  name:      String,
  quantity:  { type: Number, default: 1 },
  price:     Number,
  color:     String,
  size:      String,
}, { _id: false });

const cartSchema = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: "User" },
  status:  { type: String, default: 'active' },
  products:[cartProductSchema]
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);