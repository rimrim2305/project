import express from "express";
import { getPosts, createPost, getPostDetail } from "../controllers/postController.js";
const router = express.Router();

// Xem bài viết/blog/thông báo
router.get("/", getPosts);
// Tạo bài viết mới
router.post("/", createPost);
// Xem chi tiết bài viết
router.get("/:id", getPostDetail);

export default router;