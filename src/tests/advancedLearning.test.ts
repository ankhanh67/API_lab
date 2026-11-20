import { describe, it, expect } from 'vitest';
import { REAL_WORLD_SCENARIOS } from '@/data/scenarios';
import {
  COMPARISON_DIMENSIONS,
  DECISION_ADVISOR_SCENARIOS,
} from '@/data/comparison';
import { QUIZ_QUESTIONS, getQuestionsByModule } from '@/data/quizzes';

describe('Phase 4: Real-World Scenarios, Comparison Center & Knowledge Assessment', () => {
  it('implements all 6 required real-world architectural scenarios with interactive steps', () => {
    expect(REAL_WORLD_SCENARIOS).toHaveLength(6);
    expect(REAL_WORLD_SCENARIOS[0]?.technologies).toEqual([
      'rest',
      'webhook',
      'websocket',
    ]);
    expect(REAL_WORLD_SCENARIOS[1]?.technologies).toEqual(['websocket']);
    expect(REAL_WORLD_SCENARIOS[2]?.technologies).toEqual(['grpc']);
    expect(REAL_WORLD_SCENARIOS[3]?.technologies).toEqual(['graphql']);
    expect(REAL_WORLD_SCENARIOS[4]?.technologies).toEqual(['soap']);
    expect(REAL_WORLD_SCENARIOS[5]?.technologies).toContain('webrtc');

    for (const sc of REAL_WORLD_SCENARIOS) {
      expect(sc.nodes.length).toBeGreaterThanOrEqual(3);
      expect(sc.simulationSteps.length).toBeGreaterThanOrEqual(3);
      expect(sc.tradeOffsVi.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('compares all 7 technologies across 9 accurate dimensions and provides decision guidance', () => {
    expect(COMPARISON_DIMENSIONS).toHaveLength(9);
    for (const row of COMPARISON_DIMENSIONS) {
      expect(Object.keys(row.values)).toEqual([
        'rest',
        'soap',
        'graphql',
        'grpc',
        'websocket',
        'webhook',
        'webrtc',
      ]);
    }
    expect(DECISION_ADVISOR_SCENARIOS.length).toBeGreaterThanOrEqual(6);
  });

  it('includes all 3 question types and covers all 7 modules in Knowledge Assessment', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(14);
    const types = new Set(QUIZ_QUESTIONS.map((q) => q.type));
    expect(types.has('multiple-choice')).toBe(true);
    expect(types.has('technical-understanding')).toBe(true);
    expect(types.has('scenario-based')).toBe(true);

    expect(getQuestionsByModule('rest').length).toBeGreaterThanOrEqual(2);
    expect(getQuestionsByModule('websocket').length).toBeGreaterThanOrEqual(2);
    expect(getQuestionsByModule('webrtc').length).toBeGreaterThanOrEqual(2);
  });
});
