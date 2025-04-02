import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployerSidebar from '../components/EmployerSidebar';

const EmployerLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployerSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployerLayout;