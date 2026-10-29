'use client';

import { AnimatePresence, m } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { lockScroll } from '@/components/providers/scroll-lock';
import { Icon } from '@/components/ui/Icon';
import type { ImageAsset } from '@/lib/catalog/types';
import { EASE } from '@/lib/motion';

/** Полноэкранный просмотр: стрелки, Esc, свайп */
export function Lightbox({ photos, index, onIndex, onClose }: { photos: ImageAsset[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const t = useTranslations();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const go = (d: number) => onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    lockScroll(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [index, onClose, onIndex, photos.length]);

  const p = photos[index];
  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={t('lookbook.alt', { n: index + 1 })}
      className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <span className="text-xs tracking-[0.2em] text-muted">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </span>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label={t('common.close')} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-raised">
          <Icon name="close" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.div
            key={p.src}
            className="absolute inset-0 px-4 pb-6 lg:px-24"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
          >
            <div className="relative h-full w-full">
              <Image src={p.src} alt={t('lookbook.alt', { n: index + 1 })} fill sizes="100vw" quality={85} className="object-contain" draggable={false} />
            </div>
          </m.div>
        </AnimatePresence>
        <button type="button" onClick={() => go(-1)} aria-label={t('common.prev')} className="absolute left-4 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 ring-1 ring-line lg:flex">
          <Icon name="arrowLeft" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label={t('common.next')} className="absolute right-4 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-surface/80 ring-1 ring-line lg:flex">
          <Icon name="arrowRight" />
        </button>
      </div>
    </m.div>
  );
}
