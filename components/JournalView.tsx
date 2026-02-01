import React, { useMemo } from 'react';
import { Creature } from '../types';
import { CREATURES } from '../constants';
import { Heart } from 'lucide-react';

interface JournalViewProps {
    favorites: string[];
    onCreatureClick: (creature: Creature) => void;
}

const JournalView: React.FC<JournalViewProps> = ({
    favorites,
    onCreatureClick
}) => {
    const favoriteCreatures = useMemo(() => {
        return CREATURES.filter(c => favorites.includes(c.id));
    }, [favorites]);

    return (
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

                {favoriteCreatures.length > 0 ? (
                    <div className="space-y-4">
                        {favoriteCreatures.map(creature => (
                            <div
                                key={creature.id}
                                onClick={() => onCreatureClick(creature)}
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
    );
};

export default JournalView;
