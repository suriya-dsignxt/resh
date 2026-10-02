import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, KeyRound } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username.toLowerCase().trim() === 'dushebunnn' && password.toLowerCase().trim() === 'yadhuviii') {
            localStorage.setItem('isAuthenticated', 'true');
            onLoginSuccess();
        } else {
            setError('INVALID CREDENTIALS! TRY AGAIN.');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-[#e0def4] font-pixel overflow-hidden relative crt selection:bg-[#eb6f92] selection:text-[#191724] flex items-center justify-center p-4">
            {/* CRT Effects */}
            <div className="scanlines"></div>

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.3),rgba(15,23,42,0))]" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(235,111,146,0.15),transparent_40%)]" />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">🗝️</div>
                    <h1 className="text-3xl text-[#eb6f92] mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        ACCESS REQUIRED
                    </h1>
                    <p className="text-xs text-[#908caa]">ENTER YOUR CREDENTIALS TO CONTINUE</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-[#191724] border-4 border-[#eb6f92] p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                    {/* Username Field */}
                    <div className="mb-6">
                        <label className="block text-[#eb6f92] text-sm mb-2 flex items-center gap-2">
                            <User size={16} />
                            USERNAME
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#26233a] border-2 border-[#908caa] px-4 py-3 text-[#e0def4] focus:border-[#eb6f92] focus:outline-none"
                            placeholder="Enter username..."
                            required
                        />
                        <div className="mt-2 text-[10px] text-[#908caa] italic leading-relaxed">
                            💡 Hint: How do I call you?
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-[#eb6f92] text-sm mb-2 flex items-center gap-2">
                            <Lock size={16} />
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#26233a] border-2 border-[#908caa] px-4 py-3 text-[#e0def4] focus:border-[#eb6f92] focus:outline-none"
                            placeholder="Enter password..."
                            required
                        />
                        <div className="mt-2 text-[10px] text-[#908caa] italic leading-relaxed">
                            💡 Hint: How do you call me?
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-4 bg-red-900 border-2 border-red-500 text-white px-4 py-2 text-xs text-center"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#eb6f92] text-[#191724] px-6 py-4 border-b-4 border-[#9f1239] active:border-b-0 active:translate-y-1 font-bold text-sm hover:bg-[#f472b6] transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <KeyRound size={16} />
                            ENTER ADVENTURE
                        </span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <div className="inline-block bg-[#26233a] border-2 border-[#6e6a86] px-4 py-2 text-[10px] text-[#908caa]">
                        SYSTEM STATUS: <span className="text-green-400 animate-pulse">● ONLINE</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
