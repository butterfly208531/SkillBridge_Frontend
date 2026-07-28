# Design Document

## Feature: SkillBridge Homepage Redesign

---

## Overview

This document covers the technical design for the full homepage redesign of SkillBridge Institute of Technology, plus two additional pages: a new Projects Page and an updated Bootcamps Page. The redesign transforms the existing single-page layout (Hero → Services → Courses → Instructors → Testimonials → Success) into a richer, conversion-focused homepage with twelve sections, two new pages, and substantial new component and i18n work.

The implementation targets the existing Next.js 15 + TypeScript + Tailwind CSS stack with next-intl (en/am), Framer Motion animations, next-themes dark mode, and a backend REST API accessed via `lib/apI.ts`.

**Key design goals:**
- Reuse existing UI primitives (`AnimatedCard`, `SectionHeading`, `Carousel`, `Tabs`, `Badge`, `Button`, `Card`, `CountUp`)
- Match existing code patterns: config-driven static data under `lib/`, translations under `messages/`, API calls in `useEffect` with `useState`
- Every section falls back to static config when the API is unavailable
- All new user-visible text added to `messages/en.json` and `messages/am.json`

---

## Architecture

### Page and Component Hierarchy

```
app/[locale]/
├── page.tsx                          ← Redesigned homepage
├── courses/page.tsx                  ← Updated Bootcamps Page
├── projects/
│   └── page.tsx                      ← New Projects Page
└── components/
    ├── hero-section.tsx              ← Updated
    ├── bootcamps-section.tsx         ← New (replaces courses-section.tsx)
    ├── learning-paths-section.tsx    ← New
    ├── why-section.tsx               ← New
    ├── projects-section.tsx          ← New
    ├── hub-section.tsx               ← New
    ├── scholarships-section.tsx      ← New
    ├── success-section.tsx           ← Updated (Testimonial_Cards with course + position)
    ├── career-section.tsx            ← New
    ├── community-section.tsx         ← New
    ├── videos-section.tsx            ← New
    ├── final-cta-section.tsx         ← New
    └── ui/
        ├── bootcamp-card.tsx         ← New reusable card
        ├── project-card.tsx          ← New reusable card
        ├── scholarship-card.tsx      ← New reusable card
        └── skeleton-card.tsx         ← New loading skeleton
```

### Data Flow

```
API (lib/apI.ts)
    │
    ▼
Section Component (useEffect + useState)
    │
    ├── loading → SkeletonCard placeholder
    ├── error   → Static Config fallback (lib/*-config.tsx)
    └── success → Render cards with fetched data
```

Static config files mirror the API shape so the fallback is a transparent swap.

---

## Components and Interfaces

### Updated `HeroSection`

Replaces the current headline with a new one from i18n and extends the stat cards from 3 to 5.

```typescript
// messages/en.json additions under "hero"
{
  "hero": {
    "headline": "Launch Your Career in Technology with Practical, Industry-Focused Training",
    "subtitle": "Master software development, ERP, AI, automation, and language proficiency with hands-on bootcamps built around real industry demands.",
    "registerNow": "Register Now",
    "exploreBootcamps": "Explore Bootcamps",
    "statCards": [
      { "title": "Students Trained",       "value": "500+" },
      { "title": "Active Bootcamps",        "value": "5+"   },
      { "title": "Real Projects Completed", "value": "50+"  },
      { "title": "Community Members",       "value": "1000+"},
      { "title": "Scholarships Awarded",    "value": "20+"  }
    ]
  }
}
```

### New `BootcampsSection` (homepage)

Fetches from `/api/courses/landing`, shows top 6 cards in a responsive grid, with "View All Bootcamps" CTA.

**Props:** none — self-contained with internal state.

**State:**
```typescript
const [bootcamps, setBootcamps]   = useState<Course[]>([])
const [loading, setLoading]       = useState(true)
```

**Fallback:** `lib/courses-config.tsx` merged with static message data.

### New `BootcampCard` component

```typescript
interface BootcampCardProps {
  id: string
  image: string
  title: string
  description: string
  duration: string
  startDate: string
  mode: string        // "Online" | "Physical" | "Hybrid"
  level: string
  category: string
  rating: number
  reviews: number
}
```

### New `LearningPathsSection`

Four static path cards sourced entirely from i18n. No API call needed.

```typescript
interface LearningPathStep {
  label: string
  description: string
}

interface LearningPath {
  id: string
  title: string
  outcome: string
  icon: string          // lucide icon name
  steps: LearningPathStep[]
}
```

Defined in `lib/learning-paths-config.ts` with keys; translated values in `messages/*.json`.

### New `WhySection`

Twelve feature cards. Defined in `lib/why-config.ts` (icon + i18n key), translated in messages files.

```typescript
interface WhyFeature {
  key: string
  icon: LucideIcon
}
```

### New `ProjectsSection` (homepage) and `ProjectsPage`

Both share the `ProjectCard` component and the same filtering logic.

```typescript
interface Project {
  id: string
  title: string
  image: string
  technologies: string[]
  description: string
  category: "ERP" | "Web Development" | "AI" | "Automation" | "Python" | "Mobile"
  studentName?: string
  demoUrl?: string
  githubUrl?: string
}
```

Static config: `lib/projects-config.ts`.

Filter state:
```typescript
const [activeCategory, setActiveCategory] = useState<string>("All")
```

Filtered list derived synchronously — no API call, no page reload.

### New `HubSection`

Fully static, sourced from i18n. Renders a feature list (10 items) and two CTA buttons.

### New `ScholarshipsSection`

```typescript
interface Scholarship {
  id: string
  name: string
  courseId: string
  applicationsCount: number
  deadline: string           // ISO date string
  winnersCount: number
  eligibility: string
}
```

Static config: `lib/scholarships-config.ts`. Winners gallery sourced from a separate static array.

### Updated `SuccessSection` (Testimonials)

Extends `TestimonialConfig` and translation shape to include `course` and `position` fields.

```typescript
interface TestimonialConfig {
  key: string
  image: string
}
// Translation addition per key:
// { name, title (position), course, testimonial }
```

### New `CareerSection`

Ten service items from `lib/career-config.ts` + i18n. "Book Career Guidance" CTA → `/contact`.

### New `CommunitySection`

Five platform entries. External URLs stored in `lib/community-config.ts`.

```typescript
interface CommunityPlatform {
  key: string           // "telegram" | "youtube" | "linkedin" | "hub" | "discussions"
  url: string
  icon: LucideIcon | ReactNode
  ctaKey?: string       // i18n key for CTA button label
}
```

### New `VideosSection`

```typescript
interface VideoCard {
  id: string
  thumbnail: string
  title: string
  duration: string
  publishDate: string
  description: string
  url: string           // YouTube URL
}
```

Static config: `lib/videos-config.ts`. Rendered in a `Carousel` (existing component), 1 card/slide on mobile, 2+ on tablet/desktop.

### New `FinalCTASection`

Fully static, sourced from i18n. Three buttons: "Register for a Bootcamp" → `/courses`, "Contact Admissions" → `/contact`, "Explore All Programs" → `/courses`.

---

## Data Models

### Extended API shape (from `lib/apI.ts` `Course`)

The existing `Course` interface in `lib/apI.ts` already captures most needed fields. Two additions needed:

```typescript
// Additions to existing Course interface
mode?: string           // learning mode: "Online" | "Physical" | "Hybrid"
startDate: string       // already present in API but not on interface
```

### New static config interfaces

```typescript
// lib/projects-config.ts
export interface ProjectConfig {
  id: string
  image: string
  technologies: string[]
  category: "ERP" | "Web Development" | "AI" | "Automation" | "Python" | "Mobile"
  studentName?: string
  demoUrl?: string
  githubUrl?: string
}

// lib/scholarships-config.ts
export interface ScholarshipConfig {
  id: string
  courseId: string
  applicationsCount: number
  deadline: string
  winnersCount: number
}
// i18n provides: name, eligibility

// lib/videos-config.ts
export interface VideoConfig {
  id: string
  thumbnail: string
  duration: string
  publishDate: string
  url: string
}
// i18n provides: title, description

// lib/community-config.ts
export interface CommunityConfig {
  key: string
  url: string
}

// lib/learning-paths-config.ts
export interface LearningPathConfig {
  id: string
  icon: LucideIcon
  steps: number    // count of steps, labels come from i18n
}
```

### i18n message structure additions

New top-level keys added to `messages/en.json` (and mirrored in `messages/am.json`):

```
hero                  → updated (new headline, subtitle, 5 stat cards, new CTA labels)
bootcampsSection      → section heading + "View All Bootcamps" label
learningPaths         → section heading + 4 path objects (title, outcome, steps[])
whySection            → section heading + 12 feature objects (title, description)
projectsSection       → section heading + filter labels + "View More Projects"
hubSection            → section heading + feature list (10 items) + CTA labels
scholarshipsSection   → section heading + field labels (Applications, Deadline, Winners, Eligibility)
successSection        → section heading (updated) + testimonial objects with course + position fields
careerSection         → section heading + 10 service objects (title, description) + CTA label
communitySection      → section heading + platform labels + CTA button labels
videosSection         → section heading + video objects (title, description) + "View All Videos"
finalCTA              → headline + description + 3 button labels
projectsPage          → page heading + subtitle
bootcampsPage         → already largely covered by existing coursePage keys; add mode label
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: i18n text rendering

*For any* locale (`en` or `am`) and any section component that sources text from `next-intl`, every user-visible string rendered by that component should equal the value stored in the corresponding `messages/{locale}.json` key.

**Validates: Requirements 1.1, 1.2, 1.5, 3.4, 6.5, 10.4, 12.1, 12.2, 16.1, 16.2, 16.3, 16.4**

---

### Property 2: Bootcamp card renders all required fields

*For any* bootcamp object with valid fields (id, image, title, description, duration, startDate, mode, level, category, rating, reviews), the rendered `BootcampCard` component should include the course image, title, description, duration, start date, mode, level, and a Register button whose `href` equals `/courses/{id}/ApplicationForm`.

**Validates: Requirements 2.2, 2.3, 13.5, 13.6**

---

### Property 3: Project card renders all required fields

*For any* project object with valid fields, the rendered `ProjectCard` should include the project image, technologies list, description, category badge, and — when present — the student name and demo/GitHub links.

**Validates: Requirements 5.2, 14.3**

---

### Property 4: Testimonial card renders all required fields

*For any* testimonial object with valid fields (photo, name, course, position/title, feedback), the rendered `TestimonialCard` should include all five of those fields.

**Validates: Requirements 8.2**

---

### Property 5: Video card renders all required fields

*For any* video object with valid fields (thumbnail, title, duration, publishDate, description, url), the rendered video card should include all six fields and a Watch button whose `href` equals the video url.

**Validates: Requirements 11.1, 11.2**

---

### Property 6: Category filter shows only matching items

*For any* list of items (projects or bootcamps) and any selected category (other than "All"), the set of rendered cards should contain only items whose `category` matches the selected filter, and no items from any other category.

**Validates: Requirements 5.3, 5.4, 13.2, 14.2, 14.5**

---

### Property 7: Search filter shows only matching bootcamps

*For any* list of bootcamps and any non-empty search query, the set of rendered cards should contain only bootcamps whose `title` or `description` contains the query string (case-insensitive), and no bootcamps that do not match.

**Validates: Requirements 13.3**

---

### Property 8: Sort by popularity produces non-increasing reviews order

*For any* list of bootcamps sorted by "Most Popular", each bootcamp in the resulting list should have a `reviews` count greater than or equal to the `reviews` count of every bootcamp that follows it.

**Validates: Requirements 13.4**

---

### Property 9: Sort by newest produces non-increasing date order

*For any* list of bootcamps sorted by "Newest", each bootcamp's `createdAt` date should be greater than or equal to the `createdAt` date of every bootcamp that follows it.

**Validates: Requirements 13.4**

---

### Property 10: Feature/service card renders required fields

*For any* feature or service config item with an associated i18n translation, the rendered card should include the item's icon, translated title, and translated description.

**Validates: Requirements 4.2, 9.2**

---

### Property 11: API failure triggers static config fallback

*For any* section component that fetches from the API, when the API call rejects, the rendered output should be equivalent to rendering the section with the corresponding static config data (i.e., all static config items appear as cards).

**Validates: Requirements 2.5, 11.4**

---

## Error Handling

**API failures:** Each section using the API wraps the `fetchCourses()` / `fetchProjects()` call in a `try/catch`. On catch, the component sets a local `error` state and falls back to static config. Only the Bootcamps_Page shows an explicit error message + Retry button (per Requirement 13.7); homepage sections silently fall back to config data to avoid a degraded-looking page.

**Missing i18n keys:** `next-intl` throws at build time for missing keys when `onError: 'warn'` is configured. All new keys must be added to both `messages/en.json` and `messages/am.json` before shipping.

**Missing images:** Every `<img>` and `<Image>` receives a descriptive `alt` attribute. Broken images show alt text. Course/project images that are missing from static config fall back to a placeholder path.

**Empty states:**
- Projects_Page with no matching filter → "No projects found" message (Requirement 14.6)
- Bootcamps_Page with no search results → existing `coursePage.noCourse` key
- Videos_Section with no data → static fallback list (Requirement 11.4)

**Loading states:** All API-driven sections show `SkeletonCard` placeholders during the loading phase. The skeleton card matches the visual dimensions of the real card to prevent layout shift.

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:

- **Unit tests** verify specific examples, error paths, and integration between hooks and components.
- **Property tests** verify the universal correctness properties defined above across a large space of generated inputs.

### Property-Based Testing

**Library:** [fast-check](https://fast-check.dev/) — the standard PBT library for TypeScript/JavaScript projects.

Each correctness property listed above must be implemented as a single fast-check property test. Tests should run with a minimum of **100 iterations** (`numRuns: 100`).

Tag format for each test:
```
// Feature: skillbridge-homepage-redesign, Property {N}: {property_text}
```

Example test structure:

```typescript
import fc from "fast-check"

// Feature: skillbridge-homepage-redesign, Property 6: Category filter shows only matching items
it("category filter shows only matching items", () => {
  fc.assert(
    fc.property(
      fc.array(arbitraryProject()),
      fc.constantFrom("ERP", "Web Development", "AI", "Automation", "Python", "Mobile"),
      (projects, category) => {
        const filtered = filterByCategory(projects, category)
        return filtered.every(p => p.category === category)
      }
    ),
    { numRuns: 100 }
  )
})
```

Property tests map directly to Properties 1–11:

| Property | Test focus |
|---|---|
| P1 | i18n key lookup returns matching string for en and am locales |
| P2 | BootcampCard rendered HTML contains all required field values |
| P3 | ProjectCard rendered HTML contains all required field values |
| P4 | TestimonialCard rendered HTML contains all required field values |
| P5 | VideoCard rendered HTML contains all required field values |
| P6 | `filterByCategory(items, cat)` returns only items where `item.category === cat` |
| P7 | `filterBySearch(bootcamps, query)` returns only items matching query in title/description |
| P8 | `sortByPopularity(bootcamps)` returns list in non-increasing reviews order |
| P9 | `sortByNewest(bootcamps)` returns list in non-increasing createdAt order |
| P10 | Feature card rendered HTML contains icon, translated title, translated description |
| P11 | Section with mocked API rejection renders static config items |

### Unit Tests

Unit tests use **Vitest** + **React Testing Library** (already consistent with Next.js 15 + TypeScript projects).

Focus areas:
- Specific CTA button hrefs (Requirements 1.3, 1.4, 2.4, 6.3, 6.4, 9.3, 12.3–12.6)
- Loading skeleton renders before API resolves (Requirements 2.6, 13.8)
- Error state renders retry button on Bootcamps_Page (Requirement 13.7)
- "No projects found" message when filter yields empty result (Requirement 14.6)
- Exactly 4 Learning Path cards rendered (Requirement 3.1)
- Exactly 12 Why Section cards rendered (Requirement 4.1)
- Exactly 10 Hub features listed (Requirement 6.2)
- Winners gallery renders in Scholarships_Section (Requirement 7.4)
- Videos carousel shows 1 card on mobile viewport, 2+ on tablet (Requirements 11.5, 11.6)

### Test File Structure

```
__tests__/
├── unit/
│   ├── hero-section.test.tsx
│   ├── bootcamps-section.test.tsx
│   ├── learning-paths-section.test.tsx
│   ├── why-section.test.tsx
│   ├── projects-section.test.tsx
│   ├── hub-section.test.tsx
│   ├── scholarships-section.test.tsx
│   ├── success-section.test.tsx
│   ├── career-section.test.tsx
│   ├── community-section.test.tsx
│   ├── videos-section.test.tsx
│   ├── final-cta-section.test.tsx
│   ├── bootcamps-page.test.tsx
│   └── projects-page.test.tsx
└── property/
    ├── i18n-rendering.property.test.ts
    ├── bootcamp-card.property.test.tsx
    ├── project-card.property.test.tsx
    ├── testimonial-card.property.test.tsx
    ├── video-card.property.test.tsx
    ├── category-filter.property.test.ts
    ├── search-filter.property.test.ts
    ├── sort-popular.property.test.ts
    ├── sort-newest.property.test.ts
    ├── feature-card.property.test.tsx
    └── api-fallback.property.test.tsx
```
