import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.query.userId });
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { userId, productId, name, quantity, price, color, size } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, name, quantity, price, color, size }] });
  } else {
    cart.products.push({ productId, name, quantity, price, color, size });
  }
  await cart.save();
  res.json(cart);
};

export const updateCartItem = async (req, res) => {
  // Giả lập: cập nhật số lượng sản phẩm trong giỏ
  const { userId, itemId, quantity } = req.body;
  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  const item = cart.products.id(itemId);
  if (item) item.quantity = quantity;
  await cart.save();
  res.json(cart);
};

export const removeCartItem = async (req, res) => {
  const { userId, itemId } = req.body;
  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  cart.products = cart.products.filter(p => p._id.toString() !== itemId);
  await cart.save();
  res.json(cart);
};