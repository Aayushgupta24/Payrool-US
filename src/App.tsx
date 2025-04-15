import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useSmartNavigation } from './hooks/useSmartNavigation';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CopilotNavigation } from './components/CopilotNavigation';

export default function App() {
    
  
  return (
    <CopilotKit 
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      runtimeUrl="/api/copilot"
    >
      <CopilotNavigation />
      <RouterProvider router={router} />
      <CopilotPopup
        labels={{
          title: "GrowthPods Assistant",
          initial: "How can I help you today?",
          placeholder: "Ask me anything...",
        }}
        instructions={`
I'm your GrowthPods AI assistant. I can help you navigate and manage your account:

Navigation:
- "Take me to the admin dashboard"
- "Switch to employee view"
- "Go to employer benefits"
- "Open payroll page"
- "Show me my documents"

Common Tasks:
- "How many employees do we have?"
- "Show me active contractors"
- "Help me start a new payroll run"
- "I need to add a new employee"
- "Where can I find tax documents?"

Just type your request naturally and I'll help you get where you need to go!
        `}
        className="fixed bottom-4 right-4 z-50"
      />
    </CopilotKit>
  );
}
