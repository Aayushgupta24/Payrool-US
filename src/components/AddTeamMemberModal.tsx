import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserPlus, FiUsers, FiBriefcase, FiX } from 'react-icons/fi';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl p-6 w-[480px] shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Team Member</h2>
              <p className="text-gray-600">Choose the type of team member you'd like to add</p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelection('employee')}
                className="w-full bg-teal-50 p-4 rounded-xl hover:bg-teal-100 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <FiUserPlus className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-teal-700">Employee</h3>
                    <p className="text-sm text-teal-600">Full-time or part-time W2 employee</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelection('independent')}
                className="w-full bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FiUsers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-blue-700">Independent Contractor</h3>
                    <p className="text-sm text-blue-600">1099 independent contractor</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelection('business')}
                className="w-full bg-purple-50 p-4 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FiBriefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold text-purple-700">Business Contractor</h3>
                    <p className="text-sm text-purple-600">Contract with a business entity</p>
                  </div>
                </div>
              </motion.button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help choosing? Contact our support team
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTeamMemberModal;
