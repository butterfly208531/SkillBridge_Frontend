import { communityConfig, type CommunityPlatform } from "@/lib/community-config";

const STORAGE_KEY = "communityStatsOverrides";

export interface CommunityStatOverride {
  key: string;
  statsValue: string;
  statsSuffix: string;
  url: string;
}

/** Return the full platform list, merging any admin-saved overrides on top of the static defaults. */
export function getEffectiveCommunityConfig(): CommunityPlatform[] {
  if (typeof window === "undefined") return communityConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return communityConfig;
    const overrides: CommunityStatOverride[] = JSON.parse(raw);
    const overrideMap = Object.fromEntries(overrides.map((o) => [o.key, o]));
    return communityConfig.map((platform) => {
      const override = overrideMap[platform.key];
      if (!override) return platform;
      return {
        ...platform,
        statsValue:   override.statsValue,
        statsSuffix:  override.statsSuffix,
        url:          override.url,
      };
    });
  } catch {
    return communityConfig;
  }
}

/** Save the full set of overrides (called from the admin page on save). */
export function saveCommunityStatsOverrides(overrides: CommunityStatOverride[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

/** Load the current overrides for the admin form (falls back to static config values). */
export function loadCommunityStatsOverrides(): CommunityStatOverride[] {
  if (typeof window === "undefined") {
    return communityConfig.map((p) => ({
      key:          p.key,
      statsValue:   p.statsValue ?? "",
      statsSuffix:  p.statsSuffix ?? "+",
      url:          p.url,
    }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // First visit — seed from static config
  return communityConfig.map((p) => ({
    key:          p.key,
    statsValue:   p.statsValue ?? "",
    statsSuffix:  p.statsSuffix ?? "+",
    url:          p.url,
  }));
}
