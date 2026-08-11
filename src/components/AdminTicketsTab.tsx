import React, { useState } from 'react';
import { AdminSupportTicket, AdminTicketMessage } from '../types';
import { Search, MessageSquare, Send, ArrowLeft, Clock, AlertCircle, CheckCircle2, Ticket, Activity , ChevronDown} from "lucide-react";
import { motion } from 'motion/react';

interface AdminTicketsTabProps {
  tickets: AdminSupportTicket[];
  onUpdate: (tickets: AdminSupportTicket[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminTicketsTab({ tickets, onUpdate, onShowToast }: AdminTicketsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'view'>('list');
  const [activeTicket, setActiveTicket] = useState<AdminSupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userName.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg: AdminTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'support',
      name: 'Support Team',
      text: replyText,
      time: new Date().toLocaleString()
    };

    const updatedTicket = {
      ...activeTicket,
      status: 'in_progress' as const,
      lastUpdated: new Date().toLocaleString(),
      messages: [...activeTicket.messages, newMsg]
    };

    const updatedAll = tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
    onUpdate(updatedAll);
    setActiveTicket(updatedTicket);
    setReplyText('');
    onShowToast('Reply sent to user', 'success');
  };

  const updateTicketStatus = (status: AdminSupportTicket['status']) => {
    if (!activeTicket) return;
    const oldStatus = activeTicket.status;
    const updatedTicket = { ...activeTicket, status, lastUpdated: new Date().toLocaleString() };
    const updatedAll = tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
    onUpdate(updatedAll);
    setActiveTicket(updatedTicket);
    onShowToast(`Ticket status updated to ${status}`, 'success');
    
    if (oldStatus === 'pending' && (status === 'in_progress' || status === 'closed')) {
      onShowToast(`Mock Email Sent: Your ticket is now ${status === 'in_progress' ? 'In Progress' : 'Closed'}.`, 'info');
    }
  };

  if (viewMode === 'view' && activeTicket) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setViewMode('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Tickets
          </button>
          
          <div className="flex items-center gap-2 relative">
            <select
              value={activeTicket.status}
              onChange={(e) => updateTicketStatus(e.target.value as AdminSupportTicket['status'])}
              className="bg-slate-900 border border-white/10 rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 appearance-none"
            >
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[70vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 shrink-0 bg-slate-900/50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{activeTicket.subject}</h2>
                <p className="text-sm text-slate-400">From: {activeTicket.userName} ({activeTicket.userEmail})</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                activeTicket.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                activeTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {activeTicket.status === 'in_progress' ? 'In Progress' : activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
              <span>Ticket #{activeTicket.id}</span>
              <span>•</span>
              <span>Category: {activeTicket.category}</span>
              {activeTicket.relatedPlan && (
                <>
                  <span>•</span>
                  <span>Plan: {activeTicket.relatedPlan}</span>
                </>
              )}
              <span>•</span>
              <span className={`font-semibold ${
                activeTicket.priority === 'urgent' ? 'text-rose-400' :
                activeTicket.priority === 'high' ? 'text-orange-400' : ''
              }`}>
                Priority: {activeTicket.priority.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-950/30">
            {activeTicket.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === 'support' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold opacity-70">
                    <span className="capitalize">{msg.name}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="p-6 border-t border-white/10 shrink-0 bg-slate-900/50">
            <form onSubmit={handleReply} className="flex gap-4">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your response to the user..."
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none h-14"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const pendingTicketsCount = tickets.filter(t => t.status === 'pending').length;
  const closedTickets = tickets.filter(t => t.status === 'closed');
  
  let avgResolutionHours = 0;
  if (closedTickets.length > 0) {
    let totalMs = 0;
    closedTickets.forEach(t => {
      const created = new Date(t.createdAt).getTime();
      const resolved = new Date(t.lastUpdated).getTime();
      if (!isNaN(created) && !isNaN(resolved) && resolved > created) {
        totalMs += (resolved - created);
      }
    });
    avgResolutionHours = closedTickets.length > 0 ? (totalMs / closedTickets.length) / (1000 * 60 * 60) : 0;
  }
  const avgFormatted = avgResolutionHours > 0 ? (avgResolutionHours > 24 ? `${(avgResolutionHours / 24).toFixed(1)}d` : `${avgResolutionHours.toFixed(1)}h`) : 'N/A';

  const recentUnresolved = tickets
    .filter(t => t.status === 'open' || t.status === 'pending')
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">Action Needed</span>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{openTicketsCount}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Open Tickets</div>
            </div>
          </div>
          
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{pendingTicketsCount}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Pending Tickets</div>
            </div>
          </div>
          
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{avgFormatted}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Avg Resolution</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-purple-400" />
            Recent Unresolved
          </h3>
          <div className="space-y-3 flex-1">
            {recentUnresolved.length > 0 ? recentUnresolved.map(t => (
              <div key={t.id} onClick={() => { setActiveTicket(t); setViewMode('view'); }} className="group p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-purple-500/30 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate max-w-[150px]">{t.subject}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    t.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>{t.status === 'in_progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">From: {t.userName} • {t.lastUpdated}</div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
                <span className="text-xs">All caught up!</span>
              </div>
            )}
          </div>
        </div>
      </div>

    <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search tickets by ID, Subject, or User..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Tickets Found</h3>
          <p className="text-sm text-slate-400">There are no support tickets matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map(t => (
            <div key={t.id} className="bg-slate-950 border border-white/10 hover:border-purple-500/30 transition-colors rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400">#{t.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  t.status === 'open' ? 'bg-green-950 text-green-400 border border-green-500/20' :
                  t.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                  t.status === 'in_progress' ? 'bg-blue-950 text-blue-400 border border-blue-500/20' :
                  'bg-red-950 text-red-400 border border-red-500/20'
                }`}>
                  {t.status === 'in_progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-white mb-1 truncate">{t.subject}</h3>
                <p className="text-xs text-slate-400 truncate">From: {t.userName} ({t.userEmail})</p>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[10px] text-slate-500">{t.lastUpdated}</span>
                <button 
                  onClick={() => { setActiveTicket(t); setViewMode('view'); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 text-xs font-semibold text-slate-300 transition-colors"
                >
                  View Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
