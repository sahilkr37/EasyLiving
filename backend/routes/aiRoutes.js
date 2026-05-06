import express from "express";
import { chatWithAI, caretakerSummary } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/chat", protect, chatWithAI);
router.get("/caretaker-summary", protect, caretakerSummary);

export default router;