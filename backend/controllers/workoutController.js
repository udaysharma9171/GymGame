import { readData, writeData } from '../utils/storage.js';

export const completeWorkout = (req, res) => {
  try {
    const { workoutId, workoutTitle } = req.body;
    const plans = readData('plans.json');
    const users = readData('users.json');
    const progress = readData('progress.json');

    const userEmail = req.user.email;
    const userPlan = plans.find(p => p.email === userEmail);
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (!userPlan || userIndex === -1) {
      return res.status(404).json({ error: 'User or plan not found' });
    }

    if (userPlan.workouts[workoutId]) {
      userPlan.workouts[workoutId].isCompleted = true;
      writeData('plans.json', plans);
    }

    const baseXp = 50;
    const bonusXp = Math.floor(Math.random() * 70);
    const xpEarned = baseXp + bonusXp;

    const today = new Date().toISOString().split('T')[0];
    const lastWorkout = users[userIndex].lastWorkoutDate;
    let newStreak = users[userIndex].streakCount;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!lastWorkout) {
      newStreak = 1;
    } else if (lastWorkout === today) {
      // No change
    } else if (lastWorkout === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    let newXp = users[userIndex].xp + xpEarned;
    let newLevel = users[userIndex].level;
    if (newXp >= newLevel * 100) newLevel++;

    users[userIndex] = {
      ...users[userIndex],
      xp: newXp,
      level: newLevel,
      streakCount: newStreak,
      lastWorkoutDate: today,
    };

    writeData('users.json', users);

    progress.push({
      email: userEmail,
      type: 'workout',
      title: workoutTitle,
      date: today,
      xpEarned,
    });

    writeData('progress.json', progress);

    res.json({
      xpEarned,
      newTotalXp: newXp,
      level: newLevel,
      streak: newStreak,
    });
  } catch (error) {
    console.error('Workout complete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
