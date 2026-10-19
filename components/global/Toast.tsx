'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useEffect } from 'react';
import { useUi } from '@/lib/store/ui';
import { Icon } from '@/components/ui/Icon';

/** Тост «Добавлено в корзину» — над нижней панелью на телефоне, снизу слева на десктопе */
export function Toast() {
  const toast = useUi((s) => s.toast);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => useUi.setState({ toast: null }), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[75] flex justify-center px-4 lg:bottom-8 lg:justify-start lg:px-8"
    >
      <AnimatePresence>
        {toast && (
          <m.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex items-center gap-3 rounded-full bg-bone py-3 pl-3 pr-5 text-sm font-medium text-ink shadow-2xl"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent">
              <Icon name="check" size={16} />
            </span>
            {toast.text}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
