import mongoose from "mongoose";
import Cart from "../models/Cart.js";

function toObjectId(id) {
  console.log("[toObjectId] Nhận vào:", id, typeof id);
  const valid = mongoose.Types.ObjectId.isValid(id);
  console.log("[toObjectId] isValid:", valid);
  if (!valid) return null;
  return new mongoose.Types.ObjectId(id); // PHẢI dùng new
}

export const getCart = async (req, res) => {
  const userObjectId = toObjectId(req.query.userId);
  if (!userObjectId) {
    console.log("[getCart] userId không hợp lệ:", req.query.userId);
    return res.status(400).json({ message: "userId không hợp lệ" });
  }
  const cart = await Cart.findOne({ userId: userObjectId });
  console.log("[getCart] userId:", req.query.userId, "=> Cart:", cart);
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { userId, products } = req.body;
  if (!userId || !products || !products.length) {
    console.log("[addToCart] Thiếu thông tin sản phẩm", req.body);
    return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
  }
  const userObjectId = toObjectId(userId);
  if (!userObjectId) {
    console.log("[addToCart] userId không hợp lệ:", userId);
    return res.status(400).json({ message: "userId không hợp lệ" });
  }
  const item = products[0];
  let cart = await Cart.findOne({ userId: userObjectId });
  if (!cart) {
    cart = new Cart({ userId: userObjectId, products: [item] });
    console.log("[addToCart] Tạo mới cart cho user:", userId, "=>", cart);
  } else {
    const idx = cart.products.findIndex(p =>
      p.productId.toString() === item.productId &&
      p.color === item.color &&
      p.size === item.size
    );
    if (idx > -1) {
      cart.products[idx].quantity += item.quantity;
      console.log("[addToCart] Cộng dồn số lượng sản phẩm:", item, "=>", cart.products[idx]);
    } else {
      cart.products.push(item);
      console.log("[addToCart] Thêm sản phẩm mới vào cart:", item);
    }
  }
  await cart.save();
  console.log("[addToCart] Cart sau khi lưu:", cart);
  res.json(cart);
};

export const updateCartItem = async (req, res) => {
  const { userId, itemId, quantity } = req.body;
  const userObjectId = toObjectId(userId);
  if (!userObjectId) return res.status(400).json({ message: "userId không hợp lệ" });
  const cart = await Cart.findOne({ userId: userObjectId });
  if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  const item = cart.products.id(itemId);
  if (item) item.quantity = quantity;
  await cart.save();
  res.json(cart);
};

export const removeCartItem = async (req, res) => {
  const { userId } = req.body;
  const { itemId } = req.params;
  const userObjectId = toObjectId(userId);
  if (!userObjectId) return res.status(400).json({ message: "userId không hợp lệ" });
  const cart = await Cart.findOne({ userId: userObjectId });
  if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  cart.products = cart.products.filter(p => p._id.toString() !== itemId);
  await cart.save();
  res.json(cart);
};