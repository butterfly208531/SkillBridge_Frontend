"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { getSettingsSupabase, saveSettingsSupabase, DEFAULT_SETTINGS } from "@/lib/settings-supabase";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      const settings = await getSettingsSupabase();
      if (settings) setForm({ ...DEFAULT_SETTINGS, ...settings });
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
        </div>
      </div>
    </div>
  );
}
