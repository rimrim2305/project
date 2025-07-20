import express from "express";
import Cart from "../models/Cart.js";
const router = express.Router();

// Xem giỏ hàng
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find({}); // Giả sử bạn lấy tất cả sản phẩm trong giỏ hàng
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post("/", async (req, res) => {
  const newItem = new Cart(req.body);

  try {
    await newItem.save();
    res.status(201).json({ message: "Đã thêm vào giỏ hàng" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật/xoá sản phẩm khỏi giỏ hàng
router
  .route("/:itemId")
  .put(async (req, res) => {
    try {
      const updatedItem = await Cart.findByIdAndUpdate(req.params.itemId, req.body, {
        new: true,
      });
      res.json({ message: "Đã cập nhật giỏ hàng", item: updatedItem });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.itemId);
      res.json({ message: "Đã xoá khỏi giỏ hàng" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;