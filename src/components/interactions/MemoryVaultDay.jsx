import React, { useState } from 'react';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Key, Sparkles, Star } from 'lucide-react';
import config from '../../config';

const TOTAL_KEYS = 7;

const MEMORY_LIST = [
    { title: "First Meetup", detail: "April 11", icon: "📅", color: "border-amber-400 text-amber-300" },
    { title: "Koil la Vaangunathu", detail: "Aarupadai Veedu (Apr 17) - Keychain", icon: "🔑", color: "border-rose-400 text-rose-300" },
    { title: "First Hotel Together", detail: "Copper Kitchen", icon: "🍽️", color: "border-orange-400 text-orange-300" },
    { title: "Parcel Takeaway", detail: "Mutton Biriyani", icon: "🍲", color: "border-yellow-400 text-yellow-300" },
    { title: "The Stolen Sip", detail: "Chocolate Milkshake", icon: "🥤", color: "border-cyan-400 text-cyan-300" },
    { title: "The Signed Ride", detail: "Signed Auto Toy from Sri Lanka", icon: "🛺", color: "border-emerald-400 text-emerald-300" },
    { title: "The Signature Signoff", detail: "“God bless.you”", icon: "✨", color: "border-purple-400 text-purple-300" },
];

const MemoryVaultDay = () => {
    const { keepsakes } = useKeepsakes();
    const [vaultOpen, setVaultOpen] = useState(false);

    const handleUnlock = () => {
        setVaultOpen(true);

        // Notify Yadhu on quest completion with the entered user paragraph
        try {
            const userMsg = localStorage.getItem('userMessage') || '(No message recorded)';
            fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    sender: 'Dushee',
                    type: 'completion',
                    timestamp: new Date().toISOString()
                })
            }).catch(e => console.warn('Completion notify warning:', e));
        } catch (err) {
            console.warn('Storage read warning:', err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl relative">
            <AnimatePresence mode="wait">
                {vaultOpen ? (
                    <motion.div
                        key="archive"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full bg-[#191724] border-4 border-[#eb6f92] p-6 md:p-8 text-center shadow-[0_0_40px_rgba(235,111,146,0.3)] relative"
                    >
                        {/* Header Badge */}
                        <div className="text-5xl mb-3 animate-bounce">🏆</div>
                        <h1 className="text-2xl md:text-3xl text-amber-300 font-pixel mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            {config.memories.vault.letterTitle}
                        </h1>
                        <p className="text-xs text-[#908caa] mb-6 tracking-widest uppercase">
                            All 7 Memories Collected & Preserved
                        </p>

                        {/* Memory Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6">
                            {MEMORY_LIST.map((mem, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 bg-[#26233a] border-2 ${mem.color} flex items-center gap-3 shadow-md`}
                                >
                                    <span className="text-3xl">{mem.icon}</span>
                                    <div>
                                        <div className="text-[10px] text-[#908caa] uppercase tracking-wider">
                                            #{idx + 1} {mem.title}
                                        </div>
                                        <div className="text-xs font-bold text-[#e0def4]">
                                            {mem.detail}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Archive Message */}
                        <div className="bg-[#26233a] border-2 border-[#eb6f92] p-5 text-left text-xs md:text-sm text-[#e0def4] leading-relaxed whitespace-pre-line font-mono shadow-inner mb-6">
                            {config.memories.vault.summary}
                        </div>

                        {/* Footer Celebration */}
                        <div className="inline-block bg-[#0f172a] border-2 border-amber-400 px-6 py-2 text-xs text-amber-300 font-bold">
                            ✨ MEMORY QUEST COMPLETE: {config.person.title.toUpperCase()} ✨
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="vault"
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-6 w-full"
                    >
                        {/* Header Box */}
                        <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                            <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                                <Trophy size={20} />
                                <h2 className="text-lg font-bold">THE MEMORY VAULT</h2>
                            </div>
                            <p className="text-xs text-[#e0def4] leading-relaxed">
                                Complete all 7 memory quests to unlock the final archive!
                            </p>
                        </div>

                        {/* Vault Visual */}
                        <div className="relative w-64 h-64 bg-[#191724] border-8 border-[#575279] rounded-xl flex flex-col items-center justify-center shadow-2xl p-4">
                            {/* Vault Icon */}
                            <div className="text-6xl text-amber-300 mb-2">
                                {keepsakes.length >= 7 ? '🔓' : '🔒'}
                            </div>

                            {/* Status Indicators */}
                            <div className="text-[10px] font-mono text-[#908caa] mb-3">
                                KEYS: {keepsakes.length} / {TOTAL_KEYS}
                            </div>

                            {/* Key Indicator Lights */}
                            <div className="flex gap-2 justify-center flex-wrap px-4">
                                {Array.from({ length: TOTAL_KEYS }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full border border-black flex items-center justify-center text-[8px]
                                            ${i < keepsakes.length
                                                ? 'bg-amber-400 text-black shadow-[0_0_8px_gold]'
                                                : 'bg-[#26233a] text-gray-500'
                                            }`}
                                    >
                                        {i < keepsakes.length ? '✓' : i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleUnlock}
                            disabled={keepsakes.length < 1}
                            className={`px-8 py-4 text-sm font-bold border-b-8 active:border-b-0 active:translate-y-2 transition-all cursor-pointer shadow-lg
                                ${keepsakes.length >= 7
                                    ? 'bg-[#eb6f92] text-[#191724] border-[#9f1239] animate-pulse hover:brightness-110'
                                    : 'bg-[#3e8fb0] text-[#191724] border-[#1f5a70] hover:brightness-110'
                                }
                            `}
                        >
                            {keepsakes.length >= 7
                                ? "OPEN MEMORY VAULT 🏆"
                                : `OPEN ARCHIVE (${keepsakes.length}/${TOTAL_KEYS} KEYS)`
                            }
                        </button>

                        {keepsakes.length < 7 && (
                            <p className="text-[10px] text-amber-300 text-center">
                                Tip: You can explore other memory quests from the main map to collect all 7 keys!
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemoryVaultDay;
