import express from "express";
import { createClothing } from "../controllers/clothingController.js";
const router = express.Router();

router.post("/create", createClothing);

export default router; 