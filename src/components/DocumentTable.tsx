import React from 'react';
import { Document } from '../types';

interface DocumentTableProps {
  documents: Document[];
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
        
        <div className="p-4 flex justify-end items-center text-sm text-gray-500">
          <span>1–0 of 0</span>
          <button className="ml-4 p-1 rounded hover:bg-gray-100 disabled:opacity-30" disabled>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="ml-1 p-1 rounded hover:bg-gray-100 disabled:opacity-30" disabled>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentTable;