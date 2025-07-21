import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  // Hỗ trợ tìm kiếm, lọc qua query
  const { search, category, minPrice, maxPrice, color, size, brand, shoes, clothings, accessories, sort } = req.query;
  let filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
  if (color) filter["specs.title"] = color;
  if (size) filter["specs.sizes"] = size;
  if (brand) filter.brand = brand;
  // Lọc theo nhiều danh mục nếu chọn nhiều checkbox
  const categories = [];
  if (shoes) categories.push("Shoes");
  if (clothings) categories.push("Clothing");
  if (accessories) categories.push("Accessories");
  if (categories.length) filter.category = { $in: categories };
  // Xử lý sort
  let sortObj = {};
  if (sort === "newest") sortObj = { createdAt: -1 };
  if (sort === "price_desc") sortObj = { price: -1 };
  if (sort === "price_asc") sortObj = { price: 1 };
  const products = await Product.find(filter).sort(sortObj);
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