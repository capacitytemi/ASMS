import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import Modal from './Modal';
import { Role } from '../App';
import type { Quiz, QuizQuestion, QuizAttempt, Student } from '../types';
import { PlusIcon, TrashIcon, CheckCircleIcon, PencilIcon } from '../constants';
import { allQuizzes, allQuizAttempts, allStudents, LOGGED_IN_TEACHER_ID, LOGGED_IN_STUDENT_ID } from './data';

type Theme = 'light' | 'dark';
interface QuizProps {
    theme: Theme;
    toggleTheme: () => void;
    activeRole: Role;
    onMenuClick: () => void;
    onLogout: () => void;
}

const emptyQuestion: QuizQuestion = { id: '', question: '', options: ['', '', '', ''], correctAnswer: '' };

const Quiz: React.FC<QuizProps> = ({ theme, toggleTheme, activeRole, onMenuClick, onLogout }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>(allQuizzes);
    const [attempts, setAttempts] = useState<QuizAttempt[]>(allQuizAttempts);

    // Common state
    const [view, setView] = useState<'list' | 'take' | 'results'>('list');
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    // Student specific state
    const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
    const [finalAttempt, setFinalAttempt] = useState<QuizAttempt | null>(null);

    // Teacher/Admin specific state
    const [isQuizModalOpen, setQuizModalOpen] = useState(false);
    const [isResultsModalOpen, setResultsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    
    const loggedInStudent = useMemo(() => allStudents.find(s => s.id === LOGGED_IN_STUDENT_ID), []);
    const isManager = activeRole === 'Teacher' || activeRole === 'Admin';

    // --- MANAGER LOGIC (TEACHER/ADMIN) ---
    const handleOpenQuizModal = (quiz: Quiz | null) => {
        if (quiz) { // Editing existing quiz
            setEditingQuiz(JSON.parse(JSON.stringify(quiz))); // Deep copy to avoid direct state mutation
        } else { // Creating a new quiz
            setEditingQuiz({
                id: `QZ${Date.now()}`,
                title: '',
                subject: 'Mathematics',
                class: 'JSS 1A',
                teacherId: LOGGED_IN_TEACHER_ID,
                questions: [{...emptyQuestion, id: `Q${Date.now()}`}]
            });
        }
        setQuizModalOpen(true);
    };

    const handleEditingQuizChange = (field: keyof Quiz, value: any) => {
        if (editingQuiz) setEditingQuiz({ ...editingQuiz, [field]: value });
    };

    const handleQuestionChange = (qIndex: number, field: keyof QuizQuestion, value: any) => {
        if (!editingQuiz) return;
        const updatedQuestions = [...editingQuiz.questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
        handleEditingQuizChange('questions', updatedQuestions);
    };

    const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
        if (!editingQuiz) return;
        const updatedQuestions = [...editingQuiz.questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        handleEditingQuizChange('questions', updatedQuestions);
    };
    
    const addQuestion = () => {
        if (editingQuiz) {
            const newQ = {...emptyQuestion, id: `Q${Date.now()}`};
            handleEditingQuizChange('questions', [...editingQuiz.questions, newQ]);
        }
    };

    const removeQuestion = (qIndex: number) => {
        if (editingQuiz && editingQuiz.questions.length > 1) {
            const updatedQuestions = editingQuiz.questions.filter((_, i) => i !== qIndex);
            handleEditingQuizChange('questions', updatedQuestions);
        }
    };

    const handleSaveQuiz = () => {
        if (!editingQuiz) return;
        
        const existing = quizzes.find(q => q.id === editingQuiz.id);
        if (existing) { // Update existing quiz
            setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? editingQuiz : q));
        } else { // Add new quiz
            setQuizzes([...quizzes, editingQuiz]);
        }
        setQuizModalOpen(false);
        setEditingQuiz(null);
    };
    
    const handleDeleteQuiz = (quizId: string) => {
        if(window.confirm("Are you sure you want to delete this quiz? This cannot be undone.")){
            setQuizzes(quizzes.filter(q => q.id !== quizId));
        }
    }

    const handleViewResults = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setResultsModalOpen(true);
    };
    
    // --- STUDENT LOGIC ---
    const startQuiz = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setShuffledQuestions([...quiz.questions].sort(() => Math.random() - 0.5));
        setCurrentQuestionIndex(0);
        setStudentAnswers({});
        setFinalAttempt(null);
        setView('take');
    };

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setStudentAnswers(prev => ({...prev, [questionId]: answer}));
    };

    const handleSubmitQuiz = () => {
        if (!selectedQuiz || !loggedInStudent) return;
        
        let score = 0;
        const answers = selectedQuiz.questions.map(q => {
            const selectedAnswer = studentAnswers[q.id];
            if (selectedAnswer === q.correctAnswer) {
                score++;
            }
            return { questionId: q.id, selectedAnswer };
        });

        const newAttempt: QuizAttempt = {
            id: `ATT${Date.now()}`,
            quizId: selectedQuiz.id,
            studentId: loggedInStudent.id,
            answers,
            score,
            date: new Date().toISOString().split('T')[0]
        };

        setAttempts(prev => [...prev, newAttempt]);
        setFinalAttempt(newAttempt);
        setView('results');
    };

    const reviewQuiz = (quiz: Quiz) => {
        const attempt = attempts.find(a => a.quizId === quiz.id && a.studentId === loggedInStudent?.id);
        if (attempt) {
            setSelectedQuiz(quiz);
            setFinalAttempt(attempt);
            setView('results');
        }
    };

    const manageableQuizzes = useMemo(() => {
        if (activeRole === 'Admin') return quizzes;
        if (activeRole === 'Teacher') return quizzes.filter(q => q.teacherId === LOGGED_IN_TEACHER_ID);
        return [];
    }, [quizzes, activeRole]);
    const studentQuizzes = useMemo(() => quizzes.filter(q => q.class === loggedInStudent?.class), [quizzes, loggedInStudent]);

    const renderManagerView = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quiz Management</h2>
                <button onClick={() => handleOpenQuizModal(null)} className="flex items-center px-4 py-2 space-x-2 text-sm text-white rounded-lg bg-primary hover:bg-primary-dark">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Create Quiz</span>
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {manageableQuizzes.map(quiz => (
                    <div key={quiz.id} className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold">{quiz.title}</h3>
                            <p className="text-sm text-text-secondary">{quiz.subject} - {quiz.class}</p>
                            <p className="mt-2 text-sm">{quiz.questions.length} questions</p>
                        </div>
                        <div className="flex mt-4 space-x-2">
                             <button onClick={() => handleViewResults(quiz)} className="w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-150 rounded-lg bg-secondary hover:bg-green-600">
                                View Results
                            </button>
                            <button onClick={() => handleOpenQuizModal(quiz)} className="p-2 text-blue-600 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600">
                                <PencilIcon className="w-5 h-5"/>
                            </button>
                             <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const renderStudentListView = () => (
        <>
            <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {studentQuizzes.map(quiz => {
                    const attempt = attempts.find(a => a.quizId === quiz.id && a.studentId === loggedInStudent?.id);
                    return (
                        <div key={quiz.id} className="p-5 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold">{quiz.title}</h3>
                            <p className="text-sm text-text-secondary">{quiz.subject}</p>
                            <p className="mt-2 text-sm">{quiz.questions.length} questions</p>
                            {attempt ? (
                                <>
                                    <p className="mt-4 font-semibold text-primary">Score: {attempt.score}/{quiz.questions.length}</p>
                                    <button onClick={() => reviewQuiz(quiz)} className="w-full px-4 py-2 mt-2 text-sm font-medium text-white rounded-lg bg-secondary hover:bg-green-600">
                                        Review Answers
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => startQuiz(quiz)} className="w-full px-4 py-2 mt-4 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">
                                    Start Quiz
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );

    const renderStudentQuizView = () => {
        if (!selectedQuiz) return null;
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        return (
            <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
                        <span className="font-semibold text-primary">{currentQuestionIndex + 1} / {shuffledQuestions.length}</span>
                    </div>
                    <div className="py-6">
                        <p className="text-lg font-semibold">{currentQuestion.question}</p>
                        <div className="mt-4 space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <label key={index} className={`flex items-center p-3 border rounded-lg cursor-pointer ${studentAnswers[currentQuestion.id] === option ? 'bg-primary-light border-primary dark:bg-blue-900/50' : 'dark:border-gray-600'}`}>
                                    <input type="radio" name={currentQuestion.id} value={option} checked={studentAnswers[currentQuestion.id] === option} onChange={() => handleAnswerSelect(currentQuestion.id, option)} className="w-5 h-5 text-primary form-radio focus:ring-primary"/>
                                    <span className="ml-3">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between pt-4 border-t dark:border-gray-700">
                        <button onClick={() => setCurrentQuestionIndex(p => p - 1)} disabled={currentQuestionIndex === 0} className="px-6 py-2 text-sm font-medium rounded-lg disabled:opacity-50 bg-gray-200 dark:bg-gray-600">Previous</button>
                        {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                             <button onClick={() => setCurrentQuestionIndex(p => p + 1)} className="px-6 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">Next</button>
                        ) : (
                            <button onClick={handleSubmitQuiz} className="px-6 py-2 text-sm font-medium text-white rounded-lg bg-secondary hover:bg-green-600">Submit Quiz</button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderStudentResultsView = () => {
        if (!selectedQuiz || !finalAttempt) return null;
        const total = selectedQuiz.questions.length;
        const score = finalAttempt.score;
        return (
            <div className="max-w-3xl mx-auto">
                 <div className="p-6 bg-card dark:bg-gray-800 rounded-xl shadow-sm text-center">
                    <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500"/>
                    <h2 className="mt-4 text-3xl font-bold">Quiz Complete!</h2>
                    <p className="mt-2 text-xl">You scored</p>
                    <p className="my-2 text-5xl font-bold text-primary">{score} / {total}</p>
                 </div>
                 <div className="p-6 mt-6 bg-card dark:bg-gray-800 rounded-xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
                    <div className="space-y-4">
                        {selectedQuiz.questions.map(q => {
                            const attempt = finalAttempt.answers.find(a => a.questionId === q.id);
                            const isCorrect = attempt?.selectedAnswer === q.correctAnswer;
                            return (
                                <div key={q.id} className={`p-4 border rounded-lg ${isCorrect ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700' : 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'}`}>
                                    <p className="font-semibold">{q.question}</p>
                                    <p className={`mt-2 text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>Your answer: {attempt?.selectedAnswer || 'Not answered'}</p>
                                    {!isCorrect && <p className="mt-1 text-sm font-semibold text-green-700 dark:text-green-300">Correct answer: {q.correctAnswer}</p>}
                                </div>
                            );
                        })}
                    </div>
                 </div>
                 <button onClick={() => setView('list')} className="w-full px-4 py-3 mt-6 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">Back to Quizzes</button>
            </div>
        );
    };

    const renderStudentView = () => {
        if (view === 'take') return renderStudentQuizView();
        if (view === 'results') return renderStudentResultsView();
        return renderStudentListView();
    };

    return (
        <>
            <Header title="Interactive Quiz" theme={theme} toggleTheme={toggleTheme} activeRole={activeRole} onMenuClick={onMenuClick} onLogout={onLogout} />
            {isManager ? renderManagerView() : renderStudentView()}

            {/* Manager Modals */}
            <Modal isOpen={isQuizModalOpen} onClose={() => setQuizModalOpen(false)} title={editingQuiz?.id.startsWith('QZ') && quizzes.some(q => q.id === editingQuiz.id) ? 'Edit Quiz' : 'Create New Quiz'}>
                {editingQuiz && <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <input type="text" placeholder="Quiz Title" value={editingQuiz.title} onChange={e => handleEditingQuizChange('title', e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-gray-700"/>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Subject" value={editingQuiz.subject} onChange={e => handleEditingQuizChange('subject', e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-gray-700"/>
                        <input type="text" placeholder="Class" value={editingQuiz.class} onChange={e => handleEditingQuizChange('class', e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-gray-700"/>
                    </div>
                    {editingQuiz.questions.map((q, qIndex) => (
                        <div key={q.id || qIndex} className="p-4 space-y-2 border rounded-lg dark:border-gray-600">
                            <div className="flex justify-between items-center">
                                <label className="font-semibold">Question {qIndex + 1}</label>
                                <button onClick={() => removeQuestion(qIndex)}><TrashIcon className="w-5 h-5 text-red-500"/></button>
                            </div>
                            <textarea placeholder="Question text" value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-gray-700"/>
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2">
                                    <input type="radio" name={`correct_q${qIndex}`} checked={q.correctAnswer === opt} onChange={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}/>
                                    <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-gray-700"/>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={addQuestion} className="w-full py-2 text-sm text-primary border-2 border-dashed rounded-lg dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Add Question</button>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button onClick={() => setQuizModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-lg dark:bg-gray-600">Cancel</button>
                        <button onClick={handleSaveQuiz} className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary hover:bg-primary-dark">Save Quiz</button>
                    </div>
                </div>}
            </Modal>
            <Modal isOpen={isResultsModalOpen} onClose={() => setResultsModalOpen(false)} title={`Results for: ${selectedQuiz?.title}`}>
                <div className="max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2">Student Name</th>
                                <th className="px-4 py-2">Score</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.filter(a => a.quizId === selectedQuiz?.id).map(att => {
                                const student = allStudents.find(s => s.id === att.studentId);
                                return (
                                <tr key={att.id} className="border-b dark:border-gray-700">
                                    <td className="px-4 py-2 font-medium">{student?.name || 'Unknown'}</td>
                                    <td className="px-4 py-2">{att.score} / {selectedQuiz?.questions.length}</td>
                                    <td className="px-4 py-2">{att.date}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    );
};

export default Quiz;