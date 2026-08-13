/**
 * Supabase-backed community stats overrides store — replaces the jsonblob
 * shared store. Admin writes → public section reads, through the
 * `community_stats` table.
 */

import { supabase } from "./supabase";
import type { CommunityStatOverride } from "./community-stats-store";

function mapRow(row: any): CommunityStatOverride {
  return {
    key: row.key,
    statsValue: row.stats_value ?? "",
    statsSuffix: row.stats_suffix ?? "",
    url: row.url ?? "",
    label: row.label ?? "",
    statLabel: row.stat_label ?? "",
  };
}

function mapOverride(o: CommunityStatOverride): any {
  return {
    key: o.key,
    stats_value: o.statsValue,
    stats_suffix: o.statsSuffix,
    url: o.url,
    label: o.label ?? "",
    stat_label: o.statLabel ?? "",
  };
}

export async function getCommunityStatsSupabase(): Promise<CommunityStatOverride[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("community_stats").select("*");
  if (error) {
    console.warn("Supabase community stats read failed:", error.message);
    return null;
  }
  return (data ?? []).map(mapRow);
}

/**
 * Push the FULL overrides list. The pushed list is authoritative: overrides
 * removed from the admin panel are also removed from Supabase, so an empty
 * list here truly clears the table.
 */
export async function pushCommunityStatsSupabase(
  overrides: CommunityStatOverride[],
): Promise<boolean> {
  if (!supabase) return false;
  const { error: delErr } = await supabase
    .from("community_stats")
    .delete()
    .neq("key", "~~noop~~");
  if (delErr) {
    console.warn("Supabase community stats clear failed:", delErr.message);
    return false;
  }
  if (overrides.length === 0) return true;
  const { error } = await supabase
    .from("community_stats")
    .upsert(overrides.map(mapOverride));
  if (error) {
    console.warn("Supabase community stats write failed:", error.message);
    return false;
  }
  return true;
}
