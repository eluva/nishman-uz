'use client';

import { create } from 'zustand';
import type { CategoryId, Effect, ProductQuery, SortKey } from '@/lib/catalog/types';
import { scrollBehavior } from '@/lib/motion';

/** Состояние интерфейса: шторки, быстрый просмотр, тосты */
interface UiState {
  cartOpen: boolean;
  checkout: boolean;
  menuOpen: boolean;
  quickViewId: string | null;
  toast: { id: number; text: string } | null;
  openCart: (checkout?: boolean) => void;
  closeCart: () => void;
  setMenu: (open: boolean) => void;
  openQuickView: (id: string | null) => void;
  showToast: (text: string) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  checkout: false,
  menuOpen: false,
  quickViewId: null,
  toast: null,
  openCart: (checkout = false) => set({ cartOpen: true, checkout, quickViewId: null }),
  closeCart: () => set({ cartOpen: false, checkout: false }),
  setMenu: (menuOpen) => set({ menuOpen }),
  openQuickView: (quickViewId) => set({ quickViewId }),
  showToast: (text) => set({ toast: { id: Date.now(), text } }),
}));

/** Фильтры каталога — общие для индекса, панели фильтров, квиза и «Линеек» */
interface FilterState extends Required<Omit<ProductQuery, 'category' | 'line' | 'effect' | 'hold' | 'volume'>> {
  category: CategoryId | null;
  line: string | null;
  effect: Effect | null;
  hold: number | null;
  volume: number | null;
  sort: SortKey;
  page: number;
  set: (patch: Partial<Omit<FilterState, 'set' | 'reset' | 'apply'>>) => void;
  /** Применить фильтр снаружи (индекс, «Линейки») и прокрутить к сетке */
  apply: (patch: Partial<Omit<FilterState, 'set' | 'reset' | 'apply'>>) => void;
  reset: () => void;
}

const initial = {
  category: null,
  line: null,
  effect: null,
  hold: null,
  volume: null,
  forSalons: false,
  search: '',
  sort: 'default' as SortKey,
  page: 1,
};

export const useFilters = create<FilterState>()((set) => ({
  ...initial,
  set: (patch) => set((s) => ({ ...s, ...patch, page: 'page' in patch ? (patch.page ?? 1) : 1 })),
  apply: (patch) => {
    set({ ...initial, ...patch, page: 1 });
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        document.getElementById('catalog-grid')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      });
    }
  },
  reset: () => set({ ...initial }),
}));
