"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminHeader({ title }: { title: string }) {
  const [admin, setAdmin] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("adminUser");
    if (raw) {
      try { setAdmin(JSON.parse(raw)); } catch {}
    }
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-52"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-4.5 w-4.5 text-gray-500" size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F57C00] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#42A5F5] flex items-center justify-center text-white text-xs font-bold">
            {admin?.name?.[0]?.toUpperCase() ?? admin?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="hidden md:block leading-tight">
            <p className="text-xs font-semibold text-gray-800">{admin?.name ?? "Admin"}</p>
            <p className="text-[10px] text-gray-400">{admin?.email ?? ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
