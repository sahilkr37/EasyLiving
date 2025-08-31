
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const logRoutes = require("./routes/logRoutes");
const { getStats, getRecommendations } = require("./controllers/logController");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/logs", logRoutes);

app.get("/api/stats", async (req, res) => {
    try {
        const data = await getStats();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/api/recommendations", async (req, res) => {
    try {
        const data = await getRecommendations();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => res.send("Elderly Wellness Backend running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
