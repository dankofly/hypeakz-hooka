import React, { useState } from 'react';
import { UserProfile, TranslationObject } from '../types.ts';

interface ProfileEditModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => Promise<void>;
  t: TranslationObject;
}

// Valid promo codes for unlimited access
const VALID_PROMO_CODES = ['hooka007unlim'];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, onClose, onSave, t }) => {
  const [name, setName] = useState(user.name);
  const [brand, setBrand] = useState(user.brand || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [unlimitedStatus, setUnlimitedStatus] = useState(user.unlimitedStatus || false);

  const handlePromoCodeSubmit = () => {
    const code = promoCode.trim().toLowerCase();
    if (VALID_PROMO_CODES.includes(code)) {
      setUnlimitedStatus(true);
      setPromoStatus('success');
      setPromoCode('');
    } else {
      setPromoStatus('error');
      setTimeout(() => setPromoStatus('idle'), 2000);
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
      // Wait a moment for the success animation
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

  const labelClasses = "block text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 md:mb-2";
  // Increased contrast for inputs, less rounded
  const inputClasses = "w-full p-3 md:p-4 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 shadow-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => !isSaving && onClose()} />
      <div className="relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in fade-in duration-500 overflow-hidden">
        <div className="p-6 md:p-12 space-y-6 md:space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1 md:space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{t.profileEdit.title}</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{t.profileEdit.subtitle}</p>
            </div>
            {!isSaving && !isSuccess && (
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 gap-4 md:gap-5">
              <div className="space-y-1">
                <label className={labelClasses}>{t.profileEdit.fields.name}</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Max Mustermann"
                  disabled={isSaving || isSuccess}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>{t.profileEdit.fields.brand}</label>
                <input 
                  type="text" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. My Agency"
                  disabled={isSaving || isSuccess}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-1">
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
                <div className="space-y-1">
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

            {/* Promo Code Section */}
            <div className="pt-4 md:pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={labelClasses}>{t.profileEdit.promoCode?.label || 'Promo Code'}</label>
                  {unlimitedStatus && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17 4 12"/></svg>
                      {t.profileEdit.promoCode?.unlimited || 'Unlimited'}
                    </span>
                  )}
                </div>

                {!unlimitedStatus ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePromoCodeSubmit())}
                      className={`${inputClasses} flex-1 ${promoStatus === 'error' ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder={t.profileEdit.promoCode?.placeholder || 'Enter code...'}
                      disabled={isSaving || isSuccess}
                    />
                    <button
                      type="button"
                      onClick={handlePromoCodeSubmit}
                      disabled={!promoCode.trim() || isSaving || isSuccess}
                      className="px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t.profileEdit.promoCode?.activate || 'Activate'}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 font-medium">
                    {t.profileEdit.promoCode?.activeMessage || 'You have unlimited access to all features.'}
                  </p>
                )}

                {promoStatus === 'error' && (
                  <p className="text-xs text-red-500 font-bold animate-in fade-in duration-200">
                    {t.profileEdit.promoCode?.invalid || 'Invalid promo code'}
                  </p>
                )}
                {promoStatus === 'success' && (
                  <p className="text-xs text-green-500 font-bold animate-in fade-in duration-200">
                    {t.profileEdit.promoCode?.success || 'Promo code activated! Save to apply.'}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
              {!isSaving && !isSuccess && (
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {t.profileEdit.cancel}
                </button>
              )}
              <button 
                type="submit"
                disabled={isSaving || isSuccess}
                className={`px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest haptic-btn shadow-md transition-all flex items-center gap-3 ${
                  isSuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.profileEdit.saving}</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17 4 12"/></svg>
                    <span>{t.profileEdit.saved}</span>
                  </>
                ) : (
                  t.profileEdit.save
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Visual Decoration */}
        <div className={`h-1.5 w-full transition-all duration-1000 ${isSaving ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600'}`}>
          {isSaving && <div className="h-full bg-purple-500 animate-[shimmer_2s_linear_infinite]" style={{ width: '40%' }}></div>}
        </div>
      </div>
    </div>
  );
};