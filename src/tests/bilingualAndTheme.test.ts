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
