import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

interface PayrollRecord {
  payPeriod: string;
  payDate: string;
  type: 'Employee' | 'Contractor';
  totalAmount: number;
  status: string;
  recipients: number;
}

const PayrollHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const historyData: PayrollRecord[] = [
    {
      payPeriod: 'September 1-15, 2024',
      payDate: '2024-09-15',
      type: 'Employee',
      totalAmount: 45750.00,
      status: 'Completed',
      recipients: 15
    },
    {
      payPeriod: 'September 1-30, 2024',
      payDate: '2024-09-30',
      type: 'Contractor',
      totalAmount: 28500.00,
      status: 'Pending',
      recipients: 8
    },
    // Add more history records as needed
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payroll History</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search payroll history..."
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
              <th className="text-left py-3">Pay Period</th>
              <th className="text-left py-3">Pay Date</th>
              <th className="text-left py-3">Type</th>
              <th className="text-right py-3">Total Amount</th>
              <th className="text-left py-3">Status</th>
              <th className="text-right py-3">Recipients</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record, index) => (
              <tr key={index} className="border-b">
                <td className="py-4">{record.payPeriod}</td>
                <td>{record.payDate}</td>
                <td>{record.type}</td>
                <td className="text-right">${record.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="text-right">{record.recipients}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={3} className="py-4">Total</td>
              <td className="text-right">
                ${historyData.reduce((sum, record) => sum + record.totalAmount, 0).toFixed(2)}
              </td>
              <td></td>
              <td className="text-right">
                {historyData.reduce((sum, record) => sum + record.recipients, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PayrollHistory;
