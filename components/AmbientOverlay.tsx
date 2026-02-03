import React, { useState, useEffect, useRef } from 'react';
import { Creature } from '../types';
import { CREATURES } from '../constants';
import { Volume2, VolumeX } from 'lucide-react';

interface AmbientOverlayProps {
    discoveredIds: string[];
}

interface WalkingCreature {
    id: number;
    creature: Creature;
    startDelay: number;
    duration: number;
    yPos: number; // % from bottom
    scale: number;
    direction: 'left' | 'right';
}

const AmbientOverlay: React.FC<AmbientOverlayProps> = ({ discoveredIds }) => {
    const [walkers, setWalkers] = useState<WalkingCreature[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Pool of creatures to show: Discovered ones + some common ones
    const availableCreatures = CREATURES.filter(c =>
        discoveredIds.includes(c.id) || c.dangerLevel <= 1
    );

    useEffect(() => {
        // 1. Initial Spawn
        spawnWalker();

        // 2. Interval Spawn
        const interval = setInterval(() => {
            if (Math.random() < 0.4) { // 40% chance every check
                spawnWalker();
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [discoveredIds]);

    // Audio Logic
    useEffect(() => {
        // Attempt to play ambient sound if file exists
        // Using a placeholder path for now
        audioRef.current = new Audio('/audio/ambient_desk.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;

        const playAudio = async () => {
            try {
                if (audioRef.current && !isMuted) {
                    await audioRef.current.play();
                }
            } catch (e) {
                console.log("Audio play failed (autoplay policy or missing file)", e);
            }
        };

        // Interaction usually required for audio, so we might need a start button
        // But for this component, we try.
        document.addEventListener('click', playAudio, { once: true });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            document.removeEventListener('click', playAudio);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isMuted) audioRef.current.pause();
            else audioRef.current.play().catch(e => console.log("Play failed", e));
        }
    }, [isMuted]);

    const spawnWalker = () => {
        if (availableCreatures.length === 0) return;

        const target = availableCreatures[Math.floor(Math.random() * availableCreatures.length)];
        const direction = Math.random() > 0.5 ? 'right' : 'left';

        const newWalker: WalkingCreature = {
            id: Date.now(),
            creature: target,
            startDelay: 0,
            duration: 10 + Math.random() * 10, // 10-20s duration
            yPos: 10 + Math.random() * 20, // 10-30% from bottom
            scale: 0.8 + Math.random() * 0.4, // size variance
            direction
        };

        setWalkers(prev => [...prev, newWalker]);

        // Cleanup after animation
        setTimeout(() => {
            setWalkers(prev => prev.filter(w => w.id !== newWalker.id));
        }, newWalker.duration * 1000 + 100);
    };

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

            {/* Audio Controls (Visible but unobtrusive) */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering other desk interactions if any
                    setIsMuted(!isMuted);
                }}
                className="absolute top-20 right-4 pointer-events-auto p-2 bg-black/20 backdrop-blur-sm rounded-full text-white/50 hover:text-white hover:bg-black/40 transition-all z-50"
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {walkers.map(walker => (
                <div
                    key={walker.id}
                    className="absolute bottom-0 w-24 h-24 transition-transform ease-linear"
                    style={{
                        bottom: `${walker.yPos}%`,
                        left: walker.direction === 'right' ? '-150px' : '100vw',
                        transform: `scale(${walker.scale})`,
                        animation: `walk-${walker.direction} ${walker.duration}s linear forwards`
                    }}
                >
                    {/* Walking Animation Wrapper */}
                    <div className="w-full h-full animate-bounce-gentle">
                        {/* Flip image if walking left */}
                        <img
                            src={walker.creature.imageUrl}
                            alt=""
                            className={`w-full h-full object-contain drop-shadow-lg opacity-90 ${walker.direction === 'left' ? 'scale-x-[-1]' : ''}`}
                        />
                    </div>

                    {/* Simple Shadow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm"></div>
                </div>
            ))}

            <style>{`
        @keyframes walk-right {
          from { transform: translateX(0) scale(var(--tw-scale-x), var(--tw-scale-y)); left: -150px; }
          to { transform: translateX(0) scale(var(--tw-scale-x), var(--tw-scale-y)); left: 100vw; }
        }
        @keyframes walk-left {
            from { transform: translateX(0) scale(var(--tw-scale-x), var(--tw-scale-y)); left: 100vw; }
            to { transform: translateX(0) scale(var(--tw-scale-x), var(--tw-scale-y)); left: -150px; }
        }
        .animate-bounce-gentle {
            animation: bounce-gentle 1s infinite;
        }
        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
};

export default AmbientOverlay;
