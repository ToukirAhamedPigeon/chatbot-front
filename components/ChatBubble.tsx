import React from 'react';
import { Message } from '../types';
import { Bot, User, Volume2, Copy } from 'lucide-react';
import { Button } from './ui/Button';

interface ChatBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onSpeak }) => {
  const isAi = message.role === 'ai';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
  };

  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-6 animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isAi ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isAi ? 'bg-teal-100 text-teal-600' : 'bg-slate-200 text-slate-600'}`}>
          {isAi ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`group relative px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
          ${isAi 
            ? 'bg-white text-slate-800 rounded-bl-none border border-slate-100' 
            : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-br-none'
          }`}
        >
          {message.text}
          
          {/* Message Actions (Only for AI for now) */}
          {isAi && (
            <div className="absolute -bottom-6 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onSpeak && (
                <button 
                  onClick={() => onSpeak(message.text)}
                  className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
                  title="Speak"
                >
                  <Volume2 size={14} />
                </button>
              )}
              <button 
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
                title="Copy"
              >
                <Copy size={14} />
              </button>
            </div>
          )}
        </div>
        
        <span className="text-[10px] text-slate-400 pb-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
