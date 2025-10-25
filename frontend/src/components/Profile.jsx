import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Navbar from "./Navbar";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const labelMappings = {
        gender: ["Male", "Female", "Other"],
        feelings_logging_frequency: ["Daily", "Weekly", "Rarely"],
        low_mood_response: ["Talk to someone", "Go for a walk", "Listen to music", "Meditate"],
        major_expense_category: ["Medical", "Grocery", "Transport", "Utilities", "Other"],
        overspend_frequency: ["Never", "Sometimes", "Often"],
        forget_to_log_frequency: ["Never", "Sometimes", "Often"],
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/api/auth/profile");
                setUser(res.data.user);
            } catch (err) {
                console.error("❌ Error loading profile:", err);
                alert("Session expired. Please login again.");
                window.location.href = "/login";
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Unable to load profile.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto pt-24 px-6 pb-10">
                <h1 className="text-3xl font-semibold text-green-700 mb-8">👤 My Profile</h1>

                {/* Basic Info */}
                <div className="bg-white shadow rounded-2xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileItem label="Full Name" value={user.name} />
                        <ProfileItem label="Age" value={user.age} />
                        <ProfileItem label="Gender" value={labelMappings.gender[user.gender]} />
                        <ProfileItem label="Family Members" value={user.family_member_count} />
                        <ProfileItem label="Email" value={user.email} />
                        <ProfileItem label="Emergency Contact" value={user.emergency_contact || "Not added"} />
                    </div>
                </div>

                {/* Lifestyle Info */}
                <div className="bg-white shadow rounded-2xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        Lifestyle & Habits
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileItem label="Sleep Hours (per day)" value={user.sleep_hours} />
                        <ProfileItem label="Exercise (minutes per day)" value={user.exercise_time_per_day_minutes} />
                        <ProfileItem label="Screen Time (hours per day)" value={user.daily_screen_time_hours} />
                        <ProfileItem label="Caffeine Intake (mg/day)" value={user.daily_caffeine_mg} />
                        <ProfileItem
                            label="Mood Logging Frequency"
                            value={labelMappings.feelings_logging_frequency[user.feelings_logging_frequency]}
                        />
                        <ProfileItem
                            label="Low Mood Response"
                            value={labelMappings.low_mood_response[user.low_mood_response]}
                        />
                    </div>
                </div>

                {/* Financial Info */}
                <div className="bg-white shadow rounded-2xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        Financial Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileItem label="Monthly Income (₹)" value={user.monthly_income} />
                        <ProfileItem label="Average Monthly Expense (₹)" value={user.avg_monthly_expense_level} />
                        <ProfileItem
                            label="Major Expense Category"
                            value={labelMappings.major_expense_category[user.major_expense_category]}
                        />
                        <ProfileItem
                            label="Overspend Frequency"
                            value={labelMappings.overspend_frequency[user.overspend_frequency]}
                        />
                        <ProfileItem
                            label="Forget to Log Frequency"
                            value={labelMappings.forget_to_log_frequency[user.forget_to_log_frequency]}
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6">
                    <h3 className="text-lg font-semibold text-green-700 mb-3">
                        🌱 Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                        This data helps your wellness system understand your lifestyle,
                        spending patterns, and emotional balance. It will be used to
                        personalize recommendations and wellness insights.
                    </p>
                </div>
            </div>
        </div>
    );
}

// 🔹 Reusable Component for each profile field
function ProfileItem({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value || "N/A"}</p>
        </div>
    );
}
