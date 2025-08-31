import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import AddLogForm from "./AddLogForm";
import Recommendations from "./Recommendations";
import RecentLogs from "./RecentLogs";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ElderlyWellnessDashboard() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    // form states
    const [formType, setFormType] = useState("mood");
    const [moodScore, setMoodScore] = useState("");
    const [moodNote, setMoodNote] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [routineActivity, setRoutineActivity] = useState("");
    const [routineDuration, setRoutineDuration] = useState("");

    useEffect(() => {
        fetchLogs();
        fetchStats();
        fetchRecommendations();
    }, []);

    async function fetchLogs() {
        try {
            const res = await fetch(`${API_BASE}/api/logs`);
            const data = await res.json();
            setLogs(data.map(l => ({ ...l, id: l._id })));
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchStats() {
        try {
            const res = await fetch(`${API_BASE}/api/stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchRecommendations() {
        try {
            const res = await fetch(`${API_BASE}/api/recommendations`);
            const data = await res.json();
            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error(err);
        }
    }

    async function addLog(e) {
        e.preventDefault();
        const today = new Date().toISOString().split("T")[0];
        let newLog = { type: formType, date: today };

        if (formType === "mood") {
            newLog.score = Number(moodScore);
            newLog.note = moodNote;
        } else if (formType === "expense") {
            newLog.amount = Number(expenseAmount || 0);
            newLog.category = expenseCategory || "Other";
        } else if (formType === "routine") {
            newLog.activity = routineActivity || "Unknown";
            newLog.duration = Number(routineDuration || 0);
        }

        try {
            const res = await fetch(`${API_BASE}/api/logs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLog),
            });
            const saved = await res.json();
            setLogs(prev => [{ ...saved, id: saved._id }, ...prev]);
            fetchStats();
            fetchRecommendations();
        } catch (err) {
            console.error("Error adding log:", err);
        }

        setMoodScore(""); setMoodNote(""); setExpenseAmount(""); setExpenseCategory(""); setRoutineActivity(""); setRoutineDuration("");
    }

    async function removeLog(id) {
        try {
            await fetch(`${API_BASE}/api/logs/${id}`, { method: "DELETE" });
            setLogs(prev => prev.filter(l => l.id !== id));
            fetchStats();
            fetchRecommendations();
        } catch (err) {
            console.error("Error deleting log:", err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
                    <p className="text-gray-600">A quick overview of your wellness journey.</p>
                </header>

                <StatsCards stats={stats} />

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddLogForm
                        formType={formType} setFormType={setFormType}
                        moodScore={moodScore} setMoodScore={setMoodScore}
                        moodNote={moodNote} setMoodNote={setMoodNote}
                        expenseAmount={expenseAmount} setExpenseAmount={setExpenseAmount}
                        expenseCategory={expenseCategory} setExpenseCategory={setExpenseCategory}
                        routineActivity={routineActivity} setRoutineActivity={setRoutineActivity}
                        routineDuration={routineDuration} setRoutineDuration={setRoutineDuration}
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
