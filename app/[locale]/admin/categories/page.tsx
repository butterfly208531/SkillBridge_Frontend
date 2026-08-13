"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, Tag, BookOpen, Loader2 } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";
import {
  getStoredCategories,
  saveCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  CATEGORY_COLORS,
  categoryColorClass,
  type StoredCategory,
} from "@/lib/categories-store";
import { pushCategoriesSupabase, getCategoriesSupabase } from "@/lib/categories-supabase";
import { getStoredCourses } from "@/lib/courses-store";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<StoredCategory[]>(() => getStoredCategories());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StoredCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const courseCount = (catName: string) =>
    getStoredCourses().filter(c => c.category === catName).length;

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Load: localStorage first (instant), then best-effort Supabase merge.
  const loadCategories = async () => {
    const local = getStoredCategories();
    setCategories(local);

    const remote = await getCategoriesSupabase();
    if (remote.length > 0) {
      // Merge: remote wins for existing ids, keep any local-only (offline) ones.
      const map = new Map(local.map(c => [c.id, c]));
      remote.forEach(c => map.set(c.id, c));
      const merged = Array.from(map.values());
      saveCategories(merged);
      setCategories(merged);
    }
    setLoading(false);
  };

  useEffect(() => { loadCategories(); }, []);

  // ── mutations ──
  const persist = (next: StoredCategory[]) => {
    saveCategories(next);
    setCategories(next);
    setSyncing(true);
    pushCategoriesSupabase(next)
      .then(() => {})
      .catch(() => {})
      .finally(() => setSyncing(false));
  };

  const handleSave = (input: { name: string; color: string; description: string }) => {
    setError("");
    if (!input.name.trim()) { setError("Category name is required"); return; }
    setSaving(true);

    const nameExists = (id: string) =>
      categories.some(c => c.id !== id && c.name.toLowerCase() === input.name.trim().toLowerCase());
    if (nameExists(editing?.id ?? "")) {
      setError("A category with this name already exists");
      setSaving(false);
      return;
    }

    if (editing) {
      updateCategory(editing.id, { name: input.name, color: input.color, description: input.description });
      persist(getStoredCategories());
      flash("Category updated");
    } else {
      addCategory({ name: input.name, color: input.color, description: input.description });
      persist(getStoredCategories());
      flash("Category created");
    }
    setSaving(false);
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    persist(getStoredCategories());
    setDeleteId(null);
    flash("Category deleted");
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Categories" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Tag size={15} className="text-[#1E90FF]" />
            <span>
              <strong className="text-gray-800">{categories.length}</strong> categories
            </span>
            {syncing && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> syncing</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadCategories}
              title="Refresh"
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm">{error}</div>
        )}
        {success && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-sm">{success}</div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading categories...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Category</th>
                    <th className="px-5 py-3 text-left font-semibold">Description</th>
                    <th className="px-5 py-3 text-left font-semibold">Courses</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold", categoryColorClass[cat.color] ?? "bg-gray-100 text-gray-500")}>
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{cat.id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[280px] truncate">{cat.description || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <BookOpen size={12} className="text-[#1E90FF]" /> {courseCount(cat.name)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setEditing(cat); setShowModal(true); }}
                            className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(cat.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm">No categories yet — click &quot;Add Category&quot; to create one.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <CategoryModal
          category={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
          saving={saving}
          modalError={error}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Category?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Courses assigned to this category will keep their current badge but will no longer appear in the category dropdown.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add / Edit modal ──────────────────────────────────────────────────────
function CategoryModal({ category, onClose, onSave, saving, modalError }: {
  category: StoredCategory | null;
  onClose: () => void;
  onSave: (input: { name: string; color: string; description: string }) => void;
  saving: boolean;
  modalError: string;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0]);
  const [description, setDescription] = useState(category?.description ?? "");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-4">
        <h3 className="font-bold text-gray-800">{category ? "Edit Category" : "Add Category"}</h3>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Data Science"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Badge Color</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all",
                  categoryColorClass[c],
                  color === c ? "ring-2 ring-offset-1 ring-gray-400" : "opacity-70 hover:opacity-100"
                )}
              >
                {name.trim() || c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description of this category…"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
          />
        </div>

        {modalError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{modalError}</p>}

        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onSave({ name, color, description })}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {category ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
