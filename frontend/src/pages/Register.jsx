import React, { useState } from "react";
import API from "../api/axiosConfig";

export default function Register() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post("/api/auth/register", {
                name, age, gender: 0, email, password
            });
            alert("Registration successful ✅ Please login.");
            window.location.href = "/login";
        } catch (err) {
            alert("Error registering ❌");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <form onSubmit={handleRegister} className="bg-white p-8 shadow rounded w-96">
                <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="border p-2 w-full mb-3 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    className="border p-2 w-full mb-3 rounded"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-4 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-[#1F7D53] text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
