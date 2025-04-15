import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopilotAction } from '@copilotkit/react-core';

export const CopilotNavigation: React.FC = () => {
  const navigate = useNavigate();

  useCopilotAction({
    name: "switchView",
    description: "Switch between different views (employer/employee/admin)",
    parameters: [
      { 
        name: "viewType", 
        type: "string", 
        description: "Type of view to switch to (employer, employee, or admin)" 
      }
    ],
    run: async (params) => {
      const view = params.viewType.toLowerCase();
      switch (view) {
        case 'employer':
          navigate('/employer/dashboard');
          return 'Switched to employer dashboard';
        case 'employee':
          navigate('/employee/dashboard');
          return 'Switched to employee dashboard';
        case 'admin':
          navigate('/admin');
          return 'Switched to admin dashboard';
        default:
          return "Invalid view type. Please specify employer, employee, or admin.";
      }
    }
  });

  return null;
};
