import React from "react";

export default function AddLogForm({
    formType, setFormType,
    moodScore, setMoodScore,
    moodNote, setMoodNote,
    expenseAmount, setExpenseAmount,
    expenseCategory, setExpenseCategory,
    routineActivity, setRoutineActivity,
    routineDuration, setRoutineDuration,
    addLog
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-2">Add New Log</h2>
            <p className="text-sm text-gray-500 mb-4">Track your daily wellness activities.</p>

            <form onSubmit={addLog} className="space-y-4">
                {/* Select Log Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Log Type
                    </label>
                    <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="mood">Mood Log</option>
                        <option value="expense">Expense Log</option>
                        <option value="routine">Activity Log</option>
                    </select>
                </div>

                {/* Conditional Fields */}
                {formType === "mood" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sleep Hours
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                placeholder="e.g., 7"
                                className="border rounded-md p-2 w-full"
                                onChange={(e) => setMoodScore(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Caffeine Intake (mg)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="e.g., 100"
                                className="border rounded-md p-2 w-full"
                                onChange={(e) => setExpenseAmount(e.target.value)} // repurposing for simplicity
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mood Note
                            </label>
                            <textarea
                                rows="3"
                                value={moodNote}
                                onChange={(e) => setMoodNote(e.target.value)}
                                placeholder="Write how you felt today..."
                                className="border rounded-md p-2 w-full"
                            />
                        </div>
                    </>
                )}

                {formType === "expense" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expense Category
                            </label>
                            <select
                                value={expenseCategory}
                                onChange={(e) => setExpenseCategory(e.target.value)}
                                className="border rounded-md p-2 w-full"
                            >
                                <option value="">Select Category</option>
                                <option value="food">Food</option>
                                <option value="medical">Medical</option>
                                <option value="transport">Transport</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expense Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                placeholder="e.g., 120"
                                className="border rounded-md p-2 w-full"
                                required
                            />
                        </div>
                    </>
                )}

                {formType === "routine" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Activity Name
                            </label>
                            <input
                                type="text"
                                value={routineActivity}
                                onChange={(e) => setRoutineActivity(e.target.value)}
                                placeholder="e.g., Evening Walk"
                                className="border rounded-md p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={routineDuration}
                                onChange={(e) => setRoutineDuration(e.target.value)}
                                placeholder="e.g., 30"
                                className="border rounded-md p-2 w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mood Score (1–5)
                            </label>
                            <input
                                type="number"
                                value={moodScore}
                                onChange={(e) => setMoodScore(e.target.value)}
                                min="1"
                                max="5"
                                className="border rounded-md p-2 w-full"
                                required
                            />
                        </div>
                    </>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700 transition"
                >
                    Add Log
                </button>
            </form>
        </div>
    );
}
