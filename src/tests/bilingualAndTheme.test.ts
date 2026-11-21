import { describe, expect, it } from 'vitest';
import { getSiteConfig, getTechClassifications } from '@/config/site';
import { getUiText } from '@/i18n/ui';
import { getFundamentalsData } from '@/data/fundamentals';
import { getRealWorldScenarios } from '@/data/scenarios';
import { getComparisonData } from '@/data/comparison';
import { getAssessmentQuizzes } from '@/data/quizzes';
import { getApiModulesList, getModuleById } from '@/data/modules';
import {
  buildUniversalLifecycleSteps,
  simulateRestRequest,
  INITIAL_REST_PRODUCTS,
  executeSoapSimulation,
  executeGraphqlSimulation,
  executeGrpcSimulation,
  simulateWebhookDelivery,
  simulateWebRtcSession,
} from '@/simulations/engines';

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

describe('Task 3: Bilingual 7 API Modules & Simulation Engines', () => {
  it('returns all 7 complete learning modules in English matching Vietnamese structure', () => {
    const viList = getApiModulesList('vi');
    const enList = getApiModulesList('en');
    expect(enList).toHaveLength(7);
    enList.forEach((mod, idx) => {
      const viMod = viList[idx]!;
      expect(mod.id).toBe(viMod.id);
      expect(mod.coreConcepts.length).toBeGreaterThanOrEqual(4);
      expect(mod.communicationFlow).toHaveLength(viMod.communicationFlow.length);
      expect(getModuleById(mod.id, 'en')?.name).toBe(mod.name);
    });
  });

  it('produces English explanations across simulation engines and universal lifecycle', () => {
    const stepsEn = buildUniversalLifecycleSteps(
      {
        method: 'POST',
        endpoint: '/api/orders',
        authHeader: 'Bearer tok_123',
        requestBody: '{"id":1}',
        mode: 'normal-200',
      },
      'en'
    );
    expect(stepsEn).toHaveLength(8);
    expect(stepsEn[0]?.shortExplanationVi).toContain('Client');

    const restRes = simulateRestRequest(
      {
        method: 'GET',
        path: '/api/products',
        queryParams: {},
        headers: {},
        bodyText: '',
        currentProducts: INITIAL_REST_PRODUCTS,
      },
      'en'
    );
    expect(restRes.response.explanationVi).toContain('Stateless');

    const soapRes = executeSoapSimulation('GetAccountBalance', '<soap:Envelope></soap:Envelope>', 'en');
    expect(soapRes.envelopeBreakdown.envelopeVi).toContain('SOAP');

    const gqlRes = executeGraphqlSimulation(
      {
        studentId: 'SV-101',
        includeFullName: true,
        includeGpa: true,
        includeEmail: false,
        includeDepartment: true,
        includeCourses: false,
        includeGrades: false,
      },
      'en'
    );
    expect(gqlRes.explanationVi).toContain('Resolver');

    const grpcRes = executeGrpcSimulation('unary', 'ORD-101', 500000, 'en');
    expect(grpcRes.frames[0]?.explanationVi).toContain('Protobuf');

    const whRes = simulateWebhookDelivery(
      {
        eventType: 'payment.success',
        callbackUrl: 'https://api.shop.vn/webhooks',
        secretKey: 'sec_123',
        tamperSignature: false,
        simulateReceiver500Error: false,
        orderAmountVnd: 900000,
      },
      'en'
    );
    expect(whRes.attempts[0]?.explanationVi).toContain('HMAC');

    const rtcRes = simulateWebRtcSession(
      {
        natTopology: 'cone-nat-stun',
        videoCodec: 'VP9',
        enableVideo: true,
        enableAudio: true,
        enableDataChannel: true,
      },
      'en'
    );
    expect(rtcRes.handshakeStages[0]?.detailVi).toContain('Signaling');
  });
});

