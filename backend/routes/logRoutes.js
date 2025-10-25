import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addMoodLog, addExpenseLog, addActivityLog } from "../controllers/logController.js";

const router = express.Router();

// MOOD
router.post("/mood/add", protect, addMoodLog);

// EXPENSE
router.post("/expense/add", protect, addExpenseLog);

// ACTIVITY
router.post("/activity/add", protect, addActivityLog);

export default router;
