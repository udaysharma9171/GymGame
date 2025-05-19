import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  isUnlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  icon = <Award size={24} />,
  isUnlocked,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex items-center p-3 rounded-lg ${
        isUnlocked
          ? 'bg-white shadow-md'
          : 'bg-gray-100 opacity-70 cursor-default'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
          isUnlocked ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
          {title}
        </h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {isUnlocked && (
        <div className="ml-auto">
          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;