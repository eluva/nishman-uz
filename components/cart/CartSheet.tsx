'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Sheet } from '@/components/global/Sheet';
import { Icon } from '@/components/ui/Icon';
import { Price } from '@/components/ui/Price';
import { selectTotal, useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { Checkout } from './Checkout';

/** Корзина: drawer справа на десктопе, bottom sheet на телефоне. Внутри — оформление по шагам. */
export function CartSheet() {
  const t = useTranslations();
  const open = useUi((s) => s.cartOpen);
  const checkout = useUi((s) => s.checkout);
  const close = useUi((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const total = useCart(selectTotal);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  if (checkout) {
    return (
      <Sheet open={open} onClose={close} title={t('cart.checkout')} wide>
        <Checkout />
      </Sheet>
    );
  }

  return (
    <Sheet
      open={open}
      onClose={close}
      title={t('header.cart')}
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-[0.14em] text-muted">{t('cart.total')}</span>
              <Price value={total} className="display text-2xl" />
            </div>
            <p className="text-xs text-muted">{t('cart.note')}</p>
            <button type="button" className="btn btn-accent w-full" onClick={() => useUi.setState({ checkout: true })}>
              {t('cart.checkout')}
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-5 px-6 py-12 text-center">
          <Icon name="cart" size={40} className="text-muted" />
          <p className="display text-2xl">{t('cart.empty')}</p>
          <a href="#catalog" onClick={close} className="btn btn-ghost">
            {t('common.toCatalog')}
          </a>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li key={i.key} className="flex gap-4 px-5 py-4 lg:px-7">
              <span className="relative h-20 w-20 shrink-0 rounded-xl bg-tile">
                <Image src={i.image} alt="" fill sizes="80px" quality={60} className="object-contain p-2" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate font-display font-extrabold uppercase">{i.title}</p>
                <p className="truncate text-xs text-muted">{[i.subtitle, i.shadeLabel].filter(Boolean).join(' · ')}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center rounded-full ring-1 ring-line">
                    <button type="button" aria-label={t('cart.decrease')} onClick={() => setQty(i.key, i.qty - 1)} className="flex h-11 w-11 items-center justify-center">
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                      {i.qty}
                    </span>
                    <button type="button" aria-label={t('cart.increase')} onClick={() => setQty(i.key, i.qty + 1)} className="flex h-11 w-11 items-center justify-center">
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                  <Price value={i.price * i.qty} className="text-sm font-semibold" />
                </div>
              </div>
              <button type="button" aria-label={`${t('cart.remove')}: ${i.title}`} onClick={() => remove(i.key)} className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-muted hover:text-bone">
                <Icon name="close" size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
