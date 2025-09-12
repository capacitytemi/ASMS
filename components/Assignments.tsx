import React, { useState } from 'react';
import Header from './Header';
import Modal from './Modal';
import { Role } from '../App';
import type { Assignment } from '../types';
import { DownloadIcon, UploadIcon, CheckCircleIcon } from '../constants';
import { allAssignments } from './data';

type Theme = 'light' | 'dark';
interface AssignmentsProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    setActiveRole: (role: Role) => void;
    onMenuClick: () => void;
}

const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Graded: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const Assignments: React.FC<AssignmentsProps> = ({ theme, toggleTheme, activeRole, setActiveRole, onMenuClick }) => {
    const [assignments, setAssignments] = useState(allAssignments);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    const handleOpenModal = (assignment: Assignment) => {
        if (activeRole !== 'Student') return;
        setSelectedAssignment(assignment);
        setModalOpen(true);
    };

    const handleSubmission = () => {
        if (!selectedAssignment) return;
        setAssignments(assignments.map(a =>
            a.id === selectedAssignment.id ? { ...a, status: 'Submitted' } : a
        ));
        setModalOpen(false);
    };

    const title = activeRole === 'Parent' ? "My Child's Assignments" : "My Assignments";

    return (
        <>
            <Header title={title} theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} setActiveRole={setActiveRole} onMenuClick={onMenuClick} />
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map(assignment => (
                    <div key={assignment.id} className="bg-card dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-primary dark:text-blue-400">{assignment.subject}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[assignment.status]}`}>{assignment.status}</span>
                            </div>
                            <h4 className="text-lg font-bold text-text-primary dark:text-gray-100 mt-1">{assignment.title}</h4>
                            <div className="text-xs text-text-secondary dark:text-gray-400 mt-2">
                                <p>Due: <span className="font-semibold text-red-500 dark:text-red-400">{assignment.dueDate}</span></p>
                                {assignment.status === 'Graded' && <p className="mt-1">Grade: <span className="font-bold text-lg text-green-500">{assignment.grade}</span></p>}
                            </div>
                        </div>
                        <div className="flex items-center mt-4 space-x-2">
                            <a 
                                href={assignment.fileUrl} 
                                download
                                className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-primary dark:text-blue-300 bg-primary-light dark:bg-gray-700 rounded-lg hover:bg-blue-200 dark:hover:bg-gray-600"
                            >
                                <DownloadIcon className="w-5 h-5"/>
                                <span>Materials</span>
                            </a>
                            {activeRole === 'Student' && assignment.status === 'Pending' && (
                                <button
                                    onClick={() => handleOpenModal(assignment)}
                                    className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-white rounded-lg bg-secondary hover:bg-green-600 focus:outline-none"
                                >
                                    <UploadIcon className="w-5 h-5"/>
                                    <span>Submit</span>
                                </button>
                            )}
                             {assignment.status === 'Submitted' && (
                                <div className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm text-green-600 rounded-lg bg-green-100 dark:bg-green-900/50">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span>Submitted</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Submit: ${selectedAssignment?.title || ''}`}>
                <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full dark:bg-blue-900/50">
                        <UploadIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <p className="mt-4 text-text-secondary dark:text-gray-400">Click the button below to upload your file.</p>
                    <button className="w-full py-2 mt-4 text-sm font-medium border-2 border-dashed rounded-lg border-border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Select File
                    </button>
                    <div className="flex justify-end mt-6 space-x-2">
                        <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                        <button onClick={handleSubmission} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">Confirm Submission</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Assignments;