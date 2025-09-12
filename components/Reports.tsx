import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import type { StudentReport, Student } from '../types';
import { Role } from '../App';
import { PrinterIcon } from '../constants';
import { allStudents, allReports, LOGGED_IN_STUDENT_ID } from './data';


type Theme = 'light' | 'dark';
interface ReportsProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    setActiveRole: (role: Role) => void;
    onMenuClick: () => void;
}

const Reports: React.FC<ReportsProps> = ({ theme, toggleTheme, activeRole, setActiveRole, onMenuClick }) => {
    const isStudentOrParent = activeRole === 'Student' || activeRole === 'Parent';
    
    const allClasses = useMemo(() => [...new Set(allStudents.map(s => s.class))].sort(), []);

    // Admin/Teacher state
    const [selectedClass, setSelectedClass] = useState(allClasses[0] || '');
    const studentsInClass = useMemo(() => allStudents.filter(s => s.class === selectedClass), [selectedClass]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    
    // All roles state
    const [selectedTerm, setSelectedTerm] = useState('First Term');
    const [report, setReport] = useState<StudentReport | null>(null);

    useEffect(() => {
      // When selected class changes, reset the student selection and report
      setSelectedStudentId('');
      setReport(null);
    }, [selectedClass]);

    const handleGenerate = () => {
        const studentId = isStudentOrParent ? LOGGED_IN_STUDENT_ID : selectedStudentId;
        if (!studentId) return;
        const foundReport = allReports.find(r => r.studentId === studentId && r.term === selectedTerm);
        setReport(foundReport || null);
    };

    const handlePrint = () => {
      const printContents = document.getElementById("report-card")!.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = `<body class="bg-white">${printContents}</body>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // to re-attach event listeners
    };
    
    const student = report ? allStudents.find(s => s.id === report.studentId) : null;
    let title = isStudentOrParent ? "My Academic Reports" : "Academic Reports";
    if (isStudentOrParent && activeRole === 'Parent') title = "My Child's Reports";


    return (
        <>
            <Header title={title} theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} setActiveRole={setActiveRole} onMenuClick={onMenuClick}/>

            <div className="p-6 mb-6 bg-card dark:bg-gray-800 rounded-xl shadow-sm space-y-4 print:hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                        {isStudentOrParent ? 'Select Term to View' : 'Report Generation'}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {!isStudentOrParent && (
                        <>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="block w-full p-2 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="block w-full p-2 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white" disabled={!studentsInClass.length}>
                             <option value="" disabled>-- Select a student --</option>
                            {studentsInClass.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                            {studentsInClass.length === 0 && (
                                <option disabled>No students in this class</option>
                            )}
                        </select>
                        </>
                    )}
                     <select disabled className="block w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                         <option>2023/2024</option>
                     </select>
                     <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="block w-full p-2 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                         <option>First Term</option>
                         <option>Second Term</option>
                         <option>Third Term</option>
                     </select>
                </div>
                 <button onClick={handleGenerate} disabled={!isStudentOrParent && !selectedStudentId} className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed">
                     Generate Report
                 </button>
            </div>

            {report && student && (
                <div id="report-card-container">
                    <div className="p-6 bg-card dark:bg-gray-800 rounded-xl shadow-sm" id="report-card">
                        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-gray-700">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">{student.name}</h2>
                                <p className="text-text-secondary dark:text-gray-400">ID: {report.studentId} | Class: {report.class}</p>
                            </div>
                            <button onClick={handlePrint} className="flex items-center px-4 py-2 space-x-2 text-white rounded-lg bg-secondary hover:bg-green-600 print:hidden">
                                <PrinterIcon className="w-5 h-5"/>
                                <span>Print</span>
                            </button>
                        </div>
                        <div className="py-4 text-center">
                            <h3 className="text-xl font-semibold">{report.year} Academic Session</h3>
                            <p className="font-medium text-primary">{report.term} Report</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Subject</th>
                                        <th scope="col" className="px-6 py-3 text-center">Test (40)</th>
                                        <th scope="col" className="px-6 py-3 text-center">Exam (60)</th>
                                        <th scope="col" className="px-6 py-3 text-center">Total (100)</th>
                                        <th scope="col" className="px-6 py-3 text-center">Grade</th>
                                        <th scope="col" className="px-6 py-3">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.scores.map((score, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{score.subject}</th>
                                            <td className="px-6 py-4 text-center">{score.test}</td>
                                            <td className="px-6 py-4 text-center">{score.exam}</td>
                                            <td className="px-6 py-4 font-semibold text-center text-text-primary dark:text-gray-200">{score.total}</td>
                                            <td className="px-6 py-4 font-semibold text-center text-text-primary dark:text-gray-200">{score.grade}</td>
                                            <td className="px-6 py-4">{score.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-6 mt-6 border-t md:grid-cols-3 border-border dark:border-gray-700">
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                <p className="font-semibold">Term Total Score</p>
                                <p className="text-2xl font-bold text-primary">{report.termTotal} / {report.scores.length * 100}</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                <p className="font-semibold">Term Average</p>
                                <p className="text-2xl font-bold text-primary">{report.termAverage.toFixed(2)}%</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                                <p className="font-semibold">Cumulative Average</p>
                                <p className="text-2xl font-bold text-primary">{report.cumulativeAverage.toFixed(2)}%</p>
                            </div>
                        </div>
                         <div className="pt-4 mt-4">
                            <p className="font-semibold">Principal's Remark:</p>
                            <p className="italic text-text-secondary dark:text-gray-300">"{report.principalsRemark}"</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Reports;