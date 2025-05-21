import { readData } from '../utils/storage.js';

export const getStats = (req, res) => {
  try {
    const email = req.user.email;
    const plans = readData('plans.json');
    const users = readData('users.json');
    const progress = readData('progress.json');

    const userPlan = plans.find(p => p.email === email);
    const user = users.find(u => u.email === email);
    const userProgress = progress.filter(p => p.email === email && p.type === 'workout');

    const workoutsCompleted = userProgress.length;
    const totalXpEarned = userProgress.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

    const nextWorkout = userPlan?.workouts?.find(w => !w.isCompleted);

    res.json({
      workoutsCompleted,
      totalXpEarned,
      streakDays: user?.streakCount || 0,
      nextWorkout: nextWorkout ? nextWorkout.title : null
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProgress = (req, res) => {
  try {
    const email = req.user.email;
    const progress = readData('progress.json');
    const userProgress = progress.filter(p => p.email === email);

    const workouts = userProgress.filter(p => p.type === 'workout');
    const rewards = userProgress.filter(p => p.type === 'reward');

    res.json({ workouts, rewards });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
