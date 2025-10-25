import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: { type: Date, required: true, default: Date.now },
    activityName: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    moodScore: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    notes: { type: String, default: "" }
}, { timestamps: true });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
