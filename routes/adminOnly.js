import express from "express";
const router = express.Router();

// Route mẫu cho adminOnly
router.get('/admin-only', (req, res) => {
  res.send('Admin only route is working!');
});

export default router; 