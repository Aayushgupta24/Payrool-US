import React from 'react';
import { Outlet } from 'react-router-dom';

const DocumentsPage: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <h1 className="text-2xl font-medium mb-8">Documents</h1>
      <Outlet />
    </div>
  );
};

export default DocumentsPage;
