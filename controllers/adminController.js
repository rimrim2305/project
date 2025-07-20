import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

// Đăng nhập quản trị
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // TODO: Thực hiện xác thực thực tế
  if (email === "admin@site.com" && password === "admin") {
    res.json({ message: "Đăng nhập admin thành công" });
  } else {
    res.status(401).json({ message: "Sai thông tin đăng nhập" });
  }
};

// Quản lý sản phẩm
export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
export const createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
};
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá sản phẩm" });
};

// Quản lý đơn hàng
export const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};
export const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
};

// Quản lý người dùng
export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
};
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá người dùng" });
};

// Quản lý bài viết/blog
export const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};
export const createPost = async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
};
export const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};
export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá bài viết" });
};