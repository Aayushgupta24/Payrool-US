import { createBrowserRouter, Navigate } from 'react-router-dom';
import CopilotProvider from './components/CopilotProvider';
import { CopilotNavigation } from './components/CopilotNavigation';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import DocumentsPage from './pages/DocumentsPage';
import TeamDocuments from './pages/TeamDocuments';
import PersonalDocuments from './pages/PersonalDocuments';
import PaystubsPage from './pages/PaystubsPage';
import UsersPage from './pages/UsersPage';
import EmployerLayout from './layouts/EmployerLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import EmployerDashboard from './pages/EmployerDashboard';
import PayrollPage from './pages/PayrollPage';
import HiringPage from './pages/HiringPage';
import TeamPage from './pages/TeamPage';
import CompanyPage from './pages/CompanyPage';
import EmployerDocumentsPage from './pages/EmployerDocumentsPage';
import BenefitsPage from './pages/BenefitsPage';
import TaxesPage from './pages/TaxesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import AddIndependentContractorPage from './pages/AddIndependentContractorPage';
import AddBusinessContractorPage from './pages/AddBusinessContractorPage';
import BusinessDocuments from './pages/BusinessDocuments';
import EmployerSettingsPage from './pages/EmployerSettingsPage';
import EmployerHelpPage from './pages/EmployerHelpPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CopilotProvider>
        <CopilotNavigation />
        <Navigate to="/login" />
      </CopilotProvider>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/users",
    element: <UsersPage />,
  },
  // Employee routes with shared layout
  {
    path: "/employee",
    element: <EmployeeLayout />,
    children: [
      {
        path: "dashboard",
        element: <EmployeeDashboard />,
      },
      {
        path: "details",
        element: <EmployeeDetailsPage />,
      },
      {
        path: "documents",
        element: <DocumentsPage />,
        children: [
          {
            path: "business",
            element: <BusinessDocuments />,
          },
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
        path: "paystubs",
        element: <PaystubsPage />,
      },
    ]
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
      },
      {
        path: "settings",
        element: <EmployerSettingsPage />,
      },
      {
        path: "help",
        element: <EmployerHelpPage />,
      }
    ]
  }
]);
