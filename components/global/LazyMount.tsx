'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Монтирует тяжёлый блок (квиз, карта) только при приближении к экрану */
export function LazyMount({ children, fallback, rootMargin = '600px', className }: { children: ReactNode; fallback?: ReactNode; rootMargin?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return (
    <div ref={ref} className={className}>
      {show ? children : fallback}
    </div>
  );
}
