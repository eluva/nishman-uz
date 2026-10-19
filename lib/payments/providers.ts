import 'server-only';
import type { Order, PaymentMethod } from '@/lib/catalog/types';
import type { PaymentInit, PaymentProvider } from './types';

/**
 * Click — заглушка. Боевая интеграция (Click Merchant API, Shop API):
 *   1) ссылка на оплату: https://my.click.uz/services/pay?service_id=..&merchant_id=..&amount=..&transaction_param=<номер>&return_url=..
 *   2) Prepare/Complete приходят на /api/payments/click; подпись — md5 с CLICK_SECRET_KEY.
 */
export class ClickProvider implements PaymentProvider {
  readonly method = 'click' as const;
  isConfigured() {
    return Boolean(process.env.CLICK_SERVICE_ID && process.env.CLICK_MERCHANT_ID && process.env.CLICK_SECRET_KEY);
  }
  async init(order: Order, returnUrl: string): Promise<PaymentInit> {
    if (!this.isConfigured()) return { method: this.method, redirectUrl: null, configured: false };
    const url = new URL('https://my.click.uz/services/pay');
    url.searchParams.set('service_id', process.env.CLICK_SERVICE_ID!);
    url.searchParams.set('merchant_id', process.env.CLICK_MERCHANT_ID!);
    url.searchParams.set('amount', String(order.total));
    url.searchParams.set('transaction_param', order.number);
    url.searchParams.set('return_url', returnUrl);
    return { method: this.method, redirectUrl: url.toString(), configured: true };
  }
}

/**
 * Payme — заглушка. Боевая интеграция (Merchant API, JSON-RPC):
 *   1) ссылка: https://checkout.paycom.uz/<base64("m=<MERCHANT_ID>;ac.order_id=<номер>;a=<сумма в тийинах>;c=<returnUrl>")>
 *   2) CheckPerformTransaction / CreateTransaction / PerformTransaction / CancelTransaction / CheckTransaction
 *      приходят на /api/payments/payme с Basic-авторизацией Paycom:<PAYME_SECRET_KEY>.
 */
export class PaymeProvider implements PaymentProvider {
  readonly method = 'payme' as const;
  isConfigured() {
    return Boolean(process.env.PAYME_MERCHANT_ID && process.env.PAYME_SECRET_KEY);
  }
  async init(order: Order, returnUrl: string): Promise<PaymentInit> {
    if (!this.isConfigured()) return { method: this.method, redirectUrl: null, configured: false };
    const params = `m=${process.env.PAYME_MERCHANT_ID};ac.order_id=${order.number};a=${order.total * 100};c=${returnUrl}`;
    const host = process.env.PAYME_TEST_MODE === 'true' ? 'https://checkout.test.paycom.uz' : 'https://checkout.paycom.uz';
    return { method: this.method, redirectUrl: `${host}/${Buffer.from(params).toString('base64')}`, configured: true };
  }
}

/** Оплата при получении — всегда доступна */
export class CashProvider implements PaymentProvider {
  readonly method = 'cash' as const;
  isConfigured() {
    return true;
  }
  async init(): Promise<PaymentInit> {
    return { method: this.method, redirectUrl: null, configured: true };
  }
}

const providers: Record<PaymentMethod, PaymentProvider> = {
  click: new ClickProvider(),
  payme: new PaymeProvider(),
  cash: new CashProvider(),
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  return providers[method];
}
