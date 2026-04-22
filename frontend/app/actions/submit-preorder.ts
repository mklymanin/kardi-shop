"use server";

import { STRAPI_URL } from "@/lib/api/strapi-client";

export type PreorderPayload = {
  customerName: string;
  phone: string;
  email?: string;
  comment?: string;
  deliveryMethodCode: string;
  deliveryMethodTitle: string;
  deliveryAddress?: string;
  productSlug: string;
  productTitle: string;
  lineType: "purchase" | "rent";
};

export type SubmitPreorderResult =
  | { success: true }
  | { success: false; error: { message: string; code?: string } };

function parseStrapiError(body: Record<string, unknown>): {
  message: string;
  code?: string;
} {
  const err = body?.error as Record<string, unknown> | undefined;
  const messageFromErr =
    typeof err?.message === "string" ? err.message : undefined;
  const messageFromBody =
    typeof body?.message === "string" ? body.message : undefined;
  const message =
    messageFromErr || messageFromBody || "Не удалось отправить заявку";
  const details = err?.details as Record<string, unknown> | undefined;
  const codeFromDetails =
    typeof details?.code === "string" ? details.code : undefined;
  const codeFromErr = typeof err?.code === "string" ? err.code : undefined;
  const code = codeFromDetails || codeFromErr;
  return { message, code };
}

export async function submitPreorder(
  payload: PreorderPayload
): Promise<SubmitPreorderResult> {
  const lines: string[] = [
    `Предзаказ: ${payload.productTitle}`,
    `Вариант: ${payload.lineType === "rent" ? "аренда" : "покупка"}`,
    `Способ получения: ${payload.deliveryMethodTitle}`,
  ];
  if (payload.deliveryAddress?.trim()) {
    lines.push(`Адрес: ${payload.deliveryAddress.trim()}`);
  }
  if (payload.comment?.trim()) {
    lines.push(`Комментарий: ${payload.comment.trim()}`);
  }

  const res = await fetch(`${STRAPI_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        name: payload.customerName.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || undefined,
        message: lines.join("\n\n"),
        kind: "preorder",
        source: "store-preorder",
        productSlug: payload.productSlug,
        itemsJson: [
          {
            slug: payload.productSlug,
            title: payload.productTitle,
            quantity: 1,
            lineType: payload.lineType,
          },
        ],
      },
    }),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    const { message, code } = parseStrapiError(body);
    return { success: false, error: { message, code } };
  }

  return { success: true };
}
