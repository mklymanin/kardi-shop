const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export { STRAPI_URL };

export type StrapiListResponse<T> =
  | { data: T[] }
  | { data: Array<{ id: number; attributes?: T } & T> };

export async function fetchFromStrapi<T>(path: string): Promise<T | null> {
  const url = `${STRAPI_URL}${path}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[strapi] ${response.status} ${response.statusText} — ${url}`,
        body
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[strapi] Network error — ${url}`, error);
    return null;
  }
}

export async function postToStrapi<T>(path: string, body: unknown): Promise<T> {
  const url = `${STRAPI_URL}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(`[strapi] POST ${response.status} — ${url}`, text);
    throw new Error(`Strapi POST ${path} failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
