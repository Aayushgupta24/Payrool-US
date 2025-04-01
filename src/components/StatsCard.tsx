import React from 'react';
import { StatsCard as StatsCardType } from '../types';

interface StatsCardProps {
  stats: StatsCardType;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium mb-2">{stats.title}</h3>
      <p className="text-4xl font-bold">{stats.value}</p>
    </div>
  );
};

export default StatsCard;