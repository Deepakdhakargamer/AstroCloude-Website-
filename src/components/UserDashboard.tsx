import React, { useState, useEffect } from 'react';
import { AdminSupportTicket, AdminTicketMessage, AdminUser } from '../types';
import { getStoredTickets, saveStoredTickets } from '../utils/ticketSync';
import { getStoredCategories } from '../utils/categorySync';
import { getStoredPlans } from '../utils/planSync';
import { updateUser, resetUserPassword } from '../utils/userSync';
import { UserTicketsTab } from './UserTicketsTab';
import { UserOrdersTab } from './UserOrdersTab';
import { motion } from 'motion/react';
import { 
  User, Shield, Key, Sparkles, CheckCircle2, Moon, Sun, 
  FileText, Ticket, LogOut, Lock, AlertCircle, Save 
} from 'lucide-react';

interface UserDashboardProps {
  onRequestPlanClick: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  selectedTheme: 'neon-purple' | 'obsidian-black' | 'cyberpunk' | 'midnight-blue';
  setSelectedTheme: (theme: 'neon-purple' | 'obsidian-black' | 'cyberpunk' | 'midnight-blue') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  currentUser: AdminUser;
  onLogout: () => void;
  initialTab?: 'profile' | 'tickets' | 'orders';
  onNavigateHome?: () => void;
}

export function UserDashboard({ 
  onRequestPlanClick, 
  onShowToast, 
  selectedTheme, 
  setSelectedTheme, 
  accentColor, 
  setAccentColor,
  currentUser,
  onLogout,
  initialTab = 'profile',
  onNavigateHome
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets' | 'orders'>(initialTab);
  const [userName, setUserName] = useState(currentUser.name || '');
  const [userEmail, setUserEmail] = useState(currentUser.email || '');
  const [tickets, setTickets] = useState<AdminSupportTicket[]>(() => getStoredTickets());
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [plans, setPlans] = useState(() => getStoredPlans());

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    setUserName(currentUser.name || '');
    setUserEmail(currentUser.email || '');
  }, [currentUser]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      onShowToast('Name and email cannot be empty', 'error');
      return;
    }
    try {
      await updateUser(currentUser.id, {
        name: userName.trim(),
        email: userEmail.trim().toLowerCase()
      });
      onShowToast('Profile settings saved successfully!', 'success');
    } catch {
      onShowToast('Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      onShowToast('Please enter a new password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      onShowToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Passwords do not match', 'error');
      return;
    }

    setPassLoading(true);
    try {
      const ok = await resetUserPassword(currentUser.id, newPassword);
      if (ok) {
        onShowToast('Password updated securely with PBKDF2 hash!', 'success');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        onShowToast('Failed to update password', 'error');
      }
    } finally {
      setPassLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900/80 border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-500/40 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-purple-600/30">
              {getInitials(currentUser.name)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
              <span className="text-[10px] text-purple-400 font-medium block truncate">
                @{currentUser.username || 'client'} &bull; {currentUser.role || 'User'}
              </span>
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
                <span>Profile & Security</span>
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
                <span>Billing & Orders</span>
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
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="px-2 text-[11px] text-slate-500">
            Account Status:{' '}
            <span className="text-emerald-400 font-semibold capitalize">{currentUser.status || 'Active'}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
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
              {activeTab === 'profile' ? 'Profile & Security' : activeTab === 'tickets' ? 'Support Tickets' : 'Billing & Orders'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {activeTab === 'profile' 
                ? 'Update your personal credentials, secure your password, and view your account ID.'
                : activeTab === 'tickets'
                ? 'Submit issues, chat with customer support, and track resolutions.'
                : 'Track recent orders, view admin notes, and verify plan status.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-lg shadow-black/20 text-xs text-slate-300 font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Authenticated as {currentUser.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl">
            <UserOrdersTab currentUser={currentUser} onBrowsePlans={onRequestPlanClick} />
          </motion.div>
        )}
        
        {/* TAB: TICKETS */}
        {activeTab === 'tickets' && (
          <UserTicketsTab 
            tickets={tickets.filter(t => t.userEmail.toLowerCase() === currentUser.email.toLowerCase())}
            allTickets={tickets}
            categories={categories}
            plans={plans}
            userName={currentUser.name}
            userEmail={currentUser.email}
            onUpdate={updateTicketsAndSync}
            onShowToast={onShowToast}
          />
        )}

        {/* TAB: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            {/* Personal Details */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Username</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.username || ''}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Account Role</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.role || 'Standard User'}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Change Password
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Update your account password. All passwords are encrypted with salted PBKDF2 hashing.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passLoading || !newPassword}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <Key className="w-4 h-4" />
                    <span>{passLoading ? 'Encrypting & Updating...' : 'Update Password'}</span>
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
