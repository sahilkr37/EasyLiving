import React from "react";
import { Lightbulb } from "lucide-react"; // icon library

export default function Recommendations({ recommendations }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-1">Recommendations</h2>
            <p className="text-sm text-gray-600 mb-3">Insights for your well-being.</p>
            <hr className="mb-4 text-gray-300  " />

            <ul className="space-y-2 text-sm text-gray-700 ">
                {recommendations.length > 0 ? (
                    recommendations.map((r, i) => (
                        <li key={i} className="flex items-start">
                            <Lightbulb className="h-4 w-4 text-green-500 mt-1 mr-2" />
                            <span>{r}</span>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No recommendations available.</li>
                )}
            </ul>
        </div>
    );
}
