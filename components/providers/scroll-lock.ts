'use client';

/** Блокировка прокрутки фона для шторок и модалок (нативный скролл, без JS-сглаживания) */
export function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}
