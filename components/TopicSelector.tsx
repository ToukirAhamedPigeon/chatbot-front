import React from 'react';
import { TOPICS, TopicId } from '../types';
import { BookOpen, HeartPulse, Plane, Cpu, Trophy, MessageCircle } from 'lucide-react';

interface TopicSelectorProps {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const iconMap = {
  BookOpen,
  HeartPulse,
  Plane,
  Cpu,
  Trophy,
  MessageCircle,
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({ 
  selectedTopic, 
  onSelectTopic,
  isOpen,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            বিষয়সমূহ
          </h2>
          <p className="text-xs text-slate-500 mt-1">আপনার পছন্দের বিষয়টি বেছে নিন</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {TOPICS.map((topic) => {
            const Icon = iconMap[topic.icon as keyof typeof iconMap];
            const isSelected = selectedTopic === topic.label;

            return (
              <button
                key={topic.id}
                onClick={() => {
                  onSelectTopic(topic.label);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
                  ${isSelected 
                    ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isSelected ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}
                `}>
                  <Icon size={18} />
                </div>
                {topic.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white text-center shadow-lg">
            <p className="text-xs font-medium opacity-90">Powered by</p>
            <p className="font-bold text-lg"><a href="https://pigeonic.com" target="_blank" rel="noopener noreferrer">Pigeonic</a></p>
          </div>
        </div>
      </aside>
    </>
  );
};
