import React, { useState, useEffect, useRef } from 'react';
import { Creature, CreatureType, SearchArea, SubAreaSpot, Item, SearchPhase, MapNode, TimeOfDay } from '../types';
import { SEARCH_AREAS, AREA_SPOTS, CREATURES, ITEMS } from '../constants';
import { Radar, X, Heart, Box, ScanLine, Star, Sparkles, MapPin, Camera, Footprints } from 'lucide-react';
import BuddyView from './BuddyView';
import AmidakujiView from './AmidakujiView';

interface NewsMessage {
    title: string;
    content: string;
}

interface ExplorationViewProps {
    showNews: boolean;
    setShowNews: (show: boolean) => void;
    newsMessage: NewsMessage | null;
    buddy: Creature | null;
    inventory: Item[];
    setShowInventory: (show: boolean) => void;
    timeConfig: { label: string; icon: any };
    handleBuddyInteraction: (e: React.MouseEvent) => void;
    setShowBook: (show: boolean) => void;
    discoveredIds: string[];
    setDiscoveredIds: React.Dispatch<React.SetStateAction<string[]>>;
    setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
    onCreatureClick: (creature: Creature) => void;
    userName: string;
    // Lifted State Props
    activeArea: SearchArea | null;
    onAreaSelect: (area: SearchArea | null) => void;
}

type ExplorationPhase = 'amida' | 'scanning' | 'aiming' | 'result' | 'idle';

const ExplorationView: React.FC<ExplorationViewProps> = ({
    showNews,
    setShowNews,
    newsMessage,
    buddy,
    inventory,
    setShowInventory,
    timeConfig,
    handleBuddyInteraction,
    setShowBook,
    discoveredIds,
    setDiscoveredIds,
    setInventory,
    onCreatureClick,
    activeArea,
    onAreaSelect
}) => {
    const [phase, setPhase] = useState<ExplorationPhase>('idle');
    const [foundCreature, setFoundCreature] = useState<Creature | null>(null);
    const [foundItem, setFoundItem] = useState<Item | null>(null);

    // Initial Start
    const startExploration = (area: SearchArea) => {
        onAreaSelect(area);
        setPhase('amida');
        setFoundCreature(null);
        setFoundItem(null);
    };

    const quitExploration = () => {
        setPhase('idle');
        onAreaSelect(null);
        setFoundCreature(null);
        setFoundItem(null);
    };

    const handleAmidaComplete = (reward: { type: 'creature' | 'item' | 'empty'; data?: any }) => {
        if (reward.type === 'empty') {
            alert("何もいなかった……。\n（お散歩終了）");
            quitExploration();
            return;
        }

        // Delay for dramatic effect
        setTimeout(() => {
            if (reward.type === 'creature') {
                const c = reward.data as Creature;
                setFoundCreature(c);
                setPhase('scanning');
                // Trigger auto-aim
                setTimeout(() => {
                    setPhase('aiming');
                }, 1500);
            } else if (reward.type === 'item') {
                const i = reward.data as Item;
                setFoundItem(i);
                setInventory(prev => [...prev, i]);
                setPhase('result');
            }
        }, 500);
    };

    const handleShutterClick = () => {
        // Success capture
        if (foundCreature) {
            if (!discoveredIds.includes(foundCreature.id)) {
                setDiscoveredIds(prev => [...prev, foundCreature.id]);
            }
        }
        setPhase('result');
    };

    const closeSearch = () => {
        setPhase('idle');
        onAreaSelect(null); // Return to home
        setFoundCreature(null);
        setFoundItem(null);
    };

    if (activeArea) {
        return (
            <div className="fixed inset-0 z-40 bg-black font-dot select-none touch-none overflow-hidden">

                {/* AMIDA VIEW */}
                {phase === 'amida' && (
                    <AmidakujiView
                        areaId={activeArea.id}
                        onComplete={handleAmidaComplete}
                        onClose={quitExploration}
                    />
                )}

                {/* EXISTING SCAN/RESULT VIEWS */}
                {(phase === 'scanning' || phase === 'aiming' || phase === 'result') && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center font-maru overflow-hidden">
                        {(phase === 'aiming' || phase === 'result') && (
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-black"></div>
                                <img src={activeArea.fpsImage} alt="Background" className="w-full h-full object-cover scale-110" />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                        )}

                        <div className={`absolute inset-0 transition-colors duration-500 z-0 ${(phase === 'aiming' || phase === 'result') ? 'bg-black/20' : 'bg-black'}`}></div>

                        {phase === 'scanning' && (
                            <div className="relative z-10 flex flex-col items-center text-center w-full">
                                <div className="relative w-72 h-72 flex items-center justify-center mb-8">
                                    <div className="absolute inset-0 border-4 border-pop-green/30 rounded-full animate-ping delay-75"></div>
                                    <div className="absolute inset-0 border-4 border-pop-green/50 rounded-full animate-ping delay-500"></div>
                                    <div className="absolute inset-8 border-4 border-dashed border-pop-green/40 rounded-full animate-spin-slow"></div>
                                    <div className="relative bg-black rounded-full p-1 border-4 border-pop-green shadow-[0_0_30px_rgba(6,214,160,0.5)]">
                                        <div className="w-48 h-48 bg-gray-900 rounded-full flex items-center justify-center overflow-hidden relative">
                                            <div className="absolute w-full h-1/2 bg-gradient-to-b from-transparent to-pop-green/50 top-0 left-0 origin-bottom animate-spin"></div>
                                            <Radar className="w-24 h-24 text-pop-green relative z-10" />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2 animate-pulse tracking-widest">接近中！</h2>
                                <p className="text-pop-green font-bold text-lg animate-bounce">ターゲット捕捉……</p>
                            </div>
                        )}

                        {phase === 'aiming' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <img src="/image/camera_hud.png" alt="HUD" className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none z-10 mix-blend-screen" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                    <div className="w-32 h-32 border-4 border-red-500/50 rounded-full animate-ping absolute inset-0"></div>
                                    <div className="w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce border-2 border-red-500">
                                        <span className="text-4xl text-white drop-shadow-md">!</span>
                                    </div>
                                </div>
                                <div className="absolute top-24 text-center animate-pulse z-20">
                                    <p className="text-red-500 font-black text-2xl tracking-widest bg-black/60 px-6 py-2 rounded border border-red-500/50">TARGET LOCKED</p>
                                </div>
                                <button
                                    onClick={handleShutterClick}
                                    className="absolute bottom-12 w-24 h-24 rounded-full border-4 border-white bg-red-600 shadow-[0_0_30px_rgba(255,0,0,0.6)] active:scale-95 transition-transform flex items-center justify-center z-50 group hover:bg-red-500 hover:scale-105"
                                >
                                    <Camera className="w-10 h-10 text-white fill-current" />
                                </button>
                            </div>
                        )}

                        {phase === 'result' && (
                            <div className="relative z-50 max-w-sm w-full animate-in zoom-in-50 duration-500 p-4">
                                {foundCreature && (
                                    <>
                                        <div className="absolute -top-20 -left-20 text-pop-yellow animate-bounce delay-100"><Star className="w-10 h-10 fill-current" /></div>
                                        <div className="absolute -top-10 -right-10 text-pop-pink animate-bounce delay-200"><Heart className="w-8 h-8 fill-current" /></div>
                                        <div className="bg-white p-2 rounded-3xl shadow-2xl rotate-1 border-4 border-white">
                                            <div className="bg-stripes p-6 rounded-[20px] flex flex-col items-center text-center border-2 border-gray-100">
                                                <div className="mb-4 relative">
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pop-pink text-white px-6 py-2 rounded-full font-black text-xl shadow-pop border-2 border-white whitespace-nowrap z-20 animate-bounce">生物発見！</span>
                                                    <div className="w-48 h-48 bg-white rounded-2xl border-4 border-pop-yellow shadow-sm overflow-hidden relative rotate-[-2deg]">
                                                        <img src={foundCreature.imageUrl} className="w-full h-full object-cover" alt={foundCreature.name} />
                                                    </div>
                                                </div>
                                                <div className="mb-6 w-full">
                                                    <h3 className="text-2xl font-black text-kids-text mb-2">{foundCreature.name}</h3>
                                                    <div className="flex justify-center gap-1 mb-2">
                                                        {[...Array(foundCreature.dangerLevel)].map((_, i) => (
                                                            <Star key={i} className="w-5 h-5 fill-pop-yellow text-pop-yellow" />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-400 bg-gray-100 rounded-full inline-block px-3 py-1">レア度</p>
                                                </div>
                                                <div className="flex gap-3 w-full">
                                                    <button onClick={() => { closeSearch(); onCreatureClick(foundCreature); }} className="flex-1 bg-pop-blue text-white py-3 rounded-xl font-black shadow-pop hover:translate-y-1 transition-all border-2 border-pop-blue">詳細を確認</button>
                                                    <button onClick={closeSearch} className="flex-1 bg-white text-gray-500 border-2 border-gray-200 py-3 rounded-xl font-black hover:bg-gray-50">閉じる</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {foundItem && (
                                    <>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-gray-400 font-bold animate-pulse text-xl whitespace-nowrap">Escaped...</div>
                                        <div className="bg-white/90 p-2 rounded-3xl shadow-2xl -rotate-1 border-4 border-gray-300 mt-8">
                                            <div className="bg-gray-50 p-6 rounded-[20px] flex flex-col items-center text-center border-2 border-gray-200">
                                                <div className="mb-4 relative">
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full font-black text-sm shadow-sm border-2 border-white whitespace-nowrap z-20">何か落ちている...</span>
                                                    <div className="w-32 h-32 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center text-6xl shadow-inner">
                                                        {foundItem.icon}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <h3 className="text-xl font-black text-gray-700 mb-1">{foundItem.name}</h3>
                                                    <p className="text-xs font-bold text-gray-500">{foundItem.description}</p>
                                                </div>
                                                <button onClick={closeSearch} className="w-full bg-gray-200 text-gray-600 py-3 rounded-xl font-black hover:bg-gray-300 transition-colors">ポケットに入れる</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {showNews && newsMessage && (
                <div className="mb-6 bg-slate-800 rounded-xl p-1 border-l-4 border-pop-green shadow-lg">
                    <div className="bg-slate-900/50 p-3 rounded-lg flex items-start gap-3">
                        <div className="mt-1 animate-pulse">
                            <Radar className="w-5 h-5 text-pop-green" />
                        </div>
                        <div>
                            <h4 className="text-xs font-mono text-pop-green mb-1 flex items-center gap-2">
                                {newsMessage.title} <span className="text-[10px] opacity-50">{new Date().toLocaleDateString()}</span>
                            </h4>
                            <p className="text-sm font-bold text-white leading-relaxed font-dot">
                                {newsMessage.content}
                            </p>
                        </div>
                        <button onClick={() => setShowNews(false)} className="text-slate-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <BuddyView
                buddy={buddy}
                onBuddyInteraction={handleBuddyInteraction}
                onOpenInventory={(e) => { e.stopPropagation(); setShowInventory(true); }}
            />

            {!buddy && inventory.length > 0 && (
                <button
                    onClick={() => setShowInventory(true)}
                    className="mb-6 w-full py-3 bg-white border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                    <Box className="w-5 h-5" />
                    所持アイテムを確認する ({inventory.length})
                </button>
            )}

            <div className="text-center mb-6 pt-10 pb-6 relative bg-white/50 rounded-3xl border-2 border-white shadow-inner">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pop-yellow text-white px-6 py-2 rounded-full font-black text-base shadow-sm border-2 border-white whitespace-nowrap z-10">
                    現在の時刻：<timeConfig.icon className="inline w-5 h-5 mb-1 mx-1" />{timeConfig.label}
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-kids-text mb-3 mt-4 tracking-wider">探索エリアを選択</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEARCH_AREAS.map((area) => (
                    <button
                        key={area.id}
                        onClick={() => startExploration(area)}
                        className={`relative overflow-hidden group p-4 rounded-3xl border-4 bg-white shadow-pop hover:shadow-pop-hover hover:translate-y-1 transition-all duration-200 text-left ${area.color.split(' ')[2]}`}
                    >
                        <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <img src={area.bgImage} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center bg-white shadow-sm border-2 ${area.color.split(' ')[2]} ${area.color.split(' ')[1]}`}>
                                <area.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black mb-1 text-kids-text">{area.label}</h3>
                                <p className="text-xs font-bold opacity-70 text-gray-600 line-clamp-2">{area.description}</p>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 shadow-sm text-pop-blue">
                                <ScanLine className="w-5 h-5" />
                            </div>
                        </div>
                    </button>
                ))}

                <button
                    onClick={() => {
                        // Mystery logic removed for brevity or kept same as original if needed
                        // Keeping simple for now
                        alert("このエリアはまだ解放されていません。\n（解放条件：生物を5種類発見）");
                    }}
                    className={`relative overflow-hidden group p-4 rounded-3xl border-4 shadow-pop transition-all duration-200 text-left col-span-1 sm:col-span-2 border-gray-500 bg-gray-800 text-gray-400 grayscale cursor-not-allowed`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
                    <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                        <div className="bg-gray-900 border-2 border-gray-500 px-4 py-2 rounded-xl flex items-center gap-2">
                            <span className="text-2xl">🔒</span>
                            <span className="font-bold text-sm">LOCKED (要:発見5種)</span>
                        </div>
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white bg-gray-700 text-gray-500`}>
                            <Sparkles className={`w-8 h-8 text-gray-500`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black mb-1">未確認エリア</h3>
                            <p className="text-xs font-bold opacity-80">強力な生体反応あり。警戒せよ。</p>
                        </div>
                    </div>
                </button>
            </div>


        </div>
    );
};

export default ExplorationView;
