import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Expense from "../models/ExpenseLog.js";

const router = express.Router();

/**
 * 🧮 Route: GET /api/insights/user-expenses/last7
 * Fetch last 7 days of total expense (include 0s for missing days)
 */
router.get("/user-expenses/last7", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 🗓️ Calculate 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 🧾 Aggregate user’s expenses by day
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalExpense: { $sum: "$totalExpense" },
        },
      },
      { $sort: { _id: 1 } }, // oldest → newest
    ]);

    // 🧩 Ensure exactly 7 days of data (fill missing with 0)
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const match = expenses.find((e) => e._id === dateStr);
      result.push({
        date: dateStr,
        totalExpense: match ? match.totalExpense : 0,
      });
    }

    res.status(200).json({ recent_expenses: result });
  } catch (err) {
    console.error("❌ Error fetching last 7 days of expenses:", err);
    res.status(500).json({
      error: "Failed to fetch last 7 days of user expenses",
    });
  }
});

export default router;
