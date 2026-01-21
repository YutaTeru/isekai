import React, { useState, useMemo, useEffect } from 'react';
import { Search, Heart, Leaf, Star, Cloud, Waves, Trees, Footprints, Sun, Moon, Sunrise, Sunset, MapPin, Home, BookOpen, UserCircle2, Sparkles, Radar, ScanLine, Camera, X, Box } from 'lucide-react';
import { CREATURES, APP_NAME, ITEMS } from './constants';
import { Creature, CreatureType, SearchArea, TimeOfDay, SubAreaSpot, Item, SearchPhase } from './types';
import CreatureCard from './components/CreatureCard';
import CreatureDetailModal from './components/CreatureDetailModal';
import BottomNav from './components/BottomNav';
import Prologue from './components/Prologue';
import GameMap from './components/GameMap';
import DPad, { Direction } from './components/DPad';

// --- DATA DEFINITIONS ---

const SEARCH_AREAS: SearchArea[] = [
  {
    id: 'park',
    label: '公園エリア',
    type: CreatureType.Park,
    icon: Trees,
    color: 'bg-[#C8E6C9] text-[#2E7D32] border-[#4CAF50]',
    description: '多くの生物が観測される基本エリア。遊具周辺は要チェック。',
    bgImage: '/bg/park.png',
    mapImage: '/bg/park_map_highres.png',
    fpsImage: '/bg/park_fps.png'
  },
  {
    id: 'garden',
    label: '庭・路地裏',
    type: CreatureType.Garden,
    icon: Footprints,
    color: 'bg-[#FFECB3] text-[#F57F17] border-[#FFC107]',
    description: '物陰に潜む小型生物が多い。隙間や影を調査せよ。',
    bgImage: '/bg/garden.png',
    mapImage: '/bg/garden_map_highres.png',
    fpsImage: '/bg/garden_fps.png'
  },
  {
    id: 'water',
    label: '水辺・川',
    type: CreatureType.Water,
    icon: Waves,
    color: 'bg-[#E1F5FE] text-[#0277BD] border-[#29B6F6]',
    description: '水棲生物の生息域。水面の波紋や湿った場所を探れ。',
    bgImage: '/bg/water.png',
    mapImage: '/bg/water_map_highres.png',
    fpsImage: '/bg/water_fps.png'
  },
  {
    id: 'house',
    label: '屋内・家',
    type: CreatureType.House,
    icon: Home,
    color: 'bg-[#E1BEE7] text-[#7B1FA2] border-[#9C27B0]',
    description: '人工物に擬態する生物が生息。家具や家電製品の裏側など。',
    bgImage: '/bg/house.png',
    mapImage: '/bg/house_map_highres.png',
    fpsImage: '/bg/house_fps.png'
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

  // BIG 3 FEATURES STATE
  const [buddy, setBuddy] = useState<Creature | null>(null);
  const [showNews, setShowNews] = useState(false);
  const [newsMessage, setNewsMessage] = useState<{ title: string, content: string } | null>(null);
  const [lastLogin, setLastLogin] = useState<number>(() => {
    const stored = localStorage.getItem('lastLoginTime');
    return stored ? parseInt(stored) : Date.now();
  });

  const [currentTime, setCurrentTime] = useState<TimeOfDay>(getCurrentTimeOfDay());

  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [activeArea, setActiveArea] = useState<SearchArea | null>(null);
  const [activeSubAreaId, setActiveSubAreaId] = useState<string | null>(null);

  const [searchPhase, setSearchPhase] = useState<SearchPhase>('idle');
  const [activeDirection, setActiveDirection] = useState<Direction>(null);
  const [nearbySpotId, setNearbySpotId] = useState<string | null>(null);
  const [foundCreature, setFoundCreature] = useState<Creature | null>(null);
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [showInventory, setShowInventory] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  // --- LOGIN BONUS & NEWS LOGIC ---
  useEffect(() => {
    // 1. Check Login Bonus (1 hour cooldown)
    const now = Date.now();
    const diffHours = (now - lastLogin) / (1000 * 60 * 60);

    if (diffHours >= 1) {
      // Drop logic
      const chance = buddy ? 0.8 : 0.3; // High chance if buddy exists
      if (Math.random() < chance) {
        const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setInventory(prev => [...prev, randomItem]);
        // Show Dialog (Using News State for simplicity or alert)
        setTimeout(() => {
          alert(buddy
            ? `相棒の ${buddy.name} が ${randomItem.name} を拾ってきた！`
            : `おや？ ${randomItem.name} が落ちている...`
          );
        }, 1000);
      }
      localStorage.setItem('lastLoginTime', now.toString());
      setLastLogin(now);
    }

    // 2. Generate Daily News
    const generateNews = () => {
      const types: ('forecast' | 'trivia' | 'advice')[] = ['forecast', 'trivia', 'advice'];
      const type = types[Math.floor(Math.random() * types.length)];

      // Define titles inside the function or typed properly
      let title = '観測ログ';
      let content = '';

      if (type === 'forecast') {
        title = 'バイオ予報';
        content = `本日は「${currentTime}」の観測が推奨されます。`;
      } else if (type === 'trivia' && buddy) {
        title = '相棒の呟き';
        content = buddy.trivia[Math.floor(Math.random() * buddy.trivia.length)];
      } else if (type === 'trivia') {
        // Random discovered creature
        const targetId = discoveredIds.length > 0 ? discoveredIds[Math.floor(Math.random() * discoveredIds.length)] : CREATURES[0].id;
        const target = CREATURES.find(c => c.id === targetId);
        title = '豆知識';
        content = target ? target.trivia[Math.floor(Math.random() * target.trivia.length)] : '観察を続けることで新たな発見があるだろう。';
      } else {
        title = '博士の助言';
        content = 'アイテムは相棒に与えることで、より深い絆が生まれるぞ。';
      }
      setNewsMessage({ title, content });
      setShowNews(true);
    };

    generateNews();

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
  }, []); // Run on mount (and logically dep check but omitting for "On Mount" logic)

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

  // --- BUDDY & INVENTORY LOGIC ---

  const handleSetBuddy = (creature: Creature) => {
    // If not already buddy, set as buddy and init syncRate if undefined (though defined in constant)
    const newBuddy = { ...creature, role: 'buddy', syncRate: creature.syncRate || 0 };
    setBuddy(newBuddy as Creature);
    // Also update in master list if we were tracking individual instances, but here state is simple
    alert(`${creature.name} を相棒に設定しました！`);
  };

  const updateSyncRate = (amount: number) => {
    if (!buddy) return;
    setBuddy(prev => {
      if (!prev) return null;
      const newRate = Math.min(100, (prev.syncRate || 0) + amount);
      // Evolution check placeholder
      if (prev.syncRate < 100 && newRate >= 100) {
        setTimeout(() => alert(`⚡ ${prev.name} との絆が MAX になった！ ⚡`), 500);
      }
      return { ...prev, syncRate: newRate };
    });
  };

  const handleBuddyInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buddy) return;
    const hearts = ['❤️', '💖', '🎵', '✨'];
    const reaction = hearts[Math.floor(Math.random() * hearts.length)];
    // Visual feedback handled by alert for now, can be improved
    // Increase sync rate by small amount with cooldown (omitted cooldown for simplicity)
    updateSyncRate(1);
    // alert(`${buddy.name}は嬉しそうだ！ ${reaction}`); // Optional: too many alerts is annoying
  };

  const handleUseItem = (item: Item) => {
    if (!buddy) {
      alert("相棒がいません。まずは相棒を決めよう！");
      return;
    }

    // Consume item
    const index = inventory.findIndex(i => i.id === item.id);
    if (index > -1) {
      const newInv = [...inventory];
      newInv.splice(index, 1);
      setInventory(newInv);

      // Apply Effect
      updateSyncRate(item.effectValue);
      alert(`${buddy.name} に ${item.name} をあげた！\nシンクロ率が ${item.effectValue} 上がった！`);
    }
  };

  const startExploration = (area: SearchArea) => {
    setActiveArea(area);
    setActiveSubAreaId(null);
    setFoundCreature(null);
    setSearchPhase('walking');
    setActiveDirection(null);
    setNearbySpotId(null);
  };

  const handleSpotClick = (spot: SubAreaSpot) => {
    setActiveSubAreaId(spot.id);
    setSearchPhase('scanning');

    // Transition to Aiming after 2 seconds
    setTimeout(() => {
      setSearchPhase('aiming');
    }, 2000);
  };

  const handleShutterClick = () => {
    const areaCreatures = CREATURES.filter(c => c.type === activeArea?.type);
    let candidates = areaCreatures.filter(c =>
      c.activeTime.includes(currentTime) || c.activeTime.includes(TimeOfDay.Any)
    );

    if (candidates.length === 0) candidates = areaCreatures;
    if (candidates.length === 0) candidates = CREATURES;

    const randomCreature = candidates[Math.floor(Math.random() * candidates.length)];

    // 33% Chance to find creature
    const isSuccess = Math.random() < 0.33;

    if (isSuccess) {
      // Success: Creature Found
      setFoundCreature(randomCreature);
      setFoundItem(null);
      if (!discoveredIds.includes(randomCreature.id)) {
        setDiscoveredIds(prev => [...prev, randomCreature.id]);
      }
    } else {
      // Failure: Item Found
      const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      setFoundItem(randomItem);
      setFoundCreature(null);
      setInventory(prev => [...prev, randomItem]);
    }

    setSearchPhase('result');
  };

  const closeSearch = () => {
    setSearchPhase('idle');
    setActiveSubAreaId(null);
    setFoundCreature(null);
    setFoundItem(null);
  };

  const quitExploration = () => {
    setSearchPhase('idle');
    setActiveArea(null);
    setActiveSubAreaId(null);
    setFoundCreature(null);
    setFoundItem(null);
  }

  const handleActionButtonClick = () => {
    if (activeArea && nearbySpotId) {
      const spots = AREA_SPOTS[activeArea.id] || [];
      const spot = spots.find(s => s.id === nearbySpotId);
      if (spot) {
        handleSpotClick(spot);
      }
    }
  };

  const renderMapOverlay = () => {
    if (!activeArea) return null;
    const spots = AREA_SPOTS[activeArea.id] || [];

    return (
      <div className="fixed inset-0 z-40 bg-black font-dot select-none touch-none overflow-hidden">

        {/* Game Area */}
        <GameMap
          currentArea={activeArea}
          spots={spots} // Pass all spots directly
          activeDirection={activeDirection}
          onSpotProximity={setNearbySpotId}
        />

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pb-8 pt-safe">

          {/* Top Bar - Retro Message Style */}
          <div className="pointer-events-auto flex items-start justify-between">
            <div className="bg-black/80 text-white border-2 border-white rounded p-4 font-dot text-lg leading-relaxed shadow-lg max-w-[70%]">
              <p>{activeArea.label} に 到着した！</p>
              <p className="text-sm text-gray-300 mt-1">
                <timeConfig.icon className="inline w-3 h-3 mr-1" />
                {timeConfig.label} の 時間 だ。
              </p>
            </div>

            <button onClick={quitExploration} className="bg-gray-200 border-b-4 border-gray-400 p-2 rounded active:border-b-0 active:translate-y-1 text-black font-black text-xs hover:bg-white transition-all">
              中止
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="relative h-64 pointer-events-auto flex items-end justify-between px-2 sm:px-10 pb-4">

            {/* D-Pad Area */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <DPad onDirectionChange={setActiveDirection} />
            </div>

            {/* Status Message (Center Bottom) */}
            {nearbySpotId && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-32 animate-bounce">
                <div className="bg-black/90 text-white border-2 border-white px-4 py-2 rounded font-dot text-center">
                  <span className="text-yellow-400">!</span> なにか あるぞ <span className="text-yellow-400">!</span>
                </div>
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white mx-auto"></div>
              </div>
            )}

            {/* Action Button Area (Famicom Style A Button) */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              <div className={`
                         relative group
                        ${nearbySpotId ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'}
                     `}>
                {/* Button Label */}
                <span className="absolute -bottom-8 right-0 text-white font-black text-xl italic drop-shadow-md">A</span>

                <button
                  onClick={handleActionButtonClick}
                  disabled={!nearbySpotId}
                  className={`
                                w-20 h-20 rounded-full bg-[#cc0000] border-b-8 border-[#8b0000] shadow-xl active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center relative
                                ${nearbySpotId ? 'animate-pulse' : ''}
                            `}
                >
                  <span className="text-white/20 font-black text-sm">PUSH</span>
                </button>
              </div>
            </div>
          </div>
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
        backgroundImage: `url('/image/home_bg_desk.png')`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
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

            {/* NEWS SECTION (Digital Style) */}
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

            {/* BUDDY DISPLAY (If exists) */}
            {buddy && (
              <div
                className="mb-6 relative group cursor-pointer"
                onClick={handleBuddyInteraction}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pop-pink/20 to-pop-blue/20 rounded-3xl blur-xl animate-pulse"></div>
                <div className="relative bg-white/80 backdrop-blur border-2 border-white rounded-3xl p-4 flex items-center gap-4 shadow-sm hover:scale-[1.02] transition-transform">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                      <img src={buddy.imageUrl} className="w-full h-full object-cover" alt={buddy.name} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-pop-yellow text-white p-1 rounded-full border-2 border-white shadow-sm">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-black text-kids-text">{buddy.name}</h3>
                      <span className="text-xs font-bold text-pop-pink bg-pop-pink/10 px-2 py-0.5 rounded-full">相棒</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mb-2">{buddy.perk}</p>
                    {/* Sync Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pop-pink to-pop-purple transition-all duration-500"
                        style={{ width: `${buddy.syncRate || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bag Button (Inside Buddy Card) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInventory(true);
                    }}
                    className="ml-2 p-3 bg-white border-2 border-dashed border-pop-blue rounded-xl text-pop-blue hover:bg-pop-blue hover:text-white transition-all shadow-sm"
                    title="アイテムを使う"
                  >
                    <Box className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* If no buddy, show suggestion or just empty space? Maybe a bag button anyway? */}
            {!buddy && inventory.length > 0 && (
              <button
                onClick={() => setShowInventory(true)}
                className="mb-6 w-full py-3 bg-white border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Box className="w-5 h-5" />
                所持アイテムを確認する ({inventory.length})
              </button>
            )}

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
                    bgImage: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop',
                    mapImage: '/bg/park_map_highres.png', // Fallback
                    fpsImage: '/bg/park_fps.png' // Fallback
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

      {/* === SEARCH OVERLAY (Scanning / Aiming / Result) === */}
      {(searchPhase === 'scanning' || searchPhase === 'aiming' || searchPhase === 'result') && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 font-maru overflow-hidden">

          {/* BACKGROUND LAYER (Persists for Aiming and Result) */}
          {(searchPhase === 'aiming' || searchPhase === 'result') && activeArea && (
            <div className="absolute inset-0 z-0">
              <img
                src={activeArea.fpsImage}
                alt="Background"
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          )}

          {/* Dark Backdrop (Lighter for Aiming/Result to show context) */}
          <div className={`absolute inset-0 transition-colors duration-500 z-0 ${(searchPhase === 'aiming' || searchPhase === 'result') ? 'bg-black/20' : 'bg-black/90 backdrop-blur-md'}`}></div>


          {/* 1. SCANNING PHASE */}
          {searchPhase === 'scanning' && (
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
              <h2 className="text-3xl font-black text-white mb-2 animate-pulse tracking-widest">
                ん！？
              </h2>
              <p className="text-pop-green font-bold text-lg animate-bounce">
                何か動いた気がする……！！
              </p>
            </div>
          )}

          {/* 2. AIMING PHASE */}
          {searchPhase === 'aiming' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">

              {/* Camera HUD Image */}
              <img
                src="/image/camera_hud.png"
                alt="HUD"
                className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none z-10 mix-blend-screen"
              />

              {/* Target Animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-32 h-32 border-4 border-red-500/50 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce border-2 border-red-500">
                  <span className="text-4xl text-white drop-shadow-md">!</span>
                </div>
              </div>

              <div className="absolute top-24 text-center animate-pulse z-20">
                <p className="text-red-500 font-black text-2xl tracking-widest bg-black/60 px-6 py-2 rounded border border-red-500/50">TARGET LOCKED</p>
              </div>

              {/* Shutter Button */}
              <button
                onClick={handleShutterClick}
                className="absolute bottom-12 w-24 h-24 rounded-full border-4 border-white bg-red-600 shadow-[0_0_30px_rgba(255,0,0,0.6)] active:scale-95 transition-transform flex items-center justify-center z-50 group hover:bg-red-500 hover:scale-105"
              >
                <Camera className="w-10 h-10 text-white fill-current" />
              </button>
            </div>
          )}

          {/* 3. RESULT PHASE */}
          {searchPhase === 'result' && (
            <div className="relative z-50 max-w-sm w-full animate-in zoom-in-50 duration-500 p-4">
              {/* SUCCESS: CREATURE FOUND */}
              {foundCreature && (
                <>
                  <div className="absolute -top-20 -left-20 text-pop-yellow animate-bounce delay-100"><Star className="w-10 h-10 fill-current" /></div>
                  <div className="absolute -top-10 -right-10 text-pop-pink animate-bounce delay-200"><Heart className="w-8 h-8 fill-current" /></div>

                  <div className="bg-white p-2 rounded-3xl shadow-2xl rotate-1 border-4 border-white">
                    <div className="bg-stripes p-6 rounded-[20px] flex flex-col items-center text-center border-2 border-gray-100">
                      <div className="mb-4 relative">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pop-pink text-white px-6 py-2 rounded-full font-black text-xl shadow-pop border-2 border-white whitespace-nowrap z-20 animate-bounce">
                          生物発見！
                        </span>
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
                        <button onClick={() => { closeSearch(); setSelectedCreature(foundCreature); }} className="flex-1 bg-pop-blue text-white py-3 rounded-xl font-black shadow-pop hover:translate-y-1 transition-all border-2 border-pop-blue">詳細を確認</button>
                        <button onClick={closeSearch} className="flex-1 bg-white text-gray-500 border-2 border-gray-200 py-3 rounded-xl font-black hover:bg-gray-50">閉じる</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* FAILURE: ITEM FOUND */}
              {foundItem && (
                <>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-gray-400 font-bold animate-pulse text-xl whitespace-nowrap">Escaped...</div>
                  <div className="bg-white/90 p-2 rounded-3xl shadow-2xl -rotate-1 border-4 border-gray-300 mt-8">
                    <div className="bg-gray-50 p-6 rounded-[20px] flex flex-col items-center text-center border-2 border-gray-200">
                      <div className="mb-4 relative">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded-full font-black text-sm shadow-sm border-2 border-white whitespace-nowrap z-20">
                          何か落ちている...
                        </span>
                        <div className="w-32 h-32 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center text-6xl shadow-inner">
                          {foundItem.icon}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-xl font-black text-gray-700 mb-1">{foundItem.name}</h3>
                        <p className="text-xs font-bold text-gray-500">{foundItem.description}</p>
                      </div>

                      <button onClick={closeSearch} className="w-full bg-gray-200 text-gray-600 py-3 rounded-xl font-black hover:bg-gray-300 transition-colors">
                        ポケットに入れる
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeArea && (searchPhase === 'walking' || searchPhase === 'idle') && renderMapOverlay()}

      {!activeArea && <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />}

      <CreatureDetailModal
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
        isFavorite={selectedCreature ? favorites.includes(selectedCreature.id) : false}
        onToggleFavorite={toggleFavorite}
        userName={userName}
        onSetBuddy={handleSetBuddy}
        buddyId={buddy ? buddy.id : null}
      />

      {/* Inventory Modal */}
      {showInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in text-left">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 border-4 border-white relative font-maru">
            <button
              onClick={() => setShowInventory(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-kids-text mb-4 flex items-center gap-2">
              <Box className="w-6 h-6 text-pop-blue" />
              バッグ
            </h2>

            {inventory.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                <p>からっぽ</p>
                <p className="text-xs mt-1">探索してアイテムを探そう</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {inventory.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                    <div className="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-lg shadow-sm">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                    </div>
                    <button
                      onClick={() => handleUseItem(item)}
                      className="bg-pop-blue text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm ml-2 shrink-0"
                    >
                      わたす
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 px-4">
                アイテムを相棒にあげると、シンクロ率が上がります。ログインボーナスや探索中に見つかることがあります。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;