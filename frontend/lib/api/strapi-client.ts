const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export { STRAPI_URL };

export type StrapiListResponse<T> =
  | { data: T[] }
  | { data: Array<{ id: number; attributes?: T } & T> };

type FetchFromStrapiOptions = {
  revalidate?: number;
};

export async function fetchFromStrapi<T>(
  path: string,
  options?: FetchFromStrapiOptions
): Promise<T | null> {
  const url = `${STRAPI_URL}${path}`;
  const revalidate = options?.revalidate ?? 30;

  try {
    const response = await fetch(url, {
      next: { revalidate },
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

type StrapiRequestOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
  auth?: boolean;
  revalidate?: number | false;
};

async function requestToStrapi<T>(
  path: string,
  options: StrapiRequestOptions = {}
): Promise<T> {
  const url = `${STRAPI_URL}${path}`;
  const headers = new Headers();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    if (!STRAPI_API_TOKEN) {
      throw new Error("STRAPI_API_TOKEN is not configured");
    }
    headers.set("Authorization", `Bearer ${STRAPI_API_TOKEN}`);
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: options.revalidate === false ? "no-store" : undefined,
    next:
      options.revalidate === false
        ? undefined
        : { revalidate: options.revalidate ?? 30 },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(
      `[strapi] ${options.method ?? "GET"} ${response.status} — ${url}`,
      text
    );
    throw new Error(`Strapi ${options.method ?? "GET"} ${path} failed`);
  }

  return (await response.json()) as T;
}

export async function postToStrapi<T>(path: string, body: unknown): Promise<T> {
  return requestToStrapi<T>(path, {
    method: "POST",
    body,
    revalidate: false,
  });
}

export async function fetchFromStrapiServer<T>(path: string): Promise<T> {
  return requestToStrapi<T>(path, {
    method: "GET",
    auth: true,
    revalidate: false,
  });
}

export async function postToStrapiServer<T>(
  path: string,
  body: unknown
): Promise<T> {
  return requestToStrapi<T>(path, {
    method: "POST",
    body,
    auth: true,
    revalidate: false,
  });
}

export async function putToStrapiServer<T>(
  path: string,
  body: unknown
): Promise<T> {
  return requestToStrapi<T>(path, {
    method: "PUT",
    body,
    auth: true,
    revalidate: false,
  });
}
