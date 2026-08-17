"use client";

import { useEffect, useState } from "react";
import { Eye, Calendar, TrendingUp, BarChart3, ArrowUpRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminHeader from "../components/AdminHeader";
import {
  getTotalViews,
  getViewsAggregated,
  getViewsByPage,
  type ViewAggregation,
  daysAgo,
  weeksAgo,
  monthsAgo,
  yearsAgo,
} from "@/lib/views-supabase";

type Period = "day" | "week" | "month" | "year";

const SUMMARY_CARDS: { key: Period; label: string; since: () => string; description: string }[] = [
  { key: "day",   label: "Today",   since: () => daysAgo(0),   description: "views today" },
  { key: "week",  label: "Week",    since: () => weeksAgo(1),  description: "views this week" },
  { key: "month", label: "Month",   since: () => monthsAgo(1), description: "views this month" },
  { key: "year",  label: "Year",    since: () => yearsAgo(1),  description: "views this year" },
];

const CHART_PRESETS: { key: Period; label: string; since: () => string; short: string }[] = [
  { key: "day",   label: "Last 7 Days",    since: () => daysAgo(7),   short: "7D"  },
  { key: "week",  label: "Last 4 Weeks",   since: () => weeksAgo(4),  short: "4W"  },
  { key: "month", label: "Last 6 Months",  since: () => monthsAgo(6), short: "6M"  },
  { key: "year",  label: "Last 12 Months", since: () => yearsAgo(1),  short: "12M" },
];

const PAGE_NAMES: Record<string, string> = {
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

function pageName(page: string): string {
  if (PAGE_NAMES[page]) return PAGE_NAMES[page];
  if (page.startsWith("/courses/")) return `Course: ${page.split("/").pop()}`;
  if (page.startsWith("/scholarships/")) return `Scholarship: ${page.split("/").pop()}`;
  if (page.startsWith("/jobs/")) return `Job: ${page.split("/").pop()}`;
  return page;
}

function formatChartLabel(label: string, period: Period): string {
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

export default function AdminViewsPage() {
  // Summary
  const [allTimeTotal, setAllTimeTotal] = useState(0);
  const [activeSummary, setActiveSummary] = useState<Period>("week");
  const [summaryCounts, setSummaryCounts] = useState<Record<Period, number>>({ day: 0, week: 0, month: 0, year: 0 });

  // Chart
  const [chartPeriod, setChartPeriod] = useState<Period>("week");
  const [chartData, setChartData] = useState<ViewAggregation[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Top pages
  const [pageViews, setPageViews] = useState<Record<string, number>>({});
  const [pageLoading, setPageLoading] = useState(true);

  // ── Load all-time total + all summary counts ──
  useEffect(() => {
    (async () => {
      const [allTime, dayCount, weekCount, monthCount, yearCount] = await Promise.all([
        getTotalViews(),
        getTotalViews(SUMMARY_CARDS.find(c => c.key === "day")!.since()),
        getTotalViews(SUMMARY_CARDS.find(c => c.key === "week")!.since()),
        getTotalViews(SUMMARY_CARDS.find(c => c.key === "month")!.since()),
        getTotalViews(SUMMARY_CARDS.find(c => c.key === "year")!.since()),
      ]);
      setAllTimeTotal(allTime);
      setSummaryCounts({ day: dayCount, week: weekCount, month: monthCount, year: yearCount });
    })();
  }, []);

  // ── Load chart data ──
  useEffect(() => {
    (async () => {
      setChartLoading(true);
      const opt = CHART_PRESETS.find(c => c.key === chartPeriod)!;
      const data = await getViewsAggregated(chartPeriod, opt.since());
      setChartData(data);
      setChartLoading(false);
    })();
  }, [chartPeriod]);

  // ── Load top pages ──
  useEffect(() => {
    (async () => {
      setPageLoading(true);
      const data = await getViewsByPage(weeksAgo(1));
      setPageViews(data);
      setPageLoading(false);
    })();
  }, []);

  const maxChart = Math.max(...chartData.map(d => d.count), 1);
  const sortedPages = Object.entries(pageViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const todayViews = chartData.length > 0 ? chartData[chartData.length - 1]?.count || 0 : 0;
  const yesterdayViews = chartData.length > 1 ? chartData[chartData.length - 2]?.count || 0 : 0;
  const trendUp = todayViews >= yesterdayViews;

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="View Counter" />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* ── All-time + refresh ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Page Views</h1>
            <p className="text-xs text-gray-400">
              All time: <span className="font-semibold text-gray-600">{allTimeTotal.toLocaleString()}</span> total views across all pages
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SUMMARY_CARDS.map(card => (
            <button
              key={card.key}
              onClick={() => setActiveSummary(card.key)}
              className={cn(
                "bg-white rounded-2xl border shadow-sm p-5 text-left transition-all duration-200",
                activeSummary === card.key
                  ? "border-[#1E90FF] ring-2 ring-[#1E90FF]/20 shadow-md"
                  : "border-gray-100 hover:border-gray-200 hover:shadow"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  activeSummary === card.key
                    ? "bg-[#1E90FF]/10 text-[#1E90FF]"
                    : "bg-gray-100 text-gray-400"
                )}>
                  <Eye className="w-5 h-5" />
                </div>
                {card.key === "day" && todayViews > 0 && (
                  <span className={cn(
                    "flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    trendUp ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"
                  )}>
                    <ArrowUpRight className={cn("w-3 h-3", !trendUp && "rotate-90")} />
                    {trendUp ? "↑" : "↓"}
                  </span>
                )}
              </div>
              <p className="text-3xl font-extrabold text-gray-800 mb-0.5">
                {summaryCounts[card.key].toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-medium text-gray-600">{card.label}</span> · {card.description}
              </p>
            </button>
          ))}
        </div>

        {/* ── Bar chart ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#1E90FF]" />
              <h2 className="text-sm font-bold text-gray-800">Views Over Time</h2>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {CHART_PRESETS.map(opt => (
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

          {chartLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E90FF]" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">No view data yet</p>
              <p className="text-xs mt-1">Data will appear as visitors browse your site</p>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-1 h-44">
                {chartData.map((d, i) => {
                  const h = maxChart > 0 ? (d.count / maxChart) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0 group relative">
                      <div className="w-full flex items-end" style={{ height: "140px" }}>
                        <div
                          className="w-full rounded-t-md transition-all duration-500 cursor-pointer hover:opacity-80"
                          style={{
                            height: `${Math.max(h, 2)}%`,
                            background: d.count > 0
                              ? "linear-gradient(180deg, #1E90FF, #42A5F5)"
                              : "#e5e7eb",
                          }}
                          title={`${d.label}: ${d.count.toLocaleString()} views`}
                        />
                      </div>
                      <span className="text-[9px] text-gray-400 truncate w-full text-center">
                        {formatChartLabel(d.label, chartPeriod)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart summary row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  {CHART_PRESETS.find(c => c.key === chartPeriod)?.label}
                </div>
                <div className="flex gap-4">
                  <div className="text-xs">
                    <span className="text-gray-400">Total: </span>
                    <span className="font-semibold text-gray-700">
                      {chartData.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Avg/day: </span>
                    <span className="font-semibold text-gray-700">
                      {Math.round(chartData.reduce((sum, d) => sum + d.count, 0) / Math.max(chartData.length, 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400">Peak: </span>
                    <span className="font-semibold text-gray-700">
                      {maxChart.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Top Pages ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#1E90FF]" />
            <h2 className="text-sm font-bold text-gray-800">Top Pages</h2>
            <span className="text-[10px] text-gray-400 ml-1">(Last 7 days)</span>
          </div>

          {pageLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E90FF]" />
            </div>
          ) : sortedPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Eye className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-xs font-medium">No page views recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPages.map(([page, count], i) => {
                const maxPageCount = sortedPages[0][1] || 1;
                const percentage = allTimeTotal > 0 ? Math.round((count / allTimeTotal) * 100) : 0;
                return (
                  <div key={page} className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0",
                      i === 0 ? "bg-[#1E90FF]/10 text-[#1E90FF]"
                        : i === 1 ? "bg-gray-200 text-gray-600"
                        : i === 2 ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {pageName(page)}
                        </span>
                        <div className="flex items-center gap-3 ml-2 shrink-0">
                          <span className="text-[10px] text-gray-400">{percentage}%</span>
                          <span className="text-xs font-bold text-gray-800">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(count / maxPageCount) * 100}%`,
                            background: i === 0
                              ? "linear-gradient(90deg, #1E90FF, #42A5F5)"
                              : i === 1
                              ? "linear-gradient(90deg, #9CA3AF, #D1D5DB)"
                              : i === 2
                              ? "linear-gradient(90deg, #F59E0B, #FCD34D)"
                              : "linear-gradient(90deg, #E5E7EB, #F3F4F6)",
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
    </div>
  );
}
