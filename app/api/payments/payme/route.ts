import { NextResponse } from 'next/server';

/**
 * Вебхук Payme Merchant API (JSON-RPC 2.0) — ЗАГЛУШКА.
 * Авторизация: заголовок Authorization: Basic base64("Paycom:" + PAYME_SECRET_KEY).
 * Методы: CheckPerformTransaction, CreateTransaction, PerformTransaction, CancelTransaction,
 *         CheckTransaction, GetStatement. Подключение: README → «Платежи».
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { id?: number; method?: string };
  const key = process.env.PAYME_SECRET_KEY;
  const expected = key ? 'Basic ' + Buffer.from(`Paycom:${key}`).toString('base64') : null;
  if (!expected || req.headers.get('authorization') !== expected) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id ?? null,
      error: { code: -32504, message: { ru: 'Недостаточно привилегий', uz: 'Ruxsat yo‘q', en: 'Insufficient privileges' } },
    });
  }
  console.info('[payme] method', body.method);
  return NextResponse.json({
    jsonrpc: '2.0',
    id: body.id ?? null,
    error: { code: -32601, message: { ru: 'Интеграция не завершена', uz: 'Integratsiya tugallanmagan', en: 'Integration pending' } },
  });
}
