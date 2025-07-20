import mongoose from "mongoose";
const { Schema } = mongoose;

const orderProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  name:      String,
  quantity:  Number,
  price:     Number,
  color:     String,
  size:      String,
}, { _id: false });

const orderSchema = new Schema({
  userInfo: {
    userId:     { type: Schema.Types.ObjectId, ref: "User" },
    email:      String,
    fullName:   String,
    company:    String,
    address:    String,
    city:       String,
    country:    String,
    state:      String,
    postalCode: String,
    phoneNumber:String,
  },
  orderInfo: {
    deliveryMethod: String,
    deliveryFee:    { type: Number, default: 0 },
    shippingStatus: { type: String, default: "pending" },
    paymentMethod:  String,
    paymentStatus:  { type: String, default: "pending" },
    totalPrice:     { type: Number, required: true },
  },
  products: [orderProductSchema],
  note:     String
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);