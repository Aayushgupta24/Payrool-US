import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
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
      />
    </CopilotKit>
  );
}
