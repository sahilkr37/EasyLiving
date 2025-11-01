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



export default router;
