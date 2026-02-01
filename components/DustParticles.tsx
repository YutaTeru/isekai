import React, { useEffect, useState } from 'react';

const DustParticles: React.FC = () => {
    // Generate random particles
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, size: number, duration: number, delay: number }>>([]);

    useEffect(() => {
        // Client-side only generation to match hydration
        const count = 30;
        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1, // 1px to 4px
            duration: Math.random() * 10 + 10, // 10s to 20s
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {/* Light Shafts (God Rays) */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-white/10 to-transparent opacity-30 rotate-12 blur-3xl pointer-events-none"></div>

            {/* Particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-white opacity-40 shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-float"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`
                    }}
                />
            ))}

            {/* CSS for custom float animation if not in global css */}
            <style>{`
            @keyframes float {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 0.5; }
                50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
                90% { opacity: 0.5; }
                100% { transform: translateY(-40px) translateX(-10px); opacity: 0; }
            }
            .animate-float {
                animation-name: float;
                animation-timing-function: ease-in-out;
                animation-iteration-count: infinite;
            }
        `}</style>
        </div>
    );
};

export default DustParticles;
