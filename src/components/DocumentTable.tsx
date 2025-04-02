import React from 'react';
import { Document } from '../types';

interface DocumentTableProps {
  documents: Document[];
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-3 p-4 font-medium text-gray-700 border-b border-gray-200">
          <div>File name</div>
          <div>Uploaded by</div>
          <div>Date uploaded</div>
        </div>
        
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No documents found
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-3 p-4 border-b border-gray-200">
              <div>{doc.fileName}</div>
              <div>{doc.uploadedBy}</div>
              <div>{doc.dateUploaded}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentTable;
