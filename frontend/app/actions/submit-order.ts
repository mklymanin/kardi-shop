"use server";

import { startOrderPayment } from "@/lib/orders";

export type OrderPayload = {
  customerName: string;
  phone: string;
  email?: string;
  comment?: string;
  deliveryMethodCode: string;
  deliveryAddress?: string;
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
      deliveryMethodCode: payload.deliveryMethodCode,
      deliveryAddress: payload.deliveryAddress,
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
