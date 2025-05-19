import React from 'react';
import { motion } from 'framer-motion';

interface LevelBadgeProps {
  level: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
  return (
    <motion.div 
      className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary-500 text-white text-xs font-semibold"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      Level {level}
    </motion.div>
  );
};

export default LevelBadge;