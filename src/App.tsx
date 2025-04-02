import React from 'react';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {/* Your routes/content here */}
      </main>
    </div>
  );
};

export default App;


