"use client";

import { useEffect, useState } from "react";
import type { MockSellerSession } from "@/types/seller-analytics";

const SELLER_SESSION_KEY = "fashionhero_mock_seller";

export function readSellerSession(): MockSellerSession | null {
  try {
    const stored = window.localStorage.getItem(SELLER_SESSION_KEY);
    return stored ? (JSON.parse(stored) as MockSellerSession) : null;
  } catch {
    return null;
  }
}

export function saveSellerSession(session: MockSellerSession) {
  window.localStorage.setItem(SELLER_SESSION_KEY, JSON.stringify(session));
}

export function clearSellerSession() {
  window.localStorage.removeItem(SELLER_SESSION_KEY);
}

export function useSellerSession() {
  const [session, setSession] = useState<MockSellerSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setSession(readSellerSession());
      setLoaded(true);
    });
  }, []);

  return { session, loaded };
}
