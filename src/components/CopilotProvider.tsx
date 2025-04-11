import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useCopilotAction } from '@copilotkit/react-core';

interface CopilotProviderProps {
  children: React.ReactNode;
}

const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  return (
    <CopilotKit 
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
    >
      {children}
      <CopilotPopup 
        className="fixed bottom-4 right-4 z-50"
        labels={{
          title: "GrowthPods Assistant",
          placeholder: "Ask me anything about your account...",
          initial: "Need help with anything?"
        }}
        instructions={`
          I'm your GrowthPods AI assistant. I can help you:
          - Switch between different views (try "switch to employee view" or "switch to employer dashboard")
          - Manage employees and contractors
          - Handle payroll and benefits
          - Access reports and documents
          - Navigate through different sections
          
          How can I assist you today?
        `}
      />
    </CopilotKit>
  );
};

export default CopilotProvider;
















