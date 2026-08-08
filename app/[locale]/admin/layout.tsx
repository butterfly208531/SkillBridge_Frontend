"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/admin/login");

  // Always render the login page without any auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // Start as null = "not yet checked" (avoids reading sessionStorage on server)
  const [authState, setAuthState] = useState<"loading" | "ok" | "redirect">("loading");

  useEffect(() => {
    // This only runs in the browser, never on the server
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setAuthState("ok");
    } else {
      setAuthState("redirect");
    }
  }, []);

  useEffect(() => {
    if (authState === "redirect") {
      const locale = window.location.pathname.split("/")[1] || "en";
      window.location.replace(`/${locale}/admin/login`);
    }
  }, [authState]);

  if (authState === "loading" || authState === "redirect") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#1E90FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
