import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

interface Company {
  id: string;
  name: string;
  employees: number;
  status: 'active' | 'inactive';
  location: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string>('');

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

          {/* Number of Companies Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 mb-2">Number of Companies</h3>
            <p className="text-4xl font-bold">{companies.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
