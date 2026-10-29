'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { lockScroll } from '@/components/providers/scroll-lock';
import { useIsDesktop } from '@/components/providers/device';
import { Icon } from '@/components/ui/Icon';
import { EASE } from '@/lib/motion';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** desktop: 'drawer' — справа, 'dialog' — по центру; на телефоне всегда bottom sheet */
  desktop?: 'drawer' | 'dialog';
  children: ReactNode;
  /** Липкий низ (кнопка «В корзину», итог) */
  footer?: ReactNode;
  wide?: boolean;
}

/** Шторка: drawer/dialog на десктопе, bottom sheet на телефоне. Блокирует фон, Esc закрывает, фокус внутри. */
export function Sheet({ open, onClose, title, desktop = 'drawer', children, footer, wide }: Props) {
  const t = useTranslations('common');
  const isDesktop = useIsDesktop();
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panel.current?.focus());
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const mode = isDesktop ? desktop : 'bottom';
  const variants = {
    bottom: { hidden: { y: '100%' }, show: { y: 0 } },
    drawer: { hidden: { x: '100%' }, show: { x: 0 } },
    dialog: { hidden: { opacity: 0, y: 24, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1 } },
  }[mode];

  const position = {
    bottom: 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[1.75rem]',
    drawer: `inset-y-0 right-0 h-dvh w-full ${wide ? 'max-w-[560px]' : 'max-w-[480px]'}`,
    dialog: 'left-1/2 top-1/2 max-h-[88dvh] w-[min(1080px,calc(100vw-4rem))] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem]',
  }[mode];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85]">
          <m.button
            type="button"
            aria-label={t('close')}
            tabIndex={-1}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            onClick={onClose}
          />
          <div className={`pointer-events-none absolute ${mode === 'dialog' ? 'inset-0' : ''} ${mode === 'dialog' ? '' : position}`}>
            <m.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className={`pointer-events-auto flex flex-col overflow-hidden bg-surface text-bone shadow-[0_-20px_80px_rgba(0,0,0,0.5)] outline-none ${
                mode === 'dialog' ? `absolute ${position}` : 'h-full max-h-[inherit]'
              } ${mode === 'bottom' ? 'rounded-t-[1.75rem]' : ''}`}
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={variants}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="relative flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 lg:px-7 lg:py-5">
                {mode === 'bottom' && (
                  <span aria-hidden="true" className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line" />
                )}
                <h2 id={titleId} className="display truncate text-lg">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('close')}
                  className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-500 hover:bg-raised"
                >
                  <Icon name="close" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
              {footer && (
                <div className="shrink-0 border-t border-line bg-surface px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 lg:px-7">
                  {footer}
                </div>
              )}
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
