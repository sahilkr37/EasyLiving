import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: Number, enum: [0, 1, 2], required: true },

    daily_screen_time_hours: { type: Number, default: 0 },
    sleep_hours: { type: Number, default: 0 },
    daily_caffeine_mg: { type: Number, default: 0 },
    exercise_time_per_day_minutes: { type: Number, default: 0 },

    feelings_logging_frequency: { type: Number, enum: [0, 1, 2], default: 1 },
    low_mood_response: { type: Number, enum: [0, 1, 2, 3], default: 0 },

    monthly_income: { type: Number, default: 0 },
    major_expense_category: { type: Number, enum: [0, 1, 2, 3, 4], default: 0 },
    avg_monthly_expense_level: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    overspend_frequency: { type: Number, enum: [0, 1, 2], default: 1 },
    forget_to_log_frequency: { type: Number, enum: [0, 1, 2], default: 1 },

    total_screen_time_hours: { type: Number, default: 0 },
    family_member_count: { type: Number, default: 0 },

    // Email and emergency contact
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emergency_contact: { type: String, default: "" },
    has_email_registered: { type: Number, default: 1 },
    has_emergency_contact: { type: Number, default: 0 },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
