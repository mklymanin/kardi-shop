import type { NextConfig } from "next";

/** Host for Strapi uploads — must match NEXT_PUBLIC_STRAPI_URL in each environment. */
function strapiRemotePattern(): {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
} {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
  try {
    const u = new URL(raw);
    const protocol = u.protocol === "https:" ? "https" : "http";
    const pattern: {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
    } = { protocol, hostname: u.hostname };
    if (u.port) {
      pattern.port = u.port;
    }
    return pattern;
  } catch {
    return { protocol: "http", hostname: "localhost", port: "1337" };
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "shop.kardi.ru",
      },
      strapiRemotePattern(),
    ],
  },
};

export default nextConfig;
