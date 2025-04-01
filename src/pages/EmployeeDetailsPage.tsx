import React from 'react';
import Sidebar from '../components/Sidebar';
import YourDetails from '../components/YourDetails';
import { employeeDetailsData } from '../data/mockData';

const EmployeeDetailsPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <YourDetails employeeDetails={employeeDetailsData} />
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;