import express from 'express';
import { getPlan, createPlan } from '../controllers/planController.js';
import authenticate from '../utils/authenticate.js';

const router = express.Router();

router.get('/plan', authenticate, getPlan);
router.post('/plan', authenticate, createPlan);

export default router;
