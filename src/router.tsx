import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployerDashboard from './pages/EmployerDashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/employer/dashboard",
    element: <EmployerDashboard />
  }
]);

export default router;
