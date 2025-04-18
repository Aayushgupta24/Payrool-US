import { useNavigate } from 'react-router-dom';
import { useCopilotAction } from '@copilotkit/react-core';

export function useSmartNavigation() {
  const navigate = useNavigate();

  const smoothNavigate = (path: string) => {
    // Create loading bar
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    document.body.appendChild(loadingBar);

    // Animate loading bar
    loadingBar.animate([
      { transform: 'scaleX(0)' },
      { transform: 'scaleX(0.3)' },
      { transform: 'scaleX(0.7)' },
      { transform: 'scaleX(1)' }
    ], {
      duration: 500,
      easing: 'ease-out'
    });

    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-overlay';
    document.body.appendChild(overlay);

    // Animate current page out
    const currentPage = document.querySelector('.page-transition-wrapper');
    if (currentPage) {
      currentPage.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0.98)' }
      ], {
        duration: 300,
        easing: 'ease-out'
      });
    }

    // Navigate after short delay
    setTimeout(() => {
      navigate(path);
      
      // Clean up
      setTimeout(() => {
        loadingBar.remove();
        overlay.remove();
      }, 500);
    }, 300);
  };

  // Register copilot action for navigation
  useCopilotAction({
    name: "navigate",
    description: "Navigate to different pages in the application",
    parameters: [
      {
        name: "destination",
        type: "string",
        description: "The destination to navigate to"
      }
    ],
    handler: async ({ destination }) => {
      smoothNavigate(destination);
      return `Navigated to ${destination}`;
    }
  });

  return { smoothNavigate };
}
