'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import type { ImageAsset } from '@/lib/catalog/types';
import { EASE, viewportOnce } from '@/lib/motion';
import { useIsDesktop, useReducedMotionPref } from '@/components/providers/device';

interface Props {
  image: ImageAsset;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Параллакс в процентах (на телефоне — вдвое слабее) */
  parallax?: number;
  priority?: boolean;
  /** Показывать курсор «Смотреть» */
  cursor?: boolean;
  shade?: boolean;
}

/**
 * Фото: reveal через clip-path, scale 1.12 → 1, из blur(10px) в чёткость (телефон — 4px),
 * мягкий параллакс. prefers-reduced-motion — простое появление.
 */
export function RevealImage({ image, alt, sizes, className, imgClassName, parallax = 0, priority, cursor, shade }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotionPref();
  const amount = reduced ? 0 : desktop ? parallax : parallax / 2;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-amount}%`, `${amount}%`]);
  // блюр-появление только на десктопе; на телефоне — без filter (экономия отрисовки)
  const blur = desktop ? 10 : 0;

  return (
    // триггер — на внешнем контейнере: у элемента с clip-path inset(100%) нулевая площадь, и IntersectionObserver его не видит
    <m.div
      ref={ref}
      className={`${className?.includes('absolute') ? '' : 'relative'} overflow-hidden ${shade ? 'photo-shade' : ''} ${className ?? ''}`}
      data-cursor={cursor ? 'view' : undefined}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <m.div
        className="absolute inset-0"
        variants={{
          hidden: reduced ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12, ...(blur ? { filter: `blur(${blur}px)` } : {}) },
          show: reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ...(blur ? { filter: 'blur(0px)' } : {}) },
        }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <m.div className="absolute inset-[-10%]" style={amount ? { y } : undefined}>
          <Image
            src={image.src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={75}
            className={`photo-tone object-cover ${imgClassName ?? ''}`}
          />
        </m.div>
      </m.div>
    </m.div>
  );
}
