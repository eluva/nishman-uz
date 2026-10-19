'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, SHIFT, viewportOnce } from '@/lib/motion';

/** Спокойное появление блока: opacity + translateY 20px */
export function FadeIn({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' }) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: SHIFT }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}
