from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from bson import ObjectId

# ==========================================
# 🌿 FastAPI Setup
# ==========================================
app = FastAPI(
    title="EasyLiving ML API",
    version="1.0",
    description="Predicts user mood and expenses intelligently."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🧠 MongoDB Setup
# ==========================================
client = MongoClient("mongodb+srv://sahilkr37:chOqGAyTtoS1yjWh@cluster0.mmu9o5k.mongodb.net/EasyLiving")
db = client["EasyLiving"]

# ==========================================
# 🧠 Load Models
# ==========================================
try:
    mood_model = joblib.load("models/final_mood_model.pkl")
    print("✅ Mood model loaded")
except Exception as e:
    print("❌ Mood model load error:", e)
    mood_model = None

try:
    exp_model = joblib.load("models/train_exp_model.pkl")
    print("✅ Expense model loaded")
except Exception as e:
    print("❌ Expense model load error:", e)
    exp_model = None


# ==========================================
# 📦 Schemas
# ==========================================
class MoodInput(BaseModel):
    sleepHours: float
    screenTimeHours: float
    exerciseMinutes: float
    caffeineMg: float
    textInput: str


class ExpensePredictIn(BaseModel):
    user_id: Optional[str] = None
    recent_expenses: Optional[List[float]] = None
    avg7_total: Optional[float] = None
    days: int = 7
    monthly_income: Optional[float] = 0
    avg_monthly_spending: Optional[float] = 0


# ==========================================
# 🌍 Root Route
# ==========================================
@app.get("/")
def home():
    return {"message": "🌿 EasyLiving FastAPI backend is running successfully!"}


# ==========================================
# 🔮 Mood Prediction
# ==========================================
@app.post("/predict/mood")
def predict_mood(data: MoodInput):
    if mood_model is None:
        raise HTTPException(status_code=503, detail="Mood model not loaded")

    try:
        df = pd.DataFrame([{
            "sleep_hours": data.sleepHours,
            "screen_time": data.screenTimeHours,
            "exercise_minutes": data.exerciseMinutes,
            "caffeine_mg": data.caffeineMg,
            "text_input": data.textInput
        }])

        prediction = mood_model.predict(df)[0]
        mood = str(prediction).lower()

        if mood in ["happy", "positive", "joyful"]:
            recs = [
                "🎉 Keep doing what makes you happy!",
                "💪 Stay active and share positivity with others.",
                "🌿 Journal your positive thoughts daily."
            ]
        elif mood in ["neutral", "okay", "calm"]:
            recs = [
                "🌞 Keep a steady routine of sleep and exercise.",
                "📚 Try mindfulness or a hobby you enjoy.",
                "☕ Watch caffeine and screen time balance."
            ]
        else:
            recs = [
                "💖 Go for a relaxing walk or call a friend.",
                "🧘 Try 10 mins of meditation or slow breathing.",
                "🌿 Track habits regularly — small steps matter."
            ]

        return {"predicted_mood": mood, "recommendations": recs}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


# ==========================================
# 💰 Expense Prediction
# ==========================================
@app.post("/predict/expense")
def predict_expense(payload: ExpensePredictIn):
    if exp_model is None:
        raise HTTPException(status_code=503, detail="Expense model not loaded")

    try:
        # 🧠 Validate user
        if not payload.user_id:
            raise HTTPException(status_code=400, detail="User ID required")
        user = db.users.find_one({"_id": ObjectId(payload.user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 🕓 Fetch recent logs
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        logs = list(db.expenselogs.find({
            "userId": ObjectId(payload.user_id),
            "$or": [{"createdAt": {"$gte": seven_days_ago}}, {"date": {"$gte": seven_days_ago}}]
        }))

        # 🧩 Category totals
        category_sums = {
            "food": sum(l.get("foodExpense", 0) for l in logs),
            "transport": sum(l.get("transportExpense", 0) for l in logs),
            "personal": sum(l.get("personalExpense", 0) for l in logs),
            "medical": sum(l.get("medicalExpense", 0) for l in logs)
        }

        # Overspend detection
        daily_totals = [l.get("totalExpense", 0) for l in logs]
        avg_daily = np.mean(daily_totals) if daily_totals else 0
        overspend_days = sum(1 for v in daily_totals if v > avg_daily * 1.2)
        overspend_ratio = (overspend_days / len(daily_totals)) if daily_totals else 0

        overspend_freq = (
            "always" if overspend_ratio > 0.6 else
            "often" if overspend_ratio > 0.3 else
            "sometimes" if overspend_ratio > 0.1 else
            "rarely"
        )

        # Missing log frequency
        dates = sorted([
            (l.get("createdAt") if isinstance(l.get("createdAt"), datetime)
             else datetime.fromisoformat(str(l.get("createdAt"))))
            for l in logs if "createdAt" in l
        ])
        avg_gap = np.mean([(dates[i] - dates[i - 1]).days for i in range(1, len(dates))]) if len(dates) >= 2 else 0
        forget_log_freq = (
            "often" if avg_gap > 5 else
            "sometimes" if avg_gap > 2 else
            "never"
        )

        # Income data
        monthly_income = float(user.get("monthly_income", 25000))
        avg_monthly_spending = float(user.get("avg_monthly_expense", 18000))

        # Prepare input
        days = payload.days or 7
        recent = [float(x) for x in (payload.recent_expenses or [])]
        while len(recent) < 7:
            recent.insert(0, recent[0] if recent else 0)
        avg7_total = float(payload.avg7_total or np.mean(recent))

        # Predict future
        preds = []
        income_factor = max(0.2, min(avg_monthly_spending / monthly_income, 1.0))
        for _ in range(days):
            avg_recent = np.mean(recent[-7:])
            nxt = float(exp_model.predict(pd.DataFrame({"avg7_total": [avg_recent]}))[0])
            nxt *= 1 + (income_factor - 0.5) * 0.05
            preds.append(nxt)
            recent.append(nxt)

        predicted_cum = float(sum(preds))
        max_weekly_limit = max(avg_monthly_spending * 0.3, monthly_income * 0.25)
        predicted_cum = min(predicted_cum, max_weekly_limit)

        last7_cum = sum(payload.recent_expenses) if payload.recent_expenses else None

        # =======================================
        # 🧩 Realistic Recommendation Logic
        # =======================================
        recs = []

        # Trend analysis
        if last7_cum:
            if predicted_cum > last7_cum * 1.15:
                recs.append("⚠️ Expenses may rise next week — tighten control on optional purchases.")
            elif predicted_cum < last7_cum * 0.9:
                recs.append("✅ Spending trend improving! Projected lower than last week.")
            else:
                recs.append("📈 Spending trend stable — nice consistency.")

        # Category insights
        avg_per_cat = {c: category_sums[c] / 7 for c in category_sums}
        overspent = [c for c in avg_per_cat if avg_per_cat[c] > np.mean(list(avg_per_cat.values())) * 1.2]

        if overspent:
            for cat in overspent:
                if cat == "food":
                    recs.append("🍔 Food costs increased — consider reducing takeout and cooking at home.")
                elif cat == "transport":
                    recs.append("🚗 Transport costs high — plan routes or use shared rides.")
                elif cat == "personal":
                    recs.append("🛍️ Personal expenses rose — review discretionary purchases.")
                elif cat == "medical":
                    recs.append("💊 Medical spending high — check recurring purchases or consult doctor.")
        else:
            recs.append("📊 Spending balanced across categories this week.")

        # Income vs spending
        spend_ratio = avg_monthly_spending / monthly_income if monthly_income else 0
        if spend_ratio >= 0.9:
            recs.append("🚨 You’re spending nearly all your income — aim to cut 10–15% this month.")
        elif spend_ratio >= 0.7:
            recs.append("💡 Spending close to 70% of income — automate some savings weekly.")
        else:
            recs.append("🎯 Healthy spending habits — continue saving consistently.")

        # Logging habits
        if forget_log_freq == "never":
            recs.append("🕓 Excellent logging consistency — predictions remain accurate!")
        elif forget_log_freq == "sometimes":
            recs.append("📅 Missed a few days — try logging every evening.")
        else:
            recs.append("🕑 Frequent missing logs — set a reminder to record expenses daily.")

        # Overspend habits
        if overspend_freq in ["often", "always"]:
            recs.append("⚠️ You’re overspending frequently — try a category budget alert.")
        else:
            recs.append("💰 Good financial control! Keep monitoring weekly trends.")

        # Smart goal suggestion
        suggested_saving = max(500, monthly_income * 0.05)
        recs.append(f"💡 Try saving around ₹{int(suggested_saving)} this week to stay on track for monthly goals.")

        return {
            "predictions": preds,
            "predicted_cumulative": predicted_cum,
            "last7_cumulative": last7_cum,
            "income_factor": round(income_factor, 2),
            "recommendation": recs
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# 🚀 Run App
# ==========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
