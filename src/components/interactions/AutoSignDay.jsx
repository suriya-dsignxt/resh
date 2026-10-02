import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { Car, Send, HelpCircle, Sparkles } from 'lucide-react';
import config from '../../config';

const AutoSignDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();
    const [signedText, setSignedText] = useState('Dushee ✍️');
    const [isDispatched, setIsDispatched] = useState(hasKeepsake('auto_key'));
    const [scratchPercent, setScratchPercent] = useState(0);
    const [showHint, setShowHint] = useState(false);

    const handleScratch = () => {
        setScratchPercent(prev => Math.min(100, prev + 35));
    };

    const handleDispatch = () => {
        setIsDispatched(true);
        if (!hasKeepsake('auto_key')) {
            setTimeout(() => {
                addKeepsake('auto_key', 'The Signed Auto', '🛺');
            }, 800);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <span className="text-xl">🛺</span>
                    <h2 className="text-lg font-bold">STAGE 06: STREET AUTOGRAPH</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    Out of all paper and normal things, you signed your name on a moving street legend and sent it over! Scratch the street fog to reveal the ride.
                </p>
            </div>

            {/* Auto Canvas Area */}
            <div className="w-full bg-[#191724] border-4 border-[#98c379] p-6 shadow-[8px_8px_0_#98c379] overflow-hidden">
                <div className="text-[10px] text-[#98c379] uppercase tracking-widest text-center mb-4 font-mono">
                    ★ STREET AUTOGRAPH CANVAS ★
                </div>

                {/* Animated Vehicle Silhouette & Reveal */}
                <div className="w-full bg-[#0f172a] border-4 border-[#e5c07b] rounded-md p-6 flex flex-col items-center justify-center mb-5 relative min-h-[160px] overflow-hidden">
                    {/* Fog Overlay */}
                    {scratchPercent < 100 && !isDispatched && (
                        <div
                            onClick={handleScratch}
                            className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center cursor-pointer z-10 border-2 border-dashed border-amber-400/50 p-4 text-center"
                        >
                            <span className="text-2xl mb-1">🌫️</span>
                            <span className="text-xs font-bold text-amber-300">
                                TAP TO SCRATCH STREET FOG ({scratchPercent}%)
                            </span>
                            <span className="text-[9px] text-gray-400 mt-1">Tap repeatedly to uncover the mystery vehicle</span>
                        </div>
                    )}

                    {/* Revealed Auto Visual */}
                    <motion.div
                        animate={isDispatched ? { x: [0, 8, -8, 0] } : {}}
                        transition={{ repeat: isDispatched ? Infinity : 0, duration: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="text-7xl mb-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                            🛺
                        </div>

                        {/* Signature on Auto */}
                        <div className="bg-[#26233a] border-2 border-[#e5c07b] px-3 py-1 text-center text-xs font-mono text-amber-300 rounded shadow">
                            <span className="text-[10px] text-gray-400">TAGGED: </span>
                            <input
                                type="text"
                                value={signedText}
                                onChange={(e) => setSignedText(e.target.value)}
                                className="bg-transparent text-amber-300 font-bold focus:outline-none w-28 text-center"
                                placeholder="Sign here..."
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Dispatch Button */}
                {(scratchPercent >= 100 || isDispatched) && !isDispatched && (
                    <button
                        onClick={handleDispatch}
                        className="w-full py-3 bg-[#98c379] text-[#191724] font-bold text-xs border-b-4 border-green-800 active:border-b-0 active:translate-y-1 shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
                    >
                        <Send size={16} />
                        HONK & SEND SIGNED AUTO! 🛺💨
                    </button>
                )}

                {/* Clue button */}
                <div className="text-center mt-4">
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
                            💡 Hint: The iconic Chennai yellow-and-black 3-wheeler!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Victory Card */}
            {isDispatched && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-emerald-400 text-center shadow-[6px_6px_0_#059669]"
                >
                    <div className="text-3xl mb-1">🛺 ✍️ ✨</div>
                    <h3 className="text-sm font-bold text-emerald-300">KEY #6 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "Signed and sent on the Auto!"
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-emerald-400 text-[10px] text-green-400">
                        Keepsake Stored in Inventory [6/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AutoSignDay;
