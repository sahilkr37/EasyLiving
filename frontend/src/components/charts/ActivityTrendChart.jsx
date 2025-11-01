import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import API from "../../api/axiosConfig";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ActivityTrendChart() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        API.get("/api/insights/trends/activity")
            .then((res) => setActivities(res.data))
            .catch((err) => console.error("Error fetching activity trends:", err));
    }, []);

    const data = {
        labels: activities.map((d) => d.activity),
        datasets: [
            {
                label: "Frequency",
                data: activities.map((d) => d.count),
                backgroundColor: "#FACC15",
            },
        ],
    };

    return (
        <div className="bg-gray-50 p-4 rounded-xl shadow">
            <h3 className="font-semibold text-gray-700 mb-2">Activity Frequency (Last 14 Days)</h3>
            <Bar data={data} />
        </div>
    );
}
