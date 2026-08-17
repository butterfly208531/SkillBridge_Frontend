"use client";

import { usePageView } from "@/hooks/use-page-view";

/**
 * Drop <PageViewTracker page="/courses" /> into any page (server or client)
 * to record a page view. Renders nothing.
 */
export function PageViewTracker({ page }: { page: string }) {
  usePageView(page);
  return null;
}
