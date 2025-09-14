import React, { useMemo } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import EnrollmentChart from './charts/EnrollmentChart';
import AttendanceChart, { attendanceChartData } from './charts/AttendanceChart';
import RecentActivity from './RecentActivity';
import Announcements from './Announcements';
import { UsersIcon, CashIcon, ChartBarIcon, DocumentTextIcon, PencilIcon, ClipboardListIcon } from '../constants';
import type { StatCardData } from '../types';
import { Role, Page } from '../App';
// Fix: Import `allTimetableData` which was missing.
import { allStudents, allTeachers, allFeeRecords, allReports, allAssignments, allQuizzes, allQuizAttempts, LOGGED_IN_STUDENT_ID, LOGGED_IN_TEACHER_ID, allTimetableData } from './data';

type Theme = 'light' | 'dark';

interface DashboardProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    onMenuClick: () => void;
    onLogout: () => void;
    setActivePage: (page: Page) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const StudentQuizOverview: React.FC<{setActivePage: (page: Page) => void}> = ({ setActivePage }) => {
    const loggedInStudent = useMemo(() => allStudents.find(s => s.id === LOGGED_IN_STUDENT_ID), []);
    const studentQuizzes = useMemo(() => allQuizzes.filter(q => q.class === loggedInStudent?.class), [loggedInStudent]);
    const studentAttempts = useMemo(() => allQuizAttempts.filter(a => a.studentId === loggedInStudent?.id), [loggedInStudent]);
    
    const quizzesWithStatus = useMemo(() => {
        return studentQuizzes.map(quiz => {
            const attempt = studentAttempts.find(a => a.quizId === quiz.id);
            return { ...quiz, attempt };
        });
    }, [studentQuizzes, studentAttempts]);

    return (
        <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-gray-100">Quizzes & Assignments</h3>
            <div className="space-y-3">
                 {/* Quizzes */}
                {quizzesWithStatus.slice(0, 2).map(quiz => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-primary-light dark:bg-gray-700">
                        <div className="flex items-center overflow-hidden">
                            <div className="flex-shrink-0 p-2 text-white rounded-full bg-primary">
                                <ClipboardListIcon className="w-5 h-5"/>
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold truncate text-text-primary dark:text-gray-200">{quiz.title}</p>
                              <p className="text-sm text-text-secondary dark:text-gray-400">
                                {quiz.subject} - {quiz.questions.length} questions
                              </p>
                            </div>
                        </div>
                        {quiz.attempt ? (
                            <button onClick={() => setActivePage('Quiz')} className="flex-shrink-0 px-3 py-1 text-sm font-semibold text-green-700 bg-green-200 rounded-full whitespace-nowrap dark:bg-green-800 dark:text-green-200 hover:bg-green-300">
                                Review ({quiz.attempt.score}/{quiz.questions.length})
                            </button>
                        ) : (
                             <button onClick={() => setActivePage('Quiz')} className="flex-shrink-0 px-3 py-1 text-sm font-semibold text-white bg-secondary rounded-full whitespace-nowrap hover:bg-green-600">
                                Take Quiz
                            </button>
                        )}
                    </div>
                ))}
                
                {/* Assignments */}
                {allAssignments.filter(a => a.status === 'Pending').slice(0, 2).map((ass) => (
                  <div key={ass.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-gray-700">
                     <div className="flex items-center overflow-hidden">
                        <div className="flex-shrink-0 p-2 text-white bg-yellow-500 rounded-full">
                            <DocumentTextIcon className="w-5 h-5"/>
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold truncate text-text-primary dark:text-gray-200">{ass.title}</p>
                          <p className="text-sm text-text-secondary dark:text-gray-400">
                            Due: <span className="font-medium text-red-500">{ass.dueDate}</span>
                          </p>
                        </div>
                     </div>
                     <button onClick={() => setActivePage('Assignments')} className="flex-shrink-0 px-3 py-1 text-sm font-semibold text-yellow-700 bg-yellow-200 rounded-full whitespace-nowrap dark:bg-yellow-800 dark:text-yellow-200 hover:bg-yellow-300">
                        View
                    </button>
                  </div>
                ))}
                {quizzesWithStatus.length === 0 && allAssignments.filter(a => a.status === 'Pending').length === 0 && (
                  <p className="text-center text-text-secondary">No pending quizzes or assignments.</p>
                )}
            </div>
             <button onClick={() => setActivePage('Quiz')} className="w-full px-4 py-2 mt-4 text-sm font-medium text-primary transition-colors duration-150 border border-primary rounded-lg dark:text-blue-300 dark:border-blue-300 hover:bg-primary-light dark:hover:bg-gray-700">
                View All Quizzes & Assignments
              </button>
        </div>
    )
}


const Dashboard: React.FC<DashboardProps> = ({ theme, toggleTheme, activeRole, onMenuClick, onLogout, setActivePage }) => {
  const isStudentOrParent = activeRole === 'Student' || activeRole === 'Parent';

  const stats: StatCardData[] = useMemo(() => {
    switch(activeRole) {
      case 'Admin': {
        const totalFees = allFeeRecords.reduce((sum, r) => sum + r.amountPaid, 0);
        const totalPresent = attendanceChartData.reduce((sum, d) => sum + d.present, 0);
        const totalStudentsInChart = attendanceChartData.reduce((sum, d) => sum + d.present + d.absent, 0);
        const attendancePercentage = totalStudentsInChart > 0 ? ((totalPresent / totalStudentsInChart) * 100).toFixed(1) : 'N/A';
        
        return [
          { title: 'Total Students', value: allStudents.length.toString(), change: '+5 since last month', changeType: 'increase', icon: <UsersIcon className="w-6 h-6"/> },
          { title: 'Total Teachers', value: allTeachers.length.toString(), change: '+2 since last month', changeType: 'increase', icon: <UsersIcon className="w-6 h-6" /> },
          { title: 'Fees Collected', value: formatCurrency(totalFees), change: 'This Term', changeType: 'increase', icon: <CashIcon className="w-6 h-6"/> },
          { title: 'Attendance', value: `${attendancePercentage}%`, change: 'Today', changeType: 'increase', icon: <ChartBarIcon className="w-6 h-6" /> },
        ];
      }
      case 'Teacher': {
        const teacherClasses = [...new Set(allTimetableData.filter(t => t.teacherId === LOGGED_IN_TEACHER_ID).map(c => c.class))];
        const teacherStudents = allStudents.filter(s => teacherClasses.includes(s.class));
        const pendingGrading = allAssignments.filter(a => a.teacherId === LOGGED_IN_TEACHER_ID && a.status === 'Submitted');

        return [
            { title: 'My Students', value: teacherStudents.length.toString(), change: 'Across all classes', changeType: 'increase', icon: <UsersIcon className="w-6 h-6"/> },
            { title: 'My Classes', value: teacherClasses.length.toString(), change: 'This term', changeType: 'increase', icon: <ChartBarIcon className="w-6 h-6" /> },
            { title: 'Pending Grading', value: pendingGrading.length.toString(), change: 'assignments', changeType: pendingGrading.length > 0 ? 'decrease' : 'increase', icon: <PencilIcon className="w-6 h-6"/> },
            { title: 'My Subjects', value: [...new Set(allTimetableData.filter(t => t.teacherId === LOGGED_IN_TEACHER_ID).map(c => c.subject))].length.toString(), change: 'assigned', changeType: 'increase', icon: <DocumentTextIcon className="w-6 h-6" /> },
        ];
      }
      case 'Accountant': {
        const totalCollectable = allFeeRecords.reduce((sum, r) => sum + r.totalFees, 0);
        const totalPaid = allFeeRecords.reduce((sum, r) => sum + r.amountPaid, 0);
        const totalOutstanding = totalCollectable - totalPaid;
        const paidPercent = totalCollectable > 0 ? ((totalPaid / totalCollectable) * 100).toFixed(1) : '0.0';

        return [
          { title: 'Total Collectable', value: formatCurrency(totalCollectable), change: 'Current Term', changeType: 'increase', icon: <CashIcon className="w-6 h-6"/> },
          { title: 'Total Paid', value: formatCurrency(totalPaid), change: `${paidPercent}%`, changeType: 'increase', icon: <UsersIcon className="w-6 h-6" /> },
          { title: 'Total Outstanding', value: formatCurrency(totalOutstanding), change: `${(100 - parseFloat(paidPercent)).toFixed(1)}%`, changeType: 'decrease', icon: <UsersIcon className="w-6 h-6" /> },
          { title: 'Paid Students', value: `${allFeeRecords.filter(r => r.status === 'Paid').length} / ${allFeeRecords.length}`, change: 'students', changeType: 'increase', icon: <ChartBarIcon className="w-6 h-6" /> },
        ];
      }
      case 'Student':
      case 'Parent': {
        const studentReports = allReports.filter(r => r.studentId === LOGGED_IN_STUDENT_ID);
        const latestReport = studentReports.sort((a,b) => b.term.localeCompare(a.term))[0];
        const studentFeeRecord = allFeeRecords.find(f => f.studentId === LOGGED_IN_STUDENT_ID);
        
        return [
          { title: 'Overall Average', value: `${latestReport?.cumulativeAverage.toFixed(1) || 'N/A'}%`, change: 'Current GPA', changeType: 'increase', icon: <ChartBarIcon className="w-6 h-6"/> },
          { title: 'Pending Assignments', value: allAssignments.filter(a => a.status === 'Pending').length.toString(), change: 'This week', changeType: 'decrease', icon: <DocumentTextIcon className="w-6 h-6"/> },
          { title: 'Fee Balance', value: formatCurrency(studentFeeRecord?.balance || 0), change: studentFeeRecord?.status || 'N/A', changeType: studentFeeRecord?.balance === 0 ? 'increase' : 'decrease', icon: <CashIcon className="w-6 h-6"/> },
          { title: 'Attendance', value: '98%', change: 'This month', changeType: 'increase', icon: <UsersIcon className="w-6 h-6" /> },
        ];
      }
      default: return [];
    }
  }, [activeRole]);
  
  const getTitle = () => {
    switch (activeRole) {
      case 'Admin': return 'Admin Dashboard';
      case 'Teacher': return 'Teacher Dashboard';
      case 'Accountant': return 'Accountant Dashboard';
      case 'Student': return 'My Dashboard';
      case 'Parent': return "My Child's Dashboard";
      default: return 'Dashboard';
    }
  };

  return (
    <>
      <Header title={getTitle()} theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} onMenuClick={onMenuClick} onLogout={onLogout} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((data) => (
          <StatCard key={data.title} data={data} />
        ))}
      </div>
      
      {activeRole === 'Student' || activeRole === 'Parent' ? (
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <StudentQuizOverview setActivePage={setActivePage} />
            </div>
            <div className="lg:col-span-1">
              <Announcements />
            </div>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <EnrollmentChart theme={theme} />
                </div>
                <div>
                    <AttendanceChart theme={theme} />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                <RecentActivity />
                </div>
                <div className="lg:col-span-2">
                <Announcements />
                </div>
            </div>
        </>
      )}
    </>
  );
};

export default Dashboard;