"use client";

import { useSyncExternalStore } from "react";

import type { Product } from "@/lib/site-data";

const STORAGE_KEY = "shop-kardi-cart-v1";

export type CartItem = {
  slug: string;
  title: string;
  priceLabel: string;
  priceValue: number;
  quantity: number;
  imageUrl?: string;
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) {
        state = { items: parsed };
      }
    }
  } catch {
    state = { items: [] };
  }
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

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = snapshot.items;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.priceValue * item.quantity, 0);

  return {
    items,
    totalItems,
    totalPrice,
    addItem: (product: Product, quantity = 1) => {
      updateItems((prev) => {
        const existing = prev.find((item) => item.slug === product.slug);
        const priceValue = product.priceValue ?? parsePriceLabelToNumber(product.price);
        if (existing) {
          return prev.map((item) =>
            item.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [
          ...prev,
          {
            slug: product.slug,
            title: product.title,
            priceLabel: product.price,
            priceValue,
            quantity,
            imageUrl: product.imageUrl
          }
        ];
      });
    },
    setQuantity: (slug: string, quantity: number) => {
      updateItems((prev) =>
        prev
          .map((item) => (item.slug === slug ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0)
      );
    },
    removeItem: (slug: string) => {
      updateItems((prev) => prev.filter((item) => item.slug !== slug));
    },
    clearCart: () => {
      updateItems(() => []);
    }
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

