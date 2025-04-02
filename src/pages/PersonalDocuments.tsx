import React from 'react';
import DocumentTable from '../components/DocumentTable';
import { Document } from '../types';

const PersonalDocuments: React.FC = () => {
  // In a real app, this would come from an API
  const documents: Document[] = [];

  return (
    <div className="w-full">
      <DocumentTable documents={documents} />
    </div>
  );
};

export default PersonalDocuments;