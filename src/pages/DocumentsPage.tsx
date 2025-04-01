import React from 'react';
import Layout from '../components/Layout';
import DocumentTable from '../components/DocumentTable';
import Header from '../components/Header';
import { Document } from '../types';

const DocumentsPage: React.FC = () => {
  // In a real app, this would come from an API
  const documents: Document[] = [];

  return (
    <Layout>
      <div className="p-8">
        <Header />
        <DocumentTable documents={documents} />
      </div>
    </Layout>
  );
};

export default DocumentsPage;