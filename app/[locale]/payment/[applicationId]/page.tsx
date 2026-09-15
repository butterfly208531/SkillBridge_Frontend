"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, UploadCloud, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import { getApplicationByIdSupabase, updateApplicationSupabase, uploadReceiptSupabase } from "@/lib/applications-supabase";

export default function PaymentUploadPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      if (!applicationId) return;
      const data = await getApplicationByIdSupabase(applicationId);
      setApp(data);
      setLoading(false);
    })();
  }, [applicationId]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!file) { setMessage({ type: "err", text: "Please choose a receipt image or PDF to upload." }); return; }
    if (!app || app.email !== email.trim().toLowerCase()) {
      setMessage({ type: "err", text: "The email does not match the one used on this application. Please use the email you applied with." });
      return;
    }
    setUploading(true);
    const url = await uploadReceiptSupabase(file, `receipts-${applicationId}`);
    if (!url) {
      setUploading(false);
      setMessage({ type: "err", text: "Upload failed. Please try again or contact SkillBridge support." });
      return;
    }
    const ok = await updateApplicationSupabase(applicationId, { receiptUrl: url, read: false });
    setUploading(false);
    if (!ok) {
      setMessage({ type: "err", text: "Receipt uploaded but could not be attached. Please contact SkillBridge support." });
      return;
    }
    // Notify the admin bell immediately (and across devices via Supabase read=false)
    try {
      const notif = {
        id: applicationId,
        fullName: app.fullName,
        email: app.email,
        courseName: app.courseName,
        submittedAt: new Date().toISOString(),
        read: false,
      };
      const existing = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
      localStorage.setItem(
        "adminNotifications",
        JSON.stringify([notif, ...existing.filter((x: any) => (x.id || x._id) !== applicationId)]),
      );
    } catch { /* ignore */ }
    setApp((a: any) => (a ? { ...a, receiptUrl: url } : a));
    setMessage({ type: "ok", text: "Receipt uploaded successfully. Our team will confirm your payment soon." });
  };

  const courseName = app?.courseName || app?.courseName || "your course";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-gray-50 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1E90FF] to-[#42A5F5] px-6 py-6 text-white">
            <h1 className="text-xl font-extrabold">Upload Payment Receipt</h1>
            <p className="text-sm opacity-90 mt-1">SkillBridge Institute of Technology</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
                <RefreshCw size={16} className="animate-spin" /> Loading application...
              </div>
            ) : !app ? (
              <div className="text-center py-10 space-y-3">
                <AlertCircle className="mx-auto text-amber-500" size={40} />
                <p className="text-gray-700 font-semibold">This application link is invalid.</p>
                <p className="text-sm text-gray-400">Make sure you opened the link from your approval email.</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-5">
                {app.receiptUrl ? (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">Receipt already uploaded</p>
                      <p className="text-xs text-emerald-600 mt-0.5">You can replace it below if you made a mistake.</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex items-center gap-3">
                    <ShieldCheck className="text-[#1E90FF] shrink-0" size={20} />
                    <p className="text-sm text-gray-700">
                      Application for <span className="font-semibold">{courseName}</span> found. Please upload your
                      bank/Telebirr receipt to confirm payment.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email you applied with
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Payment receipt (photo or PDF)
                  </label>
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={handleFile}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#1E90FF] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-600 border border-gray-200 rounded-xl px-2 py-2"
                  />
                </div>

                {preview && (
                  <div className="rounded-xl border border-gray-100 overflow-hidden">
                    <img src={preview} alt="Receipt preview" className="max-h-56 w-full object-contain bg-gray-50" />
                  </div>
                )}

                {message && (
                  <div className={message.type === "ok"
                    ? "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                    : "flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"}>
                    {message.type === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 transition-all"
                  style={{ background: "linear-gradient(90deg, #1E90FF, #42A5F5)" }}
                >
                  {uploading ? <><RefreshCw size={16} className="animate-spin" /> Uploading...</> : <><UploadCloud size={16} /> Upload Receipt</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}