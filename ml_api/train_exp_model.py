import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
from sklearn.pipeline import Pipeline
import os

os.makedirs("models", exist_ok=True)

# 1️⃣ Load Your Own Dataset
# 👇 Replace this with your actual dataset filename or path
df = pd.read_csv("data/synthetic_expenses.csv")

# ✅ Make sure your CSV has at least these columns:
# date, food, medicine, transport, utilities, personal

# Convert date column to datetime (important)
df["date"] = pd.to_datetime(df["date"])

print("✅ Dataset loaded successfully!")
print(df.head())

# -----------------------------
# 2️⃣ Create Total Expense Column
# -----------------------------
df["total_expense"] = df[["food", "medicine", "transport", "utilities", "personal"]].sum(axis=1)

# -----------------------------
# 3️⃣ Create Features - Rolling Averages (7-day)
# -----------------------------
df["avg7_total"] = df["total_expense"].rolling(window=7).mean().shift(1)
df.dropna(inplace=True)

# -----------------------------
# 4️⃣ Train Model to Predict Next-Day Total Expense
# -----------------------------
X = df[["avg7_total"]]
y = df["total_expense"]

model = LinearRegression()
model.fit(X, y)

# -----------------------------
# 5️⃣ Predict Next 7 Days’ Expenses (Iterative Forecast)
# -----------------------------
predictions = []
recent_expenses = df["total_expense"].tail(7).tolist()

for day in range(7):
    avg_recent = np.mean(recent_expenses)
    next_pred = model.predict([[avg_recent]])[0]
    predictions.append(next_pred)
    # simulate rolling update
    recent_expenses.pop(0)
    recent_expenses.append(next_pred)

# -----------------------------
# 6️⃣ Compute Metrics
# -----------------------------
predicted_cum_sum = np.sum(predictions)
last7_cum_sum = df["total_expense"].tail(7).sum()
last7_avg_cum = last7_cum_sum / 7

print("\n--- 📊 Expense Summary ---")
print(f"Last 7 Days Total Expense: ₹{last7_cum_sum:.2f}")
print(f"Predicted Next 7 Days Total Expense: ₹{predicted_cum_sum:.2f}")
print(f"Average Daily Expense (Last 7 Days): ₹{last7_avg_cum:.2f}")

# -----------------------------
# 7️⃣ Recommendation Logic
# -----------------------------
print("\n--- 💡 Recommendation ---")
if predicted_cum_sum > last7_cum_sum * 1.1:
    print("⚠️ Your next 7 days' total spending is predicted to be significantly higher than last week.")
    print("💰 Consider cutting back on non-essential categories like food or personal spending.")
    print("💡 Review utilities and transport usage to save more this week.")
elif predicted_cum_sum < last7_cum_sum * 0.9:
    print("✅ Great job! Your spending is projected to decrease next week.")
    print("👏 Keep maintaining these good financial habits.")
else:
    print("📈 Your spending trend for the next week looks stable.")
    print("👌 Continue monitoring daily expenses to maintain balance.")


joblib.dump(model, "models/train_exp_model.pkl")
print("✅ Model saved at models/train_exp_model.pkl")
