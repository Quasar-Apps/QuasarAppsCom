# Quasar Apps — Engineering Roadmap

A prioritized, end-to-end plan to take the QuasarAppsCom site from "AI-scaffolded
prototype" to a hardened, discoverable, maintainable production product.

This roadmap is derived from a full-project review covering **security, frontend
architecture, accessibility, performance, SEO/content, and developer experience**.
It captures **every** finding, grouped into sequenced phases with concrete steps,
affected files, and acceptance criteria so the work can be picked up and shipped
incrementally.

> **Status:** proposed. Nothing here is implemented yet (the only review items
> already shipped are the PR&nbsp;#2 fixes: list-endpoint sort, test skip-guard,
> uuid test ids, junk-file removal, repo-relative report paths — these are
> intentionally excluded below).

---

## How to read this

- **Severity** — `P0` critical / must-ship-first · `P1` high (production-readiness) ·
  `P2` medium (quality/correctness) · `P3` low (polish/hygiene).
- **Effort** — rough engineering size: `S` ≤ half day · `M` ~1–2 days · `L` ~3–5 days.
- **ID** — stable handle (e.g. `SEC-1`) used in the checklist and suggested PR slicing.
- Each item lists the **files** it touches, the **problem**, **implementation steps**,
  and **acceptance criteria** (definition of done).

### Phase overview

| Phase | Theme | Goal | Severity focus | Est. |
|------:|-------|------|----------------|-----:|
| **0** | Critical Security | Close the data-leak and abuse vectors | P0–P2 | ~1 day |
| **1** | Production Hardening & De-Emergent | Make it a real, discoverable company site | P0–P1 | ~3 days |
| **2** | Accessibility | Meet WCAG AA baseline | P0–P3 | ~2 days |
| **3** | Architecture & Dependency Cleanup | Remove scaffold cruft, add safety nets | P1–P3 | ~3 days |
| **4** | Performance & Media | Fix LCP/CLS, trim payloads | P1–P3 | ~1–2 days |
| **5** | Testing & Quality Gates | Make quality enforceable & repeatable | P1–P2 | ~2 days |
| **6** | Content & Hygiene Polish | Truthful copy, clean repo | P2–P3 | ~1 day |

**Sequencing principle:** Phase 0 is independently shippable and should go first.
Phases 1–2 make the site production-worthy and accessible. Phases 3–6 pay down
debt and can interleave. Most items are isolated enough to ship as small PRs
(see [Suggested PR slicing](#suggested-pr-slicing)).

---

## Phase 0 — Critical Security

> One afternoon of work closes the only genuinely *dangerous* gaps. Ship as a
> single focused PR before the site handles real traffic.

### SEC-1 · Lock down the unauthenticated contact-data endpoint `P0` `S`
- **Files:** `backend/server.py` (`GET /api/contact`, ~L212–220)
- **Problem:** `GET /api/contact` returns **every** stored submission (name, email,
  company, message body) to any anonymous caller — a live PII leak / reportable
  breach under GDPR/CCPA.
- **Steps:**
  1. Decide the contract: the admin already receives each lead by email, so the
     read endpoint has no public purpose. Prefer **removing** it.
  2. If an admin view is needed later, gate it behind an `ADMIN_API_KEY` secret via
     a FastAPI `Depends` dependency (constant-time compare of an
     `Authorization: Bearer …` / `X-API-Key` header against an env var).
  3. Add a regression test asserting `GET /api/contact` returns `401/404` without auth.
- **Done when:** the lead database is not reachable unauthenticated; test proves it.

### SEC-2 · Remove (or auth) the dead `/status` feature `P1` `S`
- **Files:** `backend/server.py` (`StatusCheck` model, `POST/GET /api/status`)
- **Problem:** Leftover Emergent scaffolding: `GET /api/status` dumps a collection
  and `POST /api/status` lets anyone write arbitrary rows — no product purpose.
- **Steps:** delete the `StatusCheck`/`StatusCheckCreate` models and both routes;
  drop their tests in `backend/tests/test_quasar_api.py` (`TestStatus`).
- **Done when:** no `/status` routes exist; suite still green.

### SEC-3 · Fix the CORS credentials + wildcard combination `P1` `S`
- **Files:** `backend/server.py` (`add_middleware(CORSMiddleware, …)`, ~L225–231)
- **Problem:** `allow_credentials=True` with `allow_origins=['*']` (the committed
  default) makes Starlette **reflect any Origin** and return
  `Access-Control-Allow-Credentials: true` — it green-lights credentialed
  cross-origin calls from any website. `allow_methods=['*']` and `allow_headers=['*']`
  widen the surface further. On a **default deploy this compounds `SEC-1` into a P0
  data-exposure chain** (any site can read the open PII endpoint from a victim's
  browser), so treat it as P0-adjacent, not an isolated P1.
- **Steps:**
  1. Set `allow_credentials=False` (nothing here uses cookies), **or** pin
     `allow_origins` to the explicit production frontend origin(s).
  2. Pin `allow_methods` / `allow_headers` to what the API actually uses instead of `*`.
  3. `.strip()` each entry parsed from `CORS_ORIGINS`.
  4. Never combine `*` with credentials.
- **Done when:** CORS disallows credentials or pins real origins, methods, and headers.

### SEC-4 · Rate-limit and de-abuse the contact POST `P1` `M`
- **Files:** `backend/server.py` (`POST /api/contact`), `backend/requirements.txt`
- **Problem:** No throttle/CAPTCHA; each request writes Mongo **and** sends a real
  Resend email — loopable to flood the inbox, burn email billing, and bloat the DB.
  `reply_to` is attacker-controlled (reflection vector).
- **Steps:**
  1. Add `slowapi` (or equivalent) IP-keyed rate limiting, e.g. `5/minute` on the route.
  2. Add a hidden honeypot field and/or a Turnstile/reCAPTCHA token check before send.
  3. Validate/normalize `reply_to`; consider not trusting it as the reply target.
- **Done when:** abusive request rates are rejected; spam path is mitigated.

### SEC-5 · Add input length & payload-size limits `P1` `S`
- **Files:** `backend/server.py` (`ContactMessageCreate`), proxy/ASGI config
- **Problem:** `name`/`company`/`message` are unbounded strings → multi-MB emails,
  giant DB rows, amplification DoS.
- **Steps:** add Pydantic constraints — `name: Field(min_length=1, max_length=100)`,
  `company: Field(None, max_length=150)`, `message: Field(min_length=1, max_length=5000)`;
  enforce a request body-size cap at the proxy/middleware layer.
- **Done when:** oversized payloads return `422`; body size is bounded.

### SEC-11 · Verify Resend sending domain (operational) `P2` `S`
- **Problem:** `from: noreply@quasarapps.com` only delivers if the domain is
  verified in Resend with SPF/DKIM; failures are currently silently swallowed (see SEC-8).
- **Steps:** confirm domain verification; ties into SEC-8 so failures surface.

---

## Phase 1 — Production Hardening & De-Emergent

> Turn a builder-preview into a real company site: strip the builder's
> attribution/scripts, make it discoverable, and stand up basic engineering hygiene.

### De-Emergent baggage

#### SEO-5 · Remove the "Made with Emergent" badge, external script & analytics `P1` `S`
- **Files:** `frontend/public/index.html` (badge anchor, `emergent-main.js`, inline PostHog)
- **Problem:** A production company site ships a third-party builder badge, an
  external `emergent-main.js`, and an inline PostHog snippet with a live key.
- **Steps:** delete the `#emergent-badge` anchor and the `emergent-main.js` `<script>`;
  remove or re-home the PostHog snippet behind the company's own managed analytics config.

#### SEO-4 · Self-host the favicon and logo `P1` `S`
- **Files:** `frontend/public/index.html`, `Navigation.js`, `Footer.js`, `Hero.js`
- **Problem:** favicon/apple-touch-icon and the in-app logo hot-link to
  `customer-assets.emergentagent.com/job_…` — breaks if Emergent rotates the path.
- **Steps:** download the logo, commit to `frontend/public/` (`favicon.ico`,
  `apple-touch-icon.png`, `logo.png`); reference local paths; replace the hardcoded
  remote URL constants in the three components with a shared local asset import.

#### SEO-7 / PERF-6a · Drop the unused Inter font `P1` `S`
- **Files:** `frontend/public/index.html` (Google Fonts `Inter` link + preconnects)
- **Problem:** `index.html` loads `Inter:wght@600`, which `design_guidelines.json`
  forbids **for headings** ("Do not use generic sans for headings") — not a blanket
  ban. Here it isn't used by the UI at all (only the Emergent badge consumes it), so
  it's a wasted render-blocking request. The real fonts (Outfit + IBM Plex Sans)
  already load via `src/index.css`.
- **Steps:** remove the Inter `<link>` (and now-unneeded preconnects) when removing the badge.
- **Note:** this is the Inter-removal subset of `PERF-6`; the rest of the font work lives in Phase 4.

#### SEO-8 · Correct `theme-color` to brand background `P1` `S`
- **Files:** `frontend/public/index.html`
- **Problem:** `theme-color` is `#000000`; brand background is `#050211`.
- **Steps:** set `<meta name="theme-color" content="#050211">`.

### SEO foundation

#### SEO-1 · Add SSR/prerendering so crawlers see real content `P0` `L`
- **Files:** build pipeline (`frontend/`), routing
- **Problem:** Client-only CRA SPA — crawlers and all social/link-preview bots get
  an empty `<div id="root">`. Case-study content is fetched after load. The site is
  effectively invisible for organic discovery.
- **Steps (pick one):**
  - **Build-time prerender (lighter):** add `react-snap` / `react-snapshot` to emit
    static HTML for `/` (and each `/case-study/:slug`). ⚠️ Case-study copy is fetched at
    runtime from `/api/case-studies` (`CaseStudies.js`, `CaseStudyPage.js`), so a snapshot
    only captures real content if the API is **reachable at build time** — snapshot
    against a live/seeded API, or move the seed `CASE_STUDIES` into the build. Without
    that, prerender covers only the static `/` route.
  - **Framework migration (durable):** move to Next.js (SSG/ISR) — larger effort, best
    long-term for a content/marketing site, and the cleanest path for the dynamic
    case-study pages.
- **Done when:** `view-source` of `/` contains real headings/copy; case-study URLs do too
  **once** their data is available at build time (or via the SSG path).

#### SEO-2 · Per-route `<title>`/meta with a head manager `P0` `M`
- **Files:** `frontend/src/App.js`, `pages/*.js`, new head usage
- **Problem:** Every route shares one static title/description; case-study pages have
  no unique title, description, or canonical.
- **Steps:** add `react-helmet-async`; set unique `<title>`, `<meta description>`,
  `<link rel="canonical">`, and per-route OG/Twitter tags driven by case-study data.
- **Done when:** each route emits distinct, accurate head metadata.

#### SEO-3 · Open Graph & Twitter Card tags `P1` `S`
- **Files:** `frontend/public/index.html` (defaults) + per-route via SEO-2
- **Problem:** Shared links render as bare URLs (no image/title/description).
- **Steps:** add `og:title/description/image/url/type` and `twitter:card=summary_large_image`;
  host a 1200×630 brand image; override per route once Helmet is in place.

#### SEO-6 · Add robots.txt, sitemap.xml, manifest.json, JSON-LD `P1` `M`
- **Files:** `frontend/public/`
- **Problem:** `public/` contains only `index.html`. No crawl directives, no
  sitemap, no PWA manifest, no structured data.
- **Steps:** add `robots.txt` (allow + `Sitemap:` line); generate `sitemap.xml`
  for `/` and each case-study slug; add `manifest.json` + `<link rel="manifest">`;
  inject a JSON-LD `Organization` block (name, url, logo, `sameAs` GitHub/LinkedIn, contactPoint).

### DevEx foundation

#### DX-1 · Continuous Integration + branch protection `P0` `M`
- **Files:** new `.github/workflows/ci.yml`
- **Problem:** No CI exists — nothing builds/lints/tests on push; `develop→main`
  has no quality gate.
- **Steps:** add a workflow running on PR/push — **backend job** (install,
  `flake8`/`black --check`/`mypy`, `pytest` against an ephemeral Mongo once tests are
  hermetic — see TEST-1), **frontend job** (`yarn install --frozen-lockfile`,
  `yarn build`, eslint). Enable branch protection on `main` requiring the check.
- **Done when:** PRs show passing/failing checks; `main` requires green CI.

#### DX-2 · Real README `P0` `S`
- **Files:** `README.md` (currently `# Here are your Instructions`)
- **Steps:** project overview, tech stack, prerequisites, backend run
  (`uvicorn server:app --reload`), frontend run (`yarn && yarn start`), env-var
  table, and how to run tests.

#### DX-3 · `.env.example` files `P1` `S`
- **Files:** new `backend/.env.example`, `frontend/.env.example`
- **Problem:** `server.py` hard-crashes on missing `MONGO_URL`/`DB_NAME`; required
  vars live only as prose in `memory/PRD.md`.
- **Steps:** document every key with safe defaults/comments — backend
  (`MONGO_URL`, `DB_NAME`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `CORS_ORIGINS`,
  and new `ADMIN_API_KEY` from SEC-1), frontend (`REACT_APP_BACKEND_URL`).

#### DX-4 · Replace boilerplate frontend README `P1` `S`
- **Files:** `frontend/README.md`
- **Problem:** Default CRA text; references `npm`/`eject` but the project uses
  **Yarn + CRACO**.
- **Steps:** project-specific instructions (`yarn start` via craco,
  `REACT_APP_BACKEND_URL`, the `health-check` plugin toggle).

---

## Phase 2 — Accessibility (WCAG AA baseline)

> None of this needs architectural rework. The three systemic gaps (motion, focus,
> contrast) are highest-leverage.

### A11Y-1 · Respect `prefers-reduced-motion` `P0` `S`
- **Files:** `src/index.css`, `Hero.js` (+ any infinite Framer loops)
- **Problem:** No reduced-motion handling across a very animation-heavy UI
  (infinite floating logo/chevron loops, scroll reveals, smooth scroll).
- **Steps:** add a global `@media (prefers-reduced-motion: reduce)` block neutralizing
  animations/transitions/`scroll-behavior`; gate Framer infinite loops with
  `useReducedMotion()`.

### A11Y-2 · Visible focus indicators on custom controls `P0` `S`
- **Files:** `src/index.css` (`.btn-primary`, `.btn-secondary`, `.nav-link`,
  `.glass-card`/`.case-study-glass`/`.team-glass-card`)
- **Problem:** Custom button/card/link classes define `:hover` but no
  `:focus`/`:focus-visible`; keyboard users can't see focus.
- **Steps:** add a high-contrast `:focus-visible` ring (e.g. `outline: 2px solid #fff;
  outline-offset: 3px` or a magenta `box-shadow` ring) to all interactive classes.

### A11Y-3 · Fix tertiary-grey contrast failure `P1` `S`
- **Files:** `src/index.css` (`--text-tertiary: #68647D`)
- **Problem:** `#68647D` on `#050211` ≈ 3.62:1 — fails AA (4.5:1) for the small
  labels/links/placeholder it's used on.
- **Steps:** lighten to ~`#8B879E` (≈5.9:1 — comfortably clears AA), or restrict the
  color to non-essential decoration.

### A11Y-4 · Fix accent-text contrast `P1` `S`
- **Files:** components using `text-[#D111A2]`/`text-[#9D4CDD]` eyebrow labels
- **Problem:** magenta `#D111A2` ≈ 4.22:1, purple `#9D4CDD` ≈ 4.41:1 on the background —
  both fail AA (4.5:1) for the `text-xs` labels.
- **Steps:** use a lighter shade for *text* use (e.g. `#E84FC4` ≈ 6.2:1) or enlarge
  eyebrow labels to large-text size; keep the original colors for icons/decoration.

### A11Y-5 · Skip-to-content link + `<main>` landmark `P1` `S`
- **Files:** `HomePage.js`, `CaseStudyPage.js`
- **Steps:** add a visually-hidden, focus-visible "Skip to content" anchor as the
  first focusable element; wrap page content in `<main id="main-content">`.

### A11Y-6 / A11Y-7 · Section labelling `P1` `S`
- **Files:** all section components, `CaseStudyPage.js`
- **Problem:** `<section>`s have `id`s but no accessible name, so they aren't exposed
  as landmarks; eyebrow label is announced disconnected from its `<h2>`.
- **Steps:** add `aria-labelledby` pointing at each section heading (or `aria-label`
  where there is no visible heading, e.g. GitHubCallout).

### A11Y-13 · Accessible mobile menu `P2` `M`
- **Files:** `Navigation.js`
- **Problem:** Hamburger toggle has no `aria-label`/`aria-expanded`/`aria-controls`;
  the open overlay is not a focus-trapped dialog and doesn't close on `Escape`.
- **Steps:** add `aria-label`/`aria-expanded`/`aria-controls`; make the overlay
  `role="dialog" aria-modal="true"`; trap focus, move focus in on open and restore on
  close, close on `Escape`.

### A11Y-14 · Focus management on route change `P2` `S`
- **Files:** `App.js`, `pages/*.js`
- **Steps:** on navigation, move focus to the page `<h1>` (`tabIndex={-1}`) or a
  visually-hidden `role="status"` route announcer.

### A11Y-8 / A11Y-9 / A11Y-10 · Accessible contact form feedback `P2` `M`
- **Files:** `Contact.js`
- **Steps:** add inline `role="status"`/`role="alert"` messaging tied to the form;
  `aria-hidden` the required `*` and add a legend; add `aria-invalid` +
  `aria-describedby` field errors and move focus to the first invalid field.

### A11Y-12 · Name the scroll-indicator button `P2` `S`
- **Files:** `Hero.js`
- **Steps:** add `aria-label="Scroll to services"` to the icon-only button.

### A11Y-15 · Trim verbose alt text `P3` `S`
- **Files:** `Testimonials.js`, `CaseStudies.js`, `Team.js`, `CaseStudyPage.js`
- **Steps:** drop redundant "photo"/"image"/"thumbnail" suffixes from alt text.

> Notes on deferred a11y items:
> - `A11Y-11` (dead `href="#"` Privacy/Terms links) → handled with the content fix in **Phase 6 (`SEO-15`)**.
> - `A11Y-16` (color used as the *sole* carrier of state, e.g. nav hover) → largely resolved once focus (`A11Y-2`) and contrast (`A11Y-4`) land; no separate work.
> - `A11Y-17` (per-route `document.title`) → covered by **`SEO-2`** (head metadata).

---

## Phase 3 — Architecture & Dependency Cleanup

> Mostly deletion and small refactors. High value, low risk.

### FE-1 / PERF-2 · Delete dead shadcn UI & purge frontend deps `P1` `M`
- **Files:** `frontend/src/components/ui/` (46 files), `frontend/src/hooks/use-toast.js`,
  `frontend/src/lib/utils.js`, `frontend/package.json`
- **Problem:** Nothing imports `components/ui/*`; it's the only consumer of ~40 deps —
  all **27** `@radix-ui/react-*` packages, `embla-carousel-react`, `cmdk`, `vaul`,
  `input-otp`, `react-day-picker`, `react-resizable-panels`, `next-themes`,
  `class-variance-authority`, and `react-hook-form` (via `ui/form.jsx`). Separately,
  `recharts`, `@hookform/resolvers`, `zod`, `react-fast-marquee`, and `date-fns` are
  imported **nowhere at all** (not even by `ui/`).
- **Steps:** delete `ui/` and `src/lib/utils.js` (unless adopting shadcn; `use-toast.js`
  is handled in `FE-9`); prune `package.json` to the real set — `react`, `react-dom`,
  `react-router-dom`, `framer-motion`, `lucide-react`, `axios`, `sonner`. (`clsx` and
  `tailwind-merge` are imported **only** by the deleted `utils.js`, so they go too.)
  Re-lock and verify `yarn build`.
- **Done when:** build passes with the trimmed dependency list.

### SEC-10 / PERF-1 · Slim the backend dependencies `P1` `S`
- **Files:** `backend/requirements.txt`, new `backend/dev-requirements.txt`
- **Problem:** `server.py` imports only FastAPI/Starlette/motor/pydantic/dotenv/resend,
  yet requirements pin `openai`, `litellm`, `google-genai`, `boto3`, `pandas`, `numpy`,
  `stripe`, `huggingface_hub`, `emergentintegrations`, unused auth libs
  (`python-jose`, `PyJWT`, `passlib`, `ecdsa`), etc. (~600MB–1GB; large CVE surface).
- **Steps:** reduce runtime requirements to what's imported — `fastapi`, `starlette`
  (a direct import at `server.py:3`, though it also rides in via `fastapi`), `uvicorn`,
  `motor`/`pymongo`, `pydantic`, `email-validator`, `python-dotenv`, `resend`, plus
  `slowapi` (from SEC-4). Move `pytest`, `requests` (the live-HTTP suite's only HTTP
  client), `black`/`flake8`/`mypy`/`isort` to `dev-requirements.txt`. Drop
  `python-multipart` — the API takes only JSON (no `Form`/`File`), so nothing needs it
  until a multipart endpoint is added.
- **Done when:** prod image installs only what runs; app boots; tests pass.

### FE-2 · Remove the non-functional Tailwind token layer `P2` `S`
- **Files:** `frontend/tailwind.config.js`, `src/index.css`
- **Problem:** The config references `hsl(var(--foreground))`/`--primary`/`--card`/
  `--border`/`--ring`… but `index.css` never defines those, and defines `--background`
  as a *hex* (so `hsl(#050211)` is invalid). Every semantic Tailwind **color** utility
  is therefore silently broken; the app only works because colors are hardcoded inline.
  Note: `--radius` is **not** dead — `borderRadius.lg/md/sm` read it and
  `tailwindcss-animate` relies on it, so leave it in place.
- **Steps:** delete the vestigial `colors` token block, **or** commit to a real token
  system by defining the HSL channels and refactoring components to `text-primary` etc.
  Leave `--radius` and the `borderRadius` scale alone. Don't keep the half-state.

### FE-3 · Shared API client `P1` `S`
- **Files:** new `frontend/src/lib/api.js`; `Contact.js`, `CaseStudies.js`, `CaseStudyPage.js`
- **Problem:** The `BACKEND_URL`/`API` constant + bare `axios` calls are duplicated
  across three files (no base instance, timeout, or shared error handling).
- **Steps:** create `api.js` exporting an `axios.create({ baseURL, timeout })` instance
  plus helpers (`getCaseStudies()`, `getCaseStudy(slug)`, `postContact()`); import everywhere.

### FE-4 · Catch-all 404 route `P1` `S`
- **Files:** `frontend/src/App.js`, new `NotFound` component
- **Problem:** Only `/` and `/case-study/:slug` exist; any other URL renders a blank page.
- **Steps:** add `<Route path="*" element={<NotFound />} />` reusing `Navigation`/`Footer`
  (extract the CaseStudyPage not-found block as the template).

### FE-5 · Top-level error boundary `P1` `S`
- **Files:** `frontend/src/App.js`
- **Problem:** Any render-time throw white-screens the whole site.
- **Steps:** wrap `<BrowserRouter>` in a small hand-rolled `ErrorBoundary`
  (`getDerivedStateFromError`) rendering a branded fallback.

### FE-6 · Robust data fetching `P1` `S`
- **Files:** `CaseStudies.js`, `CaseStudyPage.js`
- **Problem:** `useEffect` fetches have no abort/cleanup (state-set after unmount,
  races on slug change); `CaseStudies.js` swallows errors to an empty list; the same
  `/case-studies` is fetched twice with no cache.
- **Steps:** add `AbortController` + cleanup; give `CaseStudies.js` an error state;
  consider a lightweight cache or `@tanstack/react-query` if fetching grows.

### FE-7 · Extract hardcoded content to data modules `P2` `S`
- **Files:** `Team.js`, `Services.js`, `Testimonials.js`, `About.js`,
  `Navigation.js`, `Footer.js` → new `frontend/src/data/`
- **Problem:** Team/services/testimonials/stats/nav data are inline arrays; the
  founder records + image URLs are duplicated between `Team.js` and `Testimonials.js`.
- **Steps:** move to `src/data/*.js` (or fetch from the backend like case studies);
  de-duplicate founders into one source consumed by both.

### FE-8 · Decide the form strategy `P2` `S` _(coupled to FE-1)_
- **Files:** `Contact.js`
- **Problem:** Manual `useState` form with no inline validation. `react-hook-form` is
  imported only by the dead `ui/form.jsx`; `zod`/`@hookform/resolvers` are imported
  nowhere — so they're *effectively* unused, but note the coupling: choosing the
  rhf+zod path here means **re-adding deps that `FE-1` removes**.
- **Steps:** prefer **manual + inline validation/email regex** (keeps `FE-1`'s deletion
  intact), **unless** react-hook-form is wanted elsewhere — in which case wire up
  `react-hook-form`+`zod` with a schema and field-level errors and retain them in `package.json`.

### FE-9 · Remove the dead toast system `P3` `S`
- **Files:** `frontend/src/hooks/use-toast.js`, `Contact.js`, `App.js`
- **Problem:** `use-toast.js` (the shadcn toast hook) is imported only by the dead
  `ui/` tree; the app actually uses `sonner` directly (`App.js` `Toaster`, `Contact.js`
  `toast`). Two parallel toast systems is confusing.
- **Steps:** delete `src/hooks/use-toast.js` (alongside the `FE-1` cleanup) and standardize on `sonner`.

### FE-10 / PERF-5 · Route-level code splitting `P2` `S`
- **Files:** `frontend/src/App.js`
- **Steps:** `React.lazy(() => import('./pages/CaseStudyPage'))` wrapped in `<Suspense>`;
  optionally lazy-load below-the-fold home sections.

### FE-11 · Remove dead CSS and consolidate `P3` `S`
- **Files:** `src/App.css`, `src/index.css`
- **Problem:** ~half of `App.css` is unused (`.animated-border`, `.team-member*`,
  `.case-study-card`, `.testimonial-card`, `.marquee-container`, `.mobile-menu-enter`
  + their keyframes); the index/App split is arbitrary.
- **Steps:** delete dead rules; fold remaining live classes into `index.css` and drop
  `App.css` + its import.

### FE-12 · Minor React anti-patterns `P3` `S`
- **Files:** `CaseStudyPage.js`, `Contact.js`, `CaseStudies.js`, `Navigation.js`
- **Steps:** prefer stable keys over array indices where data has ids; route
  `console.error` to a logger (or strip in prod); replace `window.location.href`
  in-app navigation with `navigate()` + post-nav `scrollIntoView`.

### Backend modernization

#### SEC-6 · Replace deprecated `@app.on_event` with lifespan `P2` `S`
- **Files:** `backend/server.py`
- **Steps:** use a `lifespan` async context manager on `FastAPI(lifespan=…)`; close the
  Mongo client on shutdown and create indexes on startup (see SEC-7).

#### SEC-7 · Mongo indexes + real pagination `P2` `S`
- **Files:** `backend/server.py`
- **Problem:** List endpoints `.sort()` on unindexed fields (in-memory sort, 32MB
  limit risk); `.to_list(1000)` silently truncates beyond 1000 docs.
- **Steps:** create descending indexes on `contact_messages.created_at` /
  `status_checks.timestamp` at startup; replace the hard cap with `skip`/`limit`
  pagination on the (now auth-gated) read endpoint.

#### SEC-8 · Narrow the email exception handling `P2` `S`
- **Files:** `backend/server.py` (`POST /api/contact` email block)
- **Problem:** Bare `except Exception` swallows *all* email failures and always
  returns 200 — silent loss of every lead notification; hides programming errors.
- **Steps:** catch the specific Resend/transport exceptions; keep save-and-return,
  but escalate failures via a distinct log level/metric (or a retry queue).

#### SEC-9 · Stop logging PII `P3` `S`
- **Files:** `backend/server.py`
- **Steps:** log the generated `contact_obj.id` instead of the submitter email.

---

## Phase 4 — Performance & Media

### PERF-3 · Optimize & right-size imagery `P1` `M`
- **Files:** `backend/server.py` (`CASE_STUDIES` image URLs), `CaseStudyPage.js`,
  `CaseStudies.js`, `Team.js`, `Testimonials.js`
- **Problem:** The case-study **hero** (the LCP element) is an unresized multi-MB
  Unsplash URL with no width param; team/testimonial photos are full-size for small
  displays; no `srcset`/WebP/CDN resize.
- **Steps:** add width/format params to Unsplash URLs (`&w=1600&fm=webp&auto=format`
  for hero, `&w=600` for thumbs); generate `srcset`/`sizes` for the hero; self-host
  and resize the team photos to their displayed dimensions.

### PERF-4 · Set intrinsic `width`/`height` on images (CLS) `P2` `S`
- **Files:** every `<img>` (Navigation, Footer, Hero, CaseStudyPage hero, CaseStudies, Team, Testimonials)
- **Steps:** add `width`/`height` (or `aspect-ratio` CSS) so the browser reserves
  layout space; prioritize the CaseStudyPage hero and the nav logo.

### PERF-6 · Trim & speed up fonts `P2` `S`
- **Files:** `frontend/public/index.html`, `frontend/src/index.css`
- **Problem:** Outfit+IBM Plex load via a CSS `@import` (serialized after CSS parse) with
  9 weights. (Inter removal is split out as `SEO-7`/`PERF-6a`.)
- **Steps:** move the font load from CSS `@import` to a `<link rel="preload">`
  /`<link rel="stylesheet">` in `index.html`; trim to weights actually used
  (e.g. Outfit 400/600/700, IBM Plex 400/500); keep `display=swap`.

### PERF-7 · Tame always-on animation/blur cost `P3` `S`
- **Files:** `Hero.js`, `src/index.css`
- **Problem:** Multiple infinite Framer loops + several `blur(100–150px)` orbs +
  pervasive `backdrop-filter: blur(30–40px)` cause continuous compositing work
  (hurts INP/battery on low-end devices).
- **Steps:** honor `prefers-reduced-motion` (shared with A11Y-1); reduce blur radii;
  pause off-screen infinite animations.

---

## Phase 5 — Testing & Quality Gates

### TEST-1 · Make the backend suite hermetic (in-process) `P1` `M`
- **Files:** `backend/tests/test_quasar_api.py`, new `backend/conftest.py`, pytest config
- **Problem:** The suite is a live-HTTP integration suite — needs a deployed server,
  hits a shared remote DB when targeted, and can send real emails. *(Open threads on PR&nbsp;#2.)*
- **Steps:** port to `from server import app; client = TestClient(app)` with
  `mongomock-motor` (or a testcontainers Mongo) and Resend monkeypatched; add
  `backend/conftest.py` (`pythonpath`) + pytest config (`testpaths`); gate any remaining
  remote smoke test behind an opt-in `@pytest.mark.live`. Closes the cleanup/email threads.
- **Done when:** `pytest` runs green offline with no external calls; wired into CI (DX-1).

### DX-5 · Remove the duplicate test script `P1` `S`
- **Files:** `backend_test.py` (root), `tests/__init__.py` (root)
- **Steps:** delete the legacy hand-rolled `backend_test.py` (subsumed by the pytest
  suite) and the empty root `tests/` package; single source of truth under `backend/tests/`.

### DX-6 · Frontend tests + coverage `P1` `M`
- **Files:** `frontend/src/**`, CI
- **Steps:** add React Testing Library smoke tests for key components (Contact submit,
  routing, carousel); wire `yarn test --watchAll=false` into CI; add `pytest-cov` +
  a backend coverage threshold.

### DX-7 · Backend lint/format/type config `P2` `S`
- **Files:** new `backend/pyproject.toml`
- **Problem:** `black`/`flake8`/`mypy`/`isort` are installed but unconfigured.
- **Steps:** configure `black`, `isort` (`profile=black`), `flake8`, `mypy`; reference in CI + pre-commit.

### DX-8 · Frontend ESLint (flat) + Prettier `P2` `S`
- **Files:** new `frontend/eslint.config.js`, `.prettierrc`, `.editorconfig`
- **Problem:** ESLint config is minimal/inlined in `craco.config.js`; the installed
  `eslint-plugin-jsx-a11y`/`import`/`react` plugins never run.
- **Steps:** add a real flat config wiring the installed plugins (incl. jsx-a11y to
  back-stop Phase 2), add Prettier + `.editorconfig`, add a `lint` script.

### DX-9 · Pre-commit hooks `P2` `S`
- **Files:** new `.pre-commit-config.yaml`
- **Steps:** hooks for `black`/`isort`/`flake8` + eslint/prettier; document `pre-commit install`.

### DX-10 · Containerized / reproducible dev setup `P2` `M`
- **Files:** new `docker-compose.yml`, optional `Makefile`
- **Problem:** No scripted way to bring up Mongo + FastAPI + React locally; the
  `frontend/plugins/health-check` endpoints anticipate orchestration that isn't in-repo.
- **Steps:** add `docker-compose.yml` (mongo + backend + frontend) and/or a `Makefile`
  (`make dev`/`test`/`lint`); document in the README.

---

## Phase 6 — Content & Hygiene Polish

### SEO-9 · Reconcile location vs phone `P2` `S`
- **Files:** `Contact.js` (location `:95` + phone `:85`), `Footer.js` (phone only, `:106`/`:109`)
- **Problem:** `Contact.js` pairs "San Francisco, CA" with a `(602)` (Phoenix, AZ) phone
  number. `Footer.js` carries the same phone but **no** location string.
- **Steps:** in `Contact.js`, set the real operating location (or drop the line if remote)
  so location/phone agree; in `Footer.js` only the phone needs to match.

### SEO-10 · Verify outbound claims `P2` `S`
- **Files:** `GitHubCallout.js`, `backend/server.py` (myCSA results/testimonial), `Services.js`
- **Steps:** confirm the `github.com/QuasarApps` org/repos exist & are public; verify
  the myCSA case-study metrics/testimonial are accurate; soften unbacked service claims
  (e.g. "Enterprise-grade security").

### SEO-11 · Replace stock case-study imagery `P2` `M`
- **Files:** `backend/server.py` (`CASE_STUDIES` hero/thumbnail/gallery)
- **Steps:** swap the generic Unsplash farm photo for real myCSA.app product
  screenshots hosted on the company's own domain (also improves OG previews / image SEO).

### SEO-15 / A11Y-11 · Real Privacy/Terms pages `P2` `S`
- **Files:** `Footer.js` + new routes/pages
- **Problem:** Privacy/Terms are dead `href="#"` — and the site collects PII, so a
  privacy policy is a genuine compliance/trust gap.
- **Steps:** add real Privacy/Terms pages (and routes), or remove the links until they exist.

### SEO-12 · Keyword-bearing headings `P3` `S`
- **Files:** section components
- **Steps:** once rendering is fixed (SEO-1), add descriptive, keyword-bearing
  phrasing to the H1/H2s; keep one H1 per page (already true).

### DX-11 · Stop tracking generated/agent artifacts `P3` `S`
- **Files:** `.gitignore`, `test_reports/iteration_*.json`, `test_result.md`,
  `.gitconfig`, `.emergent/emergent.yml`
- **Problem:** Generated AI iteration reports, the Emergent agent-protocol file, a
  committed `.gitconfig` (pins `github@emergent.sh` as everyone's identity), and the
  `.emergent` timestamp churn are all tracked.
- **Steps:** gitignore `test_reports/iteration_*.json` (keep `.gitkeep`); untrack
  `test_result.md` and `.gitconfig`; gitignore `.emergent/` (or strip volatile fields).

### DX-12 · Remove the stale pytest-XML reference `P3` `S`
- **Files:** `test_reports/iteration_5.json`
- **Steps:** covered by un-tracking the iteration JSONs (DX-11); otherwise drop the dead link.

---

## Master checklist

**Phase 0 — Critical Security**
- [ ] SEC-1 Lock down `GET /api/contact` (PII)
- [ ] SEC-2 Remove/auth `/status`
- [ ] SEC-3 Fix CORS credentials + wildcard
- [ ] SEC-4 Rate-limit + de-abuse contact POST
- [ ] SEC-5 Input length / payload-size limits
- [ ] SEC-11 Verify Resend domain

**Phase 1 — Production Hardening & De-Emergent**
- [ ] SEO-5 Remove Emergent badge/script/PostHog
- [ ] SEO-4 Self-host favicon/logo
- [ ] SEO-7 Drop Inter font
- [ ] SEO-8 Fix theme-color
- [ ] SEO-1 SSR/prerender
- [ ] SEO-2 Per-route head metadata
- [ ] SEO-3 OG/Twitter tags
- [ ] SEO-6 robots/sitemap/manifest/JSON-LD
- [ ] DX-1 CI + branch protection
- [ ] DX-2 Real README
- [ ] DX-3 `.env.example`
- [ ] DX-4 Frontend README

**Phase 2 — Accessibility**
- [ ] A11Y-1 prefers-reduced-motion
- [ ] A11Y-2 Focus indicators
- [ ] A11Y-3 Tertiary-grey contrast
- [ ] A11Y-4 Accent-text contrast
- [ ] A11Y-5 Skip link + `<main>`
- [ ] A11Y-6/7 Section labelling
- [ ] A11Y-13 Accessible mobile menu
- [ ] A11Y-14 Route-change focus
- [ ] A11Y-8/9/10 Accessible form feedback
- [ ] A11Y-12 Name scroll-indicator button
- [ ] A11Y-15 Trim alt text

**Phase 3 — Architecture & Dependency Cleanup**
- [ ] FE-1 Delete dead shadcn UI + purge deps
- [ ] SEC-10 Slim backend deps
- [ ] FE-2 Remove vestigial Tailwind tokens
- [ ] FE-3 Shared API client
- [ ] FE-4 404 route
- [ ] FE-5 Error boundary
- [ ] FE-6 Robust data fetching
- [ ] FE-7 Extract content to data modules
- [ ] FE-8 Form strategy
- [ ] FE-9 Remove dead toast system
- [ ] FE-10 Code splitting
- [ ] FE-11 Dead CSS cleanup
- [ ] FE-12 Minor anti-patterns
- [ ] SEC-6 Lifespan
- [ ] SEC-7 Indexes + pagination
- [ ] SEC-8 Narrow email except
- [ ] SEC-9 Stop logging PII

**Phase 4 — Performance & Media**
- [ ] PERF-3 Optimize imagery
- [ ] PERF-4 Image width/height (CLS)
- [ ] PERF-6 Trim/speed fonts
- [ ] PERF-7 Tame animation/blur

**Phase 5 — Testing & Quality Gates**
- [ ] TEST-1 Hermetic backend tests
- [ ] DX-5 Remove duplicate test script
- [ ] DX-6 Frontend tests + coverage
- [ ] DX-7 Backend lint/type config
- [ ] DX-8 ESLint flat + Prettier
- [ ] DX-9 Pre-commit
- [ ] DX-10 docker-compose / Makefile

**Phase 6 — Content & Hygiene Polish**
- [ ] SEO-9 Location/phone consistency
- [ ] SEO-10 Verify outbound claims
- [ ] SEO-11 Real case-study screenshots
- [ ] SEO-15 Privacy/Terms pages
- [ ] SEO-12 Keyword headings
- [ ] DX-11 Untrack generated artifacts
- [ ] DX-12 Remove stale XML reference

---

## Suggested PR slicing

Keep PRs small and reviewable. A natural sequence:

1. **`security/critical-hardening`** — SEC-1–5 (+SEC-11 note). *Ship first.*
2. **`chore/de-emergent`** — SEO-4/5/7/8 + `PERF-6a` (badge/scripts/Inter-font/favicon/theme-color).
3. **`chore/dep-purge`** — FE-1 + SEC-10 (frontend `ui/` delete + backend requirements).
4. **`feat/seo-foundation`** — SEO-1/2/3/6 (prerender + helmet + OG + robots/sitemap/JSON-LD).
5. **`chore/devex-foundation`** — DX-1/2/3/4 (CI, READMEs, env examples).
6. **`a11y/baseline`** — A11Y-1–15 (can split motion+focus+contrast from the rest).
7. **`refactor/frontend-architecture`** — FE-2–12.
8. **`refactor/backend-modernization`** — SEC-6–9.
9. **`perf/media`** — PERF-3/4/6/7 (incl. the remaining font work in `PERF-6`).
10. **`test/hermetic-suite-and-gates`** — TEST-1, DX-5–10.
11. **`content/polish`** — SEO-9/10/11/12/15, DX-11/12.

> Estimated total: ~2–3 focused engineering weeks. Phase 0 alone (≈1 day) removes the
> only dangerous gaps; Phases 1–2 (≈1 week) get the site to "real, discoverable,
> accessible." The rest is debt paydown that can land opportunistically.
