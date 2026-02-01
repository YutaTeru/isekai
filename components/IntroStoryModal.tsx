import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface IntroStoryModalProps {
    onComplete: () => void;
}

const IntroStoryModal: React.FC<IntroStoryModalProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const stories = [
        "僕の叔父さんは、普通とはちょっと違っていた。",
        "ある日、学校から帰ってくると……",
        "ランドセルの中に、見たことのない『図鑑』と『手紙』が入っていたんだ。"
    ];

    return (
        <div
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center font-maru"
            onClick={handleNext}
        >
            <div className={`relative w-full h-full max-w-lg mx-auto flex flex-col transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

                {/* Image Area */}
                <div className="flex-1 relative overflow-hidden">
                    <img
                        src="/promo_scene_01_randoseru_scan.png"
                        alt="Intro Scene"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                {/* Text Area */}
                <div className="bg-black p-8 pb-20 text-white relative">
                    <p className="text-lg md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 key={step}">
                        {stories[step]}
                    </p>

                    <div className="absolute bottom-8 right-8 animate-bounce opacity-50">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroStoryModal;
