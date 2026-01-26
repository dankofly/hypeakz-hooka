import React from 'react';
import { TranslationObject } from '../types.ts';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationObject;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 md:px-8 py-4 md:py-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">{t.legal.privacy.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors haptic-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-6 md:p-12 space-y-8 md:space-y-10 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.legal.privacy.h1}</h3>
            <p>{t.legal.privacy.t1}</p>
          </section>

          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.legal.privacy.h2}</h3>
            <p className="font-bold text-zinc-900 dark:text-zinc-100">{t.company.owner}</p>
            <p>{t.company.address.join(', ')}<br />E-Mail: {t.company.email}</p>
          </section>

          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.legal.privacy.h3}</h3>
            <p>{t.legal.privacy.t3a}</p>
            <p>{t.legal.privacy.t3b}</p>
            <p>{t.legal.privacy.t3c}</p>
          </section>

          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.legal.privacy.h4}</h3>
            <p>{t.legal.privacy.t4a}</p>
            <p>{t.legal.privacy.t4b}</p>
          </section>

          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.legal.privacy.h5}</h3>
            <p>{t.legal.privacy.t5}</p>
          </section>
        </div>
      </div>
    </div>
  );
};