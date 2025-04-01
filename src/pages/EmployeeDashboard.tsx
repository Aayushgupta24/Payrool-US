// File: src/components/EmployeeDashboard.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import './EmployeeDashboard.css';

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      {/* Main Content */}
      <div className="main-content">
        <header className="user-header">
          <h1>Russell Washington</h1>
        </header>
        
        {/* Tasks Section */}
        <section className="section">
          <h2 className="section-title">Tasks</h2>
          <div className="divider"></div>
          
          <div className="task-cards">
            {/* Direct Deposit Task */}
            <div className="task-card">
              <div className="task-content">
                <div className="task-icon">
                  <i className="document-icon"></i>
                </div>
                <div className="task-details">
                  <h3>Link direct deposit account</h3>
                  <p>Connect your direct deposit account</p>
                </div>
              </div>
              <button className="task-btn green-btn">Connect bank</button>
            </div>
            
            {/* Federal W-4 Task */}
            <div className="task-card">
              <div className="task-content">
                <div className="task-icon">
                  <i className="document-icon"></i>
                </div>
                <div className="task-details">
                  <h3>Complete Federal W-4</h3>
                  <p>Complete your federal tax holding forms</p>
                </div>
              </div>
              <button className="task-btn green-btn">Complete Federal W-4</button>
            </div>
            
            {/* State W-4 Task */}
            <div className="task-card">
              <div className="task-content">
                <div className="task-icon">
                  <i className="document-icon"></i>
                </div>
                <div className="task-details">
                  <h3>Complete state W-4</h3>
                  <p>Complete your state tax holding forms</p>
                </div>
              </div>
              <button className="task-btn green-btn">Complete state W-4</button>
            </div>
          </div>
        </section>
        
        {/* Payroll Details Section */}
        <section className="section">
          <h2 className="section-title">Payroll details</h2>
          <div className="divider"></div>
          
          <div className="payroll-cards">
            <div className="payroll-card">
              <h3>Next payroll</h3>
              {/* Content would go here */}
            </div>
            
            <div className="payroll-card">
              <h3>Last payroll</h3>
              {/* Content would go here */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
