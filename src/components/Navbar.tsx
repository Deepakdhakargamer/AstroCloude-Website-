import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, Shield, Server, LayoutDashboard, Settings, User, Menu, X, Sparkles, Activity } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onRequestPlanClick: () => void;
}

export function Navbar({ currentView, onViewChange, onRequestPlanClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20">
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
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Client Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              currentView === 'admin'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Control</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>All Nodes Operational</span>
          </div>

          <button
            onClick={onRequestPlanClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-purple-500/20 bg-slate-950/95 px-4 py-6 space-y-3 backdrop-blur-2xl"
        >
          <button
            onClick={() => { onViewChange('public'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
              currentView === 'public' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-white/5'
            }`}
          >
            Home & Services
          </button>
          <button
            onClick={() => { onViewChange('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
              currentView === 'dashboard' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-white/5'
            }`}
          >
            Client Dashboard
          </button>
          <button
            onClick={() => { onViewChange('admin'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
              currentView === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-300 bg-white/5'
            }`}
          >
            Admin Control Panel
          </button>
          <button
            onClick={() => { onRequestPlanClick(); setMobileMenuOpen(false); }}
            className="w-full text-center py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Buy Now
          </button>
        </motion.div>
      )}
    </header>
  );
}
