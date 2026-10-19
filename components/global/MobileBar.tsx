'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { selectCount, useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { siteConfig } from '@/site.config';

/** Нижняя липкая панель телефона: Позвонить / Telegram / Корзина */
export function MobileBar() {
  const t = useTranslations();
  const count = useCart(selectCount);
  const openCart = useUi((s) => s.openCart);
  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[0.66rem] font-medium uppercase tracking-[0.12em]';
  return (
    <nav
      aria-label={t('header.menu')}
      className="fixed inset-x-0 bottom-0 z-[58] border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex">
        <a href={siteConfig.contacts.phoneHref} className={item}>
          <Icon name="phone" />
          {t('common.call')}
        </a>
        <a href={siteConfig.contacts.telegram} target="_blank" rel="noopener" className={item}>
          <Icon name="telegram" />
          Telegram
        </a>
        <button type="button" onClick={() => openCart()} className={`${item} relative`} data-cart-target>
          <span className="relative">
            <Icon name="cart" />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </span>
          {t('header.cart')}
        </button>
      </div>
    </nav>
  );
}
