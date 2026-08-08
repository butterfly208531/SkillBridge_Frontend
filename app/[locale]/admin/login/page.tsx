"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

const ADMIN_EMAIL    = "admin@skillbridge.com";
const ADMIN_PASSWORD = "Admin123!";

export default function AdminLoginPage() {
  const [email,        setEmail]        = useState(ADMIN_EMAIL);
  const [password,     setPassword]     = useState(ADMIN_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const e1 = email.trim().toLowerCase();
    const p1 = password.trim();

    // Check demo credentials first — no network needed
    if (e1 !== ADMIN_EMAIL.toLowerCase() || p1 !== ADMIN_PASSWORD) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Try the real backend — if it works, use the real token
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

      const endpoints = [`${base}/auth/login-admin`, `${base}/auth/login`];
      for (const url of endpoints) {
        let res: Response;
        try {
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: e1, password: p1 }),
          });
        } catch {
          continue; // network error on this endpoint, try next
        }

        if (res.ok) {
          const data = await res.json();
          const token = data.accessToken || data.token || data.access_token || "";
          if (token) {
            sessionStorage.setItem("adminToken", token);
            sessionStorage.setItem("adminUser", JSON.stringify(data.user || data.admin || { email: e1, name: "Admin" }));
            const locale = window.location.pathname.split("/")[1] || "en";
            window.location.replace(`/${locale}/admin/dashboard`);
            return;
          }
        }

        if (res.status === 401 || res.status === 403) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }

        // 4xx (not 401/403) or 5xx — try next endpoint or fall through to demo
      }
    } catch {
      // Unexpected error — fall through to demo login
    }

    // Backend unavailable or broken — use demo token
    sessionStorage.setItem("adminToken", "demo-token");
    sessionStorage.setItem("adminUser", JSON.stringify({ email: ADMIN_EMAIL, name: "Admin" }));
    const locale = window.location.pathname.split("/")[1] || "en";
    window.location.replace(`/${locale}/admin/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E90FF]/10 via-white to-[#F57C00]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="SkillBridge" width={72} height={72} className="mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-900">SkillBridge</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sign in to continue</h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder={ADMIN_EMAIL}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(90deg, #1E90FF, #42A5F5)" }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</span>
                : "Sign In"
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} SkillBridge Institute of Technology
        </p>
      </div>
    </div>
  );
}
