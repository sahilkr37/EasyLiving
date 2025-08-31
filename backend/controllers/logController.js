const Log = require("../models/Log");

// create a log
exports.createLog = async (req, res) => {
    try {
        const body = req.body;
        // ensure date is parsed into a Date object
        if (body.date) body.date = new Date(body.date);
        const log = new Log(body);
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get recent logs
exports.getLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 500;
        const logs = await Log.find({}).sort({ createdAt: -1 }).limit(limit);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// delete a log by id
exports.deleteLog = async (req, res) => {
    try {
        const deleted = await Log.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// compute stats (returns object)
exports.getStats = async () => {
    // we return result object (used also directly by server.js)
    const now = new Date();
    const days7 = new Date(now);
    days7.setDate(days7.getDate() - 6); // last 7 days
    const days14 = new Date(now);
    days14.setDate(days14.getDate() - 13); // last 14 days

    // avg mood last 7 days
    const moodAgg = await Log.aggregate([
        { $match: { type: "mood", date: { $gte: days7 }, score: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$score" } } }
    ]);

    const avgMood = (moodAgg[0] && moodAgg[0].avg) ? moodAgg[0].avg : null;

    // total expense last 7 days
    const expenseAgg = await Log.aggregate([
        { $match: { type: "expense", date: { $gte: days7 } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpense = (expenseAgg[0] && expenseAgg[0].total) ? expenseAgg[0].total : 0;

    // most frequent activity in last 14 days
    const activityAgg = await Log.aggregate([
        { $match: { type: "routine", date: { $gte: days14 }, activity: { $ne: null } } },
        { $group: { _id: "$activity", cnt: { $sum: 1 } } },
        { $sort: { cnt: -1 } },
        { $limit: 1 }
    ]);
    const topActivity = activityAgg[0] ? activityAgg[0]._id : null;

    return {
        avg_mood_7days: avgMood,
        total_expense_7days: totalExpense,
        top_activity_14days: topActivity
    };
};

// returns an object { recommendations: [ ... ] }
exports.getRecommendations = async () => {
    const stats = await exports.getStats();
    const recs = [];
    const avg = stats.avg_mood_7days;
    const expense = stats.total_expense_7days;
    const topActivity = stats.top_activity_14days;

    if (avg === null) recs.push("No mood data. Please log daily mood to get personalized suggestions.");
    else if (avg < 3.5) recs.push("Average mood is low this week. Consider calling a family member or doing a short walk each morning.");
    else recs.push("Mood looks stable. Continue your routine and keep logging.");

    if (expense > 1000) recs.push("Weekly expenses appear high. Review grocery and transport spending.");
    else recs.push("Expenses are within a normal range this week.");

    if (topActivity) recs.push(`Your most frequent activity: ${topActivity}. Keep doing it regularly.`);
    else recs.push("No routine activities logged frequently. Try adding a short daily walk or activity.");

    return { recommendations: recs };
};
