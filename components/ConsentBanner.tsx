import React, { useState, useEffect } from 'react';
import { TranslationObject } from '../types.ts';

const STORAGE_KEY_CONSENT = 'hypeakz_consent_granted';

export const ConsentBanner: React.FC<{ t: TranslationObject }> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY_CONSENT);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY_CONSENT, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[200] animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 glass">
        <div className="flex-grow space-y-2">
          <h4 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.legal.consent.title}</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t.legal.consent.text}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={handleAccept}
            className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest haptic-btn"
          >
            {t.legal.consent.button}
          </button>
        </div>
      </div>
    </div>
  );
};