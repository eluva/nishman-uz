'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '@/lib/motion';

const loadFeatures = () => import('./motion-features').then((mod) => mod.default);

/** LazyMotion (domMax, подгружается асинхронно) + единая кривая; reducedMotion="user" отключает transform-анимации */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: EASE }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
