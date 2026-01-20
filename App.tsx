import React, { useState, useMemo, useEffect } from 'react';
import { Search, Heart, Leaf, Star, Cloud, Waves, Trees, Footprints, Sun, Moon, Sunrise, Sunset, MapPin, Home, BookOpen, UserCircle2, Sparkles, Radar, ScanLine } from 'lucide-react';
import { CREATURES, APP_NAME } from './constants';
import { Creature, CreatureType, SearchArea, TimeOfDay, SubAreaSpot } from './types';
import CreatureCard from './components/CreatureCard';
import CreatureDetailModal from './components/CreatureDetailModal';
import BottomNav from './components/BottomNav';
import Prologue from './components/Prologue';

// --- DATA DEFINITIONS ---

const SEARCH_AREAS: SearchArea[] = [
  {
    id: 'park',
    label: '公園エリア',
    type: CreatureType.Park,
    icon: Trees,
    color: 'bg-[#C8E6C9] text-[#2E7D32] border-[#4CAF50]',
    description: '多くの生物が観測される基本エリア。遊具周辺は要チェック。',
    bgImage: '/bg/park.png'
  },
  {
    id: 'garden',
    label: '庭・路地裏',
    type: CreatureType.Garden,
    icon: Footprints,
    color: 'bg-[#FFECB3] text-[#F57F17] border-[#FFC107]',
    description: '物陰に潜む小型生物が多い。隙間や影を調査せよ。',
    bgImage: '/bg/garden.png'
  },
  {
    id: 'water',
    label: '水辺・川',
    type: CreatureType.Water,
    icon: Waves,
    color: 'bg-[#E1F5FE] text-[#0277BD] border-[#29B6F6]',
    description: '水棲生物の生息域。水面の波紋や湿った場所を探れ。',
    bgImage: '/bg/water.png'
  },
  {
    id: 'house',
    label: '屋内・家',
    type: CreatureType.House,
    icon: Home,
    color: 'bg-[#E1BEE7] text-[#7B1FA2] border-[#9C27B0]',
    description: '人工物に擬態する生物が生息。家具や家電製品の裏側など。',
    bgImage: '/bg/house.png'
  },
];

// Define Sub-Area Spots for each Area
const AREA_SPOTS: Record<string, SubAreaSpot[]> = {
  park: [
    { id: 'slide', label: '滑り台', x: 25, y: 35, icon: MapPin, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
    { id: 'sandbox', label: '砂場', x: 75, y: 65, icon: MapPin, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'lamp', label: '街灯', x: 85, y: 25, icon: Sun, activeTimes: [TimeOfDay.Sunset, TimeOfDay.Night] },
    { id: 'bush', label: '茂み', x: 20, y: 80, icon: Leaf, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day, TimeOfDay.Night] },
  ],
  garden: [
    { id: 'flowerpot', label: '植木鉢', x: 30, y: 70, icon: Leaf, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
    { id: 'wall', label: 'ブロック塀', x: 50, y: 40, icon: MapPin, activeTimes: [TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'shadow', label: '建物の影', x: 80, y: 80, icon: Footprints, activeTimes: [TimeOfDay.Sunset, TimeOfDay.Night] },
    { id: 'acunit', label: '室外機', x: 20, y: 20, icon: MapPin, activeTimes: [TimeOfDay.Night, TimeOfDay.Morning] },
  ],
  water: [
    { id: 'lilypad', label: '蓮の葉', x: 20, y: 70, icon: Leaf, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
    { id: 'waterfall', label: '小さな滝', x: 50, y: 20, icon: Waves, activeTimes: [TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'bridge', label: '木の橋', x: 80, y: 40, icon: MapPin, activeTimes: [TimeOfDay.Sunset, TimeOfDay.Night] },
    { id: 'shore', label: '岸辺', x: 30, y: 40, icon: Footprints, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
  ],
  house: [
    { id: 'bookshelf', label: '本棚', x: 20, y: 30, icon: MapPin, activeTimes: [TimeOfDay.Night, TimeOfDay.Any] },
    { id: 'router', label: 'Wi-Fiルーター', x: 80, y: 70, icon: Sun, activeTimes: [TimeOfDay.Any] },
    { id: 'sofa', label: 'ソファー', x: 40, y: 80, icon: MapPin, activeTimes: [TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'window', label: '窓際', x: 70, y: 20, icon: Sun, activeTimes: [TimeOfDay.Morning] },
  ],
  mystery: [
    { id: 'fog', label: '濃霧地帯', x: 50, y: 50, icon: Cloud, activeTimes: [TimeOfDay.Morning] },
  ]
};

const CATEGORIES = ['すべて', ...Object.values(CreatureType)];

const getCurrentTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return TimeOfDay.Morning;
  if (hour >= 10 && hour < 16) return TimeOfDay.Day;
  if (hour >= 16 && hour < 19) return TimeOfDay.Sunset;
  return TimeOfDay.Night;
};

const getTimeConfig = (time: TimeOfDay) => {
  switch (time) {
    case TimeOfDay.Morning: return { icon: Sunrise, label: '早朝', color: 'text-pop-blue', bgOverlay: 'bg-yellow-100/10' };
    case TimeOfDay.Day: return { icon: Sun, label: '日中', color: 'text-pop-yellow', bgOverlay: 'bg-white/0' };
    case TimeOfDay.Sunset: return { icon: Sunset, label: '夕暮れ', color: 'text-pop-pink', bgOverlay: 'bg-orange-500/20 mix-blend-overlay' };
    case TimeOfDay.Night: return { icon: Moon, label: '深夜', color: 'text-pop-purple', bgOverlay: 'bg-indigo-900/40' };
    default: return { icon: Sun, label: '不明', color: 'text-gray-500', bgOverlay: 'bg-white/10' };
  }
};

function App() {
  const [showPrologue, setShowPrologue] = useState(true);
  const [userName, setUserName] = useState('調査員');
  const [currentTab, setCurrentTab] = useState('explore');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [currentTime, setCurrentTime] = useState<TimeOfDay>(getCurrentTimeOfDay());

  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [activeArea, setActiveArea] = useState<SearchArea | null>(null);
  const [activeSubAreaId, setActiveSubAreaId] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [foundCreature, setFoundCreature] = useState<Creature | null>(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeOfDay());
    }, 60000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const timeConfig = getTimeConfig(currentTime);

  const filteredCreatures = useMemo(() => {
    return CREATURES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.latinName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'すべて' || c.type === activeCategory;
      const matchesTab = currentTab === 'journal' ? favorites.includes(c.id) : true;

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [searchQuery, activeCategory, currentTab, favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleCreatureClick = (creature: Creature) => {
    if (!discoveredIds.includes(creature.id)) return;
    setSelectedCreature(creature);
  };

  const discoveryRate = Math.round((discoveredIds.length / CREATURES.length) * 100);

  const startExploration = (area: SearchArea) => {
    setActiveArea(area);
    setActiveSubAreaId(null);
    setFoundCreature(null);
  };

  const handleSpotClick = (spot: SubAreaSpot) => {
    setActiveSubAreaId(spot.id);
    setIsSearching(true);

    const areaCreatures = CREATURES.filter(c => c.type === activeArea?.type);

    let candidates = areaCreatures.filter(c =>
      c.activeTime.includes(currentTime) || c.activeTime.includes(TimeOfDay.Any)
    );

    if (candidates.length === 0) {
      candidates = areaCreatures;
    }
    if (candidates.length === 0) {
      candidates = CREATURES;
    }

    const randomCreature = candidates[Math.floor(Math.random() * candidates.length)];

    setTimeout(() => {
      setFoundCreature(randomCreature);
      if (!discoveredIds.includes(randomCreature.id)) {
        setDiscoveredIds(prev => [...prev, randomCreature.id]);
      }
    }, 2500);
  };

  const closeSearch = () => {
    setIsSearching(false);
    setActiveSubAreaId(null);
    setFoundCreature(null);
  };

  const quitExploration = () => {
    setIsSearching(false);
    setActiveArea(null);
    setActiveSubAreaId(null);
    setFoundCreature(null);
  }

  const renderMapOverlay = () => {
    if (!activeArea) return null;
    const spots = AREA_SPOTS[activeArea.id] || [];

    return (
      <div className="fixed inset-0 z-40 bg-[#f9f9f9] font-maru">
        {/* Header - Fixed Overlay */}
        <div className="fixed top-0 left-0 right-0 z-50 p-4 pt-safe pointer-events-none">
          <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border-2 border-white pointer-events-auto p-2">
            <div className="flex items-center gap-3 pl-2">
              <button onClick={quitExploration} className="p-2 bg-white rounded-full hover:bg-gray-100 text-kids-text transition-colors shadow-sm border border-gray-200">
                <Search className="w-6 h-6" />
              </button>
              <div className="text-kids-text">
                <h2 className="font-bold text-xl leading-tight">
                  {activeArea.label}
                </h2>
                <div className="flex items-center gap-1 text-sm font-bold opacity-80 bg-white/50 px-2 rounded-full inline-flex">
                  <timeConfig.icon className={`w-4 h-4 ${timeConfig.color}`} />
                  <span>現在時刻：{timeConfig.label}</span>
                </div>
              </div>
            </div>
            <div className="bg-pop-green text-white border-2 border-white text-sm px-4 py-1.5 rounded-full font-black shadow-pop animate-pulse mr-1">
              スキャン中...
            </div>
          </div>
        </div>

        {/* Scrollable Map Content */}
        <div className="absolute inset-0 overflow-auto flex justify-center items-center">
          <div className="relative shrink-0 shadow-2xl">
            <img
              src={activeArea.bgImage}
              alt={activeArea.label}
              className="block max-w-none h-[100vh] w-auto object-contain"
              style={{ minHeight: '600px' }}
            />

            {/* Spots Overlay */}
            <div className="absolute inset-0">
              {spots.map((spot) => {
                const isActive = spot.activeTimes.includes(currentTime) || spot.activeTimes.includes(TimeOfDay.Any);
                return (
                  <button
                    key={spot.id}
                    onClick={() => isActive && handleSpotClick(spot)}
                    disabled={!isActive}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className={`
                       absolute -translate-x-1/2 flex flex-col items-center transition-all duration-300 group
                       ${isActive
                        ? 'cursor-pointer z-10 hover:-translate-y-2'
                        : 'opacity-40 grayscale cursor-not-allowed z-0'
                      }
                     `}
                  >
                    {/* Pin Shadow */}
                    <div className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full blur-sm transition-all
                        ${isActive ? 'bg-black/30' : 'bg-black/10'}
                      `}></div>

                    {/* Pin Body */}
                    <div className="relative flex flex-col items-center">
                      {/* Pin Head (Circle) */}
                      <div className={`
                            relative w-12 h-12 rounded-full flex items-center justify-center border-[3px] shadow-lg transition-transform duration-300
                            ${isActive
                          ? 'bg-pop-pink border-white text-white'
                          : 'bg-gray-400 border-gray-300 text-gray-200'
                        }
                         `}>
                        <spot.icon className="w-6 h-6" strokeWidth={2.5} />

                        {isActive && (
                          <span className="absolute -inset-1 rounded-full border-2 border-pop-yellow opacity-75 animate-ping"></span>
                        )}
                      </div>

                      {/* Pin Point (Triangle) */}
                      <div className={`
                            w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] -mt-1
                            ${isActive
                          ? 'border-l-transparent border-r-transparent border-t-pop-pink'
                          : 'border-l-transparent border-r-transparent border-t-gray-400'
                        }
                         `}></div>
                    </div>

                    {/* Label */}
                    <span className={`
                         mt-1 text-xs font-black px-3 py-1 rounded-full whitespace-nowrap shadow-md transition-colors border-2
                         ${isActive
                        ? 'bg-white text-kids-text border-pop-pink'
                        : 'bg-gray-200 text-gray-400 border-gray-300'
                      }
                    `}>
                      {spot.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>


        <div className="p-6 relative z-10 flex justify-center pb-10 pointer-events-none">
          <button
            onClick={quitExploration}
            className="pointer-events-auto bg-white text-kids-text font-black py-4 px-10 rounded-full shadow-pop hover:scale-105 hover:bg-gray-50 transition-all border-4 border-kids-text"
          >
            調査を中断
          </button>
        </div>
      </div >
    );
  };

  // --- RENDER ---

  if (showPrologue) {
    return <Prologue onComplete={(name) => {
      setUserName(name);
      setShowPrologue(false);
    }} />;
  }

  return (
    <div
      className="min-h-screen font-maru pb-32 overflow-x-hidden relative transition-colors duration-1000"
      style={{
        backgroundImage: `url('/bg/home_pattern.png')`,
        backgroundSize: '500px',
        backgroundRepeat: 'repeat'
      }}
    >

      {/* Header */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${scrolled
          ? 'glass-panel py-2 rounded-b-3xl shadow-sm mx-2'
          : 'bg-white/80 backdrop-blur-sm py-4 border-b-2 border-dashed border-gray-200'
          }`}
      >
        <div className="container mx-auto px-4 max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-pop overflow-hidden">
              <img src="/char/explorer.png" alt="Explorer" className="w-full h-full object-cover transform scale-110" />
            </div>
            <div>
              <h1 className="font-black text-xl text-kids-text tracking-wide drop-shadow-sm">
                {APP_NAME}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                  <span className="bg-white px-2 py-0.5 rounded-full shadow-sm">観測進捗</span>
                </div>
                <div className="w-24 h-4 bg-white rounded-full overflow-hidden border-2 border-gray-100">
                  <div
                    className="h-full bg-pop-green transition-all duration-1000 rounded-full"
                    style={{ width: `${Math.max(5, discoveryRate)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-black text-pop-green">{discoveryRate}%</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border-2 border-pop-blue">
              <UserCircle2 className="w-5 h-5 text-pop-blue" />
              <span className="text-sm font-bold text-kids-text">{userName} 調査員</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl mt-6 relative z-10">

        {/* === EXPLORE TAB === */}
        {currentTab === 'explore' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6 py-6 relative bg-white/50 rounded-3xl border-2 border-white shadow-inner">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pop-yellow text-white px-4 py-1 rounded-full font-black text-sm shadow-sm border-2 border-white whitespace-nowrap">
                現在の時刻：<timeConfig.icon className="inline w-4 h-4 mb-1 mx-1" />{timeConfig.label}
              </div>
              <h2 className="text-2xl font-black text-kids-text mb-2 mt-2">探索エリアを選択</h2>
              <p className="text-gray-500 font-bold text-sm">
                地図を解析し、生物の生息反応を探知してください。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SEARCH_AREAS.map((area) => (
                <button
                  key={area.id}
                  onClick={() => startExploration(area)}
                  className={`
                    relative overflow-hidden group p-4 rounded-3xl border-4 bg-white shadow-pop hover:shadow-pop-hover hover:translate-y-1 transition-all duration-200 text-left
                    ${area.color.split(' ')[2]}
                  `}
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
                  startExploration({
                    id: 'mystery',
                    label: '？？？',
                    type: CreatureType.Mystery,
                    icon: Star,
                    color: 'bg-slate-800 text-white border-slate-600',
                    description: '詳細不明。高レベルの観測技術が必要。',
                    bgImage: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop'
                  })
                }}
                className="relative overflow-hidden group p-4 rounded-3xl border-4 border-pop-purple bg-[#240046] text-white shadow-pop hover:shadow-pop-hover hover:translate-y-1 transition-all duration-200 text-left col-span-1 sm:col-span-2"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-pop-purple shadow-sm border-2 border-white text-white">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black mb-1">未確認エリア</h3>
                    <p className="text-xs font-bold opacity-80 text-purple-200">強力な生体反応あり。警戒せよ。</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* === GALLERY TAB === */}
        {currentTab === 'gallery' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-pop-blue" />
              </div>
              <input
                type="text"
                placeholder="生物名で検索..."
                className="w-full pl-12 pr-4 py-4 bg-white border-4 border-pastel-blue rounded-full text-kids-text placeholder-gray-400 focus:outline-none focus:border-pop-blue transition-all shadow-sm font-bold text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 px-1 scrollbar-hide justify-start md:justify-center">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded-full text-sm font-black transition-all duration-200 border-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[2px]
                    ${activeCategory === cat
                      ? 'bg-pop-blue text-white border-pop-blue'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 pb-4 px-2">
              {filteredCreatures.map((creature) => (
                <CreatureCard
                  key={creature.id}
                  creature={creature}
                  onClick={handleCreatureClick}
                  isLocked={!discoveredIds.includes(creature.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* === FAVORITES TAB (Journal) === */}
        {currentTab === 'journal' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-6 shadow-card border-4 border-pop-pink mb-6 relative overflow-hidden min-h-[60vh] bg-stripes">

              <div className="relative z-10 flex items-center gap-4 mb-8 pb-4 border-b-2 border-dashed border-pop-pink/30">
                <div className="p-3 bg-pop-pink text-white rounded-full shadow-sm border-4 border-white">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-pop-pink mb-1 drop-shadow-sm">観測記録</h2>
                  <p className="text-gray-400 text-sm font-bold">保存された生物データ</p>
                </div>
              </div>

              {filteredCreatures.length > 0 ? (
                <div className="space-y-4">
                  {filteredCreatures.map(creature => (
                    <div
                      key={creature.id}
                      onClick={() => handleCreatureClick(creature)}
                      className="flex items-center bg-white rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-transform group shadow-sm border-2 border-gray-100 hover:border-pop-blue"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 mr-4 shrink-0 bg-gray-50">
                        <img
                          src={creature.imageUrl}
                          alt={creature.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-kids-text text-lg mb-1 truncate">{creature.name}</h4>
                        <div className="flex gap-1">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {creature.type}
                          </span>
                        </div>
                      </div>
                      <Heart className="w-6 h-6 text-pop-pink fill-current mr-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="font-black text-gray-400 mb-2">データが存在しません</p>
                  <p className="text-sm text-gray-400 font-bold">お気に入り登録した生物がここに表示されます。</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {activeArea && !foundCreature && !isSearching && renderMapOverlay()}

      {/* === SEARCHING/FOUND OVERLAY (Radar & Reward) === */}
      {(isSearching || foundCreature) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 font-maru">

          {!foundCreature ? (
            <div className="flex flex-col items-center text-center w-full">
              <div className="relative w-72 h-72 flex items-center justify-center mb-8">
                {/* Radar Circles */}
                <div className="absolute inset-0 border-4 border-pop-green/30 rounded-full animate-ping delay-75"></div>
                <div className="absolute inset-0 border-4 border-pop-green/50 rounded-full animate-ping delay-500"></div>
                <div className="absolute inset-8 border-4 border-dashed border-pop-green/40 rounded-full animate-spin-slow"></div>

                <div className="relative bg-black rounded-full p-1 border-4 border-pop-green shadow-[0_0_30px_rgba(6,214,160,0.5)]">
                  <div className="w-48 h-48 bg-gray-900 rounded-full flex items-center justify-center overflow-hidden relative">
                    {/* Scanning Line */}
                    <div className="absolute w-full h-1/2 bg-gradient-to-b from-transparent to-pop-green/50 top-0 left-0 origin-bottom animate-spin"></div>
                    <Radar className="w-24 h-24 text-pop-green relative z-10" />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-black text-white mb-2 animate-pulse tracking-widest">
                スキャン中...
              </h2>
              <p className="text-pop-green font-bold text-lg">
                生体反応を感知。捕捉しています。
              </p>
            </div>
          ) : (
            <div className="relative max-w-sm w-full animate-in zoom-in-50 duration-500">
              {/* Confetti / Sparkles */}
              <div className="absolute -top-20 -left-20 text-pop-yellow animate-bounce delay-100"><Star className="w-10 h-10 fill-current" /></div>
              <div className="absolute -top-10 -right-10 text-pop-pink animate-bounce delay-200"><Heart className="w-8 h-8 fill-current" /></div>
              <div className="absolute bottom-10 -right-10 text-pop-blue animate-bounce delay-300"><Star className="w-12 h-12 fill-current" /></div>

              <div className="bg-white p-2 rounded-3xl shadow-2xl rotate-1 border-4 border-white">
                <div className="bg-stripes p-6 rounded-[20px] flex flex-col items-center text-center border-2 border-gray-100">

                  <div className="mb-4 relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pop-pink text-white px-6 py-2 rounded-full font-black text-xl shadow-pop border-2 border-white whitespace-nowrap z-20 animate-bounce">
                      生物発見！
                    </span>
                    <div className="w-48 h-48 bg-white rounded-2xl border-4 border-pop-yellow shadow-sm overflow-hidden relative rotate-[-2deg]">
                      <img
                        src={foundCreature.imageUrl}
                        className="w-full h-full object-cover"
                        alt={foundCreature.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="mb-6 w-full">
                    <h3 className="text-2xl font-black text-kids-text mb-2">{foundCreature.name}</h3>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(foundCreature.dangerLevel)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-pop-yellow text-pop-yellow" />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-gray-400 bg-gray-100 rounded-full inline-block px-3 py-1">
                      レア度
                    </p>
                  </div>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        closeSearch();
                        setSelectedCreature(foundCreature);
                      }}
                      className="flex-1 bg-pop-blue text-white py-3 rounded-xl font-black shadow-pop hover:translate-y-1 hover:shadow-none transition-all border-2 border-pop-blue"
                    >
                      詳細を確認
                    </button>
                    <button
                      onClick={closeSearch}
                      className="flex-1 bg-white text-gray-500 border-2 border-gray-200 py-3 rounded-xl font-black hover:bg-gray-50 transition-colors"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!activeArea && <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />}

      <CreatureDetailModal
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
        isFavorite={selectedCreature ? favorites.includes(selectedCreature.id) : false}
        onToggleFavorite={toggleFavorite}
        userName={userName}
      />
    </div>
  );
}

export default App;