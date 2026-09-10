/**
 * Supabase-backed admin credentials. Stored in the `site_settings` table under
 * the `admin_credentials` key so the admin can change login from the Settings
 * page. Falls back to the hardcoded defaults when not stored (or offline).
 */

import { supabase } from "./supabase";

export interface AdminCredentials {
  email: string;
  password: string;
}

export const DEFAULT_ADMIN_EMAIL = "admin@skillbridge.com";
export const DEFAULT_ADMIN_PASSWORD = "Admin123!";

const KEY = "admin_credentials";

export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", KEY)
    .maybeSingle();
  if (error) {
    console.warn("Supabase admin credentials read failed:", error.message);
    return null;
  }
  const v = data?.value as AdminCredentials | null;
  return v && v.email && v.password ? v : null;
}

export async function saveAdminCredentials(creds: AdminCredentials): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("site_settings").upsert({ key: KEY, value: creds });
  if (error) {
    console.warn("Supabase admin credentials write failed:", error.message);
    return false;
  }
  return true;
}