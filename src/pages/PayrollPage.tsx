import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiFilter, FiDownload } from 'react-icons/fi';

const PayrollPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Pay Employees');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('September 16, 2024 to September 30, 2024 - Regular');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Pay Employees':
        return <EmployeePayroll />;
      case 'Pay Contractors':
        return <ContractorPayroll />;
      case 'Payroll Summary':
        return <PayrollSummary />;
      case 'Payroll History':
        return <PayrollHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              {['Payroll Summary', 'Pay Employees', 'Pay Contractors', 'Payroll History'].map((tab) => (
                <button
                  key={tab}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

const EmployeePayroll: React.FC = () => {
  const employeePayrollData = {
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
      {
        name: 'Sarah Johnson',
        position: 'Product Manager',
        salary: '120,000.00 / Year',
        hours: 80,
        grossPay: 4615.38,
        deductions: {
          federal: 923.08,
          state: 461.54,
          benefits: 300.00
        },
        netPay: 2930.76,
        paymentMethod: 'Direct Deposit'
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Employee Payroll</h2>
            <p className="text-gray-500">Pay period: {employeePayrollData.deadline}</p>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            Run Payroll
          </button>
        </div>

        <div className="overflow-x-auto">
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
              {employeePayrollData.employees.map((employee, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">{employee.name}</td>
                  <td>{employee.position}</td>
                  <td className="text-right">{employee.salary}</td>
                  <td className="text-right">{employee.hours}</td>
                  <td className="text-right">${employee.grossPay.toFixed(2)}</td>
                  <td className="text-right">${(employee.deductions.federal + employee.deductions.state + employee.deductions.benefits).toFixed(2)}</td>
                  <td className="text-right">${employee.netPay.toFixed(2)}</td>
                  <td>{employee.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td colSpan={4} className="py-4">Total</td>
                <td className="text-right">${employeePayrollData.totalGrossPay.toFixed(2)}</td>
                <td className="text-right">${employeePayrollData.totalDeductions.toFixed(2)}</td>
                <td className="text-right">${employeePayrollData.totalNetPay.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

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
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Team Members</h3>
          <p className="text-2xl font-bold">{summaryData.totalEmployees + summaryData.totalContractors}</p>
          <div className="text-sm text-gray-500 mt-2">
            <span>{summaryData.totalEmployees} Employees</span>
            <span className="mx-2">•</span>
            <span>{summaryData.totalContractors} Contractors</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upcoming Payroll</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Next payroll date</p>
            <p className="text-xl font-semibold">{summaryData.nextPayrollDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Upcoming payments</p>
            <p className="text-xl font-semibold">${summaryData.upcomingPayments.toFixed(2)}</p>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            View Details
          </button>
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
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;


