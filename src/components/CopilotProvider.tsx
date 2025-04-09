import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

interface CopilotProviderProps {
  children: React.ReactNode;
}

const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  return (
    <CopilotKit 
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      apiEndpoint="/api/copilot"
      chatApiEndpoint="/api/copilot"
      onError={(error) => {
        console.error('Copilot error:', error);
      }}
    >
      {children}
      <CopilotPopup 
        className="fixed bottom-4 right-4 z-50"
        labels={{
          title: "GrowthPods Assistant",
          placeholder: "Ask me anything about your account...",
          initial: "Need help with anything?"
        }}
        instructions="I'm your GrowthPods AI assistant. How can I help you today?"
      />
    </CopilotKit>
  );
};

export default CopilotProvider;







