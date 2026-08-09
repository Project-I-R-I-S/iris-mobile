/**
 * Returns today's date in YYYY-MM-DD format for the given IANA timezone.
 * We use Intl.DateTimeFormat because it handles DST and locale differences
 * without pulling in a date library.
 */
export function todayIso(timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // en-CA formats as YYYY-MM-DD which is exactly ISO.
  return formatter.format(new Date());
}
