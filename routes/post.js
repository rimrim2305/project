import express from "express";
import Post from "../models/Post.js";
const router = express.Router();

// Xem bài viết/blog/thông báo
router.get("/", async (req, res) => {
  // ... Xử lý lấy danh sách bài viết ...
  res.json([]);
});

export default router;