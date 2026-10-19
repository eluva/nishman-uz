'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { flyToCart } from '@/components/global/FlyToCart';
import type { Product } from '@/lib/catalog/types';
import { formatVolume } from '@/lib/format';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';

export const effectKey = (e: NonNullable<Product['effect']>) =>
  ({ matte: 'matte', 'natural-shine': 'naturalShine', 'semi-matte': 'semiMatte', natural: 'natural' })[e];

export function productTitle(p: Product) {
  return p.name ?? p.type;
}

/** Добавление в корзину: тост + «полёт» миниатюры к иконке корзины */
export function useAddToCart() {
  const t = useTranslations('product');
  return useCallback(
    (p: Product, volumeValue?: number, shadeId?: string | null, imgEl?: HTMLElement | null) => {
      const vol = p.volumes.find((v) => v.value === volumeValue) ?? p.volumes[0];
      const shade = shadeId ? p.shades.find((s) => s.id === shadeId) : p.shades[0];
      useCart.getState().add({
        productId: p.id,
        volume: vol.value,
        unit: vol.unit,
        shade: shade?.id ?? null,
        shadeLabel: shade?.label ?? null,
        price: vol.price,
        title: productTitle(p),
        subtitle: [p.code, p.name ? p.type : null, formatVolume(vol.value, vol.unit) || null, p.scent].filter(Boolean).join(' · '),
        image: p.image.src,
      });
      useUi.getState().showToast(t('added'));
      flyToCart(imgEl ?? null);
    },
    [t],
  );
}
