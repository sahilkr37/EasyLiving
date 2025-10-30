// backend/routes/expenseMlRoutes.js
import express from "express";
import { predictExpenseAndReturn } from "../controllers/expenseMlController.js";
import { protect } from "../middleware/authMiddleware.js"; // optional

const router = express.Router();
router.post("/predict/expense", protect, predictExpenseAndReturn);

export default router;
