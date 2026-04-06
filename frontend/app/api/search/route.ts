import { NextResponse } from "next/server";

import { getProducts } from "@/lib/api/products";
import {
  filterProductsByQuery,
  isValidSearchQuery,
} from "@/lib/search-products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limitRaw = searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(limitRaw ?? "12", 10) || 12, 1), 50);

  if (!isValidSearchQuery(q)) {
    return NextResponse.json({ products: [] });
  }

  const all = await getProducts();
  const filtered = filterProductsByQuery(all, q).slice(0, limit);

  return NextResponse.json({ products: filtered });
}
