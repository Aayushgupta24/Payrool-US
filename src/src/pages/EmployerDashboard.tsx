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
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section with Enhanced Buttons */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-1">
                {companyInfo?.company || 'Tex James'}
              </h1>
              <p className="text-teal-100 text-sm">Welcome back! Here's your business overview</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSwitchToEmployee}
                className="flex items-center px-5 py-2.5 bg-white/10 text-white rounded-lg 
                  hover:bg-white/20 transition-all duration-300 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
              >
                <FiRefreshCcw className="w-4 h-4 mr-2" />
                Switch to Employee
              </button>
              <button 
                onClick={() => setShowAddTeamMemberModal(true)}
                className="flex items-center px-5 py-2.5 bg-teal-500 text-white rounded-lg
                  hover:bg-teal-400 transition-all duration-300 transform hover:scale-105
                  shadow-md hover:shadow-lg focus:outline-none focus:ring-2 
                  focus:ring-teal-400 active:scale-95"
              >
                <FiUserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowPayrollModal(true)}
            className="flex items-center px-6 py-3 bg-white text-teal-600 rounded-xl
              border-2 border-teal-600 hover:bg-teal-600 hover:text-white
              transition-all duration-300 transform hover:scale-105 shadow-sm
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <FiDollarSign className="w-5 h-5 mr-2" />
            Run Payroll
          </button>
          
          <button
            onClick={() => setShowReportsModal(true)}
            className="flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl
              border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white
              transition-all duration-300 transform hover:scale-105 shadow-sm
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <FiPieChart className="w-5 h-5 mr-2" />
            View Reports
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl
              border-2 border-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-700
              transition-all duration-300 transform hover:scale-105 shadow-sm
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <FiSettings className="w-5 h-5 mr-2" />
            Settings
          </button>
        </div>

        {/* Quick Stats Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Employees</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">24</h3>
              </div>
              <div className="bg-teal-100 p-3 rounded-xl">
                <FiUsers className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">↑ 12%</span>
              <span className="text-gray-400 text-sm ml-2">vs last month</span>
            </div>
          </div>
          {/* Repeat similar styling for other stat cards */}
        </div>

        {/* Table Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport()}
                className="flex items-center px-4 py-2 text-sm bg-green-50 text-green-600
                  rounded-lg hover:bg-green-100 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => handleFilter()}
                className="flex items-center px-4 py-2 text-sm bg-blue-50 text-blue-600
                  rounded-lg hover:bg-blue-100 transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
          {/* Table content */}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
