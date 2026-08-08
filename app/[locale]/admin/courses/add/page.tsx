"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, CheckCircle, Loader2, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

const FALLBACK_CATEGORIES = [
  { id: "cat-1",  name: "ERP" },
  { id: "cat-2",  name: "Development" },
  { id: "cat-3",  name: "AI" },
  { id: "cat-4",  name: "Data Science" },
  { id: "cat-5",  name: "Automation" },
  { id: "cat-6",  name: "Language" },
  { id: "cat-7",  name: "Design" },
  { id: "cat-8",  name: "Mobile" },
  { id: "cat-9",  name: "Software & Programming" },
  { id: "cat-10", name: "Business" },
];

const FALLBACK_INSTRUCTORS = [
  { id: "inst-1", name: "Gedion",  email: "gedion@sbit.com" },
  { id: "inst-2", name: "Admin",   email: "admin@skillbridge.com" },
];

export default function AddCoursePage() {
  const pathname  = usePathname();
  const locale    = pathname.split("/")[1] || "en";
  const fileRef   = useRef<HTMLInputElement>(null);

  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  const [categories,  setCategories]  = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  // Image state
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    title:            "",
    categoryId:       "",
    instructorId:     "",
    priceOriginal:    "",
    priceDiscounted:  "",
    duration:         "",
    status:           "DRAFT",
    startDate:        "",
    shortDescription: "",
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm(p => ({ ...p, [field]: value }));

  // ── Load categories & instructors ────────────────────
  useEffect(() => {
    const token   = sessionStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API}/categories`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { const data = Array.isArray(d) ? d : d.data ?? []; setCategories(data.length ? data : FALLBACK_CATEGORIES); })
      .catch(() => setCategories(FALLBACK_CATEGORIES));

    fetch(`${API}/instructors`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { const data = Array.isArray(d) ? d : d.data ?? []; setInstructors(data.length ? data : FALLBACK_INSTRUCTORS); })
      .catch(() => setInstructors(FALLBACK_INSTRUCTORS));
  }, []);

  // ── Handle file pick ─────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Upload image, returns URL ─────────────────────────
  const uploadImage = async (token: string): Promise<string> => {
    if (!imageFile) return "";
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url || data.imageUrl || "";
      }
    } catch {}
    // Fallback: use base64 data URL if upload fails
    return imagePreview;
  };

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.title || !form.categoryId) {
      setError("Course Title and Category are required.");
      return;
    }
    setSaving(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");

    const imageUrl = await uploadImage(token || "");

    const payload = {
      title:            form.title,
      categoryId:       form.categoryId,
      instructorId:     form.instructorId || undefined,
      priceOriginal:    Number(form.priceOriginal) || 0,
      priceDiscounted:  Number(form.priceDiscounted) || 0,
      duration:         form.duration,
      status:           form.status,
      startDate:        form.startDate || undefined,
      shortDescription: form.shortDescription,
      imageUrl,
    };

    try {
      const res = await fetch(`${API}/courses`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `Error ${res.status}`);
      }
      setSuccess(true);
      setTimeout(() => { window.location.href = `/${locale}/admin/courses`; }, 1500);
    } catch (e: any) {
      setError(e.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add New Course" />

      <div className="flex-1 p-6 overflow-y-auto">

        {/* Back */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = `/${locale}/admin/courses`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Courses
          </button>
          <h1 className="text-xl font-bold text-gray-800">Add New Course</h1>
          <p className="text-xs text-[#1E90FF] mt-0.5">Create a new course for the platform</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl space-y-5">
          <div>
            <h2 className="font-bold text-gray-800 mb-0.5">Basic Information</h2>
            <p className="text-xs text-gray-400">Enter the details of the course</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Course Title *</label>
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="Enter course title"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select
                value={form.categoryId}
                onChange={e => set("categoryId", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instructor</label>
              <select
                value={form.instructorId}
                onChange={e => set("instructorId", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              >
                <option value="">Select Instructor</option>
                {instructors.map(i => <option key={i.id} value={i.id}>{i.name} — {i.email}</option>)}
              </select>
            </div>

            {/* Price Original */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Original Price (ETB)</label>
              <input
                type="number"
                value={form.priceOriginal}
                onChange={e => set("priceOriginal", e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Price Discounted */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Discounted Price (ETB)</label>
              <input
                type="number"
                value={form.priceDiscounted}
                onChange={e => set("priceDiscounted", e.target.value)}
                placeholder="e.g. 3500"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
              <input
                value={form.duration}
                onChange={e => set("duration", e.target.value)}
                placeholder="e.g. 8 weeks"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set("status", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => set("startDate", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
              <textarea
                rows={3}
                value={form.shortDescription}
                onChange={e => set("shortDescription", e.target.value)}
                placeholder="Brief description of the course"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
              />
            </div>

            {/* Course Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Course Image</label>

              {/* Drop zone */}
              {!imagePreview ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-[#1E90FF] hover:bg-[#1E90FF]/5 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1E90FF]/10 flex items-center justify-center">
                    <UploadCloud className="h-6 w-6 text-[#1E90FF]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  <span className="px-4 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500">
                    Browse File
                  </span>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1.5 flex items-center gap-2">
                    <ImageIcon size={12} className="text-white/70" />
                    <span className="text-xs text-white/90 truncate">{imageFile?.name}</span>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="ml-auto text-[10px] text-white/70 hover:text-white underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

          </div>

          {/* Error / Success */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Course created successfully! Redirecting...
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <button
              onClick={() => window.location.href = `/${locale}/admin/courses`}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || success}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? "Creating..." : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
