import React from 'react';
import DocumentTable from '../components/DocumentTable';

const TeamDocuments: React.FC = () => {
  // Example data - replace with actual data from your backend
  const teamDocuments = [
    {
      id: '1',
      fileName: 'Employee Handbook.pdf',
      uploadedBy: 'HR Manager',
      dateUploaded: '2024-01-15'
    },
    {
      id: '2',
      fileName: 'Company Policies.pdf',
      uploadedBy: 'Admin',
      dateUploaded: '2024-01-10'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Team Documents</h2>
      <DocumentTable documents={teamDocuments} />
    </div>
  );
};

export default TeamDocuments;
