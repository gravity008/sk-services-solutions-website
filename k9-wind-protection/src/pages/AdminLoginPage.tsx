import React, { useState, useEffect } from 'react';
import { PageTab } from '../types';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  Key,
  Database,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveLocalSupabaseCredentials,
} from '../lib/supabase';

interface AdminLoginPageProps {
  onNavigate: (page: PageTab) => void;
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // In-browser config setup state
  const creds = getSupabaseCredentials();
  const [configUrl, setConfigUrl] = useState(creds.url);
  const [configKey, setConfigKey] = useState(creds.anonKey);
  const [configSaved, setConfigSaved] = useState(false);

  const configured = isSupabaseConfigured();

  // Check if already authenticated
  useEffect(() => {
    async function checkCurrentSession() {
      if (!isSupabaseConfigured()) return;
      try {
        const client = getSupabaseClient();
        const { data } = await client.auth.getSession();
        if (data.session) {
          onLoginSuccess();
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      }
    }
    checkCurrentSession();
  }, [onLoginSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured()) {
      setErrorMsg('Backend not configured yet. Please configure your Supabase Project URL and anon public key first.');
      setShowConfigModal(true);
      return;
    }

    setLoading(true);

    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUrl.trim() || !configKey.trim()) {
      setErrorMsg('Both Supabase URL and Anon Key are required.');
      return;
    }

    saveLocalSupabaseCredentials(configUrl, configKey);
    setConfigSaved(true);
    setErrorMsg('');
    setTimeout(() => {
      setShowConfigModal(false);
      setConfigSaved(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#071320] text-white flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#12456B]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E8B84B]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto my-auto">
        {/* Brand header */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#E8B84B]/50 transition-colors mb-4 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#E8B84B]" />
            <span>SK Services &amp; Solutions Ltd</span>
          </button>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Admin <span className="text-[#E8B84B]">Portal</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your administrator account to access leads, manage services, and update testimonials.
          </p>
        </div>

        {/* Configuration status alert banner */}
        {!configured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-[#E8B84B] shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold text-amber-300 text-sm mb-1">
                Backend not configured yet
              </strong>
              <p className="text-slate-300 leading-relaxed mb-2">
                Supabase credentials have not been configured. There is no fallback login. You must configure your Supabase Project URL and anon public key in your <code className="bg-black/40 px-1.5 py-0.5 rounded text-[#E8B84B] font-mono">.env</code> file or click below to enter them.
              </p>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#E8B84B] hover:text-amber-200 underline cursor-pointer"
              >
                <span>Enter Supabase Keys Now &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Box */}
        <div className="bg-[#0B1F33]/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-7 sm:p-8 shadow-2xl">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  disabled={!configured}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#061524] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B] focus:ring-1 focus:ring-[#E8B84B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  disabled={!configured}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#061524] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B] focus:ring-1 focus:ring-[#E8B84B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !configured}
                className="w-full py-3.5 rounded-xl bg-[#E8B84B] hover:bg-[#d6a539] active:scale-[0.99] text-[#0B1F33] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!configured ? (
                  <span>Backend not configured yet</span>
                ) : loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              &larr; Back to Public Website
            </button>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-[#E8B84B] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Supabase Keys</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <span>Protected Route &bull; SK Services &amp; Solutions Ltd Internal System</span>
        </div>
      </div>

      {/* Supabase In-Browser Setup Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0B1F33] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#E8B84B]" />
                <h3 className="text-lg font-bold">Supabase Credentials</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Enter your Supabase Project URL and anon public key from your Supabase Dashboard (<span className="text-[#E8B84B]">Project Settings &rarr; API</span>). You can also put these in your <code className="bg-black/40 px-1 py-0.5 rounded text-[#E8B84B]">.env</code> file as <code className="text-[#E8B84B]">VITE_SUPABASE_URL</code> and <code className="text-[#E8B84B]">VITE_SUPABASE_ANON_KEY</code>.
            </p>

            {configSaved ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Credentials saved! Reloading client...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Anon Public Key (public)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={configKey}
                    onChange={(e) => setConfigKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B] font-mono resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#E8B84B] hover:underline"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#E8B84B] hover:bg-[#d6a539] text-[#0B1F33] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Save &amp; Connect
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
