import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopilot } from '../hooks/useCopilot';

const EmployerHelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { askCopilot, isLoading } = useCopilot();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">How can we help you?</h1>

      <div className="space-y-4 max-w-3xl">
        {/* AI Assistant Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI Assistant</h2>
            <button 
              onClick={() => document.querySelector('.copilot-chat-button')?.click()}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerHelpPage;

