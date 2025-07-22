import Product from "../models/Product.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";

// create cmt by productid
export const createComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userName, rating, comment } = req.body;

    if (!userName || !rating || !comment) {
      return res.status(400).json({ message: "Thiếu thông tin userName, rating hoặc comment" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const newComment = new Comment({
      productId,
      userName,
      rating,
      comment
    });

    await newComment.save();

    res.status(201).json({ message: "Review đã được thêm", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo review", error: error.message });
  }
};

// get all cmt by productid
export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const comments = await Comment.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy bình luận", error: error.message });
  }
};

//update
export const updateCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userName, rating, comment } = req.body;

    // Tìm comment cần update
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Không tìm thấy comment" });
    }

    // Cập nhật các trường (nếu có)
    if (userName !== undefined) existingComment.userName = userName;
    if (rating !== undefined) existingComment.rating = rating;
    if (comment !== undefined) existingComment.comment = comment;

    await existingComment.save();

    res.status(200).json({
      message: "Comment đã được cập nhật",
      updatedComment: existingComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật comment", error: error.message });
  }
};

//delete
export const deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deleted = await Comment.findByIdAndDelete(commentId);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy comment để xoá" });
    }

    res.status(200).json({ message: "Comment đã được xoá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xoá comment", error: error.message });
  }
};

//ddem so luong comment theo sp
export const countCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const count = await Comment.countDocuments({ productId });

    res.status(200).json({ productId, totalComments: count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đếm số comment", error: error.message });
  }
};

// rating ave
export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;

    // Chuyển productId sang ObjectId đúng kiểu
    const objectId = new mongoose.Types.ObjectId(productId);

    const result = await Comment.aggregate([
      { $match: { productId: objectId } },
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalComments: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        productId,
        averageRating: 0,
        totalComments: 0
      });
    }

    res.status(200).json({
      productId,
      averageRating: parseFloat(result[0].averageRating.toFixed(1)),
      totalComments: result[0].totalComments
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tính rating trung bình",
      error: error.message
    });
  }
};