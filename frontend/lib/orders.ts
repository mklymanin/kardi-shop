import {
  fetchFromStrapiServer,
  putToStrapiServer,
  STRAPI_URL,
} from "@/lib/api/strapi-client";
import { toNumericPrice } from "@/lib/api/helpers";
import {
  getYooKassaPayment,
  mapYooKassaStatusToPaymentStatus,
} from "@/lib/payments/yookassa";

export type CheckoutItemInput = {
  slug: string;
  quantity: number;
};

export type OrderCustomerInput = {
  customerName: string;
  phone: string;
  email?: string;
  comment?: string;
  deliveryMethodCode: string;
  deliveryAddress?: string;
  couponCode?: string;
};

export type OrderLine = {
  slug: string;
  title: string;
  quantity: number;
  price: number;
};

type StrapiSingleResponse<T> = {
  data?: T;
};

type StrapiListResponse<T> = {
  data?: T[];
};

type StrapiOrder = {
  id?: number;
  documentId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  comment?: string;
  itemsRaw?: OrderLine[];
  subtotal?: string | number;
  deliveryMethodCode?: string;
  deliveryMethodTitle?: string;
  deliveryAddress?: string;
  deliveryPrice?: string | number;
  total?: string | number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
  paymentUrl?: string;
  paidAt?: string | null;
};

type CheckoutStartResponse = {
  orderId: number | string;
  confirmationUrl: string;
  pricingSnapshot: {
    subtotal: number;
    delivery: number;
    discount: number;
    total: number;
    couponApplied: boolean;
  };
};

type CheckoutErrorPayload = {
  error?: {
    message?: string;
    details?: {
      code?: string;
    };
  };
};

export class CheckoutStartError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "CheckoutStartError";
    this.code = code;
  }
}

export type OrderSnapshot = {
  id: number;
  documentId: string;
  customerName: string;
  phone: string;
  email?: string;
  comment?: string;
  itemsRaw: OrderLine[];
  subtotal: number;
  deliveryMethodCode: string;
  deliveryMethodTitle: string;
  deliveryAddress?: string;
  deliveryPrice: number;
  total: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentId?: string;
  paymentUrl?: string;
  paidAt?: string | null;
};

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeOrderResponse(order: StrapiOrder | undefined): OrderSnapshot {
  if (!order?.id || !order.documentId) {
    throw new Error("Не удалось получить заказ из Strapi");
  }

  return {
    id: order.id,
    documentId: order.documentId,
    customerName: String(order.customerName ?? ""),
    phone: String(order.phone ?? ""),
    email: order.email || undefined,
    comment: order.comment || undefined,
    itemsRaw: Array.isArray(order.itemsRaw) ? order.itemsRaw : [],
    subtotal: toNumericPrice(order.subtotal),
    deliveryMethodCode: String(order.deliveryMethodCode ?? ""),
    deliveryMethodTitle: String(order.deliveryMethodTitle ?? ""),
    deliveryAddress: normalizeOptionalText(order.deliveryAddress),
    deliveryPrice: toNumericPrice(order.deliveryPrice),
    total: toNumericPrice(order.total),
    currency: String(order.currency ?? "RUB"),
    status: String(order.status ?? "new"),
    paymentStatus: String(order.paymentStatus ?? "pending"),
    paymentId: order.paymentId || undefined,
    paymentUrl: order.paymentUrl || undefined,
    paidAt: order.paidAt ?? null,
  };
}

export async function startOrderPayment(
  customer: OrderCustomerInput,
  items: CheckoutItemInput[]
) {
  const response = await fetch(`${STRAPI_URL}/api/checkout/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName: customer.customerName,
      phone: customer.phone,
      email: customer.email,
      comment: customer.comment,
      deliveryMethodCode: customer.deliveryMethodCode,
      deliveryAddress: customer.deliveryAddress,
      couponCode: customer.couponCode,
      items,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response
      .json()
      .catch(() => ({}))) as CheckoutErrorPayload;
    throw new CheckoutStartError(
      body?.error?.message || "Не удалось создать заказ",
      body?.error?.details?.code
    );
  }

  const data = (await response.json()) as CheckoutStartResponse;
  if (!data?.orderId || !data?.confirmationUrl) {
    throw new CheckoutStartError("Backend вернул некорректный ответ");
  }

  return {
    orderId: data.orderId,
    confirmationUrl: data.confirmationUrl,
  };
}

export async function updateOrder(
  documentId: string,
  data: Record<string, unknown>
) {
  const result = await putToStrapiServer<StrapiSingleResponse<StrapiOrder>>(
    `/api/orders/${documentId}`,
    { data }
  );
  return normalizeOrderResponse(result.data);
}

export async function getOrderByPublicId(orderId: string) {
  const result = await fetchFromStrapiServer<StrapiListResponse<StrapiOrder>>(
    `/api/orders?filters[id][$eq]=${encodeURIComponent(orderId)}`
  );
  const order = Array.isArray(result.data) ? result.data[0] : undefined;

  if (!order) {
    return null;
  }

  return normalizeOrderResponse(order);
}

export async function syncOrderPaymentStatus(
  order: OrderSnapshot,
  fallbackPaymentId?: string
) {
  const paymentId = fallbackPaymentId ?? order.paymentId;

  if (!paymentId) {
    return order;
  }

  const payment = await getYooKassaPayment(paymentId);
  const paymentStatus = mapYooKassaStatusToPaymentStatus(payment.status);
  const baseUpdate: Record<string, unknown> = {
    paymentId: payment.id,
    paymentStatus,
  };

  if (payment.confirmation?.confirmation_url) {
    baseUpdate.paymentUrl = payment.confirmation.confirmation_url;
  }

  if (paymentStatus === "paid") {
    baseUpdate.status = "processing";
    if (!order.paidAt) {
      baseUpdate.paidAt = new Date().toISOString();
    }
  } else if (paymentStatus === "canceled") {
    baseUpdate.status = "cancelled";
  }

  return updateOrder(order.documentId, baseUpdate);
}
