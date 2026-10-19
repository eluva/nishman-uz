'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Unit } from '@/lib/catalog/types';

export interface CartItem {
  key: string;
  productId: string;
  volume: number;
  unit: Unit;
  shade: string | null;
  shadeLabel: string | null;
  qty: number;
  /** Снимок цены и подписи на момент добавления (итог пересчитывается на сервере) */
  price: number;
  title: string;
  subtitle: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const cartKey = (productId: string, volume: number, shade: string | null) =>
  `${productId}:${volume}:${shade ?? ''}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const key = cartKey(item.productId, item.volume, item.shade);
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return { items: s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i)) };
          }
          return { items: [...s.items, { ...item, key, qty }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(99, qty) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'nishman-cart', version: 1, storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
export const selectTotal = (s: CartState) => s.items.reduce((n, i) => n + i.qty * i.price, 0);
