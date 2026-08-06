import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "blue" | "orange" | "green" | "purple";
  trend?: { value: string; up: boolean };
}

const colorMap = {
  blue:   { bg: "bg-[#1E90FF]/10", icon: "text-[#1E90FF]",  border: "border-[#1E90FF]/20" },
  orange: { bg: "bg-[#F57C00]/10", icon: "text-[#F57C00]",  border: "border-[#F57C00]/20" },
  green:  { bg: "bg-emerald-50",   icon: "text-emerald-500", border: "border-emerald-100"  },
  purple: { bg: "bg-purple-50",    icon: "text-purple-500",  border: "border-purple-100"   },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn("bg-white rounded-2xl border p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow", c.border)}>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={cn("text-xs font-semibold mt-2", trend.up ? "text-emerald-500" : "text-red-400")}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </p>
        )}
      </div>
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
        <Icon className={cn("h-5 w-5", c.icon)} />
      </div>
    </div>
  );
}
