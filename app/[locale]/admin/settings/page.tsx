"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import AdminHeader from "../components/AdminHeader";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: "SkillBridge Institute of Technology",
    email: "skillbridgeinstitituteoftech@gmail.com",
    phone1: "+251955935455",
    phone2: "+251974424372",
    telegram: "@skillbridgesupport2",
    location: "Addis Ababa, Ethiopia",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
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
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
            ))}
            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors"
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
