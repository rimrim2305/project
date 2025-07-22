import mongoose from "mongoose";
const { Schema } = mongoose;

const specSchema = new Schema({
  colorId:   String,
  title:     String,
  imgList:   [String],
}, { _id: false });

const inventorySchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity:  { type: Number, required: true },
  specs:     [specSchema]
}, { timestamps: true });

export default mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);