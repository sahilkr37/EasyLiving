import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import API from "../../api/axiosConfig";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function ExpenseTrendChart() {
    const [lineData, setLineData] = useState(null);
    const [pieData, setPieData] = useState(null);
    const [stackedData, setStackedData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExpenseTrends() {
            try {
                const res = await API.get("/api/insights/trends/expense");
                const data = res.data || {};
                const line = data.line_chart || [];
                const pie = data.pie_chart || {};
                const stacked = data.stacked_bar || [];

                // ✅ Line chart — total expense per day
                const lineChartData = {
                    labels: line.map((d) => d.date),
                    datasets: [
                        {
                            label: "Total Expense (₹)",
                            data: line.map((d) => Number(d.total || 0)),
                            borderColor: "#10b981",
                            backgroundColor: "rgba(16,185,129,0.3)",
                            tension: 0.3,
                            fill: true,
                            pointRadius: 5,
                        },
                    ],
                };

                // ✅ Pie chart — category-wise total
                const pieChartData = {
                    labels: ["Food", "Medical", "Transport", "Personal"],
                    datasets: [
                        {
                            data: [
                                pie.foodExpense || 0,
                                pie.medicalExpense || 0,
                                pie.transportExpense || 0,
                                pie.personalExpense || 0,
                            ],
                            backgroundColor: ["#f97316", "#22c55e", "#3b82f6", "#a855f7"],
                        },
                    ],
                };

                // ✅ Stacked bar — each day’s category total
                const stackedChartData = {
                    labels: stacked.map((d) => d.date),
                    datasets: [
                        {
                            label: "Food",
                            data: stacked.map((d) => d.foodExpense || 0),
                            backgroundColor: "#f97316",
                        },
                        {
                            label: "Medical",
                            data: stacked.map((d) => d.medicalExpense || 0),
                            backgroundColor: "#22c55e",
                        },
                        {
                            label: "Transport",
                            data: stacked.map((d) => d.transportExpense || 0),
                            backgroundColor: "#3b82f6",
                        },
                        {
                            label: "Personal",
                            data: stacked.map((d) => d.personalExpense || 0),
                            backgroundColor: "#a855f7",
                        },
                    ],
                };

                setLineData(lineChartData);
                setPieData(pieChartData);
                setStackedData(stackedChartData);
            } catch (err) {
                console.error("❌ Error fetching expense trends:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchExpenseTrends();
    }, []);

    if (loading) return <p className="text-gray-600 text-center">Loading expense trends...</p>;
    if (!lineData) return <p className="text-gray-600 text-center">No expense data available.</p>;

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
        },
        scales: {
            y: { title: { display: true, text: "₹ Amount" } },
            x: { title: { display: true, text: "Date" } },
        },
    };

    const stackedOptions = {
        ...options,
        plugins: { legend: { position: "bottom" } },
        scales: { x: { stacked: true }, y: { stacked: true } },
    };

    return (
        <div className="space-y-6">
            {/* 💰 Total Expense Line */}
            <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="font-semibold text-gray-700 mb-2">Total Expense Trend (Last 30 Days)</h3>
                <Line data={lineData} options={options} />
            </div>

            {/* 🍕 Category Pie */}
            <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="font-semibold text-gray-700 mb-2">Expense Distribution</h3>
                <Pie data={pieData} />
            </div>

            {/* 📊 Stacked Bar */}
            <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="font-semibold text-gray-700 mb-2">Daily Category Breakdown</h3>
                <Bar data={stackedData} options={stackedOptions} />
            </div>
        </div>
    );
}
