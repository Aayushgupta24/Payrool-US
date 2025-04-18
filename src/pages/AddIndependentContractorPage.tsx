import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContractorFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  serviceDescription: string;
  startDate: string;
  endDate: string;
  contractorRate: string;
  paymentTerms: string;
  businessName: string;
  taxIdNumber: string;
}

const AddIndependentContractorPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContractorFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    serviceDescription: '',
    startDate: '',
    endDate: '',
    contractorRate: '',
    paymentTerms: '',
    businessName: '',
    taxIdNumber: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/employer/hiring');
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Add Independent Contractor</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-6 text-gray-700">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter middle name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter last name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-6 text-gray-700">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tax ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="taxIdNumber"
                  required
                  value={formData.taxIdNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter tax ID number"
                />
              </div>
            </div>
          </div>

          {/* Contract Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-6 text-gray-700">Contract Details</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="serviceDescription"
                  required
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Describe the services to be provided"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contractor Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contractorRate"
                    required
                    value={formData.contractorRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                    placeholder="Enter rate (e.g., $50/hour)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Terms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="paymentTerms"
                    required
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                    placeholder="Enter payment terms"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/employer/hiring')}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Add Independent Contractor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIndependentContractorPage;
