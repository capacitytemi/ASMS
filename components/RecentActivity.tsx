import React from 'react';
import { allActivities } from './data';

const RecentActivity: React.FC = () => {
  return (
    <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-gray-100">Recent Activity</h3>
      <ul className="space-y-4">
        {allActivities.map((activity) => (
          <li key={activity.id} className="flex items-center">
            <img className="w-10 h-10 rounded-full" src={activity.avatar} alt={activity.user} />
            <div className="ml-4">
              <p className="text-sm text-text-primary dark:text-gray-200">
                <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;