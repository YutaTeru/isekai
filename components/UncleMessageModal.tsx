import React from 'react';
import { UncleMessage } from '../data/uncleMessages';
import { Smartphone, ChevronLeft, Send } from 'lucide-react';

interface UncleMessageModalProps {
    message: UncleMessage | null;
    onClose: () => void;
    userName: string;
}

const UncleMessageModal: React.FC<UncleMessageModalProps> = ({ message, onClose, userName }) => {
    if (!message) return null;

    // Replace placeholder with actual username
    const formattedBody = message.body.replace(/【ユーザー名】/g, userName);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
            <div className="relative w-full max-w-sm bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-50 duration-300">

                {/* Smartphone Bezel/Status Bar */}
                <div className="bg-gray-800 h-8 w-full flex items-center justify-center relative">
                    <div className="w-16 h-4 bg-black rounded-b-xl"></div>
                </div>

                <div className="h-[600px] bg-slate-50 flex flex-col relative overflow-hidden">

                    {/* Header */}
                    <div className="bg-white p-4 shadow-sm border-b flex items-center gap-3 z-10 sticky top-0">
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                            <ChevronLeft className="w-6 h-6 text-blue-500" />
                        </button>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight">叔父さん</h3>
                            <p className="text-xs text-gray-500">Online</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl border-2 border-indigo-200">
                            👨‍🔬
                        </div>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5]">

                        {/* Date Stamp */}
                        <div className="flex justify-center mb-4">
                            <span className="bg-[#E1F3FB] text-gray-600 text-xs py-1 px-3 rounded-full shadow-sm">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>

                        {/* Message Bubble (Left/Received) */}
                        <div className="flex flex-col gap-1 w-full max-w-[85%] mb-4">
                            <div className="bg-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-4 shadow-sm border border-gray-100 relative">
                                <h4 className="font-bold text-indigo-600 mb-2 border-b pb-1 border-gray-100 text-sm">{message.subject}</h4>
                                <div className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                                    {formattedBody}
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500 ml-1">既読</span>
                        </div>

                        {/* Image Attachment (if exists) */}
                        {message.image && (
                            <div className="flex flex-col gap-1 w-full max-w-[85%] mb-4">
                                <div className="bg-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-2 shadow-sm border border-gray-100 relative overflow-hidden">
                                    <img src={message.image} alt="Attached photo" className="w-full h-auto rounded-xl" />
                                </div>
                                <span className="text-[10px] text-gray-500 ml-1">既読</span>
                            </div>
                        )}

                    </div>

                    {/* Input Area (Dummy) */}
                    <div className="bg-white p-3 border-t flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            +
                        </div>
                        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                            メッセージを入力...
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md active:scale-95 transition-transform text-white">
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>

                {/* Home Bar */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    );
};

export default UncleMessageModal;
