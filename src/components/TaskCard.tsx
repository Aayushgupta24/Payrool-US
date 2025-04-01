import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-4 flex justify-between items-center">
      <div className="flex items-start">
        <div className="bg-gray-100 p-2 rounded-lg mr-4">
          <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{task.title}</h3>
          <p className="text-gray-400 text-sm">{task.description}</p>
        </div>
      </div>
      <button className="bg-teal-600 text-white px-4 py-2 rounded">
        {task.title.includes("deposit") ? "Connect bank" : 
         task.title.includes("Federal") ? "Complete Federal W-4" : 
         task.title.includes("state") ? "Complete state W-4" : "Complete"}
      </button>
    </div>
  );
};

export default TaskCard;