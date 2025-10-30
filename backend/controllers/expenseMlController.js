// backend/controllers/expenseMlController.js
import axios from "axios";

const FASTAPI_URL = "http://127.0.0.1:8000/predict/expense";

export const predictExpenseAndReturn = async (req, res) => {
  try {
    const { recent_expenses, avg7_total, days } = req.body;
    const payload = { recent_expenses: recent_expenses || null, avg7_total: avg7_total || null, days: days || 7 };

    const mlRes = await axios.post(FASTAPI_URL, payload);
    return res.status(200).json(mlRes.data);
  } catch (err) {
    console.error("Expense ML Error:", err.message || err);
    return res.status(500).json({ error: err.message || "Prediction error" });
  }
};
