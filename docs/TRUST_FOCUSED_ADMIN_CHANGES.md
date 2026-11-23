# Trust-Focused Website Structure — Admin Changes Checklist

This document maps the **TRUST-FOCUSED WEBSITE STRUCTURE** PDF to the portfolio admin dashboard: what already exists, what needs to be **updated**, and what needs to be **added**.

---

## Summary

| # | PDF Section | Status | Action |
|---|-------------|--------|--------|
| 1 | Hero Section | **Update** | Add primary CTA, trust badges/numbers, clarify headline vs subheading |
| 2 | About Founder | **Update** | Add mission, team photo, ensure “founder story” field |
| 3 | Services | **Update** | Rich service items (description, problem, who it’s for) instead of flat list |
| 4 | Portfolio | **Update** | Add clientName; align with Problem / Solution / Result + before/after |
| 5 | Testimonials | **Update** | Add video URL, company name |
| 6 | Process | **OK** | Already have `processSteps` — ensure display order (e.g. 1–6) |
| 7 | Social Proof | **Add** | New section: client logos, stats, Instagram/LinkedIn, workshops, awards |
| 8 | FAQ | **Add** | New section: question + answer pairs |
| 9 | Contact | **Update** | Add calendar booking link, optional office address |
| 10 | Legal & Transparency | **Add** | Privacy Policy, Terms, Refund Policy, GST, Company registration |

---

## 1. Hero Section (First Impression)

**PDF requirements:**
- Clear headline (one sentence)
- Short subheading (who you help + outcome)
- **One primary CTA button** (e.g. “Book a Free Consultation”)
- Professional image (founder/brand)
- **Optional trust badges or numbers** (e.g. “Trusted by 120+ clients”)

**Current admin:**  
`fullName`, `title`, `positioningLine`, `avatarUrl`, `resumePdfUrl`, social links.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `heroHeadline` | Single headline (e.g. “We Build High-Converting Websites for Startups and Businesses”) |
| **Add** | `heroSubheading` | Who you help + outcome (e.g. “Helping brands grow with custom websites and mobile apps trusted by 120+ clients.”) |
| **Add** | `heroCtaText` | Primary CTA label (e.g. “Book a Free Consultation”) |
| **Add** | `heroCtaLink` | URL for primary CTA (e.g. Calendly, contact section, or external link) |
| **Add** | `heroTrustBadge` or `heroTrustStats` | Optional: short text or structured stats (e.g. “120+ clients”, “10+ cities”) — can be one text line or array of stats |
| **Keep/repurpose** | `positioningLine` | Use as extra tagline if needed, or merge into headline/subheading in UI |
| **Keep** | `avatarUrl`, `fullName`, `title` | Already support “professional image” and basic identity |

---

## 2. About Founder Section (Human Connection)

**PDF requirements:**
- Founder’s professional photo
- Short personal story (why you started)
- Years of experience
- Number of projects completed
- **Your mission**
- **Team photo** (if you have a team) with names and roles

**Current admin:**  
`professionalSummary`, `yearsOfExperience`, `fullTimeFreelanceMention`, `specialization`, `clientTypes`, `avatarUrl`.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `founderStory` or use `professionalSummary` | If new field: “Why you started” short story. Otherwise, clarify in label that “professional introduction” can include founder story. |
| **Add** | `projectsCompletedCount` | Number of projects (e.g. “120+”) for trust line |
| **Add** | `missionStatement` | Your mission (1–2 sentences) |
| **Add** | `teamPhotoUrl` | Optional team photo |
| **Add** | `teamMembers` | Optional array: `{ name, role }` (or single text block “Team: names and roles”) |
| **Keep** | `yearsOfExperience`, `avatarUrl`, `professionalSummary` | Already support photo, experience, intro |

---

## 3. Services Section (Clear Offer)

**PDF requirements:**
- Each service: 2–3 line explanation, what problem it solves, who it’s for
- Example: Website Development, Mobile App Development, UI/UX Design, E‑commerce, Maintenance & Support

**Current admin:**  
`services` is a **string array** (one line per service).

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Replace/expand** | `services` | Change to **array of objects** (e.g. `PortfolioServiceItem[]`): |
| | `serviceTitle` | e.g. “Website Development” |
| | `serviceDescription` | 2–3 lines |
| | `problemItSolves` | Short line |
| | `whoItIsFor` | Short line (e.g. “Startups and small businesses”) |
| **Alternative** | Keep `services` as string[] for backward compatibility and **add** `servicesDetailed` | New array for rich items; portfolio site can prefer detailed if present |

**New type suggestion:**

```ts
interface PortfolioServiceItem {
  title: string;           // e.g. "Website Development"
  description?: string;   // 2-3 lines
  problemItSolves?: string;
  whoItIsFor?: string;
}
```

---

## 4. Portfolio Section (Proof Over Promise)

**PDF requirements:**
- Per project: **Client Name**, **Problem**, **Solution**, **Result**
- Real project screenshots, live links, optional before/after

**Current admin:**  
`freelanceProjects` has: `clientType`, `problem`, `solution`, `results`, `liveLink`, `keyFeatures`, `techStack`, `timeline`, `isNda`.  
No explicit **client name**; no **before/after** media.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `clientName` on freelance (and optionally featured) | “Client Name” (e.g. “Restaurant Startup”) — can keep `clientType` as category |
| **Add** | `beforeAfterImageUrls` or `screenshots` | Optional: array of image URLs (before/after or gallery); or reuse `mediaItems` with a “projectId” if you link media to projects |
| **Keep** | `problem`, `solution`, `results`, `liveLink` | Already align with PDF |
| **Optional** | Same structure for `featuredProjects` | Add `clientName` and result-focused line if used for client work |

---

## 5. Testimonials Section (Video Recommended)

**PDF requirements:**
- Prefer **video** testimonial (2–3 client videos)
- Structure: client video, short written quote, client name and **company**
- Fallbacks: WhatsApp screenshots, LinkedIn recommendations, Google reviews

**Current admin:**  
`testimonials`: `clientName`, `feedback`, `projectType`. No video, no company.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `testimonialVideoUrl` | URL to video (YouTube, Vimeo, or uploaded video in `mediaItems`) |
| **Add** | `companyName` | Client’s company name |
| **Keep** | `clientName`, `feedback`, `projectType` | Map to “short written quote” and “client name” |
| **Optional** | `testimonialSource` | Enum or string: “video” | “whatsapp” | “linkedin” | “google” for display styling |

**New/updated type:**

```ts
interface PortfolioTestimonialItem {
  clientName?: string;
  companyName?: string;      // NEW
  feedback?: string;
  projectType?: string;
  videoUrl?: string;         // NEW
  source?: 'video' | 'whatsapp' | 'linkedin' | 'google';  // optional
}
```

---

## 6. Process Section (Professional System)

**PDF requirements:**
- Step-by-step workflow (e.g. Discovery → Proposal → UI/UX → Development → Testing & Launch → Support).

**Current admin:**  
`processSteps` (string array). Already supports ordered list.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **None** | — | Ensure UI shows steps in order (1, 2, 3…). Optional: add `processStepTitle` + `processStepDescription` if you want richer steps later. |

---

## 7. Social Proof Section (NEW)

**PDF requirements:**
- Client logos
- Number of clients served
- Instagram followers / LinkedIn presence
- Workshops conducted
- Awards or recognitions
- Example: “Trusted by 150+ businesses across India”, “Serving clients in 10+ cities”

**Current admin:**  
No dedicated section. `achievements` is a string array (could hold some of this but not structured).

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `socialProof` section | New block |
| **Add** | `clientLogos` | Array of `{ url, alt?, companyName? }` for logo images |
| **Add** | `clientsServedCount` | e.g. “150+” |
| **Add** | `citiesOrRegionsServed` | e.g. “10+ cities” or “Across India” |
| **Add** | `instagramUrl` / `instagramHandle` | Optional |
| **Add** | `linkedinUrl` | Already have `linkedin` — ensure it’s used in social proof |
| **Add** | `workshopsConducted` | Optional string or number |
| **Add** | `awardsOrRecognitions` | Optional string array or rich list |

**New type suggestion:**

```ts
interface PortfolioSocialProof {
  clientLogos?: { url: string; alt?: string; companyName?: string }[];
  clientsServedCount?: string;
  citiesOrRegionsServed?: string;
  instagramUrl?: string;
  instagramHandle?: string;
  workshopsConducted?: string;
  awardsOrRecognitions?: string[];
}
```

---

## 8. FAQ Section (NEW)

**PDF requirements:**
- Common questions: cost, timeline, support, payment structure, revisions, white-label, etc.

**Current admin:**  
No FAQ.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `faq` section | New block |
| **Add** | `faqItems` | Array of `{ question, answer }` |

**New type:**

```ts
interface PortfolioFaqItem {
  question: string;
  answer: string;
}
// In PortfolioData: faqItems?: PortfolioFaqItem[];
```

---

## 9. Contact Section (Easy Access)

**PDF requirements:**
- Contact form, WhatsApp, email, **calendar booking link**, **office address**
- Strong closing statement (e.g. “Let’s Build Something Powerful Together”)

**Current admin:**  
`email`, `phone`, `whatsapp`, `location`, `contactCta`, contact form (via Firestore).

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `calendarBookingUrl` | Calendly or similar link |
| **Add** | `officeAddress` | Optional; full address for “Office address (if available)” |
| **Keep** | `contactCta` | Use as closing statement; optional label in form: “Contact CTA / Closing statement” |

---

## 10. Legal and Transparency Section (NEW)

**PDF requirements:**
- Privacy Policy, Terms and Conditions, Refund Policy
- GST details (if applicable)
- Company registration details (if applicable)

**Current admin:**  
None.

**Changes in admin:**

| Action | Field / Area | Notes |
|--------|--------------|--------|
| **Add** | `legal` section | New block |
| **Add** | `privacyPolicyUrl` or `privacyPolicyText` | URL to page or inline text |
| **Add** | `termsAndConditionsUrl` or `termsAndConditionsText` | Same |
| **Add** | `refundPolicyUrl` or `refundPolicyText` | Same |
| **Add** | `gstNumber` | Optional |
| **Add** | `companyRegistrationDetails` | Optional (e.g. company name, registration number) |

**New type suggestion:**

```ts
interface PortfolioLegal {
  privacyPolicyUrl?: string;
  termsAndConditionsUrl?: string;
  refundPolicyUrl?: string;
  gstNumber?: string;
  companyRegistrationDetails?: string;
}
```

---

## Implementation Order (Suggested)

1. **Hero:** Add `heroHeadline`, `heroSubheading`, `heroCtaText`, `heroCtaLink`, `heroTrustBadge` (or single trust line).
2. **About founder:** Add `missionStatement`, `projectsCompletedCount`, `teamPhotoUrl`, `teamMembers` (optional).
3. **Services:** Introduce `PortfolioServiceItem` and `servicesDetailed` (or replace `services` with it and migrate).
4. **Portfolio:** Add `clientName` to freelance (and optionally featured) projects; optional before/after or screenshots.
5. **Testimonials:** Add `videoUrl`, `companyName` (and optionally `source`) to testimonial items.
6. **Social proof:** New section with `clientLogos`, `clientsServedCount`, `citiesOrRegionsServed`, social links, workshops, awards.
7. **FAQ:** New `faqItems` array.
8. **Contact:** Add `calendarBookingUrl`, `officeAddress`.
9. **Legal:** New `legal` block (privacy, terms, refund, GST, company details).

---

## Files to Touch (Admin Codebase)

- **Types & state:**  
  `src/redux/slices/portfolioSlice.ts`, `src/portfolio-display/types.ts`
- **Form config:**  
  `src/pages/Dashboard/portfolioFields.ts` (sections, new fields, default values)
- **New field components (if needed):**  
  - `ServiceItemArrayField` (for rich services)  
  - `FaqArrayField` (question/answer)  
  - `ClientLogoArrayField` or reuse `MediaArray` with type “client logo”  
  in `src/common/components/DynamicForm/fields/`
- **Field renderer:**  
  Register new field types in `DynamicForm/FieldRenderer.tsx` and `fields/index.ts`
- **Display:**  
  `src/portfolio-display/PortfolioDisplay.tsx` (and portfolio site) to render new sections and fields
- **Docs:**  
  `PORTFOLIO_WEBSITE_CHECKLIST.md` — extend with new sections and field-by-field display reference

---

## Backward Compatibility

- Keep existing fields that the PDF doesn’t remove (e.g. `positioningLine`, `skills`, `education`, `experience`).
- For `services`: either keep string array and add `servicesDetailed`, or migrate to new structure with a one-time default so existing data doesn’t break.
- When adding optional fields (e.g. `videoUrl`, `companyName` on testimonials), use optional props so existing documents still load.

This checklist aligns the admin with the trust-focused website structure so you can manage all recommended sections from one dashboard.
