'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useIsDesktop, useReducedMotionPref } from '@/components/providers/device';

const SOURCES = [
  // горизонтальный кадр — только для широких экранов в альбомной ориентации; портретные планшеты получают вертикальный
  { media: '(min-width: 768px) and (orientation: landscape)', webm: '/media/video/hero-desktop.webm', mp4: '/media/video/hero-desktop.mp4' },
  { media: '(max-width: 767px), (orientation: portrait)', webm: '/media/video/hero-mobile.webm', mp4: '/media/video/hero-mobile.mp4' },
];

type NetInfo = { saveData?: boolean; effectiveType?: string };
type BatteryLike = { level: number; charging: boolean };

/** Можно ли грузить видео: не reduced motion, не Save-Data, не 2g/3g, не низкий заряд */
async function videoAllowed() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return false;
  const getBattery = (navigator as Navigator & { getBattery?: () => Promise<BatteryLike> }).getBattery;
  if (getBattery) {
    try {
      const b = await getBattery.call(navigator);
      if (!b.charging && b.level < 0.2) return false;
    } catch {
      /* API недоступен — не мешает */
    }
  }
  return true;
}

const idle = (cb: () => void) =>
  'requestIdleCallback' in window
    ? window.requestIdleCallback(cb, { timeout: 2500 })
    : (window as Window).setTimeout(cb, 1200);

/** Фон hero: постер (LCP) + единственное фоновое видео сайта */
export function HeroMedia() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const desktop = useIsDesktop();
  const reduced = useReducedMotionPref();
  // параллакс от абсолютной прокрутки окна: в покое сдвиг строго 0
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, reduced ? 0 : desktop ? 80 : 40], { clamp: true });

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (el.dataset.inview === '1') el.play().catch(() => {});
    };

    const start = async () => {
      if (cancelled || !(await videoAllowed())) return;
      const set = SOURCES.find((s) => window.matchMedia(s.media).matches) ?? SOURCES[0];
      const canWebm = el.canPlayType('video/webm; codecs="vp9"') !== '';
      el.src = canWebm ? set.webm : set.mp4;
      el.load();
      observer = new IntersectionObserver(
        ([entry]) => {
          el.dataset.inview = entry.isIntersecting ? '1' : '0';
          if (entry.isIntersecting && !document.hidden) el.play().catch(() => {});
          else el.pause();
        },
        { threshold: 0.05 },
      );
      observer.observe(el);
      document.addEventListener('visibilitychange', onVisibility);
    };

    const run = () => idle(() => void start());
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });

    return () => {
      cancelled = true;
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('load', run);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <m.div className="absolute inset-[-6%_0]" style={{ y }}>
        <picture>
          <source media="(min-width: 768px) and (orientation: landscape)" type="image/avif" srcSet="/media/video/hero-poster-desktop.avif" />
          <source media="(min-width: 768px) and (orientation: landscape)" type="image/webp" srcSet="/media/video/hero-poster-desktop.webp" />
          <source type="image/avif" srcSet="/media/video/hero-poster-mobile.avif" />
          <img
            src="/media/video/hero-poster-mobile.webp"
            alt=""
            width={720}
            height={1280}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <video
          ref={video}
          muted
          playsInline
          loop
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-lux ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
      </m.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,12,0.55)_0%,rgba(11,11,12,0.2)_35%,rgba(11,11,12,0.55)_70%,#0b0b0c_100%)]" />
    </div>
  );
}
