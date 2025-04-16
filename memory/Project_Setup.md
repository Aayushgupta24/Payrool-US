# Project Setup Guide

## Overview

This document provides instructions for setting up the US Payroll application development environment. The project is built using React, TypeScript, and Vite.

## Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager
- Git

## Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd Payrool-US
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Create a `.env` file in the root directory with the following variables:

```
VITE_COPILOT_PUBLIC_API_KEY=your_copilot_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173

### Building for Production

To create a production build:

```bash
npm run build
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `/src` - Source code
  - `/api` - API client code
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/hooks` - Custom React hooks
  - `/layouts` - Page layout components
  - `/pages` - Application pages/routes
  - `/services` - Service layer for API interactions
  - `/store` - State management
  - `/styles` - CSS and styling files
  - `/utils` - Utility functions

## Key Dependencies

- **React & React DOM** (v18.2.0) - UI library
- **React Router DOM** (v7.5.0) - Routing
- **TypeScript** (v5.0.2) - Type checking
- **Vite** (v4.4.5) - Build tool and dev server
- **Tailwind CSS** (v3.3.3) - Utility-first CSS framework
- **CopilotKit** (v1.8.5) - AI assistant integration
- **Supabase** (v2.49.4) - Backend as a service
- **Zustand** (v5.0.3) - State management
- **Axios** (v1.8.4) - HTTP client

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed: `npm install`
2. Verify environment variables are correctly set in `.env`
3. Clear browser cache and restart the development server
4. Check console for error messages
