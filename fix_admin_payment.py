import re

with open("src/components/AdminPaymentTab.tsx", "r") as f:
    content = f.read()

# Replace Checkout Options section entirely
old_checkout_options = """          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Enabled Methods</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
              >
                <option value="both">Both (Cards & UPI/QR)</option>
                <option value="card">Cards Only (Stripe/Credit Card)</option>
                <option value="upi">UPI / QR Only</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">Choose what users see during checkout.</p>
            </div>
          </div>"""

new_checkout_options = """          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Enabled Methods</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
              >
                <option value="upi">UPI / QR Only</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">Choose what users see during checkout.</p>
            </div>
          </div>"""

content = content.replace(old_checkout_options, new_checkout_options)

with open("src/components/AdminPaymentTab.tsx", "w") as f:
    f.write(content)

