"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, CheckCircle, Loader2, Upload, X } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { uploadImage } from "@/lib/uploadImage";
import { getAllCategories } from "@/lib/courses-config";
import { addCourse } from "@/lib/courses-store";

export default function AddCoursePage() {
  const pathname = usePathname();
  const locale   = pathname.split("/")[1] || "en";

  const [saving, setSaving]               = useState(false);
  const [success, setSuccess]             = useState(false);
  const [error, setError]                 = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Pre-populate with local categories so the dropdown is never empty
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    () => (getAllCategories().filter((name): name is string => name !== undefined)).map(name => ({ id: name, name }))
  );

  const [basic, setBasic] = useState({
    title:            "",
    categoryId:       "",
    priceOriginal:    "",
    priceDiscounted:  "",
    duration:         "",
    status:           "PUBLISHED",
    shortDescription: "",
    imageUrl:         "",
    startDate:        "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load categories (API preferred, local fallback already in state) ──
  useEffect(() => {
    const load = async () => {
      const api = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";
      const token = typeof window !== "undefined" ? (sessionStorage.getItem("adminToken") || "") : "";
      const endpoints = [
        `${api}/categories`,
        `${api}/categories/navbar`,
        `${api}/course-categories`,
      ];
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const d    = await res.json();
            const data = Array.isArray(d) ? d : d.data ?? [];
            if (data.length > 0) { setCategories(data); return; }
          }
        } catch {}
      }
      // API failed — local fallback already set in useState initializer
    };
    load();
  }, []);

  // ── Image Upload via Cloudinary ──────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WEBP, or GIF)"); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB"); return;
    }

    setUploadingImage(true);
    setUploadProgress(0);
    setError("");

    try {
      const { url } = await uploadImage(file, "courses", (pct) => setUploadProgress(pct));
      setBasic(p => ({ ...p, imageUrl: url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Submit — saves to localStorage store ────────────────
  const handleSubmit = () => {
    if (!basic.title.trim()) { setError("Course title is required"); return; }
    if (!basic.categoryId)   { setError("Please select a category");  return; }

    setSaving(true);
    setError("");

    try {
      const selectedCat = categories.find(c => c.id === basic.categoryId);
      addCourse({
        title:            basic.title.trim(),
        duration:         basic.duration || "—",
        category:         selectedCat?.name || basic.categoryId,
        categoryId:       basic.categoryId,
        status:           basic.status === "PUBLISHED" ? "active" : "draft",
        imageUrl:         basic.imageUrl || "",
        rating:           0,
        shortDescription: basic.shortDescription || "",
        priceOriginal:    Number(basic.priceOriginal)  || 0,
        priceDiscounted:  Number(basic.priceDiscounted) || 0,
        startDate:        basic.startDate || "",
      });
      setSuccess(true);
      setTimeout(() => window.location.href = `/${locale}/admin/courses`, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create course. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add New Course" />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Back + title */}
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 max-w-3xl">
          <div>
            <h2 className="font-bold text-gray-800 mb-0.5">Basic Information</h2>
            <p className="text-xs text-gray-400">Enter the basic details of the course</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Course Title *</label>
              <input
                value={basic.title}
                onChange={e => setBasic(p => ({ ...p, title: e.target.value }))}
                placeholder="Enter course title"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select
                value={basic.categoryId}
                onChange={e => setBasic(p => ({ ...p, categoryId: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">One-time Price (ETB)</label>
              <input
                type="number" step="0.01"
                value={basic.priceOriginal}
                onChange={e => setBasic(p => ({ ...p, priceOriginal: e.target.value }))}
                placeholder="99.99"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Discounted Price */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Subscription (ETB)</label>
              <input
                type="number" step="0.01"
                value={basic.priceDiscounted}
                onChange={e => setBasic(p => ({ ...p, priceDiscounted: e.target.value }))}
                placeholder="79.99"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
              <input
                value={basic.duration}
                onChange={e => setBasic(p => ({ ...p, duration: e.target.value }))}
                placeholder="e.g. 8 weeks"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={basic.status}
                onChange={e => setBasic(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              >
                <option value="PUBLISHED">Published (Active)</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={basic.startDate}
                onChange={e => setBasic(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
              <textarea
                rows={3}
                value={basic.shortDescription}
                onChange={e => setBasic(p => ({ ...p, shortDescription: e.target.value }))}
                placeholder="Brief description of the course"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Course Image</label>

              {basic.imageUrl ? (
                <div className="relative inline-block">
                  <img
                    src={basic.imageUrl}
                    alt="Course preview"
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; setError("Failed to load image."); }}
                  />
                  <button
                    onClick={() => setBasic(p => ({ ...p, imageUrl: "" }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1E90FF] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="animate-spin text-[#1E90FF]" />
                      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1E90FF] rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Uploading... {uploadProgress}%</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP, GIF (max 5 MB)</p>
                    </div>
                  )}
                </div>
              )}

              {!basic.imageUrl && !uploadingImage && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Or paste image URL:</p>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={basic.imageUrl}
                    onChange={e => setBasic(p => ({ ...p, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Course created successfully! Redirecting...
            </div>
          )}

          <div className="flex justify-end pt-2 gap-3">
            <button
              onClick={() => window.location.href = `/${locale}/admin/courses`}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || success || uploadingImage}
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
