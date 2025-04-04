import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiRefreshCcw } from 'react-icons/fi';

const EmployerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/employer/dashboard' },
    { icon: '💰', label: 'Payroll', path: '/employer/payroll' },
    { icon: '👥', label: 'Hiring and Onboarding', path: '/employer/hiring' },
    { icon: '👥', label: 'Team', path: '/employer/team' },
    { icon: '🏢', label: 'Company', path: '/employer/company' },
    { icon: '📄', label: 'Documents', path: '/employer/documents' },
    { icon: '✨', label: 'Benefits', path: '/employer/benefits' },
    { icon: '📊', label: 'Taxes and Compliance', path: '/employer/taxes' },
  ];

  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleSwitchToEmployee = () => {
    navigate('/employee');
  };

  const handleSignOut = () => {
    // Add your sign out logic here
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <img src="/growth-pods-logo.svg" alt="Growth Pods" className="h-8 mb-2" />
          <div className="text-sm text-gray-500">Hire. Pay. Manage.</div>
        </div>
        
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500">GrowthPods Demo</h2>
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

      {/* Bottom section with Switch to Employee and Sign out buttons */}
      <div className="p-6 border-t">
        <button
          onClick={handleSwitchToEmployee}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 rounded-md mb-2"
        >
          <FiRefreshCcw className="mr-3" />
          Switch to Employee
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

export default EmployerSidebar;

