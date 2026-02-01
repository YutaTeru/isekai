import React, { useState, useEffect } from 'react';
import { UserCircle2, Sun, Moon, Sunrise, Sunset, Book } from 'lucide-react';
import { CREATURES, APP_NAME, ITEMS, SEARCH_AREAS } from './constants';
import { Creature, TimeOfDay, Item, SearchArea, NewsData } from './types';
import { UNCLE_MESSAGES, UncleMessage } from './data/uncleMessages';
import CreatureDetailModal from './components/CreatureDetailModal';
import BottomNav from './components/BottomNav';
import Prologue from './components/Prologue';
import RealisticBook from './components/RealisticBook';
import TitleScreen from './components/TitleScreen';
import UncleMessageModal from './components/UncleMessageModal';
import IntroStoryModal from './components/IntroStoryModal';

// Views
import ExplorationView from './components/ExplorationView';
import GalleryView from './components/GalleryView';
import JournalView from './components/JournalView';
import InventoryModal from './components/InventoryModal';

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
  const [showTitle, setShowTitle] = useState(true);
  const [showIntroStory, setShowIntroStory] = useState(false);
  const [showPrologue, setShowPrologue] = useState(false);
  const [userName, setUserName] = useState('調査員');
  const [currentTab, setCurrentTab] = useState('explore');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Lifted State for ExplorationView
  const [activeArea, setActiveArea] = useState<SearchArea | null>(null);

  // Features State
  const [buddy, setBuddy] = useState<Creature | null>(null);
  const [showNews, setShowNews] = useState(false);
  const [newsMessage, setNewsMessage] = useState<NewsData | null>(null);
  const [lastLogin, setLastLogin] = useState<number>(() => {
    const stored = localStorage.getItem('lastLoginTime');
    return stored ? parseInt(stored) : Date.now();
  });

  const [currentTime, setCurrentTime] = useState<TimeOfDay>(getCurrentTimeOfDay());
  const [discoveredIds, setDiscoveredIds] = useState<string[]>(['011', '012', '013']);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- LOGIN BONUS & NEWS LOGIC ---
  useEffect(() => {
    const now = Date.now();
    const diffHours = (now - lastLogin) / (1000 * 60 * 60);

    if (diffHours >= 1) {
      const chance = buddy ? 0.8 : 0.3;
      if (Math.random() < chance) {
        const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setInventory(prev => [...prev, randomItem]);
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

    const checkAndGenerateNews = () => {
      const today = new Date().toISOString().split('T')[0];
      const storedNewsJson = localStorage.getItem(`news_${today}`);

      if (storedNewsJson) {
        setNewsMessage(JSON.parse(storedNewsJson));
        setShowNews(true);
        return;
      }

      // Generate New News
      const types: ('forecast' | 'trivia' | 'advice' | 'lucky')[] = ['forecast', 'trivia', 'advice', 'lucky'];
      // Increase probability of 'forecast' or 'lucky' if not seen recently? Random for now.
      const type = types[Math.floor(Math.random() * types.length)];
      let title = '観測ログ';
      let content = '';
      let luckyItemId: string | undefined;
      let bonusAreaId: string | undefined;

      if (type === 'forecast') {
        const area = SEARCH_AREAS[Math.floor(Math.random() * SEARCH_AREAS.length)];
        title = 'バイオ予報';
        content = `本日は「${area.label}」での観測により、レア生物発見の可能性が高まっています。`;
        bonusAreaId = area.id;
      } else if (type === 'lucky') {
        const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        title = 'ラッキーアイテム';
        content = `本日のラッキーアイテムは「${item.name}」です。所持していると良いことがあるかもしれません。`;
        luckyItemId = item.id;
      } else if (type === 'trivia') {
        const targetId = discoveredIds.length > 0 ? discoveredIds[Math.floor(Math.random() * discoveredIds.length)] : CREATURES[0].id;
        const target = CREATURES.find(c => c.id === targetId);
        title = '豆知識';
        content = target ? target.trivia[Math.floor(Math.random() * target.trivia.length)] : '観察を続けることで新たな発見があるだろう。';
      } else {
        title = '博士の助言';
        content = 'アイテムは相棒に与えることで、より深い絆が生まれるぞ。同じ属性のアイテムだと効果が高いらしい。';
      }

      const newNews = { date: today, type, title, content, luckyItemId, bonusAreaId };
      localStorage.setItem(`news_${today}`, JSON.stringify(newNews));
      setNewsMessage(newNews);
      setShowNews(true);
    };

    checkAndGenerateNews();

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

  // --- UNCLE MESSAGE LOGIC ---
  const [showUncleMessage, setShowUncleMessage] = useState(false);
  const [currentUncleMessage, setCurrentUncleMessage] = useState<UncleMessage | null>(null);

  useEffect(() => {
    const checkUncleMessages = () => {
      const count = discoveredIds.length;
      if (count === 0) return;

      const milestones = [10, 20, 30, 40, 50];
      const reachedMilestones = milestones.filter(m => count >= m);
      if (reachedMilestones.length === 0) return;

      const latestMilestone = reachedMilestones[reachedMilestones.length - 1];
      const shownMilestoneStr = localStorage.getItem('uncle_message_last_shown_milestone');
      const lastShownMilestone = shownMilestoneStr ? parseInt(shownMilestoneStr) : 0;

      if (latestMilestone > lastShownMilestone) {
        const message = UNCLE_MESSAGES.find(m => m.milestone === latestMilestone);
        if (message) {
          setCurrentUncleMessage(message);
          setShowUncleMessage(true);
          localStorage.setItem('uncle_message_last_shown_milestone', latestMilestone.toString());
        }
      }
    };

    checkUncleMessages();
  }, [discoveredIds.length]);

  const timeConfig = getTimeConfig(currentTime);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleCreatureClick = (creature: Creature) => {
    if (!discoveredIds.includes(creature.id) && !creature.sketchUrl) return;
    setSelectedCreature(creature);
  };

  const discoveryRate = Math.round((discoveredIds.length / 50) * 100);

  // Buddy Logic
  const handleSetBuddy = (creature: Creature) => {
    // Check if we are resetting buddy or setting a new one
    // Ensure syncRate is carried over if it's the same species?
    // For now, simple implementation: set buddy.
    const newBuddy = { ...creature, role: 'buddy', syncRate: creature.syncRate || 0 };
    setBuddy(newBuddy as Creature);
    alert(`${creature.name} を相棒に設定しました！`);
  };

  const evolveBuddy = (currentBuddy: Creature) => {
    if (!currentBuddy.evolvesTo) return;
    const evolvedForm = CREATURES.find(c => c.id === currentBuddy.evolvesTo);
    if (evolvedForm) {
      setBuddy({
        ...evolvedForm,
        role: 'buddy',
        syncRate: 100, // Keep max sync
        evolutionLevel: (currentBuddy.evolutionLevel || 1) + 1
      } as Creature);
      alert(`おめでとう！ ${currentBuddy.name} は ${evolvedForm.name} に進化した！`);
    } else {
      // If logic says evolved but data missing
      setBuddy(prev => prev ? { ...prev, evolutionLevel: (prev.evolutionLevel || 1) + 1 } : null);
      alert(`${currentBuddy.name} の様子が……？ (データ未実装のためレベルのみ上昇)`);
    }
  };

  const updateSyncRate = (amount: number) => {
    if (!buddy) return;
    setBuddy(prev => {
      if (!prev) return null;
      const newRate = Math.min(100, (prev.syncRate || 0) + amount);
      if ((prev.syncRate || 0) < 100 && newRate >= 100) {
        setTimeout(() => {
          if (prev.evolutionLevel === 1) {
            if (window.confirm(`⚡ ${prev.name} との絆が MAX になった！ ⚡\n進化させますか？`)) {
              evolveBuddy(prev);
            }
          } else {
            alert(`⚡ ${prev.name} との絆が MAX になった！ ⚡`);
          }
        }, 500);
      }
      return { ...prev, syncRate: newRate };
    });
  };

  const handleBuddyInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buddy) return;
    // Cap sync increase by clicking for gameplay balance?
    // For now, let them click.
    if (buddy.syncRate < 100) {
      updateSyncRate(1);
    } else if (buddy.evolutionLevel === 1) {
      // Manual trigger for max sync
      if (window.confirm(`${buddy.name} は進化の準備ができています！進化させますか？`)) {
        evolveBuddy(buddy);
      }
    }
  };

  const handleUseItem = (item: Item) => {
    if (!buddy) {
      alert("相棒がいません。まずは相棒を決めよう！");
      return;
    }
    const index = inventory.findIndex(i => i.id === item.id);
    if (index > -1) {
      const newInv = [...inventory];
      newInv.splice(index, 1);
      setInventory(newInv);
      updateSyncRate(item.effectValue);
      alert(`${buddy.name} に ${item.name} をあげた！\nシンクロ率が ${item.effectValue} 上がった！`);
    }
  };

  // --- RENDER ---
  if (showTitle) {
    return <TitleScreen onStart={() => {
      setShowTitle(false);
      setShowIntroStory(true);
    }} />;
  }

  if (showIntroStory) {
    return <IntroStoryModal onComplete={() => {
      setShowIntroStory(false);
      setShowPrologue(true);
    }} />;
  }

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
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#3E2723'
      }}
    >
      {/* REALISTIC BOOK OVERLAY */}
      {showBook && (
        <RealisticBook
          creatures={CREATURES}
          discoveredIds={discoveredIds}
          onClose={() => setShowBook(false)}
        />
      )}

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
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl text-kids-text tracking-wide drop-shadow-sm">
                  {APP_NAME}
                </h1>
                <button
                  onClick={() => setShowBook(true)}
                  className="bg-[#3E2723] p-1.5 rounded-lg border-2 border-[#5D4037] text-white shadow-sm active:scale-95 transition-transform hover:bg-[#5D4037]"
                  title="図鑑を開く"
                >
                  <Book className="w-5 h-5" />
                </button>
              </div>
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
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border-2 border-pop-blue cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowDoctor(true)}>
              <UserCircle2 className="w-5 h-5 text-pop-blue" />
              <span className="text-sm font-bold text-kids-text">{userName} 調査員</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl mt-6 relative z-10">

        {/* === EXPLORE TAB === */}
        {currentTab === 'explore' && (
          <ExplorationView
            showNews={showNews}
            setShowNews={setShowNews}
            newsMessage={newsMessage}
            buddy={buddy}
            inventory={inventory}
            setShowInventory={setShowInventory}
            timeConfig={timeConfig}
            handleBuddyInteraction={handleBuddyInteraction}
            setShowBook={setShowBook}
            discoveredIds={discoveredIds}
            setDiscoveredIds={setDiscoveredIds}
            setInventory={setInventory}
            onCreatureClick={handleCreatureClick}
            userName={userName}
            activeArea={activeArea}
            onAreaSelect={setActiveArea}
          />
        )}

        {/* === GALLERY TAB === */}
        {currentTab === 'gallery' && (
          <GalleryView
            favorites={favorites}
            discoveredIds={discoveredIds}
            setShowBook={setShowBook}
            onCreatureClick={handleCreatureClick}
          />
        )}

        {/* === JOURNAL TAB === */}
        {currentTab === 'journal' && (
          <JournalView
            favorites={favorites}
            onCreatureClick={handleCreatureClick}
          />
        )}

      </main>

      {!activeArea && <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />}

      <CreatureDetailModal
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
        isFavorite={selectedCreature ? favorites.includes(selectedCreature.id) : false}
        onToggleFavorite={toggleFavorite}
        userName={userName}
        onSetBuddy={handleSetBuddy}
        buddyId={buddy ? buddy.id : null}
        isLocked={selectedCreature ? !discoveredIds.includes(selectedCreature.id) : false}
      />

      <InventoryModal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        inventory={inventory}
        onUseItem={handleUseItem}
      />

      {/* Uncle Message Modal */}
      {showUncleMessage && currentUncleMessage && (
        <UncleMessageModal
          message={currentUncleMessage}
          onClose={() => setShowUncleMessage(false)}
          userName={userName}
        />
      )}

      {/* Doctor Modal */}
      {showDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowDoctor(false)}>
          <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-black text-[#5D4037]">パラレル生物博士</h2>
            <div className="w-full max-h-[60vh] overflow-hidden rounded-lg shadow-lg">
              <img src="/image/title_key_visual.png" alt="Doctor" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600 text-center font-bold">
              「いつでも連絡してくれ給え！<br />……と言いたいところだが、<br />通信料が高いので程々にな！」
            </p>
            <button
              onClick={() => setShowDoctor(false)}
              className="mt-2 bg-[#5D4037] text-white px-6 py-2 rounded-full font-bold hover:bg-[#3E2723] transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* DEBUG TOOLS */}
      <div className="fixed bottom-20 left-4 z-[9999] bg-black/50 p-2 rounded-lg backdrop-blur-md border border-white/20">
        <p className="text-[10px] text-white font-mono mb-1">DEV TOOLS</p>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <button onClick={() => { localStorage.removeItem('uncle_message_last_shown_milestone'); alert('Reset Uncle Message History'); }} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Reset Msg</button>
            <button onClick={() => { setDiscoveredIds([]); alert('Reset Discovered IDs'); }} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Reset Dex</button>
          </div>
          <div className="flex gap-1 flex-wrap w-32">
            {[10, 20, 30, 40, 50].map(num => (
              <button
                key={num}
                onClick={() => {
                  // Generate dummy IDs to match count
                  const dummyIds = Array.from({ length: num }, (_, i) => `debug_${i}`);
                  setDiscoveredIds(dummyIds);
                  alert(`Set debug count to ${num}`);
                }}
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
              >
                Set {num}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;