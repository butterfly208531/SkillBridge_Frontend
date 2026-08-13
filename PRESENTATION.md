# SkillBridge Institute of Technology — Platform Presentation Documentation

> **Full documentation for presenting the SkillBridge education platform.**
> Live site: **https://skillbridgeiot.vercel.app**

---

## 1. Project Overview

**SkillBridge Institute of Technology (SBIT)** is a full-stack web platform for a technology
education institute based in Addis Ababa, Ethiopia. The platform showcases the institute's
bootcamps and courses, processes student applications, manages scholarships, jobs, projects,
community engagement, and contact messages — all through a modern, bilingual, mobile-friendly
website with a complete admin dashboard.

**Tagline:** *Bridging Gaps, Building Skills, Transforming Futures.*

---

## 2. Problem Statement

- Traditional education in the region relies on outdated teaching methods with limited practical
  exposure.
- Students struggle to find hands-on, industry-relevant training.
- The institute's information, course catalog, applications, scholarships, and announcements were
  previously scattered, hard to update, and unavailable in a single public portal.
- Admin staff could not easily publish courses, jobs, scholarships, or track applications from any
  device.

---

## 3. Objectives

| Objective | Outcome |
|---|---|
| Public presence | A modern website that introduces the institute, its courses, and services |
| Course catalog | 15 bootcamps with details, pricing, learning outcomes, and application forms |
| Application management | Online course application with status tracking |
| Admin control | Admin panel to add/edit/delete courses, jobs, scholarships, projects, community stats, and site settings |
| Multi-device data | All admin data stored in the cloud (Supabase) so it appears on every device |
| Bilingual | Full English and Amharic (አማርኛ) support |
| Career services | Scholarships, job announcements, and student project showcases |

---

## 4. Scope

### Public Website
- Homepage (hero, stats, services, courses, bootcamps, projects, jobs, community, FAQ, contact)
- Courses / Bootcamps listing + detailed course pages
- Course application form
- About Us (story, mission, vision, methodology)
- Career Services page
- Jobs announcements page
- Scholarships page (with previous winners)
- Projects showcase
- Contact page
- Profile & My Courses (user accounts)
- English ⇄ Amharic language switch, dark/light theme, fully responsive

### Admin Panel (`/admin`)
- Dashboard (stats: applications, courses, scholarships, jobs)
- Courses management (add/edit/delete/reorder)
- Jobs management (add/edit/delete)
- Scholarships & winners management
- Projects management
- Community stats/links management
- Applications inbox (change status, delete)
- Contact messages inbox (mark read, delete)
- Site settings (site name, contact email, phones, Telegram, location)

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4, framer-motion, lucide-react, embla carousel |
| i18n | next-intl (English + Amharic) |
| Data storage | Supabase (PostgreSQL, REST + RLS) |
| Backend API | Node/Express on Render (currently optional; Supabase is primary) |
| Auth | NextAuth + Firebase + localStorage session |
| Deployment | Vercel (frontend) |
| Package manager | npm |
| Other | axios, react-hot-toast, Radix UI, react-icons, next-themes |

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS (Browser)                        │
│   Public visitors ──────────────── Admin staff              │
└───────────────┬──────────────────────────┬──────────────────┘
                │                          │
┌───────────────▼──────────────────────────▼──────────────────┐
│                  NEXT.JS FRONTEND (Vercel)                  │
│  Next.js 15 App Router • React 19 • Tailwind v4             │
│  next-intl (EN/AM) • Admin dashboard • Public pages          │
└───────────────┬──────────────────────────┬──────────────────┘
                │                          │
                │ Supabase (primary)       │ Legacy API (optional)
┌───────────────▼────────────────┐  ┌──────▼───────────────────┐
│    SUPABASE (PostgreSQL)       │  │  Backend API (Render)    │
│  10 tables + Row Level Security│  │  /api (currently down)   │
└────────────────────────────────┘  └──────────────────────────┘
```

**Data flow:**
- **Admin writes** → saved to localStorage (fast cache) **and** pushed to Supabase tables.
- **Public pages load** → sync the latest published data from Supabase into localStorage → render.
- **Application/contact forms** → inserted into Supabase tables + localStorage fallback.
- If Supabase is unreachable, the built-in seed data guarantees the site is never empty.

---

## 7. Database Design (Supabase — 10 Tables)

All tables are protected by **Row Level Security (RLS)** policies.

| Table | Purpose | Key fields |
|---|---|---|
| `courses` | Course catalog (admin-managed; 15 seed bootcamps) | id, title, category, status, price, priority, image, learning outcomes |
| `jobs` | Job announcements | id, title, company, type, level, salary, deadline, status |
| `scholarships` | Scholarship programs | id, name, course, funding type, amount, deadline, status |
| `scholarship_winners` | Past scholarship winners | id, name, scholarship, year, status |
| `projects` | Student project showcase | id, title, technologies, category, links, priority |
| `community_stats` | Community platform stats/links | key, stats value, suffix, url |
| `applications` | Course applications | id, full name, email, phone, course, status, submitted date |
| `contact_messages` | Contact form messages | id, name, email, phone, message, status, read |
| `site_settings` | Admin-configurable site settings | key, value (JSON) |

---

## 8. Course Catalog (Fully Admin-Manageable)

The course catalog is **not fixed** — it is a dynamic list managed entirely from the admin
panel. The admin can **add new courses, edit existing ones, delete courses, change status
(active/draft), upload images, set prices, and reorder** the display priority. Every change is
published to the cloud (Supabase) and appears on all public pages and devices after refresh.

The site ships with **15 seed bootcamps** as the initial content / offline fallback — they can be
edited, hidden, deleted, or expanded with unlimited new courses by the admin.

| Course (seed content) | Category | Level |
|---|---|---|
| Odoo Technical | ERP | Intermediate |
| Odoo Functional | ERP | Beginner |
| Full-Stack Web Development | Development | Beginner–Intermediate |
| n8n Automation Bootcamp | Automation | Intermediate |
| Frontend Fundamentals | Development | Beginner |
| Backend Development | Development | Intermediate |
| Data Science & Machine Learning | Data / AI | Intermediate |
| Python Programming | Programming | Beginner |
| Flutter (Mobile App Development) | Mobile | Intermediate |
| Cybersecurity | Security | Intermediate |
| Accounting (Peachtree, Excel, QuickBooks) | Business | Beginner |
| Digital Marketing | Marketing | Beginner |
| Basic Computer Skills | Fundamentals | Beginner |
| IELTS, TOEFL & Duolingo Preparation | Language | All levels |
| Microsoft Office 365 | Productivity | Beginner |

> **Demo tip:** In the admin panel, click **"Add Course"**, fill in a new bootcamp, save, then
> refresh the public `/courses` page — the new course appears automatically on every device.

---

## 9. Admin Panel Modules (`/admin`)

| Module | Functions |
|---|---|
| Dashboard | Live counts of applications, active courses, scholarships, jobs |
| Courses | Add, edit, delete, toggle status, upload image, set prices, reorder priority, publish to all devices |
| Jobs | Add, edit, delete, publish |
| Scholarships | Add, edit, delete scholarships + winners |
| Projects | Add, edit, delete student projects |
| Community | Edit platform stats and links |
| Applications | View all applications (from all devices), change status, delete |
| Contact | Read and manage contact messages |
| Settings | Site name, contact email, phones, Telegram, location |

---

## 10. Key Features

- ✅ **Fully admin-manageable catalog** — add/edit/delete/reorder courses, jobs, scholarships, projects anytime from the admin panel; changes sync to all devices.
- ✅ **Cloud-synced admin data** — changes made on any device appear everywhere via Supabase.
- ✅ **Bilingual (EN/AM)** — one click switches the entire site language.
- ✅ **Dark/Light theme** toggle.
- ✅ **Fully responsive** — mobile, tablet, desktop.
- ✅ **Online course application** form with validation and receipt tracking.
- ✅ **Contact form** that stores messages for the admin.
- ✅ **Animated, modern UI** (framer-motion, count-up stats, card designs).
- ✅ **Search & filters** on courses and jobs.
- ✅ **Built-in seed courses** — 15 default bootcamps guarantee the site is never empty (fully editable by the admin).

---

## 11. Deployment & Hosting

| Service | Role |
|---|---|
| **Vercel** | Hosts the Next.js frontend at `https://skillbridgeiot.vercel.app` |
| **Supabase** | Cloud database (PostgreSQL) with RLS — stores all admin data |
| **Render** | Optional backend API (currently inactive) |

**Environment variables (Vercel):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- Cloudinary, YouTube API keys
- `VERCEL_OIDC_TOKEN`

---

## 12. Security Considerations

- Supabase **Row Level Security (RLS)** enabled on all tables.
- Only the **publishable/anon** key is exposed to the browser — the **secret key is never** committed or sent to the client.
- Secrets live only in server-side environment variables.
- No hardcoded API keys in the codebase.

---

## 13. Challenges Solved

1. **Data disappearing / reappearing**
   - Old design used a free cloud store (jsonblob) where a stale overwrite wiped data.
   - Fixed by switching to Supabase with an authoritative "full-list replace" sync: admin
     deletions are truly deleted, and empty lists stay empty on every device.
2. **Admin data only visible on one device**
   - Solved with a shared Supabase store — public pages pull the latest published data.
3. **Empty site during downtime**
   - Built-in seed courses guarantee the catalog always renders.
4. **Backend API downtime**
   - Supabase + localStorage fallbacks keep every section functional even when the API is down.
5. **Local build failures**
   - Deployments are built and verified on Vercel directly.

---

## 14. Future Enhancements

- Online payments for course registration.
- Student authentication & progress tracking (enrollments, certificates).
- Real-time notifications for new applications/messages.
- Automated email notifications.
- Analytics dashboard (visitors, conversions).
- Mobile application (Flutter).

---

## 15. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=https://iiqmjillefmnidyrcsdy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>
NEXT_PUBLIC_API_BASE_URL=https://skillbridge-backend2.onrender.com/api

# 3. Start the development server (port 5000)
npm run dev
# Open http://localhost:5000
```

---

## 16. Suggested Presentation / Demo Flow

1. **Intro** — Who SkillBridge is (About page story, mission, vision).
2. **Homepage** — Hero, stats, services, courses, bootcamps, community section.
3. **Course catalog** — Show the admin-managed bootcamps, open a course detail page, then the application form.
4. **Bilingual & theme** — Switch English ⇄ Amharic; toggle dark mode; resize to show responsiveness.
5. **Admin demo** — Log in to `/admin`:
   - Dashboard stats
   - Add/edit a course or add a job → show it appears on the public page after refresh
   - Applications & contact inbox
   - Settings page (save site settings)
6. **Tech talk** — Architecture, Supabase tables, RLS security, Vercel deployment.
7. **Wrap up** — Challenges solved and future roadmap.

---

*Documentation prepared for the SkillBridge Institute of Technology platform presentation.*
