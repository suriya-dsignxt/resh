import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { Radio, Sparkles, Check, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import config from '../../config';

const TARGET_FREQ = 104.11; // 04/11 - April 11 special connection frequency

const GodBlessDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();
    const [freq, setFreq] = useState(88.00);
    const [typedPhrase, setTypedPhrase] = useState('');
    const [isWon, setIsWon] = useState(hasKeepsake('godbless_key'));
    const [showHint, setShowHint] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    const isTuned = Math.abs(freq - TARGET_FREQ) <= 0.15;

    const handleFineTune = (delta) => {
        setFreq(prev => {
            const next = parseFloat((prev + delta).toFixed(2));
            return Math.max(88.00, Math.min(108.00, next));
        });
    };

    const handleVerifyPhrase = () => {
        const clean = typedPhrase.trim().toLowerCase().replace(/[^a-z]/g, '');
        if (clean === 'godbless') {
            setIsWon(true);
            setStatusMsg('SIGNAL DECODED: 100% CLARITY!');
            if (!hasKeepsake('godbless_key')) {
                setTimeout(() => {
                    addKeepsake('godbless_key', 'God Bless Signoff', '✨');
                }, 800);
            }
        } else {
            setStatusMsg('PHRASE MISMATCH! Think of what you always say before hanging up.');
            setTimeout(() => setStatusMsg(''), 2500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <span className="text-xl">📻</span>
                    <h2 className="text-lg font-bold">STAGE 07: FINAL TRANSMISSION</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    Tune the receiver to our special anniversary connection rate (04/11 → 104.11 FM) to decode our signature parting words!
                </p>
            </div>

            {/* Radio Receiver Station */}
            <div className="w-full bg-[#191724] border-4 border-[#c678dd] p-5 sm:p-6 shadow-[8px_8px_0_#c678dd]">
                <div className="text-[10px] text-[#c678dd] uppercase tracking-widest text-center mb-4 font-mono">
                    📡 RESHMI & SURIYA FREQUENCY RECEIVER 📡
                </div>

                {/* Oscilloscope Frequency Display */}
                <div className="bg-[#0f172a] border-4 border-[#56526e] p-4 rounded-md mb-5 text-center shadow-inner">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2 font-mono">
                        <span>SIGNAL STATUS</span>
                        <span className={isTuned ? "text-green-400 animate-pulse font-bold" : "text-amber-400"}>
                            {isTuned ? "● LOCKED ON 104.11 FM (04/11 FREQ)" : "▲ SCANNING FREQUENCIES..."}
                        </span>
                    </div>

                    <div className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-wider mb-2 drop-shadow">
                        {freq.toFixed(2)} <span className="text-sm text-gray-400">MHz</span>
                    </div>

                    {/* Animated Audio Wave */}
                    <div className="flex justify-center items-center gap-1 h-12 bg-[#191724] border border-[#26233a] rounded p-2 overflow-hidden">
                        {Array.from({ length: 18 }).map((_, i) => {
                            const height = isTuned ? Math.sin(i * 0.7) * 16 + 22 : Math.random() * 8 + 4;
                            return (
                                <motion.div
                                    key={i}
                                    animate={{ height: `${height}px` }}
                                    transition={{ duration: 0.15 }}
                                    className={`w-1.5 sm:w-2 rounded-full transition-colors ${isTuned ? 'bg-gradient-to-t from-purple-500 to-amber-300 shadow-[0_0_6px_#c678dd]' : 'bg-gray-700'}`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Tuner Slider & Fine-Tuning */}
                <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-[10px] text-[#908caa] font-mono">
                        <span>TUNE TO 04/11 DATE RATE:</span>
                        <span className="text-amber-300 font-bold">~104.11 FM</span>
                    </div>

                    <input
                        type="range"
                        min="88.00"
                        max="108.00"
                        step="0.05"
                        value={freq}
                        onChange={(e) => setFreq(parseFloat(e.target.value))}
                        className="w-full accent-purple-400 cursor-pointer h-2 bg-[#26233a] rounded"
                    />

                    {/* Fine Tuning Buttons */}
                    <div className="flex justify-between items-center gap-2 pt-1">
                        <button
                            onClick={() => handleFineTune(-0.10)}
                            className="px-3 py-1.5 bg-[#26233a] border border-[#6e6a86] text-xs text-[#e0def4] hover:border-purple-400 active:translate-y-1 flex items-center gap-1 cursor-pointer"
                        >
                            <ChevronLeft size={14} /> -0.10
                        </button>
                        <span className="text-[10px] text-gray-500 font-mono">FINE TUNER</span>
                        <button
                            onClick={() => handleFineTune(0.10)}
                            className="px-3 py-1.5 bg-[#26233a] border border-[#6e6a86] text-xs text-[#e0def4] hover:border-purple-400 active:translate-y-1 flex items-center gap-1 cursor-pointer"
                        >
                            +0.10 <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Word Decryption Input */}
                {isTuned && !isWon && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 pt-2 border-t border-[#26233a]"
                    >
                        <div className="text-xs text-green-400 font-bold text-center font-mono">
                            ✓ 104.11 FM Locked! Enter the 2 closing words:
                        </div>
                        <input
                            type="text"
                            value={typedPhrase}
                            onChange={(e) => setTypedPhrase(e.target.value)}
                            placeholder="Type the 2 words..."
                            className="w-full bg-[#26233a] border-2 border-purple-400 px-4 py-3 text-center text-sm font-mono text-white focus:outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleVerifyPhrase();
                            }}
                        />
                        <button
                            onClick={handleVerifyPhrase}
                            className="w-full py-3 bg-[#c678dd] text-[#191724] font-bold text-xs border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 shadow cursor-pointer hover:brightness-110"
                        >
                            DECODE TRANSMISSION
                        </button>
                    </motion.div>
                )}

                {/* Status Message */}
                {statusMsg && (
                    <div className="mt-3 text-xs text-center text-amber-300 font-bold font-mono">
                        {statusMsg}
                    </div>
                )}

                {/* Clue button */}
                <div className="text-center mt-4 pt-2 border-t border-[#26233a]">
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
                            className="text-[10px] text-amber-300 italic bg-[#26233a] p-2 border border-amber-400/40 rounded text-center"
                        >
                            💡 Hint: 04/11 (April 11) is the frequency! And the phrase is what you always say before hanging up: "G__ B____"
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Victory Card */}
            {isWon && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-purple-400 text-center shadow-[6px_6px_0_#9333ea]"
                >
                    <div className="text-3xl mb-1">✨ 🙏 🌟</div>
                    <h3 className="text-sm font-bold text-purple-300">KEY #7 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "'God Bless' — The words that end every conversation with peace and warmth."
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-purple-400 text-[10px] text-green-400">
                        All 7 Keepsakes Collected! Vault Ready! [7/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default GodBlessDay;
