import React, { useState, useMemo } from 'react';
import Header from './Header';
import Modal from './Modal';
import type { Student } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../constants';
import { Role } from '../App';
import { allStudents } from './data';

type Theme = 'light' | 'dark';
interface StudentsProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    onMenuClick: () => void;
    onLogout: () => void;
}

const emptyStudent: Student = { id: '', name: '', class: '', dob: '', parentName: '', parentPhone: '' };

const Students: React.FC<StudentsProps> = ({ theme, toggleTheme, activeRole, onMenuClick, onLogout }) => {
    const [students, setStudents] = useState(allStudents);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const allClasses = useMemo(() => [...new Set(allStudents.map(s => s.class))].sort(), [students]);


    const handleOpenModal = (student: Student | null) => {
        const newStudentData = student 
            ? {...student} 
            : {...emptyStudent, class: allClasses[0] || '', id: `JSS/24/${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`};
        setEditingStudent(newStudentData);
        setModalOpen(true);
    };

    const handleSaveStudent = () => {
        if (!editingStudent?.name) return; // Basic validation

        if (students.some(s => s.id === editingStudent.id)) {
            // Update existing student
            setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
        } else {
            // Add new student
            setStudents([...students, editingStudent]);
        }
        setModalOpen(false);
        setEditingStudent(null);
    };

    const handleDeleteStudent = (studentId: string) => {
        if(window.confirm("Are you sure you want to delete this student record?")) {
            setStudents(students.filter(s => s.id !== studentId));
        }
    };
    
    return (
        <>
            <Header title="Student Management" theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} onMenuClick={onMenuClick} onLogout={onLogout} />
            
            <div className="mt-8 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="p-4 sm:p-6 border-b border-border dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">All Students</h3>
                    <button onClick={() => handleOpenModal(null)} className="flex items-center px-4 py-2 space-x-2 text-sm text-white rounded-lg bg-primary hover:bg-primary-dark">
                        <PlusIcon className="w-5 h-5"/>
                        <span>Add Student</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary dark:text-gray-400">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Date of Birth</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-mono text-xs">{student.id}</td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student.name}</th>
                                    <td className="px-6 py-4">{student.class}</td>
                                    <td className="px-6 py-4">{student.dob}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => handleOpenModal(student)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-red-600 rounded-full hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingStudent && students.some(s => s.id === editingStudent.id) ? 'Edit Student' : 'Add New Student'}>
                {editingStudent && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium">Full Name</label>
                                <input type="text" value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} className="w-full p-2 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Class</label>
                                <select value={editingStudent.class} onChange={e => setEditingStudent({...editingStudent, class: e.target.value})} className="w-full p-2 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Date of Birth</label>
                                <input type="date" value={editingStudent.dob} onChange={e => setEditingStudent({...editingStudent, dob: e.target.value})} className="w-full p-2 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Student ID</label>
                                <input type="text" value={editingStudent.id} disabled className="w-full p-2 mt-1 border rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Parent's Name</label>
                                <input type="text" value={editingStudent.parentName} onChange={e => setEditingStudent({...editingStudent, parentName: e.target.value})} className="w-full p-2 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Parent's Phone</label>
                                <input type="tel" value={editingStudent.parentPhone} onChange={e => setEditingStudent({...editingStudent, parentPhone: e.target.value})} className="w-full p-2 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 space-x-2">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancel</button>
                            <button onClick={handleSaveStudent} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">Save Student</button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Students;
