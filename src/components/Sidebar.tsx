import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiSettings, FiHelpCircle,
  FiRefreshCcw, FiLogOut
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <FiUsers size={20} />, label: 'Users', path: '/admin/users' },
  ];

  const handleSwitchToEmployee = () => {
    navigate('/employee/dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCompany');
    navigate('/');
  };

  return (
    <>
      <div 
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-50 ${
          isHovered ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Company Logo */}
        <div className={`px-4 py-6 ${isHovered ? 'px-6' : 'px-2'}`}>
          {isHovered ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">GrowthPods Demo</h2>
              <div className="text-sm text-gray-500">Hire. Pay. Manage.</div>
            </div>
          ) : (
            <div className="w-8 h-8">
              <img src="/logo1.png" alt="GP" className="w-full h-full" />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Navigation Menu */}
        <nav className={`flex-1 ${isHovered ? 'px-3' : 'px-2'} py-6 overflow-y-auto`}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center w-full px-3 py-2 mb-1 rounded-lg text-sm font-medium
                ${location.pathname === item.path
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-900 hover:bg-gray-100'}
                ${!isHovered ? 'justify-center' : ''}
              `}
            >
              <span className={isHovered ? 'mr-3' : ''}>{item.icon}</span>
              {isHovered && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className={`${isHovered ? 'px-3' : 'px-2'} py-4 border-t border-gray-200`}>
          <button
            onClick={handleSwitchToEmployee}
            className={`
              flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 
              hover:bg-gray-100 rounded-lg mb-2
              ${!isHovered ? 'justify-center' : ''}
            `}
          >
            <FiRefreshCcw className={isHovered ? 'mr-3' : ''} size={20} />
            {isHovered && 'Switch to Employee'}
          </button>
          <button
            onClick={handleSignOut}
            className={`
              flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 
              hover:bg-gray-100 rounded-lg
              ${!isHovered ? 'justify-center' : ''}
            `}
          >
            <FiLogOut className={isHovered ? 'mr-3' : ''} size={20} />
            {isHovered && 'Sign out'}
          </button>
        </div>
      </div>

      {/* Main content margin */}
      <div className={`${isHovered ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;
