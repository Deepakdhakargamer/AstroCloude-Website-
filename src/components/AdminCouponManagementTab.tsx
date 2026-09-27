import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tag, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Clock, 
  Percent, IndianRupee, Users, ShieldAlert, Sparkles, AlertCircle, 
  Calendar, ArrowRight, Copy, Check, Filter, RefreshCw, Eye, X
} from 'lucide-react';
import { AdminCoupon, CouponDiscountType } from '../types';
import { createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from '../utils/couponSync';
import { formatINR } from '../utils/currency';

interface AdminCouponManagementTabProps {
  coupons: AdminCoupon[];
  onRefresh: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminCouponManagementTab({ coupons, onRefresh, onShowToast }: AdminCouponManagementTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [viewingRedemptionsCoupon, setViewingRedemptionsCoupon] = useState<AdminCoupon | null>(null);
  const [deleteConfirmCoupon, setDeleteConfirmCoupon] = useState<AdminCoupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<CouponDiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('10');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('0');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('');
  const [perUserLimit, setPerUserLimit] = useState<string>('1');
  const [startDate, setStartDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [active, setActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy code helper
  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    onShowToast(`Coupon code "${couponCode}" copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue('10');
    setMinOrderAmount('0');
    setMaxDiscountAmount('');
    setUsageLimit('100');
    setPerUserLimit('1');
    const today = new Date().toISOString().substring(0, 10);
    setStartDate(today);
    // Default 3 months expiry
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    setExpiryDate(future.toISOString().substring(0, 10));
    setActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (coupon: AdminCoupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMinOrderAmount(coupon.minOrderAmount?.toString() || '0');
    setMaxDiscountAmount(coupon.maxDiscountAmount?.toString() || '');
    setUsageLimit(coupon.usageLimit?.toString() || '');
    setPerUserLimit(coupon.perUserLimit?.toString() || '1');
    setStartDate(coupon.startDate ? coupon.startDate.substring(0, 10) : '');
    setExpiryDate(coupon.expiryDate ? coupon.expiryDate.substring(0, 10) : '');
    setActive(coupon.active);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Coupon code is required.');
      return;
    }

    const numDiscount = parseFloat(discountValue);
    if (isNaN(numDiscount) || numDiscount <= 0) {
      setFormError('Please enter a valid discount value greater than 0.');
      return;
    }

    if (discountType === 'percentage' && numDiscount > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    const numMinOrder = minOrderAmount ? parseFloat(minOrderAmount) : 0;
    const numMaxDiscount = maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined;
    const numUsageLimit = usageLimit ? parseInt(usageLimit, 10) : undefined;
    const numPerUserLimit = perUserLimit ? parseInt(perUserLimit, 10) : 1;

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        const res = await updateCoupon(editingCoupon.id, {
          code: cleanCode,
          description: description.trim(),
          discountType,
          discountValue: numDiscount,
          minOrderAmount: numMinOrder > 0 ? numMinOrder : undefined,
          maxDiscountAmount: numMaxDiscount && numMaxDiscount > 0 ? numMaxDiscount : undefined,
          usageLimit: numUsageLimit && numUsageLimit > 0 ? numUsageLimit : undefined,
          perUserLimit: numPerUserLimit > 0 ? numPerUserLimit : 1,
          startDate: startDate || undefined,
          expiryDate: expiryDate || undefined,
          active
        });

        if (!res.success) {
          setFormError(res.error || 'Failed to update coupon.');
        } else {
          onShowToast(`Coupon "${cleanCode}" updated successfully!`, 'success');
          setIsModalOpen(false);
          onRefresh();
        }
      } else {
        const res = await createCoupon({
          code: cleanCode,
          description: description.trim(),
          discountType,
          discountValue: numDiscount,
          minOrderAmount: numMinOrder > 0 ? numMinOrder : undefined,
          maxDiscountAmount: numMaxDiscount && numMaxDiscount > 0 ? numMaxDiscount : undefined,
          usageLimit: numUsageLimit && numUsageLimit > 0 ? numUsageLimit : undefined,
          perUserLimit: numPerUserLimit > 0 ? numPerUserLimit : 1,
          startDate: startDate || undefined,
          expiryDate: expiryDate || undefined,
          active
        });

        if (!res.success) {
          setFormError(res.error || 'Failed to create coupon.');
        } else {
          onShowToast(`Coupon "${cleanCode}" created successfully!`, 'success');
          setIsModalOpen(false);
          onRefresh();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Status
  const handleToggle = async (coupon: AdminCoupon) => {
    const ok = await toggleCouponStatus(coupon.id);
    if (ok) {
      onShowToast(`Coupon "${coupon.code}" is now ${!coupon.active ? 'Active' : 'Inactive'}.`, 'info');
      onRefresh();
    } else {
      onShowToast('Failed to toggle coupon status.', 'error');
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmCoupon) return;
    const ok = await deleteCoupon(deleteConfirmCoupon.id);
    if (ok) {
      onShowToast(`Coupon "${deleteConfirmCoupon.code}" deleted permanently.`, 'info');
      setDeleteConfirmCoupon(null);
      onRefresh();
    } else {
      onShowToast('Failed to delete coupon.', 'error');
    }
  };

  // Filter & Search
  const filteredCoupons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const now = new Date();

    return coupons.filter(c => {
      // Search
      const matchesSearch = !query || 
        c.code.toLowerCase().includes(query) || 
        (c.description && c.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Status
      if (statusFilter === 'active') {
        const isExpired = c.expiryDate && new Date(c.expiryDate) < now;
        return c.active && !isExpired;
      }
      if (statusFilter === 'inactive') {
        return !c.active;
      }
      if (statusFilter === 'expired') {
        return Boolean(c.expiryDate && new Date(c.expiryDate) < now);
      }
      return true;
    });
  }, [coupons, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = coupons.length;
    const now = new Date();
    const activeCount = coupons.filter(c => c.active && (!c.expiryDate || new Date(c.expiryDate) >= now)).length;
    const totalUsages = coupons.reduce((acc, c) => acc + (c.usesCount || 0), 0);
    const totalDiscountAmount = coupons.reduce((acc, c) => {
      const usages = c.usedBy || [];
      return acc + usages.reduce((sum, u) => sum + (u.discountApplied || 0), 0);
    }, 0);

    return { total, activeCount, totalUsages, totalDiscountAmount };
  }, [coupons]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-400" />
            <span>Coupon & Promo Code Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, manage, and audit promotional discount codes for cloud hosting & VPS plans.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Refresh coupons"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Coupons</span>
            <Tag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-1">Configured in store</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Coupons</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for redemption</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Usages</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{stats.totalUsages}</div>
          <div className="text-[11px] text-slate-500 mt-1">Orders discounted</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Discounts Given</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {formatINR(stats.totalDiscountAmount)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Customer savings</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or description..."
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'active', 'inactive', 'expired'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table / Cards */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Order Limits</th>
                <th className="p-4">Validity</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Tag className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-sm">No coupons found.</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search or click "Create New Coupon".</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map(coupon => {
                  const now = new Date();
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < now;
                  const isUpcoming = coupon.startDate && new Date(coupon.startDate) > now;
                  const limitReached = coupon.usageLimit && coupon.usesCount >= coupon.usageLimit;

                  return (
                    <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Code */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-slate-400 mt-1 max-w-xs truncate">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 font-bold text-emerald-400 text-sm">
                          {coupon.discountType === 'percentage' ? (
                            <>
                              <Percent className="w-3.5 h-3.5" />
                              <span>{coupon.discountValue}% OFF</span>
                            </>
                          ) : (
                            <>
                              <IndianRupee className="w-3.5 h-3.5" />
                              <span>{formatINR(coupon.discountValue)} OFF</span>
                            </>
                          )}
                        </div>
                        {coupon.discountType === 'percentage' && coupon.maxDiscountAmount && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Up to {formatINR(coupon.maxDiscountAmount)}
                          </div>
                        )}
                      </td>

                      {/* Order Limits */}
                      <td className="p-4 text-xs">
                        <div>
                          Min Order:{' '}
                          <span className="text-white font-semibold">
                            {coupon.minOrderAmount ? formatINR(coupon.minOrderAmount) : 'None (₹0)'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Per User: <span className="text-slate-300 font-medium">{coupon.perUserLimit || 1} time(s)</span>
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="p-4 text-xs">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" /> Expired on {coupon.expiryDate}
                          </span>
                        ) : isUpcoming ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                            <Calendar className="w-3 h-3" /> Starts {coupon.startDate}
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="text-slate-300">
                              Valid until {coupon.expiryDate || 'No Expiry'}
                            </div>
                            {coupon.startDate && (
                              <div className="text-[10px] text-slate-500">
                                Since {coupon.startDate}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Redemptions & Usage Limit */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">
                            {coupon.usesCount}
                          </span>
                          <span className="text-slate-500">/</span>
                          <span className="text-slate-400 text-xs">
                            {coupon.usageLimit ? `${coupon.usageLimit} max` : 'Unlimited'}
                          </span>
                        </div>
                        {coupon.usageLimit && (
                          <div className="w-24 bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                limitReached ? 'bg-rose-500' : 'bg-purple-500'
                              }`}
                              style={{ width: `${Math.min(100, ((coupon.usesCount || 0) / coupon.usageLimit) * 100)}%` }}
                            />
                          </div>
                        )}
                        {Boolean(coupon.usedBy && coupon.usedBy.length > 0) && (
                          <button
                            onClick={() => setViewingRedemptionsCoupon(coupon)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline mt-1 block"
                          >
                            View {coupon.usedBy.length} redemption(s)
                          </button>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggle(coupon)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            coupon.active
                              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
                              : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${coupon.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          <span>{coupon.active ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(coupon)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmCoupon(coupon)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* CREATE / EDIT COUPON MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon'}
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure discount rules, order thresholds, and expiry limits.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Coupon Code & Active Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Coupon Code <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                      placeholder="e.g. WELCOME10"
                      required
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono uppercase font-bold text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                    <button
                      type="button"
                      onClick={() => setActive(!active)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        active
                          ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-800 border-white/10 text-slate-400'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 10% welcome discount for new VPS servers"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          discountType === 'percentage'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                            : 'bg-slate-950 border-white/10 text-slate-400'
                        }`}
                      >
                        <Percent className="w-3.5 h-3.5" />
                        <span>Percentage</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          discountType === 'fixed'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                            : 'bg-slate-950 border-white/10 text-slate-400'
                        }`}
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Fixed (₹)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Discount Value ({discountType === 'percentage' ? '%' : '₹'}) <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={discountType === 'percentage' ? '100' : undefined}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      placeholder={discountType === 'percentage' ? '10' : '100'}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Min Order & Max Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Minimum Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(e.target.value)}
                      placeholder="0 for no minimum"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500">Order must be &ge; this value</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Maximum Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(e.target.value)}
                      disabled={discountType === 'fixed'}
                      placeholder={discountType === 'fixed' ? 'N/A for fixed' : 'e.g. 100'}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500 disabled:opacity-40"
                    />
                    <span className="text-[10px] text-slate-500">Optional cap for percentage discount</span>
                  </div>
                </div>

                {/* Usage Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      placeholder="e.g. 100 (blank for unlimited)"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500">Max total redemptions across all users</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Per-User Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={perUserLimit}
                      onChange={(e) => setPerUserLimit(e.target.value)}
                      placeholder="1"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500">Max times a single user ID can redeem</span>
                  </div>
                </div>

                {/* Dates: Start & Expiry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500">Date from which coupon can be used</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-[10px] text-slate-500">Date when coupon expires</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW REDEMPTIONS MODAL */}
      <AnimatePresence>
        {viewingRedemptionsCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[85vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                    Coupon Redemptions Audit
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {viewingRedemptionsCoupon.code} ({viewingRedemptionsCoupon.usedBy?.length || 0} Uses)
                  </h3>
                </div>
                <button
                  onClick={() => setViewingRedemptionsCoupon(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-3">
                {(!viewingRedemptionsCoupon.usedBy || viewingRedemptionsCoupon.usedBy.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No orders have redeemed this coupon yet.
                  </p>
                ) : (
                  viewingRedemptionsCoupon.usedBy.map((record, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{record.userEmail || record.userId}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Order: <span className="text-purple-300">{record.orderId}</span> • UID: {record.userId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400 font-mono">
                          -{formatINR(record.discountApplied)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(record.usedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-slate-950/60 flex justify-end">
                <button
                  onClick={() => setViewingRedemptionsCoupon(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-rose-500/30 rounded-3xl w-full max-w-md shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Coupon</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to delete coupon <strong className="text-rose-400">{deleteConfirmCoupon.code}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmCoupon(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30"
                >
                  Delete Coupon
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
