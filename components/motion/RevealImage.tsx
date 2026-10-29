'use client';

import Image from 'next/image';
import type { ImageAsset } from '@/lib/catalog/types';
import { useReveal } from './reveal';

interface Props {
  image: ImageAsset;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  shade?: boolean;
}

/** Фото с мягким появлением (opacity + translateY). Без параллакса, clip-path и blur. Картинка — lazy, AVIF/WebP. */
export function RevealImage({ image, alt, sizes, className, imgClassName, priority, shade }: Props) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal=""
      className={`${className?.includes('absolute') ? '' : 'relative'} overflow-hidden ${shade ? 'photo-shade' : ''} ${className ?? ''}`}
    >
      <Image src={image.src} alt={alt} fill sizes={sizes} priority={priority} quality={75} className={`photo-tone object-cover ${imgClassName ?? ''}`} />
    </div>
  );
}
