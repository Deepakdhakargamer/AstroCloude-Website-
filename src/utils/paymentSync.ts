export interface PaymentSettings {
  upiId: string;
  qrCodeUrl: string;
  paymentMethod: 'upi' | 'card' | 'both';
}

const STORAGE_KEY = 'astro_payment_settings';

export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: 'username@upi',
  qrCodeUrl: '',
  paymentMethod: 'both'
};

export function getStoredPaymentSettings(): PaymentSettings {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Error reading payment settings from localStorage', e);
  }
  return INITIAL_PAYMENT_SETTINGS;
}

export function saveStoredPaymentSettings(settings: PaymentSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('astro_payment_changed', { detail: settings }));
  } catch (e) {
    console.error('Error saving payment settings to localStorage', e);
  }
}
