# Bilingual (VI/EN) & Light/Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full 100% Vietnamese/English bilingual support (`vi` / `en`) across all content, simulations, and UI components, along with a high-contrast Light/Dark theme switcher (`dark` / `light`) compatible with Next.js static export.

**Architecture:** Map Tailwind's `slate` palette to RGB CSS variables in `globals.css` and `tailwind.config.ts` so `html.dark` and `html.light` invert backgrounds, borders, and typography seamlessly, paired with targeted light-mode contrast rules for translucent accent badges. Provide parallel English datasets (`src/data/en/*`), a UI dictionary (`src/i18n/ui.ts`), bilingual simulation engine explanations (`src/simulations/engines.ts`), and a client-side `AppPreferencesContext` persisted in `localStorage`.

**Tech Stack:** Next.js 15 (App Router, Static Export), React 19, TypeScript 5.7 (Strict Mode), Tailwind CSS 3.4, Vitest 3.

**Spec:** `docs/superpowers/specs/2026-11-21-bilingual-and-light-theme-design.md`

## Global Constraints

- Next.js Static Export (`output: 'export'`): No SSR dynamic cookies/headers; state must work purely client-side and build cleanly to static HTML.
- Strict TypeScript (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`): All English datasets must conform to existing interfaces in `src/types/api.ts`.
- Preserve existing Vietnamese default behavior so all 13 existing Vitest tests continue passing without modification.

## Review Focus

- Missing or mismatched IDs between `vi` and `en` datasets causing undefined lookups when switching language mid-session on a module, scenario, or quiz question.
- Opacity modifiers on Tailwind `slate` classes (e.g., `bg-slate-900/60`, `border-slate-800/80`) breaking if CSS variables do not use space-separated RGB channels (`rgb(var(--slate-900) / <alpha-value>)`).
- Low-contrast light pastel text (`text-sky-200`, `text-emerald-300`, etc.) on dark-tinted translucent containers (`bg-sky-950/30`) when switched to Light Mode.
- Simulation engine state in playgrounds retaining stale language explanations when the user toggles `VI / EN` without re-running the request.
- SSR hydration mismatch if `localStorage` is read synchronously during initial server render instead of inside `useEffect`.

---

### Task 1: Theme Engine, UI Dictionary & AppPreferencesContext

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/config/site.ts`
- Create: `src/i18n/ui.ts`
- Create: `src/context/AppPreferencesContext.tsx`
- Create: `src/tests/bilingualAndTheme.test.ts`

**Interfaces:**
- Produces:
  - `Language = 'vi' | 'en'` and `ThemeMode = 'dark' | 'light'`
  - `getSiteConfig(lang: Language)` and `getTechClassifications(lang: Language)` in `src/config/site.ts`
  - `UI_TEXT: Record<Language, UiDictionary>` and `getUiText(lang: Language)` in `src/i18n/ui.ts`
  - `AppPreferencesProvider` and `useAppPreferences()` in `src/context/AppPreferencesContext.tsx`

- [ ] **Step 1: Write failing test in `src/tests/bilingualAndTheme.test.ts`**

```typescript
import { describe, expect, it } from 'vitest';
import { getSiteConfig, getTechClassifications } from '@/config/site';
import { getUiText } from '@/i18n/ui';

describe('Task 1: Bilingual Site Config & UI Dictionary', () => {
  it('returns localized site config and 7 tech classifications for both vi and en', () => {
    const viConfig = getSiteConfig('vi');
    const enConfig = getSiteConfig('en');
    expect(viConfig.headline).toContain('Hiểu sâu về API');
    expect(enConfig.headline).toBe('Understanding APIs: How Applications Communicate');

    const viTech = getTechClassifications('vi');
    const enTech = getTechClassifications('en');
    expect(viTech).toHaveLength(7);
    expect(enTech).toHaveLength(7);
    expect(enTech.map((t) => t.id)).toEqual(viTech.map((t) => t.id));
    expect(enTech[0]?.roleSummary).toContain('Resources');
  });

  it('provides complete UI dictionary for vi and en', () => {
    const viUi = getUiText('vi');
    const enUi = getUiText('en');
    expect(viUi.nav.overview).toBe('Tổng quan');
    expect(enUi.nav.overview).toBe('Overview');
    expect(enUi.nav.themeLight).toBe('Light');
    expect(enUi.nav.themeDark).toBe('Dark');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/tests/bilingualAndTheme.test.ts`
Expected: FAIL (`getSiteConfig` / `@/i18n/ui` not found)

- [ ] **Step 3: Configure RGB CSS variable palette in `tailwind.config.ts` and `src/app/globals.css`, implement `src/config/site.ts` helpers, `src/i18n/ui.ts`, and `src/context/AppPreferencesContext.tsx`**

In `tailwind.config.ts`, define `slate` colors (`950`, `925`, `900`, `850`, `800`, `700`, `600`, `500`, `400`, `300`, `200`, `100`, `50`) using `rgb(var(--slate-XXX) / <alpha-value>)`.
In `src/app/globals.css`, define `--slate-950`..`--slate-50` for `:root, html.dark` (Engineering Dark Blueprint) and `html.light` (Clean Technical Paper), plus `html.light` overrides for `.bg-engineering-grid`, `.bg-blueprint-dots`, `bg-*-950/*` surfaces, and `text-*-200`/`text-*-300` contrast.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/tests/bilingualAndTheme.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add tailwind.config.ts src/app/globals.css src/config/site.ts src/i18n/ui.ts src/context/AppPreferencesContext.tsx src/tests/bilingualAndTheme.test.ts
git commit -m "feat/add theme engine and bilingual context"
```

---

### Task 2: English Datasets for Fundamentals, Scenarios, Comparison & Quizzes

**Files:**
- Create: `src/data/en/fundamentals.ts`
- Create: `src/data/en/scenarios.ts`
- Create: `src/data/en/comparison.ts`
- Create: `src/data/en/quizzes.ts`
- Modify: `src/data/fundamentals.ts`
- Modify: `src/data/scenarios.ts`
- Modify: `src/data/comparison.ts`
- Modify: `src/data/quizzes.ts`
- Modify: `src/tests/bilingualAndTheme.test.ts`

**Interfaces:**
- Consumes: `Language` from `src/config/site.ts`, types from `src/types/api.ts`
- Produces:
  - `getFundamentalsData(lang: Language)` in `src/data/fundamentals.ts`
  - `getRealWorldScenarios(lang: Language)` in `src/data/scenarios.ts`
  - `getComparisonData(lang: Language)` in `src/data/comparison.ts`
  - `getAssessmentQuizzes(lang: Language)` in `src/data/quizzes.ts`

- [ ] **Step 1: Add dataset parity tests to `src/tests/bilingualAndTheme.test.ts`**

```typescript
import { getFundamentalsData } from '@/data/fundamentals';
import { getRealWorldScenarios } from '@/data/scenarios';
import { getComparisonData } from '@/data/comparison';
import { getAssessmentQuizzes } from '@/data/quizzes';

describe('Task 2: Bilingual Fundamentals, Scenarios, Comparison & Quizzes', () => {
  it('returns matching structure for fundamentals in vi and en', () => {
    const vi = getFundamentalsData('vi');
    const en = getFundamentalsData('en');
    expect(en.topics).toHaveLength(vi.topics.length);
    expect(en.lifecycleStages).toHaveLength(vi.lifecycleStages.length);
    expect(en.httpStatusGroups).toHaveLength(vi.httpStatusGroups.length);
    expect(en.authMethods).toHaveLength(vi.authMethods.length);
  });

  it('returns 6 real-world scenarios with matching IDs and steps in vi and en', () => {
    const vi = getRealWorldScenarios('vi');
    const en = getRealWorldScenarios('en');
    expect(en).toHaveLength(6);
    expect(en.map((s) => s.id)).toEqual(vi.map((s) => s.id));
    en.forEach((sc, idx) => {
      expect(sc.steps).toHaveLength(vi[idx]!.steps.length);
    });
  });

  it('returns 9 comparison dimensions, coexistence items, and decision scenarios in en', () => {
    const vi = getComparisonData('vi');
    const en = getComparisonData('en');
    expect(en.rows).toHaveLength(vi.rows.length);
    expect(en.coexistence).toHaveLength(vi.coexistence.length);
    expect(en.decisionGuide).toHaveLength(vi.decisionGuide.length);
  });

  it('returns 16 assessment quiz questions with matching IDs and correctIndex in en', () => {
    const vi = getAssessmentQuizzes('vi');
    const en = getAssessmentQuizzes('en');
    expect(en).toHaveLength(vi.length);
    en.forEach((q, idx) => {
      expect(q.id).toBe(vi[idx]!.id);
      expect(q.correctIndex).toBe(vi[idx]!.correctIndex);
      expect(q.options).toHaveLength(vi[idx]!.options.length);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/tests/bilingualAndTheme.test.ts`
Expected: FAIL (`getFundamentalsData`, etc. not exported)

- [ ] **Step 3: Author `src/data/en/fundamentals.ts`, `src/data/en/scenarios.ts`, `src/data/en/comparison.ts`, `src/data/en/quizzes.ts` and export getters from `src/data/*.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/tests/bilingualAndTheme.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/data/ src/tests/bilingualAndTheme.test.ts
git commit -m "feat/add english datasets for fundamentals scenarios comparison quizzes"
```

---

### Task 3: English Datasets for 7 API Modules & Bilingual Simulation Engines

**Files:**
- Create: `src/data/en/modulesPart1.ts`
- Create: `src/data/en/modulesPart2.ts`
- Modify: `src/data/modules.ts`
- Modify: `src/simulations/engines.ts`
- Modify: `src/tests/bilingualAndTheme.test.ts`

**Interfaces:**
- Consumes: `Language` from `src/config/site.ts`, types from `src/types/api.ts`
- Produces:
  - `getApiModulesList(lang: Language)`, `getApiModulesById(lang: Language)`, `getApiModule(id: ApiTechnologyId, lang: Language)` in `src/data/modules.ts`
  - Optional `lang: Language = 'vi'` parameter in `simulateRestRequest`, `simulateSoapRequest`, `simulateGraphqlRequest`, `simulateGrpcCall`, `simulateWebsocketAction`, `simulateWebhookDelivery`, `simulateWebRtcSession`, and `generateUniversalLifecycleSteps` in `src/simulations/engines.ts`

- [ ] **Step 1: Add module & simulation engine bilingual tests to `src/tests/bilingualAndTheme.test.ts`**

```typescript
import { getApiModulesList, getApiModule } from '@/data/modules';
import {
  simulateRestRequest,
  simulateSoapRequest,
  simulateGraphqlRequest,
  simulateGrpcCall,
  simulateWebsocketAction,
  simulateWebhookDelivery,
  simulateWebRtcSession,
  generateUniversalLifecycleSteps,
} from '@/simulations/engines';

describe('Task 3: Bilingual 7 API Modules & Simulation Engines', () => {
  it('returns all 7 complete learning modules in English matching Vietnamese structure', () => {
    const viList = getApiModulesList('vi');
    const enList = getApiModulesList('en');
    expect(enList).toHaveLength(7);
    enList.forEach((mod, idx) => {
      const viMod = viList[idx]!;
      expect(mod.id).toBe(viMod.id);
      expect(mod.coreConcepts.length).toBeGreaterThanOrEqual(4);
      expect(mod.knowledgeCheck).toHaveLength(viMod.knowledgeCheck.length);
      expect(getApiModule(mod.id, 'en').title).toBe(mod.title);
    });
  });

  it('produces English explanations across all 7 simulation engines and universal lifecycle', () => {
    const restRes = simulateRestRequest(
      { method: 'GET', path: '/api/products', queryParams: '', headers: {}, body: '' },
      'en'
    );
    expect(restRes.explanationVi).toContain('GET');

    const soapRes = simulateSoapRequest(
      { operation: 'GetAccountBalance', accountId: 'ACC-1001', amount: 100, targetAccountId: 'ACC-2002', rawXml: '<Envelope><Body></Body></Envelope>', injectFault: false },
      'en'
    );
    expect(soapRes.explanationVi).toContain('SOAP');

    const gqlRes = simulateGraphqlRequest(
      { operationType: 'query', selectedStudentId: 'STU-01', fields: { id: true, name: true, gpa: true, email: false, department: true, courses: true, grades: false }, mutationNewGpa: 3.9, rawQuery: '{ student { id name } }' },
      'en'
    );
    expect(gqlRes.explanationVi).toContain('GraphQL');

    const grpcRes = simulateGrpcCall(
      { service: 'OrderService', method: 'CreateOrder', pattern: 'unary', orderId: 'ORD-101', itemCode: 'SKU-99', quantity: 2, simulateTimeout: false },
      'en'
    );
    expect(grpcRes.explanationVi).toContain('gRPC');

    const wsRes = simulateWebsocketAction('connect', [], 'Hello', 'clientA', 'en');
    expect(wsRes.explanationVi).toContain('101 Switching Protocols');

    const whRes = simulateWebhookDelivery(
      { eventType: 'payment.succeeded', callbackUrl: 'https://api.shop.vn/webhooks/stripe', secretKey: 'whsec_test_secret', payloadJson: '{"id":"evt_1"}', tamperSignature: false, simulateServerDown: false, duplicateEventId: false },
      [],
      'en'
    );
    expect(whRes.explanationVi).toContain('HMAC');

    const rtcRes = simulateWebRtcSession(
      { scenario: 'p2p_stun', mediaProfile: 'video_hd_audio', dataChannelMessage: 'ping', simulatePacketLoss: false },
      'en'
    );
    expect(rtcRes.explanationVi).toContain('WebRTC');

    const steps = generateUniversalLifecycleSteps('rest', 'normal', 'en');
    expect(steps).toHaveLength(8);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/tests/bilingualAndTheme.test.ts`
Expected: FAIL

- [ ] **Step 3: Author `src/data/en/modulesPart1.ts` and `src/data/en/modulesPart2.ts`, update `src/data/modules.ts`, and localize `src/simulations/engines.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src/data/ src/simulations/engines.ts src/tests/bilingualAndTheme.test.ts
git commit -m "feat/add english 7 modules and bilingual simulation engines"
```

---

### Task 4: Wire All UI Pages, Navbar, Footer & Playgrounds to Bilingual & Theme Context

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/fundamentals/page.tsx`
- Modify: `src/components/modules/ModuleDetailClient.tsx`
- Modify: `src/components/playgrounds/DedicatedPlaygrounds.tsx`
- Modify: `src/app/lab/page.tsx`
- Modify: `src/app/scenarios/page.tsx`
- Modify: `src/app/comparison/page.tsx`
- Modify: `src/app/assessment/page.tsx`

**Interfaces:**
- Consumes: `useAppPreferences()` from `src/context/AppPreferencesContext.tsx`, bilingual getters from `src/config/site.ts`, `src/data/*`, `src/simulations/engines.ts`

- [ ] **Step 1: Wrap `RootLayout` in `AppPreferencesProvider` and add Language (`VI | EN`) & Theme (`☀️ | 🌙`) controls to `Navbar.tsx` and update `Footer.tsx`**

- [ ] **Step 2: Update Landing Page (`src/app/page.tsx`) and Fundamentals Page (`src/app/fundamentals/page.tsx`) to consume `useAppPreferences()`**

- [ ] **Step 3: Update `ModuleDetailClient.tsx`, `DedicatedPlaygrounds.tsx`, and `src/app/lab/page.tsx` to pass `lang` to data getters and simulation engines**

- [ ] **Step 4: Update `src/app/scenarios/page.tsx`, `src/app/comparison/page.tsx`, and `src/app/assessment/page.tsx` to consume `useAppPreferences()`**

- [ ] **Step 5: Verify full typecheck, unit tests, and production build**

Run: `npm run typecheck; npm test; npm run build`
Expected: 0 TypeScript errors, all Vitest suites PASS, Next.js build succeeds across all static routes.

- [ ] **Step 6: Commit**

```powershell
git add src/ AGENT.md docs/
git commit -m "feat/connect bilingual and light theme across all pages"
```
