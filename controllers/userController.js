import User from "../models/User.js";
import Order from "../models/Order.js";

export const getProfile = async (req, res) => {
  // Lấy thông tin user (giả lập lấy userId từ req.query)
  const user = await User.findById(req.query.userId);
  res.json(user);
};

export const getOrderHistory = async (req, res) => {
  const orders = await Order.find({ "userInfo.userId": req.query.userId });
  res.json(orders);
};

export const getOrderDetail = async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { "orderInfo.shippingStatus": "cancelled" }, { new: true });
  res.json(order);
};

// Cập nhật thông tin user
export const updateProfile = async (req, res) => {
  try {
    const { _id, name, email, dob, country, gender, avatar } = req.body;
    if (!_id) return res.status(400).json({ message: "Thiếu user id" });
    const user = await User.findByIdAndUpdate(
      _id,
      { name, email, dob, country, gender, avatar },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy danh sách sản phẩm yêu thích
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.query.userId).populate("wishlist");
  res.json(user?.wishlist || []);
};

// Thêm/xóa sản phẩm khỏi wishlist
export const toggleWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
  const idx = user.wishlist.findIndex(id => id.toString() === productId);
  if (idx > -1) {
    user.wishlist.splice(idx, 1); // Xóa khỏi wishlist
  } else {
    user.wishlist.push(productId); // Thêm vào wishlist
  }
  await user.save();
  res.json(user.wishlist);
};