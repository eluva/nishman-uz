/**
 * Весь контент сайта, не являющийся текстом перевода.
 * Тексты (названия, описания) — в messages/{ru,uz,en}.json по тем же id.
 *
 * demo: true — придуманные данные (не видны посетителю; при NEXT_PUBLIC_SHOW_DEMO=true
 * у них появляется бейдж «DEMO»). Полный список — в README → «Демо-данные».
 */

export const siteConfig = {
  name: 'Nishman.uz',
  brand: 'NISHMAN',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nishman.uz',
  showDemo: process.env.NEXT_PUBLIC_SHOW_DEMO === 'true',

  /** Реальные контакты менеджера (единственное место, где они печатаются полностью, — секция «Контакты») */
  contacts: {
    phoneDisplay: '+998 97-737-71-17',
    phoneHref: 'tel:+998977377117',
    telegram: 'https://t.me/+998977377117',
    telegramHandle: '+998977377117',
    instagram: 'https://instagram.com/nishman.uzb',
    instagramHandle: '@nishman.uzb',
  },

  /** Факты бренда из PDF-каталога. Цифры показываются только в hero, год и город — только в «О бренде». */
  brandFacts: {
    company: 'Asil Group Cosmetic',
    founded: 2016,
    city: 'Istanbul',
    exportCountries: 40,
    slogan: 'Creative Men Design',
  },

  /** Счётчики hero. positions — число SKU (товар × объём × оттенок), считается из каталога. */
  heroStats: ['positions', 'countries'] as const,

  /** Часы работы всех точек (Asia/Tashkent). demo: часы придуманы. */
  hours: { open: '10:00', close: '20:00', days: [1, 2, 3, 4, 5, 6, 0], timeZone: 'Asia/Tashkent', demo: true },

  /** Точки в Ташкенте (демо): тексты — messages: stores.items.<id> */
  stores: [
    { id: 'chilanzar', kind: 'showroom', lat: 41.2856, lng: 69.204, photo: 'store-chilanzar', demo: true },
    { id: 'yunusabad', kind: 'pickup', lat: 41.3655, lng: 69.2869, photo: 'store-yunusabad', demo: true },
    { id: 'mirabad', kind: 'partner', lat: 41.2965, lng: 69.2766, photo: 'store-mirabad', demo: true },
  ],

  /** Доставка (единственное место — секция «Адреса»). Тексты: delivery.items.<id> */
  delivery: [
    { id: 'tashkent', demo: true },
    { id: 'regions', demo: true },
    { id: 'pickup', demo: true },
  ],

  /** Условия опта (демо). Тексты: partners.terms.rows.<id> */
  partnerTerms: [
    { id: 'barbershop', minOrder: 1_500_000, demo: true },
    { id: 'shop', minOrder: 5_000_000, demo: true },
    { id: 'region', minOrder: 15_000_000, demo: true },
  ],

  /** Отзывы (демо): только текст, оценка, имя и город. Тексты: reviews.items.<id> */
  reviews: [
    { id: 'aziz', rating: 5, demo: true },
    { id: 'jasur', rating: 5, demo: true },
    { id: 'dilshod', rating: 5, demo: true },
    { id: 'sardor', rating: 4, demo: true },
    { id: 'bekzod', rating: 5, demo: true },
    { id: 'shahzod', rating: 5, demo: true },
  ],

  /** Лукбук: только фото, не использованные в других секциях */
  lookbook: [
    'look-cover',
    'look-powder',
    'look-cream-palm',
    'look-fiber',
    'look-jar',
    'look-cream-cologne',
    'look-beard-trim',
    'look-face-cream',
    'look-beard-duo',
    'look-cream-drop',
  ],

  /** Фото индекса каталога (hover) по категориям */
  categoryPhotos: {
    styling: 'index-styling',
    care: 'index-care',
    color: 'index-color',
    shaving: 'index-shaving',
    beard: 'index-beard',
    face: 'index-face',
    accessories: 'index-accessories',
  } as Record<string, string>,

  /** Яндекс Карты: обычный виджет (map-widget) без перекраски. Центр и масштаб — чтобы все точки были в кадре. */
  map: {
    widget: 'https://yandex.uz/map-widget/v1/',
    center: { lat: 41.329, lng: 69.245 },
    zoom: { mobile: 11, desktop: 12 },
    storeZoom: 15,
  },

  /** Навигация (якоря секций) */
  nav: ['catalog', 'quiz', 'partners', 'stores', 'contacts'] as const,

  /** Линейки для секции «Линейки» */
  showcase: {
    aqua: ['aqua-wax-01', 'aqua-wax-02', 'aqua-wax-03', 'aqua-wax-04', 'aqua-wax-05', 'aqua-wax-06', 'aqua-wax-07'],
    matteLines: ['matte', 'spider-wax'],
    colognes: [
      'cologne-1', 'cologne-2', 'cologne-3', 'cologne-4', 'cologne-5', 'cologne-06',
      'cologne-07', 'cologne-08', 'cologne-09', 'cologne-10', 'cologne-11', 'cologne-12',
    ],
  },

  catalogPageSize: { mobile: 8, desktop: 12 },
} as const;

export type SiteConfig = typeof siteConfig;
export type StoreConfig = (typeof siteConfig.stores)[number];
