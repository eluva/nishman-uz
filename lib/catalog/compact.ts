import type { Product } from './types';

/** Компактная форма для передачи с сервера: тексты свойств и пилюль — индексы в общей таблице строк */
export type CompactProduct = Omit<Product, 'features' | 'notes'> & { f: number[]; n: number[] };
export interface CompactCatalog {
  products: CompactProduct[];
  texts: string[];
}

/** Сервер → клиент: каталог сериализуется один раз, повторяющиеся тексты — один раз */
export function compactCatalog(products: Product[]): CompactCatalog {
  const texts: string[] = [];
  const index = new Map<string, number>();
  const ref = (s: string) => {
    let i = index.get(s);
    if (i === undefined) {
      i = texts.push(s) - 1;
      index.set(s, i);
    }
    return i;
  };
  return {
    texts,
    products: products.map(({ features, notes, ...rest }) => ({ ...rest, f: features.map(ref), n: notes.map(ref) })),
  };
}

