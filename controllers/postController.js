import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi tạo bài viết", error: err.message });
  }
};

export const getPostDetail = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: "Lỗi truy vấn", error: err.message });
  }
};