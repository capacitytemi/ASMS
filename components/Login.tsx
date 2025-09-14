import React, { useState } from 'react';
import { Role } from '../App';

interface LoginProps {
    onLogin: (role: Role) => void;
}

const credentials: Record<Role, { user: string; pass: string }> = {
    Admin: { user: 'admin', pass: 'admin123' },
    Teacher: { user: 'teacher', pass: 'teacher123' },
    Accountant: { user: 'accountant', pass: 'accountant123' },
    Student: { user: 'student', pass: 'student123' },
    Parent: { user: 'parent', pass: 'parent123' },
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<Role>('Admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const expectedCreds = credentials[selectedRole];
        if (username === expectedCreds.user && password === expectedCreds.pass) {
            setError('');
            onLogin(selectedRole);
        } else {
            setError('Invalid username or password for the selected role.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-card dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                         <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">ASMS Portal</h1>
                    <p className="mt-2 text-text-secondary dark:text-gray-400">Sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-text-secondary dark:text-gray-400">
                            I am a...
                        </label>
                        <select
                            id="role"
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value as Role);
                                setUsername('');
                                setPassword('');
                                setError('');
                            }}
                            className="w-full p-3 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                        >
                            {(Object.keys(credentials) as Role[]).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="username" className="block text-sm font-medium text-text-secondary dark:text-gray-400">
                           Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-text-secondary dark:text-gray-400">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 mt-1 border rounded-md bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-center text-danger">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;