/**
 * Format a number with comma-separated thousands
 */
export function fmtNumber(n: number, decimals = 0): string {
  if (isNaN(n)) return '0';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a cost in Credits with comma-separated thousands
 */
export function fmtCost(n: number): string {
  if (isNaN(n)) return '0 Cr';
  if (n >= 1_000_000_000) return `${fmtNumber(n / 1_000_000_000, 2)} GCr`;
  if (n >= 1_000_000) return `${fmtNumber(n / 1_000_000, 2)} MCr`;
  if (n >= 1_000) return `${fmtNumber(n / 1_000, 1)} kCr`;
  return `${fmtNumber(n, 0)} Cr`;
}

/**
 * Format tonnage with 1 decimal
 */
export function fmtTons(n: number): string {
  if (isNaN(n)) return '0.0 DT';
  return `${fmtNumber(n, 1)} DT`;
}
