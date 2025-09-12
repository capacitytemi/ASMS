import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, SunIcon, MoonIcon, MenuIcon, ChevronDownIcon } from '../constants';
import { Role } from '../App';

type Theme = 'light' | 'dark';

interface HeaderProps {
  title: string;
  theme: Theme;
  toggleTheme: () => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  onMenuClick: () => void;
}

const roleConfig: Record<Role, { name: string; avatar: string }> = {
    Admin: { name: 'Admin User', avatar: 'https://picsum.photos/id/237/200/200' },
    Teacher: { name: 'Teacher User', avatar: 'https://picsum.photos/id/1027/200/200' },
    Accountant: { name: 'Accountant User', avatar: 'https://picsum.photos/id/1011/200/200' },
    Student: { name: 'Student User', avatar: 'https://picsum.photos/id/1005/200/200' },
    Parent: { name: 'Parent User', avatar: 'https://picsum.photos/id/1025/200/200' },
};

const Header: React.FC<HeaderProps> = ({ title, theme, toggleTheme, activeRole, setActiveRole, onMenuClick }) => {
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = roleConfig[activeRole];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="mb-6">
      {/* Mobile Header */}
      <div className="relative z-10 flex items-center justify-between h-16 bg-white shadow-sm lg:hidden dark:bg-gray-800 dark:border-b dark:border-gray-700 -mx-4 -mt-6 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 mb-6">
            <button
                onClick={onMenuClick}
                className="text-gray-500 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-label="Open sidebar"
            >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-text-primary dark:text-gray-50">{title}</h1>
            <img
                className="w-8 h-8 rounded-full"
                src={currentUser.avatar}
                alt="User avatar"
             />
      </div>

      {/* Desktop Header */}
      <div className="items-center justify-between hidden pb-6 lg:flex">
        <h1 className="text-3xl font-bold text-text-primary dark:text-gray-50">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setRoleDropdownOpen(prev => !prev)}
              className="flex items-center p-2 space-x-2 text-sm font-medium text-gray-600 bg-white border rounded-full dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
            >
               <img
                className="w-8 h-8 rounded-full"
                src={currentUser.avatar}
                alt="User avatar"
              />
              <span className='px-2'>{currentUser.name}</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {(['Admin', 'Teacher', 'Accountant', 'Student', 'Parent'] as Role[]).map(role => (
                     <a
                      key={role}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm ${activeRole === role ? 'font-bold text-primary' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                      role="menuitem"
                    >
                      Switch to {role}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 bg-white border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
          <button className="p-2 text-gray-500 bg-white border rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none">
            <span className="sr-only">View notifications</span>
            <BellIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;