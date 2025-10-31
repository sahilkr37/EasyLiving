import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import AddLogForm from "./AddLogForm";
import Recommendations from "./Recommendations";
import RecentLogs from "./RecentLogs";
import Navbar from "./Navbar";
import API from "../api/axiosConfig";

export default function ElderlyWellnessDashboard() {
    const userId = localStorage.getItem("userId");
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    // 🔹 Global form control
    const [formType, setFormType] = useState("mood");

    // 🔹 Mood log states
    const [sleepHours, setSleepHours] = useState("");
    const [screenTime, setScreenTime] = useState("");
    const [exerciseMinutes, setExerciseMinutes] = useState("");
    const [caffeineMg, setCaffeineMg] = useState("");
    const [moodNote, setMoodNote] = useState("");
    const [predictedMood, setPredictedMood] = useState(null);

    // 🔹 Expense log states
    const [foodExpense, setFoodExpense] = useState("");
    const [medicalExpense, setMedicalExpense] = useState("");
    const [transportExpense, setTransportExpense] = useState("");
    const [personalExpense, setPersonalExpense] = useState("");
    const [predictedExpense, setPredictedExpense] = useState(null);
    const [expenseRecommendation, setExpenseRecommendation] = useState("");



    // 🔹 Activity log states
    const [activityName, setActivityName] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("");
    const [moodScore, setMoodScore] = useState("");

    // Check token
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (token) {
            fetchLogs();
            fetchStats();
            fetchRecommendations();
        } else {
            console.warn("No token found — redirecting to login.");
            window.location.href = "/login";
        }
    }, []);

    async function fetchLogs() {
        try {
            const res = await API.get("/api/logs/all");
            setLogs(res.data.logs);
        } catch (err) {
            console.error("❌ Error fetching logs:", err);
        }
    }

    // 🔹 Remove a log
    async function removeLog(id) {
        try {
            await API.delete(`/api/logs/${id}`);
            setLogs((prev) => prev.filter((l) => l._id !== id));
        } catch (err) {
            console.error("Error deleting log:", err);
        }
    }

    // 🔹 Fetch stats (placeholder for ML insights)
    async function fetchStats() {
        try {
            const res = await API.get("/api/insights/weekly");
            setStats(res.data);
        } catch {
            setStats(null);
        }
    }

    // 🔹 Fetch recommendations (placeholder for ML)
    async function fetchRecommendations() {
        try {
            const res = await API.get("/api/insights/recommendations");
            const baseRecs = res.data.recommendations || [];

            // Add expense insight if available
            const combined = expenseRecommendation
                ? [...baseRecs, expenseRecommendation]
                : baseRecs;

            setRecommendations(combined);
        } catch {
            setRecommendations(expenseRecommendation ? [expenseRecommendation] : []);
        }
    }


    // 🔹 Reset form fields
    function resetForm() {
        setSleepHours("");
        setScreenTime("");
        setExerciseMinutes("");
        setCaffeineMg("");
        setMoodNote("");

        setFoodExpense("");
        setMedicalExpense("");
        setTransportExpense("");
        setPersonalExpense("");

        setActivityName("");
        setDurationMinutes("");
        setMoodScore("");
    }

    // 🔹 Add new log
    async function addLog(e) {
        e.preventDefault();
        try {
            if (formType === "mood") {
                // 🚨 Validate fields before sending to backend
                if (!sleepHours || !screenTime || !exerciseMinutes || !caffeineMg) {
                    alert("Please fill all mood input fields before submitting.");
                    return;
                }

                // 🧠 Send clean payload to FastAPI
                const res = await API.post("/api/ml/predict/mood", {
                    sleepHours: parseFloat(sleepHours),
                    screenTimeHours: parseFloat(screenTime),
                    exerciseMinutes: parseFloat(exerciseMinutes),
                    caffeineMg: parseFloat(caffeineMg),
                    textInput: moodNote || "neutral",
                });

                const predicted = res.data.predicted_mood || "Unknown";
                setPredictedMood(predicted);

                // 🌿 Handle mood recommendations from backend (if any)
                if (res.data.recommendations && res.data.recommendations.length > 0) {
                    setRecommendations((prev) => [
                        ...prev,
                        ...res.data.recommendations,
                    ]);
                }

                alert(`✅ Mood log added! Predicted mood: ${predicted}`);
            } else if (formType === "expense") {
                const expenseData = {
                    foodExpense: Number(foodExpense) || 0,
                    medicalExpense: Number(medicalExpense) || 0,
                    transportExpense: Number(transportExpense) || 0,
                    personalExpense: Number(personalExpense) || 0,
                };

                // Save expense log to DB
                await API.post("/api/logs/expense/add", expenseData);
                await new Promise((r) => setTimeout(r, 800));

                const historyRes = await API.get("/api/insights/user-expenses/last7");
                const last7Expenses = historyRes.data.recent_expenses || [];
                const expenseValues = last7Expenses.map((e) =>
                    typeof e === "object" ? e.totalExpense : e
                );

                const avg7_total =
                    expenseValues.length > 0
                        ? expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length
                        : 0;

                console.log("📤 Sending to FastAPI:", {
                    user_id: userId,
                    recent_expenses: expenseValues,
                    avg7_total,
                });


                // ✅ Send clean payload to ML model
                if (expenseValues.length > 0) {
                    const res = await API.post("/api/ml/predict/expense", {
                        user_id: userId,
                        recent_expenses: expenseValues,
                        avg7_total,
                        days: 7,
                    });

                    const predicted = res.data.predicted_cumulative || 0;
                    setPredictedExpense(predicted);
                    setExpenseRecommendation(res.data.recommendation || "");

                    alert(`✅ Expense log added! Predicted 7-day total: ₹${predicted.toFixed(2)}`);
                } else {
                    alert("✅ Expense log added! Not enough history for prediction yet.");
                }
                await fetchStats();
                await fetchLogs();

            } else if (formType === "activity") {
                await API.post("/api/logs/activity/add", {
                    activityName,
                    durationMinutes: Number(durationMinutes),
                    moodScore: Number(moodScore),
                    notes: moodNote || "",
                });
            }

            alert("✅ Log added successfully!");
            fetchLogs();
            resetForm();
        } catch (err) {
            console.error("❌ Error adding log:", err);
            alert("Failed to add log. Please check your inputs.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 px-6 pb-10">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome back 👋
                        </h1>
                        <p className="text-gray-600">
                            A quick overview of your wellness journey.
                        </p>
                    </header>

                    <StatsCards
                        stats={stats}
                        predictedMood={predictedMood}
                        predictedExpense={predictedExpense}

                    />


                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <AddLogForm
                            formType={formType}
                            setFormType={setFormType}

                            // Mood
                            sleepHours={sleepHours}
                            setSleepHours={setSleepHours}
                            screenTime={screenTime}
                            setScreenTime={setScreenTime}
                            exerciseMinutes={exerciseMinutes}
                            setExerciseMinutes={setExerciseMinutes}
                            caffeineMg={caffeineMg}
                            setCaffeineMg={setCaffeineMg}
                            moodNote={moodNote}
                            setMoodNote={setMoodNote}

                            // Expense
                            foodExpense={foodExpense}
                            setFoodExpense={setFoodExpense}
                            medicalExpense={medicalExpense}
                            setMedicalExpense={setMedicalExpense}
                            transportExpense={transportExpense}
                            setTransportExpense={setTransportExpense}
                            personalExpense={personalExpense}
                            setPersonalExpense={setPersonalExpense}

                            // Activity
                            activityName={activityName}
                            setActivityName={setActivityName}
                            durationMinutes={durationMinutes}
                            setDurationMinutes={setDurationMinutes}
                            moodScore={moodScore}
                            setMoodScore={setMoodScore}

                            addLog={addLog}
                        />

                        <div className="space-y-6">
                            <Recommendations
                                recommendations={recommendations}
                                expenseRecommendation={expenseRecommendation}
                                predictedMood={predictedMood}
                            />
                            <RecentLogs logs={logs} removeLog={removeLog} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}