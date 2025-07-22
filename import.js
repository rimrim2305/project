import mongoose from 'mongoose';
import fs from 'fs';
import { ObjectId } from 'mongodb';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/fashionital');
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

// Load JSON file and fix $oid
const loadData = (filename) => {
  const raw = fs.readFileSync(filename);
  const data = JSON.parse(raw);
  
  return data.map(item => {
    if (item._id?.$oid) {
      item._id = new ObjectId(item._id.$oid);
    }
    return item;
  });
};

// Import function
const importData = async () => {
  await connectDB();

  try {
    const users = loadData('./fashionital.users.json');
    const orders = loadData('./fashionital.orders.json');
    const products = loadData('./fashionital.products.json');
    const carts = loadData('./fashionital.carts.json');
    const posts = loadData('./fashionital.posts.json');

    await mongoose.connection.collection('users').insertMany(users);
    await mongoose.connection.collection('orders').insertMany(orders);
    await mongoose.connection.collection('products').insertMany(products);
    await mongoose.connection.collection('carts').insertMany(carts);
    await mongoose.connection.collection('posts').insertMany(posts);

    console.log("✅ Dữ liệu đã được import thành công.");
  } catch (err) {
    console.error("❌ Lỗi khi import:", err);
  } finally {
    process.exit();
  }
};

importData();
