/** Доменные типы каталога. UI работает только с ними и не знает об источнике данных. */

export type Effect = 'matte' | 'natural-shine' | 'semi-matte' | 'natural';
export type Unit = 'ml' | 'g' | 'pcs';
export type CategoryId = 'styling' | 'care' | 'color' | 'shaving' | 'beard' | 'face' | 'body' | 'accessories';

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export interface Volume {
  value: number;
  unit: Unit;
  /** Розничная цена, UZS */
  price: number;
  demo?: boolean;
}

export interface Product {
  id: string;
  code: string | null;
  line: string;
  lineName: string;
  category: CategoryId;
  /** Тип товара (переведён): «Матовая паста» */
  type: string;
  /** Бренд-название (не переводится): «ARGAN» */
  name: string | null;
  /** Аромат или вариант исполнения (переведён) */
  scent: string | null;
  volumes: Volume[];
  effect: Effect | null;
  /** 0 — «без фиксации», 1–5 — точки «Фиксация», null — не указано */
  hold: number | null;
  holdPlus: boolean;
  features: string[];
  notes: string[];
  /** Профессиональные (салонные) объёмы */
  forSalons: number[];
  size: string | null;
  /** image — фото оттенка (есть в gallery), если снят отдельно */
  shades: { id: string; label: string; image: ImageAsset | null }[];
  swatch: string | null;
  image: ImageAsset;
  gallery: ImageAsset[];
}

export interface Line {
  id: string;
  name: string;
  category: CategoryId;
  count: number;
}

export interface Category {
  id: CategoryId;
  number: string;
  count: number;
}

export interface ProductQuery {
  category?: CategoryId | null;
  line?: string | null;
  effect?: Effect | null;
  hold?: number | null;
  volume?: number | null;
  forSalons?: boolean;
  search?: string;
  sort?: SortKey;
}

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'hold-desc' | 'name';

export interface OrderItemInput {
  productId: string;
  volume: number;
  shade?: string | null;
  qty: number;
}

export type DeliveryMethod = 'courier' | 'regions' | 'pickup';
export type PaymentMethod = 'click' | 'payme' | 'cash';

export interface OrderInput {
  customer: { name: string; phone: string };
  delivery: { method: DeliveryMethod; city?: string; address?: string; storeId?: string };
  payment: PaymentMethod;
  comment?: string;
  items: OrderItemInput[];
  locale: string;
}

export interface OrderLine extends OrderItemInput {
  title: string;
  price: number;
  sum: number;
}

export interface Order {
  number: string;
  createdAt: string;
  status: 'new' | 'awaiting-payment' | 'paid';
  input: OrderInput;
  lines: OrderLine[];
  total: number;
}

/**
 * Источник каталога. Сейчас — JSON, собранный из PDF; позже — учётная система клиента
 * (1С / МойСклад / собственный API): достаточно реализовать этот интерфейс.
 */
export interface CatalogProvider {
  getProducts(locale: string, query?: ProductQuery): Promise<Product[]>;
  getProduct(locale: string, id: string): Promise<Product | null>;
  getCategories(locale: string): Promise<Category[]>;
  getLines(locale: string): Promise<Line[]>;
  /** Проверяет позиции и цены на стороне источника и создаёт заказ */
  createOrder(input: OrderInput): Promise<Order>;
}
