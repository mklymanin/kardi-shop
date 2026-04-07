import { randomUUID } from "crypto";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export type YooKassaPaymentStatus =
  | "pending"
  | "waiting_for_capture"
  | "succeeded"
  | "canceled";

export type YooKassaPayment = {
  id: string;
  status: YooKassaPaymentStatus;
  paid: boolean;
  confirmation?: {
    type?: string;
    confirmation_url?: string;
    return_url?: string;
  };
  amount?: {
    value?: string;
    currency?: string;
  };
  metadata?: Record<string, string>;
};

type CreatePaymentParams = {
  amountValue: string;
  description: string;
  orderDocumentId: string;
  orderPublicId: string;
};

function getAuthHeader() {
  if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
    throw new Error("YooKassa credentials are not configured");
  }

  const basic = Buffer.from(
    `${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`
  ).toString("base64");
  return `Basic ${basic}`;
}

async function yookassaRequest<T>(
  path: string,
  init: RequestInit & { idempotenceKey?: string }
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", getAuthHeader());
  headers.set("Content-Type", "application/json");

  if (init.idempotenceKey) {
    headers.set("Idempotence-Key", init.idempotenceKey);
  }

  const response = await fetch(`${YOOKASSA_API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(`[yookassa] ${response.status} ${path}`, text);
    throw new Error(`YooKassa request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function mapYooKassaStatusToPaymentStatus(
  status: YooKassaPaymentStatus
): "pending" | "waiting_for_capture" | "paid" | "canceled" | "failed" {
  switch (status) {
    case "succeeded":
      return "paid";
    case "waiting_for_capture":
      return "waiting_for_capture";
    case "canceled":
      return "canceled";
    default:
      return "pending";
  }
}

export function getPaymentReturnUrl(orderId: string) {
  const url = new URL("/checkout/success", SITE_URL);
  url.searchParams.set("order", orderId);
  return url.toString();
}

export async function createYooKassaPayment({
  amountValue,
  description,
  orderDocumentId,
  orderPublicId,
}: CreatePaymentParams): Promise<YooKassaPayment> {
  return yookassaRequest<YooKassaPayment>("/payments", {
    method: "POST",
    idempotenceKey: randomUUID(),
    body: JSON.stringify({
      amount: {
        value: amountValue,
        currency: "RUB",
      },
      payment_method_data: {
        type: "bank_card",
      },
      confirmation: {
        type: "redirect",
        return_url: getPaymentReturnUrl(orderPublicId),
      },
      capture: true,
      description,
      metadata: {
        orderDocumentId,
        orderPublicId,
      },
    }),
  });
}

export async function getYooKassaPayment(
  paymentId: string
): Promise<YooKassaPayment> {
  return yookassaRequest<YooKassaPayment>(`/payments/${paymentId}`, {
    method: "GET",
  });
}
