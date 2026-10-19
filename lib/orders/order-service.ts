import 'server-only';
import { getCatalog } from '@/lib/catalog';
import type { Order, OrderInput } from '@/lib/catalog/types';
import { getPaymentProvider } from '@/lib/payments/providers';
import type { PaymentInit } from '@/lib/payments/types';
import { escapeHtml, sendTelegram } from '@/lib/telegram';

const PAYMENT_LABEL = { click: 'Click', payme: 'Payme', cash: 'При получении' } as const;
const DELIVERY_LABEL = { courier: 'Курьер (Ташкент)', regions: 'Регионы', pickup: 'Самовывоз' } as const;

/**
 * Сервис заказов: проверяет позиции через CatalogProvider, инициирует оплату,
 * уведомляет менеджера в Telegram. Хранение заказов — в учётной системе клиента (TODO при интеграции).
 */
export class OrderService {
  async create(input: OrderInput, origin: string): Promise<{ order: Order; payment: PaymentInit }> {
    const order = await getCatalog().createOrder(input);
    const payment = await getPaymentProvider(input.payment).init(order, `${origin}/${input.locale}?order=${order.number}`);
    await sendTelegram(this.format(order)).catch((e) => console.error('[order] telegram failed', e));
    return { order, payment };
  }

  private format(order: Order) {
    const { customer, delivery, payment, comment } = order.input;
    const sum = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ');
    return [
      `<b>🛒 Заказ ${order.number}</b>`,
      `${escapeHtml(customer.name)} · ${customer.phone}`,
      `Доставка: ${DELIVERY_LABEL[delivery.method]}${delivery.storeId ? ` (${delivery.storeId})` : ''}`,
      delivery.city ? `Город: ${escapeHtml(delivery.city)}` : null,
      delivery.address ? `Адрес: ${escapeHtml(delivery.address)}` : null,
      `Оплата: ${PAYMENT_LABEL[payment]}`,
      '',
      ...order.lines.map((l) => `• ${escapeHtml(l.title)} × ${l.qty} = ${sum(l.sum)} сум`),
      '',
      `<b>Итого: ${sum(order.total)} сум</b>`,
      comment ? `Комментарий: ${escapeHtml(comment)}` : null,
    ]
      .filter((x) => x !== null)
      .join('\n');
  }
}

export const orderService = new OrderService();
