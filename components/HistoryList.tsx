import React from 'react';
import { HistoryItem, TranslationObject } from '../types.ts';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  activeId?: string;
  t: TranslationObject;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, activeId, t }) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-[0.4em] whitespace-nowrap antialiased">
          {t.history.title}
        </h3>
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {history.map((item) => {
          const date = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isActive = activeId === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`haptic-btn text-left p-4 rounded-lg border transition-all duration-300 antialiased ${
                isActive 
                  ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 shadow-lg' 
                  : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-zinc-400' : 'text-purple-600 dark:text-purple-400'}`}>
                  {item.brief.language} / {date}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                )}
              </div>
              <p className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-800 dark:text-zinc-300'}`}>
                {item.concepts[0]?.hook.replace(/"/g, '') || t.history.empty}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};