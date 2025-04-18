import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmployerSidebar from '../components/EmployerSidebar';

const EmployerLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <EmployerSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
      
      {/* Navigation Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-teal-600 origin-left z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default EmployerLayout;
