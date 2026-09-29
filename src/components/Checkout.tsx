import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, Image as ImageIcon, FileText, ArrowLeft, CreditCard, ShieldCheck, 
  Server, Cpu, Database, HardDrive, Wifi, Lock, QrCode, Smartphone, Copy, 
  CheckCircle2, LogIn, AlertCircle, Sparkles, UserCheck, Tag, X, ChevronDown, Layers,
  Shield, Zap
} from 'lucide-react';
import { AdminHostingPlan, AdminUser, AdminCoupon } from '../types';
import { getStoredPaymentSettings } from '../utils/paymentSync';
import { addOrder } from '../utils/orderSync';
import { getCurrentSession } from '../utils/userSync';
import { getStoredPlans } from '../utils/planSync';
import { getPlanSpecs } from '../utils/specFormat';
import { formatINR, formatINRNumber } from '../utils/currency';
import { validateCoupon } from '../utils/couponSync';
import { compressImageFile } from '../utils/imageCompress';

interface CheckoutProps {
  plan: AdminHostingPlan | null;
  onBack: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  currentUser?: AdminUser | null;
  onRequireAuth?: () => void;
  onOrderSuccess?: () => void;
}

export function Checkout({ plan, onBack, onShowToast, currentUser, onRequireAuth, onOrderSuccess }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(() => getStoredPaymentSettings());
  
  // Available plans and active plan state to support dynamic updates and plan switching
  const [availablePlans, setAvailablePlans] = useState<AdminHostingPlan[]>(() => getStoredPlans());
  const [activePlan, setActivePlan] = useState<AdminHostingPlan | null>(() => {
    if (plan) {
      const fresh = getStoredPlans().find(p => p.id === plan.id);
      return fresh || plan;
    }
    const stored = getStoredPlans();
    return stored.length > 0 ? stored[0] : null;
  });

  useEffect(() => {
    if (plan) {
      const fresh = getStoredPlans().find(p => p.id === plan.id);
      setActivePlan(fresh || plan);
    }
  }, [plan]);

  useEffect(() => {
    const handlePlansChange = (e: any) => {
      const freshList: AdminHostingPlan[] = e.detail || getStoredPlans();
      setAvailablePlans(freshList);
      if (activePlan) {
        const updated = freshList.find(p => p.id === activePlan.id);
        if (updated) {
          setActivePlan(updated);
        }
      }
    };
    window.addEventListener('astro_plans_changed', handlePlansChange);
    return () => window.removeEventListener('astro_plans_changed', handlePlansChange);
  }, [activePlan?.id]);

  const handleSelectPlan = (planId: string) => {
    const selected = availablePlans.find(p => p.id === planId);
    if (selected) {
      setActivePlan(selected);
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
        onShowToast(`Plan changed to ${selected.name}. Please re-apply coupon if eligible.`, 'info');
      } else {
        onShowToast(`Selected plan: ${selected.name}`, 'info');
      }
    }
  };

  const currentPlan = activePlan || plan;
  const specs = getPlanSpecs(currentPlan);

  const [firstName, setFirstName] = useState(() => {
    if (currentUser?.name) {
      const parts = currentUser.name.split(' ');
      return parts[0] || '';
    }
    return '';
  });
  const [lastName, setLastName] = useState(() => {
    if (currentUser?.name) {
      const parts = currentUser.name.split(' ');
      return parts.slice(1).join(' ') || '';
    }
    return '';
  });
  const [email, setEmail] = useState(() => currentUser?.email || '');
  const [transactionId, setTransactionId] = useState('');
  
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');

  // Coupon / Promo Code State (All in INR)
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    coupon: AdminCoupon;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);

  const basePrice = parseFloat(currentPlan?.price?.toString() || '0');
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = appliedCoupon ? appliedCoupon.finalPrice : basePrice;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponChecking(true);
    try {
      const res = await validateCoupon({
        code,
        orderAmount: basePrice,
        userId: currentUser?.id
      });

      if (!res.valid || !res.coupon) {
        setCouponError(res.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        onShowToast(res.error || 'Invalid coupon code', 'error');
      } else {
        setAppliedCoupon({
          coupon: res.coupon,
          discountAmount: res.discountAmount,
          finalPrice: res.finalPrice
        });
        onShowToast(`Coupon "${res.coupon.code}" applied! You saved ${formatINR(res.discountAmount)}.`, 'success');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Error validating coupon code.');
      onShowToast(err.message || 'Error validating coupon code.', 'error');
    } finally {
      setCouponChecking(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    onShowToast('Coupon removed.', 'info');
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) {
        const parts = currentUser.name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      if (currentUser.email) {
        setEmail(currentUser.email);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const handlePaymentUpdate = (e: any) => setPaymentSettings(e.detail);
    window.addEventListener('astro_payment_changed', handlePaymentUpdate);
    return () => window.removeEventListener('astro_payment_changed', handlePaymentUpdate);
  }, []);

  // MANDATORY AUTHENTICATION GUARD
  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-80px)] pt-24 pb-16 flex flex-col items-center justify-center px-4 relative bg-slate-950 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/90 border border-purple-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-900/30">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
              Authentication Required
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Sign In to Purchase</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Please login or register to purchase a plan. All active orders are linked to your secure user account for instant server deployment.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => onRequireAuth ? onRequireAuth() : onBack()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Register to Continue</span>
            </button>
            <button
              onClick={onBack}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors border border-white/5"
            >
              Back to Plans
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4 bg-slate-950">
        <h2 className="text-2xl font-bold text-white mb-4">No plan selected</h2>
        <button onClick={onBack} className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
          &larr; Return to Plans
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        onShowToast('Invalid file type. Please upload JPG, PNG, WEBP, or PDF.', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
         onShowToast('File too large. Max 10MB.', 'error');
         return;
      }
      setScreenshot(file);
      
      compressImageFile(file, 1000, 1000, 0.82)
        .then(compressed => {
          setScreenshotBase64(compressed);
        })
        .catch(() => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setScreenshotBase64(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate session on submission
    const session = getCurrentSession();
    if (!currentUser || !session || !session.user) {
      onShowToast('Please login or register to purchase a plan.', 'error');
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (!screenshotBase64) {
      onShowToast('Please upload a payment screenshot to continue.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      await addOrder({
        planId: currentPlan.id,
        planName: currentPlan.name,
        categoryId: currentPlan.categoryId,
        categoryName: currentPlan.categoryId,
        price: finalPrice,
        currency: 'INR',
        originalPrice: basePrice,
        discountAmount: discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.coupon.code : undefined,
        totalAmount: finalPrice,
        screenshotUrl: screenshotBase64,
        transactionId: transactionId.trim(),
        userName: (firstName + ' ' + lastName).trim() || currentUser.name,
        userEmail: email.trim() || currentUser.email,
      });

      setIsProcessing(false);
      onShowToast('Order submitted successfully! Saved to your account.', 'success');
      if (onOrderSuccess) {
        onOrderSuccess();
      } else {
        onBack();
      }
    } catch (err: any) {
      setIsProcessing(false);
      onShowToast(err.message || 'Failed to submit order.', 'error');
      if (err.message?.includes('login') || err.message?.includes('Authentication')) {
        if (onRequireAuth) onRequireAuth();
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Checkout Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selected Plan Hardware Specifications Embed */}
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                        {currentPlan.categoryId ? `${currentPlan.categoryId} Server` : 'Hosting Plan'}
                      </span>
                      {currentPlan.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm">
                          {currentPlan.badge}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Selected Plan
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentPlan.name}</h2>
                    {currentPlan.description && (
                      <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                        {currentPlan.description}
                      </p>
                    )}
                  </div>

                  {/* Plan Switcher Dropdown */}
                  {availablePlans.length > 1 && (
                    <div className="shrink-0 sm:self-start">
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Switch Plan
                      </label>
                      <div className="relative">
                        <select
                          value={currentPlan.id}
                          onChange={(e) => handleSelectPlan(e.target.value)}
                          className="appearance-none bg-slate-950/80 border border-white/10 hover:border-purple-500/50 rounded-xl px-3.5 py-2 pr-9 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer shadow-sm"
                        >
                          {availablePlans.map((p) => (
                            <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                              {p.name} — {formatINR(p.price)}/mo
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Hardware Metric Cards: CPU, RAM, Disk, Price */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold uppercase mb-1">
                      <Cpu className="w-4 h-4 shrink-0" />
                      <span>CPU</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-white truncate" title={specs.cpu}>
                      {specs.cpu}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Processor Power</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase mb-1">
                      <Database className="w-4 h-4 shrink-0" />
                      <span>RAM</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-white truncate" title={specs.ram}>
                      {specs.ram}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Dedicated Memory</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase mb-1">
                      <HardDrive className="w-4 h-4 shrink-0" />
                      <span>Disk</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-white truncate" title={specs.disk}>
                      {specs.disk}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">Storage / NVMe</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase mb-1">
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Price</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {formatINR(basePrice)}<span className="text-[10px] font-normal text-slate-400">/mo</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1">Renews Monthly</span>
                  </div>
                </div>

                {/* Plan Specifications List matching example layout */}
                <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-4 text-xs space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Plan Specifications &bull; {currentPlan.name}</span>
                    <span className="text-emerald-400 font-mono text-xs">{formatINR(basePrice)}/month</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span className="text-slate-400 font-medium">CPU:</span>
                      <span className="text-white font-bold">{specs.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      <span className="text-slate-400 font-medium">RAM:</span>
                      <span className="text-white font-bold">{specs.ram}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-slate-400 font-medium">Disk:</span>
                      <span className="text-white font-bold">{specs.disk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="text-slate-400 font-medium">Price:</span>
                      <span className="text-white font-bold">{formatINR(basePrice)}/month</span>
                    </div>
                    {specs.bandwidth && specs.bandwidth !== 'N/A' && (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-slate-400 font-medium">Bandwidth:</span>
                        <span className="text-white font-bold">{specs.bandwidth}</span>
                      </div>
                    )}
                    {specs.ddos && (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span className="text-slate-400 font-medium">Protection:</span>
                        <span className="text-white font-bold">{specs.ddos}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  Secure Checkout
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticated Account</span>
                </div>
              </div>

              {/* Logged in User Account Status Banner */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
                      <span className="text-[10px] font-mono text-purple-300">@{currentUser.username || 'client'}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">{currentUser.email}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Account Linked
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1">ID: {currentUser.id}</div>
                </div>
              </div>
              
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">First Name</label>
                      <input 
                        required 
                        type="text" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" 
                        placeholder="John" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Last Name</label>
                      <input 
                        required 
                        type="text" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" 
                        placeholder="Doe" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1.5">Email Address (Order Confirmation)</label>
                      <input 
                        required 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  {(paymentSettings.paymentMethod === 'both' || paymentSettings.paymentMethod === 'upi') && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        UPI / QR Payment Instructions
                      </h3>
                      
                      <div className="bg-slate-950/50 border border-emerald-500/30 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center space-y-6 relative overflow-hidden text-center">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl shadow-black/30 inline-flex items-center justify-center">
                          {paymentSettings.qrCodeUrl ? (
                            <img 
                              src={paymentSettings.qrCodeUrl} 
                              alt="Payment QR" 
                              className="w-48 h-48 sm:w-56 sm:h-56 aspect-square object-contain" 
                              style={{ imageRendering: 'pixelated' }}
                            />
                          ) : (
                            <QrCode className="w-48 h-48 sm:w-56 sm:h-56 text-slate-900 aspect-square" />
                          )}
                        </div>
                        
                        <div className="space-y-2 w-full max-w-sm">
                          <p className="text-sm text-slate-300">Scan QR to pay <span className="font-bold text-white">{formatINR(finalPrice)}</span></p>
                          <p className="text-xs text-emerald-400 font-mono bg-emerald-950/30 py-1.5 px-3 rounded-lg border border-emerald-500/20 inline-block mt-2">
                            {paymentSettings.upiId || 'billing@astrocloude.io'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      Payment Verification
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-950/50 border border-blue-500/30 rounded-xl p-4 sm:p-6 space-y-4 relative overflow-hidden text-center">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          id="payment-screenshot"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                        <label
                          htmlFor="payment-screenshot"
                          className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                        >
                          {screenshot ? (
                            <>
                              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                              <span className="text-sm text-emerald-400 font-semibold">{screenshot.name} uploaded</span>
                              <span className="text-xs text-slate-500">Click to change file</span>
                              {screenshotBase64 && screenshot.type.startsWith('image/') && (
                                <img src={screenshotBase64} alt="Preview" className="mt-4 max-h-32 object-contain rounded-lg border border-white/10" />
                              )}
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-slate-400" />
                              <span className="text-sm text-white font-semibold">Upload Payment Screenshot <span className="text-rose-400">*</span></span>
                              <span className="text-xs text-slate-500">PNG, JPG, WEBP or PDF up to 5MB</span>
                            </>
                          )}
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">User Note or Transaction Reference</label>
                        <input 
                          type="text" 
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" 
                          placeholder="Transaction ID / UTR or custom setup requirements..." 
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying & Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Submit for Verification ({formatINR(finalPrice)}/mo)</span>
                      </>
                    )}
                  </button>
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                        <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-purple-400 font-medium">
                        <Shield className="w-3.5 h-3.5" /> Verified Merchant
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-cyan-400 font-medium">
                        <Zap className="w-3.5 h-3.5" /> Instant Node Linking
                      </span>
                    </div>
                    <p className="text-center text-[10px] text-slate-500">
                      Zero payment credential retention &bull; RBI &amp; NPCI guidelines compliant
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Order Summary</h3>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 rounded-md uppercase font-semibold">
                  {currentPlan.categoryId || 'HOSTING'}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3.5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
                      <Server className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white font-bold truncate">{currentPlan.name}</h4>
                      <p className="text-xs text-slate-400 capitalize">{currentPlan.categoryId} Cloud Server</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-white">{formatINR(basePrice)}</span>
                      <span className="block text-[10px] text-slate-400">/mo</span>
                    </div>
                  </div>

                  {/* Highlights in Order Summary: CPU, RAM, Disk */}
                  <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-2">
                      <span className="block text-[9px] text-purple-400 font-bold uppercase mb-0.5">CPU</span>
                      <span className="font-bold text-white text-[11px] truncate block" title={specs.cpu}>{specs.shortCpu}</span>
                    </div>
                    <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-2">
                      <span className="block text-[9px] text-blue-400 font-bold uppercase mb-0.5">RAM</span>
                      <span className="font-bold text-white text-[11px] truncate block" title={specs.ram}>{specs.shortRam}</span>
                    </div>
                    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2">
                      <span className="block text-[9px] text-emerald-400 font-bold uppercase mb-0.5">Disk</span>
                      <span className="font-bold text-white text-[11px] truncate block" title={specs.disk}>{specs.shortDisk}</span>
                    </div>
                  </div>

                  {/* Detailed specification rows */}
                  <div className="pt-2 text-xs space-y-1.5 text-slate-300">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-purple-400" /> CPU:
                      </span>
                      <span className="font-bold text-white truncate max-w-[60%] text-right">{specs.cpu}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-blue-400" /> RAM:
                      </span>
                      <span className="font-bold text-white truncate max-w-[60%] text-right">{specs.ram}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <HardDrive className="w-3 h-3 text-emerald-400" /> Disk:
                      </span>
                      <span className="font-bold text-white truncate max-w-[60%] text-right">{specs.disk}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon / Promo Code Box */}
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Promo / Coupon Code</span>
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ASTRO20"
                    disabled={Boolean(appliedCoupon)}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 uppercase disabled:opacity-60"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-all border border-rose-500/30 flex items-center gap-1 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={couponChecking}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 disabled:opacity-50"
                    >
                      {couponChecking ? 'Checking...' : 'Apply Coupon'}
                    </button>
                  )}
                </form>
                {couponError && (
                  <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      Coupon <strong>{appliedCoupon.coupon.code}</strong> applied (
                      {appliedCoupon.coupon.discountType === 'percentage' 
                        ? `${appliedCoupon.coupon.discountValue}% off` 
                        : `${formatINR(appliedCoupon.coupon.discountValue)} off`}
                      )
                    </span>
                  </div>
                )}
                {!appliedCoupon && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>Try code:</span>
                    <button
                      type="button"
                      onClick={() => setCouponCode('WELCOME10')}
                      className="font-mono text-purple-400 font-semibold underline underline-offset-2 hover:text-purple-300"
                    >
                      WELCOME10
                    </button>
                    <span>or</span>
                    <button
                      type="button"
                      onClick={() => setCouponCode('ASTRO20')}
                      className="font-mono text-purple-400 font-semibold underline underline-offset-2 hover:text-purple-300"
                    >
                      ASTRO20
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Plan Price</span>
                  <span className="text-white font-medium">{formatINR(basePrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400 font-medium">
                    <span>Coupon Discount {appliedCoupon?.coupon.code ? `(${appliedCoupon.coupon.code})` : ''}</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Setup Fee</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST / Taxes</span>
                  <span className="text-slate-400">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Account Owner</span>
                  <span className="text-purple-400 font-mono text-xs">{currentUser.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-sm text-slate-400 mb-1">Final Price</span>
                    <span className="text-3xl font-black text-white">{formatINR(finalPrice)}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-500 line-through">
                      ₹{formatINRNumber(Math.round(basePrice * 1.25))}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {appliedCoupon ? `Discount -${formatINR(discountAmount)}` : 'Save 20%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Linked Account Order</span>
                </div>
                <p>
                  This order will automatically appear in your <strong className="text-white">Client Dashboard &rarr; Billing & Orders</strong> once submitted.
                </p>
              </div>

              {/* Security Badge Section */}
              <div className="pt-5 border-t border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">Security &amp; Trust Guarantee</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-1 hover:border-emerald-500/20 transition-colors">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <Lock className="w-3 h-3 shrink-0" />
                      <span>End-to-End SSL</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      TLS 1.3 encryption secures every transaction byte.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-1 hover:border-purple-500/20 transition-colors">
                    <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px]">
                      <Shield className="w-3 h-3 shrink-0" />
                      <span>Verified Billing</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Authenticated AstroCloude merchant gateway.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-1 hover:border-cyan-500/20 transition-colors">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
                      <Zap className="w-3 h-3 shrink-0" />
                      <span>Instant Deploy</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Automated cloud VM setup upon order verification.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-1 hover:border-blue-500/20 transition-colors">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Zero Retention</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      No banking passwords or card data stored.
                    </p>
                  </div>
                </div>

                {/* Trust Seals Bar */}
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    PCI-DSS Compliant
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    99.9% Uptime SLA
                  </span>
                </div>
              </div>
            </div>

            {/* Dedicated Trust & Protection Card */}
            <div className="mt-4 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-purple-950/20 border border-emerald-500/20 rounded-3xl p-5 backdrop-blur-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% Encrypted &amp; Protected Checkout</h4>
                  <p className="text-[11px] text-slate-400">Enterprise DDoS defense &bull; Verified recipient</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All transactions are routed through bank-grade TLS cryptographic channels. Your payment verification is handled directly by verified AstroCloude billing engineers with 24/7 ticket support.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  UPI Instant
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  PhonePe / GPay / Paytm
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  RuPay / Cards
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  NetBanking
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

