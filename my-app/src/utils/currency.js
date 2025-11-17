// Currency formatting utility
export const CURRENCY_OPTIONS = {
  'USD': { symbol: '$', name: 'US Dollar', code: 'USD' },
  'EUR': { symbol: '€', name: 'Euro', code: 'EUR' },
  'GBP': { symbol: '£', name: 'British Pound', code: 'GBP' },
  'CAD': { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  'NGN': { symbol: '₦', name: 'Nigerian Naira', code: 'NGN' },
};

/**
 * Get the current currency preference from localStorage
 * @returns {string} Currency code (e.g., 'USD', 'EUR', 'NGN')
 */
export function getCurrency() {
  return localStorage.getItem('currency') || 'USD';
}

/**
 * Set the currency preference in localStorage
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR', 'NGN')
 */
export function setCurrency(currency) {
  if (CURRENCY_OPTIONS[currency]) {
    localStorage.setItem('currency', currency);
  }
}

/**
 * Format a number as currency with the selected symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - Optional currency code, defaults to localStorage value
 * @returns {string} Formatted currency string (e.g., '$100.00', '₦50,000.00')
 */
export function formatCurrency(amount, currency = null) {
  const curr = currency || getCurrency();
  const currencyInfo = CURRENCY_OPTIONS[curr] || CURRENCY_OPTIONS['USD'];
  const num = parseFloat(amount) || 0;
  
  // Format with 2 decimal places and thousand separators
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${currencyInfo.symbol}${formatted}`;
}

/**
 * Format currency for display with just the symbol (compact version)
 * @param {number} amount - The amount to format
 * @param {string} currency - Optional currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrencyCompact(amount, currency = null) {
  const curr = currency || getCurrency();
  const currencyInfo = CURRENCY_OPTIONS[curr] || CURRENCY_OPTIONS['USD'];
  const num = parseFloat(amount) || 0;
  
  // Shorten large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
  let formatted;
  if (Math.abs(num) >= 1000000) {
    formatted = (num / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(num) >= 1000) {
    formatted = (num / 1000).toFixed(1) + 'K';
  } else {
    formatted = num.toFixed(2);
  }
  
  return `${currencyInfo.symbol}${formatted}`;
}
