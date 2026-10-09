const NB = '\u2009';

/** Group digits with thin spaces: 1250000 -> 1 250 000 */
export function group(n: number): string {
  const neg = n < 0;
  const s = Math.abs(Math.round(n)).toString();
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const left = s.length - i;
    out.push(s[i]);
    if (left > 1 && left % 3 === 1) out.push(NB);
  }
  return (neg ? '-' : '') + out.join('');
}

/** 1 245 -> "1,2 ming" style compact counter for views/likes */
export function compact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const v = n / 1000;
    return `${v.toFixed(v < 10 ? 1 : 0).replace('.', ',')}K`;
  }
  return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
}

/** Pretty phone: +998 90 123 45 67 */
export function prettyPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').replace(/^998/, '');
  const digits = d.slice(0, 9);
  if (digits.length < 2) return raw;
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(
    Boolean,
  );
  return `+998 ${parts.join(' ')}`;
}

/** Mask the middle of a phone number until the user reveals it. */
export function maskedPhone(raw: string): string {
  const p = prettyPhone(raw).split(' ');
  if (p.length < 3) return '+998 __ ___ __ __';
  p[2] = p[2].padEnd(3, '•').slice(0, 3);
  p[3] = (p[3] ?? '').padEnd(2, '•').slice(0, 2);
  p[4] = (p[4] ?? '').padEnd(2, '•').slice(0, 2);
  return p.join(' ');
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return (parts.map((p) => p[0] ?? '').join('') || '?').toUpperCase();
}

export function formatPrice(n: number, cur: string): string {
  if (!n) return '';
  return `${group(n)} ${cur}`;
}

export function parseNum(v: string): number {
  const n = Number(String(v).replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function digits(n: number): string {
  return n > 0 ? String(n) : '';
}
