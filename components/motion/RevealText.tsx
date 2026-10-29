'use client';

import type { CSSProperties, ElementType } from 'react';
import { useReveal } from './reveal';

interface Props {
  /** Строки заголовка (каждая — с новой строки) */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Первый экран: появление сразу (CSS-анимация), не дожидаясь прокрутки */
  immediate?: boolean;
  id?: string;
  /** Индекс строки, выделенной акцентным цветом */
  accentIndex?: number;
}

/** Заголовок с мягким появлением целиком: opacity + translateY. Без масок — буквы не обрезаются. */
export function RevealText({ lines, as: Tag = 'h2', className, lineClassName, delay = 0, immediate, id, accentIndex }: Props) {
  const ref = useReveal<HTMLElement>();
  const content = lines.map((line, i) => (
    <span key={i} className={`block ${lineClassName ?? ''} ${i === accentIndex ? 'text-accent' : ''}`}>
      {line}
    </span>
  ));
  if (immediate) {
    return (
      <Tag className={`rise-in ${className ?? ''}`} id={id} style={{ animationDelay: `${delay}s` }}>
        {content}
      </Tag>
    );
  }
  return (
    <Tag ref={ref} data-reveal="" className={className} id={id} style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}>
      {content}
    </Tag>
  );
}
