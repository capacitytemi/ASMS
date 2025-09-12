import React from 'react';
import type { StatCardData } from '../types';

interface StatCardProps {
  data: StatCardData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value, change, changeType, icon } = data;
  const isIncrease = changeType === 'increase';

  return (
    <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-text-primary dark:text-gray-100">{value}</p>
        </div>
        <div className="p-3 text-white bg-primary rounded-full">
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4 text-sm">
        <span className={`flex items-center font-semibold ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
           {isIncrease ? (
             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
           ) : (
             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
           )}
          {change}
        </span>
        <span className="ml-2 text-text-secondary dark:text-gray-500">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;