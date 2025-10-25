import mongoose from "mongoose";

const expenseLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: { type: Date, default: Date.now },
    foodExpense: { type: Number, default: 0 },
    medicalExpense: { type: Number, default: 0 },
    transportExpense: { type: Number, default: 0 },
    personalExpense: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-calc total before saving
expenseLogSchema.pre("save", function (next) {
    this.totalExpense =
        (this.foodExpense || 0) +
        (this.medicalExpense || 0) +
        (this.transportExpense || 0) +
        (this.personalExpense || 0);
    next();
});

const ExpenseLog = mongoose.model("ExpenseLog", expenseLogSchema);
export default ExpenseLog;
