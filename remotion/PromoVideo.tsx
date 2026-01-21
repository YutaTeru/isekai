import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, staticFile, Img } from 'remotion';
import { Mail, Camera } from 'lucide-react';

export const PromoVideo: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title Animations
    const titleOpacity = spring({
        frame,
        fps,
        from: 0,
        to: 1,
        config: { damping: 100 }
    });

    const titleScale = spring({
        frame,
        fps,
        from: 0.8,
        to: 1,
        config: { damping: 10 }
    });

    // Scene 2 Animations (Discovery)
    const scene2Frame = frame - 90;
    const bagOpacity = interpolate(scene2Frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const bagScale = interpolate(scene2Frame, [0, 100], [1.1, 1], { extrapolateRight: 'clamp' });

    // Scene 3 Animations (Outro)
    const scene3Frame = frame - 600;
    const outroOpacity = interpolate(scene3Frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    return (
        <AbsoluteFill className="bg-slate-950 text-white font-sans">
            {/* Scene 1: Intro (0-90 frames / 0-3s) */}
            <Sequence durationInFrames={90}>
                <AbsoluteFill className="flex justify-center items-center bg-black">
                    <div className="text-center">
                        <h2
                            style={{ opacity: titleOpacity }}
                            className="text-4xl text-blue-400 font-bold mb-4 tracking-widest"
                        >
                            {subtitle}
                        </h2>
                        <h1
                            style={{
                                opacity: titleOpacity,
                                transform: `scale(${titleScale})`
                            }}
                            className="text-8xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                        >
                            {title}
                        </h1>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 2: Gameplay Teaser (90-600 frames / 3-20s) */}
            <Sequence from={90} durationInFrames={510}>
                <AbsoluteFill className="bg-[#1a1a1a]">
                    {/* Background Image / Mock */}
                    <AbsoluteFill style={{ opacity: bagOpacity }}>
                        <div className="relative w-full h-full overflow-hidden">
                            <Img
                                src={staticFile("image/scene_bag_closed.png")}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: `scale(${bagScale})`
                                }}
                            />

                            {/* Overlay Text */}
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full text-center">
                                <div className="inline-block bg-white/90 text-black px-8 py-4 rounded-full text-3xl font-bold shadow-lg border-4 border-white">
                                    学校の帰り道...
                                </div>
                            </div>

                            {/* Animated Floating Items */}
                            <Sequence from={60}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 text-center animate-bounce">
                                    <Mail size={80} className="text-yellow-400 mx-auto mb-4" />
                                    <p className="text-2xl font-bold">謎の手紙を発見！？</p>
                                </div>
                            </Sequence>
                        </div>
                    </AbsoluteFill>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 3: Outro (600-900 frames / 20-30s) */}
            <Sequence from={600}>
                <AbsoluteFill className="flex justify-center items-center bg-slate-900" style={{ opacity: outroOpacity }}>
                    <div className="text-center space-y-8">
                        <div className="w-40 h-40 bg-blue-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                            <Camera size={80} color="white" />
                        </div>
                        <h2 className="text-6xl font-black">
                            今すぐ<br />観測開始
                        </h2>
                        <p className="text-2xl text-gray-400">
                            君だけの図鑑を作ろう
                        </p>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
