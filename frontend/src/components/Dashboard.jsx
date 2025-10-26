import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import AddLogForm from "./AddLogForm";
import Recommendations from "./Recommendations";
import RecentLogs from "./RecentLogs";
import Navbar from "./Navbar";
import API from "../api/axiosConfig";

export default function ElderlyWellnessDashboard() {
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

    // 🔹 Expense log states
    const [foodExpense, setFoodExpense] = useState("");
    const [medicalExpense, setMedicalExpense] = useState("");
    const [transportExpense, setTransportExpense] = useState("");
    const [personalExpense, setPersonalExpense] = useState("");

    // 🔹 Activity log states
    const [activityName, setActivityName] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("");
    const [moodScore, setMoodScore] = useState("");

    // Check token
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

    // 🔹 Fetch all logs
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
            setRecommendations(res.data.recommendations || []);
        } catch {
            setRecommendations([]);
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
                await API.post("/api/logs/mood/add", {
                    moodNote,
                    sleepHours: Number(sleepHours),
                    screenTimeHours: Number(screenTime),
                    exerciseMinutes: Number(exerciseMinutes),
                    caffeineMg: Number(caffeineMg),
                });
            } else if (formType === "expense") {
                await API.post("/api/logs/expense/add", {
                    foodExpense: Number(foodExpense) || 0,
                    medicalExpense: Number(medicalExpense) || 0,
                    transportExpense: Number(transportExpense) || 0,
                    personalExpense: Number(personalExpense) || 0,
                });
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

                    <StatsCards stats={stats} />

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
                            <Recommendations recommendations={recommendations} />
                            <RecentLogs logs={logs} removeLog={removeLog} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
