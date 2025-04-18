import { createBrowserRouter } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AddCompanyPage from './pages/AddCompanyPage';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { CopilotProvider, CopilotNavigation } from 'copilot';
import { Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <CopilotProvider>
        <CopilotNavigation />
        <Navigate to="/login" />
      </CopilotProvider>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/admin/add-company',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AddCompanyPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/employer/dashboard',
    element: (
      <ProtectedRoute requiredRole="employer">
        <EmployerDashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/employee/dashboard',
    element: (
      <ProtectedRoute requiredRole="employee">
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);
