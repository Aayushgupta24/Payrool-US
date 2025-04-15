import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/EmployeeSidebar';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const EmployeeLayout: React.FC = () => {
  useSmartNavigation();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
