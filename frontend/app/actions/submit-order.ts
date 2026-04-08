"use server";

import { startOrderPayment } from "@/lib/orders";
import { CheckoutStartError } from "@/lib/orders";
import { quoteOrderPayment, type OrderPricingSnapshot } from "@/lib/orders";

export type OrderPayload = {
  customerName: string;
  phone: string;
  email: string;
  comment?: string;
  deliveryMethodCode: string;
  deliveryAddress?: string;
  couponCode?: string;
  itemsRaw: Array<{
    slug: string;
    quantity: number;
  }>;
};

export type SubmitOrderResult =
  | {
      success: true;
      order: {
        id: number | string;
        resumeToken: string;
        confirmationUrl: string;
      };
    }
  | {
      success: false;
      error: { message: string; code?: string };
    };

export type PreviewOrderPricingResult =
  | {
      success: true;
      pricing: OrderPricingSnapshot;
    }
  | {
      success: false;
      error: { message: string; code?: string };
    };

export async function submitOrder(
  payload: OrderPayload
): Promise<SubmitOrderResult> {
  try {
    const result = await startOrderPayment(
      {
        customerName: payload.customerName,
        phone: payload.phone,
        email: payload.email,
        comment: payload.comment,
        deliveryMethodCode: payload.deliveryMethodCode,
        deliveryAddress: payload.deliveryAddress,
        couponCode: payload.couponCode,
      },
      payload.itemsRaw.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }))
    );

    return {
      success: true,
      order: {
        id: result.orderId,
        resumeToken: result.resumeToken,
        confirmationUrl: result.confirmationUrl,
      },
    };
  } catch (error) {
    if (error instanceof CheckoutStartError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: false,
      error: {
        message: "Не удалось создать платёж. Попробуйте снова.",
      },
    };
  }
}

export async function previewOrderPricing(
  payload: OrderPayload
): Promise<PreviewOrderPricingResult> {
  try {
    const pricing = await quoteOrderPayment(
      {
        customerName: payload.customerName,
        phone: payload.phone,
        email: payload.email,
        comment: payload.comment,
        deliveryMethodCode: payload.deliveryMethodCode,
        deliveryAddress: payload.deliveryAddress,
        couponCode: payload.couponCode,
      },
      payload.itemsRaw.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }))
    );

    return {
      success: true,
      pricing,
    };
  } catch (error) {
    if (error instanceof CheckoutStartError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: false,
      error: {
        message: "Не удалось проверить купон. Попробуйте снова.",
      },
    };
  }
}
