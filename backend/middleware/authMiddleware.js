import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    try {
        // ✅ Check if Authorization header exists and starts with 'Bearer'
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Extract token (after "Bearer ")
            token = req.headers.authorization.split(" ")[1];

            // ✅ Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ✅ Fetch user (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }

            // ✅ Continue to next route handler
            next();
        } else {
            return res.status(401).json({ message: "No token, authorization denied" });
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        console.log("🧩 Token received:", token);
        console.log("🔑 JWT_SECRET used:", process.env.JWT_SECRET);

        return res.status(401).json({
            message: "Token is invalid or expired",
            error: error.message,
        });
    }
};
