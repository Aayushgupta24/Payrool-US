import React, { useState } from 'react';
import { EmployeeDetails } from '../types';

// Tab definitions
type DetailTab = 'personal' | 'direct-deposit' | 'w4';

interface YourDetailsProps {
  employeeDetails: EmployeeDetails;
}

const YourDetails: React.FC<YourDetailsProps> = ({ employeeDetails }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('personal');
  
  // Function to determine if tab is active
  const isActiveTab = (tab: DetailTab) => activeTab === tab;
  
  return (
    <div className="flex flex-col w-full">
      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button
          className={`py-3 px-6 rounded-t-md ${
            isActiveTab('personal') ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          Personal details
        </button>
        <button
          className={`py-3 px-6 ml-2 rounded-t-md ${
            isActiveTab('direct-deposit') ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setActiveTab('direct-deposit')}
        >
          Direct deposit
        </button>
        <button
          className={`py-3 px-6 ml-2 rounded-t-md ${
            isActiveTab('w4') ? 'bg-teal-600 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => setActiveTab('w4')}
        >
          W4 information
        </button>
      </div>

      {/* Tab Content - Personal Details */}
      {isActiveTab('personal') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Details Section */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-4">General details</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Full name</h3>
              <p className="text-base text-gray-700">{employeeDetails.fullName}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Date of birth</h3>
              {employeeDetails.dateOfBirth ? (
                <p className="text-base text-gray-700">{employeeDetails.dateOfBirth}</p>
              ) : (
                <p className="text-base text-gray-400">Enter Date of birth</p>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">SSN</h3>
              {employeeDetails.ssn ? (
                <p className="text-base text-gray-700">{employeeDetails.ssn}</p>
              ) : (
                <p className="text-base text-gray-700">No SSN available</p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white p-6 rounded-md shadow-sm relative">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Contact information</h2>
            
            <button className="absolute top-6 right-6 bg-white text-gray-700 px-4 py-1 rounded border border-gray-300 text-sm font-medium">
              Edit
            </button>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              {employeeDetails.address ? (
                <p className="text-base text-gray-700">{employeeDetails.address}</p>
              ) : (
                <p className="text-base text-gray-400">Enter Address</p>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Business phone number</h3>
              <p className="text-base text-gray-700">{employeeDetails.businessPhone}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Work email</h3>
              <p className="text-base text-gray-700">{employeeDetails.workEmail}</p>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white p-6 rounded-md shadow-sm relative">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Security</h2>
            
            <button className="absolute top-6 right-6 bg-white text-gray-700 px-4 py-1 rounded border border-gray-300 text-sm font-medium">
              Edit
            </button>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">User name</h3>
              <p className="text-base text-gray-700">{employeeDetails.username}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Password</h3>
              <p className="text-base text-gray-700">{employeeDetails.password}</p>
            </div>
          </div>

          {/* Two-Factor Authentication Section */}
          <div className="bg-white p-6 rounded-md shadow-sm relative">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Two-Factor authentication</h2>
            
            <button className="absolute top-6 right-6 bg-white text-gray-700 px-4 py-1 rounded border border-gray-300 text-sm font-medium">
              Edit
            </button>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Business email</h3>
              <p className="text-base text-gray-700">{employeeDetails.businessEmailMasked}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Business phone number</h3>
              <p className="text-base text-gray-700">{employeeDetails.businessPhoneMasked}</p>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Job Details</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Employment Type</h3>
              <p className="text-base text-gray-700">{employeeDetails.employmentType}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Job title</h3>
              <p className="text-base text-gray-700">{employeeDetails.jobTitle}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Compensation</h3>
              <p className="text-base text-gray-700">{employeeDetails.compensation}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Start date</h3>
              <p className="text-base text-gray-700">{employeeDetails.startDate}</p>
            </div>
          </div>

          {/* Work Location Section */}
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Work Location</h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Work Location</h3>
              {employeeDetails.workLocation ? (
                <p className="text-base text-gray-700">{employeeDetails.workLocation}</p>
              ) : (
                <p className="text-base text-gray-400">Enter Work Location</p>
              )}
            </div>
            
            {!employeeDetails.workLocation && (
              <p className="text-sm text-gray-500">No work location specified</p>
            )}
          </div>
        </div>
      )}

      {/* Tab Content - Direct Deposit */}
      {isActiveTab('direct-deposit') && (
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Direct Deposit Information</h2>
          <p className="text-gray-500">Direct deposit setup would go here</p>
        </div>
      )}

      {/* Tab Content - W4 Information */}
      {isActiveTab('w4') && (
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-medium text-gray-700 mb-4">W4 Information</h2>
          <p className="text-gray-500">W4 tax information would go here</p>
        </div>
      )}
    </div>
  );
};

export default YourDetails;
