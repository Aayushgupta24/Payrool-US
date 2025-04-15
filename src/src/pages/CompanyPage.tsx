import React, { useState, useEffect } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import api from '../services/apiConfig';

interface CompanyApiResponse {
  Company: Array<{
    company: string;
    companyID: string;
    naicsSubCategory?: {
      subCategoryCode: number;
      naicsSubCategory: string;
    };
    registration: {
      isTermsAccepted: boolean;
      isEsign: boolean;
    };
    CompanyLocations: Array<{
      address1: string;
      address2: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
      companyLocation: string;
    }>;
    KYBInformations: Array<{
      ein: string;
      email: string;
      EntityType: {
        entityType: string;
      };
      phoneNumber: string;
      dateOfIncorporation: string;
    }>;
    kycStatus: string;
  }>;
}

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

interface StateTaxInfo {
  state: string;
  unemploymentRate?: string;
  uiAccountNumber?: string;
  uiEmployerRegistrationNumber?: string;
  stateIdNumber?: string;
  prompTaxCode?: string;
}

interface PayScheduleRecord {
  workerType: string;
  status: string;
  compensationFrequency: string;
  paymentMode: string;
  startDate: string;
  endDate?: string;
}

interface Location {
  name: string;
  businessAddress: string;
  businessPhone: string;
  hasFillingAddress: boolean;
  hasMailingAddress: boolean;
  isWorkLocation: boolean;
}

interface LocationFormData {
  locationName: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  isWorkLocation: boolean;
  isFillingAddress: boolean;
  isMailingAddress: boolean;
}

const CompanyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Company information');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [editingStateId, setEditingStateId] = useState<number | null>(null);
  const [editedStateTaxInfo, setEditedStateTaxInfo] = useState<StateTaxInfo | null>(null);

  // Copilot Readable States
  useCopilotReadable({
    name: "companyInfo",
    description: "Current company information",
    value: editedCompanyInfo
  });

  useCopilotReadable({
    name: "isEditing",
    description: "Whether company information is currently being edited",
    value: isEditing
  });

  // Copilot Actions
  useCopilotAction({
    name: "editCompanyInfo",
    description: "Toggle edit mode for company information",
    parameters: [],
    run: async () => {
      setIsEditing(!isEditing);
      return isEditing ? "Disabled edit mode" : "Enabled edit mode";
    }
  });

  const [stateTaxInfo, setStateTaxInfo] = useState<StateTaxInfo[]>([
    {
      state: 'Alaska',
      unemploymentRate: '',
      uiAccountNumber: 'Missing Information'
    },
    {
      state: 'New York',
      unemploymentRate: '1.2%',
      uiEmployerRegistrationNumber: '6652',
      stateIdNumber: '3652',
      prompTaxCode: '3256'
    }
  ]);

  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  const [locations, setLocations] = useState<Location[]>([
    {
      name: 'Branch',
      businessAddress: '19 W 36th St, Fl 10, New York, NY, 10018-7919',
      businessPhone: '(302) 111-1200',
      hasFillingAddress: true,
      hasMailingAddress: true,
      isWorkLocation: true,
    }
  ]);

  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [locationFormData, setLocationFormData] = useState<LocationFormData>({
    locationName: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    isWorkLocation: false,
    isFillingAddress: false,
    isMailingAddress: false
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      setLoading(true);
      try {
        const selectedCompanyStr = localStorage.getItem('selectedCompany');
        if (!selectedCompanyStr) {
          throw new Error('No company selected');
        }

        const selectedCompany = JSON.parse(selectedCompanyStr);
        const response = await api.get('/reports', {
          params: {
            method: 'getCompanyInfo',
            companyId: selectedCompany.companyID
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.Company && response.data.Company[0]) {
          const companyData = response.data.Company[0];
          setEditedCompanyInfo({
            legalBusinessName: companyData.company || '',
            ein: companyData.KYBInformations?.[0]?.ein || '',
            doingBusinessAs: companyData.company || '',
            businessWebsite: companyData.businessWebsite || '',
            businessEmail: companyData.KYBInformations?.[0]?.email || '',
            businessPhone: companyData.KYBInformations?.[0]?.phoneNumber || '',
            businessCategory: companyData.naicsCategory?.naicsCategory || '',
            businessSubCategory: companyData.naicsSubCategory?.naicsSubCategory || '',
            address1: companyData.CompanyLocations?.[0]?.address1 || '',
            address2: companyData.CompanyLocations?.[0]?.address2 || ''
          });
        } else {
          setError('No company data found');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch company information';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setEditedCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) {
        throw new Error('No company selected');
      }

      const selectedCompany = JSON.parse(selectedCompanyStr);
      const response = await api.post('/reports', {
        method: 'updateCompanyInfo',
        companyId: selectedCompany.companyID,
        ...editedCompanyInfo
      });

      setIsEditing(false);
    } catch (err: any) {
      setError('Failed to save company information');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderCompanyInformation = () => (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Company Information</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-600 mb-2">Legal Business Name</h3>
            <p className="text-gray-900">{editedCompanyInfo.legalBusinessName || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-gray-600 mb-2">Ein</h3>
            <p className="text-gray-900">{editedCompanyInfo.ein || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Doing Business As</h3>
            <p className="text-gray-900">{editedCompanyInfo.doingBusinessAs || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Business Website</h3>
            <p className="text-gray-900">{editedCompanyInfo.businessWebsite || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Business Email</h3>
            <p className="text-gray-900">{editedCompanyInfo.businessEmail || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Business Phone</h3>
            <p className="text-gray-900">{editedCompanyInfo.businessPhone || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Business Category</h3>
            <p className="text-gray-900">{editedCompanyInfo.businessCategory || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Business Sub Category</h3>
            <p className="text-gray-900">{editedCompanyInfo.businessSubCategory || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Address 1</h3>
            <p className="text-gray-900">{editedCompanyInfo.address1 || 'Not provided'}</p>
          </div>

          <div>
            <h3 className="text-gray-600 mb-2">Address 2</h3>
            <p className="text-gray-900">{editedCompanyInfo.address2 || 'Not provided'}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          Edit Information
        </button>
      </div>
    </div>
  );

  const handleStateTaxEdit = (index: number) => {
    setEditingStateId(index);
    setEditedStateTaxInfo({ ...stateTaxInfo[index] });
  };

  const handleStateTaxInputChange = (field: keyof StateTaxInfo, value: string) => {
    if (editedStateTaxInfo) {
      setEditedStateTaxInfo(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleStateTaxSave = (index: number) => {
    if (editedStateTaxInfo) {
      const newStateTaxInfo = [...stateTaxInfo];
      newStateTaxInfo[index] = editedStateTaxInfo;
      setStateTaxInfo(newStateTaxInfo);
      setEditingStateId(null);
      setEditedStateTaxInfo(null);
    }
  };

  const handleStateTaxCancel = () => {
    setEditingStateId(null);
    setEditedStateTaxInfo(null);
  };

  const AddStateModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-start mb-6">
            <div className="bg-gray-100 p-3 rounded-lg mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Which state would you like to add?</h2>
              <p className="text-gray-500 mt-2">
                Add your state tax registration details to pay employees.
              </p>
              <p className="text-gray-500">
                Please note that if you are not yet registered in a state
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select State</option>
                {/* Add all US states here */}
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                {/* ... other states ... */}
              </select>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddStateModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle continue action
                  console.log('Selected state:', selectedState);
                  setShowAddStateModal(false);
                }}
                className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStateTaxInformation = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setShowAddStateModal(true)}
        className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
      >
        Add new state tax information
      </button>

      {showAddStateModal && <AddStateModal />}

      <div className="space-y-4">
        {stateTaxInfo.map((state, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">{state.state}</h3>
              <div className="flex space-x-4">
                {editingStateId === index ? (
                  <div className="space-x-4">
                    <button
                      onClick={() => handleStateTaxCancel()}
                      className="text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleStateTaxSave(index)}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStateTaxEdit(index)}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {editingStateId === index ? (
                // Edit mode
                <>
                  {state.unemploymentRate !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Unemployment Rate</span>
                      <input
                        type="text"
                        value={editedStateTaxInfo?.unemploymentRate || ''}
                        onChange={(e) => handleStateTaxInputChange('unemploymentRate', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  )}
                  {state.uiAccountNumber !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">UI Account Number</span>
                      <input
                        type="text"
                        value={editedStateTaxInfo?.uiAccountNumber || ''}
                        onChange={(e) => handleStateTaxInputChange('uiAccountNumber', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  )}
                  {state.uiEmployerRegistrationNumber !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">UI Employer Registration Number</span>
                      <input
                        type="text"
                        value={editedStateTaxInfo?.uiEmployerRegistrationNumber || ''}
                        onChange={(e) => handleStateTaxInputChange('uiEmployerRegistrationNumber', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  )}
                  {state.stateIdNumber !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">NY State ID Number</span>
                      <input
                        type="text"
                        value={editedStateTaxInfo?.stateIdNumber || ''}
                        onChange={(e) => handleStateTaxInputChange('stateIdNumber', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  )}
                  {state.prompTaxCode !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Promp Tax Code</span>
                      <input
                        type="text"
                        value={editedStateTaxInfo?.prompTaxCode || ''}
                        onChange={(e) => handleStateTaxInputChange('prompTaxCode', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  )}
                </>
              ) : (
                // View mode
                <>
                  {state.unemploymentRate !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unemployment Rate</span>
                      <span>{state.unemploymentRate || 'N/A'}</span>
                    </div>
                  )}
                  {state.uiAccountNumber !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">UI Account Number</span>
                      <span>{state.uiAccountNumber}</span>
                    </div>
                  )}
                  {state.uiEmployerRegistrationNumber !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">UI Employer Registration Number</span>
                      <span>{state.uiEmployerRegistrationNumber}</span>
                    </div>
                  )}
                  {state.stateIdNumber !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">NY State ID Number</span>
                      <span>{state.stateIdNumber}</span>
                    </div>
                  )}
                  {state.prompTaxCode !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Promp Tax Code</span>
                      <span>{state.prompTaxCode}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Registration Prompt Card - Now positioned after state listings */}
      <div className="bg-white rounded-lg p-8 shadow-sm text-center max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Not registered in a state?
        </h2>
        <p className="text-gray-600 mb-6">
          Our partners at Abstract Ops can help you get registered
        </p>
        <a 
          href="https://go.abstractops.com/aorollfi?utm_source=rollfi&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button 
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-md hover:bg-teal-700 font-medium"
          >
            Get Registered
          </button>
        </a>
      </div>
    </div>
  );

  const scheduleData: PayScheduleRecord[] = [
    {
      workerType: 'W2',
      status: 'Active',
      compensationFrequency: 'BiWeekly',
      paymentMode: 'Automatic',
      startDate: '07/19/2024',
    },
    {
      workerType: '1099-NEC',
      status: 'Active',
      compensationFrequency: 'BiWeekly',
      paymentMode: 'Automatic',
      startDate: '07/19/2024',
    },
  ];

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setLocationFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setLocationFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle saving location logic here
    setShowAddLocationModal(false);
  };

  const AddLocationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-xl w-full mx-4">
        <h2 className="text-2xl font-semibold mb-6">Add a business address</h2>
        <form onSubmit={handleSaveLocation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location name
            </label>
            <select
              name="locationName"
              value={locationFormData.locationName}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Location name</option>
              <option value="branch">Branch</option>
              <option value="headquarters">Headquarters</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location phone number
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Optional"
              value={locationFormData.phoneNumber}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 1
            </label>
            <input
              type="text"
              name="address1"
              placeholder="Enter address 1"
              value={locationFormData.address1}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 2
            </label>
            <input
              type="text"
              name="address2"
              placeholder="Enter address 2"
              value={locationFormData.address2}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={locationFormData.city}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              name="state"
              value={locationFormData.state}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select State</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
              {/* Add more states as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zipcode
            </label>
            <input
              type="text"
              name="zipcode"
              placeholder="Enter zipcode"
              value={locationFormData.zipcode}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select all that apply
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isWorkLocation"
                  checked={locationFormData.isWorkLocation}
                  onChange={handleLocationInputChange}
                  className="mr-2"
                />
                Work location
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFillingAddress"
                  checked={locationFormData.isFillingAddress}
                  onChange={handleLocationInputChange}
                  className="mr-2"
                />
                Filling address
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isMailingAddress"
                  checked={locationFormData.isMailingAddress}
                  onChange={handleLocationInputChange}
                  className="mr-2"
                />
                Mailing address
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setShowAddLocationModal(false)}
              className="px-4 py-2 text-gray-700 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditLocationModal = () => (
    <div className="fixed inset-0 bg-white flex flex-col min-h-screen z-50">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 bg-gray-100 rounded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="#666"/>
            </svg>
          </span>
          <h1 className="text-2xl font-semibold">Edit your registered company location</h1>
        </div>
        <p className="text-gray-500 mb-8">We also need this for KYB Process</p>

        <form onSubmit={handleSaveLocation} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company location
            </label>
            <select
              name="locationName"
              value={locationFormData.locationName}
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Branch">Branch</option>
              <option value="Headquarters">Headquarters</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location phone number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value="3021111200"
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 1
            </label>
            <input
              type="text"
              name="address1"
              value="19 W 36th St"
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 2
            </label>
            <input
              type="text"
              name="address2"
              value="Fl 10,"
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value="New York"
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              name="state"
              value="NY"
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="NY">NY</option>
              {/* Add other states as needed */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zipcode
            </label>
            <input
              type="text"
              name="zipcode"
              value="10018-7919"
              onChange={handleLocationInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select all that apply
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isWorkLocation"
                  checked={true}
                  onChange={handleLocationInputChange}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded mr-2"
                />
                <span className="text-gray-700">Work location</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFillingAddress"
                  checked={true}
                  onChange={handleLocationInputChange}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded mr-2"
                />
                <span className="text-gray-700">Filling address</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isMailingAddress"
                  checked={true}
                  onChange={handleLocationInputChange}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded mr-2"
                />
                <span className="text-gray-700">Mailing address</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="text-gray-700 font-normal hover:text-gray-900"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#008080] text-white rounded-md hover:bg-[#006666] font-normal"
            >
              Save and continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="p-8">
      <button 
        className="bg-teal-600 text-white px-6 py-3 rounded-lg text-lg font-medium mb-8"
        onClick={() => setShowAddLocationModal(true)}
      >
        Add new location
      </button>

      {showAddLocationModal && <AddLocationModal />}
      
      <div className="space-y-6">
        {locations.map((location, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">{location.name}</h2>
              <button 
                className="text-teal-600 font-medium hover:text-teal-700"
                onClick={() => {/* Handle edit */}}
              >
                Edit
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-gray-600 font-medium mb-2">Business address</h3>
                <p className="text-gray-700">{location.businessAddress}</p>
              </div>

              <div>
                <h3 className="text-gray-600 font-medium mb-2">Business phone number</h3>
                <p className="text-gray-700">{location.businessPhone}</p>
              </div>

              <div>
                <h3 className="text-gray-600 font-medium mb-2">Filling address</h3>
                {location.hasFillingAddress && (
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div>
                <h3 className="text-gray-600 font-medium mb-2">Mailing address</h3>
                {location.hasMailingAddress && (
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div>
                <h3 className="text-gray-600 font-medium mb-2">Work location</h3>
                {location.isWorkLocation && (
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaySchedule = () => (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Pay Schedule</h2>
      {/* Add your pay schedule content here */}
    </div>
  );

  // Add logging to render function
  useEffect(() => {
    console.log('🎨 Rendering CompanyPage with state:', {
      activeTab,
      isEditing,
      loading,
      error,
      editingStateId,
      showAddStateModal,
      showAddLocationModal
    });
  }, [activeTab, isEditing, loading, error, editingStateId, showAddStateModal, showAddLocationModal]);

  return (
    <div className="p-8">
      <div className="mb-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-4">
            {['Company information', 'State tax information', 'Locations', 'Pay schedule'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 ${
                  activeTab === tab
                    ? 'bg-teal-600 text-white rounded-t-lg'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'Company information' && renderCompanyInformation()}
      {activeTab === 'State tax information' && renderStateTaxInformation()}
      {activeTab === 'Locations' && renderLocations()}
      {activeTab === 'Pay schedule' && renderPaySchedule()}
    </div>
  );
};

export default CompanyPage;
