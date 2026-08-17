"use client";

import { useEffect, useState } from "react";
import { Eye, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTotalViews,
  getViewsAggregated,
  getViewsByPage,
  type ViewAggregation,
} from "@/lib/views-supabase";
import { daysAgo, weeksAgo, monthsAgo, yearsAgo } from "@/lib/views-supabase";

type Period = "day" | "week" | "month" | "year";

const PERIOD_OPTIONS: { key: Period; label: string; since: () => string }[] = [
  { key: "day",   label: "Today",   since: () => daysAgo(1)   },
  { key: "week",  label: "Week",    since: () => weeksAgo(1)  },
  { key: "month", label: "Month",   since: () => monthsAgo(1) },
  { key: "year",  label: "Year",    since: () => yearsAgo(1)  },
];

const PERIOD_CHART: { key: Period; label: string; since: () => string; short: string }[] = [
  { key: "day",   label: "Last 7 Days",     since: () => daysAgo(7),   short: "7D"  },
  { key: "week",  label: "Last 4 Weeks",    since: () => weeksAgo(4),  short: "4W"  },
  { key: "month", label: "Last 6 Months",   since: () => monthsAgo(6), short: "6M"  },
  { key: "year",  label: "Last 12 Months",  since: () => yearsAgo(1),  short: "12M" },
];

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/courses": "Courses",
  "/about": "About",
  "/contact": "Contact",
  "/projects": "Projects",
  "/jobs": "Jobs",
  "/announcements": "Announcements",
  "/scholarships": "Scholarships",
  "/faq": "FAQ",
  "/privacy": "Privacy",
  "/terms": "Terms",
  "/videos": "Videos",
  "/career": "Career",
  "/booking": "Booking",
};

function pageLabel(page: string): string {
  if (PAGE_LABELS[page]) return PAGE_LABELS[page];
  if (page.startsWith("/courses/")) return "Course Detail";
  if (page.startsWith("/scholarships/")) return "Scholarship Detail";
  if (page.startsWith("/jobs/")) return "Job Detail";
  return page;
}

export default function ViewCounter() {
  const [total, setTotal] = useState(0);
  const [periodTotal, setPeriodTotal] = useState(0);
  const [activePeriod, setActivePeriod] = useState<Period>("week");
  const [chartData, setChartData] = useState<ViewAggregation[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>("week");
  const [pageViews, setPageViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Load summary stats
  useEffect(() => {
    (async () => {
      const [allTime, periodData] = await Promise.all([
        getTotalViews(),
        getTotalViews(PERIOD_OPTIONS.find(p => p.key === activePeriod)!.since()),
      ]);
      setTotal(allTime);
      setPeriodTotal(periodData);
    })();
  }, [activePeriod]);

  // Load chart data
  useEffect(() => {
    (async () => {
      const opt = PERIOD_CHART.find(p => p.key === chartPeriod)!;
      const data = await getViewsAggregated(chartPeriod, opt.since());
      setChartData(data);
    })();
  }, [chartPeriod]);

  // Load page breakdown
  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = weeksAgo(1);
      const data = await getViewsByPage(since);
      setPageViews(data);
      setLoading(false);
    })();
  }, []);

  const maxChart = Math.max(...chartData.map(d => d.count), 1);
  const sortedPages = Object.entries(pageViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PERIOD_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setActivePeriod(opt.key)}
            className={cn(
              "bg-white rounded-2xl border shadow-sm p-4 text-left transition-all duration-200",
              activePeriod === opt.key
                ? "border-[#1E90FF] ring-1 ring-[#1E90FF]/20"
                : "border-gray-100 hover:border-gray-200"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                activePeriod === opt.key
                  ? "bg-[#1E90FF]/10 text-[#1E90FF]"
                  : "bg-gray-100 text-gray-400"
              )}>
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500">{opt.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-800">
              {activePeriod === opt.key ? periodTotal.toLocaleString() : "—"}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {activePeriod === opt.key
                ? opt.key === "day" ? "views today" : `views this ${opt.key}`
                : `click to view`}
            </p>
          </button>
        ))}
      </div>

      {/* ── All-time + chart period selector ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Page Views</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              All time: <span className="font-semibold text-gray-600">{total.toLocaleString()}</span> total views
            </p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {PERIOD_CHART.map(opt => (
              <button
                key={opt.key}
                onClick={() => setChartPeriod(opt.key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  chartPeriod === opt.key
                    ? "bg-white text-[#1E90FF] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {opt.short}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <BarChart3 className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No view data yet</p>
          </div>
        ) : (
          <div className="flex items-end gap-1 h-36">
            {chartData.map((d, i) => {
              const h = maxChart > 0 ? (d.count / maxChart) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div className="w-full flex items-end" style={{ height: "120px" }}>
                    <div
                      className="w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${Math.max(h, 2)}%`,
                        background: d.count > 0
                          ? "linear-gradient(180deg, #1E90FF, #42A5F5)"
                          : "#e5e7eb",
                      }}
                      title={`${d.label}: ${d.count} views`}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 truncate w-full text-center">
                    {formatLabel(d.label, chartPeriod)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Top Pages ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#1E90FF]" />
          <h2 className="text-sm font-bold text-gray-800">Top Pages (Last 7 Days)</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E90FF]" />
          </div>
        ) : sortedPages.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No page view data yet</p>
        ) : (
          <div className="space-y-2.5">
            {sortedPages.map(([page, count], i) => {
              const maxPageCount = sortedPages[0][1] || 1;
              return (
                <div key={page} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 truncate">
                        {pageLabel(page)}
                      </span>
                      <span className="text-xs font-semibold text-gray-800 ml-2">
                        {count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxPageCount) * 100}%`,
                          background: "linear-gradient(90deg, #1E90FF, #42A5F5)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatLabel(label: string, period: Period): string {
  switch (period) {
    case "day": {
      const d = new Date(label + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    case "week":
      return label.replace("-", " ");
    case "month": {
      const [y, m] = label.split("-");
      const d = new Date(Number(y), Number(m) - 1);
      return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }
    case "year":
      return label;
  }
}
