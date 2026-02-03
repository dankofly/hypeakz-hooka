import React, { useState } from 'react';
import { UserProfile, TranslationObject } from '../types.ts';
import { validatePromoCode } from '../services/gemini.ts';

interface ProfileEditModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => Promise<void>;
  t: TranslationObject;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, onClose, onSave, t }) => {
  const [name, setName] = useState(user.name);
  const [brand, setBrand] = useState(user.brand || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error' | 'validating'>('idle');
  const [promoError, setPromoError] = useState('');
  const [unlimitedStatus, setUnlimitedStatus] = useState(user.unlimitedStatus || false);

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) return;

    setPromoStatus('validating');
    setPromoError('');

    try {
      const result = await validatePromoCode(promoCode.trim(), user.id);

      if (result.valid) {
        setUnlimitedStatus(true);
        setPromoStatus('success');
        setPromoCode('');
      } else {
        setPromoError(result.error || 'Invalid code');
        setPromoStatus('error');
        setTimeout(() => setPromoStatus('idle'), 3000);
      }
    } catch (err) {
      setPromoError('Connection error');
      setPromoStatus('error');
      setTimeout(() => setPromoStatus('idle'), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...user,
        name,
        brand,
        email,
        phone,
        unlimitedStatus
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
      alert(t.errors.profileSyncFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const labelClasses = "block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2";
  const inputClasses = "w-full p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all text-sm font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => !isSaving && onClose()} />

      <div className="relative bg-white dark:bg-zinc-950 w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">

        {/* Header with gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent"></div>
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/25">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{t.profileEdit.title}</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">{t.profileEdit.subtitle}</p>
                  </div>
                </div>
              </div>
              {!isSaving && !isSuccess && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>

            {/* Status Badge */}
            {unlimitedStatus && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-[0.15em]">
                  Unlimited Access Active
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 pb-6 space-y-5">

            {/* Personal Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Personal Info</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClasses}>{t.profileEdit.fields.name}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                    placeholder="Max Mustermann"
                    disabled={isSaving || isSuccess}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>{t.profileEdit.fields.brand}</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={inputClasses}
                    placeholder="My Agency"
                    disabled={isSaving || isSuccess}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClasses}>{t.profileEdit.fields.email}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                      placeholder="mail@example.com"
                      disabled={isSaving || isSuccess}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.profileEdit.fields.phone}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClasses}
                      placeholder="+43..."
                      disabled={isSaving || isSuccess}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  {t.profileEdit.promoCode?.label || 'Promo Code'}
                </span>
              </div>

              {!unlimitedStatus ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
                      <path d="M12 12V3"/>
                      <path d="m8 7 4-4 4 4"/>
                    </svg>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      {t.profileEdit.promoCode?.placeholder || 'Enter your promo code to unlock unlimited access'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePromoCodeSubmit())}
                        className={`w-full px-4 py-3.5 bg-white dark:bg-zinc-950 border-2 rounded-xl text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 uppercase tracking-wider transition-all outline-none ${
                          promoStatus === 'error'
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-zinc-200 dark:border-zinc-700 focus:border-purple-500'
                        }`}
                        placeholder="XXXX-XXXX"
                        disabled={isSaving || isSuccess || promoStatus === 'validating'}
                      />
                      {promoStatus === 'error' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m15 9-6 6M9 9l6 6"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handlePromoCodeSubmit}
                      disabled={!promoCode.trim() || isSaving || isSuccess || promoStatus === 'validating'}
                      className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center gap-2"
                    >
                      {promoStatus === 'validating' ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>...</span>
                        </>
                      ) : (
                        t.profileEdit.promoCode?.activate || 'Activate'
                      )}
                    </button>
                  </div>

                  {promoStatus === 'error' && (
                    <p className="mt-3 text-xs text-red-500 font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                      </svg>
                      {promoError || t.profileEdit.promoCode?.invalid || 'Invalid promo code'}
                    </p>
                  )}
                  {promoStatus === 'success' && (
                    <p className="mt-3 text-xs text-green-500 font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6 9 17 4 12"/>
                      </svg>
                      {t.profileEdit.promoCode?.success || 'Code activated! Save to apply.'}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500">
                        <path d="M20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        {t.profileEdit.promoCode?.unlimited || 'Unlimited Access'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {t.profileEdit.promoCode?.activeMessage || 'All premium features are unlocked'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
            {!isSaving && !isSuccess && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
              >
                {t.profileEdit.cancel}
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || isSuccess}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-lg ${
                isSuccess
                  ? 'bg-green-500 text-white shadow-green-500/25'
                  : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-zinc-900/20 dark:shadow-white/10'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.profileEdit.saving}</span>
                </>
              ) : isSuccess ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17 4 12"/></svg>
                  <span>{t.profileEdit.saved}</span>
                </>
              ) : (
                t.profileEdit.save
              )}
            </button>
          </div>
        </form>

        {/* Bottom gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"></div>
      </div>
    </div>
  );
};
