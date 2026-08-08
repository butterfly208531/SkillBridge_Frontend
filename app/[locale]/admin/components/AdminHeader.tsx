"use client";

import { Bell, Search, X, CheckCheck, FileText, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  CONTACT_MESSAGES_KEY,
  getLocalContactMessages,
  saveLocalContactMessages,
  type LocalContactMessage,
} from "@/lib/contact-api";

// ── Application notifications (existing) ────────────────────────────────────

interface AppNotification {
  id: string;
  fullName: string;
  email: string;
  courseId?: string;
  courseSlug?: string;
  courseName?: string;
  submittedAt: string;
  read: boolean;
}

const APP_KEY = "adminNotifications";

function getAppNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw: any[] = JSON.parse(localStorage.getItem(APP_KEY) || "[]");
    return raw.filter(
      (n) =>
        n && typeof n === "object" && n.id && n.submittedAt && (n.fullName || n.email)
    ) as AppNotification[];
  } catch {
    return [];
  }
}

function saveAppNotifications(list: AppNotification[]) {
  localStorage.setItem(APP_KEY, JSON.stringify(list));
}

// ── Unified notification shape for the dropdown ──────────────────────────────

type UnifiedNotification =
  | ({ kind: "application" } & AppNotification)
  | ({ kind: "contact" } & LocalContactMessage);

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminHeader({ title }: { title: string }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [admin, setAdmin] = useState<{ email: string; name?: string } | null>(null);
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load admin user
  useEffect(() => {
    const raw = sessionStorage.getItem("adminUser");
    if (raw) {
      try { setAdmin(JSON.parse(raw)); } catch {}
    }
  }, []);

  // Load & merge both notification sources, poll every 5 s
  useEffect(() => {
    const load = () => {
      const appNotifs: UnifiedNotification[] = getAppNotifications().map((n) => ({
        kind: "application" as const,
        ...n,
      }));
      const contactNotifs: UnifiedNotification[] = getLocalContactMessages().map((m) => ({
        kind: "contact" as const,
        ...m,
      }));
      // Merge and sort newest first
      const all = [...appNotifs, ...contactNotifs].sort(
        (a, b) =>
          new Date(
            a.kind === "application" ? a.submittedAt : a.createdAt
          ).getTime() -
          new Date(
            b.kind === "application" ? b.submittedAt : b.createdAt
          ).getTime()
      ).reverse();
      setNotifications(all);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (n: UnifiedNotification) => {
    if (n.kind === "application") {
      const updated = getAppNotifications().map((a) =>
        a.id === n.id ? { ...a, read: true } : a
      );
      saveAppNotifications(updated);
    } else {
      const updated = getLocalContactMessages().map((m) =>
        m.id === n.id ? { ...m, read: true } : m
      );
      saveLocalContactMessages(updated);
    }
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
  };

  const markAllRead = () => {
    saveAppNotifications(getAppNotifications().map((a) => ({ ...a, read: true })));
    saveLocalContactMessages(getLocalContactMessages().map((m) => ({ ...m, read: true })));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    saveAppNotifications([]);
    saveLocalContactMessages([]);
    setNotifications([]);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-40">
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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] text-[#1E90FF] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={12} /> All read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Clear all"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Bell size={28} className="mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                    <p className="text-xs mt-0.5">New messages will appear here</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const isContact = n.kind === "contact";
                    const time = isContact
                      ? timeAgo(n.createdAt)
                      : timeAgo(n.submittedAt);
                    const senderName = isContact ? n.name : (n as any).fullName || "Someone";
                    const subtitle = isContact
                      ? (n as LocalContactMessage).message.slice(0, 60) + ((n as LocalContactMessage).message.length > 60 ? "…" : "")
                      : `Applied for ${(n as any).courseName || (n as any).courseSlug || "a course"}`;
                    const destination = isContact
                      ? `/${locale}/admin/contact`
                      : `/${locale}/admin/applications`;

                    return (
                      <button
                        key={`${n.kind}-${n.id}`}
                        onClick={() => {
                          markRead(n);
                          setOpen(false);
                          router.push(destination);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex gap-3 ${!n.read ? "bg-blue-50/40" : ""}`}
                      >
                        {/* Icon */}
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${isContact ? "bg-orange-100" : "bg-[#1E90FF]/10"}`}>
                          {isContact
                            ? <Mail size={14} className="text-orange-500" />
                            : <FileText size={14} className="text-[#1E90FF]" />
                          }
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {isContact ? "New contact message" : "New application"}
                              {!n.read && (
                                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-blue-500 align-middle" />
                              )}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0">{time}</span>
                          </div>
                          <p className="text-[11px] text-gray-700 truncate mt-0.5">
                            <span className="font-medium">{senderName}</span>
                            {" — "}
                            <span className="text-gray-500">{subtitle}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">{n.email}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 flex gap-3 justify-center">
                  <button
                    onClick={() => { setOpen(false); router.push(`/${locale}/admin/applications`); }}
                    className="text-xs text-[#1E90FF] font-semibold hover:underline"
                  >
                    Applications →
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => { setOpen(false); router.push(`/${locale}/admin/contact`); }}
                    className="text-xs text-orange-500 font-semibold hover:underline"
                  >
                    Contact →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
