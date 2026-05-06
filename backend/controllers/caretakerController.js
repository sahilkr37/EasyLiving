import User from "../models/User.js";
import MoodLog from "../models/MoodLog.js";
import Alert from "../models/Alert.js";

import ExpenseLog from "../models/ExpenseLog.js";
import ActivityLog from "../models/ActivityLog.js";
import axios from "axios";

export const addElderly = async (req, res) => {
    try {
        const caretakerId = req.user._id;
        const { email } = req.body;

        const elderly = await User.findOne({ email });

        if (!elderly) {
            return res.status(404).json({ message: "Elderly user not found" });
        }

        if (elderly.role === "caretaker") {
            return res.status(400).json({ message: "Cannot add a caretaker" });
        }

        // 🔥 ensure array exists
        if (!elderly.caretakerIds) {
            elderly.caretakerIds = [];
        }

        // 🔥 prevent duplicate
        const alreadyAdded = elderly.caretakerIds.some(
            id => id.toString() === caretakerId.toString()
        );

        if (!alreadyAdded) {
            elderly.caretakerIds.push(caretakerId);
        }

        await elderly.save();

        res.json({ message: "Elderly linked successfully" });

    } catch (err) {
        console.error("Add elderly error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMyElderly = async (req, res) => {
    try {
        const caretakerId = req.user._id;

        const users = await User.find({
            caretakerIds: { $in: [caretakerId] }
        });

        const result = [];

        for (let user of users) {

            // 🔥 Latest mood log
            const latestLog = await MoodLog.findOne({ userId: user._id })
                .sort({ createdAt: -1 });

            // 🔥 Latest activity
            const latestActivity = await ActivityLog.findOne({ userId: user._id })
                .sort({ createdAt: -1 });

            // 🔥 Today's expense
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const todayExpense = await ExpenseLog.findOne({
                userId: user._id,
                createdAt: { $gte: startOfDay }
            });

            // 🔥 Default values
            let lifestyle_score = null;
            let issues_detected = [];

            // 🔥 Call ML recommendation API
            if (latestLog) {
                try {
                    const mlRes = await axios.post("http://127.0.0.1:8000/recommend", {
                        sleep: latestLog.sleepHours,
                        screen: latestLog.screenTimeHours,
                        exercise: latestLog.exerciseMinutes,
                        expense: todayExpense?.totalExpense || 0,
                        activity_duration: latestActivity?.durationMinutes || 0,

                        // simple fallback averages
                        avg_expense: 1000,
                        user_sleep: 7,
                        user_screen: 5,
                        user_exercise: 20,
                        user_activity: 30
                    });

                    lifestyle_score = mlRes.data.lifestyle_score;
                    issues_detected = mlRes.data.issues_detected;

                } catch (err) {
                    console.log("ML error:", err.message);
                }
            }

            result.push({
                _id: user._id,
                name: user.name,
                email: user.email,

                mood: latestLog?.predictedMood || "No Data",
                lifestyle_score,
                issues_detected,

                sleepHours: latestLog?.sleepHours || 0,
                screenTimeHours: latestLog?.screenTimeHours || 0,
                exerciseMinutes: latestLog?.exerciseMinutes || 0,
                activityDuration: latestActivity?.durationMinutes || 0,

                todayExpense: todayExpense?.totalExpense || 0
            });
        }

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getElderHistory = async (req, res) => {
    try {
        const { userId, days } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));

        const logs = await MoodLog.find({
            userId,
            createdAt: { $gte: startDate }
        }).sort({ createdAt: 1 });

        const result = logs.map(log => ({
            date: log.createdAt,
            mood: log.predictedMood,
            sleep: log.sleepHours,
            screen: log.screenTimeHours,
            exercise: log.exerciseMinutes
        }));

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching history" });
    }
};