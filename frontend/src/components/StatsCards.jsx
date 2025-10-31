
export default function StatsCards({ stats, predictedMood, predictedExpense }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 py-2" >
            <div className="bg-green-50 p-5 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Avg Mood (7 days)</p>

                <div className="text-3xl font-semibold text-gray-900">
                    {stats ? Number(stats.avg_mood_7days).toFixed(1) : "—"}/5
                </div>

                {/* 🔹 Replace “Feeling balanced” with Predicted Mood */}
                <p className="text-xs text-gray-600 mt-1">
                    {predictedMood ? (
                        <>
                            Predicted Mood:{" "}
                            <span className="font-semibold text-blue-700">
                                {predictedMood}
                            </span>
                        </>
                    ) : (
                        "Feeling balanced"
                    )}
                </p>
            </div>

            {/* 💰 Expenses (7 days) */}
            <div className="bg-green-50 p-5 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Expenses (7 days)</p>
                <div className="text-3xl font-semibold text-gray-900">
                    ₹{stats ? Number(stats.total_expense_7days).toFixed(2) : "—"}

                </div>

                {/* 🔹 Add predicted expense here */}
                <p className="text-xs text-gray-600 mt-1">
                    {predictedExpense ? (
                        <>
                            Predicted 7-day Expense:{" "}
                            <span className="font-semibold text-blue-700">
                                ₹{Number(predictedExpense).toFixed(2)}
                            </span>
                        </>
                    ) : (
                        "On wellness activities"
                    )}
                </p>
            </div>


            <div className="bg-green-50 p-5 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Top Activity</p>
                <div className="text-2xl font-semibold text-gray-900">
                    {stats ? stats.top_activity_14days : "—"}
                </div>
                <p className="text-xs text-gray-600">Daily practice</p>
            </div>
        </section>
    );
}
