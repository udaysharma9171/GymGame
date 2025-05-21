import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RewardItem from '../components/RewardItem';

const API_URL = 'http://localhost:5000/api';

interface Reward {
  id: number;
  title: string;
  description: string;
  xpCost: number;
  image: string;
}

const RewardShop: React.FC = () => {
  const { user, updateXP } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRewards(response.data);
    } catch (error) {
      console.error('Failed to fetch rewards', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseReward = async (rewardId: number) => {
    if (!user) return;
    
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    if (user.xp < reward.xpCost) {
      toast.error('Not enough XP to purchase this reward');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/reward`,
        { rewardId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local XP
      updateXP(-reward.xpCost);
      
      toast.success(`Successfully purchased ${reward.title}`);
    } catch (error) {
      toast.error('Failed to purchase reward');
    }
  };

  // Placeholder rewards for demonstration
  const demoRewards: Reward[] = [
    {
      id: 1,
      title: 'Premium Workout Pack',
      description: 'Unlock 5 exclusive high-intensity workouts',
      xpCost: 1000,
      image: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 2,
      title: 'Virtual Personal Trainer',
      description: 'One-on-one session with a fitness expert',
      xpCost: 2500,
      image: 'https://images.pexels.com/photos/4058411/pexels-photo-4058411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 3,
      title: 'Nutrition Guide',
      description: 'Custom meal plans to complement your workouts',
      xpCost: 1500,
      image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 4,
      title: 'Gold Profile Badge',
      description: 'Exclusive profile badge to show your dedication',
      xpCost: 500,
      image: 'https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 5,
      title: 'Meditation Pack',
      description: 'Access to premium guided meditation sessions',
      xpCost: 800,
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 6,
      title: 'Custom Workout Theme',
      description: 'Change the look and feel of your workout interface',
      xpCost: 600,
      image: 'https://images.pexels.com/photos/7676394/pexels-photo-7676394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 mb-3"></div>
          <p className="text-primary-700">Loading rewards...</p>
        </div>
      </div>
    );
  }

  // Use demo rewards when API returns empty
  const displayRewards = rewards.length > 0 ? rewards : demoRewards;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reward Shop</h1>
          <p className="text-gray-600 mt-1">Spend your hard-earned XP on rewards</p>
        </div>
        
        {user && (
          <div className="mt-4 sm:mt-0 bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Your XP:</span>
              <span className="ml-2 text-xl font-bold text-primary-600">{user.xp}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RewardItem
              title={reward.title}
              description={reward.description}
              xpCost={reward.xpCost}
              image={reward.image}
              userXp={user?.xp || 0}
              onPurchase={() => purchaseReward(reward.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RewardShop;