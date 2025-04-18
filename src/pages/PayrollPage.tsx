import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PlaidLinkButton } from '../components/PlaidLink';
import { Tabs, TabList, Tab, TabPanel } from '../components/common/Tabs';
import { plaidService } from '../services/plaidService';
// Import icons or replace with simple text/elements
import { FiDollarSign, FiUserPlus } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface ActivityItem {
  icon: IconType;
  title: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const recentActivity: ActivityItem[] = [
  {
    icon: FiDollarSign,
    title: 'Payroll processed for 15 employees',
    timestamp: '2 hours ago',
    status: 'completed'
  },
  {
    icon: FiUserPlus,
    title: 'New employee onboarding - Sarah Johnson',
    timestamp: '5 hours ago',
    status: 'pending'
  },
  // Add more activity items as needed
];

const PayrollPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('employees');
  const [payrollProvider, setPayrollProvider] = useState<any>(null);
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('September 30, 2024 to October 14, 2024 - Regular');
  const [isProcessing, setIsProcessing] = useState(false);

  const payPeriods = [
    'September 30, 2024 to October 14, 2024 - Regular',
    'October 15, 2024 to October 29, 2024 - Regular',
    'October 30, 2024 to November 14, 2024 - Regular',
  ];

  const handlePlaidSuccess = async (accessToken: string) => {
    try {
      // Get payroll data using the access token
      const payrollData = await plaidService.getPayrollData(accessToken);
      setPayrollProvider(payrollData);
      // You might want to make an API call to your backend to store the connection
      console.log('Payroll provider connected:', payrollData);
    } catch (error) {
      console.error('Error handling Plaid success:', error);
    }
  };

  const handleRunPayroll = async () => {
    setIsProcessing(true);
    try {
      // Implement your payroll processing logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      alert('Payroll processed successfully!');
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Error processing payroll. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const EmployeePayrollSection = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Employee Payroll</h2>
          <p className="text-gray-600">Next pay date: September 30, 2024</p>
        </div>
        <button
          onClick={handleRunPayroll}
          disabled={!payrollProvider || isProcessing}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Run Payroll'}
        </button>
      </div>

      {payrollProvider ? (
        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeData.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.salary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.hours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">${employee.grossPay.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">-${employee.totalDeductions.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">${employee.netPay.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">Totals</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">${totalGrossPay.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-red-600">-${totalDeductions.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-green-600">${totalNetPay.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Connect Your Payroll Provider</h3>
          <p className="text-gray-500 mb-6">Connect your payroll provider to start processing payroll</p>
          <PlaidLinkButton onSuccess={handlePlaidSuccess} onExit={() => console.log('Plaid connection cancelled')} />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">Payroll Management</h1>
            <p className="text-teal-100">Manage your team's compensation efficiently</p>
          </div>
          <select
            value={selectedPayPeriod}
            onChange={(e) => setSelectedPayPeriod(e.target.value)}
            className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {payPeriods.map((period) => (
              <option key={period} value={period} className="text-gray-900">
                {period}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['employees', 'contractors', 'summary', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'employees' && <EmployeePayrollSection />}
          {activeTab === 'contractors' && <ContractorPayroll />}
          {activeTab === 'summary' && <PayrollSummary />}
          {activeTab === 'history' && <PayrollHistory />}
        </div>
      </div>
    </div>
  );
};

// Sample data
const employeeData = [
  {
    name: 'Michael Chen',
    position: 'Senior Developer',
    salary: '145,000.00 / Year',
    hours: 80,
    grossPay: 5576.92,
    totalDeductions: 2023.07,
    netPay: 3553.85,
  },
  {
    name: 'Sarah Johnson',
    position: 'Product Manager',
    salary: '120,000.00 / Year',
    hours: 80,
    grossPay: 4615.38,
    totalDeductions: 1684.62,
    netPay: 2930.76,
  },
];

const totalGrossPay = employeeData.reduce((sum, emp) => sum + emp.grossPay, 0);
const totalDeductions = employeeData.reduce((sum, emp) => sum + emp.totalDeductions, 0);
const totalNetPay = employeeData.reduce((sum, emp) => sum + emp.netPay, 0);

const ContractorPayroll: React.FC = () => {
  const contractorPayrollData = {
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
        paymentMethod: 'ACH Transfer'
      },
      {
        name: 'Emma Wilson',
        company: 'Wilson Design Co',
        invoiceNumber: 'INV-2024-002',
        amount: 3500.00,
        status: 'Approved',
        paymentMethod: 'Wire Transfer'
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Contractor Payroll</h2>
            <p className="text-gray-500">Pay period: {contractorPayrollData.deadline}</p>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            Process Payments
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Contractor</th>
                <th className="text-left py-3">Company</th>
                <th className="text-left py-3">Invoice #</th>
                <th className="text-right py-3">Amount</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {contractorPayrollData.contractors.map((contractor, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">{contractor.name}</td>
                  <td>{contractor.company}</td>
                  <td>{contractor.invoiceNumber}</td>
                  <td className="text-right">${contractor.amount.toFixed(2)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      contractor.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      contractor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contractor.status}
                    </span>
                  </td>
                  <td>{contractor.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td colSpan={3} className="py-4">Total</td>
                <td className="text-right">${contractorPayrollData.totalAmount.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

const PayrollSummary: React.FC = () => {
  const summaryData = {
    currentMonth: 'September 2024',
    totalPayroll: 74250.00,
    employeePayroll: 45750.00,
    contractorPayroll: 28500.00,
    totalEmployees: 15,
    totalContractors: 8,
    nextPayrollDate: 'September 30, 2024',
    upcomingPayments: 32942.50
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payroll Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Payroll ({summaryData.currentMonth})</h3>
          <p className="text-2xl font-bold">${summaryData.totalPayroll.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Employee Payroll</h3>
          <p className="text-2xl font-bold">${summaryData.employeePayroll.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Contractor Payroll</h3>
          <p className="text-2xl font-bold">${summaryData.contractorPayroll.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const PayrollHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const historyData = [
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
    {
      payPeriod: 'August 16-31, 2024',
      payDate: '2024-08-31',
      type: 'Employee',
      totalAmount: 44500.00,
      status: 'Completed',
      recipients: 15
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payroll History</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md px-3 py-2">
              <span className="text-gray-400 mr-2">🔍</span>
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
              <span className="mr-2">🔍</span>
              Filter
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <span className="mr-2">📥</span>
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
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;
