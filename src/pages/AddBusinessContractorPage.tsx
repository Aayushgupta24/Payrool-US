import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BusinessContractorFormData {
  businessName: string;
  taxId: string;
  contactFirstName: string;
  contactLastName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  servicesProvided: string;
  contractValue: string;
  billingFrequency: string;
  contractStartDate: string;
  contractEndDate: string;
  paymentTerms: string;
}

const AddBusinessContractorPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BusinessContractorFormData>({
    businessName: '',
    taxId: '',
    contactFirstName: '',
    contactLastName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    servicesProvided: '',
    contractValue: '',
    billingFrequency: 'Monthly',
    contractStartDate: '',
    contractEndDate: '',
    paymentTerms: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const billingFrequencyOptions = [
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Quarterly',
    'Annually'
  ];

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Add Business Contractor</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  Tax ID / EIN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="taxId"
                  required
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-6 text-gray-700">Primary Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactFirstName"
                  required
                  value={formData.contactFirstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactLastName"
                  required
                  value={formData.contactLastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter last name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  required
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter business email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  required
                  value={formData.businessPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter business phone"
                />
              </div>
            </div>
          </div>

          {/* Business Address Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-6 text-gray-700">Business Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  required
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter street address"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                >
                  <option value="">Select State</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Enter ZIP code"
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
                  Services Provided <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="servicesProvided"
                  required
                  value={formData.servicesProvided}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  placeholder="Describe the services to be provided"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contract Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contractValue"
                    required
                    value={formData.contractValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                    placeholder="Enter contract value"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Billing Frequency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="billingFrequency"
                    required
                    value={formData.billingFrequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  >
                    {billingFrequencyOptions.map(frequency => (
                      <option key={frequency} value={frequency}>{frequency}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contract Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="contractStartDate"
                    required
                    value={formData.contractStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contract End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="contractEndDate"
                    required
                    value={formData.contractEndDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 text-lg"
                  />
                </div>

                <div className="col-span-2 space-y-2">
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
              Add Business Contractor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessContractorPage;
