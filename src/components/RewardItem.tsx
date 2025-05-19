import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface RewardItemProps {
  title: string;
  description: string;
  xpCost: number;
  image: string;
  userXp: number;
  onPurchase: () => void;
}

const RewardItem: React.FC<RewardItemProps> = ({
  title,
  description,
  xpCost,
  image,
  userXp,
  onPurchase,
}) => {
  const canAfford = userXp >= xpCost;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div 
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="h-full w-full bg-black bg-opacity-20 flex items-center justify-center">
          <Award size={64} className="text-white" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary-600">{xpCost} XP</span>
          <button
            onClick={onPurchase}
            disabled={!canAfford}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              canAfford
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Purchase' : 'Not enough XP'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RewardItem;