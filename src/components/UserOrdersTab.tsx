import React, { useState, useEffect, useCallback } from 'react';
import { Download, FileText, Calendar, IndianRupee, CheckCircle2, Clock, XCircle, ShoppingCart, Sparkles, UserCheck, Printer } from 'lucide-react';
import { getUserOrders } from '../utils/orderSync';
import { AdminOrder, AdminUser } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { formatINR } from '../utils/currency';

interface UserOrdersTabProps {
  currentUser?: AdminUser | null;
  onBrowsePlans?: () => void;
}

export function UserOrdersTab({ currentUser, onBrowsePlans }: UserOrdersTabProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteOrder, setSelectedNoteOrder] = useState<AdminOrder | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<AdminOrder | null>(null);
  
  // Strictly fetch ONLY orders matching the currently logged-in user's unique database ID
  const fetchOrdersForCurrentUser = useCallback(async () => {
    if (!currentUser || !currentUser.id || typeof currentUser.id !== 'string') {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userOrders = await getUserOrders(currentUser.id);
      setOrders(userOrders);
      setSelectedNoteOrder(prev => {
        if (prev) {
          return userOrders.find(o => o.id === prev.id) || null;
        }
        return null;
      });
    } catch (err) {
      console.error('Error fetching user orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchOrdersForCurrentUser();

    const handleOrdersUpdate = () => {
      fetchOrdersForCurrentUser();
    };

    window.addEventListener('astro_orders_changed', handleOrdersUpdate);
    return () => {
      window.removeEventListener('astro_orders_changed', handleOrdersUpdate);
    };
  }, [fetchOrdersForCurrentUser]);

  // Strict local safety filter: ensure every single displayed order strictly belongs to this user ID
  const currentUserId = currentUser?.id?.trim();
  const displayOrders = currentUserId
    ? orders.filter(o => Boolean(o && o.userId && typeof o.userId === 'string' && o.userId.trim() === currentUserId))
    : [];
  
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>My Orders</span>
            {currentUser && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300">
                Account ID: {currentUser.id}
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Track your active hosting server orders and verification status.</p>
        </div>
        {onBrowsePlans && displayOrders.length > 0 && (
          <button
            onClick={onBrowsePlans}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />
            <span>Order New Plan</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-xs">Loading your orders...</span>
          </div>
        ) : displayOrders.length === 0 ? (
          /* Empty State for brand-new or order-free accounts */
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400 shadow-lg shadow-purple-950/30">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              You haven't placed any hosting orders yet. Explore our high-performance VPS, Minecraft, and Cloud hosting infrastructure.
            </p>
            {onBrowsePlans && (
              <button
                onClick={onBrowsePlans}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Browse Plans</span>
              </button>
            )}
          </div>
        ) : (
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
                {displayOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
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
                      <div>{formatINR(order.price)}</div>
                      {Boolean(order.couponCode && order.discountAmount) && (
                        <div className="text-[10px] text-purple-300 font-normal mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="line-through text-slate-500">{formatINR(order.originalPrice || order.price)}</span>
                          <span className="text-emerald-400">-{formatINR(order.discountAmount!)} ({order.couponCode})</span>
                        </div>
                      )}
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 text-xs font-semibold rounded-lg transition-colors border border-purple-500/30 inline-flex items-center gap-1.5 shadow-sm"
                          title="View Invoice & Receipt"
                        >
                          <Download className="w-3.5 h-3.5 text-purple-400" />
                          <span>Receipt</span>
                        </button>
                        <button
                          onClick={() => setSelectedNoteOrder(order)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10 inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Note</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Glassmorphism Admin Note Modal */}
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
                  <span>Admin Note</span>
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

      {/* Official INR Tax Invoice & Receipt Modal */}
      <AnimatePresence>
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
            >
              {/* Receipt Header */}
              <div className="p-6 bg-gradient-to-r from-purple-900/40 via-slate-900 to-blue-900/30 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-950/80 border border-purple-500/30 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Official Tax Invoice & Receipt
                  </span>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>ASTRO<span className="text-purple-400">CLOUDE</span></span>
                  </h3>
                  <p className="text-xs text-slate-400">Invoice #{selectedInvoiceOrder.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoiceOrder(null)} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Billed To</span>
                    <span className="font-bold text-white block text-sm">{selectedInvoiceOrder.userName}</span>
                    <span className="text-slate-400 block">{selectedInvoiceOrder.userEmail}</span>
                    <span className="font-mono text-[10px] text-purple-400">UID: {selectedInvoiceOrder.userId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block mb-0.5">Invoice Details</span>
                    <span className="text-slate-300 block">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-400 block">Currency: <strong className="text-white">INR (₹)</strong></span>
                    <span className="text-emerald-400 font-semibold block uppercase text-[11px] mt-1">Status: {selectedInvoiceOrder.status.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Item Table */}
                <div className="border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-slate-400 text-[10px]">
                      <tr>
                        <th className="p-3">Description</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">{selectedInvoiceOrder.planName}</div>
                          <div className="text-slate-400 text-[11px]">Monthly Cloud Server Subscription</div>
                        </td>
                        <td className="p-3.5 capitalize text-slate-300">
                          {selectedInvoiceOrder.categoryName}
                        </td>
                        <td className="p-3.5 text-right font-bold text-white text-sm font-mono">
                          {formatINR(selectedInvoiceOrder.originalPrice || selectedInvoiceOrder.price)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary in INR */}
                <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal (INR)</span>
                    <span className="font-mono">{formatINR(selectedInvoiceOrder.originalPrice || selectedInvoiceOrder.price)}</span>
                  </div>
                  {Boolean(selectedInvoiceOrder.discountAmount && selectedInvoiceOrder.discountAmount > 0) && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount {selectedInvoiceOrder.couponCode ? `(${selectedInvoiceOrder.couponCode})` : ''}</span>
                      <span className="font-mono">-{formatINR(selectedInvoiceOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>GST (18% Goods & Services Tax)</span>
                    <span className="text-emerald-400 font-medium">Included</span>
                  </div>
                  <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Amount Paid (INR)</span>
                    <span className="text-xl text-emerald-400 font-mono">{formatINR(selectedInvoiceOrder.price)}</span>
                  </div>
                </div>

                {/* Payment Reference */}
                {selectedInvoiceOrder.transactionId && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs flex justify-between items-center">
                    <span className="text-slate-400">Transaction ID / UTR:</span>
                    <span className="font-mono text-purple-300 font-bold">{selectedInvoiceOrder.transactionId}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Indian Rupees (INR) Payment
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoiceOrder(null)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

