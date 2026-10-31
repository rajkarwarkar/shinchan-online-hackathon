/**
 * Deterministic date formatter to guarantee 100% identical SSR and Client hydration.
 * Avoids toLocaleDateString() locale and timezone mismatches.
 */
export function formatDateDeterministic(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return 'Undated';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return 'Undated';

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const year = d.getUTCFullYear();
    const month = months[d.getUTCMonth()];
    const day = String(d.getUTCDate()).padStart(2, '0');

    return `${day} ${month} ${year}`;
  } catch {
    return 'Undated';
  }
}
