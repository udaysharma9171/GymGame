import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, Trophy, Activity, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LevelBadge from '../components/LevelBadge';

const API_URL = 'http://localhost:5000/api';

interface Stats {
  workoutsCompleted: number;
  streakDays: number;
  totalXpEarned: number;
  nextWorkout: {
    title: string;
    day: string;
  } | null;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    workoutsCompleted: 0,
    streakDays: 0,
    totalXpEarned: 0,
    nextWorkout: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 mb-3"></div>
          <p className="text-primary-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate XP to next level (simple formula: current level * 100)
  const xpForNextLevel = user ? user.level * 100 : 100;
  const xpProgress = user ? (user.xp % xpForNextLevel) / xpForNextLevel * 100 : 0;

  const statCards = [
    {
      title: 'Workouts Completed',
      value: stats.workoutsCompleted,
      icon: <Dumbbell size={20} className="text-primary-500" />,
      color: 'bg-primary-50',
    },
    {
      title: 'Current Streak',
      value: stats.streakDays,
      icon: <Activity size={20} className="text-secondary-500" />,
      color: 'bg-secondary-50',
    },
    {
      title: 'Total XP Earned',
      value: stats.totalXpEarned,
      icon: <Trophy size={20} className="text-accent-500" />,
      color: 'bg-accent-50',
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your fitness journey progress</p>
        </div>
        {user && (
          <div className="mt-4 md:mt-0 bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <LevelBadge level={user.level} />
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">
                    {user.xp % xpForNextLevel} / {xpForNextLevel} XP
                  </span>
                </div>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${card.color} rounded-lg p-4`}
          >
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-md bg-white mr-3">{card.icon}</div>
              <span className="text-sm font-medium text-gray-600">{card.title}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Next Workout</h2>
            <Link
              to="/plan"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
            >
              View Plan <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {stats.nextWorkout ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="p-2 bg-primary-100 rounded-md mr-3">
                  <Calendar size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{stats.nextWorkout.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{stats.nextWorkout.day}</p>
                  <Link
                    to="/plan"
                    className="mt-2 inline-block text-sm font-medium text-primary-500 hover:text-primary-600"
                  >
                    Start Workout
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">No upcoming workouts found</p>
              <Link
                to="/plan"
                className="mt-2 inline-block text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                Create Workout Plan
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Rewards</h2>
            <Link
              to="/shop"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
            >
              View Shop <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="text-center py-4">
            <div className="inline-block p-3 bg-accent-100 rounded-full mb-3">
              <Trophy size={28} className="text-accent-600" />
            </div>
            <h3 className="font-medium text-gray-900">Earn rewards with XP</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              Complete workouts to earn XP and unlock rewards
            </p>
            <Link
              to="/shop"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
            >
              Explore Rewards
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;