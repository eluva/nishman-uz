/** Валидация, общая для клиента и сервера */

/** Узбекский мобильный: +998 XX XXX-XX-XX (9 цифр после кода страны) */
export function normalizeUzPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  if (digits.length !== 9) return null;
  return `+998${digits}`;
}

/** Маска ввода: «97 737-71-17» (без кода страны, он показан префиксом) */
export function formatUzPhoneInput(input: string): string {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('998') && d.length > 9) d = d.slice(3);
  d = d.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  let out = parts[0];
  if (parts[1]) out += ' ' + parts[1];
  if (parts[2]) out += '-' + parts[2];
  if (parts[3]) out += '-' + parts[3];
  return out;
}

export function isNonEmpty(s: unknown, min = 2, max = 200): s is string {
  return typeof s === 'string' && s.trim().length >= min && s.trim().length <= max;
}

export function clean(s: unknown, max = 1000) {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}
