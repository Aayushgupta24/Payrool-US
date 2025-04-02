import React from 'react';
import { FiDollarSign, FiUsers, FiFileText } from 'react-icons/fi';

const PayrollSummary: React.FC = () => {
  const summaryData = {
    totalPayroll: 74250.00,
    employeePayroll: 45750.00,
    contractorPayroll: 28500.00,
    totalEmployees: 15,
    totalContractors: 8,
    pendingPayments: 23
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payroll Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 p-3 rounded-full">
              <FiDollarSign className="text-teal-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Payroll</p>
              <p className="text-2xl font-semibold">${summaryData.totalPayroll.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Employee Payroll</span>
              <span>${summaryData.employeePayroll.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contractor Payroll</span>
              <span>${summaryData.contractorPayroll.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Personnel</p>
              <p className="text-2xl font-semibold">{summaryData.totalEmployees + summaryData.totalContractors}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Employees</span>
              <span>{summaryData.totalEmployees}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contractors</span>
              <span>{summaryData.totalContractors}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiFileText className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-semibold">{summaryData.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;