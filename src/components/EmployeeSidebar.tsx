import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FiGrid, FiUser, FiFileText, FiDollarSign, 
  FiRefreshCcw, FiLogOut
} from 'react-icons/fi';

const EmployeeSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/employee/dashboard' },
    { icon: <FiUser size={20} />, label: 'Your Details', path: '/employee/details' },
    { icon: <FiFileText size={20} />, label: 'Documents', path: '/employee/documents' },
    { icon: <FiDollarSign size={20} />, label: 'Paystubs', path: '/employee/paystubs' },
  ];

  const handleSwitchToAdmin = () => {
    navigate('/admin');
  };

  const handleSignOut = () => {
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
              <img 
                src="/logo1.png" 
                alt="GrowthPods" 
                className="w-full h-full"
                style={{ filter: 'brightness(0) saturate(100%) hue-rotate(100deg) brightness(1.2)' }}
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Navigation Menu */}
        <nav className={`flex-1 ${isHovered ? 'px-3' : 'px-2'} py-6 overflow-y-auto`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 mb-1 rounded-lg text-sm font-medium
                ${location.pathname === item.path
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-900 hover:bg-gray-100'}
                ${!isHovered ? 'justify-center' : ''}
              `}
            >
              <span className={isHovered ? 'mr-3' : ''}>{item.icon}</span>
              {isHovered && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className={`${isHovered ? 'px-3' : 'px-2'} py-4 border-t border-gray-200`}>
          <button
            onClick={handleSwitchToAdmin}
            className={`
              flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 
              hover:bg-gray-100 rounded-lg mb-2
              ${!isHovered ? 'justify-center' : ''}
            `}
          >
            <FiRefreshCcw className={isHovered ? 'mr-3' : ''} size={20} />
            {isHovered && 'Switch to Admin'}
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

export default EmployeeSidebar;
