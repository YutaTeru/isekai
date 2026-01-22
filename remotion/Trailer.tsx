import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig, Video, Img, staticFile, random } from 'remotion';
import React, { useMemo } from 'react';

// --- CONFIG ---
// Use system heavy fonts for impact
const FONT_FAMILY = '"Arial Black", "Impact", "Hiragino Kaku Gothic Std", "Hiragino Sans", sans-serif';

// --- COMPONENTS ---

// 1. FLASH TRANSITION
// A white flash that fades out quickly. Use at the start of a cut.
const Flash: React.FC<{ duration?: number }> = ({ duration = 5 }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, duration], [1, 0], { extrapolateRight: 'clamp' });
    return <AbsoluteFill style={{ backgroundColor: 'white', opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }} />;
};

// 2. CINEMATIC TEXT
// Huge, slam effect, tracking
const CinematicText: React.FC<{
    text: string;
    color?: string;
    subText?: string;
    align?: 'center' | 'left' | 'right';
}> = ({ text, color = 'white', subText, align = 'center' }) => {
    const frame = useCurrentFrame();
    const config = useVideoConfig();

    // Slam effect: Starts huge and transparent, slams down to normal size
    const scale = interpolate(frame, [0, 5, 40], [3, 1, 1.05], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
    const blur = interpolate(frame, [0, 5], [20, 0], { extrapolateRight: 'clamp' });

    // Shake effect on impact
    const shakeX = frame < 5 ? (random(frame) - 0.5) * 40 : 0;
    const shakeY = frame < 5 ? (random(frame + 1) - 0.5) * 40 : 0;

    return (
        <AbsoluteFill style={{
            justifyContent: 'center',
            alignItems: align === 'center' ? 'center' : (align === 'left' ? 'flex-start' : 'flex-end'),
            padding: '40px'
        }}>
            <div style={{
                transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
                opacity,
                filter: `blur(${blur}px)`,
                textAlign: align,
            }}>
                <h1 style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: '140px',
                    fontWeight: 900,
                    color: color,
                    lineHeight: 0.9,
                    margin: 0,
                    textTransform: 'uppercase',
                    textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    letterSpacing: '-0.05em'
                }}>
                    {text}
                </h1>
                {subText && (
                    <h2 style={{
                        fontFamily: FONT_FAMILY,
                        fontSize: '40px',
                        color: 'rgba(255,255,255,0.8)',
                        letterSpacing: '0.4em',
                        marginTop: '10px',
                        fontWeight: 700
                    }}>
                        {subText}
                    </h2>
                )}
            </div>
        </AbsoluteFill>
    );
};

// 3. DYNAMIC CLIP
// Handles the video with Cinematic Grading and Movement
const DynamicClip: React.FC<{
    src: string;
    duration: number;
    effect?: 'zoomIn' | 'zoomOut' | 'pan';
    intensity?: number;
}> = ({ src, duration, effect = 'zoomIn', intensity = 1 }) => {
    const frame = useCurrentFrame();
    const config = useVideoConfig();

    const scale = useMemo(() => {
        if (effect === 'zoomIn') return interpolate(frame, [0, duration], [1.1, 1.3]);
        if (effect === 'zoomOut') return interpolate(frame, [0, duration], [1.4, 1.1]);
        return 1.2; // default
    }, [frame, duration, effect]);

    const translate = useMemo(() => {
        if (effect === 'pan') return interpolate(frame, [0, duration], [-50, 50]);
        return 0;
    }, [frame, duration, effect]);

    return (
        <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
            <Video
                src={src}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale}) translateX(${translate}px)`,
                    // CINEMATIC GRADING: High contrast, desaturated cooler look
                    filter: `
                        contrast(1.2) 
                        saturate(0.8) 
                        brightness(1.1) 
                        sepia(0.2) 
                        hue-rotate(190deg)
                    `
                }}
            />
        </AbsoluteFill>
    );
};

// 4. GLITCH OVERLAY
const GlitchOverlay = () => {
    const frame = useCurrentFrame();
    // Random glitch appearing occasionally
    const isGlitch = random(frame) > 0.9; // 10% chance per frame to glitch

    if (!isGlitch) return null;

    const top = random(frame + 10) * 100;
    const height = random(frame + 20) * 20;

    return (
        <div style={{
            position: 'absolute',
            top: `${top}%`,
            left: 0,
            width: '100%',
            height: `${height}px`,
            background: 'rgba(255, 255, 255, 0.2)',
            mixBlendMode: 'difference',
            zIndex: 90
        }} />
    );
}


// --- MAIN TRAILER ---

export const Trailer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#050505' }}>

            {/* --- ACT 1: THE HOOK (0 - 4s) --- */}
            {/* Fast cuts setting the scene */}
            <Sequence from={0} durationInFrames={60}>
                <DynamicClip src={staticFile("/video/clip1.mp4")} duration={60} effect="zoomIn" />
                <CinematicText text="WARNING" color="#FF3333" subText="UNKNOWN SIGNAL DETECTED" />
                <GlitchOverlay />
            </Sequence>

            <Sequence from={60} durationInFrames={40}>
                <DynamicClip src={staticFile("/video/clip2.mp4")} duration={40} effect="pan" />
                <Flash duration={4} />
            </Sequence>

            <Sequence from={100} durationInFrames={50}>
                <DynamicClip src={staticFile("/video/clip3.mp4")} duration={50} effect="zoomOut" />
                <CinematicText text="異世界" subText="PARALLEL WORLD" />
                <Flash duration={5} />
            </Sequence>

            {/* --- ACT 2: RISING TENSION (5s - 15s) --- */}

            <Sequence from={150} durationInFrames={60}>
                <DynamicClip src={staticFile("/video/clip4.mp4")} duration={60} effect="zoomIn" />
                <Flash duration={8} />
                <CinematicText text="観測" subText="OBSERVATION" align="left" />
            </Sequence>

            <Sequence from={210} durationInFrames={60}>
                <DynamicClip src={staticFile("/video/clip5.mp4")} duration={60} effect="zoomOut" />
                <Flash duration={4} />
                {/* No text, just visual */}
            </Sequence>

            <Sequence from={270} durationInFrames={40}>
                <DynamicClip src={staticFile("/video/clip1.mp4")} duration={40} effect="zoomIn" />
                <CinematicText text="開始" subText="START" align="right" />
                <Flash duration={2} />
            </Sequence>

            {/* --- ACT 3: CHAOS MONTAGE (Rapid Fire) (10.3s - 13s) --- */}

            {[
                { src: "/video/clip2.mp4", start: 310 },
                { src: "/video/clip3.mp4", start: 325 },
                { src: "/video/clip4.mp4", start: 340 },
                { src: "/video/clip5.mp4", start: 355 },
                { src: "/video/clip1.mp4", start: 370 },
            ].map((clip, i) => (
                <Sequence key={i} from={clip.start} durationInFrames={15}>
                    <DynamicClip src={staticFile(clip.src)} duration={15} effect={i % 2 === 0 ? "zoomIn" : "zoomOut"} />
                    <Flash duration={3} />
                    <GlitchOverlay />
                </Sequence>
            ))}

            {/* --- ACT 4: THE REVEAL (13s - End) --- */}

            {/* Blackout pause for impact */}
            <Sequence from={385} durationInFrames={30}>
                <AbsoluteFill style={{ backgroundColor: 'black' }} />
            </Sequence>

            {/* Key Visual Reveal */}
            <Sequence from={415} durationInFrames={485}> {/* Extending to fill 30s (900f) */}
                <AbsoluteFill style={{ backgroundColor: 'black' }}>
                    <Img
                        src={staticFile("/image/title_key_visual.png")}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.6,
                            transform: 'scale(1.1)', // Subtle slow zoom could be added here
                        }}
                    />
                    {/* Final Title */}
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{
                                fontFamily: FONT_FAMILY,
                                fontSize: '80px',
                                color: 'white',
                                marginBottom: '20px',
                                letterSpacing: '0.1em',
                                textShadow: '0 0 40px rgba(255,255,255,0.5)'
                            }}>
                                異世界<br />観測ログ
                            </h1>
                            <div style={{
                                display: 'inline-block',
                                padding: '10px 40px',
                                border: '4px solid white',
                                fontSize: '30px',
                                fontWeight: 'bold',
                                color: 'white',
                                fontFamily: FONT_FAMILY
                            }}>
                                CHECK NOW
                            </div>
                        </div>
                    </AbsoluteFill>
                </AbsoluteFill>
                <Flash duration={20} />
            </Sequence>

            {/* Global Overlay: Film Grain & Letterbox */}
            <AbsoluteFill style={{ pointerEvents: 'none' }}>
                {/* Grain */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`, // Fallback or local noise
                    opacity: 0.15,
                    mixBlendMode: 'overlay'
                }} />
                {/* Letterbox Bars */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '180px', background: 'black' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', background: 'black' }} />
            </AbsoluteFill>

        </AbsoluteFill>
    );
};
