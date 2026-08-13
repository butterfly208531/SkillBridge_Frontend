/**
 * Shared cloud store for community stats overrides (Supabase-backed).
 * Admin writes → public section reads via the `community_stats` table.
 * localStorage stays the fast local cache; Supabase is the portable source.
 */

import {
  saveCommunityStatsOverrides,
  type CommunityStatOverride,
} from "./community-stats-store";
import { getCommunityStatsSupabase, pushCommunityStatsSupabase } from "./community-supabase";

/**
 * Write the full community-stats overrides to Supabase.
 * Returns true on success, false if Supabase is unreachable/not configured.
 */
export async function pushSharedCommunityStats(overrides: CommunityStatOverride[]): Promise<boolean> {
  return pushCommunityStatsSupabase(overrides);
}

/**
 * Pull the latest admin-published overrides from Supabase into localStorage.
 * Never throws — a failed fetch keeps local data.
 */
export async function syncSharedCommunityStatsToLocal(): Promise<void> {
  try {
    const overrides = await getCommunityStatsSupabase();
    if (overrides === null) return; // fetch failed / not configured — keep local data
    saveCommunityStatsOverrides(overrides); // honor empty lists
  } catch {
    // store unreachable — keep local data as-is
  }
}
