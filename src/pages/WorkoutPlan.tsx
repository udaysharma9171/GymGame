import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WorkoutCard from '../components/WorkoutCard';

const API_URL = 'http://localhost:5000/api';

interface Exercise {
  name: string;
  reps: string;
}

interface WorkoutDay {
  day: string;
  title: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  exercises: Exercise[];
  isCompleted: boolean;
}

const WorkoutPlan: React.FC = () => {
  const { user, updateXP } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/plan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkoutPlan(response.data.plan || []);
    } catch (error) {
      console.error('Failed to fetch workout plan', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlan = async () => {
    if (!user?.height || !user?.weight || !user?.goal) {
      toast.error('Please complete your profile first');
      return;
    }

    setIsGenerating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/plan`,
        {
          height: user.height,
          weight: user.weight,
          goal: user.goal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkoutPlan(response.data.plan);
      toast.success('Workout plan generated successfully');
    } catch (error) {
      toast.error('Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const completeWorkout = async (index: number) => {
    try {
      const token = localStorage.getItem('token');
      const workout = workoutPlan[index];
      
      const response = await axios.post(
        `${API_URL}/workout/complete`,
        { workoutId: index, workoutTitle: workout.title },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state
      const updatedPlan = [...workoutPlan];
      updatedPlan[index] = { ...updatedPlan[index], isCompleted: true };
      setWorkoutPlan(updatedPlan);
      
      // Update XP in context
      updateXP(response.data.xpEarned);
      
      toast.success(`Workout completed! Earned ${response.data.xpEarned} XP`);
    } catch (error) {
      toast.error('Failed to complete workout');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 mb-3"></div>
          <p className="text-primary-700">Loading your plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Workout Plan</h1>
          <p className="text-gray-600 mt-1">Personalized 7-day training schedule</p>
        </div>
        
        <button
          onClick={generatePlan}
          disabled={isGenerating}
          className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isGenerating ? 'Generating...' : workoutPlan.length ? 'Regenerate Plan' : 'Generate Plan'}
        </button>
      </div>

      {workoutPlan.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlan.map((workout, index) => (
            <WorkoutCard
              key={index}
              title={workout.title}
              duration={workout.duration}
              intensity={workout.intensity}
              exercises={workout.exercises.map(e => `${e.name}: ${e.reps}`)}
              isCompleted={workout.isCompleted}
              onComplete={() => completeWorkout(index)}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-6 text-center"
        >
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
                <path d="M24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 3"/>
                <circle cx="16" cy="16" r="3" fill="#10B981"/>
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">No workout plan yet</h2>
          <p className="text-gray-600 mb-6">
            Generate a personalized 7-day workout plan based on your profile and goals
          </p>
          {(!user?.height || !user?.weight || !user?.goal) && (
            <p className="text-sm text-yellow-600 mb-4">
              Please complete your profile details first to generate a plan
            </p>
          )}
          <button
            onClick={generatePlan}
            disabled={isGenerating || !user?.height || !user?.weight || !user?.goal}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Plan...' : 'Generate Workout Plan'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default WorkoutPlan;