import React, { useState, useEffect } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right' | null;

interface DPadProps {
    onDirectionChange: (direction: Direction) => void;
}

const DPad: React.FC<DPadProps> = ({ onDirectionChange }) => {
    const [activeDirection, setActiveDirection] = useState<Direction>(null);

    const handleStart = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (activeDirection !== dir) {
            setActiveDirection(dir);
            onDirectionChange(dir);
        }
    };

    const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (activeDirection !== null) {
            setActiveDirection(null);
            onDirectionChange(null);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let dir: Direction = null;
            switch (e.key) {
                case 'ArrowUp': dir = 'up'; break;
                case 'ArrowDown': dir = 'down'; break;
                case 'ArrowLeft': dir = 'left'; break;
                case 'ArrowRight': dir = 'right'; break;
                default: return;
            }
            if (activeDirection !== dir) {
                setActiveDirection(dir);
                onDirectionChange(dir);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                setActiveDirection(null);
                onDirectionChange(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [activeDirection, onDirectionChange]);

    return (
        <div className="relative w-48 h-48 select-none touch-none scale-90 sm:scale-100">
            {/* Controller Body Background */}
            <div className="absolute inset-2 bg-[#8b0000] rounded-lg shadow-xl border-b-8 border-[#500000] rotate-3 opacity-90"></div>
            <div className="absolute inset-2 bg-[#8b0000] rounded-lg shadow-xl border-b-8 border-[#500000] -rotate-3"></div>

            {/* Gold metallic plate */}
            <div className="absolute inset-4 bg-[#b8860b] opacity-20 rounded border border-[#ffd700]"></div>

            {/* Cross D-Pad Container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36">

                {/* Pad Shadow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black/20 rounded-full blur-md"></div>

                {/* Horizontal Bar */}
                <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 bg-[#222] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] border border-[#000]"></div>
                {/* Vertical Bar */}
                <div className="absolute top-0 left-1/2 h-full w-12 -translate-x-1/2 bg-[#222] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] border border-[#000]"></div>

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#111] shadow-inner"></div>
                </div>

                {/* Direction Buttons (Invisible hitboxes over the visual cross) */}

                {/* Up */}
                <button
                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-14 flex items-start justify-center pt-2 active:brightness-150 transition-all rounded-t-md hover:bg-white/5
                ${activeDirection === 'up' ? 'bg-[#333]' : 'bg-transparent'}
            `}
                    onMouseDown={handleStart('up')} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart('up')} onTouchEnd={handleEnd}
                >
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#444]"></div>
                </button>

                {/* Down */}
                <button
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-14 flex items-end justify-center pb-2 active:brightness-150 transition-all rounded-b-md hover:bg-white/5
                ${activeDirection === 'down' ? 'bg-[#333]' : 'bg-transparent'}
            `}
                    onMouseDown={handleStart('down')} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart('down')} onTouchEnd={handleEnd}
                >
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#444]"></div>
                </button>

                {/* Left */}
                <button
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-14 h-12 flex items-center justify-start pl-2 active:brightness-150 transition-all rounded-l-md hover:bg-white/5
                ${activeDirection === 'left' ? 'bg-[#333]' : 'bg-transparent'}
            `}
                    onMouseDown={handleStart('left')} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart('left')} onTouchEnd={handleEnd}
                >
                    <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[10px] border-t-transparent border-b-transparent border-r-[#444]"></div>
                </button>

                {/* Right */}
                <button
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-14 h-12 flex items-center justify-end pr-2 active:brightness-150 transition-all rounded-r-md hover:bg-white/5
                ${activeDirection === 'right' ? 'bg-[#333]' : 'bg-transparent'}
            `}
                    onMouseDown={handleStart('right')} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={handleStart('right')} onTouchEnd={handleEnd}
                >
                    <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[10px] border-t-transparent border-b-transparent border-l-[#444]"></div>
                </button>
            </div>
        </div>
    );
};

export default DPad;
