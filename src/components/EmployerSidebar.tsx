import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiDollarSign, FiUsers, FiFileText, FiShield, 
  FiHelpCircle, FiSettings, FiBriefcase, FiBarChart2, 
  FiChevronUp, FiChevronDown, FiCalendar, FiRefreshCcw, FiLogOut
} from 'react-icons/fi';

const EmployerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTaxesExpanded, setIsTaxesExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleSwitchToEmployee = () => {
    navigate('/employee/dashboard');
  };

  const handleSignOut = () => {
    navigate('/');
  };

  const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: <FiDollarSign size={20} />, label: 'Payroll', path: '/employer/payroll' },
    { icon: <FiUsers size={20} />, label: 'Hiring and Onboarding', path: '/employer/hiring' },
    { icon: <FiUsers size={20} />, label: 'Team', path: '/employer/team' },
    { icon: <FiBriefcase size={20} />, label: 'Company', path: '/employer/company' },
    { icon: <FiFileText size={20} />, label: 'Documents', path: '/employer/documents' },
    { icon: <FiShield size={20} />, label: 'Benefits', path: '/employer/benefits' },
    {
      icon: <FiBarChart2 size={20} />,
      label: 'Taxes and Reports',
      path: '/employer/taxes',
      hasSubmenu: true,
      submenuItems: [
        { 
          icon: <FiCalendar size={20} />,
          label: 'Reports', 
          path: '/employer/taxes/reports' 
        }
      ]
    },
    { icon: <FiHelpCircle size={20} />, label: 'Help', path: '/employer/help' },
    { 
      icon: <FiSettings size={20} />, 
      label: 'Settings', 
      path: '/employer/settings' 
    },
  ];

  return (
    <>
      {/* Sidebar */}
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
            <h2 className="text-lg font-semibold text-gray-900">GrowthPods Demo</h2>
          ) : (
            <div className="w-8 h-8">
              <img src="/growth-pods-logo.svg" alt="GP" className="w-full h-full" />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Navigation Menu */}
        <nav className={`flex-1 ${isHovered ? 'px-3' : 'px-2'} py-6 overflow-y-auto`}>
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-3 py-2 mb-1 rounded-lg text-sm font-medium
                  ${location.pathname === item.path
                    ? 'bg-[#008080] text-white' 
                    : 'text-gray-900 hover:bg-gray-100'}
                  ${!isHovered ? 'justify-center' : ''}
                `}
                onClick={(e) => {
                  if (item.hasSubmenu) {
                    e.preventDefault();
                    setIsTaxesExpanded(!isTaxesExpanded);
                  }
                }}
              >
                <span className={isHovered ? 'mr-3' : ''}>{item.icon}</span>
                {isHovered && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.hasSubmenu && (
                      <span className="ml-auto">
                        {isTaxesExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </span>
                    )}
                  </>
                )}
              </Link>
              
              {/* Submenu items */}
              {isHovered && item.hasSubmenu && isTaxesExpanded && (
                <div className="mt-1 ml-6">
                  {item.submenuItems?.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium
                        ${location.pathname === subItem.path
                          ? 'bg-[#008080] text-white'
                          : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <span className="mr-3">{subItem.icon}</span>
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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

export default EmployerSidebar;

