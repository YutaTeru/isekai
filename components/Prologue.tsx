import React, { useState, useEffect } from 'react';
import { Camera, Mail, ArrowRight, PenTool, Stamp } from 'lucide-react';

interface PrologueProps {
  onComplete: (userName: string) => void;
}

const Prologue: React.FC<PrologueProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'letter' | 'name' | 'camera' | 'launch'>('letter');
  const [userName, setUserName] = useState('');
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [zoomEffect, setZoomEffect] = useState(false);

  const handleLetterClick = () => {
    setIsLetterOpen(true);
  };

  const handleLetterClose = () => {
    setIsLetterOpen(false);
    if (step === 'letter') setStep('name');
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setStep('camera');
    }
  };

  const handleCameraClick = () => {
    setZoomEffect(true);
    setTimeout(() => {
      onComplete(userName);
    }, 1500);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden font-maru transition-all duration-1000 ${zoomEffect ? 'scale-[3] opacity-0' : 'scale-100'}`}>

      {/* Desk Background (Wood Texture Simulation) */}
      <div className="absolute inset-0 bg-[#5D4037] bg-opacity-90">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #3E2723 25%, transparent 25%, transparent 75%, #3E2723 75%, #3E2723), repeating-linear-gradient(45deg, #3E2723 25%, #5D4037 25%, #5D4037 75%, #3E2723 75%, #3E2723)`,
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}></div>
        <div className="absolute inset-0 bg-gradient-radial from-orange-100/10 to-black/60"></div>
      </div>

      {/* Desk Content Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4">

        {/* --- ITEM 1: LETTER (博士の手紙) --- */}
        <div
          className={`absolute transition-all duration-500 cursor-pointer group
            ${step === 'letter' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 z-20' : 'top-10 left-10 rotate-[-10deg] scale-90 opacity-60 hover:opacity-100'}
          `}
          onClick={step === 'letter' ? handleLetterClick : undefined}
        >
          <div className="w-64 h-48 bg-[#F5F5DC] rounded-lg shadow-xl flex items-center justify-center border-4 border-[#E0E0E0] relative overflow-hidden transform group-hover:-translate-y-1 transition-transform">
            {/* Envelope details */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[#E8E8C0] clip-path-triangle"></div>
            <Mail className="w-12 h-12 text-[#8D6E63] opacity-50" />
            <div className="absolute top-4 right-4 w-12 h-14 bg-red-100 border-2 border-red-200 flex items-center justify-center -rotate-6 shadow-sm">
              <span className="text-[10px] font-bold text-red-400">POST</span>
            </div>
            <div className="absolute bottom-4 left-4 text-[#5D4037] font-bold text-sm tracking-widest opacity-70">
              To: 君へ
            </div>
          </div>
          {step === 'letter' && (
            <div className="absolute -bottom-10 w-full text-center text-white font-bold animate-bounce text-shadow">
              タップして読む
            </div>
          )}
        </div>

        {/* --- ITEM 2: ID CARD (名前入力) --- */}
        <div
          className={`absolute transition-all duration-700 
            ${step === 'name'
              ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 z-20'
              : step === 'camera'
                ? 'bottom-10 left-10 rotate-[5deg] scale-90'
                : 'translate-y-[200%] rotate-12 opacity-0'
            }
          `}
        >
          <div className="w-72 bg-white rounded-xl shadow-2xl p-6 border border-gray-200 relative">
            {/* Lanyard String */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-4 h-32 bg-pop-blue/80 rounded-b-full"></div>

            <div className="flex items-center gap-3 mb-4 border-b-2 border-dashed border-gray-200 pb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                <PenTool className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-black text-kids-text text-lg">調査員IDカード</h3>
                <p className="text-xs text-gray-400 font-bold">PARALLEL WORLD OBSERVER</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">CODE NAME</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="名前を書いてね"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-kids-text font-black text-lg focus:outline-none focus:border-pop-blue focus:bg-white transition-colors text-center"
                  autoFocus={step === 'name'}
                />
              </div>
              {step === 'name' && (
                <button
                  onClick={handleNameSubmit}
                  disabled={!userName.trim()}
                  className={`w-full py-3 bg-pop-blue text-white rounded-lg font-black shadow-md transition-all
                    ${userName.trim() ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}
                  `}
                >
                  登録する
                </button>
              )}
            </div>

            {/* Hanko (Stamp) effect when completed */}
            {step !== 'name' && step !== 'letter' && (
              <div className="absolute bottom-4 right-4 rotate-[-15deg] opacity-80 animate-bounce-slight">
                <div className="w-20 h-20 border-4 border-red-500 rounded-full flex items-center justify-center text-red-500 font-black text-sm tracking-widest shadow-sm">
                  <div className="flex flex-col items-center">
                    <span>承認</span>
                    <Stamp className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- ITEM 3: CAMERA (スタートボタン) --- */}
        <div
          className={`absolute transition-all duration-700
            ${step === 'camera'
              ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 z-20 cursor-pointer animate-pulse-slow'
              : 'top-10 right-10 rotate-[15deg] scale-75 opacity-40 grayscale'
            }
          `}
          onClick={step === 'camera' ? handleCameraClick : undefined}
        >
          <div className="relative group">
            <div className="w-64 h-48 bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border-t-8 border-gray-600 relative overflow-hidden">
              {/* Lens */}
              <div className="w-32 h-32 rounded-full border-8 border-gray-700 bg-gray-900 flex items-center justify-center shadow-inner relative z-10 overflow-hidden transform transition-transform duration-700 group-hover:scale-105">
                {/* Reflection */}
                <div className="absolute top-4 right-8 w-8 h-8 bg-white/10 rounded-full blur-sm"></div>
                <div className={`w-24 h-24 rounded-full border-4 border-pop-blue/50 flex items-center justify-center transition-all duration-1000 ${step === 'camera' ? 'bg-pop-blue/10 animate-pulse' : 'bg-transparent'}`}>
                  <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm"></div>
                </div>
              </div>
              {/* Flash */}
              <div className="absolute top-4 right-6 w-8 h-4 bg-yellow-200/50 rounded-sm"></div>
              {/* Grip */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-700/50 border-r border-gray-900/50"></div>
              {/* Details */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono tracking-widest">
                PARALLEL-CAM V2.0
              </div>
            </div>

            {/* Strap */}
            <div className="absolute -right-12 top-1/2 w-32 h-64 border-r-8 border-b-8 border-gray-900/40 rounded-[4rem] -z-10 transform rotate-12"></div>

            {step === 'camera' && (
              <div className="absolute -bottom-16 left-0 right-0 text-center">
                <span className="inline-block bg-white text-kids-text px-6 py-2 rounded-full font-black shadow-lg animate-bounce">
                  カメラを構える（スタート）
                </span>
              </div>
            )}
          </div>
        </div>

        {/* --- MODAL: LETTER CONTENT --- */}
        {isLetterOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#FDFBF7] max-w-lg w-full p-8 rounded-sm shadow-2xl relative rotate-1">
              {/* Paper Texture */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'Repeating-linear-gradient(0deg, transparent, transparent 29px, #000 30px)' }}></div>

              <div className="relative font-maru text-kids-text leading-loose text-lg tracking-wider space-y-6">
                <p>元気かい？</p>
                <p>
                  久しぶりだね。<br />
                  また、君に頼みたい調査があるんだ。
                </p>
                <p>
                  例の『パラレルワールド』の反応が、<br />
                  最近また強くなっている。
                </p>
                <p>
                  君の観察眼が必要なんだ。<br />
                  準備ができたら、<br />
                  IDカードにサインをして、<br />
                  そのカメラを持ってきてくれないか？
                </p>
                <div className="text-right pt-4">
                  <p className="font-black text-gray-500 transform -rotate-2 inline-block border-2 border-gray-500 px-2 py-1">
                    パラレル生物博士
                  </p>
                </div>
              </div>

              <button
                onClick={handleLetterClose}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-pop-yellow text-white px-8 py-3 rounded-full font-black shadow-pop hover:scale-105 transition-transform flex items-center gap-2"
              >
                わかった！ <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Prologue;