import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiDollarSign, FiUsers, FiFileText, FiShield, 
  FiHelpCircle, FiSettings, FiBriefcase, FiBarChart2, 
  FiChevronUp, FiChevronDown, FiCalendar, FiRefreshCcw, 
  FiLogOut, FiMenu, FiX, FiUserPlus
} from 'react-icons/fi';
import '../styles/Sidebar.css';

const EmployerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTaxesExpanded, setIsTaxesExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: <FiDollarSign size={20} />, label: 'Payroll', path: '/employer/payroll' },
    { icon: <FiUserPlus size={20} />, label: 'Hiring and Onboarding', path: '/employer/hiring' },
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
        { icon: <FiCalendar size={20} />, label: 'Tax Calendar', path: '/employer/taxes/calendar' },
        // ... other submenu items
      ]
    }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
          flex flex-col transition-all duration-300 ease-in-out
          ${isMobile 
            ? isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            : isHovered ? 'w-64' : 'w-16'
          }
          md:translate-x-0 md:sticky
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Company Logo */}
        <div className={`px-4 py-6 ${(isHovered || isMobile) ? 'px-6' : 'px-2'}`}>
          {(isHovered || isMobile) ? (
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-900">GrowthPods Demo</h2>
              <div className="text-sm text-gray-500">Hire. Pay. Manage.</div>
            </div>
          ) : (
            <div className="w-8 h-8">
              <img 
                src="/logo1.png" 
                alt="GrowthPods" 
                className="w-full h-full"
                style={{ filter: 'brightness(1) saturate(100%)' }}
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Navigation Menu */}
        <nav className={`flex-1 ${(isHovered || isMobile) ? 'px-3' : 'px-2'} py-6 overflow-y-auto`}>
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-3 py-2.5 mb-1 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${location.pathname === item.path
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'}
                  ${(!isHovered && !isMobile) ? 'justify-center' : ''}
                `}
                onClick={(e) => {
                  if (item.hasSubmenu) {
                    e.preventDefault();
                    setIsTaxesExpanded(!isTaxesExpanded);
                  }
                  if (isMobile) toggleMobileMenu();
                }}
              >
                <span className={`${(isHovered || isMobile) ? 'mr-3' : ''} transition-colors duration-200`}>
                  {item.icon}
                </span>
                {(isHovered || isMobile) && (
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

              {/* Submenu */}
              {item.hasSubmenu && isTaxesExpanded && (isHovered || isMobile) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenuItems?.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm
                        ${location.pathname === subItem.path
                          ? 'bg-teal-50 text-teal-600'
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                      onClick={isMobile ? toggleMobileMenu : undefined}
                    >
                      <span className="mr-2">{subItem.icon}</span>
                      <span className="truncate">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              navigate('/employee/dashboard');
              if (isMobile) toggleMobileMenu();
            }}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCcw className="mr-2" />
            {(isHovered || isMobile) && 'Switch to Employee'}
          </button>
        </div>
      </aside>

      {/* Spacer div to prevent content overlap */}
      <div className={`
        hidden md:block
        ${isHovered ? 'w-64' : 'w-16'}
        transition-all duration-300 ease-in-out
      `} />
    </>
  );
};

export default EmployerSidebar;

