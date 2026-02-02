import React from 'react';
import { Creature } from '../types';
import { Star } from 'lucide-react';

interface BookPageProps {
    creature: Creature;
    side: 'left' | 'right';
    isDiscovered: boolean;
}

const BookPage: React.FC<BookPageProps> = ({ creature, side, isDiscovered }) => {

    const displayImage = isDiscovered ? (creature.realImageUrl || creature.imageUrl) : (creature.sketchUrl || creature.imageUrl);
    const displayName = isDiscovered ? creature.name : `${creature.name} (???)`; // Show name even if unknown, to know what to track? Or ???
    // Actually, for a "Target" poster, you usually know the name or alias. I'll add "???" suffix.
    const displayDesc = isDiscovered ? creature.shortDesc : "未確認の生物反応。\n目撃情報を元に作成されたスケッチ。\n特徴と一致する生物を捜索せよ。";

    return (
        <div className={`h-full flex flex-col ${side === 'left' ? 'items-end text-right' : 'items-start text-left'}`}>

            {/* Hand-drawn style Header */}
            <div className="w-full border-b-2 border-[#8B4513]/20 pb-4 mb-6 flex flex-col gap-1">
                <h2 className={`font-handwriting text-3xl md:text-5xl text-[#5D4037] ${side === 'left' ? 'ml-auto' : 'mr-auto'} ${!isDiscovered && 'opacity-70 blur-[1px]'}`}>
                    {displayName}
                </h2>
                <span className="font-serif italic text-[#8B4513]/60 text-sm md:text-base">
                    No. {creature.id} / {isDiscovered ? creature.latinName : 'Unknown Specimen'}
                </span>
            </div>

            {/* Content Layout */}
            <div className={`flex w-full gap-6 h-full ${side === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Image Area (Tape style) */}
                <div className="w-1/2 relative group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-1 shadow-sm backdrop-blur-sm z-10 skew-x-12"></div>
                    <div className={`w-full aspect-[3/4] bg-white p-2 shadow-md rotate-[-1deg] transition-transform duration-500 hover:rotate-0 hover:scale-[1.02] ${!isDiscovered ? 'grayscale sepia contrast-125' : ''}`}>
                        <img
                            src={displayImage}
                            alt={creature.name}
                            className={`w-full h-full object-cover ${!isDiscovered ? 'opacity-80 mix-blend-multiply' : ''}`}
                            loading="lazy"
                            decoding="async"
                        />
                        {/* TARGET Stamp overlay for undiscovered */}
                        {!isDiscovered && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="border-4 border-red-700/80 text-red-700/80 font-black text-4xl -rotate-12 px-4 py-2 uppercase tracking-widest mix-blend-multiply opacity-80" style={{ fontFamily: 'Impact, sans-serif' }}>
                                    TARGET
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stamp Effect (Only if discovered) */}
                    {isDiscovered && (
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 border-4 border-red-800/40 rounded-full flex items-center justify-center rotate-[-15deg] mix-blend-multiply opacity-60">
                            <span className="text-red-800 font-black text-xs uppercase tracking-widest text-center">
                                Pararell<br />Observed
                            </span>
                        </div>
                    )}
                </div>

                {/* Text Area */}
                <div className="w-1/2 flex flex-col gap-4 text-[#4E342E]">
                    <p className={`font-handwriting text-lg md:text-xl leading-relaxed whitespace-pre-wrap flex-1 ${!isDiscovered && 'text-[#8D6E63] italic'}`}>
                        {displayDesc}
                    </p>

                    {/* Info Box */}
                    <div className="bg-[#EFEBE9] p-4 rounded border border-[#D7CCC8]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#8D6E63] w-16">Type</span>
                            <span className="font-serif font-bold">{creature.type}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#8D6E63] w-16">Danger</span>
                            {isDiscovered ? (
                                <div className="flex text-[#FFCA28]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < creature.dangerLevel ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400 font-mono">analyzing...</span>
                            )}
                        </div>
                        {isDiscovered && creature.trivia && creature.trivia.length > 0 ? (
                            <div className="mt-4 pt-4 border-t border-[#D7CCC8] border-dashed">
                                <span className="block text-xs font-bold uppercase tracking-widest text-[#8D6E63] mb-1">Memo</span>
                                <p className="font-handwriting text-sm opacity-80">{creature.trivia[0]}</p>
                            </div>
                        ) : !isDiscovered && (
                            <div className="mt-4 pt-4 border-t border-[#D7CCC8] border-dashed flex items-center justify-center animate-pulse">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#8D6E63]">Searching...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BookPage;
