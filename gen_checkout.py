import os

new_checkout = """import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, FileText, ArrowLeft, CreditCard, ShieldCheck, Server, Cpu, Database, HardDrive, Wifi, Lock, QrCode, Smartphone, Copy, CheckCircle2 } from 'lucide-react';
import { AdminHostingPlan } from '../types';
import { getStoredPaymentSettings } from '../utils/paymentSync';
import { addOrder } from '../utils/orderSync';

interface CheckoutProps {
  plan: AdminHostingPlan | null;
  onBack: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function Checkout({ plan, onBack, onShowToast }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(() => getStoredPaymentSettings());
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');

  useEffect(() => {
    const handlePaymentUpdate = (e: any) => setPaymentSettings(e.detail);
    window.addEventListener('astro_payment_changed', handlePaymentUpdate);
    return () => window.removeEventListener('astro_payment_changed', handlePaymentUpdate);
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">No plan selected</h2>
        <button onClick={onBack} className="text-purple-400 hover:text-purple-300">Go Back</button>
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
      if (file.size > 5 * 1024 * 1024) {
         onShowToast('File too large. Max 5MB.', 'error');
         return;
      }
      setScreenshot(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!screenshotBase64) {
      onShowToast('Please upload a payment screenshot to continue.', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Create Order
      const newOrder = {
        id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        userId: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        userName: firstName + ' ' + lastName,
        userEmail: email,
        planId: plan.id,
        planName: plan.name,
        categoryId: plan.categoryId,
        categoryName: plan.categoryId, // Fallback for simple demo
        price: parseFloat(plan.price?.toString() || '0'),
        screenshotUrl: screenshotBase64,
        transactionId: transactionId,
        status: 'pending_verification' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addOrder(newOrder);

      setIsProcessing(false);
      onShowToast('Order submitted successfully! Pending verification.', 'success');
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Secure Checkout
              </h2>
              
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">First Name</label>
                      <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Last Name</label>
                      <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="Doe" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="john@example.com" />
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
                        <div className="bg-white p-4 rounded-xl">
                          {paymentSettings.qrCodeUrl ? (
                            <img src={paymentSettings.qrCodeUrl} alt="Payment QR" className="w-32 h-32 object-contain" />
                          ) : (
                            <QrCode className="w-32 h-32 text-slate-900" />
                          )}
                        </div>
                        
                        <div className="space-y-2 w-full max-w-sm">
                          <p className="text-sm text-slate-300">Scan QR to pay <span className="font-bold text-white">${plan.price}</span></p>
                          <p className="text-xs text-emerald-400 font-mono bg-emerald-950/30 py-1.5 px-3 rounded-lg border border-emerald-500/20 inline-block mt-2">
                            {paymentSettings.upiId || 'username@upi'}
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
                        <label className="block text-xs text-slate-400 mb-1.5">Transaction ID / UTR Number (Optional)</label>
                        <input 
                          type="text" 
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" 
                          placeholder="e.g. 123456789012" 
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-white/5">
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Submit for Verification (${plan.price}/mo)</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure 256-bit SSL encrypted checkout
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Server className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{plan.name}</h4>
                    <p className="text-sm text-slate-400 capitalize">{plan.categoryId} Server</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monthly Price</span>
                  <span className="text-white font-medium">${plan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Setup Fee</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Taxes</span>
                  <span className="text-slate-400">Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-sm text-slate-400 mb-1">Total due today</span>
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-500 line-through">${(parseFloat(plan.price?.toString() || '0') * 1.2).toFixed(2)}</span>
                    <span className="text-xs text-emerald-400 font-medium border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">Save 20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open("src/components/Checkout.tsx", "w") as f:
    f.write(new_checkout)

