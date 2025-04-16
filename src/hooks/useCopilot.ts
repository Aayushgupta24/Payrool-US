import { useCopilotContext } from '@copilotkit/react-core';
import { useState, useCallback } from 'react';
import { copilotService } from '../services/copilotService';
import { PromptManager } from '../services/promptManager';

export const useCopilot = () => {
  const { submitMessage } = useCopilotContext();
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const askCopilot = useCallback(async (
    question: string,
    action?: string,
    actionData?: any
  ) => {
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Get current context
      const userData = await copilotService.getCurrentUser();
      const companyData = await copilotService.getCurrentCompany();
      const availableActions = await copilotService.getAvailableActions();

      // Generate dynamic prompt
      const dynamicPrompt = PromptManager.generatePrompt({
        currentPage: window.location.pathname,
        userRole: userData?.role,
        availableActions,
        userData,
        companyData
      });

      // Handle user count questions directly
      if (question.toLowerCase().includes('how many') && 
          (question.toLowerCase().includes('employee') || 
           question.toLowerCase().includes('user') ||
           question.toLowerCase().includes('people'))) {
        const users = await copilotService.getUsersByCompany();
        return {
          response: `Based on the current data, your company has ${users.length} users/employees.`
        };
      }

      // Submit message with dynamic prompt
      const response = await submitMessage({
        message: question,
        context: {
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
          action,
          actionData,
          systemPrompt: dynamicPrompt
        },
        onStream: (content: string) => {
          setStreamingContent(prev => prev + content);
        },
      });

      return response;
    } catch (error) {
      console.error('Error in askCopilot:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [submitMessage]);

  return { askCopilot, isLoading, streamingContent };
};
