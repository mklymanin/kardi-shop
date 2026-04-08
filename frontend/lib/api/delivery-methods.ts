import { fetchFromStrapi, type StrapiListResponse } from "./strapi-client";
import { normalizeItems, toNumericPrice } from "./helpers";

export type DeliveryMethod = {
  code: string;
  title: string;
  price: number;
  pickupAddress?: string;
};

export async function getActiveDeliveryMethods(): Promise<DeliveryMethod[]> {
  const payload = await fetchFromStrapi<StrapiListResponse<any>>(
    "/api/delivery-methods?filters[isActive][$eq]=true&fields[0]=code&fields[1]=title&fields[2]=price&fields[3]=pickupAddress&sort[0]=sortOrder:asc&sort[1]=title:asc"
  );

  return normalizeItems(payload)
    .map((item) => ({
      code: String(item.code ?? "").trim(),
      title: String(item.title ?? "").trim(),
      price: toNumericPrice(item.price),
      pickupAddress:
        typeof item.pickupAddress === "string" && item.pickupAddress.trim()
          ? item.pickupAddress.trim()
          : undefined,
    }))
    .filter((item) => item.code && item.title);
}
