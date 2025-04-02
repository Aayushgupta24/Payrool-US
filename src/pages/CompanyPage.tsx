import React, { useState } from 'react';

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

const CompanyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pay schedule');
  
  const tabs = [
    'Company information',
    'State tax information',
    'Locations',
    'Pay schedule'
  ];

  // Mock company info data
  const companyInfo: CompanyInfo = {
    legalBusinessName: 'Growth Pods Demo',
    ein: '12-3456789',
    doingBusinessAs: 'Growth Pods',
    businessWebsite: 'www.growthpods.com',
    businessEmail: 'contact@growthpods.com',
    businessPhone: '(555) 123-4567',
    businessCategory: 'Technology',
    businessSubCategory: 'Software Development',
    address1: '123 Tech Street',
    address2: 'Suite 100'
  };

  const stateTaxInfo: StateTaxInfo[] = [
    {
      state: 'Alaska',
      unemploymentRate: '',
      uiAccountNumber: 'Missing Information',
    },
    {
      state: 'New York',
      unemploymentRate: '1.2%',
      uiEmployerRegistrationNumber: '6652',
      stateIdNumber: '3652',
      prompTaxCode: '3256',
    }
  ];

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

  return (
    <div className="p-8">
      <div className="mb-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
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

      {activeTab === 'Company information' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Company Information</h2>
              <button className="text-teal-600 hover:text-teal-700 font-medium">
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Legal business name</label>
                <div className="text-gray-900">{companyInfo.legalBusinessName}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">EIN</label>
                <div className="text-gray-900">{companyInfo.ein}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Doing business as</label>
                <div className="text-gray-900">{companyInfo.doingBusinessAs}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Business website</label>
                <div className="text-gray-900">{companyInfo.businessWebsite}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Business email</label>
                <div className="text-gray-900">{companyInfo.businessEmail}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Business phone number</label>
                <div className="text-gray-900">{companyInfo.businessPhone}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Business category</label>
                <div className="text-gray-900">{companyInfo.businessCategory}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Business sub category</label>
                <div className="text-gray-900">{companyInfo.businessSubCategory}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Address 1</label>
                <div className="text-gray-900">{companyInfo.address1}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Address 2</label>
                <div className="text-gray-900">{companyInfo.address2}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'State tax information' && (
        <div className="space-y-6">
          <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700">
            Add new state tax information
          </button>

          {/* State Tax Information Cards */}
          <div className="space-y-4">
            {stateTaxInfo.map((state, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">{state.state}</h3>
                  <button className="text-teal-600 hover:text-teal-700">
                    Edit
                  </button>
                </div>

                <div className="space-y-3">
                  {state.unemploymentRate !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unemployment Rate</span>
                      <span>{state.unemploymentRate || '0'}%</span>
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
                </div>
              </div>
            ))}
          </div>

          {/* Not registered section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-2">Not registered in a state?</h3>
            <p className="text-gray-600 mb-4">
              Our partners at Abstract Ops can help you get registered
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 w-full">
              Get Registered
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Locations' && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-medium mb-6">Locations</h2>
          {/* Add locations content here */}
        </div>
      )}

      {activeTab === 'Pay schedule' && (
        <div className="bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Worker Type</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Compensation Frequency</th>
                <th className="text-left py-3 px-4">Payment Mode</th>
                <th className="text-left py-3 px-4">Start Date</th>
                <th className="text-left py-3 px-4">End Date</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 px-4">{record.workerType}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      record.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{record.compensationFrequency}</td>
                  <td className="py-4 px-4">{record.paymentMode}</td>
                  <td className="py-4 px-4">{record.startDate}</td>
                  <td className="py-4 px-4">{record.endDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">1-2 of 2</div>
            <div className="flex space-x-2">
              <button className="p-1 rounded hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;



