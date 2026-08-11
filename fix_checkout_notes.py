import re

with open("src/components/Checkout.tsx", "r") as f:
    content = f.read()

# Replace Card Payment UI with Note UI
old_payment_section = """                  {(paymentSettings.paymentMethod === 'both' || paymentSettings.paymentMethod === 'card') && (
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
                  )}"""

new_payment_section = """                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-purple-400" />
                      Order Notes
                    </h3>
                    
                    <div className="bg-slate-950/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 space-y-4 relative overflow-hidden">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1.5">Add a note for the seller (Optional)</label>
                        <div className="relative">
                          <textarea 
                            rows={3} 
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 resize-none" 
                            placeholder="Special instructions or questions related to the product..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>"""

content = content.replace(old_payment_section, new_payment_section)

# Remove the (paymentSettings.paymentMethod === 'both' || paymentSettings.paymentMethod === 'upi') && ( )
# from the UPI section, since we now always want to show the payment method (which is only UPI/QR)
# Wait, actually we can keep it as is, or remove the card check. Let's just remove the condition for UPI for simplicity,
# but the easiest way is to modify the AdminPaymentTab.tsx later.
# For now, let's just make the replacement.

with open("src/components/Checkout.tsx", "w") as f:
    f.write(content)
