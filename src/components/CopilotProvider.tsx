import React, { useEffect, useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { PromptManager } from '../services/promptManager';
import { copilotService } from '../services/copilotService';
import '@copilotkit/react-ui/styles.css';
import { useCopilotAction } from '@copilotkit/react-core';

interface CopilotProviderProps {
  children: React.ReactNode;
}

const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const [dynamicPrompt, setDynamicPrompt] = useState('');

  useEffect(() => {
    const updatePrompt = async () => {
      const userData = await copilotService.getCurrentUser();
      const companyData = await copilotService.getCurrentCompany();
      const availableActions = await copilotService.getAvailableActions();

      const prompt = PromptManager.generatePrompt({
        currentPage: window.location.pathname,
        userRole: userData?.role,
        availableActions,
        userData,
        companyData
      });

      setDynamicPrompt(prompt);
    };

    updatePrompt();
    
    // Update prompt when route changes
    const handleRouteChange = () => {
      updatePrompt();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <CopilotKit 
      publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_API_KEY}
      chatLabel="Payroll AI Agent"
    >
      {children}
      <CopilotSidebar
        className="fixed bottom-4 right-4 z-50"
        labels={{
          title: "Payroll AI Agent",
          placeholder: "Ask me anything about your account...",
          initial: "Need help with anything?"
        }}
        instructions={dynamicPrompt}
      />
    </CopilotKit>
  );
};

export default CopilotProvider;
















