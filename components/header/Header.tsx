'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { LangSwitch } from './LangSwitch';
import { MobileMenu } from './MobileMenu';
import { selectCount, useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { siteConfig } from '@/site.config';

/** Шапка: прозрачная вверху, с blur после прокрутки */
export function Header() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const count = useCart(selectCount);
  const openCart = useUi((s) => s.openCart);
  const menuOpen = useUi((s) => s.menuOpen);
  const setMenu = useUi((s) => s.setMenu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,backdrop-filter,border-color] duration-700 ease-lux ${
          scrolled || menuOpen ? 'border-b border-line/70 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-20">
          <a href="#top" aria-label={t('header.home')} className="flex min-h-11 items-center">
            <Logo className="h-7 w-auto lg:h-8" alt="NISHMAN" />
          </a>

          <nav aria-label={t('header.menu')} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {siteConfig.nav.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="inline-flex min-h-11 items-center text-[0.78rem] font-medium uppercase tracking-[0.16em] text-bone/85 hover:text-bone">
                    <span className="link-u">{t(`nav.${id}`)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LangSwitch className="hidden lg:flex" />
            <button
              type="button"
              data-cart-target
              onClick={() => openCart()}
              aria-label={`${t('header.cart')}: ${count}`}
              className="relative hidden h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 hover:bg-raised lg:flex"
            >
              <Icon name="cart" size={22} />
              <AnimatePresence>
                {count > 0 && (
                  <m.span
                    key={count}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink"
                  >
                    {count}
                  </m.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setMenu(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t('common.close') : t('header.menu')}
              className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
}
