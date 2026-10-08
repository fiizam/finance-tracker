/**
 * Formats a number as Indonesian Rupiah
 * e.g., 1250000 -> "Rp 1.250.000"
 */
export function formatIDR(amount: number): string {
  // Use Intl.NumberFormat for proper formatting
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
