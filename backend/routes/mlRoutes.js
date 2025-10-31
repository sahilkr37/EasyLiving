import express from "express";
import axios from "axios";
import { protect } from "../middleware/authMiddleware.js";
import MoodLog from "../models/MoodLog.js";

const router = express.Router();

router.post("/predict/mood", protect, async (req, res) => {
  try {
    const { sleepHours, screenTimeHours, exerciseMinutes, caffeineMg, textInput } = req.body;

    // 🧠 Send data to FastAPI
    const response = await axios.post("http://127.0.0.1:8000/predict/mood", {
      sleepHours,
      screenTimeHours,
      exerciseMinutes,
      caffeineMg,
      textInput: textInput || "",
    });

    const { predicted_mood, confidence } = response.data;

    // 🗂️ Save to MongoDB
    await MoodLog.create({
      userId: req.user._id,
      sleepHours,
      screenTimeHours,
      exerciseMinutes,
      caffeineMg,
      moodNote: textInput,
      predictedMood: predicted_mood,
      modelConfidence: confidence || null,
    });

    // ✅ Return full response to frontend
    res.status(200).json(response.data);

  } catch (error) {
    console.error("❌ Mood Prediction Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
    });
  }
});

// 🌿 Route: POST /api/ml/predict/expense (personalized by user)
router.post("/predict/expense", protect, async (req, res) => {
  try {
    // ✅ Access user financial details from MongoDB (via protect middleware)
    const user = req.user;
    const userFinancials = {
      monthly_income: user.monthly_income || 0,
      avg_monthly_spending: user.avg_monthly_spending || 0,
    };

    // ✅ Combine frontend expense data + user context
    const requestData = { ...req.body, ...userFinancials };

    // ✅ Send to FastAPI
    const response = await axios.post("http://127.0.0.1:8000/predict/expense", requestData);

    // ✅ Return FastAPI’s output (predictions + recommendation)
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Expense Prediction Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
    });
  }
});


export default router;
