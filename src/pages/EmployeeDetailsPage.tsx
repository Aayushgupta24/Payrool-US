import React from 'react';
import Sidebar from '../components/Sidebar';
import YourDetails from '../components/YourDetails';
import { employeeDetailsData } from '../data/mockData';

const EmployeeDetailsPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <YourDetails employeeDetails={employeeDetailsData} />
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
