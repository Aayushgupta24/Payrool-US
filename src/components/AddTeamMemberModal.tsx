import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelection = (type: string) => {
    onClose();
    switch (type) {
      case 'employee':
        navigate('/employer/hiring/add-employee');
        break;
      case 'independent':
        navigate('/employer/hiring/add-independent-contractor');
        break;
      case 'business':
        navigate('/employer/hiring/add-business-contractor');
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>
        <div className="space-y-3">
          <button
            onClick={() => handleSelection('employee')}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 flex items-center"
          >
            <div>
              <div className="font-medium">Employee</div>
              <div className="text-sm text-gray-500">Full-time or part-time employee</div>
            </div>
          </button>

          <button
            onClick={() => handleSelection('independent')}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 flex items-center"
          >
            <div>
              <div className="font-medium">Independent Contractor</div>
              <div className="text-sm text-gray-500">Individual providing services</div>
            </div>
          </button>

          <button
            onClick={() => handleSelection('business')}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 flex items-center"
          >
            <div>
              <div className="font-medium">Business Contractor</div>
              <div className="text-sm text-gray-500">Company or business entity</div>
            </div>
          </button>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;