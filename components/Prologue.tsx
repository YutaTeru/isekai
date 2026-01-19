
import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Ghost, ArrowRight, Library, FastForward, Star, Scan } from 'lucide-react';

interface PrologueProps {
  onComplete: (userName: string) => void;
}

const Prologue: React.FC<PrologueProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState('opacity-0');
  const [userName, setUserName] = useState('');
  const [isInputting, setIsInputting] = useState(false);

  useEffect(() => {
    setFade('opacity-0');
    const timer = setTimeout(() => {
      setFade('opacity-100');
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  const handleNext = () => {
    if (step === 3) {
      setIsInputting(true);
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const handleStart = () => {
    if (!userName.trim()) return;
    setFade('opacity-0 scale-110');
    setTimeout(() => onComplete(userName), 1000);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setFade('opacity-0 scale-90');
    setTimeout(() => onComplete('調査員'), 500); 
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center gap-8 max-w-md text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/30 blur-3xl rounded-full"></div>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,214,10,0.4)] animate-float">
                  <Library className="w-16 h-16 text-pop-purple" strokeWidth={2} />
              </div>
            </div>
            <div className="space-y-4 font-maru text-white leading-loose tracking-widest text-lg font-bold">
              <p>ある晴れた日のこと。</p>
              <p>君は古い図書館の奥深くで、<br/>奇妙な光を放つ端末を発見した。</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center gap-8 max-w-md text-center">
             <div className="relative">
               <div className="absolute inset-0 bg-blue-400/30 blur-3xl rounded-full animate-pulse"></div>
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(76,201,240,0.4)] animate-float">
                 <Scan className="w-16 h-16 text-pop-blue" strokeWidth={2} />
               </div>
            </div>
            <div className="space-y-4 font-maru text-white leading-loose tracking-widest text-lg font-bold">
              <p>それは、この世界と少しだけズレた<br/>「パラレルワールド」を観測できる<br/>特殊なスキャナーだった。</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center gap-8 max-w-md text-center">
            <div className="relative">
               <div className="absolute inset-0 bg-pop-green/30 blur-3xl rounded-full animate-pulse"></div>
               <Ghost className="w-32 h-32 text-pop-green relative z-10 animate-bounce-slight" strokeWidth={2} />
            </div>
            <div className="space-y-4 font-maru text-white leading-loose tracking-widest text-lg font-bold bg-white/10 p-4 rounded-3xl backdrop-blur-sm border-2 border-white/20">
              <p className="text-2xl text-pop-yellow drop-shadow-md">『...おや？ 新しい調査員かな？』</p>
              <p className="text-base opacity-90">
                モニターに、半透明の博士が映し出される。<br/>
                彼は異世界の生態系を研究しているらしい。
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
             <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-pop-yellow mb-4">
               <Sparkles className="w-12 h-12 text-pop-yellow fill-current" />
             </div>
            <div className="space-y-4 font-maru text-white leading-loose tracking-widest text-lg font-bold">
              <p>
                「私は<span className="text-pop-yellow text-2xl mx-1">パラレル生物博士</span>だ。」
              </p>
              <p>
                「日常の裏側に潜む不思議な生物たちの<br/>データ収集を手伝ってくれないか？」
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center gap-6 max-w-md text-center w-full">
            <div className="space-y-2 font-maru text-white leading-loose tracking-widest mb-4 font-bold">
              <p className="text-2xl">「協力感謝する！」</p>
              <p>「君のコードネーム（名前）を教えてくれ。<br/>調査員として登録しよう。」</p>
            </div>
            
            <div className="w-full max-w-xs relative group">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="名前を入力"
                className="w-full bg-white border-4 border-pop-blue rounded-full text-center text-xl py-4 px-6 text-kids-text placeholder-gray-300 focus:outline-none focus:border-pop-yellow transition-all font-black shadow-lg"
                autoFocus
              />
            </div>
            
            <button
              onClick={handleStart}
              disabled={!userName.trim()}
              className={`mt-8 group relative px-10 py-4 bg-pop-yellow text-white rounded-full transition-all duration-300 border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 ${!userName.trim() ? 'opacity-50 cursor-not-allowed border-b-4' : 'hover:scale-105 hover:shadow-[0_0_30px_rgba(255,214,10,0.6)]'}`}
            >
              <span className="font-maru text-xl font-black tracking-widest flex items-center gap-2">
                調査開始 <ArrowRight className="w-6 h-6" strokeWidth={4} />
              </span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#7B1FA2] bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] flex flex-col items-center justify-center text-white overflow-hidden font-maru"
      onClick={() => {
        if (!isInputting) handleNext();
      }}
    >
      {/* Skip Button */}
      <button 
        onClick={handleSkip}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full font-bold text-sm tracking-widest transition-all"
      >
        SKIP <FastForward className="w-4 h-4" />
      </button>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-10 left-10 text-yellow-300 opacity-50 animate-spin-slow"><Star className="w-8 h-8" /></div>
         <div className="absolute bottom-20 right-20 text-pink-300 opacity-50 animate-bounce-slight"><Star className="w-12 h-12" /></div>
         <div className="absolute top-1/2 left-10 w-4 h-4 bg-blue-300 rounded-full animate-ping duration-[3000ms]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/10 to-transparent blur-3xl opacity-50"></div>
      </div>

      <div className={`transition-all duration-700 ease-in-out transform ${fade} w-full flex justify-center px-6`}>
        {renderContent()}
      </div>

      {/* Tap to continue indicator */}
      {!isInputting && (
        <div className="absolute bottom-10 left-0 right-0 text-center animate-bounce opacity-70 pointer-events-none">
          <span className="text-sm font-bold bg-black/20 px-4 py-1 rounded-full">画面をタップして次へ</span>
        </div>
      )}
    </div>
  );
};

export default Prologue;