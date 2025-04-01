import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Dashboard</h1>
        {/* Add your admin dashboard content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
