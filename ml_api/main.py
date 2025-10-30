from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from utils import prepare_expense_input
import numpy as np
import pandas as pd
from typing import List, Optional
from fastapi import HTTPException


# ==========================================
# 🌿 FastAPI Setup
# ==========================================
app = FastAPI(
    title="Mood Prediction API",
    version="1.0",
    description="Predicts user mood using numeric + text inputs (sleep, screen time, exercise, caffeine, and daily feeling)."
)

# Enable CORS so frontend/backend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:5173"] for security later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 🧠 Load Trained Mood Model
# ==========================================
MODEL_PATH = "models/final_mood_model.pkl"

try:
    mood_model = joblib.load(MODEL_PATH)
    print(f"✅ Mood model loaded successfully from: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    mood_model = None

# ---------------------------------------
# Load Expense model (train_exp_model.pkl)
# ---------------------------------------
EXP_MODEL_PATH = "models/train_exp_model.pkl"
try:
    exp_model = joblib.load(EXP_MODEL_PATH)
    print(f"✅ Expense model loaded successfully from: {EXP_MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading expense model: {e}")
    exp_model = None

# ==========================================
# 📦 Input Schema (Pydantic)
# ==========================================
class MoodInput(BaseModel):
    sleepHours: float
    screenTimeHours: float
    exerciseMinutes: float
    caffeineMg: float
    textInput: str

class ExpensePredictIn(BaseModel):
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
    return {"message": "🌿 Mood Prediction FastAPI is running successfully!"}


# ==========================================
# 🔮 Mood Prediction Endpoint
# ==========================================
@app.post("/predict/mood")
def predict_mood(data: MoodInput):
    """
    Accepts numeric + text input and returns the predicted mood label.
    """
    if mood_model is None:
        return {"error": "Model not loaded. Please check server logs."}

    try:
        # ✅ Match feature names to training-time names (snake_case)
        df = pd.DataFrame([{
            "sleep_hours": data.sleepHours,
            "screen_time": data.screenTimeHours,
            "exercise_minutes": data.exerciseMinutes,
            "caffeine_mg": data.caffeineMg,
            "text_input": data.textInput  # 👈 this matches your model
        }])

        # ✅ Predict mood
        prediction = mood_model.predict(df)[0]

        # Optional: include confidence score
        try:
            proba = mood_model.predict_proba(df)
            confidence = round(max(proba[0]) * 100, 2)
        except Exception:
            confidence = None

        mood = str(prediction).lower()
        if mood in ["happy", "positive", "joyful"]:
            recommendations = [
                "🎉 Keep doing what you love — positivity sustains well-being!",
                "💪 Stay active and share your good mood with others.",
                "🌿 Try journaling your positive thoughts daily."
            ]
        elif mood in ["neutral", "okay", "calm"]:
            recommendations = [
                "🌞 Keep balanced — maintain your sleep and exercise routine.",
                "📚 Try light reading or a mindful activity.",
                "☕ Stay consistent with caffeine and screen habits."
            ]
        elif mood in ["sad", "stressed", "anxious"]:
            recommendations = [
                "💖 Take a short walk outdoors or listen to calming music.",
                "📞 Talk to a friend or write your thoughts down.",
                "🧘 Try 10 minutes of meditation or slow breathing."
            ]
        else:
            recommendations = [
                "🌿 Keep tracking your habits — balance leads to clarity.",
                "💬 Reflect on your daily routine and small wins."
            ]

        return {
            "predicted_mood": str(prediction),
            "confidence": confidence,
            "recommendations": recommendations,
            "inputs": data.dict()
        }

    except Exception as e:
        print("❌ Prediction Error:", e)
        return {"error": f"Prediction failed: {e}"}


@app.post("/predict/expense")
def predict_expense(payload: ExpensePredictIn):
    """
    Predicts expenses based on user's recent spending + financial context (income & avg spending).
    """
    if exp_model is None:
        raise HTTPException(status_code=503, detail="Expense model not loaded on server.")

    try:
        days = int(payload.days or 7)
        monthly_income = float(payload.monthly_income or 0)
        avg_monthly_spending = float(payload.avg_monthly_spending or 0)

        # Prepare recent data
        recent = payload.recent_expenses or []
        if recent:
            recent = [float(x) for x in recent]
            while len(recent) < 7:
                recent.insert(0, recent[0])
        else:
            if payload.avg7_total is None:
                raise HTTPException(
                    status_code=400,
                    detail="Provide 'recent_expenses' (list) or 'avg7_total' (float)."
                )
            avg7 = float(payload.avg7_total)
            recent = [avg7] * 7

        # ⚙️ Personalization factor based on user’s income/spending
        income_factor = 1.0
        if monthly_income > 0:
            income_factor = (avg_monthly_spending / monthly_income) or 0.3  # spending ratio

        # Predict next N days with personalization
        preds = []
        for _ in range(days):
            avg_recent = float(np.mean(recent[-7:]))
            X = pd.DataFrame({"avg7_total": [avg_recent]})
            nxt = float(exp_model.predict(X)[0]) * (1 + income_factor * 0.1)
            preds.append(nxt)
            recent.append(nxt)

        predicted_cum = float(sum(preds))
        last7_cum = float(sum(payload.recent_expenses)) if payload.recent_expenses else None

        # 🧠 Recommendation logic (personalized)
        recommendation = "Spending stable."
        if last7_cum is not None:
            if predicted_cum > last7_cum * 1.1:
                if income_factor > 0.6:
                    recommendation = "⚠️ High spending predicted — try setting a weekly budget or track essentials."
                else:
                    recommendation = "📊 Spending may rise slightly — monitor non-essential categories."
            elif predicted_cum < last7_cum * 0.9:
                recommendation = "✅ Excellent control! You're projected to spend less than last week."
            else:
                recommendation = "📈 Spending trend looks stable."

        # 🧾 Include personalization info in response
        return {
            "predictions": preds,
            "predicted_cumulative": predicted_cum,
            "last7_cumulative": last7_cum,
            "income_factor": round(income_factor, 2),
            "recommendation": recommendation,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
