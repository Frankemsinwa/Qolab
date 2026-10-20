# QOLAB Website — Implementation Plan
**Goal:** Transform the current site into a high-class creative-technology agency platform, aligned 1:1 with the client's two source documents.

**Sources (extracted from project root):**
- `QOLAB PRD Designed.docx` — Website PRD v1.0 · 14 October 2026
- `QOLAB_Onboarding_SOP.docx_20260423_201505_0000.pdf` — Client Onboarding SOP v1.0 · Lagos, Nigeria

**Status legend:** `[ ]` todo · `[~]` done · `[!]` blocked/needs client confirmation

---

## 0. Canonical Brand Reference (use everywhere — never paraphrase slogans)

| Element | Exact wording |
|---|---|
| Primary headline | **Some Ideas Deserve to Exist.** |
| Official slogan | **Future Ready Solutions.** (exact wording, lockup: `QOLAB — Future Ready Solutions.`) |
| Eyebrow / tagline | **CREATIVITY × TECHNOLOGY × STRATEGY** |
| Descriptor | Creative technology company / creative technology agency |
| Core message | Qolab brings creativity, technology, and strategy together to turn ambitious thinking into meaningful solutions. |
| Personality | Curious, bold, intelligent, inventive, collaborative, trustworthy |
| Voice | Concise, confident, human, imaginative, clear |
| Writing rule | Memorable headline + plain-language body. No jargon, no generic agency language, no unsupported performance claims. |

---

## 1. Flags — confirm with client `[!]`

- **[!] F1. Contact email.** PRD 7.8: `hello.qolab@gmail.com`. Site currently shows `hello@qolab.digital` (multiple pages). Default to PRD; confirm which is final.
- **[x→] F2. Location.** **RESOLVED (client):** Nigeria & UK presence — founder in Nigeria, cofounder in UK. Site now shows NG/UK flag pair + "Nigeria & UK" in hero, and "Nigeria & UK" on contact/about. (City-level Lagos vs Abuja no longer displayed anywhere; SOP doc header still says Lagos.)
- **[!] F3. Unverified claims to remove/replace (PRD 09/11 forbid unsupported claims):**
  - Hero: "450+ Global Customers" social proof → remove pending real numbers.
  - About stats: "4+ Years Running · 50+ Projects Shipped · 30+ Happy Clients · 12 Team Members" → confirm real figures or remove.
- **[!] F4. Portfolio.** Current case studies (LUXEL BOOKINGS, AETHER SUITE, MUSE EXPERIMENTAL, APEX DIGITAL SYSTEM) are fictional. PRD: only approved work may be published. Keep structure; swap content when client delivers real case studies.
- **[!] F5. Testimonials.** Current 5 ticker quotes are fictional placeholders. PRD: approved testimonials only. Structure ships now; content replaced when client delivers.
- **[!] F6. Final primary CTA.** PRD Open Decision #1 offers three options. Plan uses **"Let's Make It Exist."** (hero + contact per 7.1/7.8). One-line swap if client picks another.
- **[!] F7. Form delivery backend.** SOP requires Tally/Typeform or custom form with automated responses. Current form is client-side only (no endpoint). MVP ships validated form + success state; wire Tally/Typeform/custom endpoint after client decides (PRD Open Decision #4: email vs CRM).
- **[!] F8. Services detail pages.** PRD Open Decision #2. Current build already has per-service detail flow — keep it, repopulate with the 6 official services.
- **[!] F9. Social share image.** OG image asset needed (designed 1200×630 lockup) — `og:image` meta intentionally omitted until asset exists.

---

## 2. Implementation Tasks

### Phase A — Global foundation ✅ DONE (2026-10-19)

- [x] **A1. `index.html` — metadata (PRD 10).**
  Title: `QOLAB — Some Ideas Deserve to Exist.`
  Added: meta description, canonical (`https://qolab.vercel.app/`), Open Graph + Twitter tags, `theme-color` `#0f0f11`. (No `og:image` yet — see F9.)
- [x] **A2. CTA funnel — one door (SOP Stage 1).**
  Hero primary CTA → contact (`Let's Make It Exist.`); hero secondary → works (`Explore Our Work`); home final CTA button now wired to contact; ServicesPage + ServiceDetail CTAs → `Let's Make It Exist.` (ServiceDetail got new `onNavigateToContact` prop, wired in App). No WhatsApp links anywhere.
- [x] **A3. Reduced motion (PRD 09).** Global `prefers-reduced-motion` CSS rule + GSAP guards in all 9 animated components; ApproachSection gets a static stacked-card layout under reduced motion.
- [x] **A4. Cleanup unused components.** Deleted: `Loader.tsx`, `Manifesto.tsx`, `Contact.tsx`, `ProjectEditorial.tsx`, `SilhouetteSequence.tsx`, `CanvasBackground.tsx`, `utils/audio.ts` (only used by dead code).
- [x] **A5. Nav completeness.** Hero top nav + mobile menu now Home · About · **Services** · Works · Contact; Navigation overlay reordered to Home · About · Services · Work · Contact.

### Phase B — Home page (`LandingHero.tsx` + section components)

- [x] **B1. Hero rewrite (PRD 7.1).**
  - Eyebrow: `CREATIVITY × TECHNOLOGY × STRATEGY`
  - H1: `Some Ideas Deserve to Exist.`
  - Sub: `We don't follow the future. We make it. We bring creativity, technology, and strategy together to turn ambitious thinking into meaningful solutions.`
  - Primary CTA: `Let's Make It Exist.` → contact/application
  - Secondary CTA: `Explore Our Work.` → works
  - Slogan lockup: `QOLAB — Future Ready Solutions.`
  - Remove: "450+ Global Customers" (see F3), old "Check Our Works"/"Our Story" buttons.
- [x] **B2. Differentiation section (PRD 7.5).** New statement section: headline **"We Don't Believe in Thinking Inside the Brief."** + body: Qolab questions assumptions, looks for overlooked opportunities, treats creativity, technology, and strategy as connected disciplines — not separate deliverables. Place before the process section.
- [x] **B3. Process section (PRD 7.4).** Rebuild `ApproachSection` (currently 3 pillars) into the 5 official steps, exact copy:
  1. `Question Everything` — Understand the challenge and uncover the real problem.
  2. `Find the Angle` — Define the direction, priorities, and plan.
  3. `Make It Real` — Design, develop, experiment, and build.
  4. `Make It Better` — Test, refine, and improve the solution.
  5. `Keep What's Next in Mind` — Identify future opportunities and room to evolve.
- [x] **B4. Collaboration section (PRD 7.6).** Statement: **"No Great Thing Is Built From One Piece."** + body on disciplines/perspectives producing stronger solutions; light Q-puzzle visual motif (do not force the metaphor). Tie to SOP collective model line: *"We do not assign you one person. We build you a team around your brand."*
- [x] **B5. Home CTA section (PRD 7.7).** Replace "Let's build something remarkable together." with **"The Future Is Not a Spectator Sport."** + supporting copy (imagination → tangible brands, products, platforms, smarter ways of working). Button: `Start Something With Qolab.` → contact.
- [x] **B6. Footer (PRD 08/09).**
  - Statement: `Still curious. Still building.`
  - Slogan lockup: `QOLAB — Future Ready Solutions.`
  - Contact email per F1; Services column links updated to the 6 official services; © 2026 Qolab. All rights reserved.
- [x] **B7. Testimonials ticker — section removed entirely (client instruction); re-add with verified content when F5 lands.**

### Phase C — Services (`ServicesCarousel.tsx`, `ServicesPage.tsx`, `ServiceDetail.tsx`)

- [x] **C1. Replace 10 current services with the 6 official services (PRD 7.3), exact scope copy:**
  1. `Brand Identity & Design` — Brand strategy, visual identity, art direction, guidelines, and digital assets.
  2. `Website Design & Development` — Business websites, e-commerce, web applications, and digital platforms.
  3. `Software & App Development` — Custom software, web applications, mobile apps, and product development.
  4. `AI Solutions & Automation` — AI-enabled solutions, intelligent workflows, and repetitive-process automation.
  5. `Digital Marketing & Growth Strategy` — Brand positioning, marketing strategy, campaigns, and growth planning.
  6. `Business Strategy & Consulting` — Business analysis, operational direction, opportunity identification, and practical growth planning.
  Update every surface: carousel, ServicesPage grid, ServiceDetail `RELATED_SERVICES`, footer links.
- [x] **C2. ServicesPage process block** ("How we work") → same 5 official process steps as B3.
- [x] **C3. Service detail pages:** rewrite overview/process copy per service scope; CTA → `Let's Make It Exist.`; related-services cards drawn from the 6.
- [x] **C4. Do not present fintech or cybersecurity anywhere (PRD 7.3 note).**
- [x] **C5. Service images:** reuse/adapt current assets; identify missing art for new service names.
  - Mapping: Brand Identity → `Brand strategy.jpg`; Website Dev → Unsplash code photo; Software/Apps → Unsplash mobile photo; AI → Unsplash AI photo; Digital Marketing → `digital- marketing.jpg`; Business Strategy → `Experiential.jpg` (placeholder — **missing dedicated art**, needs client/photography).
  - Now unused on disk (kept): `Product-design.jpg`, `Motion design.jpg`, `seo.jpg`.
  - Canonical list lives in `src/data.ts` → `servicesData` (carousel, ServicesPage, ServiceDetail related all read from it).

### Phase D — About (`AboutPage.tsx`)

- [x] **D1. Rewrite narrative (PRD 7.2):** creative thinking + engineering + business strategy as one practice; journey from possibility to practical execution; collaboration model tied to the Q-puzzle mark. Voice per §0.
- [x] **D2. Stats row** → per F3 (confirmed numbers or removal).
- [x] **D3. Story:** Nigeria-based creative collective, founded 2024 — confirm facts with client (F3/F4 adjacent).

### Phase E — Contact / Application (`ContactPage.tsx`) — biggest rebuild

- [x] **E1. Page copy (PRD 7.8).**
  H1: `So, What's the Big Idea?`
  Sub: `Bring the question. Bring the ambition. Bring the unfinished idea. Let's see what it could become.`
  Form heading: `Tell us what you're imagining.`
  Submit: `Let's Make It Exist.`
- [x] **E2. Form = SOP qualification application (Stage 2), client-facing fields:**
  - A — Full name*, Email*, Business name*, Website/social (optional)
  - B — What does your business do?* · Who do you serve?* · Stage: Idea / Early / Growing / Established*
  - C — Needs (multi-select)*: Brand identity and design · Website design and development · Marketing strategy and content · Full brand build — all of the above
  - D — What is currently not working with your brand or marketing?* · What have you tried before, and why did it not work?*
  - E — Where do you want your brand to be in 6 to 12 months?*
  - F — Budget range* (required): ₦500,000–₦1,500,000 ($300–$1,000) · ₦1,500,000–₦3,500,000 ($1,000–$2,300) · ₦3,500,000+ ($2,300+) · I am not sure yet
  - G — Ready to invest properly? Yes / Not yet* · Timeline: Immediately / Within 1 month / Within 3 months / Just exploring*
- [x] **E3. Behaviour:** client-side validation, accessible labels + required markers, honeypot spam field, clear privacy notice line. Backend wiring deferred (F7).
- [x] **E4. Success state (PRD 08 + SOP Stage 2 tone):**
  `Something's in motion. We'll be in touch.`
  + `Your application has been received and will be reviewed by our lead strategist. If we believe there is a strong fit, you will receive a personalised invitation to a Strategy Session within 24 to 48 hours.`
- [x] **E5. Contact details block:** email per F1; no WhatsApp (SOP: one door).

### Phase F — Polish (PRD 08/10)

- [x] **F-a. Microcopy swaps:** portfolio intro (`ProjectShowcase`/Work page header): `Proof that ideas have a way of becoming real.` · project inquiry button: `Let's make it exist.` · footer: `Still curious. Still building.`
- [x] **F-b. 404 view:** `Looks like this piece doesn't fit.` + `Find your way back.` → homepage. (App is state-based SPA; add unknown-path fallback in `App.tsx`/`main.tsx`.)
- [x] **F-c (N/A � Loader deleted in A4). Loading microcopy:** `Assembling possibilities...` — only if Loader is kept (A4 decision).
- [x] **F-d. Q-puzzle mark motion (PRD 09):** subtle piece-assembly animation for the Q logo (loader or hero), disabled under reduced motion.
- [x] **F-e. Accessibility pass:** focus states, alt text, semantic headings, contrast (green `#3a863f` on white passes AA for large text; verify small-text usages).

---

## 3. Acceptance Criteria (PRD 12 → mapped)

| PRD criterion | Covered by |
|---|---|
| "Some Ideas Deserve to Exist." is the primary homepage headline | B1 |
| "Future Ready Solutions." retained as official slogan | B1, B6 |
| Positioning + services understandable without reading every page | B1, C1 |
| Primary CTAs lead to contact/application journey | A2, B1, B5, E1 |
| Contact form validates, communicates success, handles errors accessibly | E2–E4 |
| Responsive, keyboard-usable, modern browsers | existing + F-e |
| Page metadata + social previews configured | A1 |
| Only approved work/claims public | F1–F5 (content swaps pending client) |

---

## 4. Suggested execution order
1. Phase E (contact/application — core business flow per SOP)
2. Phase B (home hero + statements + process + CTA)
3. Phase C (services 10 → 6)
4. Phase D (about)
5. Phase A (global: metadata, CTAs, cleanup, nav)
6. Phase F (polish, 404, microcopy, motion)

*Copy decisions follow the writing rule: memorable headline, plain-language body, zero unsupported claims.*
