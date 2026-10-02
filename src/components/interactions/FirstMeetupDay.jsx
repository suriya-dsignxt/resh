import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { ChevronUp, ChevronDown, Lock, Unlock, HelpCircle } from 'lucide-react';
import config from '../../config';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const FirstMeetupDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();
    const [monthIndex, setMonthIndex] = useState(0); // starts JAN
    const [day, setDay] = useState(1);
    const [isUnlocked, setIsUnlocked] = useState(hasKeepsake('meetup_key'));
    const [statusMsg, setStatusMsg] = useState('');
    const [showHint, setShowHint] = useState(false);

    const handleMonthChange = (delta) => {
        setMonthIndex(prev => (prev + delta + 12) % 12);
        setStatusMsg('');
    };

    const handleDayChange = (delta) => {
        setDay(prev => {
            let next = prev + delta;
            if (next < 1) next = 31;
            if (next > 31) next = 1;
            return next;
        });
        setStatusMsg('');
    };

    const handleLockIn = () => {
        const selectedMonth = MONTHS[monthIndex];
        if (selectedMonth === 'APR' && day === 11) {
            setIsUnlocked(true);
            setStatusMsg('ACCESS GRANTED! Memory Safe Unlocked.');
            if (!hasKeepsake('meetup_key')) {
                setTimeout(() => {
                    addKeepsake('meetup_key', 'The First Meetup', '⏳');
                }, 800);
            }
        } else {
            setStatusMsg('CODE INCORRECT! Safe remains locked.');
            setTimeout(() => setStatusMsg(''), 2500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header info box */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <span className="text-xl">⏳</span>
                    <h2 className="text-lg font-bold">STAGE 01: THE FIRST SPARK</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    Before everything began, our story started on one memorable day. Dial the Chrono-Safe to the exact date!
                </p>
            </div>

            {/* Time Machine Dial Box */}
            <div className="relative w-full bg-[#191724] border-4 border-[#3e8fb0] p-6 shadow-[8px_8px_0_#3e8fb0]">
                <div className="text-[10px] text-[#3e8fb0] tracking-widest text-center mb-4 uppercase font-mono">
                    ◆ CHRONO-VAULT LOCK V1.0 ◆
                </div>

                <div className="flex justify-center items-center gap-6 my-4">
                    {/* Month Dial */}
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => handleMonthChange(1)}
                            className="p-2 bg-[#26233a] border-2 border-[#3e8fb0] hover:bg-[#3e8fb0] hover:text-[#191724] active:translate-y-1 text-xs cursor-pointer"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <div className="w-24 h-20 bg-[#0f172a] border-4 border-[#3e8fb0] flex flex-col items-center justify-center my-2 shadow-inner">
                            <span className="text-[9px] text-[#908caa]">MONTH</span>
                            <span className="text-2xl font-bold text-amber-300 font-mono tracking-wider">
                                {MONTHS[monthIndex]}
                            </span>
                        </div>
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="p-2 bg-[#26233a] border-2 border-[#3e8fb0] hover:bg-[#3e8fb0] hover:text-[#191724] active:translate-y-1 text-xs cursor-pointer"
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    <div className="text-3xl font-bold text-[#eb6f92] animate-pulse">:</div>

                    {/* Day Dial */}
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => handleDayChange(1)}
                            className="p-2 bg-[#26233a] border-2 border-[#3e8fb0] hover:bg-[#3e8fb0] hover:text-[#191724] active:translate-y-1 text-xs cursor-pointer"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <div className="w-24 h-20 bg-[#0f172a] border-4 border-[#3e8fb0] flex flex-col items-center justify-center my-2 shadow-inner">
                            <span className="text-[9px] text-[#908caa]">DAY</span>
                            <span className="text-2xl font-bold text-amber-300 font-mono tracking-wider">
                                {day < 10 ? `0${day}` : day}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDayChange(-1)}
                            className="p-2 bg-[#26233a] border-2 border-[#3e8fb0] hover:bg-[#3e8fb0] hover:text-[#191724] active:translate-y-1 text-xs cursor-pointer"
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Optional Hint Toggle */}
                <div className="text-center mt-2">
                    {!showHint ? (
                        <button
                            onClick={() => setShowHint(true)}
                            className="text-[10px] text-[#908caa] hover:text-amber-300 flex items-center justify-center gap-1 mx-auto underline cursor-pointer"
                        >
                            <HelpCircle size={12} /> Need a subtle clue?
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] text-amber-300 italic bg-[#26233a] p-2 border border-amber-400/40 rounded"
                        >
                            💡 Hint: The sweet April spring breeze when we first met...
                        </motion.div>
                    )}
                </div>

                {/* Status Alert */}
                {statusMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-2 text-center text-xs border-2 ${isUnlocked ? 'bg-green-950 border-green-500 text-green-300' : 'bg-red-950 border-red-500 text-red-300'}`}
                    >
                        {statusMsg}
                    </motion.div>
                )}

                {/* Submit Action */}
                <div className="mt-5">
                    <button
                        onClick={handleLockIn}
                        className="w-full py-3 bg-[#3e8fb0] text-[#191724] font-bold text-xs border-b-4 border-[#1f5a70] active:border-b-0 active:translate-y-1 hover:brightness-110 shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
                        CRACK CHRONO-SAFE
                    </button>
                </div>
            </div>

            {/* Success Reward Banner */}
            {isUnlocked && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-amber-400 text-center shadow-[6px_6px_0_#d97706]"
                >
                    <div className="text-3xl mb-1">📅 ✨</div>
                    <h3 className="text-sm font-bold text-amber-300">KEY #1 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "April 11 — The day our story began!"
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-amber-400 text-[10px] text-green-400">
                        Keepsake Stored in Inventory [1/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FirstMeetupDay;
