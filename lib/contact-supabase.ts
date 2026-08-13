/**
 * Supabase-backed contact messages store. Contact form submissions are written
 * to the `contact_messages` table so the admin panel on ANY device can read
 * them — even when the backend API is down.
 */

import { supabase } from "./supabase";

export interface StoredContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "read";
  createdAt: string;
  read: boolean;
}

function mapRow(row: any): StoredContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    message: row.message ?? "",
    status: (row.status ?? "new") as "new" | "read",
    createdAt: row.created_at ?? "",
    read: row.read ?? false,
  };
}

function mapMessage(m: StoredContactMessage): any {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    message: m.message,
    status: m.status,
    created_at: m.createdAt,
    read: m.read,
  };
}

export async function getContactMessagesSupabase(): Promise<StoredContactMessage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("Supabase contact messages read failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function addContactMessageSupabase(msg: StoredContactMessage): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("contact_messages").upsert(mapMessage(msg));
  if (error) {
    console.warn("Supabase contact message write failed:", error.message);
    return false;
  }
  return true;
}

export async function updateContactMessageSupabase(
  id: string,
  updates: Partial<Pick<StoredContactMessage, "status" | "read">>,
): Promise<boolean> {
  if (!supabase) return false;
  const row: any = {};
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.read !== undefined) row.read = updates.read;
  const { error } = await supabase.from("contact_messages").update(row).eq("id", id);
  if (error) {
    console.warn("Supabase contact message update failed:", error.message);
    return false;
  }
  return true;
}

export async function deleteContactMessageSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) {
    console.warn("Supabase contact message delete failed:", error.message);
    return false;
  }
  return true;
}
