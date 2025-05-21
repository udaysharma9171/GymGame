import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProgressChart from '../components/ProgressChart';
import AchievementBadge from '../components/AchievementBadge';
import { Award, Flame, Dumbbell, Calendar, Target, Zap } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface ProgressData {
  workouts: {
    date: string;
    title: string;
    xpEarned: number;
  }[];
  rewards: {
    date: string;
    title: string;
    xpCost: number;
  }[];
}

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgressData(response.data);
    } catch (error) {
      console.error('Failed to fetch progress data', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for when API returns empty
  const mockProgressData: ProgressData = {
    workouts: [
      { date: '2023-06-01', title: 'Full Body Workout', xpEarned: 100 },
      { date: '2023-06-03', title: 'Upper Body Focus', xpEarned: 90 },
      { date: '2023-06-05', title: 'Core Strength', xpEarned: 80 },
      { date: '2023-06-07', title: 'Cardio Blast', xpEarned: 110 },
      { date: '2023-06-09', title: 'Lower Body Burn', xpEarned: 95 },
    ],
    rewards: [
      { date: '2023-06-02', title: 'Gold Profile Badge', xpCost: 500 },
      { date: '2023-06-08', title: 'Nutrition Guide', xpCost: 1500 },
    ],
  };

  // Define achievements
  const achievements = [
    {
      title: 'First Workout',
      description: 'Completed your first workout',
      icon: <Dumbbell size={24} />,
      isUnlocked: true, // Assuming this is true by default or has other logic
    },
    {
      title: '3-Day Streak',
      description: 'Worked out for 3 consecutive days',
      icon: <Flame size={24} />,
      // Provide a default of 0 if user or streakCount is undefined
      isUnlocked: (user?.streakCount || 0) >= 3,
    },
    {
      title: '7-Day Streak',
      description: 'Worked out for 7 consecutive days',
      icon: <Flame size={24} />,
      // Provide a default of 0 if user or streakCount is undefined
      isUnlocked: (user?.streakCount || 0) >= 7,
    },
    {
      title: 'Level 5 Reached',
      description: 'Reached level 5 in your fitness journey',
      icon: <Target size={24} />,
      // Provide a default of 0 if user or level is undefined
      isUnlocked: (user?.level || 0) >= 5,
    },
    {
      title: '10 Workouts',
      description: 'Completed 10 workout sessions',
      icon: <Calendar size={24} />,
      isUnlocked: (progressData?.workouts.length || 0) >= 10,
    },
    {
      title: 'First Reward',
      description: 'Purchased your first reward item',
      icon: <Award size={24} />,
      isUnlocked: (progressData?.rewards.length || 0) >= 1,
    },
  ];

  const data = progressData || mockProgressData;

  // Prepare chart data - last 7 workouts XP
  const chartData = data.workouts.slice(-7).map(workout => workout.xpEarned);
  const chartLabels = data.workouts.slice(-7).map(workout => {
    const date = new Date(workout.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 mb-3"></div>
          <p className="text-primary-700">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-600 mt-1">Track your fitness achievements and history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4">XP Earned</h2>
          <div className="h-64">
            <ProgressChart data={chartData} labels={chartLabels} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Fitness Stats</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <Dumbbell size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Workouts Completed</p>
                <p className="text-xl font-semibold">{data.workouts.length}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                <Flame size={20} className="text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-xl font-semibold">{user?.streakCount || 0} days</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mr-3">
                <Zap size={20} className="text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-xl font-semibold">{user?.xp || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Award size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rewards Claimed</p>
                <p className="text-xl font-semibold">{data.rewards.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6 bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={index}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              isUnlocked={achievement.isUnlocked}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-6 bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {[...data.workouts, ...data.rewards]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((activity, index) => {
              const isWorkout = 'xpEarned' in activity;
              const date = new Date(activity.date);
              const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              
              return (
                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    isWorkout ? 'bg-primary-100 text-primary-600' : 'bg-accent-100 text-accent-600'
                  }`}>
                    {isWorkout ? <Dumbbell size={16} /> : <Award size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {isWorkout ? (
                      <span className="text-green-600">+{activity.xpEarned} XP</span>
                    ) : (
                      <span className="text-red-600">-{activity.xpCost} XP</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;