  import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import DocumentsPage from './pages/DocumentsPage';
import TeamDocuments from './pages/TeamDocuments';
import PersonalDocuments from './pages/PersonalDocuments';
import PaystubsPage from './pages/PaystubsPage';
import UsersPage from './pages/UsersPage';
import './index.css';
import EmployerDashboard from './pages/EmployerDashboard';

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
    path: "/admin/users",
    element: <UsersPage />,
  },
  {
    path: "/employer/dashboard",
    element: <EmployerDashboard />,
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
    children: [
      {
        path: "team",
        element: <TeamDocuments />,
      },
      {
        path: "personal",
        element: <PersonalDocuments />,
      }
    ]
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
