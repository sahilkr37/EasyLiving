import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import ExpenseLog from "../models/ExpenseLog.js";
import ActivityLog from "../models/ActivityLog.js";
import MoodLog from "../models/MoodLog.js";
import mongoose from "mongoose";

let latestRecommendations = [];



router.get("/weekly", protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // 📅 Dates
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const fourteenDaysAgo = new Date(now);
        fourteenDaysAgo.setDate(now.getDate() - 14);

        // 💸 1️⃣ Calculate 7-day total expense
        const expenseAgg = await ExpenseLog.aggregate([
            { $match: { userId, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: null,
                    total_expense_7days: { $sum: "$totalExpense" },
                },
            },
        ]);

        const total_expense_7days =
            expenseAgg.length > 0 ? expenseAgg[0].total_expense_7days : 0;

        // 😌 2️⃣ Calculate 7-day average mood (based on predictedMood)
        const moodLogs = await MoodLog.find({
            userId,
            createdAt: { $gte: sevenDaysAgo },
        });



        // Map ML model outputs to scores
        const moodToScore = { happy: 5, neutral: 3, sad: 1 };

        // Convert mood labels into numeric scores
        const moodScores = moodLogs
            .map((log) => moodToScore[log.predictedMood?.toLowerCase()])
            .filter((score) => score !== undefined); // remove any nulls

        // Average mood score
        const avg_mood_7days =
            moodScores.length > 0
                ? (moodScores.reduce((a, b) => a + b, 0) / moodScores.length).toFixed(2)
                : 0;

        // 🏃 3️⃣ Find most frequent activity in last 14 days
        const topActivityAgg = await ActivityLog.aggregate([
            { $match: { userId, createdAt: { $gte: fourteenDaysAgo } } },
            { $group: { _id: "$activityName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);

        const top_activity_14days =
            topActivityAgg.length > 0 ? topActivityAgg[0]._id : "None logged";

        // ✅ Final JSON response
        res.status(200).json({
            avg_mood_7days: Number(avg_mood_7days),
            total_expense_7days: Number(total_expense_7days.toFixed(2)),
            top_activity_14days,
            message: "Weekly insights fetched successfully ✅",
        });
    } catch (error) {
        console.error("❌ Error fetching weekly insights:", error);
        res.status(500).json({
            message: "Server error while fetching weekly insights.",
            error: error.message,
        });
    }
});


// ✅ Save latest recommendations (called after mood prediction)
router.post("/save", (req, res) => {
    const { recommendations } = req.body;

    if (!recommendations || !Array.isArray(recommendations)) {
        return res.status(400).json({ message: "No valid recommendations provided." });
    }

    latestRecommendations = recommendations;
    res.status(200).json({ message: "✅ Recommendations saved successfully!" });
});

// ✅ General well-being and expense recommendations
router.get("/recommendations", (req, res) => {
    try {
        const recs = latestRecommendations.length > 0 ? latestRecommendations : [
            "💧 Stay hydrated and take short breaks between work.",
            "🚶‍♂️ Include 20–30 mins of light physical activity daily.",
            "🕓 Try maintaining consistent sleep hours.",
            "📵 Reduce screen time an hour before bed.",
            "💰 Track your daily spending to spot saving opportunities.",
        ];

        res.status(200).json({ recommendations: recs });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Server error while fetching recommendations." });
    }
});

export default router;
