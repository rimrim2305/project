import express from "express";
const router = express.Router();

// Đăng nhập quản trị
router.post("/login", async (req, res) => {
  // ... Xử lý đăng nhập admin ...
  res.json({ message: "Đăng nhập admin thành công" });
});

// Quản lý sản phẩm, đơn hàng, người dùng, bài viết...
// Bạn có thể mở rộng thêm các route cho admin tại đây

export default router;