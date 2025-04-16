import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

interface Contractor {
  name: string;
  company: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  paymentMethod: string;
  submissionDate: string;
}

const ContractorPayroll: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('September 16, 2024 to September 30, 2024');

  const contractorData = {
    deadline: 'September 26, 2024',
    payDate: 'September 30, 2024',
    totalAmount: 28500.00,
    contractors: [
      {
        name: 'John Smith',
        company: 'Smith Consulting LLC',
        invoiceNumber: 'INV-2024-001',
        amount: 5000.00,
        status: 'Pending',
        paymentMethod: 'ACH Transfer',
        submissionDate: '2024-09-15'
      },
      // Add more contractor data as needed
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contractor Payroll</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
          Process Payments
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
                placeholder="Search contractors..."
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
              <th className="text-left py-3">Contractor</th>
              <th className="text-left py-3">Company</th>
              <th className="text-left py-3">Invoice #</th>
              <th className="text-right py-3">Amount</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Payment Method</th>
              <th className="text-left py-3">Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {contractorData.contractors.map((contractor, index) => (
              <tr key={index} className="border-b">
                <td className="py-4">{contractor.name}</td>
                <td>{contractor.company}</td>
                <td>{contractor.invoiceNumber}</td>
                <td className="text-right">${contractor.amount.toFixed(2)}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    contractor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    contractor.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contractor.status}
                  </span>
                </td>
                <td>{contractor.paymentMethod}</td>
                <td>{contractor.submissionDate}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={3} className="py-4">Total</td>
              <td className="text-right">${contractorData.totalAmount.toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ContractorPayroll;