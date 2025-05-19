import express from 'express';
import { completeWorkout } from '../controllers/workoutController.js';
import authenticate from '../utils/authenticate.js';

const router = express.Router();

router.post('/workout/complete', authenticate, completeWorkout);

export default router;
