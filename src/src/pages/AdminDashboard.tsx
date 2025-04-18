import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCcw, FiPlus, FiSearch, FiFilter, FiMoreVertical, FiEdit3, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { adminService, type AdminCompanyResponse } from '../services/adminService';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import Sidebar from '../components/Sidebar';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<AdminCompanyResponse[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await adminService.getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  // Copilot readable stats
  useCopilotReadable({
    name: "dashboardStats",
    description: "Dashboard statistics including total companies, active companies, and total employees",
    value: {
      totalCompanies: companies.length,
      activeCompanies: companies.filter(c => c.status === 'active').length,
      totalEmployees: companies.reduce((sum, company) => sum + (company.employeeCount || 0), 0),
    },
  });

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

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || company.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your organization's companies and resources</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSwitchToEmployee}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiRefreshCcw className="w-4 h-4 mr-2" />
                  Switch to Employee
                </button>
                <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add New Company
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Companies</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{companies.length}</h3>
                </div>
                <div className="bg-teal-100 p-3 rounded-full">
                  <FiCheckCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↑ 12%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Companies</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {companies.filter(c => c.status === 'active').length}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↑ 8%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Employees</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {companies.reduce((sum, company) => sum + (company.employeeCount || 0), 0)}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiCheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↑ 15%</span>
                  <span className="text-gray-500 text-sm ml-2">vs last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Companies List Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Companies Overview</h2>
                <div className="mt-3 sm:mt-0 flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr
                      key={company.companyID}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleCompanySelect(company.companyID)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-medium text-gray-600">
                              {company.company.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{company.company}</div>
                            <div className="text-sm text-gray-500">{company.companyID}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {company.employeeCount || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button className="text-teal-600 hover:text-teal-900">
                            <FiEdit3 className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
