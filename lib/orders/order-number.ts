/** Номер заказа вида NM-251019-4F7K: дата (Ташкент) + случайный суффикс */
export function createOrderNumber(now = new Date()) {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/-/g, '');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `NM-${ymd}-${suffix}`;
}
