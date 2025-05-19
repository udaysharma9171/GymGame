import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  ShoppingBag, 
  BarChart, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/plan', icon: <Calendar size={20} />, label: 'Workout Plan' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
    { to: '/shop', icon: <ShoppingBag size={20} />, label: 'Reward Shop' },
    { to: '/progress', icon: <BarChart size={20} />, label: 'Progress' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-md z-20">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 3"/>
              <circle cx="16" cy="16" r="3" fill="white"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold ml-2 text-gray-800">
            Gamify Gym
          </h1>
        </div>
      </div>
      <nav className="flex-1 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="px-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 mb-1 rounded-lg text-gray-700 transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'hover:bg-gray-50'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;