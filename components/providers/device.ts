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

const desktop = mediaStore('(min-width: 1024px)');

export function useIsDesktop() {
  return useSyncExternalStore(desktop.subscribe, desktop.get, () => false);
}
