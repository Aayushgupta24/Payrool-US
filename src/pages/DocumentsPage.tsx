import React, { useState } from 'react';
import EmployerLayout from '../layouts/EmployerLayout';

const DocumentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'team'>('business');

  const businessDocuments = [
    {
      fileName: 'payroll_journal_report_20240901-20240915',
      view: 'Admin only',
      dateUploaded: '09/19/2024'
    },
    {
      fileName: 'Handbook',
      view: 'Everyone',
      dateUploaded: '08/02/2024'
    }
  ];

  const teamDocuments = [
    {
      fileName: 'Team Guidelines 2024',
      view: 'Everyone',
      dateUploaded: '09/15/2024'
    },
    {
      fileName: 'Project Templates',
      view: 'Team Members',
      dateUploaded: '09/10/2024'
    }
  ];

  const currentDocuments = activeTab === 'business' ? businessDocuments : teamDocuments;

  return (
    <EmployerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 ${
                activeTab === 'business'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('business')}
            >
              Business documents
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'team'
                  ? 'bg-teal-600 text-white rounded'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('team')}
            >
              Team documents
            </button>
          </div>
          <button className="px-4 py-2 text-teal-600 border border-teal-600 rounded hover:bg-teal-50">
            Upload Document
          </button>
        </div>

        <div className="bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 text-gray-600 font-normal">File name</th>
                <th className="text-left py-4 px-6 text-gray-600 font-normal">View</th>
                <th className="text-left py-4 px-6 text-gray-600 font-normal">Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {currentDocuments.map((doc, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-4 px-6 text-gray-900">{doc.fileName}</td>
                  <td className="py-4 px-6 text-gray-600">{doc.view}</td>
                  <td className="py-4 px-6 text-gray-600">{doc.dateUploaded}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex justify-between items-center text-sm text-gray-500">
            <span>1-2 of 2</span>
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
      </div>
    </EmployerLayout>
  );
};

export default DocumentsPage;
