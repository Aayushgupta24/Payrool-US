import React, { useEffect, useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { PromptManager } from '../services/promptManager';
import { copilotService } from '../services/copilotService';
import '@copilotkit/react-ui/styles.css';

interface CopilotProviderProps {
  children: React.ReactNode;
}

const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const [dynamicPrompt, setDynamicPrompt] = useState('');

  useEffect(() => {
    const updatePrompt = async () => {
      try {
        // Get context data from available methods
        const context = await copilotService.getFullContext();
        
        // Extract data from context
        const userData = context.userData || { role: 'user' };
        const companyData = context.company;
        
        // Define default available actions
        const availableActions = [
          'View dashboard',
          'Manage users',
          'Process payroll',
          'View reports'
        ];

        const prompt = PromptManager.generatePrompt({
          currentPage: window.location.pathname,
          userRole: userData.role || 'user',
          availableActions,
          userData,
          companyData
        });

        setDynamicPrompt(prompt);
      } catch (error) {
        console.error('Error updating prompt:', error);
        // Set a default prompt if there's an error
        const defaultPrompt = PromptManager.generatePrompt({
          currentPage: window.location.pathname,
          userRole: 'user',
          availableActions: ['View dashboard', 'Get help'],
          userData: null,
          companyData: null
        });
        setDynamicPrompt(defaultPrompt);
      }
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
