'use client';

import { m } from 'framer-motion';
import type { ElementType } from 'react';
import { EASE, viewportOnce } from '@/lib/motion';

interface Props {
  /** Строки заголовка: каждая проявляется из-под маски отдельно */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Анимировать сразу при монтировании (hero), а не при появлении в зоне видимости */
  immediate?: boolean;
  id?: string;
  /** Индекс строки, выделенной акцентным цветом */
  accentIndex?: number;
}

/** Построчное маск-появление: clip (overflow) + translateY */
export function RevealText({ lines, as: Tag = 'h2', className, lineClassName, delay = 0, immediate, id, accentIndex }: Props) {
  if (immediate) {
    // Первый экран: чистый CSS — строки проявляются сразу после первой отрисовки, не дожидаясь JS
    return (
      <Tag className={className} id={id}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span
              className={`reveal-line block ${lineClassName ?? ''} ${i === accentIndex ? 'text-accent' : ''}`}
              style={{ animationDelay: `${delay + i * 0.1}s` }}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    );
  }
  const trigger = { whileInView: 'show', viewport: viewportOnce };
  return (
    <Tag className={className} id={id}>
      <m.span className="block" initial="hidden" {...trigger} transition={{ staggerChildren: 0.1, delayChildren: delay }}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <m.span
              className={`block ${lineClassName ?? ''} ${i === accentIndex ? 'text-accent' : ''}`}
              variants={{
                hidden: { y: '105%' },
                show: { y: '0%', transition: { duration: 1.1, ease: EASE } },
              }}
            >
              {line}
            </m.span>
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
