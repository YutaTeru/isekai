import React, { useState, useEffect } from 'react';
import { Creature } from '../types';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import BookPage from './BookPage';
import DustParticles from './DustParticles';

interface RealisticBookProps {
    creatures: Creature[];
    discoveredIds: string[];
    onClose: () => void;
}

const RealisticBook: React.FC<RealisticBookProps> = ({ creatures, discoveredIds, onClose }) => {
    // Determine discover status
    const discoveredCreatures = creatures.filter(c => discoveredIds.includes(c.id));


    // Page Management
    // Index 1 = Ex Libris (Left) + Title (Right)
    // Index 2+ = Creature Pages
    // Initial state: Open to the FIRST creature page (Index 2) if creatures exist, otherwise Intro (Index 1).
    const initialPage = discoveredCreatures.length > 0 ? 2 : 1;

    const [pageIndex, setPageIndex] = useState(initialPage);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);


    // Helper to get content for a given page index (Spread Index)
    // spreadIndex 1 => Intro Spread
    // spreadIndex > 1 => Creatures
    // Creature Index = (spreadIndex - 2) * 2
    const getPageContent = (spreadIndex: number, side: 'left' | 'right') => {
        if (spreadIndex < 1) return null; // Cover state

        // SPREAD 1: EX LIBRIS & TITLE
        if (spreadIndex === 1) {
            if (side === 'left') {
                return (
                    <div className="relative z-10 w-full h-full p-8 flex flex-col justify-center items-center border-4 border-double border-[#8D6E63] m-4" style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)' }}>
                        <div className="text-[#5D4037] opacity-50 font-serif mb-4 text-xs tracking-[0.3em]">EX LIBRIS</div>
                        <div className="w-24 h-24 mb-4 opacity-80">
                            {/* Simple coat of arms placeholder */}
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#5D4037]">
                                <path d="M50 0 C20 0 10 20 10 50 C10 80 50 100 50 100 C50 100 90 80 90 50 C90 20 80 0 50 0 Z" opacity="0.2" />
                                <path d="M50 10 L40 30 L50 40 L60 30 Z" />
                                <circle cx="50" cy="65" r="10" />
                            </svg>
                        </div>
                        <div className="w-full h-px bg-[#5D4037] opacity-30 my-2"></div>
                        <div className="font-maru text-[#5D4037] font-bold text-center">異世界<br />観測ログ</div>
                    </div>
                );
            } else {
                return (
                    <div className="relative z-10 w-full h-full p-12 flex flex-col text-[#5D4037]">
                        <div className="flex-1 flex flex-col justify-center text-center space-y-4">
                            <h2 className="text-2xl font-black mb-2 border-b-2 border-[#5D4037]/20 pb-2 inline-block mx-auto">観測記録序説</h2>
                            <p className="text-sm font-bold leading-relaxed opacity-80">
                                未知なる生態系への招待。<br />
                                収集されたデータは<br />
                                ここに記録される。
                            </p>
                        </div>
                        <div className="text-center text-xs opacity-40 font-mono">
                            OBSERVATION LOG<br />VOL. 1
                        </div>
                    </div>
                );
            }
        }

        // SPREADS 2+: CREATURES
        const creatureStartIdx = (spreadIndex - 2) * 2;

        // Handle Left Side
        if (side === 'left') {
            const creature = discoveredCreatures[creatureStartIdx];
            if (!creature) return null; // Empty page
            return (
                <div className="relative z-10 p-8 md:p-12 h-full">
                    <BookPage creature={creature} side="left" />
                    <div className="absolute bottom-6 left-8 text-[#5D4037] font-black opacity-40 font-maru">
                        p.{creatureStartIdx + 1}
                    </div>
                </div>
            );
        }

        // Handle Right Side
        if (side === 'right') {
            const creature = discoveredCreatures[creatureStartIdx + 1];
            if (!creature) {
                // Empty slot or "Unmapped Area"
                if (creatureStartIdx + 1 < 50) { // Assuming max 50 slots for example
                    return (
                        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col items-center justify-center text-[#8B4513]/30">
                            <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                            <span className="font-bold italic text-lg font-maru">未発見の生物エリア</span>
                            <div className="absolute bottom-6 right-8 text-[#5D4037] font-black opacity-40 font-maru">
                                p.{creatureStartIdx + 2}
                            </div>
                        </div>
                    );
                }
                return null;
            }
            return (
                <div className="relative z-10 p-8 md:p-12 h-full">
                    <BookPage creature={creature} side="right" />
                    <div className="absolute bottom-6 right-8 text-[#5D4037] font-black opacity-40 font-maru">
                        p.{creatureStartIdx + 2}
                    </div>
                </div>
            );
        }

        return null;
    };

    const maxPages = 1 + Math.ceil(Math.max(discoveredCreatures.length, 1) / 2);
    const hasNext = pageIndex < maxPages;
    const hasPrev = pageIndex > 1;

    const handleNext = () => {
        if (!hasNext || isFlipping) return;
        setIsFlipping(true);
        setFlipDirection('next');
        setTimeout(() => {
            setPageIndex(prev => prev + 1);
            setIsFlipping(false);
            setFlipDirection(null);
        }, 800);
    };

    const handlePrev = () => {
        if (!hasPrev || isFlipping) return;
        setIsFlipping(true);
        setFlipDirection('prev');
        setTimeout(() => {
            setPageIndex(prev => prev - 1);
            setIsFlipping(false);
            setFlipDirection(null);
        }, 800);
    };

    const handleClose = () => {
        // Just close immediately
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 font-serif overflow-hidden animate-in fade-in duration-500 perspective-2000">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <img src="/image/open_book_bg.png" alt="Desk" className="w-full h-full object-cover opacity-30 blur-sm" />
                <div className="absolute inset-0 bg-black/40"></div>
                <DustParticles />
            </div>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-6 right-6 z-50 bg-white/10 backdrop-blur text-white p-3 rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
                <X className="w-6 h-6" />
            </button>

            {/* 3D Book Container - ALWAYS OPEN */}
            <div className={`relative w-[95vw] md:w-[85vw] max-w-5xl aspect-[1.5/1] transition-transform duration-1000 transform-style-3d rotate-y-0 translate-x-0`}>

                {/* --- BACK COVER (Static base) --- */}
                <div className="absolute inset-0 bg-[#3E2723] rounded-lg shadow-2xl skew-y-1 transform translate-z-[-2px] border-4 border-[#2D1B18]"></div>

                {/* --- STATIC PAGES LAYER (What is underneath/visible when NOT flipping or BEHIND flip) --- */}

                {/* STATIC LEFT PAGE */}
                <div className="absolute left-0 top-0 w-1/2 h-full bg-[#F5E6D3] rounded-l-lg origin-right shadow-inner-left border-r border-[#E0C0A0] overflow-hidden flex flex-col z-10">
                    <img src="/image/parchment.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply pointer-events-none" />
                    {/* Logic: If Flipping PREV, we are peeling the Left page away. What's underneath? The PREV Left page. */}
                    {isFlipping && flipDirection === 'prev' ? getPageContent(pageIndex - 1, 'left') : getPageContent(pageIndex, 'left')}
                </div>

                {/* STATIC RIGHT PAGE */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-[#F5E6D3] rounded-r-lg origin-left shadow-inner-right border-l border-[#E0C0A0] overflow-hidden flex flex-col z-10">
                    <img src="/image/parchment.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply pointer-events-none" />
                    {/* Logic: If Flipping NEXT, we are peeling the Right page away. What's underneath? The NEXT Right page. */}
                    {isFlipping && flipDirection === 'next' ? getPageContent(pageIndex + 1, 'right') : getPageContent(pageIndex, 'right')}
                </div>


                {/* --- FLIPPING PAGES LAYER (The moving part) --- */}

                {/* FLIP NEXT ANIMATION (Right to Left) */}
                {isFlipping && flipDirection === 'next' && (
                    <div className="absolute right-0 top-0 w-1/2 h-full origin-left z-30 animate-flip-page-left transform-style-3d">
                        {/* FRONT FACE (Visible initially, shows Current Right) */}
                        <div className="absolute inset-0 bg-[#F5E6D3] rounded-r-lg backface-hidden shadow-md overflow-hidden border-l border-[#E0C0A0]">
                            <img src="/image/parchment.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
                            {getPageContent(pageIndex, 'right')}
                        </div>

                        {/* BACK FACE (Visible after mid-flip, shows Next Left) */}
                        <div className="absolute inset-0 bg-[#F5E6D3] rounded-l-lg transform rotate-y-180 backface-hidden shadow-md overflow-hidden border-r border-[#E0C0A0]">
                            {/* Ensure opaque background behind the image to prevent bleed-through/visual artifacts during Flip */}
                            <div className="absolute inset-0 bg-[#F5E6D3]"></div>
                            <img src="/image/parchment.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
                            {getPageContent(pageIndex + 1, 'left')}
                        </div>
                    </div>
                )}

                {/* FLIP PREV ANIMATION (Left to Right) */}
                {isFlipping && flipDirection === 'prev' && (
                    <div className="absolute left-0 top-0 w-1/2 h-full origin-right z-30 animate-flip-page-right transform-style-3d">
                        {/* FRONT FACE (Visible initially, shows Current Left) */}
                        <div className="absolute inset-0 bg-[#F5E6D3] rounded-l-lg backface-hidden shadow-md overflow-hidden border-r border-[#E0C0A0]">
                            <img src="/image/parchment.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
                            {getPageContent(pageIndex, 'left')}
                        </div>

                        {/* BACK FACE (Visible after mid-flip, shows Prev Right) */}
                        <div className="absolute inset-0 bg-[#F5E6D3] rounded-r-lg transform rotate-y-180 backface-hidden shadow-md overflow-hidden border-l border-[#E0C0A0]">
                            <div className="absolute inset-0 bg-[#F5E6D3]"></div>
                            <img src="/image/parchment.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" />
                            {getPageContent(pageIndex - 1, 'right')}
                        </div>
                    </div>
                )}


                {/* --- NAVIGATION ARROWS --- */}
                <div className="absolute top-1/2 -left-16 -translate-y-1/2 z-40">
                    <button disabled={!hasPrev || isFlipping} onClick={handlePrev} className="p-4 text-white disabled:opacity-20 hover:scale-110 transition-transform bg-black/20 rounded-full backdrop-blur-sm">
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                </div>
                <div className="absolute top-1/2 -right-16 -translate-y-1/2 z-40">
                    <button disabled={!hasNext || isFlipping} onClick={handleNext} className="p-4 text-white disabled:opacity-20 hover:scale-110 transition-transform bg-black/20 rounded-full backdrop-blur-sm">
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>

            </div>

            {/* Global Keyframes for Flip */}
            <style>{`
                .perspective-2000 { perspective: 2000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .-rotate-y-180 { transform: rotateY(-180deg); }
                
                @keyframes flipPageLeft {
                    0% { transform: rotateY(0); z-index: 50; }
                    50% { z-index: 50; }
                    100% { transform: rotateY(-180deg); z-index: 50; }
                }
                @keyframes flipPageRight {
                    0% { transform: rotateY(0); z-index: 50; }
                    50% { z-index: 50; }
                    100% { transform: rotateY(180deg); z-index: 50; }
                }
                .animate-flip-page-left { animation: flipPageLeft 0.8s ease-in-out forwards; }
                .animate-flip-page-right { animation: flipPageRight 0.8s ease-in-out forwards; }
                
                .shadow-inner-left { box-shadow: inset -10px 0 20px -10px rgba(0,0,0,0.2); }
                .shadow-inner-right { box-shadow: inset 10px 0 20px -10px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
};

export default RealisticBook;
