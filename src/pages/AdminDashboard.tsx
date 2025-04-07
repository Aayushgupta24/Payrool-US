import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
          
          // Auto-select GrowthPods Demo if it exists
          const growthPodsDemo = response.data.find(company => company.company === 'GrowthPods Demo');
          if (growthPodsDemo) {
            setSelectedCompany(growthPodsDemo.companyID);
            handleCompanySelect(growthPodsDemo.companyID);
          }
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
  }, [navigate]); // Added navigate to dependencies

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    const selectedCompany = companies.find(company => company.companyID === companyId);
    
    if (selectedCompany?.company === 'GrowthPods Demo') {
      // Store the selected company info in localStorage or state management if needed
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
      navigate('/employer/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Welcome Raj R</h1>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
            Add New Company
          </button>
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
