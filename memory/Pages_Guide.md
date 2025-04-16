# Pages Guide

## Overview

This document provides an overview of the pages and routes in the US Payroll application. The application is structured with different page components for various user roles and functionalities.

## Page Structure

Pages are organized in the `src/pages/` directory:

```
src/pages/
├── AddBusinessContractorPage.tsx
├── AddEmployeePage.tsx
├── AddIndependentContractorPage.tsx
├── AdminDashboard.tsx
├── BenefitsPage.tsx
├── BusinessDocuments.tsx
├── CompanyPage.tsx
├── DocumentsPage.tsx
├── EmployeeDashboard.css
├── EmployeeDashboard.tsx
├── EmployeeDetailsPage.tsx
├── EmployerDashboard.tsx
├── EmployerDocumentsPage.tsx
├── EmployerHelpPage.tsx
├── EmployerSettingsPage.tsx
├── ForgotPasswordPage.tsx
├── HiringPage.tsx
├── LoginPage.tsx
├── PayrollPage.tsx
├── PaystubsPage.tsx
├── PersonalDocuments.tsx
├── SignupPage.tsx
├── TaxesPage.tsx
├── TeamDocuments.tsx
├── TeamPage.tsx
└── UsersPage.tsx
```

## Routing Structure

The application uses React Router for navigation, with routes defined in `src/routes.tsx`. The routing structure is organized by user roles:

### Authentication Routes

- `/login` - User login page
- `/signup` - New user registration
- `/forgot-password` - Password recovery

### Admin Routes

- `/admin` - Admin dashboard
- `/admin/users` - User management for administrators

### Employee Routes

Employee routes are nested under a shared layout (`EmployeeLayout`):

- `/employee/dashboard` - Employee dashboard
- `/employee/details` - Employee personal details
- `/employee/documents` - Document management
  - `/employee/documents/business` - Business documents
  - `/employee/documents/team` - Team documents
  - `/employee/documents/personal` - Personal documents
- `/employee/paystubs` - Paystub history and details

### Employer Routes

Employer routes are nested under a shared layout (`EmployerLayout`):

- `/employer/dashboard` - Employer dashboard
- `/employer/payroll` - Payroll management
- `/employer/hiring` - Hiring and onboarding
  - `/employer/hiring/add-employee` - Add new employee
  - `/employer/hiring/add-independent-contractor` - Add independent contractor
  - `/employer/hiring/add-business-contractor` - Add business contractor
- `/employer/team` - Team management
- `/employer/company` - Company settings
- `/employer/documents` - Document management
- `/employer/benefits` - Benefits management
- `/employer/taxes` - Tax management
- `/employer/settings` - Account settings
- `/employer/help` - Help and support

## Key Pages

### Authentication Pages

#### LoginPage.tsx

Handles user authentication with email/password or OTP.

#### SignupPage.tsx

Manages new user registration.

#### ForgotPasswordPage.tsx

Provides password recovery functionality.

### Dashboard Pages

#### EmployeeDashboard.tsx

The main dashboard for employees, displaying:
- Personal information
- Recent paystubs
- Upcoming payments
- Document access
- Task management

#### EmployerDashboard.tsx

The main dashboard for employers, displaying:
- Company overview
- Team statistics
- Payroll status
- Compliance alerts
- Recent activities

#### AdminDashboard.tsx

The main dashboard for administrators, displaying:
- System statistics
- User management
- Company management
- Audit logs

### Functional Pages

#### HiringPage.tsx

Manages the hiring and onboarding process:

```tsx
const HiringPage: React.FC = () => {
  useSmartNavigation();
  const navigate = useNavigate();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<HiringFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfJoin: '',
    workerType: 'W2',
    jobTitle: '',
    companyLocationCategory: 'Remote',
    stateCode: '',
    salary: 0
  });

  // Component implementation...

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Hiring and Onboarding</h1>
          <div className="space-x-4">
            <button
              onClick={handleAddEmployee}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
            <button
              onClick={handleAddIndependentContractor}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Independent Contractor
            </button>
            <button
              onClick={handleAddBusinessContractor}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add Business Contractor
            </button>
          </div>
        </div>

        {/* Team members table */}
      </div>
    </div>
  );
};
```

**Key Features:**
- Team member listing
- Add new employees/contractors
- AI-assisted actions through Copilot integration
- Form validation and error handling

#### UsersPage.tsx

Manages user accounts and permissions:

```tsx
const UsersPage: React.FC = () => {
  useSmartNavigation();
  const { intent, setIntent } = useNavigationStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<AddUserFormData>({
    // Form fields...
  });

  // Component implementation...

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Users</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            <FiUserPlus size={20} />
            Add new user
          </button>
        </div>

        {/* User table and add user modal */}
      </div>
    </div>
  );
};
```

**Key Features:**
- User listing with filtering
- Add/edit/deactivate users
- Role management
- AI-assisted actions through Copilot integration

#### PayrollPage.tsx

Manages payroll processing and history.

**Key Features:**
- Payroll cycle management
- Employee payment processing
- Contractor payment processing
- Tax calculations
- Payment history

#### DocumentsPage.tsx

Manages document storage and access.

**Key Features:**
- Document categorization (business, team, personal)
- Document upload/download
- Document sharing
- Version control

## Page Integration with AI Assistant

Pages integrate with the CopilotKit for AI assistance:

```tsx
// Example from HiringPage.tsx
useCopilotReadable({
  name: "hiringFormData",
  description: "Current state of the hiring form",
  value: formData
});

useCopilotAction({
  name: "addNewEmployee",
  description: "Add a new employee to the system",
  parameters: [
    { name: "firstName", type: "string", description: "Employee's first name" },
    // Other parameters...
  ],
  run: async (params) => {
    // Implementation...
  }
});
```

This allows the AI assistant to:
1. Read page state and context
2. Perform actions on behalf of the user
3. Provide contextual assistance

## Page Navigation

The application uses several navigation mechanisms:

### Standard React Router Navigation

```tsx
const navigate = useNavigate();

const handleAddEmployee = () => {
  navigate('/employer/hiring/add-employee');
};
```

### Smart Navigation Hook

```tsx
useSmartNavigation(); // Custom hook for AI-assisted navigation
```

### Navigation Store

```tsx
const { intent, setIntent } = useNavigationStore();

useEffect(() => {
  if (intent?.page === 'users') {
    if (intent.action === 'openAddModal') {
      setShowAddModal(true);
    }
    // Other intent handling...
    setIntent(null);
  }
}, [intent, setIntent]);
```

## Page Best Practices

When creating new pages:

1. Place the page component in the `src/pages/` directory
2. Add the route to `src/routes.tsx`
3. Use the appropriate layout component
4. Implement loading states for data fetching
5. Handle errors appropriately
6. Use Tailwind CSS for styling
7. Integrate with CopilotKit for AI assistance when appropriate
8. Implement proper form validation
9. Use the navigation store for complex navigation scenarios
10. Follow the established pattern for data fetching and state management
