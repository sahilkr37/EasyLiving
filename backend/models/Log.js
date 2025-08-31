// models/Log.js
const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
    type: { type: String, enum: ["mood", "expense", "routine"], required: true },
    date: { type: Date, required: true },
    score: { type: Number },        // mood score 1-5
    note: { type: String },
    amount: { type: Number },       // expense amount
    category: { type: String },     // expense category
    activity: { type: String },     // routine activity
    duration: { type: Number }      // routine duration in minutes
}, { timestamps: true });

module.exports = mongoose.model("Log", LogSchema);
