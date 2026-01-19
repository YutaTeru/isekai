
import React, { useState, useEffect } from 'react';
import { Creature } from '../types';
import { Star, Lock, AlertTriangle } from 'lucide-react';

interface CreatureCardProps {
  creature: Creature;
  onClick: (creature: Creature) => void;
  isNew?: boolean;
  isLocked?: boolean;
}

const CreatureCard: React.FC<CreatureCardProps> = ({ creature, onClick, isNew, isLocked = false }) => {
  const [imgSrc, setImgSrc] = useState(creature.sketchUrl || creature.imageUrl);
  
  useEffect(() => {
    if (isLocked) {
      setImgSrc(creature.sketchUrl || creature.imageUrl);
    } else {
      setImgSrc(creature.imageUrl);
    }
  }, [creature, isLocked]);

  // --- ロック中（未発見）モード ---
  if (isLocked) {
    return (
      <div className="relative bg-gray-100 rounded-3xl border-4 border-dashed border-gray-300 p-4 h-full min-h-[200px] flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3 text-gray-400">
           <Lock className="w-8 h-8" />
        </div>
        <div className="text-center w-full">
           <p className="font-black text-gray-400 text-lg mb-1 tracking-widest">
             NO DATA
           </p>
           <div className="inline-block bg-white px-3 py-1 rounded-md border border-gray-200">
             <p className="text-xs font-bold text-gray-400">
               {creature.type}
             </p>
           </div>
        </div>
      </div>
    );
  }

  // --- 発見済み（カード）モード ---
  return (
    <div 
      onClick={() => onClick(creature)}
      className="group relative h-full cursor-pointer perspective-1000"
    >
      <div className="relative bg-white p-2 rounded-3xl shadow-card hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center border-b-4 border-gray-200 hover:border-pop-blue">
        
        {/* 写真エリア */}
        <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-2xl bg-gray-50 border-2 border-gray-100 group-hover:border-pop-blue transition-colors">
          <img 
            src={imgSrc} 
            alt={creature.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* キラキラオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          {/* NEWバッジ */}
          {isNew && (
            <div className="absolute top-2 left-2 bg-pop-pink text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md border-2 border-white animate-bounce-slight">
              NEW!
            </div>
          )}
        </div>

        {/* テキストエリア */}
        <div className="w-full px-1 text-center mt-auto">
          <h3 className="font-black text-kids-text text-base mb-2 truncate group-hover:text-pop-blue transition-colors">
            {creature.name}
          </h3>
          
          <div className="flex justify-center items-center gap-1 bg-pastel-yellow/50 rounded-full py-1">
             {[...Array(5)].map((_, i) => (
               <Star 
                 key={i} 
                 className={`w-3 h-3 ${i < creature.dangerLevel ? 'fill-pop-yellow text-pop-yellow' : 'fill-gray-200 text-gray-200'}`} 
               />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatureCard;