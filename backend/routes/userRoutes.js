import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ PUT /api/user/update-financial
// Update user's financial info for personalized expense predictions
router.put("/update-financial", protect, async (req, res) => {
  try {
    const { monthlyIncome, avgMonthlySpending } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.monthly_income = monthlyIncome;
    user.avg_monthly_spending = avgMonthlySpending;

    await user.save();

    res.json({
      message: "✅ Financial details updated successfully",
      user: {
        email: user.email,
        monthly_income: user.monthly_income,
        avg_monthly_spending: user.avg_monthly_spending,
      },
    });
  } catch (error) {
    console.error("❌ Error updating financial info:", error);
    res.status(500).json({ message: "Failed to update financial info" });
  }
});

export default router;
