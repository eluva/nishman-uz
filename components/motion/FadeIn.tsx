'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from './reveal';

/** Спокойное появление блока: opacity + translateY 24px (CSS-переход, без scroll-обработчиков) */
export function FadeIn({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' }) {
  const ref = useReveal<HTMLElement>();
  const Comp = as;
  return (
    <Comp ref={ref as never} data-reveal="" className={className} style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Comp>
  );
}
