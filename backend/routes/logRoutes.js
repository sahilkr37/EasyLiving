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

router.get("/all", protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const [moods, expenses, activities] = await Promise.all([
            MoodLog.find({ userId }).sort({ createdAt: -1 }),
            ExpenseLog.find({ userId }).sort({ createdAt: -1 }),
            ActivityLog.find({ userId }).sort({ createdAt: -1 }),
        ]);

        const merged = [
            ...moods.map((l) => ({ ...l._doc, type: "mood" })),
            ...expenses.map((l) => ({ ...l._doc, type: "expense" })),
            ...activities.map((l) => ({ ...l._doc, type: "routine" })),
        ];

        merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ logs: merged });
    } catch (err) {
        console.error("❌ Error fetching all logs:", err);
        res.status(500).json({ message: "Failed to fetch all logs." });
    }
});


export default router;
