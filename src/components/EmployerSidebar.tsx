import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiShield,
  FiHelpCircle,
  FiSettings,
  FiBriefcase,
  FiBarChart2,
  FiChevronUp,
  FiChevronDown,
  FiCalendar
} from 'react-icons/fi';

const EmployerSidebar: React.FC = () => {
  const location = useLocation();
  const [isTaxesExpanded, setIsTaxesExpanded] = useState(true); // Set to true by default to show expanded state

  const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: <FiDollarSign size={20} />, label: 'Payroll', path: '/employer/payroll' },
    { 
      icon: <FiUsers size={20} />, 
      label: 'Hiring and Onboarding', 
      path: '/employer/hiring',
      highlight: true
    },
    { icon: <FiUsers size={20} />, label: 'Team', path: '/employer/team' },
    { icon: <FiBriefcase size={20} />, label: 'Company', path: '/employer/company' },
    { icon: <FiFileText size={20} />, label: 'Documents', path: '/employer/documents' },
    { icon: <FiShield size={20} />, label: 'Benefits', path: '/employer/benefits' },
    {
      icon: <FiBarChart2 size={20} />,
      label: 'Taxes and Re...',
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
    { icon: <FiSettings size={20} />, label: 'Settings', path: '/employer/settings' },
  ];

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-200 py-6">
      {/* Company Name */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900">GrowthPods Demo</h2>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-6" />

      {/* Navigation Menu */}
      <nav className="px-3">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link
              to={item.path}
              className={`
                flex items-center justify-between px-3 py-2 mb-1 rounded-lg text-sm font-medium
                ${(location.pathname === item.path || (item.hasSubmenu && location.pathname.startsWith(item.path)))
                  ? 'bg-[#008080] text-white' 
                  : 'text-gray-900 hover:bg-gray-100'}
                ${item.highlight ? 'bg-[#008080] text-white' : ''}
              `}
              onClick={(e) => {
                if (item.hasSubmenu) {
                  e.preventDefault();
                  setIsTaxesExpanded(!isTaxesExpanded);
                }
              }}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <span className="ml-2">
                  {isTaxesExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </span>
              )}
            </Link>
            
            {/* Submenu items */}
            {item.hasSubmenu && isTaxesExpanded && (
              <div className="mt-1">
                {item.submenuItems?.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium
                      bg-[#008080] text-white
                      mx-3
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

      {/* Bottom Divider */}
      <div className="h-px bg-gray-200 mt-6" />
    </div>
  );
};

export default EmployerSidebar;

