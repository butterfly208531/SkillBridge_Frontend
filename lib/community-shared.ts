/**
 * Shared cloud store for community stats overrides (jsonblob.com — free, no
 * account, CORS-enabled).
 *
 * The admin writes the full overrides set here so the public community section
 * on ANY device reads the same numbers/links. Makes admin edits visible
 * everywhere instead of only in the admin's own browser localStorage.
 *
 * Flow:
 *   - Admin saves overrides   -> pushSharedCommunityStats(getStoredOverrides())
 *   - Public section loads    -> syncSharedCommunityStatsToLocal() then reads localStorage
 */

import { saveCommunityStatsOverrides, type CommunityStatOverride } from "./community-stats-store";

// Public jsonblob ID for the SkillBridge community-stats store. Recreate a blob at
// https://jsonblob.com and paste its UUID here if this one ever needs replacing.
export const SHARED_COMMUNITY_URL =
  "https://jsonblob.com/api/jsonBlob/019fedb0-a86c-73a7-b931-482adf0dbb00";

const FETCH_TIMEOUT_MS = 8000;

interface SharedPayload {
  overrides: CommunityStatOverride[];
}

async function httpJson(method: "GET" | "PUT", body?: SharedPayload): Promise<SharedPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHARED_COMMUNITY_URL, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Shared store returned ${res.status}`);
    return (await res.json()) as SharedPayload;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Write the full community-stats overrides to the shared cloud store.
 * Returns true on success, false if the store is unreachable.
 */
export async function pushSharedCommunityStats(overrides: CommunityStatOverride[]): Promise<boolean> {
  try {
    await httpJson("PUT", { overrides });
    return true;
  } catch {
    return false;
  }
}

/**
 * Pull the latest admin-published overrides from the shared store into localStorage
 * so components that read getEffectiveCommunityConfig() automatically see admin
 * changes from other devices. Never throws — a failed fetch keeps local data.
 */
export async function syncSharedCommunityStatsToLocal(): Promise<void> {
  try {
    const data = await httpJson("GET");
    if (Array.isArray(data.overrides)) saveCommunityStatsOverrides(data.overrides);
  } catch {
    // store unreachable — keep local data as-is
  }
}
