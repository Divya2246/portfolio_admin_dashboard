# Portfolio Website – Display Checklist & Integration Spec

Use this document to ensure the **public portfolio website** shows everything managed in the **portfolio admin dashboard** and integrates correctly with Firebase.

---

## 1. Data source

- **Firestore collection:** `portfolios`
- **Document ID:** The portfolio owner's Firebase Auth `userId` (same user who edits in the admin dashboard).
- **Read access:** Firestore rules allow **public read** on `portfolios/{userId}`. The portfolio site does **not** need to be logged in to fetch portfolio data.
- **Fetch:** Read a single document: `portfolios/{userId}`. Replace `{userId}` with the actual portfolio owner's UID (e.g. from config or env).

### 1.1 Where images and files are saved

Uploaded files are **not** stored inside the Firestore document. The admin dashboard uploads the file to **Firebase Storage**, then saves the file’s **download URL** (a string) on `portfolios/{userId}`. The public site only needs those URL fields. It does not list or read the Storage folder.

| | |
|---|---|
| **Bucket** | The Storage bucket for this Firebase project (`REACT_APP_FIREBASE_STORAGE_BUCKET` in the admin app). |
| **Folder** | `portfolio/` only. There are no subfolders such as `avatars/` or `projects/`. The live Storage rules allow a file directly under `portfolio/`, and reject deeper paths. |
| **File name** | `<timestamp>_<original-name>`. The timestamp is `Date.now()`. Any character in the original name that is not a letter, number, `.`, or `-` is replaced with `_`. |
| **Example object path** | `portfolio/1794825151437_WhatsApp_Image_2026-11-16_at_3.52.11_PM__1_.jpeg` |
| **Console** | Firebase Console → **Storage** → **Files** → folder `portfolio`. |
| **Code** | `src/firebase/services/storage.service.ts` (`uploadPortfolioFile`). |
| **Who can upload** | A signed-in admin only. |
| **Who can read** | Anyone. Download URLs work on the public site without login. |

A download URL looks like:

`https://firebasestorage.googleapis.com/v0/b/<bucket>/o/portfolio%2F<filename>?alt=media&token=...`

Use that string as `img src`, a PDF link, or a video `src`. Do not rebuild the URL from the file name.

**Which Firestore fields hold those URLs**

| What was uploaded | Field on `portfolios/{userId}` | Notes |
|---|---|---|
| Developer profile pictures | `avatarUrls: string[]` | Order matters. Index `0` is the main photo. Further items are extra photos the visitor can switch to. |
| Main profile picture | `avatarUrl: string` | Same URL as `avatarUrls[0]`. Kept so a site that only knows the single photo still works. |
| Project screenshot | `projects[].screenshotUrl` | One image per project. |
| Freelance project screenshot | `freelanceProjects[].screenshotUrl` | One image per freelance project. |
| Featured project screenshot | `featuredProjects[].screenshotUrl` | One image per featured project. |
| Other image, PDF, or video | `mediaItems[].url` | Also has `title`, optional `fileType` (`image` \| `pdf` \| `video`), and optional `fileName`. |

If the admin pastes a link instead of uploading, that link is saved in the same field and the file is **not** copied into Storage. Treat every value as a normal URL.

Profile pictures on the public site:

1. If `avatarUrls` has at least one non-empty URL, show those. The first is the large photo; the rest are thumbnails.
2. If `avatarUrls` is missing or empty, show `avatarUrl`.
3. If neither is set, show no photo.

---

## 2. Sections to display (in order)

Display these sections when the corresponding data exists. Hide sections that have no data.

| # | Section ID | Section name | Condition to show |
|---|------------|--------------|-------------------|
| 1 | (banner) | WIP banner | `showWIPBanner === true` |
| 2 | hero | Hero | Always (at least `fullName`) |
| 3 | summary / about | About | Any of: `professionalSummary`, `yearsOfExperience`, `fullTimeFreelanceMention`, `specialization`, `clientTypes` |
| 4 | skills | Technical skills | `skillCategories.length > 0` OR `skills.length > 0` |
| 5 | experience | Experience | `experience.length > 0` |
| 6 | freelance | Freelance projects | `freelanceProjects.length > 0` |
| 7 | featured | Featured projects | `featuredProjects.length > 0` |
| 8 | projects | Other projects | `projects.length > 0` |
| 9 | achievements | Achievements | `achievements.length > 0` |
| 10 | services | Services I offer | `servicesDetailed` has a titled item, or `services.length > 0` |
| 11 | process | My work process | `processSteps.length > 0` |
| 12 | testimonials | Testimonials | `testimonials.length > 0` |
| 13 | education | Education | `education.length > 0` |
| 14 | resume | Resume | `resumePdfUrl` or `fullTimeFreelanceMention` |
| 15 | faq | FAQ | `faqItems` has at least one question or answer |
| 16 | contact | Contact | Any of: `contactCta`, `calendarBookingUrl`, `email`, `phone`, `whatsapp`, `location`, `linkedin`, `github`, or contact form enabled |
| 17 | media | Media | `mediaItems` with at least one item that has `url` |

---

## 3. Field-by-field display reference

### 3.1 WIP banner (optional)

- **Field:** `showWIPBanner` (boolean)
- **Show when:** `true`
- **Display:** A prominent banner, e.g. "Work in progress — this portfolio is still being updated."

---

### 3.2 Hero section

| Field | Type | Required | Display |
|-------|------|----------|---------|
| `fullName` | string | Yes | Main heading (e.g. `<h1>`) |
| `title` | string | No | Subtitle (e.g. "React Frontend Developer \| Freelance Web Engineer") |
| `positioningLine` | string | No | One-line tagline below title |
| `heroCtaText` | string | No | Label for the primary hero button. If empty and `heroCtaLink` is set, use "Book a call". |
| `heroCtaLink` | string | No | Primary button URL. Open `http(s)` links in a new tab. Keep `#contact` and other in-page links on the same page. |
| `projectsCompletedCount` | string | No | Hero stat, label "Projects shipped" (e.g. "40+") |
| `clientsServedCount` | string | No | Hero stat, label "Clients" (e.g. "25+") |
| `yearsOfExperience` | string | No | Also show in the hero as the "Experience" stat when set |
| `avatarUrls` | string[] | No | All developer profile pictures, in order. First URL is the large photo; the rest are extras the visitor can switch to. See § 1.1 for where the files live. |
| `avatarUrl` | string | No | Main profile picture. Same URL as `avatarUrls[0]`. Use this when `avatarUrls` is empty. `fullName` is the `alt` text. |
| `resumePdfUrl` | string | No | "Download Resume" button/link (open in new tab) |
| `linkedin` | string | No | LinkedIn link |
| `github` | string | No | GitHub link |
| `portfolioUrl` | string | No | Portfolio link (if different from current site) |

**Contact strip in hero (optional):** If any of `email`, `phone`, `location` exist, show a compact strip (e.g. email with copy button, phone, location).

**Trust stats:** When any of `yearsOfExperience`, `projectsCompletedCount`, or `clientsServedCount` is set, show them as a row under the tagline.

**CTAs:** Primary button from `heroCtaText` + `heroCtaLink` when the link is set. Then "View My Work" (anchor to #summary), "Hire Me" (anchor to #contact), "Download Resume" (if `resumePdfUrl`). When the primary button is present, "View My Work" is the secondary style.

---

### 3.3 About section

| Field | Type | Display |
|-------|------|---------|
| `professionalSummary` | string | Main paragraph (preserve line breaks) |
| `yearsOfExperience` | string | e.g. "Experience: 3.6+ years" |
| `fullTimeFreelanceMention` | string | Short line (e.g. full-time + freelance) |
| `specialization` | string | e.g. "Specialization: React, reusable architecture…" |
| `clientTypes` | string | e.g. "Clients: Startup, small business, SaaS…" |

Show each line only if the field has a value.

---

### 3.4 Skills section

**Option A – Categories (preferred when present)**  
If `skillCategories.length > 0`:

- For each item in `skillCategories`:
  - **`category`** (string): Section heading (e.g. "Frontend", "State Management").
  - **`skills`** (string[]): List of skill names; render as chips/badges.

**Option B – Flat list**  
If no categories, use `skills`:

- Each item is either:
  - **string:** skill name, or
  - **object:** `{ name: string, percentage?: number }`
- Display: skill name; optionally show `percentage` as a progress or label (e.g. "85%").

---

### 3.5 Experience (organization)

Array: `experience[]`.  
Each item:

| Field | Type | Display |
|-------|------|---------|
| `role` | string | Job title (emphasis) |
| `company` | string | Company name |
| `location` | string | Location |
| `period` | string | Duration |
| `techStack` | string | Tech stack line |
| `points` | string | Newline-separated bullet points |
| `systemsBuilt` | string | Optional line |
| `performanceImprovements` | string | Optional line |
| `reusableComponents` | string | Optional line |
| `impact` | string | Optional line |

Suggested format: **Role** · Company · Location · Period, then tech stack, then bullets from `points`, then optional lines.

---

### 3.6 Freelance projects

Array: `freelanceProjects[]`.  
Each item:

| Field | Type | Display |
|-------|------|---------|
| `isNda` | boolean | If `true`, show only: "Private client project – details available upon request." Still show the not-working badge when `isNotWorking` is true. Hide screenshot, client name, and result. |
| `screenshotUrl` | string | Cover image at the top of the card. Skip when `isNda` is true. |
| `clientName` | string | Card title |
| `clientType` | string | Subheading/label |
| `resultHighlight` | string | Short outcome pill, e.g. "12 hrs/week saved" |
| `problem` | string | "Problem: …" |
| `solution` | string | "Solution: …" |
| `techStack` | string | Tech used |
| `timeline` | string | Timeline (small text) |
| `keyFeatures` | string | Newline-separated bullets |
| `results` | string | "Results: …" |
| `liveLink` | string | "View live →" link. If `isNotWorking`, label it "Open live site (may be down) →". |
| `isNotWorking` | boolean | If `true`, show a "Currently not working" badge and a short line: "The live demo is currently unavailable." Keep the project visible. |

When `isNda === true`, do not show problem/solution/details. Still show the not-working badge when `isNotWorking === true`.

---

### 3.7 Featured projects (personal / side)

Array: `featuredProjects[]`.  
Each item:

| Field | Type | Display |
|-------|------|---------|
| `name` | string | Project title |
| `screenshotUrl` | string | Cover image at the top of the card |
| `resultHighlight` | string | Short outcome pill |
| `problem` | string | "Problem: …" |
| `solution` | string | "Solution: …" |
| `architectureThinking` | string | "Architecture: …" |
| `keyFeatures` | string | Newline-separated bullets |
| `githubLink` | string | "GitHub →" link |
| `liveLink` | string | "Live →" link. If `isNotWorking`, label it "Live (may be down) →". |
| `isNotWorking` | boolean | If `true`, show a "Currently not working" badge and "The live demo is currently unavailable." |

---

### 3.8 Other projects

Array: `projects[]`.  
Each item:

| Field | Type | Display |
|-------|------|---------|
| `name` | string | Project name |
| `screenshotUrl` | string | Cover image at the top of the card |
| `resultHighlight` | string | Short outcome pill |
| `tech` | string | Tech stack (optional) |
| `url` | string | "View project →" link |
| `highlights` | string | Newline-separated bullets |
| `isNotWorking` | boolean | If `true`, show a "Currently not working" badge and "The live demo is currently unavailable." Link label becomes "View project (may be down) →". |

---

### 3.9 Achievements

- **Field:** `achievements` (string[])
- **Display:** Simple list (e.g. `<ul>` with one item per string).

---

### 3.10 Services

Prefer `servicesDetailed` when it has at least one item with a non-empty `title`. Otherwise use `services`.

**Detailed cards** (`servicesDetailed[]`):

| Field | Type | Display |
|-------|------|---------|
| `title` | string | Card heading |
| `description` | string | 2–3 lines. Preserve line breaks. |
| `problemItSolves` | string | "Problem: …" |
| `whoItIsFor` | string | "For: …" |

**Fallback list:** `services` (string[]), one item per line. Hide this list when detailed cards are shown.

---

### 3.10b FAQ

Array: `faqItems[]`. Show the section when at least one item has a question or an answer. Place it just before Contact.

| Field | Type | Display |
|-------|------|---------|
| `question` | string | Expandable heading |
| `answer` | string | Answer body. Preserve line breaks. |

---

### 3.11 Process (work process)

- **Field:** `processSteps` (string[])
- **Display:** Ordered list (e.g. 1. Requirement discussion, 2. Wireframing, 3. Development).

---

### 3.12 Testimonials

Array: `testimonials[]`.  
Each item:

| Field | Type | Display |
|-------|------|---------|
| `feedback` | string | Quote (e.g. blockquote) |
| `clientName` | string | "— Client Name" |
| `projectType` | string | " · Project type" after name |

---

### 3.13 Education

Array: `education[]`.  
Each item:

| Field | Type | Display |
|-------|------|---------|
| `degree` | string | Degree (e.g. "B.Tech Computer Science") |
| `institution` | string | School/college |
| `location` | string | City/country |
| `period` | string | Years |
| `grade` | string | Grade/CGPA (optional) |

Suggested format: **Degree** · Institution · Location · Period · Grade.

---

### 3.14 Resume section

- **`resumePdfUrl`:** Primary CTA "Download Resume" (open in new tab).
- **`fullTimeFreelanceMention`:** Optional short line (can be repeated from About if desired).

---

### 3.15 Contact section

| Field | Type | Display |
|-------|------|---------|
| `contactCta` | string | Short line (e.g. "Available for freelance…") |
| `calendarBookingUrl` | string | "Book a call" button (open in a new tab) |
| `email` | string | Show with optional "Copy" button |
| `phone` | string | Clickable `tel:` link |
| `whatsapp` | string | Link to WhatsApp (e.g. `https://wa.me/<number>`; strip non-digits from number) |
| `location` | string | Plain text |
| `linkedin` | string | "LinkedIn" link |
| `github` | string | "GitHub" link |

**Contact form (optional):**  
If the portfolio site implements a contact form, it should submit to Firestore (see § 5). Fields: **name**, **email**, **message**. Show success/error states.

---

### 3.16 Media section

- **Field:** `mediaItems[]`
- **Filter:** Only items with non-empty `url`.
- **Per item:**

| Field | Type | Display |
|-------|------|---------|
| `title` | string | Caption/heading |
| `url` | string | Source for image / PDF link / video |
| `fileType` | 'image' \| 'pdf' \| 'video' | Optional; if missing, infer from URL (.pdf → pdf, .webm/.mp4/.ogg/.mov → video, else image) |

- **image:** `<img src={url} alt={title}>`
- **pdf:** Link "Open PDF" → `url`
- **video:** `<video src={url} controls>`

---

## 4. Data types (TypeScript) – for portfolio site

Use these types when reading from Firestore so the portfolio site matches the admin dashboard.

```ts
// Skill (flat list)
interface PortfolioSkillItem {
  name: string;
  percentage?: number;
}

// Skill category
interface PortfolioSkillCategory {
  category: string;
  skills: string[];
}

// Other projects
interface PortfolioProjectItem {
  name: string;
  tech?: string;
  url?: string;
  highlights?: string;
}

// Education
interface PortfolioEducationItem {
  degree: string;
  institution?: string;
  location?: string;
  period?: string;
  grade?: string;
}

// Experience
interface PortfolioExperienceItem {
  role: string;
  company?: string;
  location?: string;
  period?: string;
  points?: string;
  techStack?: string;
  systemsBuilt?: string;
  performanceImprovements?: string;
  reusableComponents?: string;
  impact?: string;
}

// Freelance project
interface PortfolioFreelanceProjectItem {
  clientType?: string;
  problem?: string;
  solution?: string;
  techStack?: string;
  timeline?: string;
  keyFeatures?: string;
  results?: string;
  liveLink?: string;
  isNda?: boolean;
}

// Featured project
interface PortfolioFeaturedProjectItem {
  name?: string;
  problem?: string;
  solution?: string;
  architectureThinking?: string;
  keyFeatures?: string;
  githubLink?: string;
  liveLink?: string;
}

// Testimonial
interface PortfolioTestimonialItem {
  clientName?: string;
  feedback?: string;
  projectType?: string;
}

// Media
type PortfolioMediaFileType = 'image' | 'pdf' | 'video';
interface PortfolioMediaItem {
  title: string;
  url: string;
  fileType?: PortfolioMediaFileType;
  fileName?: string;
}

// Root portfolio document (portfolios/{userId})
interface PortfolioData {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  avatarUrl?: string;
  /** Extra developer photos. The first entry is the main profile picture, same as avatarUrl. */
  avatarUrls?: string[];
  resumePdfUrl?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;
  positioningLine?: string;
  professionalSummary?: string;
  yearsOfExperience?: string;
  fullTimeFreelanceMention?: string;
  specialization?: string;
  clientTypes?: string;
  skills?: PortfolioSkillItem[];
  skillCategories?: PortfolioSkillCategory[];
  experience?: PortfolioExperienceItem[];
  projects?: PortfolioProjectItem[];
  freelanceProjects?: PortfolioFreelanceProjectItem[];
  featuredProjects?: PortfolioFeaturedProjectItem[];
  achievements?: string[];
  education?: PortfolioEducationItem[];
  services?: string[];
  processSteps?: string[];
  testimonials?: PortfolioTestimonialItem[];
  mediaItems?: PortfolioMediaItem[];
  showWIPBanner?: boolean;
  contactCta?: string;
}
```

---

## 5. Contact form → Firestore

If the portfolio site has a contact form:

1. **Collection:** `contactSubmissions`
2. **Document fields to write:**
   - `portfolioUserId` (string): The portfolio owner's Firebase Auth UID (same as `portfolios/{userId}`).
   - `name` (string): Sender name.
   - `email` (string): Sender email.
   - `message` (string): Message body.
   - `createdAt`: Firestore `serverTimestamp()`.

3. **Firestore rules:** Unauthenticated users are allowed **create** only on `contactSubmissions`. No read/update/delete for public.
4. **Index:** A composite index is required for listing submissions by owner and date:
   - Collection: `contactSubmissions`
   - Fields: `portfolioUserId` (Ascending), `createdAt` (Descending)  
   (Already defined in this project's `firestore.indexes.json`; deploy indexes with the same Firebase project.)

The admin dashboard reads from `contactSubmissions` with `portfolioUserId == currentUser.uid` and `orderBy('createdAt', 'desc')` to show messages.

---

## 6. Firestore rules summary (for reference)

- **portfolios/{userId}:** `read: true` (public), `create, update, delete`: only when `request.auth.uid == userId`.
- **contactSubmissions/{docId}:** `create: true` (anyone), `read, update, delete`: only when `request.auth != null`.

Ensure the **portfolio website** uses the same Firebase project and that these rules (and indexes) are deployed.

---

## 7. Optional: reuse reference implementation

This repo includes a full reference implementation:

- **Component:** `src/portfolio-display/PortfolioDisplay.tsx`
- **Types:** `src/portfolio-display/types.ts`

You can copy `PortfolioDisplay.tsx` and `types.ts` into the portfolio site and pass:

- `data`: The `PortfolioData` object from Firestore.
- `onSubmitContact`: Optional callback that receives `{ name, email, message }` and writes to `contactSubmissions` with the correct `portfolioUserId` and `createdAt`.

Then the portfolio site only needs to:

1. Resolve the portfolio owner's `userId` (e.g. from env).
2. Fetch `portfolios/{userId}`.
3. Render `<PortfolioDisplay data={data} onSubmitContact={submitContactMessage} />` (or without contact form if not needed).

---

## 8. Quick checklist for portfolio website

- [ ] Read portfolio from Firestore: `portfolios/{userId}` (public read).
- [ ] Resolve `userId` (e.g. env: `VITE_PORTFOLIO_USER_ID` or similar).
- [ ] Implement or reuse all sections listed in § 2, with fields from § 3.
- [ ] Hide sections when the corresponding data is empty.
- [ ] Handle `skillCategories` vs flat `skills`; handle `isNda` for freelance projects; handle newline-separated `points` / `keyFeatures` / `highlights`.
- [ ] Optional: Contact form → `contactSubmissions` with `portfolioUserId`, `name`, `email`, `message`, `createdAt`.
- [ ] Optional: WIP banner when `showWIPBanner === true`.
- [ ] Use same Firebase project and deployed rules/indexes so `contactSubmissions` composite index exists.
- [ ] Use the TypeScript types from § 4 (or copy `portfolio-display/types.ts`) for type-safe Firestore data.

---

*Generated from portfolio-admin-dashboard. Share this file with the portfolio website team.*
