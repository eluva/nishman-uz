// Проверка переводов: одинаковые ключи во всех языках и отсутствие одинаковых текстов под разными ключами.
import { readFileSync } from 'node:fs';

const locales = ['ru', 'uz', 'en'];
const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, String(v)]],
  );

let failed = false;
const keysets = {};
for (const loc of locales) {
  const ui = JSON.parse(readFileSync(`messages/${loc}.json`, 'utf8'));
  const cat = JSON.parse(readFileSync(`messages/catalog/${loc}.json`, 'utf8'));
  const entries = [...flatten(ui), ...flatten(cat, 'catalogData.')];
  keysets[loc] = new Set(entries.map(([k]) => k));
  const seen = new Map();
  for (const [k, v] of entries) {
    const norm = v.trim().toLowerCase();
    if (seen.has(norm)) {
      console.log(`[${loc}] duplicate text "${v}": ${seen.get(norm)} = ${k}`);
      failed = true;
    } else seen.set(norm, k);
  }
}
for (const loc of locales.slice(1)) {
  for (const k of keysets.ru) if (!keysets[loc].has(k)) { console.log(`[${loc}] missing ${k}`); failed = true; }
  for (const k of keysets[loc]) if (!keysets.ru.has(k)) { console.log(`[${loc}] extra ${k}`); failed = true; }
}
if (failed) process.exit(1);
console.log('messages ok:', [...keysets.ru].length, 'keys ×', locales.length, 'locales');
