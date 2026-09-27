import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser } from '../utils/userSync';
import { ViewMode } from '../types';

interface LoginPageProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  redirectTarget?: ViewMode;
}

export function LoginPage({ onNavigate, onShowToast, redirectTarget = 'public' }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(identifier, password);
      if (!res.success || !res.user) {
        setError(res.error || 'Invalid login credentials.');
        setLoading(false);
        return;
      }

      onShowToast(`Welcome back, ${res.user.name}!`, 'success');
      
      // Requirement 1 & 9: Redirect directly to the website Home page ('public')
      // Do NOT redirect directly to User Dashboard or Admin Dashboard
      if (redirectTarget === 'checkout') {
        onNavigate('checkout');
      } else {
        onNavigate('public');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 mb-4">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Sign in to manage your services, billing, and support.
          </p>
        </div>

        {/* Checkout Redirect Notice */}
        {redirectTarget === 'checkout' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-start gap-3 text-xs text-purple-200"
          >
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Plan Purchase Authentication</span>
              <span>Please login or register to purchase a plan. You will be redirected straight to checkout.</span>
            </div>
          </motion.div>
        )}

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email or Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email or Username <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or email address"
                required
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password <span className="text-purple-400">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In to AstroCloude</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4"
          >
            Create an account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
