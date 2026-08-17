import { supabase } from "./supabase";

export interface PageViewRow {
  id: string;
  page: string;
  path: string;
  referrer: string;
  viewed_at: string;
}

export interface ViewAggregation {
  label: string;
  count: number;
}

/**
 * Record a page view in Supabase.
 * Silently returns on failure so it never breaks the user experience.
 */
export async function recordPageView(page: string, path: string, referrer: string = ""): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("page_views").insert({ page, path, referrer });
  } catch {
    // silent — tracking should never break the site
  }
}

/**
 * Get total view count for a time range.
 */
export async function getTotalViews(since?: string): Promise<number> {
  if (!supabase) return 0;
  try {
    let query = supabase.from("page_views").select("id", { count: "exact", head: true });
    if (since) query = query.gte("viewed_at", since);
    const { count } = await query;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Get aggregated view counts grouped by day, week, or month.
 * Returns an array of { label, count } for chart display.
 */
export async function getViewsAggregated(
  period: "day" | "week" | "month" | "year",
  rangeStart: string
): Promise<ViewAggregation[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("page_views")
      .select("viewed_at")
      .gte("viewed_at", rangeStart)
      .order("viewed_at", { ascending: true });

    if (error || !data) return [];

    return aggregateByPeriod(data.map(r => r.viewed_at), period);
  } catch {
    return [];
  }
}

/**
 * Get per-page view counts for a time range.
 */
export async function getViewsByPage(since?: string): Promise<Record<string, number>> {
  if (!supabase) return {};
  try {
    let query = supabase.from("page_views").select("page");
    if (since) query = query.gte("viewed_at", since);
    const { data, error } = await query;
    if (error || !data) return {};

    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row.page] = (counts[row.page] || 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function aggregateByPeriod(
  timestamps: string[],
  period: "day" | "week" | "month" | "year"
): ViewAggregation[] {
  const buckets = new Map<string, number>();

  for (const ts of timestamps) {
    const d = new Date(ts);
    const key = formatBucketKey(d, period);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  // Generate all labels in the range so empty periods show as 0
  const result: ViewAggregation[] = [];
  const sorted = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b));

  if (sorted.length === 0) return result;

  const first = sorted[0][0];
  const last = sorted[sorted.length - 1][0];
  const allLabels = generateLabels(first, last, period);

  for (const label of allLabels) {
    result.push({ label, count: buckets.get(label) || 0 });
  }

  return result;
}

function formatBucketKey(d: Date, period: "day" | "week" | "month" | "year"): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  switch (period) {
    case "day":
      return `${y}-${m}-${day}`;
    case "week": {
      const startOfYear = new Date(y, 0, 1);
      const weekNum = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
      return `${y}-W${String(weekNum).padStart(2, "0")}`;
    }
    case "month":
      return `${y}-${m}`;
    case "year":
      return `${y}`;
  }
}

function generateLabels(first: string, last: string, period: "day" | "week" | "month" | "year"): string[] {
  const labels: string[] = [];
  let current = first;

  while (current <= last) {
    labels.push(current);
    current = incrementLabel(current, period);
  }

  return labels;
}

function incrementLabel(label: string, period: "day" | "week" | "month" | "year"): string {
  switch (period) {
    case "day": {
      const d = new Date(label + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return formatBucketKey(d, "day");
    }
    case "week": {
      const [y, w] = label.split("-W").map(Number);
      const d = new Date(y, 0, 1);
      d.setDate(d.getDate() + w * 7);
      return formatBucketKey(d, "week");
    }
    case "month": {
      const [y, m] = label.split("-").map(Number);
      const d = new Date(y, m, 1);
      return formatBucketKey(d, "month");
    }
    case "year":
      return String(Number(label) + 1);
  }
}

/**
 * Get the ISO date string for N days ago.
 */
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function weeksAgo(n: number): string {
  return daysAgo(n * 7);
}

export function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function yearsAgo(n: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
