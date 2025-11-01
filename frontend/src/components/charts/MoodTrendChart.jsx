import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import API from "../../api/axiosConfig";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function MoodTrendChart() {
    const [chartData, setChartData] = useState(null);
    const [pieData, setPieData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMoodTrends() {
            try {
                const res = await API.get("/api/insights/trends/mood");
                const data = res.data || {};
                const line = data.line_chart || [];
                const pie = data.pie_chart || {};

                // ✅ Convert data safely
                const labels = line.map((d) => d.date);
                const values = line.map((d) => Number(d.mood_score || 0));

                const lineChartData = {
                    labels,
                    datasets: [
                        {
                            label: "Average Mood (per day)",
                            data: values,
                            borderColor: "#3b82f6",
                            backgroundColor: "rgba(59,130,246,0.2)",
                            tension: 0.3,
                            fill: true,
                            pointRadius: 5,
                        },
                    ],
                };

                const pieChartData = {
                    labels: ["Happy", "Neutral", "Sad", "Stressed"],
                    datasets: [
                        {
                            data: [
                                pie.happy || 0,
                                pie.neutral || 0,
                                pie.sad || 0,
                                pie.stressed || 0,
                            ],
                            backgroundColor: ["#22C55E", "#EAB308", "#3B82F6", "#EF4444"],
                        },
                    ],
                };

                setChartData(lineChartData);
                setPieData(pieChartData);
            } catch (err) {
                console.error("❌ Error fetching mood trends:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchMoodTrends();
    }, []);

    if (loading) return <p className="text-gray-600 text-center">Loading mood trends...</p>;
    if (!chartData) return <p className="text-gray-600 text-center">No mood data available.</p>;

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Mood Score: ${ctx.parsed.y}`,
                },
            },
        },
        scales: {
            y: { min: 0, max: 5, title: { display: true, text: "Mood Score (1–5)" } },
            x: { title: { display: true, text: "Date" } },
        },
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl shadow">
                <h3 className="font-semibold text-gray-700 mb-2">Mood Trend (Last 30 Days)</h3>
                <Line data={chartData} options={lineOptions} />
            </div>

            {pieData && (
                <div className="bg-gray-50 p-4 rounded-xl shadow">
                    <h3 className="font-semibold text-gray-700 mb-2">Mood Distribution</h3>
                    <Pie data={pieData} />
                </div>
            )}
        </div>
    );
}
