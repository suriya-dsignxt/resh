import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ChevronLeft, ChevronRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { heartPhotos } from '../data/heartPhotos';
import config from '../config';
import { playBgMusic, toggleBgMusic, subscribeAudioState } from '../utils/audioManager';

const HeartCollage = () => {
    const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(null);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const photos = heartPhotos;

    useEffect(() => {
        // Subscribe to global audio playback state
        const unsubscribe = subscribeAudioState((playing) => {
            setIsPlayingAudio(playing);
        });

        // Automatically start playback upon entering the collage section
        playBgMusic();

        return () => {
            unsubscribe();
        };
    }, []);

    const triggerHeartConfetti = () => {
        try {
            confetti({
                particleCount: 40,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#eb6f92', '#f472b6', '#fb7185', '#fda4af', '#ffffff']
            });
        } catch {}
    };

    const handlePhotoClick = (idx) => {
        setSelectedPhotoIdx(idx);
        triggerHeartConfetti();
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setSelectedPhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setSelectedPhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedPhotoIdx === null) return;
            if (e.key === 'ArrowLeft') handlePrev(e);
            if (e.key === 'ArrowRight') handleNext(e);
            if (e.key === 'Escape') setSelectedPhotoIdx(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhotoIdx]);

    const selectedPhoto = selectedPhotoIdx !== null ? photos[selectedPhotoIdx] : null;

    // Split 12 photos into Heart Silhouette Rows:
    // Row 1 (Top Lobes): 2 photos left, 2 photos right (indices 0, 1 and 2, 3)
    // Row 2 (Middle Wide): 4 photos (indices 4, 5, 6, 7)
    // Row 3 (Tapering): 3 photos (indices 8, 9, 10)
    // Row 4 (Bottom Point): 1 photo (index 11)
    const row1Left = photos.slice(0, 2);
    const row1Right = photos.slice(2, 4);
    const row2 = photos.slice(4, 8);
    const row3 = photos.slice(8, 11);
    const row4 = photos.slice(11, 12);

    // Subtle natural tilt angles for polaroid feel
    const tiltAngles = [-2, 2, -1.5, 2.5, -2, 1, -2.5, 2, -1.5, 2, -2, 1];

    const renderCard = (item, actualIndex) => {
        const tilt = tiltAngles[actualIndex % tiltAngles.length];

        return (
            <motion.div
                key={item.id || actualIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ 
                    scale: 1.1, 
                    rotate: 0,
                    zIndex: 30,
                    transition: { duration: 0.2 } 
                }}
                transition={{ duration: 0.3, delay: actualIndex * 0.03 }}
                style={{ rotate: `${tilt}deg` }}
                onClick={() => handlePhotoClick(actualIndex)}
                className="cursor-pointer group relative flex-shrink-0"
            >
                {/* Polaroid Frame */}
                <div className="p-1 xs:p-1.5 sm:p-2 pb-1.5 xs:pb-2 sm:pb-3 bg-[#fdfdfd] border xs:border-2 border-[#393552] rounded-xs xs:rounded-sm shadow-[2px_2px_0_rgba(0,0,0,0.5)] sm:shadow-[3px_3px_0_rgba(0,0,0,0.5)] group-hover:border-[#eb6f92] group-hover:shadow-[0_0_15px_#eb6f92] transition-all duration-200 w-[68px] xs:w-[76px] sm:w-28 md:w-32 flex flex-col items-center">
                    <div className="w-full aspect-square bg-[#0f172a] overflow-hidden rounded-2xs sm:rounded-xs mb-0.5 sm:mb-1 relative">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                    <div className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans font-bold text-gray-900 truncate w-full text-center px-0.5">
                        {item.title}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Header Title */}
            <header className="mb-4 sm:mb-6 text-center space-y-2 sm:space-y-3 relative w-full">
                <div className="text-4xl sm:text-5xl mb-1 animate-bounce">💖</div>
                <h1 className="text-xl xs:text-2xl md:text-4xl text-[#eb6f92] animate-pulse drop-shadow-[2px_2px_0_rgba(0,0,0,1)] font-pixel tracking-wider">
                    {config.person.title.toUpperCase()}
                </h1>

                {/* Subtitle & Music Toggle */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <div className="inline-flex items-center gap-1.5 bg-[#26233a] border-2 border-[#eb6f92] px-3 py-1 text-[10px] sm:text-xs text-pink-300 shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                        <Sparkles size={12} className="animate-spin text-pink-400" />
                        <span>OUR MEMORY HEART COLLAGE</span>
                    </div>

                    <button
                        onClick={toggleBgMusic}
                        className="inline-flex items-center gap-1.5 bg-[#191724] border-2 border-pink-400 px-3 py-1 text-[10px] sm:text-xs text-pink-300 hover:bg-pink-900/40 active:translate-y-0.5 transition-all cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
                    >
                        {isPlayingAudio ? (
                            <>
                                <Volume2 size={12} className="text-green-400 animate-pulse" />
                                <span className="text-green-400 font-mono">KALAIVANIYE 🌸🎵</span>
                            </>
                        ) : (
                            <>
                                <VolumeX size={12} className="text-gray-400" />
                                <span className="font-mono">PLAY KALAIVANIYE 🎶</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Heart Structured Grid Container - Zero Overlap Layout Across Mobile & Desktop */}
            <div className="w-full bg-[#191724]/90 border-2 sm:border-4 border-[#eb6f92] p-2 xs:p-3 sm:p-6 md:p-8 rounded-xl shadow-[0_0_35px_rgba(235,111,146,0.25)] relative overflow-hidden">
                {/* Background ambient heart glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(235,111,146,0.15),transparent_70%)]" />

                {/* Universal Heart Row Structure */}
                <div className="flex flex-col items-center gap-2 xs:gap-2.5 sm:gap-4 md:gap-5 relative z-10 py-1 sm:py-2">
                    {/* Row 1: Top Lobes (2 Left + gap + 2 Right) */}
                    <div className="flex items-center justify-center gap-3 xs:gap-4 sm:gap-10 md:gap-14">
                        <div className="flex gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
                            {row1Left.map((item, idx) => renderCard(item, idx))}
                        </div>
                        <div className="flex gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
                            {row1Right.map((item, idx) => renderCard(item, idx + 2))}
                        </div>
                    </div>

                    {/* Row 2: Wide Middle (4 Photos) */}
                    <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
                        {row2.map((item, idx) => renderCard(item, idx + 4))}
                    </div>

                    {/* Row 3: Tapering Body (3 Photos) */}
                    <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
                        {row3.map((item, idx) => renderCard(item, idx + 8))}
                    </div>

                    {/* Row 4: Bottom Tip (1 Photo) */}
                    <div className="flex items-center justify-center">
                        {row4.map((item, idx) => renderCard(item, idx + 11))}
                    </div>
                </div>

                {/* Footer Hint */}
                <div className="mt-4 sm:mt-6 text-center">
                    <span className="inline-block text-[9px] sm:text-[10px] text-[#908caa] font-mono bg-[#0f172a]/90 px-3 py-1 sm:px-4 sm:py-1.5 border border-[#eb6f92]/40 rounded-full shadow">
                        ✨ Tap any photo to enlarge & read memories
                    </span>
                </div>
            </div>

            {/* Lightbox / Memory Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setSelectedPhotoIdx(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-[#191724] border-4 border-[#eb6f92] p-6 shadow-[0_0_50px_rgba(235,111,146,0.6)] rounded-xl text-center"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedPhotoIdx(null)}
                                className="absolute top-3 right-3 text-[#e0def4] hover:text-[#eb6f92] p-1.5 bg-[#26233a] border border-[#eb6f92] rounded cursor-pointer transition-colors"
                            >
                                <X size={18} />
                            </button>

                            {/* Memory Badge */}
                            <div className="inline-flex items-center gap-1.5 bg-[#26233a] border border-pink-400/60 px-3 py-1 text-[11px] text-pink-300 font-mono mb-4 rounded-full">
                                <Heart size={12} fill="#eb6f92" className="text-[#eb6f92]" />
                                <span>{selectedPhoto.date || `Memory #${selectedPhotoIdx + 1}`} ({selectedPhotoIdx + 1} of {photos.length})</span>
                            </div>

                            {/* Main Enlarged Image */}
                            <div className="w-full max-h-[360px] bg-[#0f172a] border-2 border-[#56526e] rounded-lg overflow-hidden mb-4 flex items-center justify-center p-1 shadow-inner">
                                <img
                                    src={selectedPhoto.image}
                                    alt={selectedPhoto.title}
                                    className="max-h-[350px] w-auto max-w-full object-contain rounded"
                                />
                            </div>

                            {/* Memory Title & Caption */}
                            <h3 className="text-lg md:text-xl font-bold text-amber-300 mb-2 font-pixel tracking-wide">
                                {selectedPhoto.title}
                            </h3>
                            <p className="text-xs md:text-sm text-[#e0def4] leading-relaxed font-sans px-2">
                                {selectedPhoto.caption}
                            </p>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#26233a]">
                                <button
                                    onClick={handlePrev}
                                    className="px-4 py-2 bg-[#26233a] border-2 border-[#eb6f92] text-xs text-[#eb6f92] hover:bg-[#eb6f92] hover:text-[#191724] transition-colors flex items-center gap-1 font-bold cursor-pointer rounded shadow"
                                >
                                    <ChevronLeft size={16} /> PREV
                                </button>
                                <span className="text-xs text-gray-400 font-mono">
                                    {selectedPhotoIdx + 1} / {photos.length}
                                </span>
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-2 bg-[#26233a] border-2 border-[#eb6f92] text-xs text-[#eb6f92] hover:bg-[#eb6f92] hover:text-[#191724] transition-colors flex items-center gap-1 font-bold cursor-pointer rounded shadow"
                                >
                                    NEXT <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HeartCollage;
