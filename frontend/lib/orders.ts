import {
  fetchFromStrapiServer,
  postToStrapiServer,
  putToStrapiServer,
} from "@/lib/api/strapi-client";
import { toNumericPrice } from "@/lib/api/helpers";
import {
  createYooKassaPayment,
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

type StrapiProduct = {
  id: number;
  documentId?: string;
  slug?: string;
  title?: string;
  price?: string | number;
};

type StrapiOrder = {
  id?: number;
  documentId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  comment?: string;
  itemsRaw?: OrderLine[];
  total?: string | number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
  paymentUrl?: string;
  paidAt?: string | null;
};

export type OrderSnapshot = {
  id: number;
  documentId: string;
  customerName: string;
  phone: string;
  email?: string;
  comment?: string;
  itemsRaw: OrderLine[];
  total: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentId?: string;
  paymentUrl?: string;
  paidAt?: string | null;
};

function normalizeText(value: string, minLength: number, fieldName: string) {
  const normalized = value.trim();
  if (normalized.length < minLength) {
    throw new Error(`Поле "${fieldName}" заполнено некорректно`);
  }
  return normalized;
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function toMoneyString(value: number) {
  return value.toFixed(2);
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
    total: toNumericPrice(order.total),
    currency: String(order.currency ?? "RUB"),
    status: String(order.status ?? "new"),
    paymentStatus: String(order.paymentStatus ?? "pending"),
    paymentId: order.paymentId || undefined,
    paymentUrl: order.paymentUrl || undefined,
    paidAt: order.paidAt ?? null,
  };
}

async function fetchProductsForOrder(slugs: string[]) {
  const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean)));

  if (uniqueSlugs.length === 0) {
    throw new Error("Корзина пуста");
  }

  const query = uniqueSlugs
    .map(
      (slug, index) =>
        `filters[slug][$in][${index}]=${encodeURIComponent(slug)}`
    )
    .join("&");

  const response = await fetchFromStrapiServer<
    StrapiListResponse<StrapiProduct>
  >(
    `/api/products?${query}&fields[0]=slug&fields[1]=title&fields[2]=price&status=published`
  );

  const products = Array.isArray(response.data) ? response.data : [];
  const bySlug = new Map<string, StrapiProduct>();
  for (const product of products) {
    if (product.slug) {
      bySlug.set(product.slug, product);
    }
  }

  return bySlug;
}

export async function buildOrderLines(items: CheckoutItemInput[]) {
  if (items.length === 0) {
    throw new Error("Корзина пуста");
  }

  const productMap = await fetchProductsForOrder(
    items.map((item) => item.slug)
  );

  const lines: OrderLine[] = items.map((item) => {
    const product = productMap.get(item.slug);

    if (!product) {
      throw new Error(`Товар "${item.slug}" не найден`);
    }

    const quantity = Math.max(1, Math.trunc(item.quantity || 0));
    const price = toNumericPrice(product.price);

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`У товара "${item.slug}" не задана цена`);
    }

    return {
      slug: item.slug,
      title: String(product.title ?? product.slug ?? item.slug),
      quantity,
      price,
    };
  });

  const total = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
  return { lines, total };
}

export async function createDraftOrder(
  customer: OrderCustomerInput,
  lines: OrderLine[],
  total: number
) {
  const result = await postToStrapiServer<StrapiSingleResponse<StrapiOrder>>(
    "/api/orders",
    {
      data: {
        customerName: normalizeText(customer.customerName, 2, "Имя"),
        phone: normalizeText(customer.phone, 5, "Телефон"),
        email: normalizeOptionalText(customer.email),
        comment: normalizeOptionalText(customer.comment),
        itemsRaw: lines,
        total: toMoneyString(total),
        currency: "RUB",
        status: "new",
        paymentStatus: "pending",
        paymentProvider: "yookassa",
      },
    }
  );

  return normalizeOrderResponse(result.data);
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

export async function startOrderPayment(
  customer: OrderCustomerInput,
  items: CheckoutItemInput[]
) {
  const { lines, total } = await buildOrderLines(items);
  const draft = await createDraftOrder(customer, lines, total);

  const payment = await createYooKassaPayment({
    amountValue: toMoneyString(total),
    description: `Заказ #${draft.id}`,
    orderDocumentId: draft.documentId,
    orderPublicId: String(draft.id),
  });

  const confirmationUrl = payment.confirmation?.confirmation_url;
  if (!confirmationUrl) {
    throw new Error("YooKassa не вернула ссылку на оплату");
  }

  const updatedOrder = await updateOrder(draft.documentId, {
    paymentId: payment.id,
    paymentUrl: confirmationUrl,
    paymentStatus: mapYooKassaStatusToPaymentStatus(payment.status),
  });

  return {
    orderId: updatedOrder.id,
    confirmationUrl,
  };
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
