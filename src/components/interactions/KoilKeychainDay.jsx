import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { Sparkles, Check, HelpCircle } from 'lucide-react';
import config from '../../config';

const POUCHES = [
    { id: 'pouch_1', label: 'Chest I', icon: '🪔', name: 'Brass Vilakku', note: 'A holy lamp, but not what we brought back!' },
    { id: 'pouch_2', label: 'Chest II', icon: '🥥', name: 'Temple Coconut', note: 'Prasadam, but not the keepsake!' },
    { id: 'pouch_3', label: 'Chest III', icon: '🔑', name: 'Engraved Keychain', note: 'YES! That special temple souvenir we got together!', isTarget: true },
    { id: 'pouch_4', label: 'Chest IV', icon: '🌸', name: 'Fresh Garland', note: 'Fragrant flowers, but not the metal souvenir!' },
    { id: 'pouch_5', label: 'Chest V', icon: '📿', name: 'Sacred Beads', note: 'Holy beads, but not the everyday companion!' },
];

const KoilKeychainDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();
    const [openedChest, setOpenedChest] = useState(null);
    const [isWon, setIsWon] = useState(hasKeepsake('keychain_key'));
    const [showHint, setShowHint] = useState(false);

    const handleOpenChest = (pouch) => {
        setOpenedChest(pouch);
        if (pouch.isTarget) {
            setIsWon(true);
            if (!hasKeepsake('keychain_key')) {
                setTimeout(() => {
                    addKeepsake('keychain_key', 'Temple Keychain', '🔑');
                }, 800);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header info */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <span className="text-xl">🛕</span>
                    <h2 className="text-lg font-bold">STAGE 02: SACRED SANCTUM</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    We stepped out of the temple with a small keepsake in hand. Inspect the sanctum chests to find what we bought together!
                </p>
            </div>

            {/* Mystery Chests Grid */}
            <div className="w-full bg-[#191724] border-4 border-[#eb6f92] p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                <div className="text-[10px] text-amber-300 uppercase tracking-widest text-center mb-4 font-mono">
                    ◆ TEMPLE BAZAAR TREASURE VAULT ◆
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
                    {POUCHES.map((pouch) => {
                        const isOpen = openedChest?.id === pouch.id;
                        const isCorrect = pouch.isTarget && isWon;

                        return (
                            <motion.button
                                key={pouch.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOpenChest(pouch)}
                                className={`p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative min-h-[90px]
                                    ${isCorrect
                                        ? 'bg-amber-950 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                                        : isOpen
                                            ? 'bg-[#26233a] border-cyan-400'
                                            : 'bg-[#26233a] border-[#908caa] hover:border-[#eb6f92]'
                                    }
                                `}
                            >
                                <span className="text-3xl">
                                    {isOpen || (isWon && pouch.isTarget) ? pouch.icon : '🎁'}
                                </span>
                                <span className="text-[10px] font-bold text-[#e0def4] text-center">
                                    {isOpen || (isWon && pouch.isTarget) ? pouch.name : pouch.label}
                                </span>
                                {isCorrect && (
                                    <div className="absolute top-1 right-1 bg-amber-400 text-black rounded-full p-0.5">
                                        <Check size={12} />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Inspect feedback */}
                <AnimatePresence mode="wait">
                    {openedChest && (
                        <motion.div
                            key={openedChest.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mt-4 p-3 text-xs text-center border-2 ${openedChest.isTarget ? 'bg-green-950 border-green-500 text-green-300 font-bold' : 'bg-[#26233a] border-[#6e6a86] text-[#e0def4]'}`}
                        >
                            <span className="text-lg mr-2">{openedChest.icon}</span>
                            <span>{openedChest.note}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Hint */}
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
                            💡 Hint: Koil la vaangunathu... Something that stays on a key ring every day!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Victory Card */}
            {isWon && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-rose-400 text-center shadow-[6px_6px_0_#e11d48]"
                >
                    <div className="text-3xl mb-1">🔑 🛕 ✨</div>
                    <h3 className="text-sm font-bold text-rose-300">KEY #2 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "The special temple keychain locked into memory!"
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-rose-400 text-[10px] text-green-400">
                        Keepsake Stored in Inventory [2/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default KoilKeychainDay;
