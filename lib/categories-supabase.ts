/**
 * Supabase-backed categories store — best-effort cross-device sync.
 *
 * The `categories` table may not exist yet (create it with the SQL below in the
 * Supabase SQL editor). Until then, everything is handled by the localStorage
 * store and these helpers silently no-op.
 *
 * CREATE TABLE public.categories (
 *   id          text PRIMARY KEY,
 *   name        text NOT NULL,
 *   color       text,
 *   description text,
 *   created_at  timestamptz DEFAULT now()
 * );
 * ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "anon all" ON public.categories FOR ALL USING (true) WITH CHECK (true);
 */

import { supabase } from "./supabase";
import type { StoredCategory } from "./categories-store";

interface CategoryRow {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  created_at: string | null;
}

function mapRow(row: CategoryRow): StoredCategory {
  return {
    id: row.id,
    name: row.name,
    color: row.color ?? "",
    description: row.description ?? "",
    createdAt: row.created_at ?? "",
  };
}

/** Read all categories from Supabase. Returns [] if the table isn't set up. */
export async function getCategoriesSupabase(): Promise<StoredCategory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) {
    console.warn("Supabase categories read failed:", error.message);
    return [];
  }
  return (data ?? []).map((row) => mapRow(row as CategoryRow));
}

/** Replace the FULL categories list in Supabase (authoritative). */
export async function pushCategoriesSupabase(categories: StoredCategory[]): Promise<boolean> {
  if (!supabase) return false;
  const { error: delErr } = await supabase.from("categories").delete().neq("id", "~~noop~~");
  if (delErr) {
    console.warn("Supabase categories clear failed:", delErr.message);
    return false;
  }
  if (categories.length === 0) return true;
  const { error } = await supabase.from("categories").upsert(
    categories.map(c => ({
      id: c.id,
      name: c.name,
      color: c.color,
      description: c.description,
      created_at: c.createdAt || null,
    }))
  );
  if (error) {
    console.warn("Supabase categories write failed:", error.message);
    return false;
  }
  return true;
}
