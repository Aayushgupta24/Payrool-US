import { createBrowserRouter } from 'react-router-dom';
import CopilotProvider from './components/CopilotProvider';
import { CopilotNavigation } from './components/CopilotNavigation';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <CopilotProvider>
        <CopilotNavigation />
        {/* Your root layout component */}
      </CopilotProvider>
    ),
    children: [
      {
        path: 'employer/dashboard',
        element: <EmployerDashboard />
      },
      {
        path: 'employee/dashboard',
        element: <EmployeeDashboard />
      },
      {
        path: 'admin/dashboard',
        element: <AdminDashboard />
      },
      // ... other routes
    ]
  }
]);
