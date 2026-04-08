export type PendingOrderState = {
  orderId: string;
  resumeToken: string;
  createdAt: string;
};

const STORAGE_KEY = "kardi.pendingOrder";

export function getPendingOrder(): PendingOrderState | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingOrderState;
    if (!parsed?.orderId || !parsed?.resumeToken) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setPendingOrder(state: PendingOrderState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearPendingOrder() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
