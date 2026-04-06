"use server";

import { postToStrapi } from "@/lib/api/strapi-client";

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

type StrapiOrderResponse = {
  data?: { id?: number; documentId?: string };
};

export async function submitOrder(
  payload: OrderPayload
): Promise<{ id: number | string }> {
  const result = await postToStrapi<StrapiOrderResponse>("/api/orders", {
    data: {
      customerName: payload.customerName,
      phone: payload.phone,
      email: payload.email || undefined,
      comment: payload.comment || undefined,
      itemsRaw: payload.itemsRaw,
      total: payload.total,
      status: "new",
    },
  });

  const orderId = result.data?.id ?? result.data?.documentId;

  if (!orderId) {
    throw new Error("Заказ создан, но идентификатор не получен");
  }

  return { id: orderId };
}
