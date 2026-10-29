import { NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { escapeHtml, sendTelegram } from '@/lib/telegram';
import { clean, isNonEmpty, normalizeUzPhone } from '@/lib/validation';

const BUSINESS_TYPES = ['barbershop', 'salon', 'shop', 'other'] as const;

/** Заявки с сайта: «Партнёрам» (kind=partner) → Telegram */
export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientIp(req)}`, 5)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json' }, { status: 400 });
  }
  // honeypot: поле скрыто от людей; если заполнено — тихо принимаем и ничего не отправляем
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const phone = normalizeUzPhone(clean(body.phone, 32));
  const errors: string[] = [];
  if (!phone) errors.push('phone');

  let text: string;
  if (body.kind === 'partner') {
    const type = BUSINESS_TYPES.find((t) => t === body.type);
    if (!isNonEmpty(body.business)) errors.push('business');
    if (!type) errors.push('type');
    if (!isNonEmpty(body.city)) errors.push('city');
    if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });
    text = [
      '<b>🤝 Заявка партнёра</b>',
      `Бизнес: ${escapeHtml(clean(body.business, 200))} (${type})`,
      `Город: ${escapeHtml(clean(body.city, 100))}`,
      `Телефон: ${phone}`,
      clean(body.comment) ? `Комментарий: ${escapeHtml(clean(body.comment))}` : null,
      `Язык: ${clean(body.locale, 5)}`,
    ]
      .filter(Boolean)
      .join('\n');
  } else {
    return NextResponse.json({ ok: false, error: 'kind' }, { status: 400 });
  }

  try {
    const { delivered } = await sendTelegram(text);
    return NextResponse.json({ ok: true, delivered });
  } catch (e) {
    console.error('[lead]', e);
    return NextResponse.json({ ok: false, error: 'telegram' }, { status: 502 });
  }
}
