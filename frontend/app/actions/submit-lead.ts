"use server";

import { postToStrapi } from "@/lib/api/strapi-client";

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
};

type StrapiLeadResponse = {
  data?: { id?: number; documentId?: string };
};

export async function submitLead(
  payload: LeadPayload
): Promise<{ id: number | string }> {
  const result = await postToStrapi<StrapiLeadResponse>("/api/leads", {
    data: {
      name: payload.name,
      phone: payload.phone,
      email: payload.email || undefined,
      message: payload.message || undefined,
      source: payload.source || "site",
    },
  });

  const leadId = result.data?.id ?? result.data?.documentId;

  if (!leadId) {
    throw new Error("Заявка создана, но идентификатор не получен");
  }

  return { id: leadId };
}
