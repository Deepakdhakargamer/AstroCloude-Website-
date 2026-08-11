import React, { useState } from 'react';
import { AdminSupportTicket, AdminTicketMessage, AdminCategory, AdminHostingPlan } from '../types';
import { MessageSquare, Plus, Send, AlertCircle, ArrowLeft, Ticket , ChevronDown} from "lucide-react";
import { motion } from 'motion/react';

interface UserTicketsTabProps {
  tickets: AdminSupportTicket[];
  allTickets: AdminSupportTicket[];
  categories?: AdminCategory[];
  plans?: AdminHostingPlan[];
  userName: string;
  userEmail: string;
  onUpdate: (tickets: AdminSupportTicket[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function UserTicketsTab({ tickets, allTickets, categories = [], plans = [], userName, userEmail, onUpdate, onShowToast }: UserTicketsTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'view'>('list');
  const [activeTicket, setActiveTicket] = useState<AdminSupportTicket | null>(null);
  
  // Create form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(categories.length > 0 ? categories[0].name : 'Technical Support');
  const [relatedPlan, setRelatedPlan] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [message, setMessage] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newMsg: AdminTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      name: userName,
      text: message,
      time: new Date().toLocaleString()
    };

    const newTicket: AdminSupportTicket = {
      id: `TKT-${Math.floor(Math.random() * 90000) + 10000}`,
      subject,
      category,
      relatedPlan,
      status: 'open',
      priority,
      assignedTo: 'Unassigned',
      userName,
      userEmail,
      createdAt: new Date().toLocaleString(),
      lastUpdated: new Date().toLocaleString(),
      messages: [newMsg]
    };

    onUpdate([...allTickets, newTicket]);
    onShowToast('Support ticket submitted successfully', 'success');
    
    // Reset form
    setSubject('');
    setMessage('');
    setViewMode('list');
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg: AdminTicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      name: userName,
      text: replyText,
      time: new Date().toLocaleString()
    };

    const updatedTicket = {
      ...activeTicket,
      status: 'pending' as const, // pending staff reply
      lastUpdated: new Date().toLocaleString(),
      messages: [...activeTicket.messages, newMsg]
    };

    const updatedAll = allTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
    onUpdate(updatedAll);
    setActiveTicket(updatedTicket);
    setReplyText('');
    onShowToast('Reply sent successfully', 'success');
  };

  if (viewMode === 'create') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button onClick={() => setViewMode('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6">Create Support Ticket</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                placeholder="Briefly describe your issue..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
                <div className="relative">
                  <select
                  value={category}
                  onChange={e => { setCategory(e.target.value); setRelatedPlan(''); }}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  {categories.length > 0 ? categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  )) : (
                    <>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing">Billing & Sales</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Report Abuse">Report Abuse</option>
                    </>
                  )}
                </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Related Plan / Service</label>
                <div className="relative">
                  <select
                  value={relatedPlan}
                  onChange={e => setRelatedPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="">General (No specific plan)</option>
                  {plans.filter(p => p.categoryId === (categories.find(c => c.name === category)?.id)).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Priority</label>
                <div className="relative">
                  <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Message</label>
              <textarea
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 h-32 resize-none"
                placeholder="Please provide detailed information about your issue..."
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-bold text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'view' && activeTicket) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button onClick={() => setViewMode('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>
        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[70vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 shrink-0 bg-slate-900/50">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{activeTicket.subject}</h2>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                activeTicket.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                activeTicket.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {activeTicket.status === 'in_progress' ? 'In Progress' : activeTicket.status.charAt(0).toUpperCase() + activeTicket.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
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
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === 'user' 
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
          {activeTicket.status !== 'closed' && (
            <div className="p-6 border-t border-white/10 shrink-0 bg-slate-900/50">
              <form onSubmit={handleReply} className="flex gap-4">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
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
          )}
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-purple-500" />
          My Support Tickets
        </h2>
        <button
          onClick={() => setViewMode('create')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Tickets Found</h3>
            <p className="text-sm text-slate-400">You don't have any support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.sort((a,b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => { setActiveTicket(ticket); setViewMode('view'); }}
                className="bg-slate-950 border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-sm">{ticket.subject}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                      ticket.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-mono text-purple-400">#{ticket.id}</span>
                    <span>•</span>
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>Updated: {ticket.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                  <span className={`${
                    ticket.priority === 'urgent' ? 'text-rose-400' :
                    ticket.priority === 'high' ? 'text-orange-400' : 'text-slate-400'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
