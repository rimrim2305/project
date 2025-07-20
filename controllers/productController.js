import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  // Hỗ trợ tìm kiếm, lọc qua query
  const { search, category } = req.query;
  let filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  const products = await Product.find(filter);
  res.json(products);
};

export const getProductDetail = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

export const addReview = async (req, res) => {
  // Giả lập: thêm review vào mảng comment
  const { userId, content } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  product.comment = product.comment || [];
  product.comment.push({ authorID: userId, content });
  await product.save();
  res.json({ message: "Đã đánh giá sản phẩm" });
};