import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, BookOpen } from 'lucide-react';
import config from '../config';
import { playBgMusic } from '../utils/audioManager';

const MessageSubmission = ({ onSubmitSuccess }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    const MIN_CHARACTERS = 200;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Start background music immediately from user click gesture
        playBgMusic();

        if (message.trim().length < MIN_CHARACTERS) {
            setError(`Please write at least ${MIN_CHARACTERS} characters!`);
            setTimeout(() => setError(''), 3000);
            return;
        }

        setIsSending(true);

        // Save message to localStorage
        localStorage.setItem('userMessage', message.trim());
        localStorage.setItem('messageSubmitted', 'true');
        localStorage.setItem('messageTimestamp', new Date().toISOString());

        // Send email to Yadhu
        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message.trim(),
                    sender: 'Reshmi',
                    type: 'submission',
                    timestamp: new Date().toISOString()
                })
            });
        } catch (err) {
            console.warn('Email dispatch warning (stored locally):', err);
        }

        setIsSending(false);
        onSubmitSuccess();
    };

    const charCount = message.trim().length;
    const isValid = charCount >= MIN_CHARACTERS && !isSending;

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
                className="relative z-10 w-full max-w-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-bounce">📜</div>
                    <h1 className="text-2xl md:text-3xl text-[#eb6f92] mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] leading-relaxed">
                        ADVENTURE GUESTBOOK
                    </h1>
                    <p className="text-sm text-[#e0def4] leading-relaxed max-w-lg mx-auto">
                        Leave a note for the memory archive before embarking on the quest!
                    </p>
                </div>

                {/* Message Form */}
                <form onSubmit={handleSubmit} className="bg-[#191724] border-4 border-[#eb6f92] p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                    {/* Question Prompt */}
                    <div className="mb-6 bg-[#26233a] border-2 border-[#eb6f92] p-4">
                        <p className="text-[#eb6f92] text-sm md:text-base leading-relaxed text-center font-medium">
                            A quick Message For us , regarding whatever you think or you holding on to say to me for a long time and what am i to you ?
                        </p>
                    </div>

                    {/* Textarea */}
                    <div className="mb-4">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-[#26233a] border-2 border-[#908caa] px-4 py-3 text-[#e0def4] focus:border-[#eb6f92] focus:outline-none min-h-[180px] resize-none leading-relaxed font-sans"
                            placeholder="Type your message here... ✨"
                            required
                        />

                        {/* Character Counter */}
                        <div className="mt-2 flex justify-between items-center text-xs">
                            <span className={`${isValid ? 'text-green-400' : 'text-amber-400'}`}>
                                {isValid
                                    ? '✓ Ready to submit'
                                    : `✍️ Need ${MIN_CHARACTERS - charCount} more character${(MIN_CHARACTERS - charCount) === 1 ? '' : 's'}`
                                }
                            </span>
                            <span className="text-[#908caa]">
                                {charCount} / {MIN_CHARACTERS} characters
                            </span>
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
                        disabled={!isValid}
                        className={`w-full px-6 py-4 border-b-4 font-bold text-sm transition-all shadow-[4px_4px_0_rgba(0,0,0,0.3)]
                            ${isValid
                                ? 'bg-[#eb6f92] text-[#191724] border-[#9f1239] hover:bg-[#f472b6] active:border-b-0 active:translate-y-1 cursor-pointer'
                                : 'bg-gray-600 text-gray-400 border-gray-800 cursor-not-allowed opacity-50'
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Send size={16} className={isSending ? 'animate-spin' : ''} />
                            {isSending
                                ? 'TRANSMITTING NOTE... ✨'
                                : isValid
                                    ? 'ENTER MEMORY QUEST'
                                    : `WRITE A NOTE TO CONTINUE (${charCount}/${MIN_CHARACTERS})`
                            }
                        </span>
                    </button>
                </form>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <div className="inline-block bg-[#26233a] border-2 border-[#6e6a86] px-4 py-2 text-[10px] text-[#908caa]">
                        ✨ Memory saved to your local adventure log
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MessageSubmission;
