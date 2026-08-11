import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

# Imports
content = content.replace(
    "import { AdminHostingPlan } from '../types';",
    "import { AdminHostingPlan } from '../types';\nimport { getStoredPaymentSettings } from '../utils/paymentSync';"
)

content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

# State and effect
old_state = """export function Checkout({ plan, onBack, onShowToast }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);"""

new_state = """export function Checkout({ plan, onBack, onShowToast }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(() => getStoredPaymentSettings());

  useEffect(() => {
    const handlePaymentUpdate = (e: any) => setPaymentSettings(e.detail);
    window.addEventListener('astro_payment_changed', handlePaymentUpdate);
    return () => window.removeEventListener('astro_payment_changed', handlePaymentUpdate);
  }, []);"""

content = content.replace(old_state, new_state)

# Replace the payment section to use settings
old_payment_section = """                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    UPI / QR Payment
                  </h3>
                  
                  <div className="bg-slate-950/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center space-y-6 relative overflow-hidden text-center">
                    <div className="bg-white p-4 rounded-xl">
                      <QrCode className="w-32 h-32 text-slate-900" />
                    </div>
                    
                    <div className="space-y-2 w-full max-w-sm">
                      <p className="text-sm text-slate-300">Scan QR to pay <span className="font-bold text-white">${plan.price}</span></p>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">OR</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>
                      
                      <div className="mt-4 text-left">
                        <label className="block text-xs text-slate-400 mb-1.5">Your UPI ID (Optional)</label>
                        <div className="relative">
                          <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="username@upi" />
                          <Smartphone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>"""

new_payment_section = """                <div className="space-y-4 pt-4 border-t border-white/5">
                  {(paymentSettings.paymentMethod === 'both' || paymentSettings.paymentMethod === 'upi') && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        UPI / QR Payment
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
                          
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                            <label className="block text-xs text-slate-400 mb-1.5 flex-1 text-left">Your UPI ID (Optional)</label>
                          </div>
                          <div className="relative text-left">
                            <input type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500" placeholder="yourname@upi" />
                            <Smartphone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(paymentSettings.paymentMethod === 'both' || paymentSettings.paymentMethod === 'card') && (
                    <div>
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        Card Payment
                      </h3>
                      
                      <div className="bg-slate-950/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 space-y-4 relative overflow-hidden">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1.5">Card Number</label>
                          <div className="relative">
                            <input required={paymentSettings.paymentMethod === 'card'} type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-purple-500" placeholder="0000 0000 0000 0000" />
                            <CreditCard className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5">Expiry Date</label>
                            <input required={paymentSettings.paymentMethod === 'card'} type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-purple-500" placeholder="MM/YY" />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5">CVC</label>
                            <div className="relative">
                              <input required={paymentSettings.paymentMethod === 'card'} type="text" className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white font-mono focus:outline-none focus:border-purple-500" placeholder="123" />
                              <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>"""

content = content.replace(old_payment_section, new_payment_section)

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)

