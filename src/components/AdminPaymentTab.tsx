import React, { useState } from 'react';
import { Save, QrCode, CreditCard } from 'lucide-react';
import { PaymentSettings } from '../utils/paymentSync';

interface AdminPaymentTabProps {
  settings: PaymentSettings;
  onUpdate: (settings: PaymentSettings) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AdminPaymentTab({ settings, onUpdate, onShowToast }: AdminPaymentTabProps) {
  const [upiId, setUpiId] = useState(settings.upiId);
  const [qrCodeUrl, setQrCodeUrl] = useState(settings.qrCodeUrl);
  const [paymentMethod, setPaymentMethod] = useState(settings.paymentMethod);

  const handleSave = () => {
    onUpdate({ upiId, qrCodeUrl, paymentMethod });
    onShowToast('Payment settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Payment Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Configure accepted payment methods and QR codes.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            Checkout Options
          </h3>
          
          <div className="space-y-4">
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
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            UPI / QR Configuration
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-slate-500 mt-2">The UPI address shown on the checkout page.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Custom QR Code Image URL</label>
              <input
                type="text"
                value={qrCodeUrl}
                onChange={(e) => setQrCodeUrl(e.target.value)}
                placeholder="https://example.com/qr.png"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-slate-500 mt-2">Leave blank to use a default QR placeholder, or provide a URL to your merchant QR code.</p>
            </div>

            {qrCodeUrl && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">QR Preview</label>
                <div className="p-4 bg-white rounded-xl inline-block">
                  <img src={qrCodeUrl} alt="QR Preview" className="w-32 h-32 object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
