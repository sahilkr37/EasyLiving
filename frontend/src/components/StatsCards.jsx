export default function StatsCards({
    stats,
    predictedMood,
    onOpenMoodTrend,
    onOpenExpenseTrend,
    onOpenActivityTrend,
}) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-2">
            {/* 🧠 Mood Card */}
            <div className="bg-green-50 p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500">Avg Mood (7 days)</p>
                    <div className="text-3xl font-semibold text-gray-900">
                        {stats ? Number(stats.avg_mood_7days).toFixed(1) : "—"}/5
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Overall Mood:{" "}
                        <span className="font-semibold text-blue-700">
                            {stats?.overall_mood_label || "—"}
                        </span>
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                        {predictedMood ? (
                            <>
                                Predicted Mood:{" "}
                                <span className="font-semibold text-blue-700">{predictedMood}</span>
                            </>
                        ) : (
                            "Feeling balanced"
                        )}
                    </p>
                </div>

                <button
                    onClick={onOpenMoodTrend}
                    className="mt-4 w-full py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    View Mood Trend
                </button>
            </div>

            {/* 💰 Expenses Card */}
            <div className="bg-green-50 p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500">Expenses (7 days)</p>
                    <div className="text-3xl font-semibold text-gray-900">
                        ₹{stats ? Number(stats.total_expense_7days).toFixed(2) : "—"}
                    </div>

                    <p className="text-xs text-gray-600 mt-1">On wellness activities</p>
                </div>

                <button
                    onClick={onOpenExpenseTrend}
                    className="mt-4 w-full py-1.5 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                >
                    View Expense Trend
                </button>
            </div>

            {/* 🏃‍♀️ Activity Card */}
            <div className="bg-green-50 p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500">Top Activity</p>
                    <div className="text-2xl font-semibold text-gray-900">
                        {stats ? stats.top_activity_14days : "—"}
                    </div>
                    <p className="text-xs text-gray-600">Daily practice</p>
                </div>

                <button
                    onClick={onOpenActivityTrend}
                    className="mt-4 w-full py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                    View Activity Trend
                </button>
            </div>
        </section>
    );
}
