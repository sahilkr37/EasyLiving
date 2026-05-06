import MoodLog from "../models/MoodLog.js";
import User from "../models/User.js";
import { getGeminiResponse } from "../utils/gemini.js";

export const chatWithAI = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message } = req.body;

        // 🔥 Get latest mood
        const latestLog = await MoodLog.findOne({ userId })
            .sort({ createdAt: -1 });

        const mood = latestLog?.predictedMood || "Neutral";

        // 🔥 Smart prompt
        const prompt = `
You are an AI companion for an elderly person.

User mood: ${mood}

Guidelines:
- Speak simply and kindly
- Also try to understand user message and reply accordingly
- Be supportive and calm
- give shorter replies and human like replies and match the mood and tone
- If mood is Sad → comfort and emotional support
- If mood is Stressed → suggest relaxation
- If Happy → encourage positivity
- Keep responses short and human-like
- As this is more for indians speak like an indian, and comfort like a real person,

User says: "${message}"

Reply:
`;

        const reply = await getGeminiResponse(prompt);

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "AI error" });
    }
};

export const caretakerSummary = async (req, res) => {

    try {

        const caretakerId = req.user.id;

        // 🔥 Fetch all elders of caretaker
        const elders = await User.find({
            caretakerIds: { $in: [caretakerId] }
        });

        let elderData = "";

        // 🔥 Get 7-day data for each elder
        for (const elder of elders) {

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const logs = await MoodLog.find({
                userId: elder._id,
                createdAt: { $gte: sevenDaysAgo }
            }).sort({ createdAt: 1 });

            elderData += `

Elder Name: ${elder.name}

`;

            logs.forEach((log) => {

                elderData += `
Date: ${log.createdAt.toDateString()}
Mood: ${log.predictedMood}
Sleep: ${log.sleepHours} hours
Screen Time: ${log.screenTimeHours} hours
Exercise: ${log.exerciseMinutes} minutes

`;

            });
        }

        // 🔥 Gemini Prompt
        const prompt = `

You are an AI health assistant helping a caretaker.

Analyze the following elderly data from the last 7 days.

Tell:
1. Which elder needs most attention
2. Which elder is improving
3. Any concerning lifestyle habits
4. Keep answer short, human-like, and easy to understand

DATA:
${elderData}

`;

        const summary = await getGeminiResponse(prompt);

        res.json({
            success: true,
            summary
        });

    } catch (err) {

        console.error("Caretaker AI Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to generate summary"
        });
    }
};