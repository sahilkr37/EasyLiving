import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
  moodNote: { type: String, maxlength: 100, default: "" },
  sleepHours: { type: Number, required: true },
  screenTimeHours: { type: Number, required: true },
  exerciseMinutes: { type: Number, required: true },
  caffeineMg: { type: Number, required: true },

  // 🧠 Predicted Mood
  predictedMood: { type: String, default: "Unknown" },
  modelConfidence: { type: Number, default: null },
}, { timestamps: true });

const MoodLog = mongoose.model("MoodLog", moodLogSchema);
export default MoodLog;
