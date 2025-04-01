import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import DocumentsPage from './pages/DocumentsPage';
import PaystubsPage from './pages/PaystubsPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/employee",
    element: <EmployeeDashboard />,
  },
  {
    path: "/employee/details",
    element: <EmployeeDetailsPage />,
  },
  {
    path: "/employee/documents",
    element: <DocumentsPage />,
  },
  {
    path: "/employee/paystubs",
    element: <PaystubsPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
