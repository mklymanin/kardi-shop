"use server";

import { startOrderPayment } from "@/lib/orders";

export type OrderPayload = {
  customerName: string;
  phone: string;
  email?: string;
  comment?: string;
  itemsRaw: Array<{
    slug: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  total: number;
};

export async function submitOrder(
  payload: OrderPayload
): Promise<{ id: number | string; confirmationUrl: string }> {
  const result = await startOrderPayment(
    {
      customerName: payload.customerName,
      phone: payload.phone,
      email: payload.email,
      comment: payload.comment,
    },
    payload.itemsRaw.map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
    }))
  );

  return {
    id: result.orderId,
    confirmationUrl: result.confirmationUrl,
  };
}
