import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/EmployeeSidebar';

const EmployeeLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <EmployeeSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
