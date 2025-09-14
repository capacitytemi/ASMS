import React, { useMemo } from 'react';
import Header from './Header';
import { Role } from '../App';
import { allTimetableData, allTeachers, allStudents, LOGGED_IN_STUDENT_ID } from './data';

type Theme = 'light' | 'dark';
interface TimetableProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    onMenuClick: () => void;
    onLogout: () => void;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Timetable: React.FC<TimetableProps> = ({ theme, toggleTheme, activeRole, onMenuClick, onLogout }) => {
    
    const loggedInStudent = useMemo(() => allStudents.find(s => s.id === LOGGED_IN_STUDENT_ID), []);
    const studentClass = loggedInStudent?.class || 'N/A';

    const title = activeRole === 'Parent' ? `My Child's Timetable` : `My Weekly Timetable`;

    const getTeacherName = (teacherId: string) => {
        return allTeachers.find(t => t.id === teacherId)?.name || 'N/A';
    }

    return (
        <>
            <Header title={title} theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} onMenuClick={onMenuClick} onLogout={onLogout} />
            <div className="bg-card dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-border dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">{studentClass} - Class Schedule</h3>
                </div>
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x dark:divide-gray-700">
                        {days.map(day => (
                            <div key={day} className="flex-1">
                                <div className="p-4 text-center font-bold bg-gray-50 dark:bg-gray-700/50">{day}</div>
                                <div className="p-2 space-y-2">
                                    {allTimetableData.filter(entry => entry.day === day && entry.class === studentClass).map(entry => (
                                        <div key={`${day}-${entry.time}-${entry.subject}`} className="p-3 bg-primary-light dark:bg-gray-700 rounded-lg">
                                            <p className="font-semibold text-primary dark:text-blue-300">{entry.subject}</p>
                                            <p className="text-sm text-text-secondary dark:text-gray-400">{entry.time}</p>
                                            <p className="text-xs text-text-secondary dark:text-gray-500">w/ {getTeacherName(entry.teacherId)}</p>
                                        </div>
                                    ))}
                                    {allTimetableData.filter(entry => entry.day === day && entry.class === studentClass).length === 0 && (
                                        <div className="p-3 text-center text-text-secondary dark:text-gray-400 text-sm">No classes scheduled.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Timetable;
