# Components Guide

## Overview

This document provides an overview of the key components used in the US Payroll application. The application follows a component-based architecture using React and TypeScript.

## Component Structure

Components are organized in the `src/components/` directory, with specialized components grouped into subdirectories:

```
src/components/
├── AddTeamMemberModal.tsx
├── AdminDashboard.tsx
├── CopilotNavigation.tsx
├── CopilotProvider.tsx
├── DocumentTable.tsx
├── EmployeeDashboard.tsx
├── EmployeeManagement.tsx
├── EmployeeSidebar.tsx
├── EmployerSidebar.tsx
├── Header.tsx
├── Layout.tsx
├── PayrollDetails.tsx
├── Sidebar.tsx
├── StatsCard.tsx
├── TaskCard.tsx
├── UserCount.tsx
├── YourDetails.tsx
├── company/
│   └── PaySchedule.tsx
└── payroll/
    ├── ContractorPayroll.tsx
    ├── EmployeePayroll.tsx
    ├── PayrollHistory.tsx
    └── PayrollSummary.tsx
```

## Core Components

### Layout Components

#### Layout.tsx

The main layout wrapper that provides the application's basic structure.

```tsx
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        {children}
        <CopilotPopup
          instructions={`You are the Payroll AI Agent...`}
          labels={{
            title: "Payroll AI Agent",
            initial: "Need help with anything?",
            placeholder: "Ask me anything about your account..."
          }}
          windowTitle="Payroll AI Agent"
          className="bottom-4 right-4"
        />
      </div>
    </div>
  );
};
```

**Props:**
- `children`: React nodes to be rendered within the layout

**Features:**
- Includes the Sidebar component
- Wraps content in a flex container
- Integrates the CopilotPopup for AI assistance

#### EmployeeLayout.tsx and EmployerLayout.tsx

Specialized layouts for employee and employer views, located in `src/layouts/`.

### Navigation Components

#### Sidebar.tsx

The main navigation sidebar used throughout the application.

**Features:**
- Navigation links
- User profile information
- Role-based menu items

#### EmployeeSidebar.tsx and EmployerSidebar.tsx

Role-specific sidebar components with tailored navigation options.

### Dashboard Components

#### EmployeeDashboard.tsx

Dashboard view for employees.

**Features:**
- Personal information
- Recent paystubs
- Document access
- Task management

#### EmployerDashboard.tsx

Dashboard view for employers/administrators.

**Features:**
- Company overview
- Team management
- Payroll status
- Compliance alerts

### UI Components

#### Header.tsx

A simple header component used across various pages.

```tsx
const Header: React.FC = () => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-gray-700 border-b-2 border-transparent hover:border-gray-300">
            Team documents
          </button>
          <button className="px-4 py-2 text-white bg-teal-600 rounded">
            Personal documents
          </button>
        </div>
        <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50">
          Upload document
        </button>
      </div>
    </div>
  );
};
```

#### StatsCard.tsx

Reusable card component for displaying statistics.

#### TaskCard.tsx

Component for displaying task information.

### Functional Components

#### EmployeeManagement.tsx

Component for managing employee operations.

```tsx
const EmployeeManagement: React.FC = () => {
  const { performAction, isLoading } = useCopilotActions();

  const handleAddEmployee = async () => {
    try {
      const result = await performAction(
        "Add a new employee named John Doe as a Software Engineer with a salary of $100,000",
        "ADD_EMPLOYEE",
        {
          department: "Engineering",
          position: "Software Engineer"
        }
      );
      console.log('Action result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleAddEmployee}
        disabled={isLoading}
      >
        {isLoading ? 'Adding Employee...' : 'Add Employee'}
      </button>
    </div>
  );
};
```

**Features:**
- Uses the `useCopilotActions` hook for AI-assisted actions
- Handles loading states
- Provides error handling

### Payroll Components

Located in `src/components/payroll/`:

#### EmployeePayroll.tsx

Handles employee payroll information and processing.

#### ContractorPayroll.tsx

Manages contractor payment information and processing.

#### PayrollHistory.tsx

Displays payroll history and records.

#### PayrollSummary.tsx

Provides summary information about payroll status.

### AI Integration Components

#### CopilotProvider.tsx

Provides AI assistant context to the application.

```tsx
const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const [dynamicPrompt, setDynamicPrompt] = useState('');

  useEffect(() => {
    const updatePrompt = async () => {
      const userData = await copilotService.getCurrentUser();
      const companyData = await copilotService.getCurrentCompany();
      const availableActions = await copilotService.getAvailableActions();

      const prompt = PromptManager.generatePrompt({
        currentPage: window.location.pathname,
        userRole: userData?.role,
        availableActions,
        userData,
        companyData
      });

      setDynamicPrompt(prompt);
    };

    updatePrompt();
    
    // Update prompt when route changes
    const handleRouteChange = () => {
      updatePrompt();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <CopilotKit 
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      chatLabel="Payroll AI Agent"
    >
      {children}
      <CopilotSidebar
        className="fixed bottom-4 right-4 z-50"
        labels={{
          title: "Payroll AI Agent",
          placeholder: "Ask me anything about your account...",
          initial: "Need help with anything?"
        }}
        instructions={dynamicPrompt}
      />
    </CopilotKit>
  );
};
```

**Features:**
- Wraps the application with CopilotKit
- Dynamically updates prompts based on user context
- Provides the CopilotSidebar for user interaction

#### CopilotNavigation.tsx

Provides AI-assisted navigation capabilities.

## Component Best Practices

### Typing

Components use TypeScript interfaces for prop definitions:

```tsx
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Component implementation
};
```

### Styling

Components use Tailwind CSS for styling:

```tsx
<div className="flex min-h-screen bg-gray-50">
  <Sidebar />
  <div className="flex-1">
    {children}
  </div>
</div>
```

### Hooks Usage

Components leverage custom hooks for shared functionality:

```tsx
const { performAction, isLoading } = useCopilotActions();
```

### Error Handling

Components implement try/catch blocks for error handling:

```tsx
try {
  const result = await performAction(...);
  console.log('Action result:', result);
} catch (error) {
  console.error('Error:', error);
}
```

## Creating New Components

When creating new components:

1. Place the component in the appropriate directory
2. Use TypeScript for type safety
3. Follow the functional component pattern with React.FC
4. Use Tailwind CSS for styling
5. Implement proper error handling
6. Add appropriate loading states
7. Keep components focused on a single responsibility
8. Use custom hooks for shared logic
