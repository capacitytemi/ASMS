import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Fees from './components/Fees';
import Students from './components/Students';
import ScoreEntry from './components/ScoreEntry';
import Timetable from './components/Timetable';
import Assignments from './components/Assignments';
import Header from './components/Header';
import { XIcon } from './constants';

type Theme = 'light' | 'dark';
export type Role = 'Admin' | 'Teacher' | 'Accountant' | 'Student' | 'Parent';
export type Page = 'Dashboard' | 'Reports' | 'Fees' | 'Students' | 'Score Entry' | 'Timetable' | 'Assignments' | 'Settings';


const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [activeRole, setActiveRole] = useState<Role>('Admin');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderPage = () => {
    const headerProps = { theme, toggleTheme, activeRole, setActiveRole, onMenuClick: () => setSidebarOpen(true) };
    
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard {...headerProps} />;
      case 'Reports':
        return <Reports {...headerProps} />;
      case 'Fees':
        return <Fees {...headerProps} />;
       case 'Students':
        return <Students {...headerProps} />;
      case 'Score Entry':
        return <ScoreEntry {...headerProps} />;
      case 'Assignments':
        return <Assignments {...headerProps} />;
      case 'Timetable':
        return <Timetable {...headerProps} />;
      default:
        // Fallback for non-implemented pages, ensures dashboard is always accessible
        return <Dashboard {...headerProps} />;
    }
  };

  const handleSetPage = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false); // Close mobile sidebar on navigation
  }
  
  const handleSetRole = (role: Role) => {
    setActiveRole(role);
    // Reset to dashboard page on role change to avoid permission errors
    setActivePage('Dashboard'); 
  }

  return (
    <div className="flex h-screen bg-background dark:bg-gray-900">
      {/* Static sidebar for larger screens */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar activePage={activePage} setActivePage={handleSetPage} activeRole={activeRole}/>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
           <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
           <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white dark:bg-gray-800">
                <div className="absolute top-0 right-0 p-1 -mr-14">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600"
                        aria-label="Close sidebar"
                    >
                        <XIcon className="w-6 h-6 text-white" />
                    </button>
                </div>
                <Sidebar activePage={activePage} setActivePage={handleSetPage} activeRole={activeRole} />
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>
      )}

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Mobile Header, now part of each page component */}
        
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;