import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, IndianRupee, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getStoredOrders } from '../utils/orderSync';
import { AdminOrder } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function UserOrdersTab() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedNoteOrder, setSelectedNoteOrder] = useState<AdminOrder | null>(null);
  
  useEffect(() => {
    getStoredOrders().then(data => setOrders(data));
    const handleOrdersUpdate = (e: any) => {
        setOrders(e.detail);
        setSelectedNoteOrder(prev => {
            if (prev) {
                return e.detail.find((o: AdminOrder) => o.id === prev.id) || prev;
            }
            return null;
        });
    };
    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => {
        window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
    };
  }, []);

  // For a real app, filter by current logged in user.
  // We'll show all orders or pretend we are the user that placed them.
  // Actually, since we don't have real auth, let's just show all local orders.
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_verification':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><Clock className="w-3 h-3"/> Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3"/> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3 h-3"/> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">My Orders</h2>
          <p className="text-sm text-slate-400 mt-1">Track your recent orders and verification status.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Plan</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                <React.Fragment key={order.id}>
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-white">{order.id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-300">
                      <div className="font-medium text-white">{order.planName}</div>
                      <div className="text-xs text-slate-400 capitalize">{order.categoryName}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-emerald-400">
                      ₹{order.price}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                      {order.status === 'rejected' && order.rejectionReason && (
                        <div className="mt-1 text-xs text-rose-400">
                          {order.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedNoteOrder(order)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 flex items-center gap-1.5 ml-auto"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        View Note
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedNoteOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Admin Note
                </h3>
                <button 
                  onClick={() => setSelectedNoteOrder(null)} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {selectedNoteOrder.adminNote ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>Updated: {new Date(selectedNoteOrder.updatedAt).toLocaleString()}</span>
                    </div>
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5 text-sm text-cyan-100/90 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedNoteOrder.adminNote}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <FileText className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-sm">No admin note has been added yet.</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10 bg-slate-950/50 flex justify-end">
                <button 
                  onClick={() => setSelectedNoteOrder(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors border border-white/5"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
