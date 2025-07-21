import ClothingFactory from "../factories/ClothingFactory.js";

export const createClothing = (req, res) => {
  const { type, ...data } = req.body;
  try {
    const clothing = ClothingFactory.createClothing(type, data);
    // Ở đây bạn có thể lưu clothing vào database nếu muốn
    res.json({ message: "Tạo quần áo thành công", clothing });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 