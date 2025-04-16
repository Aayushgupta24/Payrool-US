# AI Integration Guide

## Overview

This document provides an overview of the AI integration in the US Payroll application. The application uses CopilotKit to provide AI-assisted features for users, enhancing the user experience and automating common tasks.

## AI Integration Architecture

The application integrates AI capabilities through several layers:

1. **CopilotKit Integration**: Core AI functionality provided by CopilotKit
2. **Custom Hooks**: Application-specific hooks for AI interactions
3. **Service Layer**: Backend services for AI context and actions
4. **UI Components**: User interface elements for AI interactions
5. **Prompt Management**: Dynamic prompt generation based on context

## CopilotKit Integration

The application uses CopilotKit for AI capabilities:

```tsx
// src/App.tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

export default function App() {
  return (
    <CopilotKit 
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      runtimeUrl="/api/copilot"
      chatLabel="Payroll AI Agent"
    >
      <CopilotNavigation />
      <RouterProvider router={router} />
      <CopilotSidebar
        labels={{
          title: "Payroll AI Agent",
          initial: "Need help with anything?",
          placeholder: "Ask me anything about your account..."
        }}
        windowTitle="Payroll AI Agent"
        className="fixed bottom-4 right-4 z-50"
      />
    </CopilotKit>
  );
}
```

### Key Components

- **CopilotKit**: The main provider that wraps the application
- **CopilotSidebar**: The chat interface for user interactions
- **CopilotNavigation**: Custom component for AI-assisted navigation

## Custom AI Hooks

### useCopilot Hook

The `useCopilot` hook (`src/hooks/useCopilot.ts`) provides a simplified interface for AI interactions:

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
- Manages loading state
- Handles streaming content
- Dynamically generates prompts based on context
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

## AI Service Layer

### Copilot Service

The `copilotService` (`src/services/copilotService.ts`) provides backend functionality for AI features:

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
- Gathers contextual data for AI
- Aggregates data from multiple sources
- Provides role-specific context

### Prompt Manager

The `PromptManager` (`src/services/promptManager.ts`) generates dynamic prompts based on context:

**Key Features:**
- Creates context-aware prompts
- Customizes instructions based on user role
- Includes available actions in prompts

## AI UI Components

### CopilotSidebar

The main chat interface for user interactions:

```tsx
<CopilotSidebar
  className="fixed bottom-4 right-4 z-50"
  labels={{
    title: "Payroll AI Agent",
    placeholder: "Ask me anything about your account...",
    initial: "Need help with anything?"
  }}
  instructions={dynamicPrompt}
/>
```

### CopilotPopup

A popup interface for contextual help:

```tsx
<CopilotPopup
  instructions={`You are the Payroll AI Agent. Help users with:
    - Managing employees and contractors
    - Handling payroll and benefits
    - Accessing tax documents
    - Understanding company policies
    - Generating reports
    Provide clear, concise answers based on the available context.`}
  labels={{
    title: "Payroll AI Agent",
    initial: "Need help with anything?",
    placeholder: "Ask me anything about your account..."
  }}
  windowTitle="Payroll AI Agent"
  className="bottom-4 right-4"
/>
```

## AI Actions in Components

Components can define AI actions using the `useCopilotAction` hook:

```tsx
// Example from HiringPage.tsx
useCopilotAction({
  name: "addNewEmployee",
  description: "Add a new employee to the system",
  parameters: [
    { name: "firstName", type: "string", description: "Employee's first name" },
    { name: "lastName", type: "string", description: "Employee's last name" },
    { name: "email", type: "string", description: "Employee's email address" },
    { name: "phoneNumber", type: "string", description: "Employee's phone number" },
    { name: "dateOfJoin", type: "string", description: "Start date (YYYY-MM-DD)" },
    { name: "workerType", type: "string", description: "W2 or 1099" },
    { name: "jobTitle", type: "string", description: "Employee's job title" },
    { name: "companyLocationCategory", type: "string", description: "Remote or On-site" },
    { name: "stateCode", type: "string", description: "Two-letter state code" },
    { name: "salary", type: "number", description: "Annual salary amount" }
  ],
  run: async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
        throw new Error('Invalid email format');
      }

      // Implementation...

      return `Successfully added employee: ${params.firstName} ${params.lastName}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
});
```

## Exposing Data to AI

Components can expose data to the AI using the `useCopilotReadable` hook:

```tsx
// Example from UsersPage.tsx
useCopilotReadable({
  name: "users",
  description: "List of all users in the current company",
  value: users
});

useCopilotReadable({
  name: "userStats",
  description: "Statistics about users including total count and role distribution",
  value: {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    roleDistribution: users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  }
});
```

## AI Backend Integration

The application integrates with OpenAI for AI capabilities:

```typescript
// src/api/copilot.ts
import OpenAI from 'openai';
import { CopilotBackend } from "@copilotkit/backend";

export async function handler(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { messages } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo" depending on your needs
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ 
      response: completion.choices[0].message.content 
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("Copilot runtime error:", error);
    return new Response(JSON.stringify({ 
      error: "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
```

## AI Features

The application provides several AI-assisted features:

### Contextual Help

- AI assistant provides context-aware help based on the current page
- Answers questions about payroll, benefits, taxes, etc.
- Guides users through complex processes

### Smart Actions

- Add new employees or contractors
- Process payroll
- Generate tax documents
- Deactivate users
- Search for information

### Intelligent Navigation

- AI-assisted navigation to relevant pages
- Contextual suggestions based on user intent
- Automatic form filling based on natural language input

## Best Practices for AI Integration

When working with AI features in the application:

1. **Provide Clear Context**:
   - Use `useCopilotReadable` to expose relevant data
   - Include page context in prompts
   - Provide user role and permissions

2. **Define Specific Actions**:
   - Use `useCopilotAction` for well-defined tasks
   - Include parameter validation
   - Provide clear error messages

3. **Handle Errors Gracefully**:
   - Implement proper error handling
   - Provide user-friendly error messages
   - Log errors for debugging

4. **Optimize Performance**:
   - Cache context data when possible
   - Use streaming for long responses
   - Implement loading states for AI actions

5. **Ensure Security**:
   - Validate all AI-generated inputs
   - Implement proper authorization checks
   - Don't expose sensitive data to the AI

6. **Enhance User Experience**:
   - Provide clear feedback during AI operations
   - Show loading indicators for long-running tasks
   - Offer fallback options if AI fails

7. **Test AI Features**:
   - Test with various inputs and scenarios
   - Verify AI-generated outputs
   - Test error handling and edge cases
