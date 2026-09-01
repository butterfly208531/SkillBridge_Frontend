/** Runner: merges both job data files and upserts them into Supabase. */
import { SUPABASE_URL, SUPABASE_KEY, rows } from "./restore-jobs.mjs";
import jobs2 from "./restore-jobs-data2.mjs";

const allRows = [
  ...rows,
  ...jobs2.map(j => ({
    id: j.id, title: j.title, company: j.company, location: j.location,
    type: j.type, level: j.level, salary: j.salary, description: j.description,
    requirements: j.requirements, responsibilities: j.responsibilities,
    apply_url: j.applyUrl, deadline: j.deadline, status: j.status,
    posted_at: j.postedAt, category: j.category,
  })),
];

const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
  method: "POST",
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(allRows),
});

const text = await res.text();
if (!res.ok) {
  console.error(`RESTORE FAILED (${res.status}):`, text);
  process.exit(1);
}
const inserted = JSON.parse(text || "[]");
console.log(`RESTORE OK — ${inserted.length} jobs now in Supabase jobs table:`);
inserted.forEach(r => console.log(`  - ${r.id}: ${r.title} (${r.company})`));
