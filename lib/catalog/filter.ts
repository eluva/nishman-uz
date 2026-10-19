import type { Product, ProductQuery } from './types';

/** Чистые функции фильтрации/сортировки — общие для сервера и клиента. */
export function minPrice(p: Product) {
  return Math.min(...p.volumes.map((v) => v.price));
}

export function filterProducts(products: Product[], q: ProductQuery = {}): Product[] {
  const search = q.search?.trim().toLowerCase();
  const list = products.filter((p) => {
    if (q.category && p.category !== q.category) return false;
    if (q.line && p.line !== q.line) return false;
    if (q.effect && p.effect !== q.effect) return false;
    if (q.hold != null && p.hold !== q.hold) return false;
    if (q.volume != null && !p.volumes.some((v) => v.value === q.volume && v.unit !== 'pcs')) return false;
    if (q.forSalons && p.forSalons.length === 0) return false;
    if (search) {
      const hay = [p.code, p.name, p.type, p.scent, p.lineName].filter(Boolean).join(' ').toLowerCase();
      if (!search.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  switch (q.sort) {
    case 'price-asc':
      return [...list].sort((a, b) => minPrice(a) - minPrice(b));
    case 'price-desc':
      return [...list].sort((a, b) => minPrice(b) - minPrice(a));
    case 'hold-desc':
      return [...list].sort((a, b) => (b.hold ?? -1) - (a.hold ?? -1));
    case 'name':
      return [...list].sort((a, b) => (a.name ?? a.type).localeCompare(b.name ?? b.type));
    default:
      return list;
  }
}

export function countActiveFilters(q: ProductQuery) {
  return [q.line, q.effect, q.hold != null ? 1 : null, q.volume != null ? 1 : null, q.forSalons || null].filter(Boolean)
    .length;
}
