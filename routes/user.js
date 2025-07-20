import express from "express";
const router = express.Router();

import { getProfile, getOrderHistory } from "../controllers/userController.js";

// Lấy thông tin user
router.get('/profile', getProfile);
// Lấy lịch sử đơn hàng của user
router.get('/order-history', getOrderHistory);

// Route test
router.get('/', (req, res) => {
  res.send('User route is working!');
});

export default router; 