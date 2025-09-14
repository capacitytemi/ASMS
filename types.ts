export type Role = 'Admin' | 'Teacher' | 'Accountant' | 'Student' | 'Parent';

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

export interface EnrollmentData {
  month: string;
  students: number;
}

export interface AttendanceData {
  class: string;
  present: number;
  absent: number;
}

export interface Activity {
  id: number;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface SubjectScore {
  subject: string;
  test: number; // out of 40
  exam: number; // out of 60
  total: number; // out of 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: 'Excellent' | 'Very Good' | 'Good' | 'Credit' | 'Pass' | 'Fail';
}

export interface StudentReport {
  studentId: string;
  class: string;
  term: string;
  year: string;
  scores: SubjectScore[];
  termTotal: number;
  termAverage: number;
  cumulativeAverage: number;
  principalsRemark: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  receiptNumber: string;
}

export interface FeeRecord {
  id: number;
  studentId: string;
  totalFees: number;
  amountPaid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  paymentHistory: Payment[];
}

export interface Student {
  id: string;
  name: string;
  class: string;
  dob: string;
  parentName: string;
  parentPhone: string;
}

export interface Teacher {
    id: string;
    name: string;
    subject: string;
}

export interface Assignment {
    id: number;
    title: string;
    subject: string;
    teacherId: string;
    issuedDate: string;
    dueDate: string;
    fileUrl: string;
    status: 'Pending' | 'Submitted' | 'Graded';
    grade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export interface TimetableEntry {
    day: string;
    time: string;
    subject: string;
    teacherId: string;
    class: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface Quiz {
    id: string;
    title: string;
    subject: string;
    class: string;
    teacherId: string;
    questions: QuizQuestion[];
}

export interface QuizAttempt {
    id: string;
    quizId: string;
    studentId: string;
    answers: { questionId: string; selectedAnswer: string; }[];
    score: number;
    date: string;
}