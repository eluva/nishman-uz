import type { SVGProps } from 'react';

const paths = {
  phone: 'M6.6 3.5h2.8l1.4 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.4v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7 2 2 0 0 1 6.6 3.5Z',
  telegram: 'M21 4.5 2.9 11.4c-.9.4-.9 1.5 0 1.8l4.6 1.5 1.8 5.4c.2.7 1.1.9 1.6.4l2.6-2.5 4.8 3.5c.6.4 1.4.1 1.6-.6L22.4 5.8c.3-.9-.6-1.7-1.4-1.3ZM9.6 14.3l8.2-6.4-6.4 7.6-.3 2.6-1.5-3.8Z',
  instagram: 'M7.5 2.8h9a4.7 4.7 0 0 1 4.7 4.7v9a4.7 4.7 0 0 1-4.7 4.7h-9a4.7 4.7 0 0 1-4.7-4.7v-9a4.7 4.7 0 0 1 4.7-4.7Zm4.5 5a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4Zm5.2-1.9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
  cart: 'M3 4h2.2l2.1 10.6a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L20.6 8H6.4M9.5 20a1 1 0 1 0 0 .1M17 20a1 1 0 1 0 0 .1',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M3.5 8h17M3.5 16h17',
  arrowRight: 'M4 12h15m-5-5 5 5-5 5',
  arrowLeft: 'M20 12H5m5-5-5 5 5 5',
  arrowUp: 'M12 20V5m-5 5 5-5 5 5',
  arrowDown: 'M12 4v15m5-5-5 5-5-5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  search: 'M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Zm5.2-2 4.5 4.5',
  filter: 'M4 6h16M7 12h10M10 18h4',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Zm0-8.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  route: 'M6 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm12-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.5 16.5H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
} as const;

export type IconName = keyof typeof paths;

/** Набор иконок (контурные, 24×24). Заливка — только у брендовых знаков. */
export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  const filled = name === 'telegram' || name === 'instagram';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled && name === 'telegram' ? 'currentColor' : 'none'}
      stroke={filled && name === 'telegram' ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
