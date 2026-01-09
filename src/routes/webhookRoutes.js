import express from "express";
import { handleRealtimeUpdate } from "../controllers/webhookController.js";
import { httpAuthMiddleware } from "../middlewares/httpAuthMiddleware.js";

const router = express.Router();
router.post("/", httpAuthMiddleware, handleRealtimeUpdate);

export default router;
