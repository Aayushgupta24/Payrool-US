import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiDollarSign, FiUsers, FiFileText, 
  FiSettings, FiHelpCircle, FiBriefcase,
  FiShield, FiCreditCard, FiActivity
} from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: FiDollarSign, label: 'Payroll', path: '/employer/payroll' },
    { icon: FiUsers, label: 'Team', path: '/employer/team' },
    { icon: FiBriefcase, label: 'Hiring', path: '/employer/hiring' },
    { icon: FiFileText, label: 'Documents', path: '/employer/documents' },
    { icon: FiShield, label: 'Benefits', path: '/employer/benefits' },
    { icon: FiCreditCard, label: 'Taxes', path: '/employer/taxes' },
    { icon: FiActivity, label: 'Company', path: '/employer/company' },
    { icon: FiSettings, label: 'Settings', path: '/employer/settings' },
    { icon: FiHelpCircle, label: 'Help', path: '/employer/help' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <img 
            src="/logo.svg" 
            alt="GrowthPods Logo" 
            className="h-8 w-auto"
          />
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${
                  isActive ? 'text-teal-700' : 'text-gray-400'
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
