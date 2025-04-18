import React from 'react';
import { CopilotPopup } from "@copilotkit/react-ui";
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
        <CopilotPopup
          instructions={`You are the GrowthPods AI assistant. Help users with:
            - Managing employees and contractors
            - Handling payroll and benefits
            - Accessing tax documents
            - Understanding company policies
            - Generating reports
            Provide clear, concise answers based on the available context.`}
          labels={{
            title: "GrowthPods Assistant",
            initial: "Need help with anything?",
            placeholder: "Ask me anything about your account...",
          }}
          className="fixed bottom-4 right-4 z-50"
        />
      </div>
    </div>
  );
};

export default Layout;
