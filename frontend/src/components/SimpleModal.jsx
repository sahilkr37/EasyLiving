import React from "react";

export default function SimpleModal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
                <div className="overflow-y-auto max-h-[70vh]">{children}</div>
            </div>
        </div>
    );
}
