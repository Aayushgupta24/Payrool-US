import React, { useState } from 'react';
import { EmployeeDetails } from '../types';

type DetailTab = 'personal' | 'direct-deposit' | 'w4';

interface YourDetailsProps {
  employeeDetails: EmployeeDetails;
}

const YourDetails: React.FC<YourDetailsProps> = ({ employeeDetails }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('personal');

  return (
    <div className="flex flex-col w-full">
      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button
          className={`py-3 px-6 rounded-t-md ${
            activeTab === 'personal' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          Personal details
        </button>
        <button
          className={`py-3 px-6 ml-2 rounded-t-md ${
            activeTab === 'direct-deposit' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setActiveTab('direct-deposit')}
        >
          Direct deposit
        </button>
        <button
          className={`py-3 px-6 ml-2 rounded-t-md ${
            activeTab === 'w4' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setActiveTab('w4')}
        >
          W4 information
        </button>
      </div>

      {/* Personal Details Content */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Job Details Section */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Job Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
                <p className="text-base text-gray-700">W2</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Job title</h3>
                <p className="text-base text-gray-700">Director</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Compensation</h3>
                <p className="text-base text-gray-700">$100,000.00/Per Year</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Start date</h3>
                <p className="text-base text-gray-700">04/08/2024</p>
              </div>
            </div>
          </div>

          {/* Work Location Section */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Work Location</h2>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Work Location</h3>
              <p className="text-base text-gray-400">Enter Work Location</p>
            </div>
            
            <p className="text-sm text-gray-500 mt-2">No work location specified</p>
          </div>
        </div>
      )}

      {/* Direct Deposit Content */}
      {activeTab === 'direct-deposit' && (
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Direct Deposit Information</h2>
          <p className="text-gray-500">Direct deposit setup would go here</p>
        </div>
      )}

      {/* W4 Information Content */}
      {activeTab === 'w4' && (
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-medium text-gray-700 mb-4">W4 Information</h2>
          <p className="text-gray-500">W4 tax information would go here</p>
        </div>
      )}
    </div>
  );
};

export default YourDetails;
