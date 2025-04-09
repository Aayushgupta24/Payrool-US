import { useCopilotContext } from '@copilotkit/react-core';
import { useState, useCallback } from 'react';

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
      // If question is about employee count, automatically set action
      if (question.toLowerCase().includes('how many') && 
          (question.toLowerCase().includes('employee') || 
           question.toLowerCase().includes('people'))) {
        action = 'GET_USER_COUNT';
      }

      const response = await submitMessage({
        message: question,
        context: {
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString(),
          action,
          actionData,
        },
        onStream: (content: string) => {
          setStreamingContent(prev => prev + content);
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error asking copilot:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [submitMessage]);

  return { 
    askCopilot, 
    isLoading,
    streamingContent 
  };
};


