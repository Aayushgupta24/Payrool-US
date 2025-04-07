import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface Employee {
  name: string;
  rate: string;
  hours: number;
  additionalComp: number;
  grossTotal: number;
  paymentMethod: string;
}

const EmployeePayroll: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const payrollData = {
    employees: [
      {
        name: 'Tex James',
        rate: '$8,000.00 / Month',
        hours: 10,
        additionalComp: 24.00,
        grossTotal: 3716.30,
        paymentMethod: 'Direct Deposit'
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-normal text-gray-500">Name</th>
                <th className="text-left py-3 text-sm font-normal text-gray-500">Rate</th>
                <th className="text-left py-3 text-sm font-normal text-gray-500">Hours</th>
                <th className="text-left py-3 text-sm font-normal text-gray-500">
                  Additional comp
                  <button className="ml-1 text-gray-400 hover:text-gray-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </th>
                <th className="text-left py-3 text-sm font-normal text-gray-500">
                  Gross total
                  <button className="ml-1 text-gray-400 hover:text-gray-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </th>
                <th className="text-left py-3 text-sm font-normal text-gray-500">Payment method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollData.employees.map((employee, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm">{employee.name}</td>
                  <td className="py-4 text-sm">{employee.rate}</td>
                  <td className="py-4 text-sm">{employee.hours}</td>
                  <td className="py-4 text-sm">${employee.additionalComp.toFixed(2)}</td>
                  <td className="py-4 text-sm">${employee.grossTotal.toFixed(2)}</td>
                  <td className="py-4 text-sm">{employee.paymentMethod}</td>
                </tr>
              ))}
              <tr>
                <td className="py-4 text-sm font-medium">Total</td>
                <td></td>
                <td></td>
                <td className="py-4 text-sm font-medium">${payrollData.employees.reduce((sum, emp) => sum + emp.additionalComp, 0).toFixed(2)}</td>
                <td className="py-4 text-sm font-medium">${payrollData.employees.reduce((sum, emp) => sum + emp.grossTotal, 0).toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 mt-4 text-sm text-gray-500">
          <span>1-2 of 2</span>
          <div className="flex items-center space-x-1">
            <button className="p-1 disabled:opacity-50" disabled>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-1 disabled:opacity-50" disabled>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayroll;
