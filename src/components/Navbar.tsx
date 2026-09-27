import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, LayoutDashboard, Settings, User, Menu, X, Sparkles, LogIn, UserPlus, LogOut, ShieldAlert, FileText 
} from 'lucide-react';
import { ViewMode, AdminUser } from '../types';
import { isUserAdmin } from '../utils/userSync';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onRequestPlanClick: () => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
  onOpenOrders?: () => void;
  onOpenAccount?: () => void;
}

export function Navbar({ currentView, onViewChange, onRequestPlanClick, currentUser, onLogout, onOpenOrders, onOpenAccount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Strict admin verification: only true if user is logged in with Admin role
  const isAdmin = isUserAdmin(currentUser);

  const handleDashboardClick = () => {
    if (!currentUser) {
      onViewChange('login');
    } else if (onOpenAccount) {
      onOpenAccount();
    } else {
      onViewChange('dashboard');
    }
  };

  const handleOrdersClick = () => {
    if (!currentUser) {
      onViewChange('login');
    } else if (onOpenOrders) {
      onOpenOrders();
    } else {
      onViewChange('dashboard');
    }
  };

  const handleAdminClick = () => {
    if (!currentUser) {
      onViewChange('login');
    } else if (isAdmin) {
      onViewChange('admin');
    } else {
      onViewChange('public');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onViewChange('public')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Rocket className="w-6 h-6 text-purple-400 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              ASTRO<span className="text-purple-500">CLOUDE</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-purple-400/80 font-semibold">
              Next-Gen Cloud Infrastructure
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <button
            onClick={() => onViewChange('public')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              currentView === 'public'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home & Services
          </button>

          {/* Logged in user options: My Account & My Orders */}
          {currentUser && (
            <>
              <button
                onClick={handleDashboardClick}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Account</span>
              </button>

              <button
                onClick={handleOrdersClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>My Orders</span>
              </button>
            </>
          )}

          {/* Show Admin tab ONLY for verified Admin users */}
          {isAdmin && (
            <button
              onClick={handleAdminClick}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                currentView === 'admin'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Control</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30">
                PRO
              </span>
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onRequestPlanClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buy Now</span>
          </button>

          {currentUser ? (
            /* Logged In User Indicator & Logout */
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div 
                onClick={() => onViewChange('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-purple-400 font-medium">
                    {isAdmin ? 'Administrator' : `@${currentUser.username || 'user'}`}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            /* Not Logged In - Sign In & Register Buttons */
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <button
                onClick={() => onViewChange('login')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'login'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onViewChange('register')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'register'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-purple-500/20 bg-slate-950/95 px-4 py-6 space-y-3 backdrop-blur-2xl"
          >
            {currentUser && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-purple-400">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[11px] font-semibold"
                >
                  Logout
                </button>
              </div>
            )}

            <button
              onClick={() => { onViewChange('public'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                currentView === 'public' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-white/5'
              }`}
            >
              Home & Services
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => { handleDashboardClick(); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                    currentView === 'dashboard' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-white/5'
                  }`}
                >
                  My Account
                </button>

                <button
                  onClick={() => { handleOrdersClick(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-300 bg-white/5 flex items-center justify-between"
                >
                  <span>My Orders</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </button>
              </>
            )}

            {/* Admin option only shown if logged-in account has admin role */}
            {isAdmin && (
              <button
                onClick={() => { handleAdminClick(); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  currentView === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-white/5'
                }`}
              >
                Admin Control Panel
              </button>
            )}

            <button
              onClick={() => { onRequestPlanClick(); setMobileMenuOpen(false); }}
              className="w-full text-center py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600"
            >
              Buy Now
            </button>

            {!currentUser && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => { onViewChange('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </button>
                <button
                  onClick={() => { onViewChange('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 text-center flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
