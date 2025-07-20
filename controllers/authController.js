import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  // Đơn giản hóa, thực tế cần hash password và JWT
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ message: "Đăng nhập thành công rồi ", user });
  } else {
    res.status(401).json({ message: "Sai thông tin đăng nhập" });
  }
};

export const logout = async (req, res) => {
  // Xử lý đăng xuất (tuỳ vào cách bạn quản lý session/JWT)
  res.json({ message: "Đăng xuất thành công" });
};

export const forgotPassword = async (req, res) => {
  // Gửi email reset password (giả lập)
  res.json({ message: "Đã gửi email đặt lại mật khẩu" });
};

export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOneAndUpdate({ email }, { password: newPassword });
  if (user) {
    res.json({ message: "Đổi mật khẩu thành công" });
  } else {
    res.status(404).json({ message: "Không tìm thấy user" });
  }
};