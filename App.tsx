
import React, { useState, useCallback, useEffect } from 'react';
import { MarketingBrief, ViralConcept, GenerationStatus, HistoryItem, BriefProfile, UserProfile, Language } from './types.ts';
import { generateViralHooks } from './services/gemini.ts';
import { db } from './services/db.ts';
import { analytics } from './services/analytics.ts';
import { authService } from './services/auth.ts';
import { useAuth } from './hooks/useAuth.ts';
import { BriefEditor } from './components/BriefEditor.tsx';
import { ConceptCard } from './components/ConceptCard.tsx';
import { HistoryList } from './components/HistoryList.tsx';
import { ProfileManager } from './components/ProfileManager.tsx';
import { ImpressumModal } from './components/ImpressumModal.tsx';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal.tsx';
import { ConsentBanner } from './components/ConsentBanner.tsx';
import { ProfileEditModal } from './components/ProfileEditModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { PricingPage } from './components/PricingPage.tsx';
import { WhyHookaPage } from './components/WhyHookaPage.tsx';
import { TRANSLATIONS } from './text.ts';

// Helper for Firebase error messages
const getFirebaseErrorMessage = (code: string, t: any): string => {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': t.errors.emailInUse,
    'auth/invalid-email': t.errors.invalidEmail,
    'auth/weak-password': t.errors.weakPassword,
    'auth/user-not-found': t.errors.userNotFound,
    'auth/wrong-password': t.errors.wrongPassword,
    'auth/too-many-requests': t.errors.tooManyRequests,
    'auth/popup-closed-by-user': t.errors.popupClosed,
    'auth/invalid-credential': t.errors.wrongPassword,
  };
  return messages[code] || t.errors.authFailed;
};

const STORAGE_KEY_THEME = 'hypeakz_theme';
const STORAGE_KEY_USER = 'hypeakz_user_profile';
const STORAGE_KEY_APP_LANG = 'hypeakz_app_lang';

const Logo = ({ text }: { text: string }) => (
  <div className="flex items-center gap-[10px] md:gap-[14px] select-none group">
    <div className="relative flex items-center justify-center">
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="text-zinc-500 dark:text-[#D1D1D1] transition-transform duration-500 group-hover:scale-105"
      >
        <path 
          d="M4 8.5L20 8.5L12 17.5L4 8.5Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
    <span className="text-[14px] md:text-[17px] font-bold tracking-[0.2em] md:tracking-[0.32em] text-zinc-900 dark:text-[#F0F0F0] uppercase antialiased leading-none">
      {text}
    </span>
  </div>
);

const TutorialCard = ({ step, title, desc }: { step: string, title: string, desc: string }) => (
  <div className="flex-1 min-w-[240px] p-6 bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-purple-500/50 transition-all duration-500">
    <div className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100 transition-opacity">{step}</div>
    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase mb-2 tracking-tight">{title}</h4>
    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

const App: React.FC = () => {
  // Firebase Auth Hook
  const { user: firebaseUser, loading: authLoading, emailVerified } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);

  // Email Auth State
  const [authMode, setAuthMode] = useState<'select' | 'email-login' | 'email-register'>('select');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  
  // UI Language state
  const [appLanguage, setAppLanguage] = useState<Language>('DE');

  // Brief state (includes Output Language)
  const [brief, setBrief] = useState<MarketingBrief>({
    productContext: "",
    targetAudience: "",
    goal: "",
    speaker: "",
    language: 'DE', // This controls the output generation language
    targetScores: {
      patternInterrupt: 70,
      emotionalIntensity: 70,
      curiosityGap: 70,
      scarcity: 50
    }
  });
  
  // Current translation object based on APP language
  const t = TRANSLATIONS[appLanguage];

  const [concepts, setConcepts] = useState<ViralConcept[]>([]);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [profiles, setProfiles] = useState<BriefProfile[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>();
  const [isDark, setIsDark] = useState(false);
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isWhyHookaOpen, setIsWhyHookaOpen] = useState(false);

  // Sync Firebase user with local state
  useEffect(() => {
    if (firebaseUser && !authLoading) {
      setUser(firebaseUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(firebaseUser));
      // Background sync with DB
      db.getUser(firebaseUser.id).then(cloudUser => {
        if (cloudUser && cloudUser.brand) {
          const merged = { ...firebaseUser, ...cloudUser };
          setUser(merged);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(merged));
        }
      }).catch(err => console.debug("Offline or Sync Failed:", err));
    } else if (!firebaseUser && !authLoading) {
      // Check for legacy local user (before Firebase migration)
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          // If it's a Firebase UID format, clear it (user logged out)
          if (!parsed.id.includes('-')) {
            localStorage.removeItem(STORAGE_KEY_USER);
            setUser(null);
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY_USER);
        }
      }
      setUser(null);
    }
  }, [firebaseUser, authLoading]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    const darkMode = savedTheme ? savedTheme === 'dark' : false;
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem(STORAGE_KEY_APP_LANG);
    if (savedLang === 'DE' || savedLang === 'EN') {
      setAppLanguage(savedLang as Language);
    }

    // Initial Load: Data
    db.init().then(async () => {
      const [h, p] = await Promise.all([db.getHistory(), db.getProfiles()]);
      if (h) setHistory(h);
      if (p) setProfiles(p);
    });
  }, []);

  const handleAppLanguageChange = (lang: Language) => {
    setAppLanguage(lang);
    localStorage.setItem(STORAGE_KEY_APP_LANG, lang);
  };

  const handleBriefChange = useCallback((key: keyof MarketingBrief, value: any) => {
    setBrief(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGoogleLogin = async () => {
    setIsAuthenticating('google');
    setAuthError(null);
    try {
      const newUser = await authService.signInWithGoogle();
      await db.saveUser(newUser);
      setIsLoginModalOpen(false);
      setIsProfileModalOpen(true);
      resetAuthModal();
      analytics.track('login_success', { provider: 'google', name: newUser.name });
    } catch (err: any) {
      console.error("Google login failed", err);
      setAuthError(getFirebaseErrorMessage(err.code, t));
    } finally {
      setIsAuthenticating(null);
    }
  };

  const handleEmailLogin = async () => {
    if (!emailInput || !passwordInput) return;
    setIsAuthenticating('email');
    setAuthError(null);
    try {
      const newUser = await authService.signInWithEmail(emailInput, passwordInput);
      await db.saveUser(newUser);
      setIsLoginModalOpen(false);
      setIsProfileModalOpen(true);
      resetAuthModal();
      analytics.track('login_success', { provider: 'email', email: newUser.email });
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setPendingVerification(true);
        setAuthError(t.auth.emailNotVerified);
      } else {
        setAuthError(getFirebaseErrorMessage(err.code, t));
      }
    } finally {
      setIsAuthenticating(null);
    }
  };

  const handleEmailRegister = async () => {
    if (!emailInput || !passwordInput) return;
    setIsAuthenticating('email');
    setAuthError(null);
    try {
      const { user: newUser, needsVerification } = await authService.registerWithEmail(emailInput, passwordInput);
      await db.saveUser(newUser);
      if (needsVerification) {
        setPendingVerification(true);
        setAuthError(t.auth.verificationSent);
      }
      analytics.track('register_success', { email: newUser.email });
    } catch (err: any) {
      setAuthError(getFirebaseErrorMessage(err.code, t));
    } finally {
      setIsAuthenticating(null);
    }
  };

  const handleResendVerification = async () => {
    setIsAuthenticating('resend');
    try {
      await authService.resendVerificationEmail();
      setAuthError(t.auth.verificationSent);
    } catch (err: any) {
      setAuthError(getFirebaseErrorMessage(err.code, t));
    } finally {
      setIsAuthenticating(null);
    }
  };

  const resetAuthModal = () => {
    setAuthMode('select');
    setEmailInput('');
    setPasswordInput('');
    setAuthError(null);
    setPendingVerification(false);
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch(e) {}
    
    // Optimistic Update
    setIsProfileModalOpen(false);
    analytics.track('profile_updated', { userId: updatedUser.id });

    // Background Sync
    await db.saveUser(updatedUser);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Logout error", e);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const handleGenerate = async () => {
    setStatus(GenerationStatus.IDLE); // Clear UI results before start
    setConcepts([]);
    setStatus(GenerationStatus.LOADING);
    setError(null);

    // DEBUG: Log what's being sent to API
    console.log('[FRONTEND-DEBUG] Brief being sent:', JSON.stringify(brief, null, 2));
    console.log('[FRONTEND-DEBUG] targetScores:', brief.targetScores);

    try {
      const results = await generateViralHooks(brief);
      setConcepts(results);
      setStatus(GenerationStatus.SUCCESS);
      const newItem = { id: Date.now().toString(), timestamp: Date.now(), concepts: results, brief: { ...brief } };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
      setActiveHistoryId(newItem.id);
      
      await db.saveHistoryItem(newItem);
      
      analytics.track('generate_hooks', { 
        count: results.length, 
        language: brief.language,
        userId: user?.id || 'anonymous'
      });
      
    } catch (e: any) {
      console.error("Generation Error:", e);
      let msg = e.message || t.errors.engineError;
      if (e.message === "MISSING_API_KEY") msg = t.errors.missingKey;
      if (e.message === "INVALID_PROVIDER_OPENAI") msg = t.errors.invalidProviderOpenAI;
      setError(msg);
      setStatus(GenerationStatus.ERROR);
    }
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem(STORAGE_KEY_THEME, next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black relative selection:bg-purple-500/30 font-sans transition-colors duration-1000 pb-20">
      <ConsentBanner t={t} />
      <div className="fixed inset-0 pointer-events-none neuro-grid opacity-30"></div>
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-600/5 rounded-full blur-[120px] animate-float opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[100px] animate-pulse-fast opacity-30"></div>
      </div>

      <nav className="sticky top-0 z-[60] glass bg-white/90 dark:bg-black/90 border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 py-3 md:py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo text={t.nav.logoText} />
          <div className="flex items-center gap-2 md:gap-4">

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setIsWhyHookaOpen(true)}
                className="px-3 py-2 text-[10px] font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg uppercase tracking-widest transition-all"
              >
                {t.nav.whyHooka}
              </button>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-3 py-2 text-[10px] font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg uppercase tracking-widest transition-all"
              >
                {t.nav.pricing}
              </button>
            </div>

            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>

            {/* Language Switcher */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800">
              {(['DE', 'EN'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleAppLanguageChange(lang)}
                  className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
                    appLanguage === lang
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
              {isDark ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" fill="none" stroke="currentColor" strokeWidth="2"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>

            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800"></div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-right-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[11px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">{user.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setIsProfileModalOpen(true)} className="text-[9px] font-bold text-zinc-400 hover:text-purple-500 uppercase tracking-wider transition-colors">{t.nav.editProfile}</button>
                    <span className="text-zinc-300 dark:text-zinc-700">|</span>
                    <button onClick={handleLogout} className="text-[9px] font-bold text-zinc-400 hover:text-red-500 uppercase tracking-wider transition-colors">{t.nav.logout}</button>
                  </div>
                </div>
                <button onClick={() => setIsProfileModalOpen(true)} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black haptic-btn transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="px-4 py-2 md:px-5 md:py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest haptic-btn shadow-lg transition-all hover:scale-105 active:scale-95">
                {t.nav.vaultAccess}
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-12 md:space-y-20 relative z-10">
        <div className="text-center space-y-6 md:space-y-8 py-4 md:py-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <span className="text-[9px] md:text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] md:tracking-[0.35em] antialiased">{t.hero.badge}</span>
          </div>
          <div className="space-y-0">
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase flex flex-col items-center antialiased">
              <span className="text-zinc-900 dark:text-white">{t.hero.titleLine1}</span>
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
                {t.hero.titleLine2}
              </span>
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 text-sm md:text-lg font-medium leading-relaxed tracking-tight px-2 md:px-4 antialiased">
            {t.hero.subtitleLine1} <br className="hidden md:block"/>
            {t.hero.subtitleLine2}
          </p>
        </div>

        {/* Tutorial Section */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] antialiased flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              {t.tutorial.headline}
            </h3>
            <div className="h-px flex-grow bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <TutorialCard step="Phase 01" title={t.tutorial.step1.title} desc={t.tutorial.step1.desc} />
            <TutorialCard step="Phase 02" title={t.tutorial.step2.title} desc={t.tutorial.step2.desc} />
            <TutorialCard step="Phase 03" title={t.tutorial.step3.title} desc={t.tutorial.step3.desc} />
          </div>
        </div>
        
        {error && status === GenerationStatus.ERROR && (
          <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/50 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-top-4">
             <div className="flex gap-4">
               <div className="shrink-0 text-red-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               </div>
               <div className="space-y-2">
                 <h3 className="font-black text-red-500 uppercase tracking-widest text-sm">System Error</h3>
                 <p className="text-zinc-800 dark:text-zinc-200 text-sm whitespace-pre-wrap font-medium">{error}</p>
               </div>
             </div>
          </div>
        )}

        <div className="space-y-10 md:space-y-14">
          <div className="glass bg-white/60 dark:bg-zinc-900/40 p-4 md:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ProfileManager 
              profiles={profiles} 
              currentBrief={brief}
              t={t}
              onSave={async (n) => {
                const p = { id: Date.now().toString(), name: n, brief: { ...brief } };
                setProfiles(prev => [p, ...prev]);
                await db.saveProfile(p);
              }} 
              onLoad={(p) => setBrief(p.brief)} 
              onDelete={async (id) => {
                setProfiles(prev => prev.filter(x => x.id !== id));
                await db.deleteProfile(id);
              }} 
            />
          </div>
          <BriefEditor brief={brief} onChange={handleBriefChange} onAutoFill={(d) => setBrief(prev => ({...prev, ...d}))} disabled={status === GenerationStatus.LOADING} t={t} />
          <div className="flex justify-center py-2 md:py-6">
            <button 
              onClick={handleGenerate} 
              disabled={status === GenerationStatus.LOADING}
              className={`group relative overflow-hidden w-full md:w-auto px-8 py-5 md:px-20 md:py-8 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all duration-700 antialiased ${
                status === GenerationStatus.LOADING ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-wait' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_80px_-20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center">
                {status === GenerationStatus.LOADING ? (
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.briefing.generateButton.loading}</span>
                  </div>
                ) : t.briefing.generateButton.idle}
              </div>

              {status !== GenerationStatus.LOADING && (
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition duration-1000"></div>
              )}
            </button>
          </div>
        </div>

        {status === GenerationStatus.SUCCESS && concepts.length > 0 && (
          <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-20 duration-1000 pt-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter antialiased">{t.results.headline}</h2>
              <div className="h-px w-full flex-grow bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {concepts.map((c, i) => (
                <div key={i} className={`animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both`} style={{ animationDelay: `${i * 150}ms` }}>
                  <ConceptCard concept={c} index={i} t={t} />
                </div>
              ))}
            </div>
          </div>
        )}

        <HistoryList history={history} t={t} onSelect={(item) => {
          setConcepts(item.concepts);
          setBrief(item.brief);
          setActiveHistoryId(item.id);
          setStatus(GenerationStatus.SUCCESS);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} activeId={activeHistoryId} />
      </main>

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => !isAuthenticating && (setIsLoginModalOpen(false), resetAuthModal())} />
          <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-10 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8 md:mb-10">
              <div className="flex justify-center mb-6">
                <Logo text={t.nav.logoText} />
              </div>
              <h2 className="mt-6 text-xl md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                {isAuthenticating ? t.auth.authenticatingTitle : t.auth.modalTitle}
              </h2>
              <p className="text-zinc-500 text-xs mt-3 font-bold tracking-widest uppercase">
                {isAuthenticating ? `${t.auth.connecting}...` : t.auth.modalSubtitle}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${pendingVerification ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'}`}>
                {authError}
                {pendingVerification && (
                  <button
                    onClick={handleResendVerification}
                    disabled={isAuthenticating === 'resend'}
                    className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isAuthenticating === 'resend' ? '...' : t.auth.resendVerification}
                  </button>
                )}
              </div>
            )}

            {/* Auth Mode: Select */}
            {authMode === 'select' && !pendingVerification && (
              <div className="space-y-3">
                {/* Google Button */}
                <button
                  disabled={!!isAuthenticating}
                  onClick={handleGoogleLogin}
                  className={`w-full py-3.5 md:py-4 px-6 border rounded-lg flex items-center justify-between transition-all font-bold text-xs uppercase tracking-widest shadow-sm group haptic-btn ${
                    isAuthenticating === 'google'
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className={isAuthenticating === 'google' ? '' : 'text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors'}>
                    {isAuthenticating === 'google' ? t.auth.synchronizing : `${t.auth.continueWith} Google`}
                  </span>
                  {isAuthenticating === 'google' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.auth.orContinueWith}</span>
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                {/* Email Options */}
                <button
                  onClick={() => setAuthMode('email-login')}
                  className="w-full py-3.5 md:py-4 px-6 border rounded-lg flex items-center justify-between transition-all font-bold text-xs uppercase tracking-widest shadow-sm group haptic-btn bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    {t.auth.loginButton} (Email)
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>

                <button
                  onClick={() => setAuthMode('email-register')}
                  className="w-full py-3.5 md:py-4 px-6 border rounded-lg flex items-center justify-between transition-all font-bold text-xs uppercase tracking-widest shadow-sm group haptic-btn bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800"
                >
                  <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    {t.auth.createAccount}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Auth Mode: Email Login */}
            {authMode === 'email-login' && !pendingVerification && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t.auth.emailLabel}</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="email@example.com"
                    disabled={!!isAuthenticating}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t.auth.passwordLabel}</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="********"
                    disabled={!!isAuthenticating}
                  />
                </div>
                <button
                  onClick={handleEmailLogin}
                  disabled={!!isAuthenticating || !emailInput || !passwordInput}
                  className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating === 'email' ? t.auth.synchronizing : t.auth.loginButton}
                </button>
                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setAuthMode('select')} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 uppercase tracking-widest">
                    {t.auth.backToOptions}
                  </button>
                  <button onClick={() => setAuthMode('email-register')} className="text-[10px] font-bold text-purple-500 hover:text-purple-600 uppercase tracking-widest">
                    {t.auth.noAccount}
                  </button>
                </div>
              </div>
            )}

            {/* Auth Mode: Email Register */}
            {authMode === 'email-register' && !pendingVerification && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t.auth.emailLabel}</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="email@example.com"
                    disabled={!!isAuthenticating}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t.auth.passwordLabel}</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailRegister()}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Min. 6 characters"
                    disabled={!!isAuthenticating}
                  />
                </div>
                <button
                  onClick={handleEmailRegister}
                  disabled={!!isAuthenticating || !emailInput || !passwordInput}
                  className="w-full py-4 bg-purple-600 text-white rounded-lg font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating === 'email' ? t.auth.synchronizing : t.auth.registerButton}
                </button>
                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setAuthMode('select')} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 uppercase tracking-widest">
                    {t.auth.backToOptions}
                  </button>
                  <button onClick={() => setAuthMode('email-login')} className="text-[10px] font-bold text-purple-500 hover:text-purple-600 uppercase tracking-widest">
                    {t.auth.alreadyHaveAccount}
                  </button>
                </div>
              </div>
            )}

            {/* Pending Verification */}
            {pendingVerification && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.auth.verificationSent}</p>
                <button
                  onClick={() => { resetAuthModal(); setAuthMode('email-login'); }}
                  className="text-sm font-bold text-purple-500 hover:text-purple-600"
                >
                  {t.auth.loginButton}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isProfileModalOpen && user && (
        <ProfileEditModal user={user} t={t} onClose={() => setIsProfileModalOpen(false)} onSave={handleUpdateProfile} />
      )}

      <footer className="max-w-7xl mx-auto px-6 py-10 md:py-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <Logo text={t.nav.logoText} />
            <div className="hidden md:block h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">{t.company.copyright}</p>
              <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded text-[8px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-wider border border-zinc-200 dark:border-zinc-800">V1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <button onClick={() => setIsWhyHookaOpen(true)} className="text-[9px] font-bold text-zinc-400 hover:text-purple-500 transition-colors uppercase tracking-wider">{t.nav.whyHooka}</button>
            <button onClick={() => setIsPricingOpen(true)} className="text-[9px] font-bold text-zinc-400 hover:text-purple-500 transition-colors uppercase tracking-wider">{t.nav.pricing}</button>
            <span className="text-zinc-200 dark:text-zinc-800 hidden md:inline">|</span>
            <button onClick={() => setIsImpressumOpen(true)} className="text-[9px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors uppercase tracking-wider">{t.nav.impressum}</button>
            <button onClick={() => setIsPrivacyOpen(true)} className="text-[9px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors uppercase tracking-wider">{t.nav.privacy}</button>
            {/* Secret Admin Button */}
            <button onClick={() => setIsAdminOpen(true)} className="text-zinc-200 dark:text-zinc-800 hover:text-purple-500 transition-colors ml-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </button>
          </div>
        </div>
      </footer>
      <ImpressumModal isOpen={isImpressumOpen} t={t} onClose={() => setIsImpressumOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} t={t} onClose={() => setIsPrivacyOpen(false)} />
      <AdminModal isOpen={isAdminOpen} t={t} onClose={() => setIsAdminOpen(false)} />
      <PricingPage
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        t={t}
        user={user}
        quota={{ usedGenerations: 0, limit: 10, isPremium: user?.unlimitedStatus || false }}
        onLoginRequired={() => { setIsPricingOpen(false); setIsLoginModalOpen(true); }}
      />
      <WhyHookaPage
        isOpen={isWhyHookaOpen}
        onClose={() => setIsWhyHookaOpen(false)}
        t={t}
      />
    </div>
  );
};
export default App;
