# Design Specification: Full Bilingual (VI/EN) Mode & Light/Dark Theme

- **Date:** 2026-11-21
- **Project:** API Visual Lab (`d:\API_lab`)
- **Status:** Draft for User Approval

---

## 1. Intent & Why

Enable learners, students, and instructors to seamlessly use **API Visual Lab** in either **Vietnamese (`vi`)** or **English (`en`)** across 100% of the platform (UI shell, 7 API learning modules, API fundamentals, 7 dedicated playgrounds, universal 8-step simulator, 6 real-world scenarios, 9-dimension comparison matrix, and knowledge assessment quizzes), while also supporting a high-contrast **Light Mode (`light`)** alongside the existing **Engineering Dark Blueprint (`dark`)** theme for classroom projectors, daytime reading, and personal preference.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **100% Bilingual Coverage (`vi` / `en`):**
  - Navigation bar, footer, section headers, buttons, badges, and interactive playground controls.
  - Landing page (`/`), API Fundamentals (`/fundamentals`), 7 API Modules (`/modules/[id]`), Interactive API Lab (`/lab`), Real-World Scenarios (`/scenarios`), Comparison Center (`/comparison`), and Knowledge Assessment (`/assessment`).
  - Simulation engine outputs and step-by-step lifecycle explanations (`src/simulations/engines.ts`).
- **Seamless Light & Dark Theme (`dark` / `light`):**
  - Instant theme toggle on the `Navbar` (persisted in `localStorage`, defaulting to `vi` + `dark` on first visit).
  - Clean Technical Paper palette in Light Mode (`#F8FAFC` page background, `#FFFFFF` / `#F1F5F9` cards, `#E2E8F0` / `#CBD5E1` borders, `#0F172A` / `#334155` crisp dark typography, and adjusted accent badges/alerts for high contrast).
- **Zero Regression:**
  - Preserve all existing TypeScript strict types (`src/types/api.ts`), URL structure, and Vitest test suites, while adding new unit tests for English datasets, bilingual simulation engines, and theme/language helpers.
  - Full compatibility with Next.js static export (`output: 'export'`) for GitHub Pages deployment.

### Non-Goals
- Sub-path locale routing (`/en/...`, `/vi/...`) that would break existing static bookmark URLs or require server redirects on GitHub Pages.
- Third-party heavy i18n runtime dependencies.

### Anti-Goals
- Partial translation where main prose remains in Vietnamese when English mode is active.
- Low-contrast washed-out pastel text on light backgrounds in Light Mode.

---

## 3. Constraints

- **Next.js Static Export (`output: 'export'`):** Must operate purely client-side after static generation without dynamic SSR headers/cookies.
- **Strict TypeScript (`strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`):** All English data modules must satisfy the exact same TypeScript interfaces in `src/types/api.ts`.

---

## 4. Approaches Considered

1. **Approach A (Selected): Semantic CSS Variables Palette Mapping + Parallel Bilingual Data Modules (`src/data/en/*`) & React Context (`AppPreferencesContext`)**
   - Maps `slate` color tokens in `tailwind.config.ts` and `globals.css` to CSS custom properties that invert cleanly between `html.dark` and `html.light`, plus targeted light-mode overrides for colored translucent badges (`bg-*-950/*`, `text-*-200`, `text-*-300`) and grid backgrounds.
   - Keeps `src/types/api.ts` unchanged; provides structured English datasets mirroring the Vietnamese datasets and language-aware selector helpers (`getSiteConfig(lang)`, `getTechClassifications(lang)`, `getFundamentals(lang)`, `getApiModule(id, lang)`, `getAllApiModules(lang)`, `getScenarios(lang)`, `getComparisonData(lang)`, `getQuizQuestions(lang)`) plus `lang` parameter support in `src/simulations/engines.ts`.
   - *Trade-off:* Requires authoring complete English data files, but keeps components clean, types strict, and existing tests 100% intact.

2. **Approach B (Rejected): Manual `dark:` Tailwind classes on every JSX element + `{ vi, en }` inline objects on every data field**
   - *Reason for rejection:* Bloats 4,800+ lines of JSX, breaks existing `string` type contracts in `src/types/api.ts`, and risks missed elements in Light Mode.

---

## 5. Architecture & Component Design

### 5.1. Preferences Context (`src/context/AppPreferencesContext.tsx`)
- State:
  - `lang: 'vi' | 'en'` (default `'vi'`, persisted under `api_lab_lang` in `localStorage`)
  - `theme: 'dark' | 'light'` (default `'dark'`, persisted under `api_lab_theme` in `localStorage`)
- Synchronizes `<html lang={lang} className={theme}>` on mount and state change.
- Exposes `useAppPreferences()` hook returning `{ lang, setLang, toggleLang, theme, setTheme, toggleTheme, t }`.

### 5.2. Light / Dark Theme Engine (`tailwind.config.ts` & `src/app/globals.css`)
- Define RGB CSS variables `--slate-950` through `--slate-100` in `:root` / `html.dark` and `html.light`.
- Configure `tailwind.config.ts` `colors.slate` to use `rgb(var(--slate-XXX) / <alpha-value>)` so every existing Tailwind class (including opacity modifiers like `bg-slate-900/60`, `border-slate-800/80`) automatically adapts to Light and Dark modes.
- Add light-mode harmonization rules in `globals.css` for translucent accent boxes (`bg-sky-950/*`, `bg-emerald-950/*`, `bg-amber-950/*`, `bg-rose-950/*`, `bg-violet-950/*`, `bg-pink-950/*`, `bg-orange-950/*`, `bg-cyan-950/*`) and light accent text (`text-*-200`, `text-*-300`) so badges, code panels, and alerts remain crisp and legible on white/light backgrounds.

### 5.3. Bilingual Data & Simulation Layer
- `src/i18n/ui.ts`: UI dictionary for all static labels across Navbar, Footer, Landing Page, Fundamentals, Module Detail, 7 Dedicated Playgrounds, API Lab, Scenarios, Comparison, and Assessment.
- `src/config/site.ts`: Add English fields and helper `getTechClassifications(lang)`.
- `src/data/en/`:
  - `fundamentals.ts` (English counterpart to `src/data/fundamentals.ts`)
  - `modulesPart1.ts` (REST, SOAP, GraphQL, gRPC in English)
  - `modulesPart2.ts` (WebSocket, Webhook, WebRTC in English)
  - `scenarios.ts` (6 Real-World Scenarios in English)
  - `comparison.ts` (9-Dimension Matrix, Coexistence & Decision Guide in English)
  - `quizzes.ts` (16 Assessment Questions & Explanations in English)
- `src/simulations/engines.ts`: Support optional `lang: 'vi' | 'en' = 'vi'` parameter in all 7 simulation engines and the universal 8-step lifecycle generator.
