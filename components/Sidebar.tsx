import React from 'react';
import { HomeIcon, UsersIcon, CalendarIcon, DocumentTextIcon, ChartBarIcon, CogIcon, CashIcon, PencilIcon } from '../constants';
import { Role, Page } from '../App';

const navigationLinks: { name: Page; icon: React.FC<any>, roles: Role[] }[] = [
  { name: 'Dashboard', icon: HomeIcon, roles: ['Admin', 'Teacher', 'Accountant', 'Student', 'Parent'] },
  { name: 'Students', icon: UsersIcon, roles: ['Admin'] },
  { name: 'Score Entry', icon: PencilIcon, roles: ['Teacher'] },
  { name: 'Reports', icon: ChartBarIcon, roles: ['Admin', 'Teacher', 'Student', 'Parent'] },
  { name: 'Fees', icon: CashIcon, roles: ['Admin', 'Accountant', 'Student', 'Parent'] },
  { name: 'Timetable', icon: CalendarIcon, roles: ['Student', 'Parent'] },
  { name: 'Assignments', icon: DocumentTextIcon, roles: ['Student', 'Parent'] },
  { name: 'Settings', icon: CogIcon, roles: ['Admin'] },
];

const roleConfig: Record<Role, { name: string; avatar: string; color: string }> = {
    Admin: { name: 'Admin User', avatar: 'https://picsum.photos/id/237/200/200', color: 'bg-primary' },
    Teacher: { name: 'Teacher User', avatar: 'https://picsum.photos/id/1027/200/200', color: 'bg-teacher' },
    Accountant: { name: 'Accountant User', avatar: 'https://picsum.photos/id/1011/200/200', color: 'bg-accountant' },
    Student: { name: 'Student User', avatar: 'https://picsum.photos/id/1005/200/200', color: 'bg-green-500' },
    Parent: { name: 'Parent User', avatar: 'https://picsum.photos/id/1025/200/200', color: 'bg-indigo-500' },
}

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    activeRole: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, activeRole }) => {
  const visibleLinks = navigationLinks.filter(link => link.roles.includes(activeRole));
  const currentUser = roleConfig[activeRole];

  return (
    <div className="flex flex-col w-64 h-full bg-white border-r border-border dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center h-16 px-6 border-b border-border dark:border-gray-700">
         <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
        </svg>
        <span className="ml-3 text-xl font-bold text-text-primary dark:text-gray-100">ASMS</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-4">
          {visibleLinks.map((item) => {
            const pageName = item.name as Page;
            const isCurrent = activePage === pageName;
            
            return (
              <a
                key={item.name}
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setActivePage(pageName);
                }}
                className={`flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isCurrent
                    ? 'bg-primary-light text-primary dark:bg-primary dark:text-white'
                    : 'text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-text-primary dark:hover:text-gray-200'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
                {item.name}
              </a>
            )
          })}
        </nav>
      </div>
       <div className="flex-shrink-0 p-4 border-t border-border dark:border-gray-700">
          <div className="flex items-center">
            <div>
              <img className="inline-block w-10 h-10 rounded-full" src={currentUser.avatar} alt={currentUser.name} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-primary dark:text-gray-100">{currentUser.name}</p>
              <p className={`text-xs font-bold ${currentUser.color.replace('bg-', 'text-')}`}>{activeRole}</p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Sidebar;