import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://localhost:27017/fashionital";

async function updatePasswords() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find({});
  for (const user of users) {
    // Nếu password chưa hash (ví dụ: ngắn hơn 20 ký tự)
    if (user.password && user.password.length < 20) {
      const hashed = await bcrypt.hash(user.password, 12);
      user.password = hashed;
      await user.save();
      console.log(`Đã hash password cho user: ${user.email}`);
    }
  }
  console.log("Đã cập nhật xong tất cả password.");
  process.exit();
}

updatePasswords(); 