"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, FileText, Award,
  LogOut, ChevronLeft, ChevronRight, Settings, Mail, Briefcase, Users, FolderOpen
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",    path: "dashboard",     icon: LayoutDashboard },
  { label: "Courses",      path: "courses",       icon: BookOpen },
  { label: "Applications", path: "applications",  icon: FileText },
  { label: "Scholarships", path: "scholarships",  icon: Award },
  { label: "Projects",     path: "projects",      icon: FolderOpen },
  { label: "Jobs",         path: "jobs",          icon: Briefcase },
  { label: "Community",    path: "community",     icon: Users },
  { label: "Contact",      path: "contact",       icon: Mail },
  { label: "Settings",     path: "settings",      icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    window.location.href = `/${locale}/admin/login`;
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-gray-900 text-white transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/10", collapsed && "justify-center px-0")}>
        <Image src="/logo.png" alt="SkillBridge" width={36} height={36} className="shrink-0" />
        {!collapsed && (
          <div className="leading-tight overflow-hidden">
            <p className="text-sm font-bold text-white truncate">SkillBridge</p>
            <p className="text-[10px] text-white/50">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map(({ label, path, icon: Icon }) => {
            const href = `/${locale}/admin/${path}`;
            const active = pathname.includes(`/admin/${path}`);
            return (
              <li key={path}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-[#1E90FF] text-white shadow-md shadow-[#1E90FF]/30"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-auto mb-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logout */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

