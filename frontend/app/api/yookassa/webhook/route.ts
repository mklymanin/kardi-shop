import { NextResponse } from "next/server";

import { getOrderByPublicId, syncOrderPaymentStatus } from "@/lib/orders";

type YooKassaWebhookPayload = {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    metadata?: {
      orderPublicId?: string;
    };
  };
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as YooKassaWebhookPayload;
    const orderPublicId = payload.object?.metadata?.orderPublicId;

    if (payload.type !== "notification" || !orderPublicId) {
      return NextResponse.json({ ok: true });
    }

    const order = await getOrderByPublicId(orderPublicId);
    if (!order) {
      return NextResponse.json({ ok: true });
    }

    await syncOrderPaymentStatus(order, payload.object?.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[yookassa-webhook] failed", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
