
import React, { useState } from 'react';
import { BriefProfile, MarketingBrief, TranslationObject } from '../types.ts';

interface ProfileManagerProps {
  profiles: BriefProfile[];
  currentBrief: MarketingBrief;
  onSave: (name: string) => void;
  onLoad: (profile: BriefProfile) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  t: TranslationObject;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ 
  profiles, 
  onSave, 
  onLoad, 
  onDelete,
  disabled,
  t
}) => {
  const [isNaming, setIsNaming] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    if (newName.trim()) {
      onSave(newName.trim());
      setNewName('');
      setIsNaming(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
      {/* Left Action: Capture / Save */}
      <div className="shrink-0 flex flex-col gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-purple-500">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] antialiased">
              {t.profileManager.label}
            </span>
          </div>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest pl-5">
            {t.profileManager.sublabel}
          </p>
        </div>

        {isNaming ? (
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-purple-500 rounded-lg px-3 py-2 shadow-lg animate-in zoom-in fade-in duration-300">
            <input
              autoFocus
              type="text"
              placeholder={t.profileManager.placeholder}
              className="bg-transparent border-none outline-none text-[10px] font-black text-zinc-900 dark:text-white w-32 uppercase placeholder-zinc-500 tracking-wider"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button 
              onClick={handleSave}
              className="text-purple-500 hover:scale-110 transition-transform p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
            <button 
              onClick={() => setIsNaming(false)}
              className="text-zinc-500 hover:text-red-500 transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsNaming(true)}
            disabled={disabled || profiles.length >= 5}
            className="haptic-btn flex items-center justify-center gap-3 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-lg text-[10px] font-black text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-all uppercase tracking-[0.2em] shadow-lg disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            {t.profileManager.addButton}
          </button>
        )}
      </div>

      {/* Vertical Divider (Hidden on mobile) */}
      <div className="hidden md:block w-px h-12 bg-zinc-200 dark:bg-zinc-800"></div>

      {/* Right List: Profiles */}
      <div className="flex-grow">
        {profiles.length === 0 ? (
          <div className="flex items-center gap-3 opacity-20 select-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
               <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.profileManager.empty}</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 md:gap-3">
            {profiles.map((profile) => (
              <div 
                key={profile.id}
                className="group flex items-center bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all shadow-sm"
              >
                <button
                  onClick={() => onLoad(profile)}
                  disabled={disabled}
                  className="pl-4 pr-2 py-2.5 text-[10px] font-black text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors uppercase tracking-widest"
                >
                  {profile.name}
                </button>
                <button
                  onClick={() => onDelete(profile.id)}
                  disabled={disabled}
                  className="pr-3 pl-1 py-2.5 text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
