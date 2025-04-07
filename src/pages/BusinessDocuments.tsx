import React from 'react';
import DocumentTable from '../components/DocumentTable';

const BusinessDocuments: React.FC = () => {
  // Example data - replace with actual data from your backend
  const businessDocuments = [
    {
      id: '1',
      fileName: 'Business License.pdf',
      uploadedBy: 'Admin',
      dateUploaded: '2024-01-15'
    },
    {
      id: '2',
      fileName: 'Tax Documents.pdf',
      uploadedBy: 'Admin',
      dateUploaded: '2024-01-10'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Business Documents</h2>
      <DocumentTable documents={businessDocuments} />
    </div>
  );
};

export default BusinessDocuments;