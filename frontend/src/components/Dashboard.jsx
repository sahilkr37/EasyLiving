import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import AddLogForm from "./AddLogForm";
import Recommendations from "./Recommendations";
import RecentLogs from "./RecentLogs";
import API from "../api/axiosConfig"; // ✅ Import centralized axios setup

export default function ElderlyWellnessDashboard() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    // Form states
    const [formType, setFormType] = useState("mood");
    const [moodScore, setMoodScore] = useState("");
    const [moodNote, setMoodNote] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [routineActivity, setRoutineActivity] = useState("");
    const [routineDuration, setRoutineDuration] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchLogs();
            fetchStats();
            fetchRecommendations();
        } else {
            console.warn("No token found — redirecting to login.");
            window.location.href = "/login";
        }
    }, []);


    // 🔹 FETCH ALL LOGS
    async function fetchLogs() {
        try {
            const [moods, expenses, activities] = await Promise.all([
                API.get("/api/logs/mood/all"),
                API.get("/api/logs/expense/all"),
                API.get("/api/logs/activity/all"),
            ]);

            const merged = [
                ...moods.data.logs.map((l) => ({ ...l, type: "Mood" })),
                ...expenses.data.logs.map((l) => ({ ...l, type: "Expense" })),
                ...activities.data.logs.map((l) => ({ ...l, type: "Activity" })),
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setLogs(merged);
        } catch (err) {
            console.error("❌ Error fetching logs:", err);
            alert("Failed to load logs. Please login again or check the server.");
        }
    }

    // 🔹 ADD NEW LOG
    async function addLog(e) {
        e.preventDefault();
        try {
            if (formType === "mood") {
                await API.post("/api/logs/mood/add", {
                    moodNote,
                    sleepHours: 7,
                    screenTimeHours: 5,
                    exerciseMinutes: 20,
                    caffeineMg: 100,
                });
            } else if (formType === "expense") {
                await API.post("/api/logs/expense/add", {
                    foodExpense: Number(expenseAmount) || 0,
                    medicalExpense: 0,
                    transportExpense: 0,
                    personalExpense: 0,
                });
            } else if (formType === "routine") {
                await API.post("/api/logs/activity/add", {
                    activityName: routineActivity,
                    durationMinutes: Number(routineDuration) || 0,
                    moodScore: Number(moodScore) || 3,
                    notes: moodNote || "",
                });
            }

            alert("✅ Log added successfully!");
            fetchLogs(); // refresh logs
            resetForm();
        } catch (err) {
            console.error("❌ Error adding log:", err);
            alert("Failed to add log. Please check inputs or login again.");
        }
    }

    // 🔹 REMOVE LOG (optional for future delete API)
    async function removeLog(id) {
        try {
            await API.delete(`/api/logs/${id}`);
            setLogs((prev) => prev.filter((l) => l._id !== id));
        } catch (err) {
            console.error("Error deleting log:", err);
        }
    }

    // 🔹 FETCH USER STATS (future ML or insights API)
    async function fetchStats() {
        try {
            const res = await API.get("/api/insights/weekly"); // placeholder
            setStats(res.data);
        } catch {
            setStats(null);
        }
    }

    // 🔹 FETCH RECOMMENDATIONS (future ML integration)
    async function fetchRecommendations() {
        try {
            const res = await API.get("/api/insights/recommendations"); // placeholder
            setRecommendations(res.data.recommendations || []);
        } catch {
            setRecommendations([]);
        }
    }

    // 🔹 RESET FORM AFTER SUBMISSION
    function resetForm() {
        setMoodScore("");
        setMoodNote("");
        setExpenseAmount("");
        setExpenseCategory("");
        setRoutineActivity("");
        setRoutineDuration("");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome back 👋
                    </h1>
                    <p className="text-gray-600">
                        A quick overview of your wellness journey.
                    </p>
                </header>

                <StatsCards stats={stats} />

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddLogForm
                        formType={formType}
                        setFormType={setFormType}
                        moodScore={moodScore}
                        setMoodScore={setMoodScore}
                        moodNote={moodNote}
                        setMoodNote={setMoodNote}
                        expenseAmount={expenseAmount}
                        setExpenseAmount={setExpenseAmount}
                        expenseCategory={expenseCategory}
                        setExpenseCategory={setExpenseCategory}
                        routineActivity={routineActivity}
                        setRoutineActivity={setRoutineActivity}
                        routineDuration={routineDuration}
                        setRoutineDuration={setRoutineDuration}
                        addLog={addLog}
                    />

                    <div className="space-y-6">
                        <Recommendations recommendations={recommendations} />
                        <RecentLogs logs={logs} removeLog={removeLog} />
                    </div>
                </section>
            </div>
        </div>
    );
}
