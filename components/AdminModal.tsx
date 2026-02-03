
import React, { useState, useEffect } from 'react';
import { getAdminPrompt, saveAdminPrompt, getAdminStats, verifyAdminPassword, getAdminUsers, getPromoCodes, generatePromoCode, toggleUserPaid, toggleUserUnlimited, AdminUser, PromoCode } from '../services/gemini.ts';
import { TranslationObject } from '../types.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationObject;
}

interface AdminStats {
  userCount: number;
  historyCount: number;
  apiCalls: number;
  tokenCount?: number;
}

type TabType = 'stats' | 'users' | 'codes' | 'prompt';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, t }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [stats, setStats] = useState<AdminStats>({ userCount: 0, historyCount: 0, apiCalls: 0, tokenCount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  // New state for user management
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsAuthenticated(false);
      setStatus('');
      setActiveTab('stats');
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await verifyAdminPassword(password);

      if (isValid) {
        setIsAuthenticated(true);
        await loadDashboardData();
      } else {
        setStatus('ACCESS DENIED. INVALID CREDENTIALS.');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch (e) {
      setStatus('CONNECTION ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [p, s, u, c] = await Promise.all([
        getAdminPrompt().catch(() => ""),
        getAdminStats(password).catch(() => ({ userCount: 0, historyCount: 0, apiCalls: 0, tokenCount: 0 })),
        getAdminUsers(password).catch(() => []),
        getPromoCodes(password).catch(() => [])
      ]);
      setPrompt(p);
      setStats(s);
      setUsers(u);
      setPromoCodes(c);
    } catch (e) {
      setStatus('DB CONNECTION ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setStatus('UPLOADING TO NEURAL CORE...');
    try {
      await saveAdminPrompt(password, prompt);
      setStatus('ALGORITHM SUCCESSFULLY RETRAINED.');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('WRITE ERROR. CHECK LOGS.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setGeneratingCode(true);
    try {
      const code = await generatePromoCode(password);
      setPromoCodes(prev => [{ id: Date.now().toString(), code, createdAt: Date.now(), usedBy: null, usedAt: null }, ...prev]);
      setCopiedCode(code);
      await navigator.clipboard.writeText(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (e) {
      setStatus('CODE GENERATION FAILED');
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTogglePaid = async (userId: string) => {
    try {
      await toggleUserPaid(password, userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, paid: !u.paid } : u));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUnlimited = async (userId: string) => {
    try {
      await toggleUserUnlimited(password, userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, unlimitedStatus: !u.unlimitedStatus } : u));
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'stats', label: 'STATS' },
    { id: 'users', label: 'USERS' },
    { id: 'codes', label: 'CODES' },
    { id: 'prompt', label: 'AI PROMPT' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black font-mono text-green-500 overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAABlBMVEUAAAD///+l2Z/dAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAE0lEQVQImWP4////fwYGBgYGBgAz/wL+I0oK2QAAAABJRU5ErkJggg==')] opacity-20 bg-repeat z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent z-0 animate-pulse"></div>

      <div className="relative z-10 w-full h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-green-500/50 pb-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-widest text-green-500 glitch-text">
              {t.admin.title}
            </h1>
            <p className="text-xs md:text-sm text-green-800 mt-2 tracking-[0.5em] uppercase">
              {t.admin.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-green-700 hover:text-green-400 hover:bg-green-900/20 px-4 py-2 border border-green-800 hover:border-green-500 transition-all uppercase text-xs font-bold tracking-widest"
          >
            [ {t.admin.disconnect} ]
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-md border border-green-500/30 p-8 bg-black/50 backdrop-blur-sm relative shadow-[0_0_100px_rgba(34,197,94,0.1)]">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>

              <h2 className="text-center text-xl font-bold mb-8 animate-pulse text-green-400">{t.admin.authReq}</h2>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-green-800 text-xs tracking-[0.2em]">{t.admin.accessKey}</label>
                  <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border-b border-green-800 focus:border-green-500 text-green-500 py-2 outline-none tracking-[0.5em] font-bold text-center text-xl placeholder-green-900 transition-all focus:bg-green-900/10"
                    placeholder="******"
                  />
                </div>
                {status && <div className="text-red-500 text-xs font-bold animate-pulse text-center">&gt;&gt; {status}</div>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-900/20 border border-green-500/50 text-green-500 py-4 hover:bg-green-500 hover:text-black transition-all font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-wait relative overflow-hidden group"
                >
                  <span className="relative z-10">{isLoading ? t.admin.decrypting : t.admin.initiate}</span>
                  <div className="absolute inset-0 bg-green-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-green-900/50 pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all border ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-black border-green-500'
                      : 'border-green-800 text-green-700 hover:border-green-500 hover:text-green-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-grow overflow-hidden">
              {activeTab === 'stats' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-900/5 border border-green-500/20 p-6">
                    <div className="text-green-800 text-[10px] uppercase tracking-wider mb-1">{t.admin.users}</div>
                    <div className="text-4xl font-black text-green-400">{stats.userCount}</div>
                  </div>
                  <div className="bg-green-900/5 border border-green-500/20 p-6">
                    <div className="text-green-800 text-[10px] uppercase tracking-wider mb-1">{t.admin.hooks}</div>
                    <div className="text-4xl font-black text-green-400">{stats.historyCount}</div>
                  </div>
                  <div className="bg-green-900/5 border border-green-500/20 p-6">
                    <div className="text-green-800 text-[10px] uppercase tracking-wider mb-1">{t.admin.tokens}</div>
                    <div className="text-4xl font-black text-green-400">
                      {stats.tokenCount ? (stats.tokenCount / 1000).toFixed(1) + 'k' : '0'}
                    </div>
                  </div>
                  <div className="bg-green-900/5 border border-green-500/20 p-6">
                    <div className="text-green-800 text-[10px] uppercase tracking-wider mb-1">{t.admin.throughput}</div>
                    <div className="text-4xl font-black text-green-400">{stats.apiCalls}</div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="h-full overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-black">
                      <tr className="border-b border-green-900/50 text-green-700 uppercase tracking-wider">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-center p-3">Gens</th>
                        <th className="text-center p-3">Paid</th>
                        <th className="text-center p-3">Unlimited</th>
                        <th className="text-left p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-green-900/30 hover:bg-green-900/10">
                          <td className="p-3 text-green-400 font-bold">{user.name}</td>
                          <td className="p-3 text-green-600">{user.email}</td>
                          <td className="p-3 text-center text-green-400 font-bold">{user.generationCount}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleTogglePaid(user.id)}
                              className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                user.paid
                                  ? 'bg-green-500 text-black border-green-500'
                                  : 'border-green-800 text-green-800 hover:border-green-500'
                              }`}
                            >
                              {user.paid ? 'YES' : 'NO'}
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleUnlimited(user.id)}
                              className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                user.unlimitedStatus
                                  ? 'bg-purple-500 text-black border-purple-500'
                                  : 'border-green-800 text-green-800 hover:border-purple-500'
                              }`}
                            >
                              {user.unlimitedStatus ? 'YES' : 'NO'}
                            </button>
                          </td>
                          <td className="p-3 text-green-700">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-green-800">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'codes' && (
                <div className="h-full flex flex-col">
                  {/* Generate Button */}
                  <div className="mb-6">
                    <button
                      onClick={handleGenerateCode}
                      disabled={generatingCode}
                      className="px-6 py-3 bg-green-600 text-black font-bold tracking-widest hover:bg-green-500 disabled:opacity-50 uppercase text-xs flex items-center gap-2"
                    >
                      {generatingCode ? (
                        <>
                          <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          GENERATING...
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          GENERATE NEW CODE
                        </>
                      )}
                    </button>
                  </div>

                  {/* Codes List */}
                  <div className="flex-grow overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-black">
                        <tr className="border-b border-green-900/50 text-green-700 uppercase tracking-wider">
                          <th className="text-left p-3">Code</th>
                          <th className="text-left p-3">Created</th>
                          <th className="text-center p-3">Status</th>
                          <th className="text-left p-3">Used By</th>
                          <th className="text-left p-3">Used At</th>
                          <th className="text-center p-3">Copy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promoCodes.map(code => (
                          <tr key={code.id} className="border-b border-green-900/30 hover:bg-green-900/10">
                            <td className="p-3 font-bold text-green-400 font-mono tracking-wider">{code.code}</td>
                            <td className="p-3 text-green-700">{formatDate(code.createdAt)}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 text-[10px] font-bold uppercase ${
                                code.usedBy
                                  ? 'bg-red-900/30 text-red-500 border border-red-900/50'
                                  : 'bg-green-900/30 text-green-500 border border-green-900/50'
                              }`}>
                                {code.usedBy ? 'USED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="p-3 text-green-600">{code.usedBy || '-'}</td>
                            <td className="p-3 text-green-700">{code.usedAt ? formatDate(code.usedAt) : '-'}</td>
                            <td className="p-3 text-center">
                              {!code.usedBy && (
                                <button
                                  onClick={() => handleCopyCode(code.code)}
                                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-green-800 text-green-700 hover:border-green-500 hover:text-green-500 transition-all"
                                >
                                  {copiedCode === code.code ? 'COPIED!' : 'COPY'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {promoCodes.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-green-800">No promo codes generated yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'prompt' && (
                <div className="h-full flex flex-col border border-green-500/30 bg-black relative">
                  <div className="absolute top-0 left-0 bg-green-500 text-black text-[10px] font-bold px-2 py-1">{t.admin.editMode}</div>
                  <div className="p-4 border-b border-green-500/20 flex justify-between items-center mt-4">
                     <label className="text-xs text-green-600 tracking-widest uppercase">
                       {t.admin.instructions}
                     </label>
                     <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-green-500">{t.admin.live}</span>
                     </div>
                  </div>

                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow bg-black text-green-400 p-6 outline-none text-sm leading-relaxed font-mono resize-none focus:bg-green-900/5 transition-colors scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent"
                    placeholder={t.admin.placeholder}
                    spellCheck={false}
                  />

                  <div className="p-4 border-t border-green-500/30 flex justify-between items-center bg-green-900/5">
                     <div className="text-green-500 text-xs font-bold">
                       {status && <span>&gt;&gt; {status}</span>}
                     </div>
                     <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-8 py-3 bg-green-600 text-black font-bold tracking-widest hover:bg-green-500 disabled:opacity-50 uppercase text-xs"
                    >
                      {isLoading ? t.admin.compiling : t.admin.commit}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
