import React from "react";
import { Lightbulb } from "lucide-react"; // icon library

export default function Recommendations({ recommendations, expenseRecommendation, predictedMood  }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-1">Recommendations</h2>
            <p className="text-sm text-gray-600 mb-3">Insights for your well-being.</p>
            <hr className="mb-4 text-gray-300  " />

            {/* 🌿 Mood-Based Recommendations */}
            {recommendations.length > 0 && (
                <>
                    <p className="text-sm font-medium text-gray-800 mb-2">🧠 Mood Insights:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {recommendations.map((r, i) => (
                            <li key={i} className="flex items-start">
                                <Lightbulb className="h-4 w-4 text-green-500 mt-1 mr-2" />
                                <span>{r}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {/* 🔹 Dynamic Mood-Based Insights */}
            {predictedMood && (
                <div className="mt-4 bg-blue-50 border border-blue-300 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-800">
                        🧠 Mood Insight ({predictedMood}):
                    </p>
                    {predictedMood.toLowerCase().includes("happy") ||
                    predictedMood.toLowerCase().includes("neutral") ? (
                        <ul className="list-disc list-inside text-sm mt-2 text-blue-800">
                            <li>Keep maintaining your positive habits and regular routines.</li>
                            <li>Share your good energy — connect with friends or family.</li>
                            <li>Engage in creative or outdoor activities to sustain happiness.</li>
                        </ul>
                    ) : (
                        <ul className="list-disc list-inside text-sm mt-2 text-red-700">
                            <li>Take deep breaths and consider short relaxation breaks.</li>
                            <li>Go for a brief walk or stretch to reduce stress.</li>
                            <li>Try journaling or light music to improve your mood.</li>
                        </ul>
                    )}
                </div>
            )}

            {/* 🔹 Expense-based Recommendation Section */}
            {expenseRecommendation && (
                <div className="mt-4 bg-green-50 border border-green-300 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-800">💰 Expense Insight:</p>
                    <p
                        className={`text-sm mt-1 ${
                            expenseRecommendation.includes("⚠️")
                                ? "text-red-600"
                                : expenseRecommendation.includes("✅")
                                ? "text-green-600"
                                : "text-yellow-600"
                        }`}
                    >
                        {expenseRecommendation}
                    </p>
                </div>
            )}

        </div>
    );
}
