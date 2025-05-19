import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.height && user.weight) {
      setHeight(user.height.toString());
      setWeight(user.weight.toString());
      setGoal(user.goal || '');
      calculateBMI(user.height, user.weight);
    }
  }, [user]);

  const calculateBMI = (height: number, weight: number) => {
    if (height > 0 && weight > 0) {
      // Convert height from cm to meters if needed
      const heightInMeters = height > 3 ? height / 100 : height;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));

      // Set BMI category
      if (bmiValue < 18.5) setBmiCategory('Underweight');
      else if (bmiValue < 25) setBmiCategory('Normal');
      else if (bmiValue < 30) setBmiCategory('Overweight');
      else setBmiCategory('Obese');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!height || !weight || !goal) {
      toast.error('Please fill in all fields');
      return;
    }

    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);

    if (isNaN(heightValue) || isNaN(weightValue)) {
      toast.error('Height and weight must be valid numbers');
      return;
    }

    setIsLoading(true);

    try {
      await updateUser({
        height: heightValue,
        weight: weightValue,
        goal
      });
      
      calculateBMI(heightValue, weightValue);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-1">Update your details and goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (m)
                  </label>
                  <input
                    id="height"
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="2.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1.75"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter height in meters (e.g., 1.75)</p>
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="70"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter weight in kilograms (e.g., 70)</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Fitness Goal
                </label>
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a goal</option>
                  <option value="cutting">Cutting (Lose Weight)</option>
                  <option value="bulking">Bulking (Gain Muscle)</option>
                  <option value="maintaining">Maintaining (Stay Fit)</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </motion.div>
        </div>
        
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
            
            {bmi ? (
              <div>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">BMI</span>
                  <div className="mt-1 flex items-center">
                    <span className="text-3xl font-bold text-gray-900">{bmi}</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      bmiCategory === 'Normal' 
                        ? 'bg-green-100 text-green-800'
                        : bmiCategory === 'Underweight'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bmiCategory}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">BMI = weight(kg) / height(m)²</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fitness Info</h3>
                  {user?.goal && (
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-800 font-medium">Goal:</span>
                      <span className="ml-auto text-sm text-gray-600">
                        {user.goal.charAt(0).toUpperCase() + user.goal.slice(1)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-800 font-medium">Level:</span>
                    <span className="ml-auto text-sm text-gray-600">{user?.level || 1}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-800 font-medium">Current Streak:</span>
                    <span className="ml-auto text-sm text-gray-600">{user?.streakCount || 0} days</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Enter your height and weight to calculate BMI</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;