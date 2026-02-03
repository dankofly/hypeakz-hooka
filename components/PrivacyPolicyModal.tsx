import React from 'react';
import { TranslationObject } from '../types.ts';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationObject;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  const p = t.legal.privacy;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 md:px-8 py-4 md:py-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">{p.title}</h2>
            <p className="text-xs text-zinc-500">{p.lastUpdate}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors haptic-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 md:p-12 space-y-8 md:space-y-10 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          {/* 1. Overview */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h1}</h3>
            <p>{p.t1}</p>
          </section>

          {/* 2. Responsible Party */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h2}</h3>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{t.company.owner}</p>
              <p>{t.company.address.join(', ')}</p>
              <p>E-Mail: {t.company.email}</p>
              <p>Tel: {t.company.phone}</p>
              <p>UID: {t.company.uid}</p>
            </div>
          </section>

          {/* 3. Legal Basis */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h3}</h3>
            <p>{p.t3}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{p.t3a}</li>
              <li>{p.t3b}</li>
              <li>{p.t3c}</li>
            </ul>
          </section>

          {/* 4. Data Collection */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h4}</h3>
            <p>{p.t4}</p>

            <div className="space-y-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.h4a}</h4>
                <p className="text-xs">{p.t4a}</p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.h4b}</h4>
                <p className="text-xs">{p.t4b}</p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.h4c}</h4>
                <p className="text-xs">{p.t4c}</p>
              </div>
            </div>
          </section>

          {/* 5. Third-Party Services */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h5}</h3>
            <p>{p.t5}</p>

            <div className="space-y-4">
              {/* Firebase */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.firebase.title}</h4>
                <p className="text-xs mb-2">{p.firebase.desc}</p>
                <p className="text-xs text-zinc-500">{p.firebase.data}</p>
                <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{p.firebase.link}</a>
              </div>

              {/* Google Gemini */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.gemini.title}</h4>
                <p className="text-xs mb-2">{p.gemini.desc}</p>
                <p className="text-xs text-zinc-500">{p.gemini.data}</p>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{p.gemini.link}</a>
              </div>

              {/* Stripe */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.stripe.title}</h4>
                <p className="text-xs mb-2">{p.stripe.desc}</p>
                <p className="text-xs text-zinc-500">{p.stripe.data}</p>
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{p.stripe.link}</a>
              </div>

              {/* Netlify */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.netlify.title}</h4>
                <p className="text-xs mb-2">{p.netlify.desc}</p>
                <p className="text-xs text-zinc-500">{p.netlify.data}</p>
                <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{p.netlify.link}</a>
              </div>

              {/* Neon DB */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">{p.neon.title}</h4>
                <p className="text-xs mb-2">{p.neon.desc}</p>
                <p className="text-xs text-zinc-500">{p.neon.data}</p>
                <a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{p.neon.link}</a>
              </div>
            </div>
          </section>

          {/* 6. International Transfers */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h6}</h3>
            <p>{p.t6}</p>
          </section>

          {/* 7. Cookies & LocalStorage */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h7}</h3>
            <p>{p.t7}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
              <li>{p.t7a}</li>
              <li>{p.t7b}</li>
              <li>{p.t7c}</li>
            </ul>
          </section>

          {/* 8. Data Retention */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h8}</h3>
            <p>{p.t8}</p>
          </section>

          {/* 9. Your Rights */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h9}</h3>
            <p>{p.t9}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{p.t9a}</li>
              <li>{p.t9b}</li>
              <li>{p.t9c}</li>
              <li>{p.t9d}</li>
              <li>{p.t9e}</li>
              <li>{p.t9f}</li>
              <li>{p.t9g}</li>
            </ul>
          </section>

          {/* 10. Supervisory Authority */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h10}</h3>
            <p>{p.t10}</p>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Österreichische Datenschutzbehörde</p>
              <p>Barichgasse 40-42, 1030 Wien</p>
              <p>Tel: +43 1 52 152-0</p>
              <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">www.dsb.gv.at</a>
            </div>
          </section>

          {/* 11. Changes */}
          <section className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{p.h11}</h3>
            <p>{p.t11}</p>
          </section>
        </div>
      </div>
    </div>
  );
};
