import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LevelBadge from './LevelBadge';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm py-2 px-4 flex items-center justify-between z-10">
      <div className="flex items-center md:hidden">
        <h1 className="text-lg font-semibold ml-2 text-primary-700">
          Gamify Gym
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {user && (
          <div className="flex items-center">
            <span className="mr-2 hidden md:inline text-sm text-gray-600">
              {user.xp} XP
            </span>
            <LevelBadge level={user.level} />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-1.5 text-gray-500 hover:text-primary-500 transition-colors rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-primary-500 transition-colors rounded-full">
          <Settings size={20} />
        </button>
        <div className="relative flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-medium">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2 hidden md:block">
            <button 
              onClick={logout}
              className="text-sm text-gray-600 hover:text-primary-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;