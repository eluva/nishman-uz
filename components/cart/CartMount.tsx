'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useUi } from '@/lib/store/ui';

const CartSheet = dynamic(() => import('./CartSheet').then((mod) => mod.CartSheet), { ssr: false });

/** Корзина грузится только после первого открытия */
export function CartMount() {
  const open = useUi((s) => s.cartOpen);
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);
  return mounted ? <CartSheet /> : null;
}
