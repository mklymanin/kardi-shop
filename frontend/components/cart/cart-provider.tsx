"use client";

import { useSyncExternalStore } from "react";

import type { LineType, Product } from "@/lib/site-data";

const STORAGE_KEY = "shop-kardi-cart-v2";
const LEGACY_STORAGE_KEY = "shop-kardi-cart-v1";

export type CartItem = {
  slug: string;
  lineType: LineType;
  title: string;
  priceLabel: string;
  priceValue: number;
  quantity: number;
  imageUrl?: string;
  rentalPeriodLabel?: string;
};

type CartState = {
  items: CartItem[];
};

let state: CartState = { items: [] };
let initialized = false;
const listeners = new Set<() => void>();

function parsePriceLabelToNumber(price: string) {
  const normalized = price.replace(/[^\d,.-]/g, "").replace(",", ".");
  const numeric = Number(normalized);
  return Number.isNaN(numeric) ? 0 : numeric;
}

function normalizeStoredItem(entry: unknown): CartItem | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const o = entry as Record<string, unknown>;
  const slug = typeof o.slug === "string" ? o.slug.trim() : "";
  if (!slug) {
    return null;
  }
  const lineType: LineType = o.lineType === "rent" ? "rent" : "purchase";
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const priceLabel = typeof o.priceLabel === "string" ? o.priceLabel : "";
  const quantity = Math.max(1, Math.trunc(Number(o.quantity) || 0));
  let priceValue = Number(o.priceValue);
  if (!Number.isFinite(priceValue)) {
    priceValue = parsePriceLabelToNumber(String(priceLabel));
  }
  if (!title || !priceLabel || !Number.isFinite(priceValue) || priceValue < 0) {
    return null;
  }
  const imageUrl =
    typeof o.imageUrl === "string" && o.imageUrl ? o.imageUrl : undefined;
  const rentalPeriodLabel =
    typeof o.rentalPeriodLabel === "string" && o.rentalPeriodLabel.trim()
      ? o.rentalPeriodLabel.trim()
      : undefined;

  return {
    slug,
    lineType,
    title,
    priceLabel,
    priceValue,
    quantity,
    imageUrl,
    ...(lineType === "rent" && rentalPeriodLabel ? { rentalPeriodLabel } : {}),
  };
}

function loadItemsFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map(normalizeStoredItem)
          .filter((x): x is CartItem => x !== null);
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as unknown;
      if (Array.isArray(parsed)) {
        const items = parsed
          .map(normalizeStoredItem)
          .filter((x): x is CartItem => x !== null);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return items;
      }
    }
  } catch {
    return [];
  }
  return [];
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function persist() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function initIfNeeded() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;
  const items = loadItemsFromStorage();
  state = { items };
  persist();
}

function updateItems(updater: (prev: CartItem[]) => CartItem[]) {
  initIfNeeded();
  state = { items: updater(state.items) };
  persist();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  initIfNeeded();
  return state;
}

function getServerSnapshot() {
  return { items: [] as CartItem[] };
}

function sameLine(item: CartItem, slug: string, lineType: LineType) {
  return item.slug === slug && item.lineType === lineType;
}

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const items = snapshot.items;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.priceValue * item.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalPrice,
    addItem: (
      product: Product,
      quantity = 1,
      lineType: LineType = "purchase"
    ) => {
      if ((product.stock ?? 0) <= 0) {
        return;
      }
      if (lineType === "rent") {
        if (
          !product.rentalAvailable ||
          !(product.rentalPriceValue && product.rentalPriceValue > 0)
        ) {
          return;
        }
      }

      const priceValue =
        lineType === "rent"
          ? (product.rentalPriceValue ?? 0)
          : (product.priceValue ?? parsePriceLabelToNumber(product.price));
      const priceLabel =
        lineType === "rent"
          ? (product.rentalPrice ?? product.price)
          : product.price;

      if (!priceValue || priceValue <= 0) {
        return;
      }

      updateItems((prev) => {
        const existing = prev.find((item) =>
          sameLine(item, product.slug, lineType)
        );
        const base: CartItem = {
          slug: product.slug,
          lineType,
          title: product.title,
          priceLabel,
          priceValue,
          quantity,
          imageUrl: product.imageUrl,
          ...(lineType === "rent" && product.rentalPeriodLabel
            ? { rentalPeriodLabel: product.rentalPeriodLabel }
            : {}),
        };

        if (existing) {
          return prev.map((item) =>
            sameLine(item, product.slug, lineType)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, base];
      });
    },
    setQuantity: (slug: string, lineType: LineType, quantity: number) => {
      updateItems((prev) =>
        prev
          .map((item) =>
            sameLine(item, slug, lineType) ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    removeItem: (slug: string, lineType: LineType) => {
      updateItems((prev) =>
        prev.filter((item) => !sameLine(item, slug, lineType))
      );
    },
    clearCart: () => {
      updateItems(() => []);
    },
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
