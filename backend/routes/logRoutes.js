import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addMoodLog, addExpenseLog, addActivityLog } from "../controllers/logController.js";
import MoodLog from "../models/MoodLog.js";
import ExpenseLog from "../models/ExpenseLog.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

// MOOD
router.post("/mood/add", protect, addMoodLog);

// EXPENSE
router.post("/expense/add", protect, addExpenseLog);

// ACTIVITY
router.post("/activity/add", protect, addActivityLog);

// 🧠 Get all Mood Logs for logged-in user
router.get("/mood/all", protect, async (req, res) => {
    try {
        const logs = await MoodLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ logs });
    } catch (err) {
        console.error("Error fetching mood logs:", err);
        res.status(500).json({ message: "Server error fetching mood logs" });
    }
});

// 💰 Get all Expense Logs for logged-in user
router.get("/expense/all", protect, async (req, res) => {
    try {
        const logs = await ExpenseLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ logs });
    } catch (err) {
        console.error("Error fetching expense logs:", err);
        res.status(500).json({ message: "Server error fetching expense logs" });
    }
});

// 🏃 Get all Activity Logs for logged-in user
router.get("/activity/all", protect, async (req, res) => {
    try {
        const logs = await ActivityLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ logs });
    } catch (err) {
        console.error("Error fetching activity logs:", err);
        res.status(500).json({ message: "Server error fetching activity logs" });
    }
});

export default router;
