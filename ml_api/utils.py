import numpy as np

def preprocess_mood_input(data):
    """
    Convert the input dictionary to numpy array for model prediction.
    """
    return np.array([[
        data.sleepHours,
        data.screenTimeHours,
        data.exerciseMinutes,
        data.caffeineMg
    ]])
def prepare_expense_input(payload: dict):
    """
    Return DataFrame with column used by model: avg7_total
    payload may contain 'avg7_total' or 'recent_expenses' (list).
    """
    if payload.get("avg7_total") is not None:
        avg7 = float(payload["avg7_total"])
    else:
        rec = payload.get("recent_expenses", [])
        if not rec:
            raise ValueError("Provide recent_expenses (list) or avg7_total (float).")
        rec = [float(x) for x in rec]
        avg7 = float(np.mean(rec))
    return pd.DataFrame({"avg7_total": [avg7]})