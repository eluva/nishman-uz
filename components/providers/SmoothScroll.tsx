'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';
import { useFinePointer, useReducedMotionPref } from './device';

let instance: Lenis | null = null;
/** Активный экземпляр lenis (только десктоп с pointer: fine) */
export const getLenis = () => instance;

/** Блокировка прокрутки фона для шторок и модалок */
export function lockScroll(lock: boolean) {
  const root = document.documentElement;
  if (lock) {
    instance?.stop();
    root.style.overflow = 'hidden';
  } else {
    instance?.start();
    root.style.overflow = '';
  }
}

export function scrollToId(id: string) {
  revealAllSections();
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Перед переходом к секции: отключить content-visibility, чтобы высоты были реальными (точные якоря) */
export function revealAllSections() {
  document.documentElement.classList.add('cv-off');
}

/** Плавный скролл: только мышь/тачпад и без prefers-reduced-motion. На телефоне — нативный скролл. */
export function SmoothScroll() {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();

  useEffect(() => {
    // capture: срабатывает раньше обработчика якорей lenis и нативной навигации
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (a) revealAllSections();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!fine || reduced) return;
    let raf = 0;
    let disposed = false;
    import('lenis').then(({ default: LenisCtor }) => {
      if (disposed) return;
      instance = new LenisCtor({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true }); // отступ под шапку — из CSS scroll-padding-top
      const loop = (time: number) => {
        instance?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      instance?.destroy();
      instance = null;
    };
  }, [fine, reduced]);

  return null;
}
