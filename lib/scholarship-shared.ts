/**
 * Shared cloud store for scholarships + winners (jsonblob.com — free, no account,
 * CORS-enabled).
 *
 * The admin writes the full scholarships and winners lists here so public pages
 * on ANY device can read them. This makes admin adds/edits/deletes visible
 * everywhere instead of only in the admin's own browser localStorage.
 *
 * Flow:
 *   - Admin mutates a scholarship/winner -> pushSharedScholarships(...)
 *   - Public page loads                  -> syncSharedScholarshipsToLocal() then reads localStorage
 *
 * localStorage stays the fast local cache; the shared blob is the portable source.
 */

import {
  getStoredScholarships,
  saveScholarships,
  getStoredWinners,
  saveWinners,
  type StoredScholarship,
  type StoredWinner,
} from "./scholarship-store";

// Public jsonblob ID for the SkillBridge scholarships store. Recreate a blob at
// https://jsonblob.com and paste its UUID here if this one ever needs replacing.
export const SHARED_SCHOLARSHIPS_URL =
  "https://jsonblob.com/api/jsonBlob/019feda5-4a62-799c-b811-c6dfb89fd84a";

const FETCH_TIMEOUT_MS = 8000;

interface SharedPayload {
  scholarships: StoredScholarship[];
  winners: StoredWinner[];
}

async function httpJson(method: "GET" | "PUT", body?: SharedPayload): Promise<SharedPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHARED_SCHOLARSHIPS_URL, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Shared store returned ${res.status}`);
    return (await res.json()) as SharedPayload;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Write the full scholarships + winners lists to the shared cloud store.
 * Returns true on success, false if the store is unreachable.
 */
export async function pushSharedScholarships(): Promise<boolean> {
  try {
    await httpJson("PUT", {
      scholarships: getStoredScholarships(),
      winners: getStoredWinners(),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Pull the latest admin-published scholarships + winners from the shared store
 * into localStorage so existing components that read getStoredScholarships() /
 * getStoredWinners() automatically see admin changes from other devices.
 * Never throws — a failed fetch keeps local data.
 */
export async function syncSharedScholarshipsToLocal(): Promise<void> {
  try {
    const data = await httpJson("GET");
    if (Array.isArray(data.scholarships)) saveScholarships(data.scholarships);
    if (Array.isArray(data.winners)) saveWinners(data.winners);
  } catch {
    // store unreachable — keep local data as-is
  }
}
