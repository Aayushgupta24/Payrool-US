import { useNavigate } from 'react-router-dom';
import { useCopilotAction } from '@copilotkit/react-core';

export function useSmartNavigation() {
  const navigate = useNavigate();

  // Updated routeMap with more specific and comprehensive mappings
  const routeMap = {
    // Admin routes
    'admin': '/admin',
    'admin dashboard': '/admin',
    'admin users': '/admin/users',
    'users': '/admin/users',
    'manage users': '/admin/users',
    // Employee routes
    'employee': '/employee/dashboard',
    'employee dashboard': '/employee/dashboard',
    'employee documents': '/employee/documents',
    'employee details': '/employee/details',
    'employee paystubs': '/employee/paystubs',
    'my documents': '/employee/documents',
    'my details': '/employee/details',
    'my paystubs': '/employee/paystubs',
    
    // Employer routes
    'employer': '/employer/dashboard',
    'employer dashboard': '/employer/dashboard',
    'hiring': '/employer/hiring',
    'add employee': '/employer/hiring/add-employee',
    'new employee': '/employer/hiring/add-employee',
    'add contractor': '/employer/hiring/add-independent-contractor',
    'new contractor': '/employer/hiring/add-independent-contractor',
    'add business': '/employer/hiring/add-business-contractor',
    'benefits': '/employer/benefits',
    'taxes': '/employer/taxes',
    'payroll': '/employer/payroll',
    'team': '/employer/team',
    'company': '/employer/company',
    'documents': '/employer/documents',
    'settings': '/employer/settings',
    'help': '/employer/help'
  };

  useCopilotAction({
    name: "navigate",
    description: "Navigate to a different page in the application",
    parameters: [
      {
        name: "destination",
        type: "string",
        description: "The page to navigate to (e.g., 'admin dashboard', 'users', 'employee documents', etc.)"
      }
    ],
    handler: async ({ destination }) => {
      const normalizedDestination = destination.toLowerCase().trim();
      
      // Try exact match first
      let path = routeMap[normalizedDestination];
      
      // If no exact match, try partial match
      if (!path) {
        const matchingEntry = Object.entries(routeMap).find(([key]) => 
          normalizedDestination.includes(key.toLowerCase())
        );
        path = matchingEntry?.[1];
      }

      if (path) {
        navigate(path);
        return `Navigated to ${destination}`;
      }
      
      return `Could not find a matching route for "${destination}". Available destinations are: ${Object.keys(routeMap).join(', ')}`;
    }
  });

  useCopilotAction({
    name: "switchTo",
    description: "Switch between admin, employee, or employer view",
    parameters: [
      {
        name: "view",
        type: "string",
        description: "The view to switch to (admin/employee/employer)"
      }
    ],
    handler: async ({ view }) => {
      const normalizedView = view.toLowerCase().trim();
      
      switch (normalizedView) {
        case 'admin':
        case 'admin dashboard':
        case 'admin view':
          navigate('/admin');
          return 'Switched to admin view';
        
        case 'employee':
        case 'employee dashboard':
        case 'employee view':
          navigate('/employee/dashboard');
          return 'Switched to employee view';
        
        case 'employer':
        case 'employer dashboard':
        case 'employer view':
          navigate('/employer/dashboard');
          return 'Switched to employer view';
        
        default:
          return `Invalid view: ${view}. Please specify 'admin', 'employee', or 'employer'.`;
      }
    }
  });
}





