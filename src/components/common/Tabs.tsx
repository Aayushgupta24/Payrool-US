import React, { createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  onChange: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactNode;
}

interface TabListProps {
  children: React.ReactNode;
}

interface TabProps {
  id: string;
  children: React.ReactNode;
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children }) => {
  return (
    <TabsContext.Provider value={{ activeTab, onChange }}>
      <div className="space-y-6">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<TabListProps> = ({ children }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ id, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within a Tabs component');
  const { activeTab, onChange } = context;

  return (
    <button
      className={`
        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
        ${id === activeTab
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
      onClick={() => onChange(id)}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ id, children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within a Tabs component');
  const { activeTab } = context;

  if (id !== activeTab) return null;
  return <div className="py-6">{children}</div>;
};
