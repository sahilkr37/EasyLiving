import express from "express";

import { triggerSOS, getActiveSOS, resolveSOS } from "../controllers/sosController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/trigger", protect, triggerSOS);
router.get("/active", protect, getActiveSOS);
router.put("/resolve/:sosId", protect, resolveSOS);

export default router;