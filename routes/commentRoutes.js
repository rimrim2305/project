import express from "express";
import { createComment, getCommentsByProduct, updateCommentById, deleteCommentById, countCommentsByProduct, getAverageRating } from "../controllers/commentController.js";

const router = express.Router();

// POST /api/reviews/:productId
router.post("/:productId", createComment);

// get
router.get("/:productId", getCommentsByProduct);

//udate
router.put("/update/:commentId", updateCommentById);

// delete
router.delete("/delete/:commentId", deleteCommentById);

// dem so luong comment theo sp
router.get("/count/:productId", countCommentsByProduct);

// rating ave
router.get("/average-rating/:productId", getAverageRating);

export default router;
