
export default function AddLogForm({
    formType, setFormType,
    moodScore, setMoodScore, moodNote, setMoodNote,
    expenseAmount, setExpenseAmount, expenseCategory, setExpenseCategory,
    routineActivity, setRoutineActivity, routineDuration, setRoutineDuration,
    addLog
}) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Add New Log Entry</h2>
            <hr className="mb-4 text-gray-300  " />
            <form onSubmit={addLog} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600">Log Type</label>
                    <select value={formType} onChange={e => setFormType(e.target.value)}
                        className="mt-1 p-2 border border-gray-300  rounded w-full cursor-pointer">
                        <option value="mood">Mood</option>
                        <option value="expense">Expense</option>
                        <option value="routine">Routine</option>
                    </select>
                </div>

                {formType === "mood" && (
                    <>
                        <div>
                            <label className="block text-sm text-gray-600">Score (1-5)</label>
                            <input type="number" min="1" max="5" value={moodScore} onChange={e => setMoodScore(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g. 4" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Notes / Details</label>
                            <textarea value={moodNote} onChange={e => setMoodNote(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g. Enjoyed a good book." />
                        </div>
                    </>
                )}

                {formType === "expense" && (
                    <>
                        <div>
                            <label className="block text-sm text-gray-600">Amount (₹)</label>
                            <input type="number" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)}
                                className="mt-1 p-2 border  rounded w-full" placeholder="e.g. 200" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Category</label>
                            <input type="text" value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g. Groceries" />
                        </div>
                    </>
                )}

                {formType === "routine" && (
                    <>
                        <div>
                            <label className="block text-sm text-gray-600">Activity</label>
                            <input type="text" value={routineActivity} onChange={e => setRoutineActivity(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g. Morning walk" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Duration (minutes)</label>
                            <input type="number" value={routineDuration} onChange={e => setRoutineDuration(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full" placeholder="e.g. 30" />
                        </div>
                    </>
                )}

                <button type="submit"
                    className="w-full bg-[#1F7D53] text-white py-2 rounded hover:bg-green-700 transition cursor-pointer">
                    Add Log
                </button>
            </form>
        </div>
    );
}
