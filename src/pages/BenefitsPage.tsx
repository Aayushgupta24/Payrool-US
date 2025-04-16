import React from 'react';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const BenefitsPage: React.FC = () => {
  useSmartNavigation();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Benefits</h1>
      {/* Content will be added based on your screenshots */}
    </div>
  );
};

export default BenefitsPage;
