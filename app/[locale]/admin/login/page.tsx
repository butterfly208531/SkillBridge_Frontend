"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";
const ENDPOINTS = [`${BASE}/auth/login-admin`, `${BASE}/auth/login`];
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS   = 35_000; // 35 s per attempt
const RETRY_DELAY  = 6_000;  // 6 s between retries

function fetchWithTimeout(url: string, options: RequestInit, ms: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(url, options)
      .then(r  => { clearTimeout(timer); resolve(r); })
      .catch(e => { clearTimeout(timer); reject(e); });
  });
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export default function AdminLoginPage() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [statusMsg,    setStatusMsg]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusMsg("");
    setLoading(true);

    const body    = JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() });
    const headers = { "Content-Type": "application/json" };

    try {
      for (const url of ENDPOINTS) {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
          if (attempt === 2) setStatusMsg("⏳ Server is waking up, please wait…");
          if (attempt === 3) setStatusMsg("⏳ Still waking up, almost there…");

          let res: Response | null = null;

          try {
            res = await fetchWithTimeout(url, { method: "POST", headers, body }, TIMEOUT_MS);
          } catch {
            // Network error / timeout — retry if attempts remain
            if (attempt < MAX_ATTEMPTS) { await sleep(RETRY_DELAY); continue; }
            else break; // exhausted retries on this endpoint → try next
          }

          setStatusMsg("");

          // ✅ Success
          if (res.ok) {
            const data  = await res.json();
            const token = data.accessToken || data.token || data.access_token || "";
            if (token) {
              sessionStorage.setItem("adminToken", token);
              sessionStorage.setItem("adminUser", JSON.stringify(
                data.user || data.admin || { email: email.trim().toLowerCase(), name: "Admin" }
              ));
              const locale = window.location.pathname.split("/")[1] || "en";
              window.location.replace(`/${locale}/admin/dashboard`);
              return;
            }
          }

          // ❌ Wrong credentials — no point retrying
          if (res.status === 401 || res.status === 403) {
            setError("Invalid email or password.");
            return;
          }

          // 5xx or other — retry after delay
          if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY);
        }
      }

      // All endpoints & retries exhausted
      setError("Unable to reach the server. Please check your connection and try again.");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
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
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {statusMsg && !error && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">
              {statusMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@skillbridge.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg, #1E90FF, #42A5F5)" }}
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
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
