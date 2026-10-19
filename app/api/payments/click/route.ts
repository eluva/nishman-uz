import { NextResponse } from 'next/server';

/**
 * Вебхук Click (Prepare / Complete) — ЗАГЛУШКА.
 * Подключение: README → «Платежи». Запрос приходит как application/x-www-form-urlencoded:
 *   click_trans_id, service_id, merchant_trans_id (= номер заказа), amount, action (0 — prepare, 1 — complete),
 *   sign_time, sign_string = md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + amount + action + sign_time)
 * TODO: проверить подпись, сумму и статус заказа в учётной системе; ответить { error: 0, ... }.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!process.env.CLICK_SECRET_KEY) {
    return NextResponse.json({ error: -8, error_note: 'Click is not configured' }, { status: 501 });
  }
  const action = form?.get('action');
  console.info('[click] webhook', Object.fromEntries(form?.entries() ?? []));
  return NextResponse.json({
    click_trans_id: form?.get('click_trans_id'),
    merchant_trans_id: form?.get('merchant_trans_id'),
    merchant_prepare_id: action === '0' ? form?.get('merchant_trans_id') : undefined,
    merchant_confirm_id: action === '1' ? form?.get('merchant_trans_id') : undefined,
    error: -9,
    error_note: 'Stub: integration pending',
  });
}
