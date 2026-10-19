import type { Unit } from '@/lib/catalog/types';

/** «35 000» — тонкий неразрывный пробел между разрядами для всех языков */
export function formatNumber(n: number) {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatVolume(value: number, unit: Unit) {
  if (unit === 'pcs') return '';
  return `${value} ${unit}`;
}

/** «30 · 100 · 150 ml» — как на пилюлях каталога */
export function formatVolumes(values: { value: number; unit: Unit }[]) {
  const vols = values.filter((v) => v.unit !== 'pcs');
  if (!vols.length) return '';
  return `${vols.map((v) => v.value).join(' · ')} ${vols[0].unit}`;
}

export function telegramShareText(text: string) {
  return `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
}
