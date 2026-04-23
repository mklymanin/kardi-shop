import { fetchFromStrapi } from "./strapi-client";

/** Текущие продакшен-дефолты (до заполнения Strapi). */
export const SITE_CONTACT_DEFAULTS = {
  phoneLabel: "+7 (499) 346-77-22",
  email: "support@kardi.ru",
  workSchedule: "Пн-Пт с 10:00 до 18:00",
} as const;

const SITE_SETTING_REVALIDATE_SECONDS = 3600;

type StrapiSingleResponse = {
  data:
    | (Record<string, unknown> & {
        id?: number;
        attributes?: Record<string, unknown>;
      })
    | null;
};

export type SiteContact = {
  phoneLabel: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  workSchedule: string;
};

function flattenSingleRecord(
  data: StrapiSingleResponse["data"]
): Record<string, unknown> | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const attrs = (data as { attributes?: Record<string, unknown> }).attributes;
  if (attrs && typeof attrs === "object") {
    return { ...(data as Record<string, unknown>), ...attrs };
  }

  return data as Record<string, unknown>;
}

/** Строит `tel:` из человекочитаемого номера (8… → 7…). */
export function buildTelHref(displayPhone: string): string {
  const digits = displayPhone.replace(/\D/g, "");
  if (!digits) {
    const fallback = SITE_CONTACT_DEFAULTS.phoneLabel.replace(/\D/g, "");
    return `tel:+${fallback}`;
  }

  let normalized = digits;
  if (normalized.startsWith("8")) {
    normalized = `7${normalized.slice(1)}`;
  } else if (!normalized.startsWith("7")) {
    normalized = `7${normalized}`;
  }

  return `tel:+${normalized}`;
}

export async function getSiteContact(): Promise<SiteContact> {
  const payload = await fetchFromStrapi<StrapiSingleResponse>(
    "/api/site-setting",
    { revalidate: SITE_SETTING_REVALIDATE_SECONDS }
  );

  const flat = flattenSingleRecord(payload?.data ?? null);

  const phoneLabel =
    String(flat?.contactPhone ?? "").trim() || SITE_CONTACT_DEFAULTS.phoneLabel;
  const email =
    String(flat?.contactEmail ?? "").trim() || SITE_CONTACT_DEFAULTS.email;
  const workSchedule =
    String(flat?.workSchedule ?? "").trim() ||
    SITE_CONTACT_DEFAULTS.workSchedule;

  return {
    phoneLabel,
    phoneHref: buildTelHref(phoneLabel),
    email,
    emailHref: `mailto:${email}`,
    workSchedule,
  };
}
