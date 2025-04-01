import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../pages/EmployeeDashboard.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/logo.svg" alt="Growth Pods Logo" className="logo" />
        <div className="logo-text">
          <h2>Growth Pods</h2>
          <p className="tagline">Hire. Pay. Manage.</p>
        </div>
      </div>
      
      <h3 className="sidebar-title">GrowthPods Demo</h3>
      <div className="divider"></div>
      
      <div className="dropdown">
        <button className="dropdown-btn">
          Select employee
          <span className="dropdown-arrow">▼</span>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-btn ${location.pathname === '/employee' ? 'active' : ''}`}
          onClick={() => handleNavigation('/employee')}
        >
          <i className="icon dashboard-icon"></i>
          Dashboard
        </button>
        <button 
          className={`nav-btn ${location.pathname === '/employee/details' ? 'active' : ''}`}
          onClick={() => handleNavigation('/employee/details')}
        >
          <i className="icon info-icon"></i>
          Your details
        </button>
        <button 
          className={`nav-btn ${location.pathname === '/employee/paystubs' ? 'active' : ''}`}
          onClick={() => handleNavigation('/employee/paystubs')}
        >
          <i className="icon paystub-icon"></i>
          Paystub
        </button>
        <button 
          className={`nav-btn ${location.pathname === '/employee/documents' ? 'active' : ''}`}
          onClick={() => handleNavigation('/employee/documents')}
        >
          <i className="icon documents-icon"></i>
          Documents
        </button>
      </nav>
      
      <div className="divider"></div>
      
      <button 
        className="nav-btn admin-btn"
        onClick={() => handleNavigation('/admin')}
      >
        <i className="icon admin-icon"></i>
        Switch to admin
      </button>
    </div>
  );
};

export default Sidebar;
