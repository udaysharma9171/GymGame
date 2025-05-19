import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, BarChart } from 'lucide-react';

interface WorkoutCardProps {
  title: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  exercises: string[];
  isCompleted?: boolean;
  onComplete?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  duration,
  intensity,
  exercises,
  isCompleted = false,
  onComplete,
}) => {
  const intensityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isCompleted ? 'border-l-4 border-success' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              intensityColors[intensity]
            }`}
          >
            {intensity}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock size={16} className="mr-1" />
          <span>{duration}</span>
          <BarChart size={16} className="ml-3 mr-1" />
          <span>
            {intensity === 'Low' && 'Beginner'}
            {intensity === 'Medium' && 'Intermediate'}
            {intensity === 'High' && 'Advanced'}
          </span>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {exercises.map((exercise, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{exercise}</span>
              </li>
            ))}
          </ul>
        </div>

        {!isCompleted ? (
          <button
            onClick={onComplete}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md py-2 transition-colors"
          >
            Complete Workout
          </button>
        ) : (
          <div className="flex items-center text-success font-medium">
            <CheckCircle size={18} className="mr-1" />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WorkoutCard;