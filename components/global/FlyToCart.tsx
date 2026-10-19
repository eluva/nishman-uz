'use client';

import { useEffect } from 'react';

/** Запускает «полёт» миниатюры товара к видимой иконке корзины */
export function flyToCart(img: HTMLElement | null) {
  if (!img || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = [...document.querySelectorAll<HTMLElement>('[data-cart-target]')].find((el) => el.offsetParent !== null);
  if (!target) return;
  const from = img.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const ghost = img.cloneNode(true) as HTMLElement;
  const size = Math.min(from.width, from.height, 140);
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
    zIndex: '95',
    pointerEvents: 'none',
    margin: '0',
  });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const anim = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(0.55)`, opacity: 0.9, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.2 },
    ],
    { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
  anim.onfinish = () => {
    ghost.remove();
    target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], {
      duration: 600,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
  };
}

/** Регидрация корзины из localStorage после монтирования (без рассинхрона SSR) */
export function CartHydrator() {
  useEffect(() => {
    import('@/lib/store/cart').then(({ useCart }) => useCart.persist.rehydrate());
  }, []);
  return null;
}
