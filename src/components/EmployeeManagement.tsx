import React from 'react';
import { useCopilotActions } from '../hooks/useCopilotActions';

const EmployeeManagement: React.FC = () => {
  const { performAction, isLoading } = useCopilotActions();

  const handleAddEmployee = async () => {
    try {
      const result = await performAction(
        "Add a new employee named John Doe as a Software Engineer with a salary of $100,000",
        "ADD_EMPLOYEE",
        {
          department: "Engineering",
          position: "Software Engineer"
        }
      );
      console.log('Action result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleAddEmployee}
        disabled={isLoading}
      >
        {isLoading ? 'Adding Employee...' : 'Add Employee'}
      </button>
    </div>
  );
};

export default EmployeeManagement;
