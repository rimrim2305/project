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