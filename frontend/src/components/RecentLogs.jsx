import { Trash2 } from 'lucide-react';

export default function RecentLogs({ logs, removeLog }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2 ">Recent Logs</h2>
            <hr className="mb-4 text-gray-300  " />
            <div className="space-y-2 max-h-56 overflow-auto">
                {logs.length > 0 ? logs.map((l, i) => (
                    <div key={l._id || l.id || i} className="flex justify-between items-center p-3 bg-green-50 rounded">
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {l.type.charAt(0).toUpperCase() + l.type.slice(1)} — {new Date(l.date).toISOString().split("T")[0]}
                            </div>
                            <div className="text-xs text-gray-600">
                                {l.type === "mood" && `Score ${l.score} — ${l.note || ""}`}
                                {l.type === "expense" && `₹${l.amount} — ${l.category} ${l.note ? `— ${l.note}` : ""}`}
                                {l.type === "routine" && `${l.activity} — ${l.duration} min`}
                            </div>
                        </div>
                        <button onClick={() => removeLog(l.id)} className="text-xs text-red-600 cursor-pointer"><Trash2 /></button>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500">No logs yet.</p>
                )}
            </div>
        </div>
    );
}