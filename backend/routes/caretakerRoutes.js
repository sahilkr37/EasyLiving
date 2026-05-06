import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getMyElderly, addElderly, getElderHistory } from "../controllers/caretakerController.js";



const router = express.Router();

// 🔥 Add elderly by email
router.post("/add-elderly", protect, addElderly);
router.get("/my-elderly", protect, getMyElderly);
router.get("/history", protect, getElderHistory);

export default router;