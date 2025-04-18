import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

interface CompanyFormData {
  legalBusinessName: string;
  doingBusinessAs: string;
  businessWebsite: string;
}

const AddCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyFormData>({
    legalBusinessName: '',
    doingBusinessAs: '',
    businessWebsite: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    navigate('/admin');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Add new company</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legal business name
              </label>
              <input
                type="text"
                name="legalBusinessName"
                value={formData.legalBusinessName}
                onChange={handleInputChange}
                placeholder="Enter legal business name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doing business as
              </label>
              <input
                type="text"
                name="doingBusinessAs"
                value={formData.doingBusinessAs}
                onChange={handleInputChange}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business website
              </label>
              <input
                type="text"
                name="businessWebsite"
                value={formData.businessWebsite}
                onChange={handleInputChange}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AddCompanyPage;

