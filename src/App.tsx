import { CopilotKit, useCopilotAction } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from './store/navigationStore';
import { BrowserRouter } from 'react-router-dom';
import CopilotProvider from './components/CopilotProvider';

export default function App() {
  const navigate = useNavigate();
  const { setIntent } = useNavigationStore();

  // Enhanced Navigation Action
  useCopilotAction({
    name: "navigateAndTrigger",
    description: "Navigate to a page and trigger UI action",
    parameters: [
      { name: "page", type: "string", description: "Target page" },
      { name: "action", type: "string", description: "Action to trigger" },
      { name: "payload", type: "object", description: "Optional data payload" }
    ],
    run: async (params) => {
      const routes = {
        'users': '/employer/users',
        'team': '/employer/team',
        'hiring': '/employer/hiring',
        'dashboard': '/employer/dashboard',
        'company': '/employer/company',
      };

      const route = routes[params.page.toLowerCase()];
      if (route) {
        setIntent({
          page: params.page,
          action: params.action,
          payload: params.payload
        });
        navigate(route);
        return `Navigating to ${params.page} and executing ${params.action}`;
      }
      return "Page not found";
    }
  });

  // Add User Action with Form Prefill
  useCopilotAction({
    name: "addNewUserWithDetails",
    description: "Add a new user with provided details",
    parameters: [
      { name: "userType", type: "string", description: "Type of user (employee, contractor)" },
      { name: "firstName", type: "string", description: "User's first name" },
      { name: "lastName", type: "string", description: "User's last name" },
      { name: "email", type: "string", description: "User's email" }
    ],
    run: async (params) => {
      const route = params.userType.toLowerCase() === 'employee' 
        ? '/employer/hiring/add-employee'
        : '/employer/hiring/add-independent-contractor';
      
      setIntent({
        page: 'hiring',
        action: 'prefillForm',
        payload: {
          firstName: params.firstName,
          lastName: params.lastName,
          email: params.email,
          userType: params.userType
        }
      });
      
      navigate(route);
      return `Adding new ${params.userType}: ${params.firstName} ${params.lastName}`;
    }
  });

  // Add User Action
  useCopilotAction({
    name: "addNewUser",
    description: "Navigate to add user page and initiate user creation",
    parameters: [
      { name: "userType", type: "string", description: "Type of user (employee, contractor)" }
    ],
    run: async (params) => {
      const type = params.userType.toLowerCase();
      if (type === 'employee') {
        navigate('/employer/hiring/add-employee');
        return "Navigated to add employee page";
      } else if (type === 'contractor') {
        navigate('/employer/hiring/add-independent-contractor');
        return "Navigated to add contractor page";
      }
      return "Invalid user type";
    }
  });

  // Switch Dashboard Action
  useCopilotAction({
    name: "switchDashboard",
    description: "Switch between employer and employee dashboard",
    parameters: [
      { name: "type", type: "string", description: "Dashboard type (employer or employee)" }
    ],
    run: async (params) => {
      const type = params.type.toLowerCase();
      if (type === 'employer') {
        navigate('/employer/dashboard');
        return "Switched to employer dashboard";
      } else if (type === 'employee') {
        navigate('/employee/dashboard');
        return "Switched to employee dashboard";
      }
      return "Invalid dashboard type";
    }
  });

  // Search Users Action
  useCopilotAction({
    name: "searchUsers",
    description: "Navigate to users page and initiate search",
    parameters: [
      { name: "searchTerm", type: "string", description: "Name or email to search for" }
    ],
    run: async (params) => {
      navigate('/employer/users', { 
        state: { searchQuery: params.searchTerm } 
      });
      return `Navigating to users page to search for "${params.searchTerm}"`;
    }
  });

  // Manage Company Action
  useCopilotAction({
    name: "manageCompany",
    description: "Navigate to company management page",
    parameters: [
      { name: "section", type: "string", description: "Section to navigate to (info, taxes, locations)" }
    ],
    run: async (params) => {
      const section = params.section.toLowerCase();
      navigate('/employer/company', { 
        state: { activeTab: section } 
      });
      return `Navigated to company ${section} section`;
    }
  });

  return (
    <BrowserRouter>
      <CopilotProvider>
        <html lang="en">
          <body>
            <CopilotKit 
              publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
              runtimeUrl="/api/copilot"
            >
              <CopilotPopup
                labels={{
                  title: "Payroll AI Agent",
                  initial: "How can I help you today?"
                }}
                instructions={`
                  I'm your Payroll AI assistant. I can help you with:
                  - Adding new employees or contractors with their details
                  - Navigating to different pages and performing actions
                  - Managing users and company information
                  
                  Try saying things like:
                  - "Add a new employee named John Doe with email john@example.com"
                  - "Show me the users page and open the add user modal"
                  - "Search for employee Sarah in the users page"
                `}
              />
            </CopilotKit>
          </body>
        </html>
      </CopilotProvider>
    </BrowserRouter>
  );
}
