import express from 'express';
import { handleRealtimeUpdate } from '../controllers/webhookController.js';

const router = express.Router();
router.post('/', handleRealtimeUpdate);

export default router;