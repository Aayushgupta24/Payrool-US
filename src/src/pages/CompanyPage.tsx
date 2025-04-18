import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface CompanyInfo {
  legalBusinessName: string;
  ein: string;
  doingBusinessAs: string;
  businessWebsite: string;
  businessEmail: string;
  businessPhone: string;
  businessCategory: string;
  businessSubCategory: string;
  address1: string;
  address2: string;
}

const CompanyPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedCompanyInfo, setEditedCompanyInfo] = useState<CompanyInfo>({
    legalBusinessName: '',
    ein: '',
    doingBusinessAs: '',
    businessWebsite: '',
    businessEmail: '',
    businessPhone: '',
    businessCategory: '',
    businessSubCategory: '',
    address1: '',
    address2: ''
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) {
        throw new Error('No company selected');
      }

      const selectedCompany = JSON.parse(selectedCompanyStr);
      const response = await api.get(`/reports/company/${selectedCompany.companyID}`);
      setEditedCompanyInfo(response.data);
    } catch (err: any) {
      setError('Failed to fetch company information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setEditedCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) {
        throw new Error('No company selected');
      }

      const selectedCompany = JSON.parse(selectedCompanyStr);
      await api.post('/reports', {
        method: 'updateCompanyInfo',
        companyId: selectedCompany.companyID,
        ...editedCompanyInfo
      });

      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      setError('Failed to save company information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchCompanyInfo(); // Reset to original data
  };

  const renderField = (label: string, field: keyof CompanyInfo) => (
    <div>
      <h3 className="text-gray-600 mb-2">{label}</h3>
      {isEditing ? (
        <input
          type="text"
          value={editedCompanyInfo[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      ) : (
        <p className="text-gray-900">{editedCompanyInfo[field] || 'Not provided'}</p>
      )}
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Company Information</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            {renderField('Legal Business Name', 'legalBusinessName')}
            {renderField('Ein', 'ein')}
            {renderField('Doing Business As', 'doingBusinessAs')}
            {renderField('Business Website', 'businessWebsite')}
            {renderField('Business Email', 'businessEmail')}
            {renderField('Business Phone', 'businessPhone')}
            {renderField('Business Category', 'businessCategory')}
            {renderField('Business Sub Category', 'businessSubCategory')}
            {renderField('Address 1', 'address1')}
            {renderField('Address 2', 'address2')}
          </div>

          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                disabled={loading}
              >
                Edit Information
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyPage;
