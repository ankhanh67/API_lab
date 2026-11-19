'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Play,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Network,
} from 'lucide-react';
import { REAL_WORLD_SCENARIOS } from '@/data/scenarios';
import { TECH_CLASSIFICATIONS } from '@/config/site';

export default function RealWorldScenariosPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    REAL_WORLD_SCENARIOS[0]?.id ?? 'ecommerce-platform'
  );
  const [activeSimStepIdx, setActiveSimStepIdx] = useState<number>(0);

  const scenario =
    REAL_WORLD_SCENARIOS.find((s) => s.id === selectedScenarioId) ??
    REAL_WORLD_SCENARIOS[0]!;
  const currentStep =
    scenario.simulationSteps[activeSimStepIdx] ??
    scenario.simulationSteps[0]!;

  const selectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setActiveSimStepIdx(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <section className="border-b border-slate-800 bg-engineering-grid py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded border border-sky-500/40 bg-sky-950/60 px-3 py-1 font-mono text-xs text-sky-300">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <span>SECTION 6: REAL-WORLD SCENARIO LAB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Phòng Thí nghiệm Kiến trúc Thực tế (Real-World Scenario Lab)
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 leading-relaxed">
            Khám phá 6 kịch bản kiến trúc phần mềm thực tế: Tìm hiểu bài toán nghiệp vụ,
            lý do lựa chọn từng công nghệ, cách nhiều công nghệ cùng tồn tại (Coexist),
            chạy mô phỏng luồng gói tin qua các nút kiến trúc và phân tích sự đánh đổi
            (Trade-offs).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* 6 Scenario Selector Tabs */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_WORLD_SCENARIOS.map((sc) => {
            const active = sc.id === scenario.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => selectScenario(sc.id)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  active
                    ? 'border-sky-400 bg-sky-950/60 shadow-lg shadow-sky-950/40'
                    : 'border-slate-800 bg-slate-925 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    SCENARIO 0{sc.number}
                  </span>
                  <div className="flex gap-1">
                    {sc.technologies.map((tId) => (
                      <span
                        key={tId}
                        className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-200"
                      >
                        {tId}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-sm font-bold text-white leading-snug">
                  {sc.titleVi}
                </h2>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Workspace */}
        <div className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-8">
          {/* Scenario Title & Business Problem */}
          <div className="border-b border-slate-800 pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase text-sky-400">
                {scenario.titleEn}
              </span>
              {scenario.technologies.map((techId) => {
                const info = TECH_CLASSIFICATIONS.find((t) => t.id === techId);
                return (
                  <Link
                    key={techId}
                    href={`/modules/${techId}`}
                    className="rounded border border-sky-500/40 bg-sky-950/50 px-2.5 py-0.5 font-mono text-xs font-semibold text-sky-300 hover:bg-sky-900"
                  >
                    {info?.name ?? techId} ({info?.natureEn})
                  </Link>
                );
              })}
            </div>
            <h2 className="text-2xl font-bold text-white">{scenario.titleVi}</h2>
            <p className="text-sm text-slate-300">{scenario.subtitleVi}</p>

            <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-1.5 mt-3">
              <p className="font-mono text-xs font-bold uppercase text-amber-400">
                Bài toán Nghiệp vụ (Business Problem):
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {scenario.businessProblemVi}
              </p>
            </div>
          </div>

          {/* Interactive Multi-Node Architecture Diagram & Step Simulation */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
                  <Network className="h-4 w-4" />
                  <span>INTERACTIVE ARCHITECTURE & COMMUNICATION FLOW SIMULATION</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Sơ đồ Kiến trúc & Mô phỏng Luồng Gói tin Thực tế
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSimStepIdx(0)}
                  className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-300 hover:border-sky-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSimStepIdx((prev) =>
                      prev > 0 ? prev - 1 : scenario.simulationSteps.length - 1
                    )
                  }
                  className="rounded border border-slate-700 bg-slate-900 p-1.5 text-slate-200 hover:border-sky-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs font-bold text-sky-300 px-2">
                  Bước {currentStep.step} / {scenario.simulationSteps.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSimStepIdx((prev) =>
                      prev < scenario.simulationSteps.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="inline-flex items-center gap-1 rounded bg-sky-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-sky-400"
                >
                  <span>Bước tiếp theo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Architecture Nodes Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {scenario.nodes.map((node) => {
                const isSource = currentStep.fromNodeId === node.id;
                const isTarget = currentStep.toNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    className={`rounded-lg border p-4 transition-all ${
                      isSource
                        ? 'border-sky-400 bg-sky-950/60 shadow-lg'
                        : isTarget
                        ? 'border-emerald-400 bg-emerald-950/50 shadow-lg'
                        : 'border-slate-800 bg-slate-950/90'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] uppercase text-slate-400">
                        {node.role}
                      </span>
                      {isSource && (
                        <span className="rounded bg-sky-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-950">
                          SENDER
                        </span>
                      )}
                      {isTarget && (
                        <span className="rounded bg-emerald-400 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-950">
                          RECEIVER
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{node.name}</h4>
                    <p className="font-mono text-[11px] text-sky-300 mt-1">
                      {node.techUsed}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {node.descriptionVi}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Step Selector Pills */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {scenario.simulationSteps.map((st, idx) => (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setActiveSimStepIdx(idx)}
                  className={`rounded border p-3 text-left transition-all ${
                    activeSimStepIdx === idx
                      ? 'border-sky-400 bg-sky-950/50 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-sky-400 font-bold">STEP 0{st.step}</span>
                    <span className="uppercase text-emerald-400">{st.techId}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1">{st.actionLabel}</p>
                </button>
              ))}
            </div>

            {/* Active Simulation Step Payload & Explanation */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded border border-slate-800 bg-slate-950 p-5">
              <div className="lg:col-span-5 space-y-2">
                <span className="font-mono text-xs font-bold uppercase text-sky-400">
                  {currentStep.actionLabel} (Sử dụng:{' '}
                  {currentStep.techId.toUpperCase()})
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentStep.explanationVi}
                </p>
              </div>
              <div className="lg:col-span-7">
                <pre className="rounded border border-slate-800 bg-slate-900 p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <code>{currentStep.payload}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Why These Technologies & Trade-Offs */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 border-t border-slate-800 pt-6">
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-mono text-xs font-bold uppercase text-emerald-400">
                Lý do Lựa chọn Công nghệ (Reason for Technology Selection):
              </h3>
              <div className="space-y-2.5">
                {scenario.whyTheseTechnologiesVi.map((item) => (
                  <div
                    key={item.techId}
                    className="rounded border border-slate-800 bg-slate-950 p-3.5 text-xs space-y-1"
                  >
                    <span className="font-mono font-bold uppercase text-sky-400">
                      ✓ Tại sao dùng {item.techId.toUpperCase()}:
                    </span>
                    <p className="text-slate-200 leading-relaxed">{item.reasonVi}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-mono text-xs font-bold uppercase text-amber-400">
                Phân tích Đánh đổi Kiến trúc (Architectural Trade-Offs):
              </h3>
              <div className="rounded border border-amber-500/30 bg-amber-950/15 p-4 space-y-2.5 text-xs text-slate-200">
                {scenario.tradeOffsVi.map((tr) => (
                  <p key={tr} className="leading-relaxed">
                    • {tr}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
