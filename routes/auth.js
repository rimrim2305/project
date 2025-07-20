import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

const JWT_SECRET = "your_jwt_secret"; // Nên lưu vào biến môi trường thực tế

// Đăng ký tài khoản
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, dob, country, gender } = req.body;
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Tạo user mới với password đã hash
    const user = new User({ email, password: hashedPassword, name, dob, country, gender });
    await user.save();
    res.json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }
  // So sánh password đã hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }
  // Tạo JWT token
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Đăng nhập thành công", token, user });
});

// Đăng xuất
router.post("/logout", (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
});

// Quên mật khẩu
router.post("/forgot-password", async (req, res) => {
  res.json({ message: "Đã gửi email đặt lại mật khẩu" });
});

// Đổi mật khẩu
router.post("/change-password", async (req, res) => {
  res.json({ message: "Đổi mật khẩu thành công" });
});

export default router;