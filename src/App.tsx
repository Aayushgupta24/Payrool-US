import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DocumentTable from './components/DocumentTable';
import { Document } from './types';

const App: React.FC = () => {
  // In a real app, this would come from an API
  const documents: Document[] = [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        <Header />
        <DocumentTable documents={documents} />
      </div>
    </div>
  );
};

export default App;


