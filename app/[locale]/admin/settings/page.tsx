"use client";

import { useState, useEffect } from "react";
import { Save, KeyRound, Eye, EyeOff } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { getSettingsSupabase, saveSettingsSupabase, DEFAULT_SETTINGS } from "@/lib/settings-supabase";
import { getAdminCredentials, saveAdminCredentials, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "@/lib/admin-auth-supabase";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [creds, setCreds] = useState({
    email: DEFAULT_ADMIN_EMAIL,
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    (async () => {
      const [settings, admin] = await Promise.all([getSettingsSupabase(), getAdminCredentials()]);
      if (settings) setForm({ ...DEFAULT_SETTINGS, ...settings });
      if (admin) setCreds({ email: admin.email, password: "", confirm: "" });
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveSettingsSupabase(form);
    setSaved(true);
    if (!ok) console.warn("Settings could not be saved to Supabase");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCredsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (creds.password && creds.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (creds.password !== creds.confirm) {
      setError("Password confirmation does not match.");
      return;
    }
    const ok = await saveAdminCredentials({
      email: creds.email.trim() || DEFAULT_ADMIN_EMAIL,
      password: creds.password || DEFAULT_ADMIN_PASSWORD,
    });
    setSaved(true);
    if (!ok) console.warn("Admin credentials could not be saved to Supabase");
    if (ok) setCreds({ email: creds.email.trim() || DEFAULT_ADMIN_EMAIL, password: "", confirm: "" });
    setTimeout(() => setSaved(false), 3000);
  };

  const [error, setError] = useState("");

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Settings" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl space-y-6">

          {saved && (
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
              Settings saved successfully.
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">General Settings</h2>
            {[
              { label: "Site Name",     field: "siteName",  type: "text" },
              { label: "Contact Email", field: "email",     type: "email" },
              { label: "Phone 1",       field: "phone1",    type: "text" },
              { label: "Phone 2",       field: "phone2",    type: "text" },
              { label: "Telegram",      field: "telegram",  type: "text" },
              { label: "Location",      field: "location",  type: "text" },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={(form as any)[field]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  disabled={loading}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 disabled:opacity-60"
                />
              </div>
            ))}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-60"
              >
                <Save size={15} /> Save Settings
              </button>
            </div>
          </form>

          <form onSubmit={handleCredsSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <KeyRound size={15} className="text-[#F57C00]" /> Admin Credentials
            </h2>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={creds.email}
                onChange={e => setCreds(p => ({ ...p, email: e.target.value }))}
                disabled={loading}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 disabled:opacity-60"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={creds.password}
                    onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                    disabled={loading}
                    placeholder="Leave blank to keep current"
                    className="w-full pr-10 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={creds.confirm}
                  onChange={e => setCreds(p => ({ ...p, confirm: e.target.value }))}
                  disabled={loading}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 disabled:opacity-60"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#F57C00] text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                <Save size={15} /> Update Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
