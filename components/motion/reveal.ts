'use client';

import { useEffect, useRef } from 'react';

let io: IntersectionObserver | null = null;

/** Один общий IntersectionObserver на всю страницу: ставит .is-in и перестаёт следить */
function observer() {
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io?.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  return io;
}

/** Ref для элемента с data-reveal: появление (opacity + translateY) при входе в зону видимости */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = observer();
    o.observe(el);
    return () => o.unobserve(el);
  }, []);
  return ref;
}
