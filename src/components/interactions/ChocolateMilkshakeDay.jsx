import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeepsakes } from '../../utils/KeepsakeContext';
import { GlassWater, Sparkles, HelpCircle, ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import config from '../../config';

const FALLING_ITEMS = [
    { type: 'choco', icon: '🍫', name: 'Choco Chunk', isGood: true, points: 20 },
    { type: 'icecream', icon: '🍨', name: 'Ice Cream', isGood: true, points: 20 },
    { type: 'milk', icon: '🥛', name: 'Fresh Milk', isGood: true, points: 20 },
    { type: 'cherry', icon: '🍒', name: 'Cherry', isGood: true, points: 15 },
    { type: 'garlic', icon: '🧄', name: 'Garlic', isGood: false, points: -10 },
    { type: 'chili', icon: '🌶️', name: 'Chili', isGood: false, points: -10 },
];

const ChocolateMilkshakeDay = () => {
    const { addKeepsake, hasKeepsake } = useKeepsakes();

    // Game states: 'catcher', 'blending', 'slurp', 'finished'
    const [gameState, setGameState] = useState(hasKeepsake('milkshake_key') ? 'finished' : 'catcher');
    const [blendScore, setBlendScore] = useState(0); // 0 to 100
    const [cupPos, setCupPos] = useState(50); // 10% to 90%
    const [fallingObjects, setFallingObjects] = useState([]);
    const [slurpLevel, setSlurpLevel] = useState(0); // 0 to 100
    const [isSlurping, setIsSlurping] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [floatingBubbles, setFloatingBubbles] = useState([]);

    const gameLoopRef = useRef(null);

    // Phase 1: Falling Ingredients Catcher Loop
    useEffect(() => {
        if (gameState !== 'catcher') return;

        // Spawn items interval
        const spawnInterval = setInterval(() => {
            const randomItem = FALLING_ITEMS[Math.floor(Math.random() * FALLING_ITEMS.length)];
            const newObj = {
                id: Date.now() + Math.random(),
                ...randomItem,
                x: Math.floor(Math.random() * 70) + 15, // 15% to 85%
                y: 0
            };
            setFallingObjects(prev => [...prev, newObj]);
        }, 800);

        // Movement & collision loop
        const moveInterval = setInterval(() => {
            setFallingObjects(prev => {
                const nextObjs = [];
                for (const obj of prev) {
                    const nextY = obj.y + 4;
                    // Check catch near bottom (Y between 75% and 90%)
                    if (nextY >= 75 && nextY <= 90) {
                        const dist = Math.abs(obj.x - cupPos);
                        if (dist <= 16) {
                            // Caught!
                            if (obj.isGood) {
                                setBlendScore(s => {
                                    const nextS = Math.min(100, s + obj.points);
                                    if (nextS >= 100) {
                                        setTimeout(() => startBlendingPhase(), 300);
                                    }
                                    return nextS;
                                });
                            } else {
                                setBlendScore(s => Math.max(0, s + obj.points));
                            }
                            continue; // Remove caught item
                        }
                    }

                    if (nextY < 100) {
                        nextObjs.push({ ...obj, y: nextY });
                    }
                }
                return nextObjs;
            });
        }, 40);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(moveInterval);
        };
    }, [gameState, cupPos]);

    const startBlendingPhase = () => {
        setGameState('blending');
        setFallingObjects([]);
        setTimeout(() => {
            setGameState('slurp');
        }, 1800);
    };

    // Phase 2: Slurping Action
    useEffect(() => {
        let interval;
        if (isSlurping && slurpLevel < 100 && gameState === 'slurp') {
            interval = setInterval(() => {
                setSlurpLevel(lvl => {
                    const next = lvl + 4;
                    // Add funny bubbles
                    setFloatingBubbles(b => [...b.slice(-6), { id: Date.now(), x: Math.random() * 60 + 20 }]);

                    if (next >= 100) {
                        setGameState('finished');
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                        if (!hasKeepsake('milkshake_key')) {
                            setTimeout(() => {
                                addKeepsake('milkshake_key', 'Chocolate Milkshake', '🥤');
                            }, 800);
                        }
                        return 100;
                    }
                    return next;
                });
            }, 60);
        }
        return () => clearInterval(interval);
    }, [isSlurping, slurpLevel, gameState, hasKeepsake, addKeepsake]);

    const handleMoveCup = (delta) => {
        setCupPos(prev => Math.max(15, Math.min(85, prev + delta)));
    };

    const handleRestartGame = () => {
        setBlendScore(0);
        setSlurpLevel(0);
        setFallingObjects([]);
        setGameState('catcher');
    };

    const getGuiltThought = () => {
        if (slurpLevel === 0) return "Freshly blended! Bought for us to share together 🍫🥛";
        if (slurpLevel < 30) return "Just testing a tiny sip from the top whipped cream... delicious! 😋";
        if (slurpLevel < 65) return "Wait... it's already half empty?! Just one more sip... 🙈";
        if (slurpLevel < 95) return "I should stop and save the rest... but the bottom is so thick! 🤤";
        return "GULP! 100% devoured! Drank the entire Chocolate Milkshake solo! 😂🥤";
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Header */}
            <div className="w-full bg-[#26233a] border-4 border-[#eb6f92] p-4 text-center shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#eb6f92]">
                    <span className="text-xl">🥤</span>
                    <h2 className="text-lg font-bold">STAGE 05: THE BEVERAGE HEIST</h2>
                </div>
                <p className="text-xs text-[#e0def4] leading-relaxed">
                    A delicious drink bought with the purest intention to share... until temptation won! Catch the ingredients & slurp down the sweet evidence!
                </p>
            </div>

            {/* Main Interactive Stage Box */}
            <div className="w-full bg-[#191724] border-4 border-[#56b6c2] p-5 sm:p-6 shadow-[8px_8px_0_#56b6c2] relative overflow-hidden">
                <div className="text-[10px] text-[#56b6c2] uppercase tracking-widest text-center mb-3 font-mono">
                    ★ CHOCO SHAKER ARCADE ★
                </div>

                {/* PHASE 1: Catcher Game */}
                {gameState === 'catcher' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono px-2">
                            <span className="text-[#908caa]">CATCH SWEET TOPPINGS:</span>
                            <span className="text-amber-300 font-bold">{blendScore}% / 100%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-[#0f172a] border border-[#56b6c2] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400 transition-all duration-200"
                                style={{ width: `${blendScore}%` }}
                            />
                        </div>

                        {/* Arcade Game Canvas */}
                        <div
                            className="relative w-full h-[230px] bg-[#0f172a] border-4 border-[#26233a] rounded-lg overflow-hidden select-none"
                            onTouchMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const touchX = e.touches[0].clientX - rect.left;
                                const percent = Math.max(15, Math.min(85, (touchX / rect.width) * 100));
                                setCupPos(percent);
                            }}
                        >
                            {/* Falling Goodies */}
                            {fallingObjects.map(obj => (
                                <div
                                    key={obj.id}
                                    className="absolute text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-none"
                                    style={{
                                        left: `${obj.x}%`,
                                        top: `${obj.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {obj.icon}
                                </div>
                            ))}

                            {/* Player's Blender Cup */}
                            <motion.div
                                className="absolute bottom-2 text-4xl flex flex-col items-center"
                                style={{
                                    left: `${cupPos}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]">🥤</span>
                                <div className="w-8 h-1 bg-cyan-400 rounded-full mt-1"></div>
                            </motion.div>
                        </div>

                        {/* On-Screen Arrow Controls */}
                        <div className="flex justify-between items-center gap-4 pt-1">
                            <button
                                onClick={() => handleMoveCup(-12)}
                                className="flex-1 py-3 bg-[#26233a] border-2 border-[#56b6c2] text-cyan-300 font-bold text-sm flex items-center justify-center gap-1 active:translate-y-1 shadow cursor-pointer"
                            >
                                <ArrowLeft size={18} /> LEFT
                            </button>
                            <button
                                onClick={() => handleMoveCup(12)}
                                className="flex-1 py-3 bg-[#26233a] border-2 border-[#56b6c2] text-cyan-300 font-bold text-sm flex items-center justify-center gap-1 active:translate-y-1 shadow cursor-pointer"
                            >
                                RIGHT <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* PHASE 1.5: Blending Animation */}
                {gameState === 'blending' && (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                        <motion.div
                            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="text-6xl"
                        >
                            🌪️
                        </motion.div>
                        <h3 className="text-base font-bold text-amber-300 animate-pulse font-mono">
                            ⚡ BLENDING CHOCOLATE MILKSHAKE ⚡
                        </h3>
                        <p className="text-xs text-[#908caa]">Frothing rich chocolate syrup, milk & ice cream...</p>
                    </div>
                )}

                {/* PHASE 2: Slurp Heist Challenge */}
                {(gameState === 'slurp' || gameState === 'finished') && (
                    <div className="flex flex-col items-center">
                        {/* Joyful Animated Milkshake Cup */}
                        <div className="relative w-44 h-56 bg-[#0f172a] border-4 border-[#56b6c2] rounded-b-3xl flex flex-col justify-end overflow-hidden mb-3 shadow-2xl p-2">
                            {/* Straw with cute stripes */}
                            <div className="absolute top-0 right-12 w-4 h-28 bg-gradient-to-b from-red-500 via-white to-red-500 border-2 border-slate-900 -rotate-12 z-20 shadow-md"></div>

                            {/* Whipped Cream Topper */}
                            <div className="absolute top-4 left-6 right-10 flex justify-center items-center z-10">
                                <span className="text-4xl filter drop-shadow">🍨</span>
                                <span className="text-2xl -ml-2 -mt-4">🍒</span>
                            </div>

                            {/* Liquid Level */}
                            <motion.div
                                className="w-full bg-gradient-to-b from-[#784315] to-[#4a2608] border-t-4 border-[#a66024] transition-all duration-100 flex flex-col items-center justify-center relative rounded-b-2xl"
                                style={{ height: `${100 - slurpLevel}%` }}
                            >
                                {slurpLevel < 95 && (
                                    <div className="flex gap-2 text-xs opacity-70">
                                        <span>🍫</span>
                                        <span>🥛</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Floating Slurp Bubbles */}
                            {floatingBubbles.map(b => (
                                <motion.div
                                    key={b.id}
                                    initial={{ y: 50, opacity: 1, scale: 0.5 }}
                                    animate={{ y: -60, opacity: 0, scale: 1.2 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute bottom-4 text-xs pointer-events-none"
                                    style={{ left: `${b.x}%` }}
                                >
                                    🫧
                                </motion.div>
                            ))}

                            {/* Empty Glass Reward Face */}
                            {slurpLevel >= 100 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-4xl animate-bounce">
                                    <span>😋</span>
                                    <span className="text-[10px] text-amber-300 font-bold mt-1">EMPTY!</span>
                                </div>
                            )}
                        </div>

                        {/* Thought Dialogue */}
                        <div className="text-xs text-amber-300 font-bold text-center mb-4 min-h-[40px] flex items-center justify-center px-3 bg-[#26233a] border border-[#56b6c2]/40 rounded-sm w-full font-mono">
                            {getGuiltThought()}
                        </div>

                        {/* Interactive Slurp Button */}
                        {gameState === 'slurp' && (
                            <button
                                onMouseDown={() => setIsSlurping(true)}
                                onMouseUp={() => setIsSlurping(false)}
                                onMouseLeave={() => setIsSlurping(false)}
                                onTouchStart={(e) => { e.preventDefault(); setIsSlurping(true); }}
                                onTouchEnd={(e) => { e.preventDefault(); setIsSlurping(false); }}
                                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-[#191724] font-black text-sm border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 shadow-[4px_4px_0_rgba(0,0,0,0.5)] cursor-pointer hover:brightness-110 flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">🥤</span>
                                {isSlurping ? "SLURPING AWAY... 🫧" : "HOLD TO DRINK (SOLO HEIST)"}
                            </button>
                        )}

                        {gameState === 'finished' && (
                            <div className="w-full space-y-2">
                                <div className="py-3 bg-green-500 text-black font-bold text-xs text-center border-2 border-white rounded shadow">
                                    ✓ VERDICT: 100% GUILTY OF LOVING CHOCOLATE MILKSHAKE!
                                </div>
                                <button
                                    onClick={handleRestartGame}
                                    className="text-[10px] text-[#908caa] hover:text-amber-300 flex items-center justify-center gap-1 mx-auto underline cursor-pointer pt-1"
                                >
                                    <RotateCcw size={12} /> Play blender game again
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Clue button */}
                <div className="text-center mt-4 border-t border-[#26233a] pt-3">
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
                            💡 Hint: What I bought for us... thick chilled Chocolate Milkshake!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Victory Card */}
            {gameState === 'finished' && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full p-4 bg-[#26233a] border-4 border-cyan-400 text-center shadow-[6px_6px_0_#0891b2]"
                >
                    <div className="text-3xl mb-1">🥤 🍫 🎉</div>
                    <h3 className="text-sm font-bold text-cyan-300">KEY #5 DISCOVERED!</h3>
                    <p className="text-xs text-[#e0def4] mt-1">
                        "Bought for us... but drank the whole Chocolate Milkshake!"
                    </p>
                    <div className="inline-block mt-2 px-3 py-1 bg-[#191724] border border-cyan-400 text-[10px] text-green-400">
                        Keepsake Stored in Inventory [5/7]
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ChocolateMilkshakeDay;
