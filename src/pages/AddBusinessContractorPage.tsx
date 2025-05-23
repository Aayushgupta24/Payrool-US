import React from 'react';

const AddBusinessContractorPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Business Contractor</h1>
      <form className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Business Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tax ID / EIN</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person First Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person Last Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Phone</label>
            <input
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Contract Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Services Provided</label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contract Value</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Billing Frequency</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Project Milestones</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
          >
            Add Business Contractor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBusinessContractorPage;