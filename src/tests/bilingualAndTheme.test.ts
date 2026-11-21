import { describe, expect, it } from 'vitest';
import { getSiteConfig, getTechClassifications } from '@/config/site';
import { getUiText } from '@/i18n/ui';
import { getFundamentalsData } from '@/data/fundamentals';
import { getRealWorldScenarios } from '@/data/scenarios';
import { getComparisonData } from '@/data/comparison';
import { getAssessmentQuizzes } from '@/data/quizzes';

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

describe('Task 2: Bilingual Fundamentals, Scenarios, Comparison & Quizzes', () => {
  it('returns matching structure for fundamentals in vi and en', () => {
    const vi = getFundamentalsData('vi');
    const en = getFundamentalsData('en');
    expect(en.lifecycleStages).toHaveLength(vi.lifecycleStages.length);
    expect(en.httpMethods).toHaveLength(vi.httpMethods.length);
    expect(en.httpStatusCategories).toHaveLength(vi.httpStatusCategories.length);
    expect(en.dataFormats).toHaveLength(vi.dataFormats.length);
    expect(en.authMechanisms).toHaveLength(vi.authMechanisms.length);
  });

  it('returns 6 real-world scenarios with matching IDs and steps in vi and en', () => {
    const vi = getRealWorldScenarios('vi');
    const en = getRealWorldScenarios('en');
    expect(en).toHaveLength(6);
    expect(en.map((s) => s.id)).toEqual(vi.map((s) => s.id));
    en.forEach((sc, idx) => {
      expect(sc.simulationSteps).toHaveLength(vi[idx]!.simulationSteps.length);
      expect(sc.nodes).toHaveLength(vi[idx]!.nodes.length);
    });
  });

  it('returns 9 comparison dimensions and 7 decision scenarios in en', () => {
    const vi = getComparisonData('vi');
    const en = getComparisonData('en');
    expect(en.dimensions).toHaveLength(vi.dimensions.length);
    expect(en.decisionScenarios).toHaveLength(vi.decisionScenarios.length);
  });

  it('returns all assessment quiz questions with matching IDs and correct options in en', () => {
    const vi = getAssessmentQuizzes('vi');
    const en = getAssessmentQuizzes('en');
    expect(en).toHaveLength(vi.length);
    en.forEach((q, idx) => {
      expect(q.id).toBe(vi[idx]!.id);
      expect(q.options).toHaveLength(vi[idx]!.options.length);
      expect(q.options.map((o) => o.isCorrect)).toEqual(
        vi[idx]!.options.map((o) => o.isCorrect)
      );
    });
  });
});
