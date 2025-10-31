import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Expense from "../models/ExpenseLog.js";

const router = express.Router();

/**
 * 🧮 Route: GET /api/insights/user-expenses/last7
 * Fetch last 7 days of total expense (grouped by day) for logged-in user
 */
router.get("/user-expenses/last7", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Aggregate expenses by day for that user
    const expenses = await Expense.aggregate([
      { $match: { userId: userId } }, // ✅ corrected field name
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalExpense: { $sum: "$totalExpense" }, // ✅ we already store totalExpense in schema
        },
      },
      { $sort: { _id: -1 } }, // newest first
      { $limit: 7 },
    ]);

    // ✅ Convert MongoDB result into array sorted oldest → newest
    const dailyTotals = expenses.reverse();

    res.status(200).json({
      recent_expenses: dailyTotals.map((e) => ({
        date: e._id,
        totalExpense: e.totalExpense,
      })),
    });
  } catch (err) {
    console.error("Error fetching user expenses:", err);
    res.status(500).json({
      error: "Failed to fetch last 7 days of user expenses",
    });
  }
});

export default router;
