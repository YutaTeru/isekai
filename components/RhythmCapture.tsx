import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Creature } from '../types';
import { Heart, Music, Timer, Sparkles, Target } from 'lucide-react';

interface RhythmCaptureProps {
    creature: Creature;
    onCapture: () => void;
    onEscape: () => void;
}

interface Note {
    id: number;
    x: number; // Percentage 0-100
    y: number; // Pixels
    speed: number;
    isHit: boolean;
    type: 'normal' | 'gold';
}

const GAME_DURATION = 15; // seconds
const TARGET_Y_PERCENT = 80; // Target line at 80% screen height
const HIT_WINDOW = 50; // Pixels allowance for hit

const RhythmCapture: React.FC<RhythmCaptureProps> = ({ creature, onCapture, onEscape }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'success' | 'fail'>('ready');
    const [feedback, setFeedback] = useState<{ text: string; color: string; id: number } | null>(null);

    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();
    const nextSpawnTimeRef = useRef<number>(0);
    const scoreRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Target score based on creature rarity/danger (simplified for now)
    const targetScore = 1500;

    const spawnNote = useCallback(() => {
        const isGold = Math.random() < 0.1;
        const note: Note = {
            id: Date.now() + Math.random(),
            x: 20 + Math.random() * 60, // Keep within 20-80% width
            y: -50,
            speed: 3 + Math.random() * 2, // Speed variance
            isHit: false,
            type: isGold ? 'gold' : 'normal'
        };
        setNotes(prev => [...prev, note]);
    }, []);

    const updateGame = useCallback((time: number) => {
        if (gameStatus !== 'playing') return;

        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTime = time - lastTimeRef.current;

        // Spawn Logic
        if (time > nextSpawnTimeRef.current) {
            spawnNote();
            nextSpawnTimeRef.current = time + 600; // Spawn every 600ms
        }

        // Move Notes
        setNotes(prevNotes => {
            const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
            const targetY = containerHeight * (TARGET_Y_PERCENT / 100);

            return prevNotes
                .map(note => ({ ...note, y: note.y + note.speed * (deltaTime / 16) })) // Normalize to 60fps
                .filter(note => {
                    // Remove if went off screen (Miss)
                    if (note.y > containerHeight + 50 && !note.isHit) {
                        setCombo(0);
                        setFeedback({ text: 'MISS...', color: 'text-gray-400', id: Date.now() });
                        return false;
                    }
                    // Remove if hit marked (after animation usually, but simple remove for now)
                    if (note.isHit) return false;

                    return true;
                });
        });

        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameStatus, spawnNote]);

    // Timer
    useEffect(() => {
        if (gameStatus === 'playing') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameStatus('fail');
                        setTimeout(onEscape, 2000);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameStatus, onEscape]);

    // Start Game Loop
    useEffect(() => {
        if (gameStatus === 'playing') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameStatus, updateGame]);

    // Initial countdown
    useEffect(() => {
        setTimeout(() => setGameStatus('playing'), 2000);
    }, []);

    // Win Condition
    useEffect(() => {
        if (score >= targetScore && gameStatus === 'playing') {
            setGameStatus('success');
            setTimeout(onCapture, 1500);
        }
    }, [score, gameStatus, onCapture, targetScore]);

    const handleTap = () => {
        if (gameStatus !== 'playing') return;

        const containerHeight = containerRef.current?.clientHeight || window.innerHeight;
        const targetY = containerHeight * (TARGET_Y_PERCENT / 100);

        setNotes(prev => {
            let hitNoteIndex = -1;
            let minDist = Infinity;

            // Find closest note to target line
            prev.forEach((note, index) => {
                if (note.isHit) return;
                const dist = Math.abs(note.y - targetY);
                if (dist < HIT_WINDOW && dist < minDist) {
                    minDist = dist;
                    hitNoteIndex = index;
                }
            });

            if (hitNoteIndex !== -1) {
                const note = prev[hitNoteIndex];
                const points = note.type === 'gold' ? 500 : 100;
                const newScore = score + points; // Use current score from closure? No, state update better
                setScore(s => s + points);
                setCombo(c => c + 1);

                const rating = minDist < 10 ? 'PERFECT!!' : minDist < 30 ? 'GREAT!' : 'GOOD';
                const color = minDist < 10 ? 'text-pop-yellow' : minDist < 30 ? 'text-pop-green' : 'text-white';
                setFeedback({ text: rating, color, id: Date.now() });

                // Mark as hit (will be removed next frame)
                const newNotes = [...prev];
                newNotes[hitNoteIndex] = { ...note, isHit: true };
                return newNotes;
            } else {
                // Miss tap (penalty?)
                return prev;
            }
        });
    };

    return (
        <div className="absolute inset-0 z-50 overflow-hidden font-maru touch-none select-none" onClick={handleTap} ref={containerRef}>
            {/* Background with Creature Image (Blurred) */}
            <div className="absolute inset-0 z-0">
                <img src={creature.imageUrl} alt="Background" className="w-full h-full object-cover blur-md opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            {/* Clear Creature Image (Centered) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <img
                    src={creature.imageUrl}
                    alt="Target"
                    className={`max-w-[90%] max-h-[60%] object-contain drop-shadow-2xl transition-all duration-500 ${gameStatus === 'success' ? 'scale-110 brightness-110' : 'scale-100'}`}
                />
            </div>

            {/* Game UI */}
            <div className="relative z-10 w-full h-full flex flex-col">

                {/* Header HUD */}
                <div className="flex justify-between items-center p-4">
                    <div className="bg-black/50 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                        <Timer className="w-5 h-5 text-pop-yellow" />
                        <span className="text-xl font-black text-white">{timeLeft}s</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden border border-white/30">
                            <div
                                className="h-full bg-gradient-to-r from-pop-blue to-pop-green transition-all duration-200"
                                style={{ width: `${Math.min(100, (score / targetScore) * 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-white mt-1 shadow-black drop-shadow-md">CAPTURE PROGRESS</span>
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-full border border-white/20 text-right">
                        <span className="text-xl font-black text-pop-green">{score}</span>
                    </div>
                </div>

                {/* Center Feedback Area */}
                <div className="flex-1 relative flex items-center justify-center pointer-events-none">
                    {gameStatus === 'ready' && (
                        <div className="text-6xl font-black text-white animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                            READY?
                        </div>
                    )}
                    {gameStatus === 'success' && (
                        <div className="text-5xl font-black text-pop-yellow animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
                            CAPTURE!!
                        </div>
                    )}
                    {gameStatus === 'fail' && (
                        <div className="text-5xl font-black text-gray-400 animate-pulse">
                            ESCAPE...
                        </div>
                    )}

                    {/* Combo & Feedback */}
                    {feedback && Date.now() - feedback.id < 800 && (
                        <div key={feedback.id} className="absolute top-1/3 flex flex-col items-center animate-in zoom-in slide-in-from-bottom-4 duration-200">
                            <span className={`text-5xl font-black ${feedback.color} drop-shadow-lg italic transform -rotate-6`}>{feedback.text}</span>
                            {combo > 1 && <span className="text-2xl font-bold text-white mt-2">{combo} COMBO!</span>}
                        </div>
                    )}
                </div>

                {/* Target Line Area */}
                <div className="absolute w-full px-4 pointer-events-none" style={{ top: `${TARGET_Y_PERCENT}%` }}>
                    <div className="w-full h-1 bg-white/30 rounded-full relative">
                        <div className="absolute left-0 right-0 -top-6 flex justify-between items-center opacity-50">
                            <Target className="w-8 h-8 text-white/50" />
                            <Target className="w-8 h-8 text-white/50" />
                        </div>
                    </div>
                    <div className="text-center mt-8 text-white/50 text-sm font-bold animate-pulse">
                        TAP RHYTHM!
                    </div>
                </div>

                {/* Falling Notes */}
                {notes.map(note => (
                    <div
                        key={note.id}
                        className="absolute rounded-full shadow-lg border-2 border-white pointer-events-none transition-transform"
                        style={{
                            left: `${note.x}%`,
                            top: note.y,
                            transform: 'translate(-50%, -50%)',
                            width: note.type === 'gold' ? '60px' : '48px',
                            height: note.type === 'gold' ? '60px' : '48px',
                            backgroundColor: note.type === 'gold' ? '#FFD700' : '#FFF',
                        }}
                    >
                        {/* Use creature image as icon or valid fallback */}
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                            {/* Simplified icon for now */}
                            {note.type === 'gold' ? <Sparkles className="w-8 h-8 text-white animate-spin" /> : <Music className="w-6 h-6 text-pop-blue" />}
                        </div>
                    </div>
                ))}

                {/* Tap Button (Invisible full screen overlay logic handles tap, but maybe a visual button at bottom helps?) */}
                {/* We rely on full screen tap, but let's add a visual cue at the bottom */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

            </div>
        </div>
    );
};

export default RhythmCapture;
