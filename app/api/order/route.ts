import { NextResponse } from 'next/server';
import type { DeliveryMethod, OrderInput, PaymentMethod } from '@/lib/catalog/types';
import { orderService } from '@/lib/orders/order-service';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { clean, isNonEmpty, normalizeUzPhone } from '@/lib/validation';
import { siteConfig } from '@/site.config';

const DELIVERY: DeliveryMethod[] = ['courier', 'regions', 'pickup'];
const PAYMENT: PaymentMethod[] = ['click', 'payme', 'cash'];

export async function POST(req: Request) {
  if (!rateLimit(`order:${clientIp(req)}`, 6)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json' }, { status: 400 });
  }
  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const delivery = (body.delivery ?? {}) as Record<string, unknown>;
  const phone = normalizeUzPhone(clean(customer.phone, 32));
  const method = DELIVERY.find((d) => d === delivery.method);
  const payment = PAYMENT.find((p) => p === body.payment);
  const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
  const errors: string[] = [];
  if (!isNonEmpty(customer.name, 2, 80)) errors.push('name');
  if (!phone) errors.push('phone');
  if (!method) errors.push('delivery');
  if (method === 'courier' && !isNonEmpty(delivery.address, 5)) errors.push('address');
  if (method === 'regions' && (!isNonEmpty(delivery.city) || !isNonEmpty(delivery.address, 5))) errors.push('address');
  if (method === 'pickup' && !siteConfig.stores.some((s) => s.id === delivery.storeId)) errors.push('store');
  if (!payment) errors.push('payment');
  if (items.length === 0) errors.push('items');
  if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const input: OrderInput = {
    customer: { name: clean(customer.name, 80), phone: phone! },
    delivery: {
      method: method!,
      city: clean(delivery.city, 80) || undefined,
      address: clean(delivery.address, 300) || undefined,
      storeId: clean(delivery.storeId, 40) || undefined,
    },
    payment: payment!,
    comment: clean(body.comment, 500) || undefined,
    items: items.map((i: Record<string, unknown>) => ({
      productId: clean(i.productId, 80),
      volume: Number(i.volume),
      shade: i.shade ? clean(i.shade, 40) : null,
      qty: Number(i.qty) || 1,
    })),
    locale: ['ru', 'uz', 'en'].includes(String(body.locale)) ? String(body.locale) : 'ru',
  };

  try {
    const origin = req.headers.get('origin') ?? siteConfig.url;
    const { order, payment: pay } = await orderService.create(input, origin);
    return NextResponse.json({ ok: true, number: order.number, total: order.total, payment: pay });
  } catch (e) {
    console.error('[order]', e);
    return NextResponse.json({ ok: false, error: 'order' }, { status: 400 });
  }
}
