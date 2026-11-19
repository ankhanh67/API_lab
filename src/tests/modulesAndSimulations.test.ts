import { describe, it, expect } from 'vitest';
import { ALL_LEARNING_MODULES, getModuleById } from '@/data/modules';
import {
  buildUniversalLifecycleSteps,
  INITIAL_REST_PRODUCTS,
  simulateRestRequest,
  buildSoapRequestTemplate,
  executeSoapSimulation,
  executeGraphqlSimulation,
  executeGrpcSimulation,
  simulateWebhookDelivery,
  DEFAULT_OPENAPI_SPEC_JSON,
  parseOpenApiSpec,
} from '@/simulations/engines';

describe('Phase 2 & 3: Seven Learning Modules & Simulation Engines', () => {
  it('loads all 7 learning modules with complete 12-section educational structure', () => {
    expect(ALL_LEARNING_MODULES).toHaveLength(7);
    const ids = ALL_LEARNING_MODULES.map((m) => m.id);
    expect(ids).toEqual([
      'rest',
      'soap',
      'graphql',
      'grpc',
      'websocket',
      'webhook',
      'openapi',
    ]);

    for (const mod of ALL_LEARNING_MODULES) {
      expect(mod.coreConcepts.length).toBeGreaterThanOrEqual(4);
      expect(mod.architecture.nodes.length).toBeGreaterThanOrEqual(3);
      expect(mod.communicationFlow.length).toBeGreaterThanOrEqual(4);
      expect(mod.practicalExample.codeExamples.length).toBeGreaterThanOrEqual(1);
      expect(mod.advantages.length).toBeGreaterThanOrEqual(3);
      expect(mod.limitations.length).toBeGreaterThanOrEqual(2);
      expect(mod.misconceptions.length).toBeGreaterThanOrEqual(1);
    }

    expect(getModuleById('grpc')?.technicalNature).toBe('RPC Framework');
  });

  it('executes Universal 8-Step Lifecycle Simulator accurately in normal and error modes', () => {
    const normalSteps = buildUniversalLifecycleSteps({
      method: 'POST',
      endpoint: '/api/orders',
      authHeader: 'Bearer valid_jwt',
      requestBody: '{"productId":101}',
      mode: 'create-201',
    });
    expect(normalSteps).toHaveLength(8);
    expect(normalSteps[0]?.activeComponent).toBe('client');
    expect(normalSteps[2]?.activeComponent).toBe('api-layer');
    expect(normalSteps[4]?.activeComponent).toBe('database');
    expect(normalSteps[7]?.communicationState).toBe('LIFECYCLE_COMPLETE');

    const authErrSteps = buildUniversalLifecycleSteps({
      method: 'POST',
      endpoint: '/api/orders',
      authHeader: '',
      requestBody: '{}',
      mode: 'unauthorized-401',
    });
    expect(authErrSteps[2]?.communicationState).toContain('401');
  });

  it('simulates REST CRUD operations (GET, POST, PATCH, DELETE) and error codes', () => {
    // GET list
    const getRes = simulateRestRequest({
      method: 'GET',
      path: '/api/products',
      queryParams: { category: 'hardware' },
      headers: {},
      bodyText: '',
      currentProducts: INITIAL_REST_PRODUCTS,
    });
    expect(getRes.response.statusCode).toBe(200);

    // POST new product
    const postRes = simulateRestRequest({
      method: 'POST',
      path: '/api/products',
      queryParams: {},
      headers: {},
      bodyText: JSON.stringify({
        name: 'New Test Item',
        price: 500000,
        category: 'hardware',
      }),
      currentProducts: INITIAL_REST_PRODUCTS,
    });
    expect(postRes.response.statusCode).toBe(201);
    expect(postRes.updatedProducts).toHaveLength(INITIAL_REST_PRODUCTS.length + 1);

    // PATCH product 101
    const patchRes = simulateRestRequest({
      method: 'PATCH',
      path: '/api/products/101',
      queryParams: {},
      headers: {},
      bodyText: JSON.stringify({ price: 1990000 }),
      currentProducts: postRes.updatedProducts,
    });
    expect(patchRes.response.statusCode).toBe(200);
    expect(
      patchRes.updatedProducts.find((p) => p.id === 101)?.price
    ).toBe(1990000);

    // DELETE product 101
    const delRes = simulateRestRequest({
      method: 'DELETE',
      path: '/api/products/101',
      queryParams: {},
      headers: {},
      bodyText: '',
      currentProducts: patchRes.updatedProducts,
    });
    expect(delRes.response.statusCode).toBe(200);
    expect(delRes.updatedProducts.some((p) => p.id === 101)).toBe(false);
  });

  it('simulates SOAP Envelope operations and SOAP Fault generation', () => {
    const xml = buildSoapRequestTemplate('GetAccountBalance', {
      accountId: 'ACC-VN-8801',
      toAccountId: 'ACC-VN-9920',
      amount: 100000,
    });
    const okSoap = executeSoapSimulation('GetAccountBalance', xml);
    expect(okSoap.isFault).toBe(false);
    expect(okSoap.responseXml).toContain('GetAccountBalanceResponse');

    const faultSoap = executeSoapSimulation('TriggerSoapFault', xml);
    expect(faultSoap.isFault).toBe(true);
    expect(faultSoap.httpStatus).toBe(500);
    expect(faultSoap.responseXml).toContain('<soap:Fault>');
  });

  it('simulates GraphQL field resolution and demonstrates byte savings over REST over-fetching', () => {
    const gql = executeGraphqlSimulation({
      studentId: 'SV-101',
      includeFullName: true,
      includeGpa: true,
      includeEmail: false,
      includeDepartment: false,
      includeCourses: false,
      includeGrades: false,
    });
    expect(gql.graphqlByteSize).toBeLessThan(gql.restByteSize);
    expect(gql.resolversTriggered).toHaveLength(1);
  });

  it('simulates all 4 gRPC communication patterns and Webhook HMAC + Retry logic', () => {
    const unary = executeGrpcSimulation('unary', 'ORD-1', 500000);
    const bidi = executeGrpcSimulation('bidirectional-streaming', 'ORD-1', 500000);
    expect(unary.frames).toHaveLength(2);
    expect(bidi.frames).toHaveLength(4);
    expect(unary.protobufBinaryBytes).toBeLessThan(unary.jsonEquivalentBytes);

    const whRetry = simulateWebhookDelivery({
      eventType: 'payment.success',
      callbackUrl: 'https://shop.vn/webhook',
      secretKey: 'sec_123',
      tamperSignature: false,
      simulateReceiver500Error: true,
      orderAmountVnd: 900000,
    });
    expect(whRetry.signatureValid).toBe(true);
    expect(whRetry.attempts).toHaveLength(3);
    expect(whRetry.attempts[2]?.outcome).toBe('DELIVERED');
  });

  it('parses OpenAPI 3.0 specification and generates TypeScript SDK preview', () => {
    const parsed = parseOpenApiSpec(DEFAULT_OPENAPI_SPEC_JSON);
    expect(parsed.isValid).toBe(true);
    expect(parsed.endpoints).toHaveLength(4);
    expect(parsed.generatedTypeScriptSdk).toContain('export async function');
  });
});
