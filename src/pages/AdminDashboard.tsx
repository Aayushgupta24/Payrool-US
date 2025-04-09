import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiRefreshCcw } from 'react-icons/fi';
import { adminService, type AdminCompanyResponse } from '../services/adminService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companies, setCompanies] = useState<AdminCompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllCompanies();
        console.log('API Response:', response);
        
        if (response?.data && Array.isArray(response.data)) {
          setCompanies(response.data);
          // Removed auto-selection of GrowthPods Demo
          setSelectedCompany(''); // Ensure default selection is empty
        } else {
          console.error('Invalid data format received:', response);
          setCompanies([]);
          setError('Invalid data format received from server');
        }
      } catch (error: any) {
        console.error('Failed to fetch companies:', error);
        setError(error.response?.data?.message || 'Failed to fetch companies');
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

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
