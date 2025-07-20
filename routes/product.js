import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

// Xem danh sách sản phẩm, tìm kiếm, lọc
router.get("/", async (req, res) => {
  const { search, category, color, size } = req.query;
  let query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (color) {
    query["specs.title"] = { $regex: color, $options: "i" };
  }
  if (size) {
    query["specs.sizes"] = size;
  }
  const products = await Product.find(query);
  res.json(products);
});

// Thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Thêm sản phẩm thành công", product });
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi thêm sản phẩm", error: err.message });
  }
});

// Xem chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Lỗi truy vấn", error: err.message });
  }
});

export default router;