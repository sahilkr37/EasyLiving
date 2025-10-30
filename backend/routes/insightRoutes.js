import express from "express";
const router = express.Router();

let latestRecommendations = [];

// ✅ Mock data — replace with real DB or ML values later
router.get("/weekly", (req, res) => {
    try {
        const data = {
            avg_mood_7days: 4.2,
            total_expense_7days: 1850.75,
            top_activity_14days: "Walking",
        };

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching weekly insights:", error);
        res.status(500).json({ message: "Server error while fetching weekly insights." });
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
