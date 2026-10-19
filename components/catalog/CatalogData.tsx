'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { CompactCatalog } from '@/lib/catalog/compact';
import type { Product } from '@/lib/catalog/types';

const Ctx = createContext<{ products: Product[]; byId: Map<string, Product> } | null>(null);

export function CatalogData({ data, children }: { data: CompactCatalog; children: ReactNode }) {
  const value = useMemo(() => {
    const products = data.products.map(({ f, n, ...rest }) => ({
      ...rest,
      features: f.map((i) => data.texts[i]),
      notes: n.map((i) => data.texts[i]),
    }));
    return { products, byId: new Map(products.map((p) => [p.id, p])) };
  }, [data]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('CatalogData provider is missing');
  return ctx;
}

/** Товары по списку id (порядок сохраняется) */
export function usePick(ids: readonly string[]) {
  const { byId } = useCatalogData();
  return useMemo(() => ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p)), [ids, byId]);
}
