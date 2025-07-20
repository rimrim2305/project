import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ message: "Đặt hàng thành công", order });
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ "userInfo.userId": req.query.userId });
  res.json(orders);
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { "orderInfo.shippingStatus": "cancelled" }, { new: true });
  res.json(order);
};