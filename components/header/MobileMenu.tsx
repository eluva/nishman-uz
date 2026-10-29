'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { LangSwitch } from './LangSwitch';
import { Icon } from '@/components/ui/Icon';
import { lockScroll } from '@/components/providers/scroll-lock';
import { useUi } from '@/lib/store/ui';
import { EASE } from '@/lib/motion';
import { siteConfig } from '@/site.config';

/** Мобильное меню на весь экран. Контакты — только кнопками-иконками. */
export function MobileMenu() {
  const t = useTranslations();
  const open = useUi((s) => s.menuOpen);
  const setMenu = useUi((s) => s.setMenu);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, setMenu]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          className="fixed inset-0 z-[55] flex flex-col bg-ink px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-24 lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <nav aria-label={t('header.menu')} className="flex-1">
            <ul className="space-y-1">
              {siteConfig.nav.map((id, i) => (
                <li key={id}>
                  <m.a
                    href={`#${id}`}
                    onClick={() => setMenu(false)}
                    className="display flex min-h-14 items-baseline gap-4 text-[2.5rem] xs:text-5xl"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.05 }}
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-accent">0{i + 1}</span>
                    {t(`nav.${id}`)}
                  </m.a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between border-t border-line pt-5">
            <LangSwitch size="lg" />
            <div className="flex gap-2">
              <a href={siteConfig.contacts.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-line">
                <Icon name="instagram" />
              </a>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
