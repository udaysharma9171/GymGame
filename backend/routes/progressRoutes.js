import express from 'express';
import { getStats, getProgress } from '../controllers/progressController.js';
import authenticate from '../utils/authenticate.js';

const router = express.Router();

router.get('/stats', authenticate, getStats);
router.get('/progress', authenticate, getProgress);

export default router;
