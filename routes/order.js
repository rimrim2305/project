import express from "express";
import Order from "../models/Order.js";
const router = express.Router();

// Đặt hàng (checkout)
router.post("/", async (req, res) => {
  const { customerId, items } = req.body;

  // Kiểm tra thông tin đơn hàng
  if (!customerId || !items || items.length === 0) {
    return res.status(400).json({ message: "Thông tin đơn hàng không hợp lệ" });
  }

  // Tạo đơn hàng mới
  const newOrder = new Order({
    customerId,
    items,
    status: "pending",
    createdAt: new Date(),
  });

  try {
    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();
    res.status(201).json({ message: "Đặt hàng thành công", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi đặt hàng" });
  }
});

// Xem lịch sử đơn hàng
router.get("/", async (req, res) => {
  const { customerId } = req.query;

  // Kiểm tra thông tin khách hàng
  if (!customerId) {
    return res.status(400).json({ message: "Thông tin khách hàng không hợp lệ" });
  }

  try {
    // Lấy danh sách đơn hàng của khách hàng từ cơ sở dữ liệu
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy lịch sử đơn hàng" });
  }
});

// Xem chi tiết đơn hàng
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy thông tin chi tiết đơn hàng từ cơ sở dữ liệu
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy chi tiết đơn hàng" });
  }
});

// Hủy đơn hàng
router.post("/:id/cancel", async (req, res) => {
  const { id } = req.params;

  try {
    // Cập nhật trạng thái đơn hàng thành "đã huỷ"
    await Order.findByIdAndUpdate(id, { status: "canceled" });
    res.json({ message: "Đã huỷ đơn hàng" });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi huỷ đơn hàng" });
  }
});

export default router;