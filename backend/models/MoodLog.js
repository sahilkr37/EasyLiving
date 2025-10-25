import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    moodNote: {
        type: String,
        maxlength: 50,
        default: ""
    },
    sleepHours: { type: Number, required: true },
    screenTimeHours: { type: Number, required: true },
    exerciseMinutes: { type: Number, required: true },
    caffeineMg: {
        type: Number,
        enum: [0, 50, 100, 150, 200, 271],
        required: true
    }
}, { timestamps: true });

const MoodLog = mongoose.model("MoodLog", moodLogSchema);
export default MoodLog;
