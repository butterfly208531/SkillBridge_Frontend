import { communityConfig, type CommunityPlatform } from "@/lib/community-config";

const STORAGE_KEY = "communityStatsOverrides";

export interface CommunityStatOverride {
  key: string;
  statsValue: string;
  statsSuffix: string;
  url: string;
  label?: string;
  statLabel?: string;
}

/** Return the full platform list, merging any admin-saved overrides on top of the static defaults. */
export function getEffectiveCommunityConfig(): CommunityPlatform[] {
  if (typeof window === "undefined") return communityConfig;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return communityConfig;
    const overrides: CommunityStatOverride[] = JSON.parse(raw);
    const overrideMap = Object.fromEntries(overrides.map((o) => [o.key, o]));
    const merged = communityConfig.map((platform) => {
      const override = overrideMap[platform.key];
      if (!override) return platform;
      return {
        ...platform,
        statsValue:   override.statsValue,
        statsSuffix:  override.statsSuffix,
        url:          override.url,
        label:        override.label,
        statLabel:    override.statLabel,
      };
    });
    // Append any admin-added platforms that aren't part of the static defaults
    const knownKeys = new Set(communityConfig.map((p) => p.key));
    const added = overrides.filter((o) => !knownKeys.has(o.key));
    const addedPlatforms: CommunityPlatform[] = added.map((o) => ({
      key:          o.key,
      url:          o.url,
      statsValue:   o.statsValue,
      statsSuffix:  o.statsSuffix,
      label:        o.label,
      statLabel:    o.statLabel,
    }));
    return [...merged, ...addedPlatforms];
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
  const seed: CommunityStatOverride[] = communityConfig.map((p) => ({
    key:          p.key,
    statsValue:   p.statsValue ?? "",
    statsSuffix:  p.statsSuffix ?? "+",
    url:          p.url,
    label:        p.label,
    statLabel:    p.statLabel,
  }));

  if (typeof window === "undefined") return seed;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored: CommunityStatOverride[] = JSON.parse(raw);
      const knownKeys = new Set(communityConfig.map((p) => p.key));
      // Apply any stored overrides on top of the static seed
      const merged = seed.map((s) => {
        const storedItem = stored.find((o) => o.key === s.key);
        return storedItem
          ? { ...s, ...storedItem }
          : s;
      });
      // Preserve admin-added platforms that aren't part of the static config
      const added = stored.filter((o) => !knownKeys.has(o.key));
      return [...merged, ...added];
    }
  } catch {}
  // First visit — seed from static config
  return seed;
}
