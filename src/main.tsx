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
import EmployerLayout from './layouts/EmployerLayout';
import EmployerDashboard from './pages/EmployerDashboard';
import PayrollPage from './pages/PayrollPage';
import HiringPage from './pages/HiringPage';
import TeamPage from './pages/TeamPage';
import CompanyPage from './pages/CompanyPage';
import EmployerDocumentsPage from './pages/EmployerDocumentsPage';
import BenefitsPage from './pages/BenefitsPage';
import TaxesPage from './pages/TaxesPage';
import './index.css';
import AddEmployeePage from './pages/AddEmployeePage';
import AddIndependentContractorPage from './pages/AddIndependentContractorPage.tsx';
import AddBusinessContractorPage from './pages/AddBusinessContractorPage.tsx';

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
  // Employee routes
  {
    path: "/employee",
    element: <EmployeeDashboard />,
  },
  {
    path: "/employee/details",
    element: <EmployeeDetailsPage />,
  },
  {
    path: "/employer/documents",
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
    path: "/employer/paystubs",
    element: <PaystubsPage />,
  },
  // Employer routes with shared layout
  {
    path: "/employer",
    element: <EmployerLayout />,
    children: [
      {
        path: "dashboard",
        element: <EmployerDashboard />,
      },
      {
        path: "payroll",
        element: <PayrollPage />,
      },
      {
        path: "hiring",
        element: <HiringPage />,
      },
      {
        path: "hiring/add-employee",
        element: <AddEmployeePage />,
      },
      {
        path: "hiring/add-independent-contractor",
        element: <AddIndependentContractorPage />,
      },
      {
        path: "hiring/add-business-contractor",
        element: <AddBusinessContractorPage />,
      },
      {
        path: "team",
        element: <TeamPage />,
      },
      {
        path: "company",
        element: <CompanyPage />,
      },
      {
        path: "documents",
        element: <EmployerDocumentsPage />,
      },
      {
        path: "benefits",
        element: <BenefitsPage />,
      },
      {
        path: "taxes",
        element: <TaxesPage />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
