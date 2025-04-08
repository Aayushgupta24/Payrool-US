import { useCopilotContext } from '@copilotkit/react-core';
import { useCallback } from 'react';

export const useCopilot = () => {
  const { submitMessage, isLoading } = useCopilotContext();

  const askCopilot = useCallback(async (question: string) => {
    try {
      const response = await submitMessage({
        message: question,
        context: {
          // Add any additional context you want to provide
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
      });
      return response;
    } catch (error) {
      console.error('Error asking copilot:', error);
      throw error;
    }
  }, [submitMessage]);

  return { askCopilot, isLoading };
};