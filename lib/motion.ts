/** Единая система движения: медленно и спокойно */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const DUR = { base: 0.9, slow: 1.1, fast: 0.6 } as const;
export const SHIFT = 20;

export const fadeUp = {
  hidden: { opacity: 0, y: SHIFT },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const stagger = (step = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;
