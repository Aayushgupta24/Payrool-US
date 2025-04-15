import React from 'react';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const EmployeeDetailsPage: React.FC = () => {
  useSmartNavigation();
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <h1 className="text-2xl font-medium mb-8">Your Details</h1>
      {/* Your existing details content */}
    </div>
  );
};

export default EmployeeDetailsPage;
