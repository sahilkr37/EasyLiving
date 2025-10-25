import React, { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // ✅ React Router hook

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            alert("Login successful ✅");
            navigate("/dashboard"); // ✅ Redirect after login
        } catch (err) {
            console.error(err);
            alert("Invalid credentials ❌");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow rounded w-96">
                <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
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
                    className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
