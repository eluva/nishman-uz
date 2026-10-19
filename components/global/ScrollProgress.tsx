'use client';

import { m, useScroll } from 'framer-motion';

/** Тонкая жёлтая полоса прогресса прокрутки сверху */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
