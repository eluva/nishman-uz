'use client';

import { AnimatePresence, m, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFinePointer, useReducedMotionPref } from '@/components/providers/device';

/** Курсор «Смотреть» над фото с data-cursor="view" (только мышь) */
export function CustomCursor() {
  const t = useTranslations('common');
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (!fine || reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setActive(Boolean(target?.closest?.('[data-cursor="view"]')));
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;
  return (
    <m.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] transition-transform duration-200 ease-out" style={{ x, y }}>
      <AnimatePresence>
        {active && (
          <m.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="-ml-11 -mt-11 flex h-22 w-22 items-center justify-center rounded-full bg-bone text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink"
          >
            {t('view')}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
