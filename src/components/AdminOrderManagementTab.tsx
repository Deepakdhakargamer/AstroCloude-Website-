import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, CheckCircle2, XCircle, Clock, Eye, Download, MessageSquare, AlertCircle, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { AdminOrder } from '../types';
import { formatINR } from '../utils/currency';

interface Props {
  orders: AdminOrder[];
  onUpdate: (orders: AdminOrder[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminOrderManagementTab({ orders, onUpdate, onShowToast }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_verification' | 'approved' | 'rejected'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStatusChange = (orderId: string, newStatus: AdminOrder['status'], reason?: string, note?: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          rejectionReason: reason || undefined,
          adminNote: note !== undefined ? note : o.adminNote,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });
    onUpdate(updated);
    onShowToast(`Order ${newStatus.replace('_', ' ')} successfully.`, newStatus === 'approved' ? 'success' : 'info');
    setSelectedOrder(null);
    setRejectionReason('');
  };

  
  const handleSaveNote = () => {
    if (!selectedOrder) return;
    const updated = orders.map(o => o.id === selectedOrder.id ? { ...o, adminNote, updatedAt: new Date().toISOString() } : o);
    onUpdate(updated);
    onShowToast('Admin note saved successfully.', 'success');
  };

  const handleDelete = (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    const updated = orders.filter(o => o.id !== orderId);
    onUpdate(updated);
    onShowToast('Order deleted successfully.', 'success');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_verification':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><Clock className="w-3 h-3"/> Pending Verification</span>;
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Orders Management</h2>
          <p className="text-sm text-slate-400">Review payments and approve user orders.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, or Email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Original Price</th>
                <th className="p-4 font-medium">Coupon Code</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Final Price</th>
                <th className="p-4 font-medium">Order Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No orders found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const originalPrice = order.originalPrice || order.price;
                  const hasDiscount = Boolean(order.discountAmount && order.discountAmount > 0);

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* User */}
                      <td className="p-4">
                        <div className="font-medium text-white">{order.userName}</div>
                        <div className="text-slate-400 text-xs">{order.userEmail}</div>
                        <div className="text-[10px] font-mono text-purple-400 mt-1 inline-flex items-center gap-1 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/20">
                          <span>UID:</span>
                          <span className="truncate max-w-[130px]">{order.userId || 'Unknown'}</span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="p-4">
                        <div className="text-white font-medium">{order.planName}</div>
                        <div className="text-xs text-slate-400 capitalize">{order.categoryName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{order.id}</div>
                      </td>

                      {/* Original Price */}
                      <td className="p-4 text-xs font-mono font-medium text-slate-300">
                        {formatINR(originalPrice)}
                      </td>

                      {/* Coupon Code */}
                      <td className="p-4 text-xs">
                        {order.couponCode ? (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
                            <Tag className="w-3 h-3 text-purple-400" />
                            {order.couponCode}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">—</span>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="p-4 text-xs font-mono">
                        {hasDiscount ? (
                          <span className="font-semibold text-emerald-400">
                            -{formatINR(order.discountAmount!)}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">—</span>
                        )}
                      </td>

                      {/* Final Price */}
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        {formatINR(order.price)}
                      </td>

                      {/* Order Status */}
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                        <div className="text-[10px] text-slate-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedOrder(order); setRejectionReason(order.rejectionReason || ''); setAdminNote(order.adminNote || ''); }}
                            className="p-2 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700 transition-colors"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'pending_verification' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'approved')}
                              className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="border-t border-white/10 p-4 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </div>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Order Verification 
                    {getStatusBadge(selectedOrder.status)}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">{selectedOrder.id}</p>
                </div>
                <button onClick={() => { setSelectedOrder(null); setRejectionReason(''); setAdminNote(''); setAdminNote(''); }} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Customer Information</h4>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white font-medium">{selectedOrder.userName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white font-medium">{selectedOrder.userEmail}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">User ID</span><span className="text-white font-medium text-xs font-mono">{selectedOrder.userId}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Plan Information</h4>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Plan</span><span className="text-white font-medium">{selectedOrder.planName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Category</span><span className="text-white font-medium capitalize">{selectedOrder.categoryName}</span></div>
                      {Boolean(selectedOrder.originalPrice && selectedOrder.originalPrice !== selectedOrder.price) && (
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Original Price</span>
                          <span className="line-through">{formatINR(selectedOrder.originalPrice)}</span>
                        </div>
                      )}
                      {Boolean(selectedOrder.discountAmount && selectedOrder.discountAmount > 0) && (
                        <div className="flex justify-between text-xs text-emerald-400">
                          <span>Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</span>
                          <span>-{formatINR(selectedOrder.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between"><span className="text-slate-400">Total Price (INR)</span><span className="text-emerald-400 font-bold font-mono">{formatINR(selectedOrder.price)}</span></div>
                      {selectedOrder.transactionId && (
                        <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                          <span className="text-slate-400">User Note / Transaction</span>
                          <span className="text-white font-mono text-xs">{selectedOrder.transactionId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedOrder.status === 'rejected' && selectedOrder.rejectionReason && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-sm">
                      <h4 className="text-rose-400 font-semibold mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4"/> Rejection Reason</h4>
                      <p className="text-rose-200">{selectedOrder.rejectionReason}</p>
                    </div>
                  )}
                  
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-300">Admin Note</label>
                    <textarea
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Add an internal note or message to the user..."
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                    />
                    {selectedOrder.status !== 'pending_verification' && (
                      <button
                        onClick={handleSaveNote}
                        className="w-full py-2 rounded-xl text-sm font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                      >
                        Save Note
                      </button>
                    )}
                  </div>

                  {selectedOrder.status === 'pending_verification' && (
                     <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-300">Rejection Note (if rejecting)</label>
                        <textarea
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-rose-500 focus:outline-none resize-none"
                          rows={2}
                          placeholder="Why is this being rejected? (Required for rejection)"
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                        />
                     </div>
                  )}
                  
                  {selectedOrder.status === 'pending_verification' ? (
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => {
                          if (!rejectionReason.trim()) {
                            onShowToast('Please provide a reason for rejection.', 'error');
                            return;
                          }
                          handleStatusChange(selectedOrder.id, 'rejected', rejectionReason, adminNote);
                        }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'approved', undefined, adminNote)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => handleStatusChange(selectedOrder.id, 'pending_verification')}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                      >
                        Mark as Pending
                      </button>
                    </div>
                  )}
                </div>

                {/* Screenshot Viewer */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Payment Screenshot</h4>
                  <div className="bg-slate-950 border border-white/10 rounded-xl p-2 h-[400px] flex items-center justify-center relative group overflow-hidden">
                    {selectedOrder.screenshotUrl ? (
                      <img 
                        src={selectedOrder.screenshotUrl} 
                        alt="Payment Proof" 
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-slate-500 text-sm flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                        No screenshot provided.
                      </div>
                    )}
                    {selectedOrder.screenshotUrl && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={selectedOrder.screenshotUrl} 
                          download={`proof-${selectedOrder.id}.png`}
                          className="bg-slate-900/80 backdrop-blur-sm border border-white/10 p-2 rounded-lg text-white hover:bg-slate-800 flex items-center gap-2 text-xs font-semibold"
                        >
                          <Download className="w-4 h-4"/> Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
