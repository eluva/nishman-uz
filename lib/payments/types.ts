import type { Order, PaymentMethod } from '@/lib/catalog/types';

export interface PaymentInit {
  method: PaymentMethod;
  /** Ссылка на оплату (Click/Payme); null — оплата при получении или провайдер не настроен */
  redirectUrl: string | null;
  /** Провайдер настроен (ключи заданы в .env) */
  configured: boolean;
}

/**
 * Платёжный провайдер. Реализации: ClickProvider, PaymeProvider, CashProvider.
 * Вебхуки провайдеров: /api/payments/click и /api/payments/payme.
 */
export interface PaymentProvider {
  readonly method: PaymentMethod;
  isConfigured(): boolean;
  /** Создаёт платёж и возвращает ссылку на оплату */
  init(order: Order, returnUrl: string): Promise<PaymentInit>;
}
