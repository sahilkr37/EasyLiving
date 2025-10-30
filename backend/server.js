import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import expenseMlRoutes from "./routes/expenseMlRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userExpenseRoutes from "./routes/userExpenseRoutes.js";




dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/ml", expenseMlRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/user", userRoutes);
app.use("/api/insights", userExpenseRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
