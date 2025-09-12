import type { Student, Teacher, FeeRecord, StudentReport, Assignment, TimetableEntry, Activity, Announcement, SubjectScore } from '../types';

// Helper to generate a grade and remark from a total score
const getGradeAndRemark = (total: number): { grade: SubjectScore['grade'], remark: SubjectScore['remark'] } => {
    if (total >= 75) return { grade: 'A', remark: 'Excellent' };
    if (total >= 65) return { grade: 'B', remark: 'Very Good' };
    if (total >= 55) return { grade: 'C', remark: 'Good' };
    if (total >= 45) return { grade: 'D', remark: 'Pass' };
    if (total >= 40) return { grade: 'E', remark: 'Credit' };
    return { grade: 'F', remark: 'Fail' };
};

// Helper to generate a random report for a student
const generateReportForStudent = (student: Student): StudentReport => {
    const subjects = ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Computer Science', 'Civic Education', 'Agricultural Science'];
    const scores = subjects.map(subject => {
        const test = Math.floor(Math.random() * 21) + 20; // score between 20-40
        const exam = Math.floor(Math.random() * 26) + 35; // score between 35-60
        const total = test + exam;
        const { grade, remark } = getGradeAndRemark(total);
        return { subject, test, exam, total, grade, remark };
    });
    const termTotal = scores.reduce((acc, s) => acc + s.total, 0);
    const termAverage = termTotal / scores.length;
    return {
        studentId: student.id,
        class: student.class,
        term: 'First Term',
        year: '2023/2024',
        scores,
        termTotal,
        termAverage,
        cumulativeAverage: termAverage, // For simplicity, first term cumulative is same as term average
        principalsRemark: termAverage > 70 ? 'An excellent performance. Keep it up.' : 'A good effort, but there is room for improvement.'
    };
};


export const allTeachers: Teacher[] = [
    { id: 'T01', name: 'Mr. Adebayo', subject: 'Mathematics' },
    { id: 'T02', name: 'Mrs. Eze', subject: 'English Language' },
    { id: 'T03', name: 'Mr. Okoro', subject: 'Basic Science' },
    { id: 'T04', name: 'Ms. Fatima', subject: 'Social Studies' },
    { id: 'T05', name: 'Mr. Bello', subject: 'Computer Science' },
    { id: 'T06', name: 'Mrs. Williams', subject: 'Civic Education' },
    { id: 'T07', name: 'Mr. Chike', subject: 'Agricultural Science' },
];

export const allStudents: Student[] = [
    // JSS 1
    { id: 'JSS/23/001', name: 'Bello Adekunle', class: 'JSS 1A', dob: '2012-05-10', parentName: 'Mr. & Mrs. Bello', parentPhone: '08012345678' },
    { id: 'JSS/23/002', name: 'Aisha Yusuf', class: 'JSS 1A', dob: '2012-03-15', parentName: 'Mr. Yusuf', parentPhone: '08023456789' },
    { id: 'JSS/23/003', name: 'Tunde Ojo', class: 'JSS 1B', dob: '2012-07-21', parentName: 'Mrs. Ojo', parentPhone: '08098765432' },
    { id: 'JSS/23/004', name: 'Simisola Peters', class: 'JSS 1B', dob: '2012-06-11', parentName: 'Mr. Peters', parentPhone: '08011223344' },
    
    // JSS 2
    { id: 'JSS/22/005', name: 'Chinedu Okoro', class: 'JSS 2B', dob: '2011-08-22', parentName: 'Mr. Okoro', parentPhone: '08034567890' },
    { id: 'JSS/22/006', name: 'Ngozi Eze', class: 'JSS 2A', dob: '2011-04-18', parentName: 'Mr. & Mrs. Eze', parentPhone: '08022334455' },
    { id: 'JSS/22/007', name: 'Musa Ibrahim', class: 'JSS 2A', dob: '2011-09-01', parentName: 'Alhaji Ibrahim', parentPhone: '08055667788' },
    { id: 'JSS/22/008', name: 'Funke Lawal', class: 'JSS 2A', dob: '2011-12-05', parentName: 'Mrs. Lawal', parentPhone: '08033221144' },
    { id: 'JSS/22/009', name: 'Emeka Obi', class: 'JSS 2B', dob: '2011-10-10', parentName: 'Mr. Obi', parentPhone: '08076543210' },

    // JSS 3
    { id: 'JSS/21/010', name: 'Fatima Aliyu', class: 'JSS 3A', dob: '2010-11-20', parentName: 'Hajia Aliyu', parentPhone: '08045678901' },
    { id: 'JSS/21/011', name: 'David Adeleke', class: 'JSS 3A', dob: '2010-02-14', parentName: 'Chief Adeleke', parentPhone: '08066778899' },
    { id: 'JSS/21/012', name: 'Chioma Nwosu', class: 'JSS 3B', dob: '2010-06-30', parentName: 'Dr. Nwosu', parentPhone: '08077889900' },
    { id: 'JSS/21/013', name: 'Rotimi Bankole', class: 'JSS 3B', dob: '2010-01-25', parentName: 'Mr. Bankole', parentPhone: '08088990011' },
    { id: 'JSS/21/014', name: 'Halima Abubakar', class: 'JSS 3A', dob: '2010-08-19', parentName: 'Alhaji Abubakar', parentPhone: '08099001122' },
];

export const allFeeRecords: FeeRecord[] = allStudents.map((student, index) => {
    const feeMap: { [key: string]: number } = { 'JSS 1': 75000, 'JSS 2': 82000, 'JSS 3': 90000 };
    const baseClass = student.class.substring(0, 5);
    const totalFees = feeMap[baseClass];
    const statusOptions: FeeRecord['status'][] = ['Paid', 'Partial', 'Unpaid'];
    const status = statusOptions[index % 3];
    let amountPaid = 0;
    if (status === 'Paid') amountPaid = totalFees;
    if (status === 'Partial') amountPaid = totalFees / 2;
    
    return {
        id: index + 1,
        studentId: student.id,
        totalFees: totalFees,
        amountPaid: amountPaid,
        balance: totalFees - amountPaid,
        status: status,
        paymentHistory: amountPaid > 0 ? [{id: `P${index+1}`, date: '2023-09-05', amount: amountPaid, receiptNumber: `RCPT-00${index+1}`}] : [],
    }
});

// Generate a report for every student
export const allReports: StudentReport[] = allStudents.map(generateReportForStudent);

export const allAssignments: Assignment[] = [
    { id: 1, title: 'Algebra Worksheet I', subject: 'Mathematics', teacherId: 'T01', issuedDate: '2024-05-10', dueDate: '2024-05-17', fileUrl: '#', status: 'Graded', grade: 'A' },
    { id: 2, title: 'Essay: "My Hero"', subject: 'English Language', teacherId: 'T02', issuedDate: '2024-05-12', dueDate: '2024-05-20', fileUrl: '#', status: 'Submitted' },
    { id: 3, title: 'The Human Skeleton Diagram', subject: 'Basic Science', teacherId: 'T03', issuedDate: '2024-05-14', dueDate: '2024-05-22', fileUrl: '#', status: 'Pending' },
    { id: 4, title: 'Project: Build a simple HTML page', subject: 'Computer Science', teacherId: 'T05', issuedDate: '2024-05-15', dueDate: '2024-05-29', fileUrl: '#', status: 'Pending' },
    { id: 5, title: 'Coordinate Geometry', subject: 'Mathematics', teacherId: 'T01', issuedDate: '2024-05-16', dueDate: '2024-05-24', fileUrl: '#', status: 'Submitted' },
];

const classes = ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['8:00 - 9:30', '9:30 - 11:00', '11:30 - 1:00'];
const subjectsByTeacher = {
    T01: 'Mathematics', T02: 'English Language', T03: 'Basic Science', 
    T04: 'Social Studies', T05: 'Computer Science', T06: 'Civic Education', T07: 'Agricultural Science'
};

const generateFullTimetable = (): TimetableEntry[] => {
    const timetable: TimetableEntry[] = [];
    const teacherIds = Object.keys(subjectsByTeacher);
    let teacherIndex = 0;

    classes.forEach(c => {
        days.forEach(day => {
            timeSlots.forEach(time => {
                const teacherId = teacherIds[teacherIndex % teacherIds.length];
                timetable.push({
                    day,
                    time,
                    subject: subjectsByTeacher[teacherId as keyof typeof subjectsByTeacher],
                    teacherId,
                    class: c,
                });
                teacherIndex++;
            });
        });
    });
    return timetable;
}

export const allTimetableData: TimetableEntry[] = generateFullTimetable();

export const allActivities: Activity[] = [
  { id: 1, user: 'Mrs. Eze', avatar: 'https://picsum.photos/id/1027/200/200', action: 'graded assignment for', target: 'Algebra Worksheet I', time: '2 mins ago' },
  { id: 2, user: 'Admin User', avatar: 'https://picsum.photos/id/237/200/200', action: 'added a new student', target: 'Chioma Nwosu to JSS 3B', time: '1 hour ago' },
  { id: 3, user: 'Mr. Okoro', avatar: 'https://picsum.photos/id/1011/200/200', action: 'uploaded new material for', target: 'The Human Skeleton', time: '3 hours ago' },
  { id: 4, user: 'Accountant User', avatar: 'https://picsum.photos/id/1011/200/200', action: 'recorded payment for', target: 'Ngozi Eze', time: '5 hours ago' },
  { id: 5, user: 'Admin User', avatar: 'https://picsum.photos/id/237/200/200', action: 'updated attendance for', target: 'JSS 2A', time: 'yesterday' },
];

export const allAnnouncements: Announcement[] = [
  { id: 1, title: 'Parent-Teacher Meeting', content: 'Scheduled for next Friday. Please check the portal for timings.', author: 'Principal', date: '2 days ago' },
  { id: 2, title: 'Annual Sports Day', content: 'Registrations for the annual sports day are now open for all grades.', author: 'Sports Dept.', date: '4 days ago' },
  { id: 3, title: 'Mid-term Exam Schedule', content: 'The schedule for the upcoming mid-term exams has been published.', author: 'Exam Dept.', date: '1 week ago' },
];

export const LOGGED_IN_STUDENT_ID = 'JSS/23/001';
export const LOGGED_IN_TEACHER_ID = 'T01';