import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { SearchArea, SubAreaSpot } from '../types';
import { Direction } from './DPad';
import { MapPin } from 'lucide-react';

interface GameMapProps {
    currentArea: SearchArea;
    spots: SubAreaSpot[];
    activeDirection: Direction;
    onSpotProximity: (spotId: string | null) => void;
}

const TILE_SIZE = 48; // px
const STEP_DELAY = 150; // ms
const MAP_SIZE_TILES = 25;

// Convert % spots to grid coordinates approximately
const getSpotGridPos = (spot: SubAreaSpot) => ({
    x: Math.floor((spot.x / 100) * MAP_SIZE_TILES),
    y: Math.floor((spot.y / 100) * MAP_SIZE_TILES)
});

const GameMap: React.FC<GameMapProps> = ({ currentArea, spots, activeDirection, onSpotProximity }) => {
    const [gridPos, setGridPos] = useState({ x: 12, y: 12 });
    const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
    const containerRef = useRef<HTMLDivElement>(null);
    const moveInterval = useRef<NodeJS.Timeout | null>(null);

    // Measure container size for clamping
    useLayoutEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    w: containerRef.current.clientWidth,
                    h: containerRef.current.clientHeight
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const mapWidthPx = MAP_SIZE_TILES * TILE_SIZE;
    const mapHeightPx = MAP_SIZE_TILES * TILE_SIZE;

    // --- Logic for Camera & Player Positioning ---
    // Player Position in pixels (relative to Map Top-Left)
    const playerMapX = gridPos.x * TILE_SIZE + TILE_SIZE / 2;
    const playerMapY = gridPos.y * TILE_SIZE + TILE_SIZE / 2;

    // Desired Camera Center = Player Position
    // But we clamp the Camera Center so the Viewport doesn't go outside the Map.
    // "Camera Center" is the point on the Map that will be at the Screen Center.

    // Half Viewport
    const halfVw = containerSize.w / 2;
    const halfVh = containerSize.h / 2;

    // Clamp the "Center Point" of the camera
    // It shouldn't be closer to the left edge than `halfVw` (otherwise void shows on left)
    // It shouldn't be closer to the right edge than `MapWidth - halfVw`
    const minCamX = halfVw;
    const maxCamX = mapWidthPx - halfVw;
    const minCamY = halfVh;
    const maxCamY = mapHeightPx - halfVh;

    // If Map is smaller than Screen, just center it (clamp min=max=center)
    // Logic: confinedCamX is the point on map we effectively focus on.
    let confinedCamX = playerMapX;
    if (mapWidthPx > containerSize.w) {
        confinedCamX = Math.max(minCamX, Math.min(maxCamX, playerMapX));
    } else {
        confinedCamX = mapWidthPx / 2; // Center map if too small
    }

    let confinedCamY = playerMapY;
    if (mapHeightPx > containerSize.h) {
        confinedCamY = Math.max(minCamY, Math.min(maxCamY, playerMapY));
    } else {
        confinedCamY = mapHeightPx / 2;
    }

    // Calculate Transforms
    // Map Layer Transform: Moves the `confinedCam` point to `(0,0)` (relative to Container Center?)
    // If we assume Container Center is the origin for the transform concept:
    // We want `confinedCam` to be at Screen Center.
    // Translate = (MapCenter - confinedCam) ?? 
    // Wait, let's use standard translate:
    // If Translate is (0,0), Map Top-Left is at Container Top-Left.
    // We want `confinedCam` (px from Left) to be at `halfVw` (px from Left).
    // So `0 + Translate + confinedCam = halfVw`.
    // `Translate = halfVw - confinedCam`.
    const mapTranslateX = halfVw - confinedCamX;
    const mapTranslateY = halfVh - confinedCamY;

    // Player Visual Position (Relative to Container Top-Left)
    // Player is at `playerMapX` on the map.
    // ScreenPos = MapOrigin + playerMapX.
    // MapOrigin = `mapTranslateX`. (Assuming absolute top-0 left-0)
    // So `playerScreenX = mapTranslateX + playerMapX`.
    const playerScreenX = mapTranslateX + playerMapX;
    const playerScreenY = mapTranslateY + playerMapY;


    const move = (currentDir: Direction) => {
        setGridPos(prev => {
            let nextX = prev.x;
            let nextY = prev.y;

            switch (currentDir) {
                case 'up': nextY--; break;
                case 'down': nextY++; break;
                case 'left': nextX--; break;
                case 'right': nextX++; break;
                default: return prev;
            }

            // Boundaries
            nextX = Math.max(0, Math.min(MAP_SIZE_TILES - 1, nextX));
            nextY = Math.max(0, Math.min(MAP_SIZE_TILES - 1, nextY));

            return { x: nextX, y: nextY };
        });
    };

    useEffect(() => {
        if (!activeDirection) {
            if (moveInterval.current) {
                clearInterval(moveInterval.current);
                moveInterval.current = null;
            }
            return;
        }

        if (!moveInterval.current) {
            move(activeDirection);
            moveInterval.current = setInterval(() => move(activeDirection), STEP_DELAY);
        }

        // Reset interval on direction change
        if (moveInterval.current) clearInterval(moveInterval.current);
        move(activeDirection);
        moveInterval.current = setInterval(() => move(activeDirection), STEP_DELAY);

        return () => {
            if (moveInterval.current) clearInterval(moveInterval.current);
        };
    }, [activeDirection]);


    // Check Proximity
    useEffect(() => {
        let foundSpecificSpot: string | null = null;

        spots.forEach(spot => {
            const sPos = getSpotGridPos(spot);
            const dist = Math.abs(sPos.x - gridPos.x) + Math.abs(sPos.y - gridPos.y);
            if (dist <= 1.5) {
                foundSpecificSpot = spot.id;
            }
        });

        onSpotProximity(foundSpecificSpot);
    }, [gridPos, spots, onSpotProximity]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#222] select-none touch-none">

            {/* World Layer */}
            <div
                className="absolute top-0 left-0 transition-transform duration-300 ease-linear will-change-transform image-rendering-pixelated"
                style={{
                    transform: `translate3d(${mapTranslateX}px, ${mapTranslateY}px, 0)`,
                    width: `${mapWidthPx}px`,
                    height: `${mapHeightPx}px`,
                    imageRendering: 'pixelated'
                }}
            >
                {/* Map Image */}
                <img
                    src="/bg/pixel_park.png"
                    className="absolute top-0 left-0 w-full h-full object-cover rendering-pixelated"
                    style={{ imageRendering: 'pixelated' }}
                    alt="World Map"
                />

                {/* Spots Markers (Pins) */}
                {spots.map(spot => {
                    const pos = getSpotGridPos(spot);
                    return (
                        <div
                            key={spot.id}
                            className="absolute flex flex-col items-center justify-end -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: pos.x * TILE_SIZE + TILE_SIZE / 2,
                                top: pos.y * TILE_SIZE + TILE_SIZE / 2,
                                width: TILE_SIZE,
                                height: TILE_SIZE
                            }}
                        >
                            <MapPin className="w-8 h-8 text-pop-pink drop-shadow-lg fill-white animate-bounce" strokeWidth={2.5} />
                            <div className="w-4 h-1.5 bg-black/30 rounded-full blur-[2px]"></div>
                        </div>
                    );
                })}
            </div>

            {/* Player Layer (Dynamic Position based on clamping) */}
            <div
                className="absolute z-10 w-12 h-12 flex items-center justify-center pointer-events-none transition-all duration-300 ease-linear"
                style={{
                    left: playerScreenX,
                    top: playerScreenY,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <img
                    src="/char/hero_pixel.png"
                    className={`
                   w-12 h-12 object-contain rendering-pixelated
                   ${activeDirection ? 'animate-bounce-fast' : ''}
               `}
                    style={{
                        imageRendering: 'pixelated'
                        // Removed mixBlendMode as it might look bad on green bg.
                    }}
                    alt="Hero"
                />
            </div>

        </div>
    );
};

export default GameMap;
