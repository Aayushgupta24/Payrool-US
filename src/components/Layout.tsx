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
      <div className="flex-1">
        {children}
        <CopilotPopup
          instructions={`You are the Payroll AI Agent. Help users with:
            - Managing employees and contractors
            - Handling payroll and benefits
            - Accessing tax documents
            - Understanding company policies
            - Generating reports
            Provide clear, concise answers based on the available context.`}
          labels={{
            title: "Payroll AI Agent",
            initial: "Need help with anything?",
            placeholder: "Ask me anything about your account..."
          }}
          windowTitle="Payroll AI Agent"
          className="bottom-4 right-4"
        />
      </div>
    </div>
  );
};

export default Layout;
