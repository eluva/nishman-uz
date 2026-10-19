'use client';

import { useSyncExternalStore } from 'react';

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const fine = mediaStore('(hover: hover) and (pointer: fine)');
const reduced = mediaStore('(prefers-reduced-motion: reduce)');
const desktop = mediaStore('(min-width: 1024px)');

/** Мышь/тачпад: включаем lenis, курсор, magnetic. На сервере — false. */
export function useFinePointer() {
  return useSyncExternalStore(fine.subscribe, fine.get, () => false);
}
export function useReducedMotionPref() {
  return useSyncExternalStore(reduced.subscribe, reduced.get, () => false);
}
export function useIsDesktop() {
  return useSyncExternalStore(desktop.subscribe, desktop.get, () => false);
}
