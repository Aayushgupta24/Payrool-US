import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiRefreshCcw, FiLogOut } from 'react-icons/fi';

const EmployeeSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/employee/dashboard' },
    { icon: '👤', label: 'Your Details', path: '/employee/details' },
    { icon: '📄', label: 'Documents', path: '/employee/documents' },
    { icon: '💰', label: 'Paystubs', path: '/employee/paystubs' },
  ];

  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleSwitchToAdmin = () => {
    navigate('/admin');
  };

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      {/* Main content */}
      <div className="p-6 flex-1">
        <div className="mb-8">
          <img src="/growth-pods-logo.svg" alt="Growth Pods" className="h-8 mb-2" />
          <div className="text-sm text-gray-500">Hire. Pay. Manage.</div>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isPathActive(item.path)
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom section with Switch to Admin and Sign out */}
      <div className="p-6 border-t space-y-2">
        <button
          onClick={handleSwitchToAdmin}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-md"
        >
          <FiRefreshCcw className="mr-3" />
          Switch to Admin
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-md"
        >
          <FiLogOut className="mr-3" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;


