# Services Guide

## Overview

This document provides an overview of the service layer in the US Payroll application. Services act as an abstraction layer between the UI components and the API, handling data fetching, processing, and state management.

## Service Structure

Services are organized in the `src/services/` directory:

```
src/services/
├── adminService.ts
├── apiConfig.ts
├── authService.ts
├── copilotService.ts
├── employeeService.ts
├── employerService.ts
├── index.ts
├── promptManager.ts
└── types.ts
```

## API Configuration

The application uses a centralized API configuration in `apiConfig.ts`:

```typescript
import axios from 'axios';
import { utf8ToBase64 } from '../utils/base64';

// Define credentials
const credentials = `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`;
const basicAuth = utf8ToBase64(credentials);

// Create axios instance with retry configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  },
  timeout: 60000, // 60 seconds
  validateStatus: (status) => status >= 200 && status < 500,
});

// Add retry logic
api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }

  config.retryCount += 1;

  const delayRetryRequest = new Promise(resolve => {
    setTimeout(resolve, config.retryDelay || 1000);
  });

  return delayRetryRequest.then(() => api(config));
});

export default api;
```

This configuration:
- Creates a centralized Axios instance
- Sets default headers and timeout
- Implements retry logic for failed requests
- Uses environment variables for API URL and credentials

## Core Services

### Authentication Service (`authService.ts`)

Handles user authentication and session management:

```typescript
export const authService = {
  sendOtp: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  },

  verifyOtp: async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) throw error;

    if (data.session) {
      localStorage.setItem('token', data.session.access_token);
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    return supabase.auth.signOut();
  },

  refreshToken: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  },

  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, newPassword })
};
```

**Key Features:**
- OTP-based authentication
- Token management
- Session refresh
- Password reset

### Employee Service (`employeeService.ts`)

Handles employee-specific operations:

```typescript
export const employeeService = {
  // Profile Management
  getMyProfile: () => 
    api.get<ApiResponse<EmployeeProfile>>('/employee/profile'),
  
  updateMyProfile: (data: Partial<EmployeeProfile>) => 
    api.put<ApiResponse<EmployeeProfile>>('/employee/profile', data),
  
  // Documents
  getMyDocuments: () => 
    api.get<ApiResponse<EmployeeDocument[]>>('/employee/documents'),
  
  uploadDocument: (formData: FormData) => 
    api.post<ApiResponse<EmployeeDocument>>('/employee/documents', formData),
  
  // Paystubs
  getMyPaystubs: () => 
    api.get<ApiResponse<PaystubResponse[]>>('/employee/paystubs'),
  
  getPaystubDetails: (paystubId: string) => 
    api.get<ApiResponse<PaystubResponse>>(`/employee/paystubs/${paystubId}`),
  
  // Time & Attendance
  getTimesheet: (period: { start: string; end: string }) => 
    api.get('/employee/timesheet', { params: period }),
  
  submitTimesheet: (data: any) => 
    api.post('/employee/timesheet', data),

  // Benefits
  getMyBenefits: () => 
    api.get('/employee/benefits'),
  
  enrollInBenefit: (benefitId: string, data: any) => 
    api.post(`/employee/benefits/${benefitId}/enroll`, data),

  // Team
  getTeamMembers: () => 
    api.get('/employee/team'),
  
  getTeamDocuments: () => 
    api.get('/employee/team/documents'),
};
```

**Key Features:**
- Profile management
- Document management
- Paystub access
- Timesheet submission
- Benefits enrollment
- Team information

### Employer Service (`employerService.ts`)

Handles employer-specific operations:

```typescript
export const employerService = {
  // Employee Management
  getAllEmployees: () => 
    api.get('/employer/employees'),
  
  addEmployee: (employeeData: any) => 
    api.post('/employer/employees', employeeData),
  
  updateEmployee: (employeeId: string, data: any) => 
    api.put(`/employer/employees/${employeeId}`, data),

  // Contractor Management
  getAllContractors: () => 
    api.get('/employer/contractors'),
  
  addContractor: (contractorData: any) => 
    api.post('/employer/contractors', contractorData),

  // Payroll
  runPayroll: (payrollData: any) => 
    api.post('/employer/payroll/run', payrollData),
  
  getPayrollHistory: () => 
    api.get('/employer/payroll/history'),

  // Company Settings
  getCompanyProfile: () => 
    api.get<ApiResponse<EmployerProfile>>('/employer/company'),
  
  updateCompanyProfile: (data: Partial<EmployerProfile>) => 
    api.put('/employer/company', data),

  // Benefits Administration
  getBenefitsPlans: () => 
    api.get('/employer/benefits'),
  
  updateBenefitsPlan: (planId: string, data: any) => 
    api.put(`/employer/benefits/${planId}`, data),

  // Tax Documents
  getTaxDocuments: () => 
    api.get('/employer/tax-documents'),
  
  generateW2s: (year: number) => 
    api.post('/employer/tax-documents/w2', { year }),
  
  generate1099s: (year: number) => 
    api.post('/employer/tax-documents/1099', { year }),
};
```

**Key Features:**
- Employee management
- Contractor management
- Payroll processing
- Company settings
- Benefits administration
- Tax document generation

### Admin Service (`adminService.ts`)

Handles administrative operations:

**Key Features:**
- User management
- Company management
- System configuration
- Reporting

### Copilot Service (`copilotService.ts`)

Provides AI assistant functionality:

```typescript
export class CopilotService {
  async getFullContext() {
    try {
      const storedCompany = localStorage.getItem('selectedCompany');
      const currentRoute = window.location.pathname;
      
      // Get all relevant data
      const contextData = {
        route: currentRoute,
        company: storedCompany ? JSON.parse(storedCompany) : null,
        userData: null,
        employeeData: null,
        dashboardStats: null,
        companyList: []
      };

      // Based on route, fetch relevant data
      if (currentRoute.includes('/admin')) {
        const companies = await adminService.getAllCompanies();
        contextData.companyList = companies.data || [];
      }

      if (contextData.company) {
        const [employees, contractors, payroll, bank] = await Promise.all([
          employerService.getAllEmployees(),
          employerService.getAllContractors(),
          employerService.getPayrollInfo(),
          employerService.getBankBalance()
        ]);

        contextData.employeeData = {
          employees: employees.data || [],
          contractors: contractors.data || []
        };

        contextData.dashboardStats = {
          payroll: payroll.data,
          bankBalance: bank.data?.balance
        };
      }

      return contextData;
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
    }
  }

  // Other methods...
}

export const copilotService = new CopilotService();
```

**Key Features:**
- Context gathering for AI assistant
- User data aggregation
- Company data aggregation
- Dashboard statistics

### Prompt Manager (`promptManager.ts`)

Manages dynamic prompts for the AI assistant:

**Key Features:**
- Dynamic prompt generation
- Context-aware instructions
- User role-based prompting

## Service Integration with Components

Services are integrated with components through hooks and direct imports:

```tsx
// Example from a component
import { employerService } from '../services/employerService';

const HiringPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employerService.addEmployee(formData);
      setSuccess(`Successfully added ${formData.firstName} ${formData.lastName}`);
      // Reset form...
    } catch (error) {
      setError('Failed to add employee. Please try again.');
    }
  };
  
  // Component implementation...
};
```

## Error Handling

Services implement consistent error handling:

```typescript
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error) {
  console.error('Error in service call:', error);
  throw error; // Re-throw for component-level handling
}
```

Components can then handle these errors appropriately:

```tsx
try {
  await employerService.addEmployee(formData);
  // Success handling...
} catch (error) {
  setError('Failed to add employee. Please try again.');
}
```

## Type Definitions

Service types are defined in `types.ts`:

```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Other properties...
}

// Other type definitions...
```

## Service Best Practices

When creating or modifying services:

1. Keep services focused on a specific domain (auth, employee, employer, etc.)
2. Use TypeScript interfaces for request/response types
3. Implement proper error handling
4. Use the centralized API configuration
5. Keep service methods small and focused
6. Use async/await for asynchronous operations
7. Document complex methods with comments
8. Use environment variables for configuration
9. Implement retry logic for critical operations
10. Cache responses when appropriate
