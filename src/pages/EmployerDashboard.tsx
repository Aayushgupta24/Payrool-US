import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { employerService } from '../services/employerService';
import AddTeamMemberModal from '../components/AddTeamMemberModal';
import { FiRefreshCcw } from 'react-icons/fi';

interface EmployerDashboardProps {}

const EmployerDashboard: React.FC<EmployerDashboardProps> = () => {
  const navigate = useNavigate();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState({
    bankBalance: 0,
    nextPayroll: 0,
    nextPayrollDate: '',
    lastPayrollDate: '',
    employeeCount: 0,
    contractorCount: 0,
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const storedCompany = localStorage.getItem('selectedCompany');
      if (!storedCompany) return;

      const company = JSON.parse(storedCompany);
      setCompanyInfo(company);

      // Fetch bank balance
      const balanceResponse = await employerService.getBankBalance();
      
      // Fetch next payroll
      const payrollResponse = await employerService.getNextPayroll();
      
      // Fetch employee counts
      const employeesResponse = await employerService.getAllEmployees();
      const contractorsResponse = await employerService.getAllContractors();

      setDashboardData({
        bankBalance: balanceResponse?.data?.balance || 0,
        nextPayroll: payrollResponse?.data?.amount || 0,
        nextPayrollDate: payrollResponse?.data?.date || '',
        lastPayrollDate: payrollResponse?.data?.lastPayrollDate || '',
        employeeCount: employeesResponse?.data?.length || 0,
        contractorCount: contractorsResponse?.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      setCompanyInfo(JSON.parse(storedCompany));
    }
  }, []);

  // Copilot Readable States
  useCopilotReadable({
    name: "companyInfo",
    description: "Current company information",
    value: companyInfo,
  });

  useCopilotReadable({
    id: "dashboardStats",
    description: "Dashboard statistics including bank balance, payroll info, and employee counts",
    value: dashboardData,
  });

  // Copilot Actions
  useCopilotAction({
    name: "refreshDashboard",
    description: "Refresh all dashboard data",
    parameters: [],
    run: async () => {
      await fetchDashboardData();
      return "Dashboard data refreshed successfully";
    },
  });

  useCopilotAction({
    name: "initiatePayroll",
    description: "Start a new payroll run",
    parameters: [
      {
        name: "type",
        type: "string",
        description: "Type of payroll (employees or contractors)"
      }
    ],
    run: async (params) => {
      if (params.type === 'employees') {
        handlePayEmployees();
      } else if (params.type === 'contractors') {
        handlePayContractors();
      }
      return `Initiated ${params.type} payroll`;
    },
  });

  const handlePayContractors = () => {
    navigate('/employer/payroll', { state: { activeTab: 'Pay Contractors' } });
  };

  const handlePayEmployees = () => {
    navigate('/employer/payroll', { state: { activeTab: 'Pay Employees' } });
  };

  const handleAddWage = () => {
    navigate('/employer/hiring');
  };

  const handleSwitchToEmployee = () => {
    navigate('/employee/dashboard');
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {companyInfo?.company || 'Tex James'}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSwitchToEmployee}
              className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiRefreshCcw className="w-5 h-5 mr-2" />
              Switch to Employee
            </button>
            <button 
              onClick={() => setShowAddTeamMemberModal(true)}
              className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add team member
            </button>
            <button 
              onClick={handlePayContractors}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Pay Contractors
            </button>
          </div>
        </div>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Bank balance</h2>
          <p className="text-3xl font-bold text-teal-600">$280,000.00</p>
          <p className="text-sm text-gray-500 mt-2">Last updated on 12/18/2024</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Next payroll</h2>
          <p className="text-3xl font-bold text-teal-600">$4,046.15</p>
          <p className="text-sm text-red-500 mt-2">Overdue by 222 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Last payroll</h2>
          <p className="text-3xl font-bold text-teal-600">$11,102.05</p>
          <p className="text-sm text-gray-500 mt-2">For 12/20/2024</p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-4">
          {/* Add wage task */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Add wage</h3>
                  <p className="text-sm text-gray-500">Enter pay details to 2 team members ready for payday</p>
                </div>
              </div>
              <button 
                onClick={handleAddWage}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Add wage
              </button>
            </div>
          </div>

          {/* Form 8655 signature request */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Form 8655 signature request</h3>
                  <p className="text-sm text-gray-500">Form 8655 allows us to file and pay taxes on your behalf</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                Complete signing
              </button>
            </div>
          </div>

          {/* Form TR-2000 signature request */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Form TR-2000 signature request</h3>
                  <p className="text-sm text-gray-500">Form TR-2000 allows us to file and pay taxes on your behalf</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                Complete signing
              </button>
            </div>
          </div>

          {/* Form DR-835 Signature request */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Form DR-835 Signature request</h3>
                  <p className="text-sm text-gray-500">Form DR-835 allows us to file and pay taxes on your behalf</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                Complete signing
              </button>
            </div>
          </div>

          {/* Run payroll */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-4">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Run payroll</h3>
                  <p className="text-sm text-gray-500">Overdue for employees by 222 days to run payroll for 09/30/2024 - 10/14/2024 and Overdue for contractors by 193 days to run payroll for 09/16/2024 - 09/30/2024</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                Run payroll
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddTeamMemberModal 
        isOpen={showAddTeamMemberModal}
        onClose={() => setShowAddTeamMemberModal(false)}
      />
    </div>
  );
};

export default EmployerDashboard;
