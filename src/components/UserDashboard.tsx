import React, { useState, useEffect } from 'react';
import { AdminSupportTicket, AdminTicketMessage } from '../types';
import { getStoredTickets, saveStoredTickets } from '../utils/ticketSync';
import { getStoredCategories } from '../utils/categorySync';
import { getStoredPlans } from '../utils/planSync';
import { UserTicketsTab } from './UserTicketsTab';
import { UserOrdersTab } from './UserOrdersTab';
import { motion } from 'motion/react';
import { User, Palette, Shield, Key, Bell, Sparkles, CheckCircle2, Sliders, Moon, Sun, Monitor, Ticket, MessageSquare , FileText } from 'lucide-react';

interface UserDashboardProps {
  onRequestPlanClick: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  selectedTheme: 'neon-purple' | 'obsidian-black' | 'cyberpunk' | 'midnight-blue';
  setSelectedTheme: (theme: 'neon-purple' | 'obsidian-black' | 'cyberpunk' | 'midnight-blue') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export function UserDashboard({ 
  onRequestPlanClick, 
  onShowToast, 
  selectedTheme, 
  setSelectedTheme, 
  accentColor, 
  setAccentColor 
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'tickets' | 'orders'>('profile');
  const [userName, setUserName] = useState('Alex Turner');
  const [userEmail, setUserEmail] = useState('alex.turner@enterprise.io');
  const [compactMode, setCompactMode] = useState(false);
  const [tickets, setTickets] = useState<AdminSupportTicket[]>(() => getStoredTickets());
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [plans, setPlans] = useState(() => getStoredPlans());

  useEffect(() => {
    const handleTicketUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) setTickets((e as CustomEvent).detail);
      else setTickets(getStoredTickets());
    };
    window.addEventListener('astro_tickets_changed', handleTicketUpdate);
    const handleStorage = () => setTickets(getStoredTickets());
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('astro_tickets_changed', handleTicketUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateTicketsAndSync = (newTickets: AdminSupportTicket[]) => {
    setTickets(newTickets);
    saveStoredTickets(newTickets);
  };


  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Profile settings updated successfully!', 'success');
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Theme & appearance preferences saved!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar - strictly Profile & Theme options */}
      <aside className="w-full md:w-64 bg-slate-900/80 border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-base shadow-lg shadow-purple-600/20">
              AT
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{userName}</h4>
              <span className="text-[10px] text-emerald-400 font-medium">VIP Tier Member</span>
            </div>
          </div>

          <div className="pt-2">
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>


              <button
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Support Tickets</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Billing & Invoices</span>
              </button>
            </nav>
          </div>
        </div>


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto space-y-8 bg-slate-950/30 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5 relative">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 capitalize tracking-tight mb-2">
              {activeTab === 'profile' ? 'Profile Management' : activeTab === 'tickets' ? 'Support Tickets' : activeTab === 'orders' ? 'Billing & Invoices' : ''}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {activeTab === 'profile' 
                ? 'Update your personal credentials, security keys, and account preferences.'
                : activeTab === 'tickets'
                ? 'Submit issues and track your ongoing support requests.'
                : activeTab === 'orders'
                ? 'Manage your subscriptions and download past invoices.'
                : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-lg shadow-black/20 text-xs text-slate-300 font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Secure Session Active</span>
            </div>
          </div>
        </div>

                {/* TAB 3: SUPPORT TICKETS */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl">
            <UserOrdersTab />
          </motion.div>
        )}
        
        {activeTab === 'tickets' && (
          <UserTicketsTab 
            tickets={tickets.filter(t => t.userEmail === userEmail)}
            allTickets={tickets}
            categories={categories}
            plans={plans}
            userName={userName}
            userEmail={userEmail}
            onUpdate={updateTicketsAndSync}
            onShowToast={onShowToast}
          />
        )}

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Personal Information
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                      <p className="text-[11px] text-slate-400">Protect your account with Google Authenticator or hardware keys.</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Enabled
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">API Access Token</h4>
                      <p className="text-[11px] text-slate-400 font-mono">astro_live_9982x...4102</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onShowToast('New API token generated!', 'success')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}


      </main>
    </div>
  );
}
