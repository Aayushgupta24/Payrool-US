import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-gray-700 border-b-2 border-transparent hover:border-gray-300">
            Team documents
          </button>
          <button className="px-4 py-2 text-white bg-teal-600 rounded">
            Personal documents
          </button>
        </div>
        <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50">
          Upload document
        </button>
      </div>
    </div>
  );
};

export default Header;
