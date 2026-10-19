import 'server-only';
import productsRaw from '@/data/products.json';
import linesRaw from '@/data/lines.json';
import categoriesRaw from '@/data/categories.json';
import { filterProducts } from './filter';
import type {
  CatalogProvider, Category, CategoryId, Effect, Line, Order, OrderInput, Product, ProductQuery, Unit,
} from './types';
import { createOrderNumber } from '../orders/order-number';

type RawProduct = (typeof productsRaw)[number];
type CatalogMessages = {
  types: Record<string, string>;
  scents: Record<string, string>;
  variants: Record<string, string>;
  shades: Record<string, string>;
  notes: Record<string, string>;
  features: Record<string, string>;
  lineNames: Record<string, string>;
};

const LOCALES = ['ru', 'uz', 'en'];
const messageCache = new Map<string, Promise<CatalogMessages>>();

function loadMessages(locale: string): Promise<CatalogMessages> {
  const safe = LOCALES.includes(locale) ? locale : 'ru';
  let pending = messageCache.get(safe);
  if (!pending) {
    pending = import(`@/messages/catalog/${safe}.json`).then((m) => m.default as CatalogMessages);
    messageCache.set(safe, pending);
  }
  return pending;
}

function lineName(id: string, m: CatalogMessages) {
  const raw = linesRaw.find((l) => l.id === id);
  return raw?.name ?? m.lineNames[id.replace(/-/g, '_')] ?? id;
}

function localize(p: RawProduct, m: CatalogMessages): Product {
  const text = (k: string) => m.features[k] ?? m.notes[k] ?? k;
  const variant = p.variant ? (m.variants[p.variant] ?? m.shades[p.variant]) : null;
  return {
    id: p.id,
    code: p.code,
    line: p.line,
    lineName: lineName(p.line, m),
    category: p.category as CategoryId,
    type: m.types[p.type] ?? p.type,
    name: p.name,
    scent: p.scent ? m.scents[p.scent] : variant,
    volumes: p.volumes.map((v) => ({ ...v, unit: v.unit as Unit })),
    effect: (p.effect as Effect | null) ?? null,
    hold: p.hold ?? null,
    holdPlus: p.holdPlus,
    features: p.features.map(text),
    notes: p.notes.map((k) => m.notes[k] ?? k),
    forSalons: p.forSalons,
    size: p.size ?? null,
    shades: p.shades.map((id) => ({ id, label: m.shades[id] ?? id })),
    swatch: p.swatch ?? null,
    image: p.image,
    gallery: p.gallery,
  };
}

export class JsonCatalogProvider implements CatalogProvider {
  private cache = new Map<string, Product[]>();

  async getProducts(locale: string, query?: ProductQuery): Promise<Product[]> {
    let all = this.cache.get(locale);
    if (!all) {
      const m = await loadMessages(locale);
      all = productsRaw.map((p) => localize(p, m));
      this.cache.set(locale, all);
    }
    return query ? filterProducts(all, query) : all;
  }

  async getProduct(locale: string, id: string) {
    return (await this.getProducts(locale)).find((p) => p.id === id) ?? null;
  }

  async getCategories(): Promise<Category[]> {
    return categoriesRaw.map((c) => ({
      id: c.id as CategoryId,
      number: c.number,
      count: productsRaw.filter((p) => p.category === c.id).length,
    }));
  }

  async getLines(locale: string): Promise<Line[]> {
    const m = await loadMessages(locale);
    return linesRaw
      .filter((l) => l.count > 0)
      .map((l) => ({ id: l.id, name: lineName(l.id, m), category: l.category as CategoryId, count: l.count }));
  }

  async createOrder(input: OrderInput): Promise<Order> {
    const products = await this.getProducts(input.locale);
    const lines = input.items.map((item) => {
      const p = products.find((x) => x.id === item.productId);
      if (!p) throw new Error(`Unknown product: ${item.productId}`);
      const vol = p.volumes.find((v) => v.value === item.volume);
      if (!vol) throw new Error(`Unknown volume ${item.volume} for ${p.id}`);
      if (item.shade && !p.shades.some((s) => s.id === item.shade)) throw new Error(`Unknown shade for ${p.id}`);
      const qty = Math.min(99, Math.max(1, Math.floor(item.qty)));
      const shade = item.shade ? p.shades.find((s) => s.id === item.shade)?.label : null;
      const title = [p.code, p.name ?? p.type, vol.unit === 'pcs' ? null : `${vol.value} ${vol.unit}`, shade]
        .filter(Boolean)
        .join(' · ');
      return { ...item, qty, title, price: vol.price, sum: vol.price * qty };
    });
    return {
      number: createOrderNumber(),
      createdAt: new Date().toISOString(),
      status: input.payment === 'cash' ? 'new' : 'awaiting-payment',
      input,
      lines,
      total: lines.reduce((s, l) => s + l.sum, 0),
    };
  }
}
