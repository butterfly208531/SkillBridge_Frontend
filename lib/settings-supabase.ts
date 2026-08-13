/**
 * Supabase-backed site settings store. Admin settings (site name, contact
 * email, phones, telegram, location) are stored in the `site_settings` table
 * as a JSON value so they survive across devices.
 */

import { supabase } from "./supabase";

export interface SiteSettings {
  siteName: string;
  email: string;
  phone1: string;
  phone2: string;
  telegram: string;
  location: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "SkillBridge Institute of Technology",
  email: "skillbridgeinstitituteoftech@gmail.com",
  phone1: "+251955935455",
  phone2: "+251974424372",
  telegram: "@skillbridgesupport2",
  location: "Addis Ababa, Ethiopia",
};

const SETTINGS_KEY = "site_settings";

export async function getSettingsSupabase(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();
  if (error) {
    console.warn("Supabase settings read failed:", error.message);
    return null;
  }
  return (data?.value as SiteSettings) ?? null;
}

export async function saveSettingsSupabase(settings: SiteSettings): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: SETTINGS_KEY, value: settings });
  if (error) {
    console.warn("Supabase settings write failed:", error.message);
    return false;
  }
  return true;
}
