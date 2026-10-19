import photos from '@/data/photos.json';
import type { ImageAsset } from '@/lib/catalog/types';

type PhotoName = keyof typeof photos;

/** Лайфстайл-фото из PDF (каждое используется на сайте один раз — см. scripts/catalog_spec.py → PHOTOS) */
export function photo(name: string): ImageAsset {
  const p = photos[name as PhotoName];
  if (!p) throw new Error(`Unknown photo: ${name}`);
  return { src: p.src, width: p.width, height: p.height };
}
