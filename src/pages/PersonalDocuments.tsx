import React from 'react';
import DocumentTable from '../components/DocumentTable';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const PersonalDocuments: React.FC = () => {
  useSmartNavigation();
  // Example data - replace with actual data from your backend
  const personalDocuments = [
    {
      id: '1',
      fileName: 'W-2 Form.pdf',
      uploadedBy: 'John Doe',
      dateUploaded: '2024-01-20'
    },
    {
      id: '2',
      fileName: 'Direct Deposit Form.pdf',
      uploadedBy: 'John Doe',
      dateUploaded: '2024-01-18'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Personal Documents</h2>
      <DocumentTable documents={personalDocuments} />
    </div>
  );
};

export default PersonalDocuments;
