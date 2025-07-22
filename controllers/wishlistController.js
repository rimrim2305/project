// Bạn có thể lưu wishlist trong User hoặc tạo model riêng
import User from "../models/User.js";

export const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  user.wishlist = user.wishlist || [];
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
  await user.save();
  res.json({ message: "Đã thêm vào wishlist" });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.query.userId);
  res.json(user?.wishlist || []);
};