import React from 'react';
import { allAnnouncements } from './data';

const Announcements: React.FC = () => {
  return (
    <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-gray-100">Announcements</h3>
      <div className="space-y-4">
        {allAnnouncements.map((announcement) => (
          <div key={announcement.id} className="p-4 border rounded-lg border-border dark:border-gray-700">
            <h4 className="font-semibold text-text-primary dark:text-gray-200">{announcement.title}</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400">{announcement.content}</p>
            <p className="mt-2 text-xs text-right text-gray-400 dark:text-gray-500">
              - {announcement.author}, {announcement.date}
            </p>
          </div>
        ))}
      </div>
       <button className="w-full px-4 py-2 mt-4 text-sm font-medium text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800">
        View All Announcements
      </button>
    </div>
  );
};

export default Announcements;