import { describe, it, expect } from 'vitest';
import { SITE_CONFIG, TECH_CLASSIFICATIONS } from '@/config/site';
import {
  FUNDAMENTAL_LIFECYCLE_STAGES,
  HTTP_METHODS_GUIDE,
  HTTP_STATUS_CATEGORIES,
  DATA_FORMATS_COMPARISON,
  AUTH_MECHANISMS,
} from '@/data/fundamentals';

describe('Phase 1 Foundation & API Fundamentals', () => {
  it('defines exact main headline and 7 distinct technical classifications', () => {
    expect(SITE_CONFIG.headlineEn).toBe(
      'Understanding APIs: How Applications Communicate'
    );
    expect(TECH_CLASSIFICATIONS).toHaveLength(7);

    const natures = TECH_CLASSIFICATIONS.map((t) => `${t.id}:${t.natureEn}`);
    expect(natures).toEqual([
      'rest:Architectural Style',
      'soap:Messaging Protocol',
      'graphql:Query Language & Runtime',
      'grpc:RPC Framework',
      'websocket:Communication Protocol',
      'webhook:Event-Driven Callback Mechanism',
      'webrtc:P2P Real-Time Media & Data Protocol',
    ]);
  });

  it('contains all 7 interactive stages of the API fundamentals lifecycle', () => {
    expect(FUNDAMENTAL_LIFECYCLE_STAGES).toHaveLength(7);
    expect(FUNDAMENTAL_LIFECYCLE_STAGES[0]?.id).toBe('client');
    expect(FUNDAMENTAL_LIFECYCLE_STAGES[4]?.id).toBe('database');
    expect(FUNDAMENTAL_LIFECYCLE_STAGES[6]?.id).toBe('client-receive');
  });

  it('covers 5 HTTP methods, status codes, 3 serialization formats, and 4 auth mechanisms', () => {
    expect(HTTP_METHODS_GUIDE).toHaveLength(5);
    expect(HTTP_STATUS_CATEGORIES.length).toBeGreaterThanOrEqual(4);
    expect(DATA_FORMATS_COMPARISON).toHaveLength(3);
    expect(AUTH_MECHANISMS).toHaveLength(4);
  });
});
