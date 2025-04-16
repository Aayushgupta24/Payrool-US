# Architecture Overview

## Project Structure

The US Payroll application follows a modular architecture with clear separation of concerns. This document provides an overview of the project's structure and how different components interact.

## High-Level Architecture

```
Payrool-US/
├── public/            # Static assets
├── src/               # Source code
│   ├── api/           # API client code
│   ├── assets/        # Project assets (images, etc.)
│   ├── components/    # Reusable UI components
│   ├── config/        # Configuration files
│   ├── context/       # React context providers
│   ├── data/          # Mock data and constants
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Page layout components
│   ├── pages/         # Application pages/routes
│   ├── polyfills/     # Polyfill implementations
│   ├── server/        # Server-side code
│   ├── services/      # Service layer for API interactions
│   ├── store/         # State management
│   ├── styles/        # CSS and styling files
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
```

## Key Components

### Frontend Framework

The application is built using React with TypeScript, providing type safety and improved developer experience. Vite is used as the build tool and development server for fast refresh and optimized builds.

### Routing

React Router DOM (v7.5.0) handles client-side routing. The main routes are defined in `src/routes.tsx` and include:

- Authentication routes (`/login`, `/signup`, `/forgot-password`)
- Admin routes (`/admin`, `/admin/users`)
- Employee routes (`/employee/dashboard`, `/employee/details`, etc.)
- Employer routes (`/employer/dashboard`, `/employer/payroll`, etc.)

### State Management

The application uses a combination of:

- React Context API (`src/context/AppContext.tsx`) for global state
- Zustand (`src/store/`) for more complex state management
- Local component state for UI-specific state

### API Integration

The application communicates with backend services through:

- Service modules (`src/services/`) that encapsulate API calls
- Axios for HTTP requests
- Supabase client for authentication and database operations

### Authentication

Authentication is handled through Supabase Auth, with custom implementation in `src/services/authService.ts`. The flow includes:

- Email/OTP authentication
- Token management
- Session refresh
- Password reset functionality

### AI Assistant Integration

The application integrates CopilotKit for AI assistance:

- `CopilotProvider` wraps the application to provide AI context
- `CopilotSidebar` offers a chat interface for user assistance
- Dynamic prompts are generated based on user context and current page

### UI Components

The UI is built with:

- Custom React components (`src/components/`)
- Tailwind CSS for styling
- React Icons for iconography

## Data Flow

1. User interactions trigger component events
2. Components call service functions or update state
3. Services make API calls to backend endpoints
4. Responses update application state
5. UI re-renders based on state changes

## Key Design Patterns

- **Container/Presentational Pattern**: Separating logic from presentation
- **Custom Hooks**: Encapsulating reusable logic
- **Service Layer**: Abstracting API interactions
- **Context Providers**: Managing global state
- **Layout Components**: Providing consistent page structure

## Environment Configuration

The application uses environment variables for configuration, loaded through Vite's environment variable handling:

- API keys
- Service URLs
- Feature flags

## Build and Deployment

The application is built using Vite's build process, which:

1. Compiles TypeScript to JavaScript
2. Bundles modules with optimizations
3. Processes CSS with PostCSS and Tailwind
4. Outputs static assets to the `dist` directory
