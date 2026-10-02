import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { Package, Check, HelpCircle, Flame, RotateCcw } from 'lucide-react';
import config from '../../config';

// 12 thoroughly scrambled ingredients (5 correct target items + 7 decoys in mixed order)
const INGREDIENTS_POOL = [
    { id: 'broccoli', name: 'Raw Broccoli', icon: '🥦', isGood: false, note: 'Broccoli does not belong in this dum recipe!' },
    { id: 'rice', name: 'Dum Basmati Rice', icon: '🍚', isGood: true, note: 'Fragrant long-grain saffron rice added!' },
    { id: 'paneer', name: 'Paneer Cubes', icon: '🧀', isGood: false, note: 'Vegetarian paneer? No, think of the rich meat dish!' },
    { id: 'mutton', name: 'Tender Mutton', icon: '🥩', isGood: true, note: 'Succulent spiced mutton pieces added!' },
    { id: 'icecream', name: 'Vanilla Scoop', icon: '🍦', isGood: false, note: 'Ice cream will melt in the hot parcel!' },
    { id: 'spices', name: 'Star Anise & Spices', icon: '🌿', isGood: true, note: 'Aromatic whole spices and biriyani masala added!' },
    { id: 'noodles', name: 'Ramen Noodles', icon: '🍜', isGood: false, note: 'Not noodles!' },
    { id: 'onions', name: 'Crispy Fried Onions', icon: '🧅', isGood: true, note: 'Golden caramelized birista onions added!' },
    { id: 'chocolate', name: 'Chocolate Syrup', icon: '🍫', isGood: false, note: 'Chocolate in a hot parcel? Definitely not!' },
    { id: 'egg', name: 'Golden Boiled Egg', icon: '🥚', isGood: true, note: 'Classic boiled egg topper added!' },
    { id: 'pizza', name: 'Pizza Slice', icon: '🍕', isGood: false, note: 'Not Italian pizza!' },
    { id: 'dimsum', name: 'Steamed Dimsum', icon: '🥟', isGood: false, note: 'Not dimsum!' },
];

const TARGET_COUNT = 5;

const MuttonBiriyaniDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();
    const [packedIds, setPackedIds] = useState([]);
    const [isSealed, setIsSealed] = useState(hasKeepsake('biriyani_key'));
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('normal'); // 'success', 'error', 'normal'
    const [showHint, setShowHint] = useState(false);

    const goodCount = packedIds.filter(id => INGREDIENTS_POOL.find(i => i.id === id)?.isGood).length;
    const progressPercent = Math.min(100, Math.round((goodCount / TARGET_COUNT) * 100));

    const handleIngredientClick = (ing) => {
        if (isSealed || packedIds.includes(ing.id)) return;

        if (ing.isGood) {
            const nextPacked = [...packedIds, ing.id];
            setPackedIds(nextPacked);
            setFeedback(`✓ ${ing.note}`);
            setFeedbackType('success');

            const nextGoodCount = nextPacked.filter(id => INGREDIENTS_POOL.find(i => i.id === id)?.isGood).length;
            if (nextGoodCount === TARGET_COUNT) {
                setIsSealed(true);
                setFeedback('🔥 100% PACKED! Parcel sealed with aroma!');
                if (!hasKeepsake('biriyani_key')) {
                    setTimeout(() => {
                        addKeepsake('biriyani_key', 'Mutton Biriyani Parcel', '🍲');
                    }, 800);
                }
            }
        } else {
            setFeedback(`⚠️ ${ing.note}`);
            setFeedbackType('error');
            setTimeout(() => {
                setFeedback('');
                setFeedbackType('normal');
            }, 2500);
        }
    };

    const handleRemoveIngredient = (id) => {
        if (isSealed) return;
        setPackedIds(prev => prev.filter(item => item !== id));
        setFeedback('Removed item from parcel.');
        setFeedbackType('normal');
    };

    const handleResetParcel = () => {
        if (isSealed) return;
        setPackedIds([]);
        setFeedback('');
        setFeedbackType('normal');
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <span className="text-xl">📦</span>
                    <h2 className="text-lg font-bold">STAGE 04: SECRET TAKEAWAY</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    Remember that irresistible hot parcel ordered to take home? Pick the 5 authentic ingredients from the pantry to pack the takeaway box!
                </p>
            </div>

            {/* Parcel Station */}
            <div className="w-full bg-[#191724] border-4 border-[#f6c177] p-5 sm:p-6 shadow-[8px_8px_0_#ea9d34]">
                <div className="text-[10px] text-[#f6c177] uppercase tracking-widest text-center mb-4 font-mono">
                    ♨️ TAKEAWAY PARCEL PACKER ♨️
                </div>

                {/* Steaming Parcel Container */}
                <div className="flex flex-col items-center justify-center mb-4">
                    <motion.div
                        animate={isSealed ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
                        transition={{ repeat: isSealed ? Infinity : 0, duration: 2 }}
                        className="w-44 h-36 bg-[#26233a] border-4 border-[#f6c177] rounded-lg flex flex-col items-center justify-center relative shadow-lg overflow-hidden p-2"
                    >
                        <span className="text-4xl mb-1">{isSealed ? '📦' : '🍲'}</span>
                        <div className="text-[10px] font-bold text-amber-300 text-center font-mono">
                            {isSealed ? "Parcel sealed" : `AROMA LEVEL: ${progressPercent}% (${goodCount}/${TARGET_COUNT})`}
                        </div>

                        {/* Packed ingredients preview inside parcel */}
                        {!isSealed && (
                            <div className="flex flex-wrap gap-1 justify-center mt-2 max-w-[90%]">
                                {packedIds.map(id => {
                                    const item = INGREDIENTS_POOL.find(i => i.id === id);
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => handleRemoveIngredient(id)}
                                            className="text-sm bg-[#191724] border border-amber-400/60 rounded px-1 hover:border-red-400 cursor-pointer"
                                            title="Click to remove"
                                        >
                                            {item?.icon}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Aroma steam effect */}
                        <div className="absolute top-1 right-2 text-xs text-amber-300 animate-pulse">
                            ♨️
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-48 h-3 bg-[#0f172a] border border-[#f6c177] rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Feedback message */}
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs text-center mb-3 font-mono p-2 border ${feedbackType === 'error'
                                ? 'bg-red-950 border-red-500 text-red-300'
                                : feedbackType === 'success'
                                    ? 'bg-green-950 border-green-500 text-green-300 font-bold'
                                    : 'bg-[#26233a] border-[#6e6a86] text-amber-300'
                            }`}
                    >
                        {feedback}
                    </motion.div>
                )}

                {/* Scrambled Kitchen Counter Ingredients (3x4 Grid) */}
                {!isSealed && (
                    <div className="space-y-3">
                        <div className="text-[10px] text-[#908caa] text-center">
                            Select 5 ingredients to complete the parcel:
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {INGREDIENTS_POOL.map((ing) => {
                                const isPacked = packedIds.includes(ing.id);

                                return (
                                    <button
                                        key={ing.id}
                                        disabled={isPacked}
                                        onClick={() => handleIngredientClick(ing)}
                                        className={`p-2 border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs cursor-pointer rounded-sm min-h-[64px]
                                            ${isPacked
                                                ? 'bg-[#191724] border-gray-700 text-gray-600 opacity-20 cursor-not-allowed'
                                                : 'bg-[#26233a] border-[#6e6a86] text-[#e0def4] hover:border-[#f6c177] hover:bg-[#322e4a] active:translate-y-1 shadow-[2px_2px_0_rgba(0,0,0,0.5)]'
                                            }`}
                                    >
                                        <span className="text-2xl">{ing.icon}</span>
                                        <span className="text-[9px] font-bold text-center leading-tight">{ing.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reset action */}
                        {packedIds.length > 0 && (
                            <div className="flex justify-center pt-1">
                                <button
                                    onClick={handleResetParcel}
                                    className="px-3 py-1 bg-[#26233a] border border-[#6e6a86] text-[10px] text-[#e0def4] hover:border-amber-400 active:translate-y-1 flex items-center gap-1 cursor-pointer"
                                >
                                    <RotateCcw size={10} /> Reset Box
                                </button>
                            </div>
                        )}
                    </div>
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
                            💡 Hint: What I took parcel... rich fragrant dum basmati rice + tender meat pieces!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Victory Card */}
            {isSealed && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-yellow-400 text-center shadow-[6px_6px_0_#ca8a04]"
                >
                    <div className="text-3xl mb-1">🍲 📦 🔥</div>
                    <h3 className="text-sm font-bold text-yellow-300">KEY #4 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "The legendary Mutton Biriyani parcel locked into memory!"
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-yellow-400 text-[10px] text-green-400">
                        Keepsake Stored in Inventory [4/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MuttonBiriyaniDay;
