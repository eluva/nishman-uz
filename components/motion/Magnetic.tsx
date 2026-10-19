'use client';

import { m, useMotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { useFinePointer, useReducedMotionPref } from '@/components/providers/device';

/** Магнитный эффект для главных кнопок — только мышь, без reduced motion */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  if (!fine || reduced) return <span className={`inline-flex ${className ?? ''}`}>{children}</span>;
  return (
    <m.span
      className={`inline-flex transition-transform duration-700 ease-lux ${className ?? ''}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.span>
  );
}
