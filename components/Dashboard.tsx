import React, { useMemo } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import EnrollmentChart from './charts/EnrollmentChart';
import AttendanceChart, { attendanceChartData } from './charts/AttendanceChart';
import RecentActivity from './RecentActivity';
import Announcements from './Announcements';
import { UsersIcon, CashIcon, ChartBarIcon, DocumentTextIcon, PencilIcon } from '../constants';
import type { StatCardData } from '../types';
import { Role } from '../App';
import { allStudents, allTeachers, allFeeRecords, allReports, allAssignments, allTimetableData, LOGGED_IN_STUDENT_ID, LOGGED_IN_TEACHER_ID } from './data';

type Theme = 'light' | 'dark';

interface DashboardProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    setActiveRole: (role: Role) => void;
    onMenuClick: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);


const UpcomingAssignments: React.FC = () => (
    <div className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-text-primary dark:text-gray-100">Upcoming Assignments</h3>
      <ul className="space-y-4">
        {allAssignments.filter(a => a.status === 'Pending').slice(0, 4).map((ass) => (
          <li key={ass.id} className="flex items-center p-3 rounded-lg bg-primary-light dark:bg-gray-700">
            <div className="flex-shrink-0 p-2 text-white rounded-full bg-primary">
                <DocumentTextIcon className="w-5 h-5"/>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-text-primary dark:text-gray-200">{ass.title}</p>
              <p className="text-sm text-text-secondary dark:text-gray-400">
                {ass.subject} - Due: <span className="font-medium text-red-500">{ass.dueDate}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ theme, toggleTheme, activeRole, setActiveRole, onMenuClick }) => {
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
      <Header title={getTitle()} theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} setActiveRole={setActiveRole} onMenuClick={onMenuClick} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((data) => (
          <StatCard key={data.title} data={data} />
        ))}
      </div>
      
      {activeRole === 'Student' || activeRole === 'Parent' ? (
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <UpcomingAssignments />
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