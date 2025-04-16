# State Management Guide

## Overview

This document provides an overview of the state management approaches used in the US Payroll application. The application uses a combination of React Context, Zustand, and local component state to manage application state.

## State Management Approaches

The application employs multiple state management strategies:

1. **React Context API**: For global application state
2. **Zustand**: For more complex state management with less boilerplate
3. **Local Component State**: For UI-specific state
4. **Custom Hooks**: For encapsulating state logic and providing reusable state management

## React Context API

### AppContext

The main application context (`src/context/AppContext.tsx`) provides global state and functions:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { employerService } from '../services/employerService';
import { adminService } from '../services/adminService';

interface AppContextType {
  currentRoute: string;
  selectedCompany: any;
  userData: any;
  employeeData: any;
  dashboardStats: any;
  companyList: any[];
  updateSelectedCompany: (company: any) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  currentRoute: '',
  selectedCompany: null,
  userData: null,
  employeeData: null,
  dashboardStats: null,
  companyList: [],
  updateSelectedCompany: () => {},
  refreshData: async () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [companyList, setCompanyList] = useState<any[]>([]);

  const refreshData = async () => {
    try {
      // Fetch all relevant data
      const [
        companies,
        employees,
        contractors,
        payrollData,
        bankData
      ] = await Promise.all([
        adminService.getAllCompanies(),
        employerService.getAllEmployees(),
        employerService.getAllContractors(),
        employerService.getPayrollInfo(),
        employerService.getBankBalance()
      ]);

      setCompanyList(companies.data || []);
      setEmployeeData({
        employees: employees.data || [],
        contractors: contractors.data || []
      });
      setDashboardStats({
        payroll: payrollData.data,
        bankBalance: bankData.data?.balance
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    setCurrentRoute(location.pathname);
    const storedCompany = localStorage.getItem('selectedCompany');
    if (storedCompany) {
      setSelectedCompany(JSON.parse(storedCompany));
    }
    refreshData();
  }, [location]);

  const updateSelectedCompany = (company: any) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    refreshData();
  };

  return (
    <AppContext.Provider 
      value={{
        currentRoute,
        selectedCompany,
        userData,
        employeeData,
        dashboardStats,
        companyList,
        updateSelectedCompany,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
```

**Key Features:**
- Provides global application state
- Manages selected company
- Stores user and employee data
- Caches dashboard statistics
- Offers data refresh functionality
- Persists selected company in localStorage

### Usage in Components

Components can access the context using the `useAppContext` hook:

```tsx
import { useAppContext } from '../context/AppContext';

const MyComponent: React.FC = () => {
  const { selectedCompany, updateSelectedCompany, refreshData } = useAppContext();
  
  // Component implementation...
};
```

## Zustand State Management

For more complex state management with less boilerplate, the application uses Zustand.

### Navigation Store

The navigation store (`src/store/navigationStore.ts`) manages navigation intents:

```typescript
import { create } from 'zustand';

type NavigationIntent = {
  page: string;
  action?: string;
  payload?: any;
};

interface NavigationStore {
  intent: NavigationIntent | null;
  setIntent: (intent: NavigationIntent | null) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  intent: null,
  setIntent: (intent) => set({ intent }),
}));
```

**Key Features:**
- Lightweight state management
- No boilerplate compared to Redux
- Simple API for state updates
- Automatic state persistence (if needed)

### Usage in Components

Components can access Zustand stores using the provided hooks:

```tsx
import { useNavigationStore } from '../store/navigationStore';

const MyComponent: React.FC = () => {
  const { intent, setIntent } = useNavigationStore();
  
  // Handle navigation intent
  useEffect(() => {
    if (intent?.page === 'users') {
      if (intent.action === 'openAddModal') {
        setShowAddModal(true);
      }
      // Clear intent after handling
      setIntent(null);
    }
  }, [intent, setIntent]);
  
  // Component implementation...
};
```

## Custom Hooks for State Management

The application uses custom hooks to encapsulate state logic and provide reusable state management.

### useCopilot Hook

The `useCopilot` hook (`src/hooks/useCopilot.ts`) manages AI assistant interactions:

```typescript
import { useCopilotContext } from '@copilotkit/react-core';
import { useState, useCallback } from 'react';
import { copilotService } from '../services/copilotService';
import { PromptManager } from '../services/promptManager';

export const useCopilot = () => {
  const { submitMessage } = useCopilotContext();
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const askCopilot = useCallback(async (
    question: string,
    action?: string,
    actionData?: any
  ) => {
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Get current context
      const userData = await copilotService.getCurrentUser();
      const companyData = await copilotService.getCurrentCompany();
      const availableActions = await copilotService.getAvailableActions();

      // Generate dynamic prompt
      const dynamicPrompt = PromptManager.generatePrompt({
        currentPage: window.location.pathname,
        userRole: userData?.role,
        availableActions,
        userData,
        companyData
      });

      // Submit message with dynamic prompt
      const response = await submitMessage({
        message: question,
        context: {
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
          action,
          actionData,
          systemPrompt: dynamicPrompt
        },
        onStream: (content: string) => {
          setStreamingContent(prev => prev + content);
        },
      });

      return response;
    } catch (error) {
      console.error('Error in askCopilot:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [submitMessage]);

  return { askCopilot, isLoading, streamingContent };
};
```

**Key Features:**
- Encapsulates AI assistant interaction logic
- Manages loading state
- Handles streaming content
- Provides error handling

### useCopilotActions Hook

The `useCopilotActions` hook (`src/hooks/useCopilotActions.ts`) provides a simplified interface for AI actions:

```typescript
import { useCopilot } from './useCopilot';
import { useState } from 'react';

export const useCopilotActions = () => {
  const { askCopilot } = useCopilot();
  const [isLoading, setIsLoading] = useState(false);

  const performAction = async (
    question: string, 
    action?: string, 
    additionalContext?: any
  ) => {
    setIsLoading(true);
    try {
      const response = await askCopilot({
        message: question,
        action,
        context: {
          ...additionalContext,
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
      });
      return response;
    } catch (error) {
      console.error('Error performing copilot action:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { performAction, isLoading };
};
```

**Key Features:**
- Simplifies AI action execution
- Manages loading state
- Provides error handling
- Adds contextual information automatically

### useSmartNavigation Hook

The `useSmartNavigation` hook integrates with the AI assistant for navigation:

**Key Features:**
- Enables AI-assisted navigation
- Integrates with the navigation store
- Provides contextual navigation suggestions

## Local Component State

For UI-specific state that doesn't need to be shared, components use React's `useState` and `useReducer` hooks:

```tsx
const HiringPage: React.FC = () => {
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
};
```

## State Persistence

The application uses multiple approaches for state persistence:

### LocalStorage

For data that needs to persist across sessions:

```typescript
// Store data
localStorage.setItem('selectedCompany', JSON.stringify(company));

// Retrieve data
const storedCompany = localStorage.getItem('selectedCompany');
if (storedCompany) {
  setSelectedCompany(JSON.parse(storedCompany));
}
```

### API Caching

For frequently accessed data that doesn't change often:

```typescript
// Fetch and cache data
const fetchAndCacheData = async () => {
  const response = await api.get('/endpoint');
  sessionStorage.setItem('cachedData', JSON.stringify(response.data));
  return response.data;
};

// Use cached data or fetch fresh
const getData = async () => {
  const cachedData = sessionStorage.getItem('cachedData');
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return fetchAndCacheData();
};
```

## State Management Best Practices

When working with state in the application:

1. **Choose the Right Approach**:
   - Use React Context for global application state
   - Use Zustand for complex state with simple API
   - Use local component state for UI-specific state
   - Use custom hooks to encapsulate reusable state logic

2. **State Organization**:
   - Keep related state together
   - Use TypeScript interfaces to define state shape
   - Consider using reducers for complex state logic

3. **Performance Considerations**:
   - Avoid unnecessary re-renders by memoizing components
   - Use `useCallback` and `useMemo` for expensive operations
   - Split context providers to minimize re-renders

4. **State Updates**:
   - Use functional updates for state that depends on previous state
   - Batch related state updates when possible
   - Consider using reducers for complex state transitions

5. **Error Handling**:
   - Include error state in your state management
   - Provide clear error messages
   - Implement retry mechanisms for critical operations

6. **Loading States**:
   - Include loading indicators for asynchronous operations
   - Consider skeleton screens for better UX
   - Disable interactive elements during loading

7. **State Persistence**:
   - Use localStorage for data that should persist across sessions
   - Use sessionStorage for temporary session data
   - Consider using a persistence library for complex state
