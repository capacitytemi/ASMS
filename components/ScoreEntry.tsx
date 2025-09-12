import React, { useState, useMemo, useCallback } from 'react';
import Header from './Header';
import type { Student, SubjectScore } from '../types';
import { Role } from '../App';
import { allStudents } from './data';

type Theme = 'light' | 'dark';
interface ScoreEntryProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    setActiveRole: (role: Role) => void;
    onMenuClick: () => void;
}

const subjects = ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Computer Science', 'Civic Education', 'Agricultural Science'];

const getGradeAndRemark = (total: number): { grade: SubjectScore['grade'], remark: SubjectScore['remark'] } => {
    if (total >= 75) return { grade: 'A', remark: 'Excellent' };
    if (total >= 65) return { grade: 'B', remark: 'Very Good' };
    if (total >= 55) return { grade: 'C', remark: 'Good' };
    if (total >= 45) return { grade: 'D', remark: 'Pass' };
    if (total >= 40) return { grade: 'E', 'remark': 'Credit' };
    return { grade: 'F', remark: 'Fail' };
};

const ScoreEntry: React.FC<ScoreEntryProps> = ({ theme, toggleTheme, activeRole, setActiveRole, onMenuClick }) => {
    const allClasses = useMemo(() => [...new Set(allStudents.map(s => s.class))].sort(), []);
    const [selectedClass, setSelectedClass] = useState(allClasses[0] || '');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [scores, setScores] = useState<SubjectScore[]>([]);

    const studentsInClass = useMemo(() => allStudents.filter(s => s.class === selectedClass), [selectedClass]);

    const initializeScores = useCallback((studentId: string) => {
        if (!studentId) {
            setScores([]);
            return;
        }
        // In a real app, you'd fetch existing scores here. For now, we initialize.
        const initialScores = subjects.map(subject => ({
            subject,
            test: 0,
            exam: 0,
            total: 0,
            grade: 'F' as 'F',
            remark: 'Fail' as 'Fail'
        }));
        setScores(initialScores);
    }, []);
    
    const handleStudentChange = (studentId: string) => {
        setSelectedStudentId(studentId);
        initializeScores(studentId);
    }
    
    const handleScoreChange = (index: number, field: 'test' | 'exam', value: number) => {
        const newScores = [...scores];
        const score = newScores[index];
        
        const testValue = field === 'test' ? value : score.test;
        const examValue = field === 'exam' ? value : score.exam;

        if (testValue < 0 || testValue > 40) return;
        if (examValue < 0 || examValue > 60) return;

        score[field] = value;
        score.total = score.test + score.exam;
        const { grade, remark } = getGradeAndRemark(score.total);
        score.grade = grade;
        score.remark = remark;

        setScores(newScores);
    };
    
    const totalScore = useMemo(() => scores.reduce((acc, score) => acc + score.total, 0), [scores]);

    return (
        <>
            <Header title="Score Entry" theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} setActiveRole={setActiveRole} onMenuClick={onMenuClick} />
            <div className="p-6 mb-6 bg-card dark:bg-gray-800 rounded-xl shadow-sm space-y-4">
                 <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">Select Student</h3>
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedStudentId('') }} className="block w-full p-2 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                         {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <select value={selectedStudentId} onChange={e => handleStudentChange(e.target.value)} className="block w-full p-2 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                         <option value="">-- Select a student --</option>
                         {studentsInClass.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                     </select>
                </div>
            </div>

            {selectedStudentId && (
                <div className="mt-8 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
                    <div className="p-4 sm:p-6 border-b border-border dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                            Entering Scores for: <span className="text-primary">{allStudents.find(s => s.id === selectedStudentId)?.name}</span>
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Subject</th>
                                    <th scope="col" className="px-6 py-3 text-center">Test (40)</th>
                                    <th scope="col" className="px-6 py-3 text-center">Exam (60)</th>
                                    <th scope="col" className="px-6 py-3 font-bold text-center">Total (100)</th>
                                    <th scope="col" className="px-6 py-3 font-bold text-center">Grade</th>
                                    <th scope="col" className="px-6 py-3 font-bold">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((score, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{score.subject}</th>
                                        <td className="px-6 py-2">
                                            <input type="number" max="40" min="0" value={score.test} onChange={e => handleScoreChange(index, 'test', parseInt(e.target.value) || 0)} className="w-20 p-1 text-center border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                                        </td>
                                        <td className="px-6 py-2">
                                            <input type="number" max="60" min="0" value={score.exam} onChange={e => handleScoreChange(index, 'exam', parseInt(e.target.value) || 0)} className="w-20 p-1 text-center border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-center text-text-primary dark:text-gray-200">{score.total}</td>
                                        <td className="px-6 py-4 font-semibold text-center text-text-primary dark:text-gray-200">{score.grade}</td>
                                        <td className="px-6 py-4">{score.remark}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-gray-50 dark:bg-gray-700">
                                    <td colSpan={3} className="px-6 py-4 text-right">Term Total Score:</td>
                                    <td className="px-6 py-4 text-center">{totalScore} / {scores.length * 100}</td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex justify-end">
                        <button className="px-6 py-2 text-white rounded-lg bg-secondary hover:bg-green-600">Save Scores</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScoreEntry;