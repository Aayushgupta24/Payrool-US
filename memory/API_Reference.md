# API Reference

## Overview

This document provides a reference for the API endpoints and services used in the US Payroll application. The application interacts with multiple APIs for different functionalities.

## API Configuration

The application uses a centralized API configuration (`src/services/apiConfig.ts`) that creates an Axios instance with:

- Base URL from environment variables
- Default headers including Content-Type and Authorization
- Timeout settings
- Retry logic for failed requests

```typescript
// Example API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  },
  timeout: 60000, // 60 seconds
});
```

## Authentication

### Supabase Authentication

The application uses Supabase for authentication services:

```typescript
// Example from authService.ts
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**Key Authentication Endpoints:**

- `sendOtp(email)`: Sends a one-time password to the user's email
- `verifyOtp(email, token)`: Verifies the OTP and creates a session
- `logout()`: Signs out the current user
- `refreshToken()`: Refreshes the authentication token
- `forgotPassword(email)`: Initiates password reset
- `resetPassword(token, newPassword)`: Completes password reset

## Rollfi API

The application interacts with a Rollfi API for payroll and company management:

**Base URL:** `import.meta.env.VITE_API_URL`

### Company Endpoints

- **Update Company Website**
  - Method: PUT
  - Endpoint: `/companyOnboarding`
  - Payload: 
    ```json
    {
      "method": "updateCompany",
      "company": {
        "companyId": "string",
        "businessWebsite": "string"
      }
    }
    ```

### User Management Endpoints

- **Get Users by Company Name**
  - Method: GET
  - Endpoint: `/reports`
  - Payload:
    ```json
    {
      "method": "getUsersByCompanyName",
      "companyName": "string"
    }
    ```

- **Add Users**
  - Method: POST
  - Endpoint: `/adminPortal`
  - Payload:
    ```json
    {
      "method": "addUsers",
      "companyId": "string",
      "users": [User]
    }
    ```

- **Deactivate User**
  - Method: POST
  - Endpoint: `/adminPortal`
  - Payload:
    ```json
    {
      "method": "deactivateUser",
      "user": DeactivateUserPayload
    }
    ```

## Copilot API

The application integrates with OpenAI for AI assistance:

- **Chat Completion**
  - Method: POST
  - Endpoint: `/api/copilot`
  - Payload:
    ```json
    {
      "messages": [
        {
          "role": "user|assistant|system",
          "content": "string"
        }
      ]
    }
    ```
  - Response:
    ```json
    {
      "response": "string"
    }
    ```

## Service Layer

The application uses a service layer to abstract API calls:

### Auth Service (`src/services/authService.ts`)

Handles authentication operations through Supabase.

### Admin Service (`src/services/adminService.ts`)

Manages administrative operations.

### Employee Service (`src/services/employeeService.ts`)

Handles employee-related operations.

### Employer Service (`src/services/employerService.ts`)

Manages employer-specific operations.

### Copilot Service (`src/services/copilotService.ts`)

Interfaces with the AI assistant functionality.

## Error Handling

The API configuration includes:

- Request timeout handling (60 seconds)
- Automatic retry logic for failed requests
- Status code validation
- Error response formatting

## Authentication Flow

1. User enters email for OTP
2. System sends OTP to email
3. User verifies with OTP
4. System creates session and stores token
5. Token is included in subsequent API requests
6. Token refresh happens automatically when needed

## Best Practices for API Usage

1. Always use the service layer rather than direct API calls
2. Handle errors appropriately at the component level
3. Use environment variables for API configuration
4. Implement proper loading and error states in UI
5. Consider caching strategies for frequently accessed data
