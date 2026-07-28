# Requirements Document

## Introduction

This feature covers a full homepage redesign and addition of new pages for **SkillBridge Institute of Technology** — a bootcamp-focused edtech platform. The redesign aims to clearly communicate SkillBridge's value proposition, build trust with prospective students, and drive registrations. The implementation targets a Next.js 15 + TypeScript + Tailwind CSS codebase with i18n support (English and Amharic). The homepage will follow this section flow:

Hero → Upcoming Bootcamps → Learning Paths → Why SkillBridge → Student Projects → SkillBridge Hub → Scholarships → Success Stories → Career Services → Student Community → Latest Videos → Final CTA

Two additional pages are also in scope: a new **Projects Page** and an updated **Bootcamps Page** (replacing the current Courses page).

---

## Glossary

- **Homepage**: The root route (`/`) rendered by `app/[locale]/page.tsx`
- **Bootcamps_Page**: The updated courses listing page at `/courses`
- **Projects_Page**: A new page at `/projects` showcasing student projects
- **Hero_Section**: The top-of-page section containing the headline, subtitle, CTAs, and statistics
- **Bootcamp_Card**: A UI card component displaying bootcamp details (image, name, description, duration, start date, mode, level, register button)
- **Learning_Path_Card**: An interactive roadmap card showing step-by-step progression to a career outcome
- **Project_Card**: A UI card showing a student project (image, technologies, description, optional student name, optional demo/GitHub link)
- **Hub_Section**: The SkillBridge community platform promotion section
- **Scholarship_Card**: A UI card displaying scholarship details (applications, deadline, winners, eligibility, apply button)
- **Testimonial_Card**: A success story card with photo, name, course, position, and feedback
- **CTA**: Call to action — a button or link prompting user navigation
- **i18n**: Internationalization supporting English (`en`) and Amharic (`am`) locales via `next-intl`
- **API**: The backend REST API accessed via `lib/apI.ts`
- **Config**: Static data files under `lib/` used when API data is unavailable
- **Locale**: Language/region setting, either `en` or `am`
- **AnimatedCard**: The existing `ui/animated-card.tsx` component used for entrance animations
- **SectionHeading**: The existing `ui/section-heading.tsx` component for consistent section titles

---

## Requirements

### Requirement 1: Hero Section Redesign

**User Story:** As a prospective student, I want to see a compelling hero section that communicates SkillBridge's value and provides clear entry points, so that I understand what the platform offers and can take immediate action.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the headline "Launch Your Career in Technology with Practical, Industry-Focused Training" sourced from the i18n message file.
2. THE Hero_Section SHALL display a subtitle describing the key learning areas (software development, ERP, AI, automation, language proficiency) sourced from the i18n message file.
3. THE Hero_Section SHALL render a "Register Now" primary CTA button that navigates to the course application flow.
4. THE Hero_Section SHALL render an "Explore Bootcamps" secondary CTA button that navigates to the Bootcamps_Page.
5. THE Hero_Section SHALL display five statistics: Students Trained, Active Bootcamps, Real Projects Completed, Community Members, and Scholarships Awarded, sourced from the i18n message file.
6. THE Hero_Section SHALL render a hero visual (illustration or image) representing Programming, AI, ERP, Collaboration, and Learning.
7. WHEN the viewport width is below 768px, THE Hero_Section SHALL stack the text content above the visual in a single column layout.
8. WHEN the page loads, THE Hero_Section SHALL animate text and visual elements using entrance animations consistent with the existing Framer Motion usage in the codebase.

---

### Requirement 2: Upcoming Bootcamps Section

**User Story:** As a prospective student, I want to browse available bootcamps on the homepage, so that I can quickly identify courses of interest and register.

#### Acceptance Criteria

1. THE Bootcamps_Section SHALL display a grid of Bootcamp_Cards for upcoming bootcamps fetched from the API.
2. EACH Bootcamp_Card SHALL display: course image, course name, short description, duration, start date, learning mode, level, and a "Register" button.
3. THE Bootcamp_Card "Register" button SHALL navigate to the course application form at `/courses/{id}/ApplicationForm`.
4. THE Bootcamps_Section SHALL display a "View All Bootcamps" CTA button that navigates to the Bootcamps_Page.
5. IF the API request fails, THEN THE Bootcamps_Section SHALL display bootcamp data from the static Config as fallback.
6. WHILE bootcamp data is loading, THE Bootcamps_Section SHALL display skeleton placeholder cards matching the Bootcamp_Card layout.
7. WHEN the viewport width is below 768px, THE Bootcamps_Section SHALL display Bootcamp_Cards in a single-column layout.
8. WHEN the viewport width is between 768px and 1024px, THE Bootcamps_Section SHALL display Bootcamp_Cards in a two-column grid.
9. WHEN the viewport width is 1024px or above, THE Bootcamps_Section SHALL display Bootcamp_Cards in a three-column grid.

---

### Requirement 3: Learning Paths Section

**User Story:** As a prospective student, I want to see structured learning paths, so that I can understand how SkillBridge's bootcamps lead to specific career outcomes.

#### Acceptance Criteria

1. THE Learning_Paths_Section SHALL display four interactive Learning_Path_Cards for: Software Engineering Path, ERP Consultant Path, AI Engineer Path, and Study Abroad Path.
2. EACH Learning_Path_Card SHALL display a sequence of steps showing course progression ending in a named career outcome.
3. WHEN a user hovers over a Learning_Path_Card, THE Learning_Path_Card SHALL apply a visual highlight effect (e.g., border color change or elevation shadow).
4. THE Learning_Paths_Section SHALL display all path content sourced from the i18n message file to support English and Amharic locales.
5. WHEN the viewport width is below 768px, THE Learning_Paths_Section SHALL display Learning_Path_Cards in a single-column layout.

---

### Requirement 4: Why SkillBridge Section

**User Story:** As a prospective student, I want to see the unique benefits of SkillBridge, so that I can evaluate whether it is the right learning platform for me.

#### Acceptance Criteria

1. THE Why_Section SHALL display a grid of feature cards covering the following twelve differentiators: Project-Based Learning, Experienced Industry Mentors, Online & Physical Classes, VIP (1-to-1) Coaching, Group Bootcamps, Real-World Projects, Internship Opportunities, Scholarships, Career Support, Community Learning, Certificates of Completion, and Flexible Learning Schedule.
2. EACH feature card SHALL display an icon, a title, and a brief description sourced from the i18n message file.
3. WHEN the viewport is below 768px, THE Why_Section SHALL display feature cards in a two-column grid.
4. WHEN the viewport is 768px or above, THE Why_Section SHALL display feature cards in a three or four-column grid.

---

### Requirement 5: Student Projects Section

**User Story:** As a prospective student, I want to see real projects built by SkillBridge students, so that I can evaluate the quality and relevance of the training outcomes.

#### Acceptance Criteria

1. THE Projects_Section SHALL display a grid of Project_Cards sourced from static Config data or the API.
2. EACH Project_Card SHALL display: project image, technologies used, short description, and optional student name and optional demo or GitHub link.
3. THE Projects_Section SHALL support filtering Project_Cards by category: ERP, Web Development, AI, Automation, Python, and Mobile.
4. WHEN a category filter is selected, THE Projects_Section SHALL display only Project_Cards matching the selected category.
5. THE Projects_Section SHALL display a "View More Projects" CTA button that navigates to the Projects_Page.
6. WHEN the viewport is below 768px, THE Projects_Section SHALL display Project_Cards in a single-column layout.

---

### Requirement 6: SkillBridge Hub Section

**User Story:** As a student, I want to learn about the SkillBridge community platform, so that I can join and benefit from community features.

#### Acceptance Criteria

1. THE Hub_Section SHALL display promotional content describing the SkillBridge Hub platform and Telegram bot.
2. THE Hub_Section SHALL list the following Hub features: Daily Challenges, Weekly Quizzes, SkillPoints, Leaderboards, Scholarships, Learning Resources, Community Discussions, Referral Rewards, Announcements, and Learning Streaks.
3. THE Hub_Section SHALL render a "Join SkillBridge Hub" CTA button linking to the Hub platform.
4. THE Hub_Section SHALL render an "Open Telegram Bot" CTA button linking to the Telegram bot.
5. THE Hub_Section SHALL source all display text from the i18n message file.

---

### Requirement 7: Scholarships Section

**User Story:** As a prospective student, I want to view available scholarships, so that I can apply for financial support to join a bootcamp.

#### Acceptance Criteria

1. THE Scholarships_Section SHALL display Scholarship_Cards for current available scholarships.
2. EACH Scholarship_Card SHALL display: scholarship name, number of current applications, registration deadline, number of winners, eligibility criteria, and an "Apply" button.
3. THE "Apply" button on each Scholarship_Card SHALL navigate to the corresponding course application form.
4. THE Scholarships_Section SHALL display a list or gallery of previous scholarship winners.
5. THE Scholarships_Section SHALL source all scholarship data from static Config or the API.
6. THE Scholarships_Section SHALL source all display text labels from the i18n message file.

---

### Requirement 8: Success Stories Section

**User Story:** As a prospective student, I want to read testimonials from past students, so that I can build confidence in the quality and outcomes of SkillBridge bootcamps.

#### Acceptance Criteria

1. THE Success_Section SHALL display a collection of Testimonial_Cards.
2. EACH Testimonial_Card SHALL display: student photo, student name, course taken, current position, and written feedback.
3. THE Success_Section SHALL cover the following outcome types: Career Progress, Internships, Freelancing, Projects, Scholarship Winners, and Employment.
4. WHEN the viewport is below 768px, THE Success_Section SHALL display Testimonial_Cards in a scrollable carousel or single-column layout.
5. THE Success_Section SHALL source all testimonial data from static Config or the API.

---

### Requirement 9: Career Services Section

**User Story:** As a student nearing course completion, I want to learn about available career support services, so that I can leverage SkillBridge's resources to enter the job market.

#### Acceptance Criteria

1. THE Career_Section SHALL display cards or a list for the following ten services: CV & Resume Review, LinkedIn Optimization, Portfolio Development, GitHub Profile Review, Interview Prep, Technical Mock Interviews, Freelancing Guidance, Career Mentorship, Internship Support, and Job Search Assistance.
2. EACH service item SHALL display an icon, title, and short description sourced from the i18n message file.
3. THE Career_Section SHALL render a "Book Career Guidance" CTA button that navigates to the contact or booking page.

---

### Requirement 10: Student Community Section

**User Story:** As a student, I want to discover SkillBridge's community channels, so that I can connect with peers and stay updated.

#### Acceptance Criteria

1. THE Community_Section SHALL display community platform links for: Telegram, YouTube, LinkedIn, SkillBridge Hub, and Discussion Groups.
2. THE Community_Section SHALL render the following CTA buttons: "Join Telegram", "Subscribe on YouTube", and "Follow on LinkedIn", each linking to the respective platform URL.
3. WHERE live community statistics are available, THE Community_Section SHALL display them alongside each platform link (e.g., subscriber count, member count).
4. THE Community_Section SHALL source all display text from the i18n message file.

---

### Requirement 11: Latest Videos Section

**User Story:** As a prospective student, I want to watch recent SkillBridge videos, so that I can preview the teaching style and content quality before enrolling.

#### Acceptance Criteria

1. THE Videos_Section SHALL display 4 to 6 YouTube video cards in a responsive carousel.
2. EACH video card SHALL display: thumbnail image, video title, duration, publish date, short description, and a "Watch" button linking to the YouTube video URL.
3. THE Videos_Section SHALL render a "View All Videos" CTA button linking to the SkillBridge YouTube channel.
4. IF the YouTube API or video data source is unavailable, THEN THE Videos_Section SHALL display a static fallback list of video cards from Config data.
5. WHEN the viewport is below 768px, THE Videos_Section carousel SHALL display one card at a time with navigation controls.
6. WHEN the viewport is 768px or above, THE Videos_Section carousel SHALL display two or more cards simultaneously.

---

### Requirement 12: Final Call-to-Action Section

**User Story:** As a prospective student who has scrolled through the homepage, I want a clear final prompt to take action, so that I can register without having to scroll back up.

#### Acceptance Criteria

1. THE Final_CTA_Section SHALL display the headline "Ready to Build Your Tech Career?" sourced from the i18n message file.
2. THE Final_CTA_Section SHALL display a supporting description paragraph sourced from the i18n message file.
3. THE Final_CTA_Section SHALL render the following three CTA buttons: "Register for a Bootcamp", "Contact Admissions", and "Explore All Programs".
4. THE "Register for a Bootcamp" button SHALL navigate to the Bootcamps_Page.
5. THE "Contact Admissions" button SHALL navigate to the contact page at `/contact`.
6. THE "Explore All Programs" button SHALL navigate to the Bootcamps_Page.

---

### Requirement 13: Bootcamps Page (Updated Courses Page)

**User Story:** As a prospective student, I want a dedicated bootcamps listing page with rich filtering and detailed cards, so that I can find and register for the right bootcamp.

#### Acceptance Criteria

1. THE Bootcamps_Page SHALL fetch and display all bootcamps from the API with search, filter, and sort controls.
2. THE Bootcamps_Page SHALL support filtering by category using tab navigation.
3. THE Bootcamps_Page SHALL support text search across bootcamp title and description.
4. THE Bootcamps_Page SHALL support sorting by Most Popular and Newest.
5. EACH Bootcamp_Card on the Bootcamps_Page SHALL display: image, title, category, description, rating, review count, duration, start date, learning mode, and level.
6. EACH Bootcamp_Card on the Bootcamps_Page SHALL provide a "View Details" button linking to `/courses/{id}` and a "Register" button linking to `/courses/{id}/ApplicationForm`.
7. IF the API request fails, THEN THE Bootcamps_Page SHALL display an error message and a "Retry" button.
8. WHILE data is loading, THE Bootcamps_Page SHALL display skeleton placeholder cards.
9. THE Bootcamps_Page SHALL source all UI labels and text from the i18n message file.

---

### Requirement 14: Projects Page

**User Story:** As a prospective student or employer, I want to browse all student projects in one place, so that I can evaluate the practical skills SkillBridge students develop.

#### Acceptance Criteria

1. THE Projects_Page SHALL display all student projects in a filterable grid layout.
2. THE Projects_Page SHALL support filtering by category: ERP, Web Development, AI, Automation, Python, and Mobile.
3. EACH Project_Card on the Projects_Page SHALL display: project image, project title, technologies used, short description, category badge, and optional student name and optional demo or GitHub link.
4. THE Projects_Page SHALL include a page heading and subtitle sourced from the i18n message file.
5. WHEN a category filter is selected on the Projects_Page, THE Projects_Page SHALL display only Project_Cards matching the selected category without a full page reload.
6. WHEN no projects match the selected filter, THE Projects_Page SHALL display a "No projects found" message.
7. THE Projects_Page SHALL be accessible at the `/projects` route.

---

### Requirement 15: Responsive Design and Accessibility

**User Story:** As a user on any device, I want the website to display correctly and be usable, so that I have a consistent experience whether on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Homepage SHALL be fully responsive across mobile (< 768px), tablet (768px–1024px), and desktop (> 1024px) breakpoints using Tailwind CSS responsive utilities.
2. THE Homepage SHALL maintain consistent branding: color palette (blue `#2196F3`, orange `#F57C00`), typography (Montserrat), and spacing consistent with the existing codebase.
3. THE Homepage SHALL apply smooth CSS or Framer Motion animations for section entrance and interactive hover effects.
4. ALL images on the Homepage SHALL include descriptive `alt` text attributes.
5. ALL interactive CTA buttons SHALL be keyboard-navigable and have visible focus indicators.
6. THE Homepage SHALL support dark mode via the existing `next-themes` ThemeProvider.

---

### Requirement 16: Internationalization (i18n)

**User Story:** As an Amharic-speaking user, I want the homepage content displayed in Amharic, so that I can fully understand the platform's offerings in my preferred language.

#### Acceptance Criteria

1. ALL user-visible text on the Homepage, Bootcamps_Page, and Projects_Page SHALL be sourced from the `messages/en.json` and `messages/am.json` i18n files via `next-intl`.
2. WHEN the active locale is `am`, THE Homepage SHALL render all section headings, descriptions, CTA button labels, and card content in Amharic.
3. WHEN the active locale is `en`, THE Homepage SHALL render all section headings, descriptions, CTA button labels, and card content in English.
4. THE i18n message files SHALL be extended with new keys for every new section and component introduced by this redesign.
