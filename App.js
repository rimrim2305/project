import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import postRoutes from "./routes/post.js";
import wishlistRoutes from "./routes/wishlist.js";
import adminRoutes from "./routes/admin.js";
import adminOnlyRoutes from "./routes/adminOnly.js";
import User from "./models/User.js";

const app = express();
app.use(express.json());

// Kết nối database
connectDB();

// Sử dụng các routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // sửa lại từ /api/users
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", adminOnlyRoutes); // Route ví dụ chỉ cho admin

// Trang mặc định
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/`);
});