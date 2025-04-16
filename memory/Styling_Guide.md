# Styling Guide

## Overview

This document provides an overview of the styling approach used in the US Payroll application. The application primarily uses Tailwind CSS for styling, with some custom CSS for specific components.

## Styling Approach

The application uses a combination of:

1. **Tailwind CSS**: For utility-based styling
2. **Custom CSS**: For component-specific styling
3. **CSS Variables**: For theming and customization
4. **Inline SVG Icons**: For scalable and customizable icons

## Tailwind CSS Configuration

The application uses Tailwind CSS with a custom configuration defined in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#e6f7f7',
          100: '#b3e6e6',
          200: '#80d6d6',
          300: '#4dc6c6',
          400: '#26b6b6',
          500: '#00a0a0',
          600: '#008080',
          700: '#006060',
          800: '#004040',
          900: '#002020',
        },
      },
    },
  },
  plugins: [],
};
```

This configuration:
- Extends the default Tailwind color palette with custom teal colors
- Scans all JS, JSX, TS, and TSX files for Tailwind classes
- Doesn't include any additional plugins

## Global Styles

Global styles are defined in `src/index.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import '@copilotkit/react-ui/styles.css';

/* Add these styles to customize the Copilot popup */
.copilot-popup {
  --copilot-popup-background: white;
  --copilot-popup-text: #374151;
  --copilot-popup-button-background: #0D9488;
  --copilot-popup-button-text: white;
  --copilot-popup-button-hover: #0F766E;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
}

.copilot-popup-button {
  transition: all 0.2s ease-in-out;
}

.copilot-popup-button:hover {
  transform: scale(1.05);
}
```

This file:
- Imports Tailwind's base, components, and utilities
- Imports CopilotKit styles
- Defines custom styles for the Copilot popup
- Uses CSS variables for theming

## Component-Specific Styles

Some components have their own CSS files for more complex styling needs:

### Employee Dashboard Styles

Located in `src/styles/EmployeeDashboard.css`:

```css
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background-color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Additional styles... */

.main-content {
  flex: 1;
  padding: 2rem;
  background: #f9fafb;
}

.task-cards {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

/* More component styles... */
```

These styles provide:
- Layout structure for the dashboard
- Styling for sidebar components
- Card designs for tasks and payroll information
- Custom icon implementations

## Inline Tailwind CSS

Most components use Tailwind CSS classes directly in the JSX:

```tsx
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
    
    {/* Component content... */}
  </div>
</div>
```

This approach:
- Keeps styles co-located with the components
- Makes it easy to understand the styling at a glance
- Allows for responsive design with Tailwind's responsive prefixes

## Color Palette

The application uses a consistent color palette:

### Primary Colors

- **Teal**: Used for primary actions, buttons, and highlights
  - Primary: `bg-teal-600` (#008080)
  - Hover: `hover:bg-teal-700` (#006060)
  - Light: `bg-teal-50` (#e6f7f7)

### Secondary Colors

- **Blue**: Used for secondary actions and information
  - Primary: `bg-blue-600` (#2563eb)
  - Hover: `hover:bg-blue-700` (#1d4ed8)

### Accent Colors

- **Green**: Used for success states and positive actions
  - Primary: `bg-green-600` (#059669)
  - Hover: `hover:bg-green-700` (#047857)

- **Purple**: Used for special features or tertiary actions
  - Primary: `bg-purple-600` (#7c3aed)
  - Hover: `hover:bg-purple-700` (#6d28d9)

### Neutral Colors

- **Gray**: Used for backgrounds, borders, and text
  - Background: `bg-gray-50` (#f9fafb)
  - Border: `border-gray-300` (#d1d5db)
  - Text: `text-gray-700` (#374151)

## Typography

The application uses Tailwind's typography utilities:

- **Headings**:
  - `text-2xl font-semibold` for page titles
  - `text-xl font-semibold` for section headings
  - `text-lg font-medium` for card titles

- **Body Text**:
  - `text-base` for normal text
  - `text-sm` for secondary text
  - `text-xs` for small labels

- **Font Weights**:
  - `font-semibold` for headings and important text
  - `font-medium` for subheadings and buttons
  - `font-normal` for body text

## Layout Patterns

The application uses several consistent layout patterns:

### Page Layout

```tsx
<div className="flex min-h-screen bg-gray-50">
  <Sidebar />
  <div className="flex-1 p-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">Page Title</h1>
      <div className="space-x-4">
        {/* Action buttons */}
      </div>
    </div>
    
    {/* Page content */}
  </div>
</div>
```

### Card Layout

```tsx
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-medium">Card Title</h2>
    <button className="text-teal-600 hover:text-teal-700">
      Action
    </button>
  </div>
  
  {/* Card content */}
</div>
```

### Form Layout

```tsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Label</label>
    <input
      type="text"
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
    />
  </div>
  
  {/* More form fields */}
  
  <div className="flex justify-end space-x-4 mt-6">
    <button
      type="button"
      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
    >
      Submit
    </button>
  </div>
</form>
```

## Responsive Design

The application uses Tailwind's responsive prefixes for responsive design:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

Common responsive patterns:
- Single column on mobile, multiple columns on larger screens
- Stacked elements on mobile, side-by-side on larger screens
- Hidden elements on mobile, visible on larger screens

## Icons

The application uses two approaches for icons:

### React Icons

```tsx
import { FiUserPlus } from 'react-icons/fi';

// In component
<FiUserPlus size={20} />
```

### Inline SVG Icons

```css
.dashboard-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0-12h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z'/%3E%3C/svg%3E");
}
```

## Animation and Transitions

The application uses CSS transitions for subtle animations:

```css
.copilot-popup-button {
  transition: all 0.2s ease-in-out;
}

.copilot-popup-button:hover {
  transform: scale(1.05);
}
```

Common transition patterns:
- Hover effects on buttons and links
- Fade-in/fade-out for modals and tooltips
- Scale effects for interactive elements

## Styling Best Practices

When working with styles in the application:

1. **Use Tailwind Classes First**:
   - Prefer Tailwind utility classes for most styling needs
   - Use custom CSS only when necessary for complex components

2. **Maintain Consistency**:
   - Use the established color palette
   - Follow the typography guidelines
   - Use consistent spacing and layout patterns

3. **Responsive Design**:
   - Design for mobile first
   - Use Tailwind's responsive prefixes for breakpoints
   - Test on multiple screen sizes

4. **Performance Considerations**:
   - Minimize custom CSS
   - Use Tailwind's purge feature to reduce CSS size
   - Optimize images and SVGs

5. **Accessibility**:
   - Ensure sufficient color contrast
   - Use semantic HTML elements
   - Include focus styles for keyboard navigation

6. **Component Organization**:
   - Keep component-specific styles close to the component
   - Use consistent naming conventions
   - Document complex styling decisions

7. **Theme Customization**:
   - Use CSS variables for theme values
   - Extend Tailwind's theme in the configuration
   - Create reusable component classes for repeated patterns
