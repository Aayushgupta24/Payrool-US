import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

interface Employee {
  name: string;
  position: string;
  salary: string;
  hours: number;
  grossPay: number;
  deductions: {
    federal: number;
    state: number;
    benefits: number;
  };
  netPay: number;
  paymentMethod: string;
}

const EmployeePayroll: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('September 16, 2024 to September 30, 2024');

  const employeeData = {
    deadline: 'September 26, 2024',
    payDate: 'September 30, 2024',
    totalGrossPay: 45750.00,
    totalDeductions: -12807.50,
    totalNetPay: 32942.50,
    employees: [
      {
        name: 'Michael Chen',
        position: 'Senior Developer',
        salary: '145,000.00 / Year',
        hours: 80,
        grossPay: 5576.92,
        deductions: {
          federal: 1115.38,
          state: 557.69,
          benefits: 350.00
        },
        netPay: 3553.85,
        paymentMethod: 'Direct Deposit'
      },
      // Add more employee data as needed
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Payroll</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
          Run Payroll
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPayPeriod}
              onChange={(e) => setSelectedPayPeriod(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value={selectedPayPeriod}>{selectedPayPeriod}</option>
              {/* Add more pay periods */}
            </select>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <FiFilter className="mr-2" />
              Filter
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Employee</th>
              <th className="text-left py-3">Position</th>
              <th className="text-right py-3">Salary</th>
              <th className="text-right py-3">Hours</th>
              <th className="text-right py-3">Gross Pay</th>
              <th className="text-right py-3">Deductions</th>
              <th className="text-right py-3">Net Pay</th>
              <th className="text-left py-3">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.employees.map((employee, index) => (
              <tr key={index} className="border-b">
                <td className="py-4">{employee.name}</td>
                <td>{employee.position}</td>
                <td className="text-right">{employee.salary}</td>
                <td className="text-right">{employee.hours}</td>
                <td className="text-right">${employee.grossPay.toFixed(2)}</td>
                <td className="text-right">-${(employee.deductions.federal + employee.deductions.state + employee.deductions.benefits).toFixed(2)}</td>
                <td className="text-right">${employee.netPay.toFixed(2)}</td>
                <td>{employee.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={4} className="py-4">Total</td>
              <td className="text-right">${employeeData.totalGrossPay.toFixed(2)}</td>
              <td className="text-right">${employeeData.totalDeductions.toFixed(2)}</td>
              <td className="text-right">${employeeData.totalNetPay.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default EmployeePayroll;