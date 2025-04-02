import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import { StatsCard as StatsCardType } from '../types';

interface Company {
  id: string;
  name: string;
  employees: number;
  status: 'active' | 'inactive';
  location: string;
}

interface AdminDashboardProps {
  username: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ username }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const companies: Company[] = [
    { id: '1', name: 'Growth Pods Demo', employees: 50, status: 'active', location: 'San Francisco' },
    { id: '2', name: 'Tech Corp', employees: 150, status: 'active', location: 'New York' },
    { id: '3', name: 'Digital Solutions', employees: 75, status: 'active', location: 'San Francisco' },
    { id: '4', name: 'Innovation Labs', employees: 200, status: 'inactive', location: 'Boston' },
  ];

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    const selectedCompany = companies.find(company => company.id === companyId);
    
    if (selectedCompany?.name === 'Growth Pods Demo') {
      navigate('/employer/dashboard');
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Welcome {username}</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
        >
          Add New Company
        </button>
      </div>

      {/* Company Selection */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-gray-500 mb-2">Company Selection</h3>
        <select 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedCompany}
          onChange={(e) => handleCompanySelect(e.target.value)}
        >
          <option value="">Select Company</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Number of Companies</h3>
          <p className="text-4xl font-bold">{companies.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Active Companies</h3>
          <p className="text-4xl font-bold">
            {companies.filter(c => c.status === 'active').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">Total Employees</h3>
          <p className="text-4xl font-bold">
            {companies.reduce((sum, company) => sum + company.employees, 0)}
          </p>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-medium mb-6">Add New Company</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
