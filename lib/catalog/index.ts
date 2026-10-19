import 'server-only';
import { cache } from 'react';
import { JsonCatalogProvider } from './json-provider';
import type { CatalogProvider } from './types';

/** Точка подключения источника каталога (см. README → «Интеграция каталога»). */
let provider: CatalogProvider | null = null;
export function getCatalog(): CatalogProvider {
  provider ??= new JsonCatalogProvider();
  return provider;
}

export const getLocalizedCatalog = cache(async (locale: string) => {
  const catalog = getCatalog();
  const [products, categories, lines] = await Promise.all([
    catalog.getProducts(locale),
    catalog.getCategories(locale),
    catalog.getLines(locale),
  ]);
  return { products, categories, lines };
});
