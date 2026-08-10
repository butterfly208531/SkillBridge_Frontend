"use client";

import { useEffect, useState } from "react";
import {
  Send, Youtube, Linkedin, Globe, Instagram, Facebook,
  LayoutGrid, Save, RotateCcw, Users, CheckCircle2,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";
import {
  loadCommunityStatsOverrides,
  saveCommunityStatsOverrides,
  type CommunityStatOverride,
} from "@/lib/community-stats-store";
import { pushSharedCommunityStats, syncSharedCommunityStatsToLocal } from "@/lib/community-shared";

// ── Platform metadata ────────────────────────────────────────────────────────

const PLATFORM_META: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string; statLabel: string }
> = {
  telegram:  { label: "Telegram",  icon: Send,        color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10", statLabel: "Members"     },
  youtube:   { label: "YouTube",   icon: Youtube,     color: "text-[#F57C00]", bg: "bg-[#F57C00]/10", statLabel: "Subscribers" },
  linkedin:  { label: "LinkedIn",  icon: Linkedin,    color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10", statLabel: "Followers"   },
  hub:       { label: "Hub",       icon: LayoutGrid,  color: "text-[#F57C00]", bg: "bg-[#F57C00]/10", statLabel: "Learners"    },
  instagram: { label: "Instagram", icon: Instagram,   color: "text-[#F57C00]", bg: "bg-[#F57C00]/10", statLabel: "Followers"   },
  facebook:  { label: "Facebook",  icon: Facebook,    color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10", statLabel: "Followers"   },
  tiktok:    { label: "TikTok",    icon: Globe,       color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10", statLabel: "Followers"   },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCommunityPage() {
  const [stats, setStats]     = useState<CommunityStatOverride[]>([]);
  const [saved, setSaved]     = useState(false);
  const [dirty, setDirty]     = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    (async () => {
      // Pull the latest admin-published overrides from the shared store so this
      // admin panel shows what every device sees.
      await syncSharedCommunityStatsToLocal();
      setStats(loadCommunityStatsOverrides());
    })();
  }, []);

  const updateField = (
    key: string,
    field: keyof CommunityStatOverride,
    value: string,
  ) => {
    setStats((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)),
    );
    setDirty(true);
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCommunityStatsOverrides(stats);
    pushSharedCommunityStats(stats);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleReset = () => {
    // Wipe overrides so defaults from community-config.ts are restored
    if (typeof window !== "undefined") {
      localStorage.removeItem("communityStatsOverrides");
    }
    setStats(loadCommunityStatsOverrides());
    pushSharedCommunityStats([]);
    setDirty(false);
    setSaved(false);
  };

  const totalFollowers = stats.reduce(
    (sum, s) => sum + (parseInt(s.statsValue, 10) || 0),
    0,
  );

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Community Stats" />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* Summary card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#1E90FF]/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[#1E90FF]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Community</p>
              <p className="text-2xl font-black text-[#1E90FF]">
                {totalFollowers.toLocaleString()}+
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#F57C00]/10 flex items-center justify-center shrink-0">
              <LayoutGrid className="h-5 w-5 text-[#F57C00]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Platforms</p>
              <p className="text-2xl font-black text-[#F57C00]">{stats.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
              dirty ? "bg-amber-50" : "bg-emerald-50",
            )}>
              <CheckCircle2 className={cn("h-5 w-5", dirty ? "text-amber-500" : "text-emerald-500")} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Status</p>
              <p className={cn("text-sm font-bold", dirty ? "text-amber-500" : "text-emerald-500")}>
                {dirty ? "Unsaved changes" : "All saved"}
              </p>
            </div>
          </div>
        </div>

        {/* Success banner */}
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Community stats saved — changes are now live on the public site.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Platform Stats &amp; Links</h2>
              <span className="text-xs text-gray-400">
                These numbers appear on the Community section of the homepage.
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {stats.map((stat) => {
                const meta = PLATFORM_META[stat.key] ?? {
                  label: stat.key,
                  icon: Globe,
                  color: "text-gray-500",
                  bg: "bg-gray-100",
                  statLabel: "Followers",
                };
                const Icon = meta.icon;

                return (
                  <div
                    key={stat.key}
                    className="grid grid-cols-1 md:grid-cols-[200px_1fr_120px_100px] gap-4 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Platform identity */}
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", meta.bg)}>
                        <Icon className={cn("h-4 w-4", meta.color)} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{meta.label}</p>
                        <p className="text-[11px] text-gray-400">{meta.statLabel}</p>
                      </div>
                    </div>

                    {/* URL */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        Profile URL
                      </label>
                      <input
                        type="url"
                        value={stat.url}
                        onChange={(e) => updateField(stat.key, "url", e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 bg-white"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Count */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stat.statsValue}
                        onChange={(e) => updateField(stat.key, "statsValue", e.target.value)}
                        className="w-full px-3 py-2 text-sm font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 bg-white"
                        placeholder="0"
                      />
                    </div>

                    {/* Suffix */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-400 mb-1">
                        Suffix
                      </label>
                      <input
                        type="text"
                        value={stat.statsSuffix}
                        onChange={(e) => updateField(stat.key, "statsSuffix", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 bg-white"
                        placeholder="+"
                        maxLength={4}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E90FF] hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Save size={15} />
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium rounded-xl transition-colors"
            >
              <RotateCcw size={14} />
              Reset to Defaults
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
