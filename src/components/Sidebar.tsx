import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiLogOut } from 'react-icons/fi';
import '../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FiGrid size={20} />,
      path: '/admin',
    },
    {
      title: 'Users',
      icon: <FiUsers size={20} />,
      path: '/admin/users',
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/logo.svg" alt="Growth Pods" className="h-8" />
          <span className="logo-text">Growth Pods</span>
          <span className="logo-tagline">Hire. Pay. Manage.</span>
        </div>
      </div>

      <div className="menu-divider" />

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button 
            key={item.path}
            className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon-container">{item.icon}</span>
            <span className="nav-title">{item.title}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-btn" onClick={() => navigate('/logout')}>
          <span className="icon-container"><FiLogOut size={20} /></span>
          <span className="nav-title">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
