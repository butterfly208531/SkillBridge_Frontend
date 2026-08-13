/**
 * Shared cloud store for scholarships + winners (Supabase-backed).
 * Admin writes → public pages read via the `scholarships` and
 * `scholarship_winners` tables.
 * localStorage stays the fast local cache; Supabase is the portable source.
 */

import {
  getStoredScholarships,
  saveScholarships,
  getStoredWinners,
  saveWinners,
} from "./scholarship-store";
import { getScholarshipsSupabase, pushScholarshipsSupabase } from "./scholarships-supabase";

/**
 * Write the full scholarships + winners lists to Supabase.
 * Returns true on success, false if Supabase is unreachable/not configured.
 */
export async function pushSharedScholarships(): Promise<boolean> {
  return pushScholarshipsSupabase(getStoredScholarships(), getStoredWinners());
}

/**
 * Pull the latest admin-published scholarships + winners from Supabase into
 * localStorage. Never throws — a failed fetch keeps local data.
 */
export async function syncSharedScholarshipsToLocal(): Promise<void> {
  try {
    const data = await getScholarshipsSupabase();
    if (data === null) return; // fetch failed / not configured — keep local data
    saveScholarships(data.scholarships); // honor empty lists so deleted ones stay deleted
    saveWinners(data.winners);
  } catch {
    // store unreachable — keep local data as-is
  }
}
