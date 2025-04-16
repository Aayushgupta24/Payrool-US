import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useSmartNavigation } from './hooks/useSmartNavigation';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CopilotNavigation } from './components/CopilotNavigation';

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
