import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

// Custom Utilities
import { ensureDataFilesExist } from './utils/storage.js';

// Load env
dotenv.config();

// Ensure data directory and files are ready
ensureDataFilesExist();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', planRoutes);
app.use('/api', workoutRoutes);
app.use('/api', rewardRoutes);
app.use('/api', progressRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
