import express from 'express';
import { getRewards, purchaseReward } from '../controllers/rewardController.js';
import authenticate from '../utils/authenticate.js';

const router = express.Router();

router.get('/rewards', authenticate, getRewards);
router.post('/reward', authenticate, purchaseReward);

export default router;
