

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiRefreshCcw } from 'react-icons/fi';
import { adminService, type AdminCompanyResponse } from '../services/adminService';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const AdminDashboard: React.FC = () => {
  useSmartNavigation(); // Add this hook to enable smart navigation
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companies, setCompanies] = useState<AdminCompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define Copilot readable states
  useCopilotReadable({
    name: "companies",
    description: "List of all companies in the system",
    value: companies,
  });

  useCopilotReadable({
    name: "selectedCompany",
    description: "Currently selected company",
    value: selectedCompany,
  });

  useCopilotReadable({
    name: "dashboardStats",
    description: "Dashboard statistics including total companies, active companies, and total employees",
    value: {
      totalCompanies: companies.length,
      activeCompanies: companies.filter(c => c.status === 'active').length,
      totalEmployees: companies.reduce((sum, company) => sum + (company.employeeCount || 0), 0),
    },
  });

  // Define Copilot actions
  useCopilotAction({
    name: "selectCompany",
    description: "Select a company by ID or name",
    parameters: [{
      name: "companyIdentifier",
      type: "string",
      description: "The company ID or name to select"
    }],
    run: async (params) => {
      const company = companies.find(
        c => c.companyID === params.companyIdentifier || c.company === params.companyIdentifier
      );
      if (company) {
        handleCompanySelect(company.companyID);
        return `Selected company: ${company.company}`;
      }
      return "Company not found";
    },
  });

  useCopilotAction({
    name: "switchToEmployee",
    description: "Switch to employee dashboard view",
    parameters: [],
    run: async () => {
      handleSwitchToEmployee();
      return "Switched to employee dashboard";
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllCompanies();
        
        if (response?.data && Array.isArray(response.data)) {
          setCompanies(response.data);

          
          const growthPodsDemo = response.data.find(company => company.company === 'GrowthPods Demo');
          if (growthPodsDemo) {
            setSelectedCompany(growthPodsDemo.companyID);
            handleCompanySelect(growthPodsDemo.companyID);
          }
          // Removed auto-selection of GrowthPods Demo
          setSelectedCompany(''); // Ensure default selection is empty

        } else {
          setError('Invalid data format received from server');
          setCompanies([]);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch companies');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();

  }, []);


  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    const selectedCompany = companies.find(company => company.companyID === companyId);
    
    if (selectedCompany?.company === 'GrowthPods Demo') {
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
      navigate('/employer/dashboard');
    }
  };

  const handleSwitchToEmployee = () => {
    navigate('/employee/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Welcome Raj R</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSwitchToEmployee}
              className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiRefreshCcw className="mr-2" />
              Switch to Employee
            </button>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
              Add New Company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Company Selection Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 mb-2">Company Selection</h3>
            {loading ? (
              <div className="text-gray-500">Loading companies...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedCompany}
                onChange={(e) => handleCompanySelect(e.target.value)}
              >
                <option value="">Select Company</option>
                {Array.isArray(companies) && companies.map(company => (
                  <option key={company.companyID} value={company.companyID}>
                    {company.company}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Number of Companies Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 mb-2">Number of Companies</h3>
            <p className="text-4xl font-bold">{Array.isArray(companies) ? companies.length : 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;