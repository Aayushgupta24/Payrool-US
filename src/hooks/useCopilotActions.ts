import { useCopilot } from './useCopilot';
import { useState } from 'react';

export const useCopilotActions = () => {
  const { askCopilot } = useCopilot();
  const [isLoading, setIsLoading] = useState(false);

  const performAction = async (
    question: string, 
    action?: string, 
    additionalContext?: any
  ) => {
    setIsLoading(true);
    try {
      const response = await askCopilot({
        message: question,
        action,
        context: {
          ...additionalContext,
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
      });
      return response;
    } catch (error) {
      console.error('Error performing copilot action:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { performAction, isLoading };
};
