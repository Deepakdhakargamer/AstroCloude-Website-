import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { AdminHostingPlan } from '../types';
import confetti from 'canvas-confetti';

interface RequestPlanModalProps {
  plan: AdminHostingPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planName: string, name: string, email: string, notes: string) => void;
}

export function RequestPlanModal({ plan, isOpen, onClose, onSubmit }: RequestPlanModalProps) {
  const [name, setName] = useState('Alex Turner');
  const [email, setEmail] = useState('alex.turner@astrocloude.io');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#3b82f6', '#ec4899', '#6366f1'],
      });
      onSubmit(plan.name, name, email, notes);
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-slate-950 border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-950/50 overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Complete Purchase</h3>
              <p className="text-xs text-purple-300">Secure instant setup with AstroCloude Infrastructure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Selected Configuration</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 font-medium">Free Request</span>
          </div>
          <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>⚡ CPU: <span className="text-white font-medium">{plan.cpu}</span></div>
            <div>🧠 RAM: <span className="text-white font-medium">{plan.ram}</span></div>
            <div>💾 Storage: <span className="text-white font-medium">{plan.storage}</span></div>
            <div>🛡️ DDoS: <span className="text-white font-medium">{plan.ddos}</span></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Your Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Custom Notes / Region Preference</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Preferred region: Frankfurt, require specific port forwarding..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No upfront payment required. Our automated system provisions within 60 seconds of approval.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Buy Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
