export const CURRENCY_CODE = 'INR';
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_NAME = 'Indian Rupee';

/**
 * Formats a numeric price into standard Indian Rupee string:
 * e.g. 99 -> "₹99"
 * e.g. 199 -> "₹199"
 * e.g. 1000 -> "₹1,000"
 * e.g. 10000 -> "₹10,000"
 * e.g. 100000 -> "₹1,00,000"
 */
export const formatINR = (amount: number | string | undefined | null): string => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount?.toString() || '0');
  if (isNaN(num)) return '₹0';
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }).format(num);
  return `₹${formatted}`;
};

/**
 * Formats amount without the symbol for places where the symbol is rendered separately
 * e.g. 1000 -> "1,000"
 * e.g. 100000 -> "1,00,000"
 */
export const formatINRNumber = (amount: number | string | undefined | null): string => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount?.toString() || '0');
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }).format(num);
};
