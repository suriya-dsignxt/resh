import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { UtensilsCrossed, HelpCircle, RotateCcw, Delete } from 'lucide-react';
import config from '../../config';

// 20 thoroughly scrambled letters containing all 13 target characters + 7 decoys (L, M, S, B, D, A, U)
const SCRAMBLED_TILES = [
    { id: 1, char: 'T' },
    { id: 2, char: 'P' },
    { id: 3, char: 'L' },
    { id: 4, char: 'C' },
    { id: 5, char: 'E' },
    { id: 6, char: 'M' },
    { id: 7, char: 'K' },
    { id: 8, char: 'O' },
    { id: 9, char: 'S' },
    { id: 10, char: 'R' },
    { id: 11, char: 'H' },
    { id: 12, char: 'B' },
    { id: 13, char: 'I' },
    { id: 14, char: 'P' },
    { id: 15, char: 'D' },
    { id: 16, char: 'C' },
    { id: 17, char: 'A' },
    { id: 18, char: 'E' },
    { id: 19, char: 'U' },
    { id: 20, char: 'N' }
];

const TARGET_FIRST_WORD = "COPPER";
const TARGET_SECOND_WORD = "KITCHEN";
const TARGET_FULL = "COPPERKITCHEN";

const CopperKitchenDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();
    const [selectedTiles, setSelectedTiles] = useState([]); // array of tile objects
    const [isWon, setIsWon] = useState(hasKeepsake('copper_key'));
    const [showHint, setShowHint] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleTileClick = (tile) => {
        if (isWon) return;
        if (selectedTiles.some(t => t.id === tile.id)) return;
        if (selectedTiles.length >= 13) return;

        const nextSelected = [...selectedTiles, tile];
        setSelectedTiles(nextSelected);
        setErrorMsg('');

        const currentWord = nextSelected.map(t => t.char).join('');
        if (nextSelected.length === 13) {
            if (currentWord === TARGET_FULL) {
                setIsWon(true);
                if (!hasKeepsake('copper_key')) {
                    setTimeout(() => {
                        addKeepsake('copper_key', 'Copper Kitchen', '🍽️');
                    }, 800);
                }
            } else {
                setErrorMsg('Letters do not spell our first hotel! Tap Backspace or Clear.');
            }
        }
    };

    const handleRemoveAt = (index) => {
        if (isWon) return;
        setSelectedTiles(prev => prev.filter((_, i) => i !== index));
        setErrorMsg('');
    };

    const handleBackspace = () => {
        if (selectedTiles.length === 0 || isWon) return;
        setSelectedTiles(prev => prev.slice(0, -1));
        setErrorMsg('');
    };

    const handleReset = () => {
        if (isWon) return;
        setSelectedTiles([]);
        setErrorMsg('');
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isWon) return;
            const key = e.key.toUpperCase();

            if (key === 'BACKSPACE') {
                handleBackspace();
                return;
            }

            if (/^[A-Z]$/.test(key)) {
                // Find first unused tile matching this character
                const available = SCRAMBLED_TILES.find(
                    t => t.char === key && !selectedTiles.some(st => st.id === t.id)
                );
                if (available) {
                    handleTileClick(available);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedTiles, isWon]);

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <UtensilsCrossed size={20} />
                    <h2 className="text-lg font-bold">STAGE 03: THE NEON DINER</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    Our first hotel dining together! Rebuild the scrambled neon restaurant sign by selecting the letter tiles in order.
                </p>
            </div>

            {/* Neon Signboard Area */}
            <div className="w-full bg-[#191724] border-4 border-[#ea9d34] p-5 sm:p-6 shadow-[8px_8px_0_#ea9d34] relative">
                {/* Visual Neon Letter Slots */}
                <div className="bg-[#0f172a] border-4 border-[#56526e] p-4 rounded-md text-center mb-5 shadow-inner">
                    <div className="text-[10px] text-[#ea9d34] uppercase tracking-widest mb-3 font-mono">
                        ★ NEON SIGNBOARD PUZZLE ★
                    </div>

                    {/* Word 1 (6 chars) & Word 2 (7 chars) */}
                    <div className="flex flex-col gap-2 items-center">
                        {/* Row 1: First Word (6 Slots) */}
                        <div className="flex gap-1 justify-center">
                            {Array.from({ length: 6 }).map((_, i) => {
                                const tile = selectedTiles[i];
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => tile && handleRemoveAt(i)}
                                        className={`w-7 h-9 sm:w-9 sm:h-11 border-2 flex items-center justify-center font-mono text-base sm:text-xl font-bold transition-all
                                            ${isWon
                                                ? 'border-amber-400 bg-amber-950 text-amber-300 shadow-[0_0_10px_#ea9d34]'
                                                : tile
                                                    ? 'border-[#ea9d34] bg-[#26233a] text-amber-300 hover:border-red-400 cursor-pointer'
                                                    : 'border-[#56526e] bg-[#191724] text-gray-700'
                                            }`}
                                        title={tile ? "Click to remove" : ""}
                                    >
                                        {tile ? tile.char : '•'}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Row 2: Second Word (7 Slots) */}
                        <div className="flex gap-1 justify-center">
                            {Array.from({ length: 7 }).map((_, i) => {
                                const tile = selectedTiles[6 + i];
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => tile && handleRemoveAt(6 + i)}
                                        className={`w-7 h-9 sm:w-9 sm:h-11 border-2 flex items-center justify-center font-mono text-base sm:text-xl font-bold transition-all
                                            ${isWon
                                                ? 'border-amber-400 bg-amber-950 text-amber-300 shadow-[0_0_10px_#ea9d34]'
                                                : tile
                                                    ? 'border-[#ea9d34] bg-[#26233a] text-amber-300 hover:border-red-400 cursor-pointer'
                                                    : 'border-[#56526e] bg-[#191724] text-gray-700'
                                            }`}
                                        title={tile ? "Click to remove" : ""}
                                    >
                                        {tile ? tile.char : '•'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Error status */}
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-2 bg-red-950 border-2 border-red-500 text-red-300 text-xs text-center font-mono"
                    >
                        ⚠️ {errorMsg}
                    </motion.div>
                )}

                {/* Scrambled Letter Tiles Grid */}
                {!isWon && (
                    <div className="space-y-4">
                        <div className="text-[10px] text-[#908caa] text-center mb-1">
                            Select letters from the scrambled pool (Keyboard supported):
                        </div>

                        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 justify-items-center max-w-[340px] mx-auto">
                            {SCRAMBLED_TILES.map((tile) => {
                                const isUsed = selectedTiles.some(st => st.id === tile.id);
                                return (
                                    <button
                                        key={tile.id}
                                        disabled={isUsed}
                                        onClick={() => handleTileClick(tile)}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 font-mono font-black text-base sm:text-lg border-2 transition-all cursor-pointer flex items-center justify-center rounded-sm
                                            ${isUsed
                                                ? 'bg-[#191724] border-[#393552] text-gray-600 opacity-20 cursor-not-allowed'
                                                : 'bg-[#26233a] border-[#ea9d34] text-amber-300 hover:bg-[#ea9d34] hover:text-[#191724] active:translate-y-1 shadow-[2px_2px_0_rgba(0,0,0,0.6)]'
                                            }`}
                                    >
                                        {tile.char}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Controls: Backspace & Reset */}
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={handleBackspace}
                                disabled={selectedTiles.length === 0}
                                className="px-4 py-2 bg-[#26233a] border border-[#6e6a86] text-xs text-[#e0def4] hover:border-amber-400 active:translate-y-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ⌫ Backspace
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={selectedTiles.length === 0}
                                className="px-4 py-2 bg-[#26233a] border border-[#6e6a86] text-xs text-[#e0def4] hover:border-amber-400 active:translate-y-1 flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <RotateCcw size={12} /> Clear All
                            </button>
                        </div>
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
                            💡 Hint: Metallic reddish element name (6 letters) + Place where chefs cook (7 letters)!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Victory Card */}
            {isWon && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-amber-400 text-center shadow-[6px_6px_0_#ea9d34]"
                >
                    <div className="text-3xl mb-1">🍽️ 🥂 ✨</div>
                    <h3 className="text-sm font-bold text-amber-300">KEY #3 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "Copper Kitchen — Table for two, unforgettable vibes!"
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-amber-400 text-[10px] text-green-400">
                        Keepsake Stored in Inventory [3/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CopperKitchenDay;
