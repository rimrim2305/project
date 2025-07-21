import mongoose from "mongoose";

let instance = null;

const connectDB = async () => {
  if (instance) {
    // Nếu đã có kết nối, trả về luôn
    return instance;
  }
  try {
    instance = await mongoose.connect('mongodb://localhost:27017/fashionital', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully (Singleton)');
    return instance;
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

export default connectDB;
