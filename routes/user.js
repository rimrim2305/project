import express from "express";
const router = express.Router();

import { getProfile, getOrderHistory, updateProfile, getWishlist, toggleWishlist } from "../controllers/userController.js";

// Lấy thông tin user
router.get('/profile', getProfile);
// Lấy lịch sử đơn hàng của user
router.get('/order-history', getOrderHistory);
// Cập nhật thông tin user
router.put('/update-profile', updateProfile);
// Lấy danh sách sản phẩm yêu thích
router.get('/wishlist', getWishlist);
// Thêm/xóa sản phẩm khỏi wishlist
router.post('/wishlist', toggleWishlist);

// Route test
router.get('/', (req, res) => {
  res.send('User route is working!');
});

export default router; 