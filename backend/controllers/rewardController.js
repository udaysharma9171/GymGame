import { readData, writeData } from '../utils/storage.js';

const rewardList = [
  { id: 1, title: 'Premium Workout Pack', xpCost: 1000 },
  { id: 2, title: 'Virtual Personal Trainer', xpCost: 2500 },
  { id: 3, title: 'Nutrition Guide', xpCost: 1500 },
  { id: 4, title: 'Gold Profile Badge', xpCost: 500 },
  { id: 5, title: 'Meditation Pack', xpCost: 800 },
  { id: 6, title: 'Custom Workout Theme', xpCost: 600 },
];

export const getRewards = (req, res) => {
  res.json(rewardList);
};

export const purchaseReward = (req, res) => {
  try {
    const { rewardId } = req.body;
    const reward = rewardList.find(r => r.id === rewardId);

    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    const users = readData('users.json');
    const userIndex = users.findIndex(u => u.email === req.user.email);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    if (users[userIndex].xp < reward.xpCost) {
      return res.status(400).json({ error: 'Not enough XP' });
    }

    users[userIndex].xp -= reward.xpCost;
    if (reward.id === 4) {
      users[userIndex].badges.push('Gold Badge');
    }

    writeData('users.json', users);

    const progress = readData('progress.json');
    progress.push({
      email: req.user.email,
      type: 'reward',
      title: reward.title,
      date: new Date().toISOString().split('T')[0],
      xpCost: reward.xpCost,
    });
    writeData('progress.json', progress);

    res.json({
      success: true,
      remainingXp: users[userIndex].xp,
      reward: reward.title,
    });
  } catch (error) {
    console.error('Purchase reward error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
