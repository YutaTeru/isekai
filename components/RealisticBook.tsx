import React, { useState, useEffect } from 'react';
import { Creature } from '../types';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import BookPage from './BookPage';

interface RealisticBookProps {
    creatures: Creature[];
    discoveredIds: string[];
    onClose: () => void;
}

const RealisticBook: React.FC<RealisticBookProps> = ({ creatures, discoveredIds, onClose }) => {
    // 2 creatures per view (Left Page, Right Page)
    // We filter only discovered creatures for the book? 
    // User asked to see "found creatures like a real encyclopedia".
    // Let's filter discovered ones.
    const discoveredCreatures = creatures.filter(c => discoveredIds.includes(c.id));

    // Pagination: Index of the LEFT page.
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null);

    const leftCreature = discoveredCreatures[currentIndex];
    const rightCreature = discoveredCreatures[currentIndex + 1];

    const hasNext = currentIndex + 2 < discoveredCreatures.length;
    const hasPrev = currentIndex > 0;

    const handleNext = () => {
        if (!hasNext) return;
        setFlipping('next');
        setTimeout(() => {
            setCurrentIndex(prev => prev + 2);
            setFlipping(null);
        }, 600); // Animation duration
    };

    const handlePrev = () => {
        if (!hasPrev) return;
        setFlipping('prev');
        setTimeout(() => {
            setCurrentIndex(prev => prev - 2);
            setFlipping(null);
        }, 600);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasNext, hasPrev]);

    if (discoveredCreatures.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white p-8 rounded-3xl text-center">
                    <p className="font-maru font-bold text-lg mb-4">まだ何も発見していません。</p>
                    <button onClick={onClose} className="bg-gray-200 px-6 py-2 rounded-full font-bold">閉じる</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 font-serif overflow-hidden animate-in zoom-in-95 duration-500">

            {/* Background Desk */}
            <img src="/image/open_book_bg.png" alt="Desk" className="absolute inset-0 w-full h-full object-cover opacity-50" />

            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 bg-black/50 text-white p-3 rounded-full hover:bg-black transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Book Container */}
            <div className="relative w-[90vw] max-w-6xl aspect-[1.6/1] perspective-2000">

                {/* Book Texture Wrapper */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* We will rely on the background image for the 'book' look for now, or add a book texture overlay if provided */}
                    {/* Assuming open_book_bg.png is just the desk. Wait, user provided "Desk with open book". */}
                    {/* If the background IS the book, we just overlay content. */}
                    {/* To be safe, I'll place a generated CSS book on top or use the image as the book surface. */}
                    {/* Let's try to simulate the book pages ON TOP of the desk image provided by user if it's just a desk. */}
                    {/* User said: "Attached image 2 ... desk with open book". So the image CONTAINS the book. */}
                    {/* I need to align my content to the book in the image. This is tricky with responsive. */}
                    {/* STRATEGY: Create a CSS Book that LOOKS like the one in the image (or covers it) to enable control. */}
                    {/* Better: A generic parchment book style that floats on the desk. */}
                </div>

                <div className="w-full h-full relative flex preserve-3d transition-transform duration-700">

                    {/* Left Page */}
                    <div className="flex-1 relative bg-[#F5E6D3] rounded-l-lg shadow-inner-left origin-right border-r border-[#E0D0C0] p-8 md:p-12 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30 pointer-events-none"></div>
                        {leftCreature && <BookPage creature={leftCreature} side="left" />}

                        {/* Page Number */}
                        <div className="absolute bottom-6 left-8 text-[#8B4513] font-black opacity-50">{currentIndex + 1}</div>
                    </div>

                    {/* Right Page */}
                    <div className="flex-1 relative bg-[#F5E6D3] rounded-r-lg shadow-inner-right origin-left border-l border-[#E0D0C0] p-8 md:p-12 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30 pointer-events-none"></div>
                        {rightCreature ? (
                            <BookPage creature={rightCreature} side="right" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-[#8B4513]/30 font-bold italic text-xl">
                                未発見の生物...
                            </div>
                        )}
                        {/* Page Number */}
                        <div className="absolute bottom-6 right-8 text-[#8B4513] font-black opacity-50">{currentIndex + 2}</div>
                    </div>

                    {/* Flip Animation Layer (Overlays) */}
                    {flipping === 'next' && (
                        <div className="absolute right-0 w-1/2 h-full bg-[#EADDCC] rounded-r-lg origin-left animate-flip-next z-20 border-l border-[#D0C0B0]">
                            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30"></div>
                        </div>
                    )}
                    {flipping === 'prev' && (
                        <div className="absolute left-0 w-1/2 h-full bg-[#EADDCC] rounded-l-lg origin-right animate-flip-prev z-20 border-r border-[#D0C0B0]">
                            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30"></div>
                        </div>
                    )}

                    {/* Center Spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none z-30 mix-blend-multiply"></div>
                </div>

                {/* Navigation Controls */}
                {hasPrev && (
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 -left-16 p-4 text-white hover:scale-110 transition-transform hidden md:block"
                    >
                        <ChevronLeft className="w-12 h-12 drop-shadow-lg" />
                    </button>
                )}
                {hasNext && (
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 -right-16 p-4 text-white hover:scale-110 transition-transform hidden md:block"
                    >
                        <ChevronRight className="w-12 h-12 drop-shadow-lg" />
                    </button>
                )}
            </div>

            {/* Mobile Controls */}
            <div className="absolute bottom-8 flex gap-8 md:hidden text-white">
                <button disabled={!hasPrev} onClick={handlePrev} className="disabled:opacity-30 p-2"><ChevronLeft className="w-10 h-10" /></button>
                <button disabled={!hasNext} onClick={handleNext} className="disabled:opacity-30 p-2"><ChevronRight className="w-10 h-10" /></button>
            </div>
        </div>
    );
};

export default RealisticBook;
