"use client";

import { useEffect } from "react";
import { recordPageView } from "@/lib/views-supabase";

const STORAGE_KEY = "sb_view_timestamps";
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Track a page view on mount.
 * Uses localStorage to avoid counting the same page within 30 minutes,
 * even across page refreshes.
 */
export function usePageView(page: string) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const seen: Record<string, number> = raw ? JSON.parse(raw) : {};
      const lastSeen = seen[page] || 0;

      if (Date.now() - lastSeen < COOLDOWN_MS) return;

      seen[page] = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));

      const path = window.location.pathname;
      const referrer = document.referrer || "";
      recordPageView(page, path, referrer);
    } catch {
      // localStorage unavailable — still track
      const path = window.location.pathname;
      const referrer = document.referrer || "";
      recordPageView(page, path, referrer);
    }
  }, [page]);
}
