import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {/* Add your admin dashboard content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;