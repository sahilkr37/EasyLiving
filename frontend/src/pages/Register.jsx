import React, { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: 0,
        daily_screen_time_hours: "",
        sleep_hours: "",
        daily_caffeine_mg: "",
        exercise_time_per_day_minutes: "",
        feelings_logging_frequency: 1,
        low_mood_response: 0,
        monthly_income: "",
        major_expense_category: 0,
        avg_monthly_expense_level: "",
        overspend_frequency: 1,
        forget_to_log_frequency: 1,
        total_screen_time_hours: "",
        family_member_count: "",
        email: "",
        password: "",
        emergency_contact: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = [
            "gender",
            "feelings_logging_frequency",
            "low_mood_response",
            "major_expense_category",
            "overspend_frequency",
            "forget_to_log_frequency",
        ];
        setFormData({
            ...formData,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });
    };

    const cleanData = () => {
        const safe = { ...formData };
        [
            "age",
            "daily_screen_time_hours",
            "sleep_hours",
            "daily_caffeine_mg",
            "exercise_time_per_day_minutes",
            "monthly_income",
            "avg_monthly_expense_level",
            "total_screen_time_hours",
            "family_member_count",
        ].forEach((f) => {
            safe[f] = safe[f] ? Number(safe[f]) : 0;
        });
        Object.keys(safe).forEach((k) => {
            if (safe[k] === "") safe[k] = "N/A";
        });
        return safe;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = cleanData();

        try {
            const res = await API.post("/api/auth/register", payload);
            alert("✅ Registered successfully! Please login.");
            navigate("/login");
        } catch (err) {
            console.error("❌ Registration Error:", err.response?.data || err.message);
            alert("❌ Invalid inputs — please check console logs for more details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex justify-center items-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-semibold text-center text-green-700 mb-2">
                    Create Your Wellness Profile 🌿
                </h2>
                <p className="text-center text-gray-500 mb-8 text-sm">
                    Please provide your lifestyle and financial details. Each field includes an example.
                </p>

                <form onSubmit={handleRegister} className="space-y-8">
                    {/* 👤 Personal Info */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            👤 Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    placeholder="e.g., Sahil Kumar"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Age
                                </label>
                                <input
                                    name="age"
                                    type="number"
                                    placeholder="e.g., 65"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                >
                                    <option value={0}>Male</option>
                                    <option value={1}>Female</option>
                                    <option value={2}>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Family Members
                                </label>
                                <input
                                    name="family_member_count"
                                    type="number"
                                    placeholder="e.g., 2"
                                    value={formData.family_member_count}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* 🕒 Lifestyle */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            🕒 Lifestyle Habits
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Sleep Hours (per day)", name: "sleep_hours", placeholder: "e.g., 7" },
                                { label: "Exercise (minutes per day)", name: "exercise_time_per_day_minutes", placeholder: "e.g., 30" },
                                { label: "Screen Time (hours per day)", name: "daily_screen_time_hours", placeholder: "e.g., 2" },
                                { label: "Caffeine Intake (mg/day)", name: "daily_caffeine_mg", placeholder: "e.g., 100" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                    <input
                                        name={field.name}
                                        type="number"
                                        placeholder={field.placeholder}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 💭 Mood */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            💭 Emotional & Behavioral Patterns
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Feelings Logging Frequency
                                </label>
                                <select
                                    name="feelings_logging_frequency"
                                    value={formData.feelings_logging_frequency}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                >
                                    <option value={0}>Daily</option>
                                    <option value={1}>Weekly</option>
                                    <option value={2}>Rarely</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Response to Low Mood
                                </label>
                                <select
                                    name="low_mood_response"
                                    value={formData.low_mood_response}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                >
                                    <option value={0}>Talk to someone</option>
                                    <option value={1}>Go for a walk</option>
                                    <option value={2}>Listen to music</option>
                                    <option value={3}>Meditate or pray</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Overspend Frequency
                                </label>
                                <select
                                    name="overspend_frequency"
                                    value={formData.overspend_frequency}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                >
                                    <option value={0}>Never</option>
                                    <option value={1}>Sometimes</option>
                                    <option value={2}>Often</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Forget to Log Frequency
                                </label>
                                <select
                                    name="forget_to_log_frequency"
                                    value={formData.forget_to_log_frequency}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                >
                                    <option value={0}>Never</option>
                                    <option value={1}>Sometimes</option>
                                    <option value={2}>Often</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 💰 Financial */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            💰 Financial Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
                                <input
                                    name="monthly_income"
                                    type="number"
                                    placeholder="e.g., 25000"
                                    value={formData.monthly_income}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Average Expense (₹)</label>
                                <input
                                    name="avg_monthly_expense_level"
                                    type="number"
                                    placeholder="e.g., 18000"
                                    value={formData.avg_monthly_expense_level}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Major Expense Category</label>
                                <select
                                    name="major_expense_category"
                                    value={formData.major_expense_category}
                                    onChange={handleChange}
                                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                >
                                    <option value={0}>Medical</option>
                                    <option value={1}>Grocery</option>
                                    <option value={2}>Transport</option>
                                    <option value={3}>Utilities</option>
                                    <option value={4}>Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* 📞 Contact */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                            📞 Contact & Account Info
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "Emergency Contact", name: "emergency_contact", placeholder: "e.g., +91 9876543210" },
                                { label: "Email", name: "email", placeholder: "e.g., sahil@example.com" },
                                { label: "Password", name: "password", placeholder: "Min 6 characters", type: "password" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                    <input
                                        name={field.name}
                                        type={field.type || "text"}
                                        placeholder={field.placeholder}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required={field.name !== "emergency_contact"}
                                        className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-green-600 hover:underline font-medium"
                    >
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
}
