import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";
const router = express.Router();

// Xem giỏ hàng
router.get("/", getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/", addToCart);

// Cập nhật số lượng sản phẩm trong giỏ
router.put("/:itemId", updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:itemId", removeCartItem);

export default router;