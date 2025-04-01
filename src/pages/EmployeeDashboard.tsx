import React from 'react';
import Sidebar from '../components/Sidebar';

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default EmployeeDashboard;