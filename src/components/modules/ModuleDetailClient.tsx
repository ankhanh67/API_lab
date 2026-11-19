'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Layers,
  Code2,
  FlaskConical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Network,
  Activity,
} from 'lucide-react';
import { LearningModule, QuizQuestion } from '@/types/api';
import { TECH_CLASSIFICATIONS } from '@/config/site';
import { DedicatedModulePlayground } from '@/components/playgrounds/DedicatedPlaygrounds';

export function ModuleDetailClient({
  moduleData,
  moduleQuizzes,
}: {
  moduleData: LearningModule;
  moduleQuizzes: QuizQuestion[];
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    moduleData.architecture.nodes[0]?.id ?? ''
  );
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    {}
  );

  const activeNode =
    moduleData.architecture.nodes.find((n) => n.id === selectedNodeId) ??
    moduleData.architecture.nodes[0]!;
  const activeFlow =
    moduleData.communicationFlow[selectedFlowStep] ??
    moduleData.communicationFlow[0]!;

  const prevTech = TECH_CLASSIFICATIONS[moduleData.order - 2];
  const nextTech = TECH_CLASSIFICATIONS[moduleData.order];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Module Switcher Strip */}
      <div className="border-b border-slate-800 bg-slate-925">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[10px] uppercase text-slate-400 shrink-0 mr-1">
            7 Chuyên đề:
          </span>
          {TECH_CLASSIFICATIONS.map((tech, idx) => {
            const isCurrent = tech.id === moduleData.id;
            return (
              <Link
                key={tech.id}
                href={tech.href}
                className={`shrink-0 rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                  isCurrent
                    ? 'border-sky-400 bg-sky-500/20 text-white font-bold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                0{idx + 1}. {tech.shortName}
              </Link>
            );
          })}
        </div>
      </div>

      {/* HERO / SECTION 1: INTRODUCTION */}
      <section className="border-b border-slate-800 bg-engineering-grid py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-400">
              MODULE 0{moduleData.order} / 07
            </span>
            <span
              className={`rounded border px-3 py-1 font-mono text-xs font-bold ${moduleData.badgeClass}`}
            >
              Bản chất kỹ thuật: {moduleData.technicalNature}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {moduleData.name}
            </h1>
            <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
              {moduleData.taglineVi}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 pt-2">
            <div className="rounded border border-slate-800 bg-slate-925/90 p-4 space-y-1.5">
              <p className="font-mono text-[10px] uppercase text-sky-400">
                1. Định nghĩa & Bản chất
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {moduleData.introduction.hookVi}
              </p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-925/90 p-4 space-y-1.5">
              <p className="font-mono text-[10px] uppercase text-amber-400">
                2. Bài toán Giải quyết
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {moduleData.introduction.problemSolvedVi}
              </p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-925/90 p-4 space-y-1.5">
              <p className="font-mono text-[10px] uppercase text-violet-400">
                3. Bối cảnh Ra đời
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {moduleData.introduction.historicalContextVi}
              </p>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1.5">
              <p className="font-mono text-[10px] uppercase text-emerald-400">
                4. Cộng sinh Kiến trúc (Coexistence)
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {moduleData.introduction.coexistenceNoteVi}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-14">
        {/* SECTION 2: CORE CONCEPTS */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-sky-400">
              02. CORE CONCEPTS
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">
              Các Khái niệm Kỹ thuật Cốt lõi của {moduleData.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {moduleData.coreConcepts.map((concept, idx) => (
              <div
                key={concept.termEn}
                className="rounded-lg border border-slate-800 bg-slate-925 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    0{idx + 1}. {concept.termEn}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{concept.titleVi}</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {concept.summaryVi}
                </p>
                <div className="rounded border border-slate-800/90 bg-slate-950 p-3 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-sky-300">Cơ chế sâu: </span>
                  {concept.deepDiveVi}
                </div>
                {concept.codeSnippet && (
                  <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <code>{concept.codeSnippet}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 & 4: ARCHITECTURE VISUALIZATION & HOW IT WORKS */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Interactive Architecture Diagram */}
          <div className="lg:col-span-7 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
                <Network className="h-4 w-4" />
                <span>03. ARCHITECTURE TOPOLOGY</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Sơ đồ Kiến trúc Thành phần {moduleData.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {moduleData.architecture.summaryVi}
              </p>
            </div>

            {/* Interactive Nodes Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {moduleData.architecture.nodes.map((node, idx) => {
                const isSelected = node.id === activeNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`rounded border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-sky-400 bg-sky-950/60'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] uppercase text-sky-400">
                        NODE 0{idx + 1}
                      </span>
                      {idx < moduleData.architecture.nodes.length - 1 && (
                        <span className="font-mono text-xs text-slate-500">→</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white">{node.label}</p>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                      {node.sublabel}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Edges / Connections Summary */}
            <div className="flex flex-wrap gap-2">
              {moduleData.architecture.edges.map((edge) => (
                <div
                  key={edge.id}
                  className="rounded border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-[11px] text-slate-300"
                >
                  <span className="text-sky-400">{edge.label}</span> ({edge.protocol})
                </div>
              ))}
            </div>

            {/* Active Node Inspector */}
            <div className="rounded border border-sky-500/30 bg-slate-950 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">
                  Đang kiểm tra thành phần: {activeNode.label}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                  {activeNode.techDetails}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeNode.descriptionVi}
              </p>
            </div>
          </div>

          {/* Section 4: How It Works Internally */}
          <div className="lg:col-span-5 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-emerald-400">
                <Cpu className="h-4 w-4" />
                <span>04. HOW IT WORKS INTERNALLY</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Cơ chế Vận hành Nội bộ
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {moduleData.howItWorks.overviewVi}
            </p>

            <div className="space-y-2.5">
              {moduleData.howItWorks.internalMechanismVi.map((stepText) => (
                <div
                  key={stepText}
                  className="rounded border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 leading-relaxed"
                >
                  {stepText}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: COMMUNICATION FLOW TIMELINE */}
        <section className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
              <Activity className="h-4 w-4" />
              <span>05. STEP-BY-STEP COMMUNICATION FLOW</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Luồng Giao tiếp & Biến đổi Gói tin qua Từng Chặng
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {moduleData.communicationFlow.map((stage, idx) => (
              <button
                key={stage.step}
                type="button"
                onClick={() => setSelectedFlowStep(idx)}
                className={`rounded border p-3.5 text-left transition-all ${
                  selectedFlowStep === idx
                    ? 'border-sky-400 bg-sky-950/50'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <span className="font-mono text-[10px] font-bold text-sky-400">
                  STEP 0{stage.step} — {stage.actor}
                </span>
                <p className="text-xs font-bold text-white mt-1">{stage.actionEn}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {stage.descriptionVi}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded border border-slate-800 bg-slate-950 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-5 space-y-1.5">
              <span className="font-mono text-xs font-bold text-sky-400">
                Bước {activeFlow.step}: {activeFlow.actor} ({activeFlow.actionEn})
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeFlow.descriptionVi}
              </p>
            </div>
            <div className="lg:col-span-7">
              <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>{activeFlow.payloadExample}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 7 (FEATURED): DEDICATED INTERACTIVE PLAYGROUND */}
        <section id="playground" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
                <FlaskConical className="h-4 w-4" />
                <span>07. INTERACTIVE SIMULATION PLAYGROUND</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Phòng Thí nghiệm Tương tác Chuyên biệt cho {moduleData.name}
              </h2>
            </div>
            <Link
              href="/lab"
              className="font-mono text-xs text-sky-400 hover:text-sky-300"
            >
              Mở trong Universal API Laboratory →
            </Link>
          </div>

          <DedicatedModulePlayground moduleId={moduleData.id} />
        </section>

        {/* SECTION 6: PRACTICAL CODE EXAMPLE */}
        <section className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-emerald-400">
              <Code2 className="h-4 w-4" />
              <span>06. PRACTICAL CODE IMPLEMENTATION</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              {moduleData.practicalExample.scenarioTitleVi}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {moduleData.practicalExample.scenarioDescriptionVi}
            </p>
          </div>

          {moduleData.practicalExample.codeExamples.map((ex) => (
            <div
              key={ex.titleVi}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded border border-slate-800 bg-slate-950 p-4"
            >
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="font-mono text-xs font-bold text-white">
                    {ex.titleVi}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] uppercase text-sky-300">
                    {ex.language}
                  </span>
                </div>
                <pre className="overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed">
                  <code>{ex.code}</code>
                </pre>
              </div>
              <div className="lg:col-span-4 space-y-3">
                <p className="font-mono text-xs font-bold uppercase text-sky-400">
                  Chú giải Kỹ thuật:
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ex.descriptionVi}
                </p>
                {ex.annotations.map((ann) => (
                  <div
                    key={ann.lineHint}
                    className="rounded border border-slate-800 bg-slate-900 p-3 space-y-1"
                  >
                    <code className="font-mono text-[11px] text-amber-300">
                      {ann.lineHint}
                    </code>
                    <p className="text-xs text-slate-300">{ann.explanationVi}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 8 & 9: REAL-WORLD USE CASES + ADVANTAGES & LIMITATIONS */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Section 8: Use Cases & When Not To Use */}
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <p className="font-mono text-xs font-bold uppercase text-sky-400">
              08. REAL-WORLD USE CASES & WHEN NOT TO USE
            </p>
            <h2 className="text-xl font-bold text-white">
              Ứng dụng Thực tế & Khi nào KHÔNG nên dùng {moduleData.name}
            </h2>

            <div className="space-y-3">
              {moduleData.useCases.map((uc) => (
                <div
                  key={uc.titleVi}
                  className="rounded border border-slate-800 bg-slate-950 p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{uc.titleVi}</h3>
                    <span className="font-mono text-[10px] text-sky-400">
                      {uc.industry}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{uc.descriptionVi}</p>
                  <p className="text-xs text-emerald-300">
                    <strong>Lý do phù hợp:</strong> {uc.whyItFitsVi}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded border border-amber-500/30 bg-amber-950/15 p-4 space-y-2">
              <p className="font-mono text-xs font-bold text-amber-400">
                Khi nào KHÔNG nên chọn {moduleData.name}?
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 list-disc pl-4">
                {moduleData.WhenNotToUseVi.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 9: Advantages and Limitations */}
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <p className="font-mono text-xs font-bold uppercase text-emerald-400">
              09. ADVANTAGES & LIMITATIONS (TRADE-OFFS)
            </p>
            <h2 className="text-xl font-bold text-white">
              Ưu điểm Kỹ thuật & Những Giới hạn Đánh đổi
            </h2>

            <div className="rounded border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-2">
              <p className="font-mono text-xs font-bold text-emerald-400">
                Ưu điểm nổi bật (Advantages)
              </p>
              <ul className="space-y-2 text-xs text-slate-200">
                {moduleData.advantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded border border-rose-500/30 bg-rose-950/15 p-4 space-y-2">
              <p className="font-mono text-xs font-bold text-rose-400">
                Hạn chế & Thách thức (Limitations)
              </p>
              <ul className="space-y-2 text-xs text-slate-200">
                {moduleData.limitations.map((lim) => (
                  <li key={lim} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 10 & 11: COMPARISON WITH RELATED TECHNOLOGIES & COMMON MISCONCEPTIONS */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Section 10: Related Tech Comparisons */}
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <p className="font-mono text-xs font-bold uppercase text-sky-400">
              10. COMPARISON WITH RELATED TECHNOLOGIES
            </p>
            <h2 className="text-xl font-bold text-white">
              Đối chiếu với Công nghệ Liên quan
            </h2>
            <div className="space-y-3">
              {moduleData.relatedComparisons.map((cmp) => (
                <div
                  key={cmp.comparedWith}
                  className="rounded border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
                >
                  <p className="font-mono font-bold text-sky-400">
                    {moduleData.name} vs {cmp.comparedWith}
                  </p>
                  <p className="text-slate-200 leading-relaxed">
                    {cmp.keyDifferenceVi}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="rounded border border-slate-800 bg-slate-900 p-2.5">
                      <span className="font-mono text-[10px] text-emerald-400 block">
                        Chọn {moduleData.name} khi:
                      </span>
                      <span className="text-slate-300">{cmp.whenToChooseThisVi}</span>
                    </div>
                    <div className="rounded border border-slate-800 bg-slate-900 p-2.5">
                      <span className="font-mono text-[10px] text-amber-400 block">
                        Chọn {cmp.comparedWith} khi:
                      </span>
                      <span className="text-slate-300">{cmp.whenToChooseOtherVi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: Common Misconceptions */}
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <p className="font-mono text-xs font-bold uppercase text-amber-400">
              11. COMMON MISCONCEPTIONS
            </p>
            <h2 className="text-xl font-bold text-white">
              Những Hiểu lầm Phổ biến Cần Tránh
            </h2>
            <div className="space-y-3">
              {moduleData.misconceptions.map((m) => (
                <div
                  key={m.mythVi}
                  className="rounded border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
                >
                  <p className="font-semibold text-rose-300">
                    ❌ Hiểu lầm: {m.mythVi}
                  </p>
                  <p className="text-emerald-300 leading-relaxed">
                    ✅ Sự thật kỹ thuật: {m.realityVi}
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    Bằng chứng: {m.technicalProofVi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 12: MODULE KNOWLEDGE CHECK */}
        <section className="rounded-lg border border-sky-500/40 bg-slate-925 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
                <HelpCircle className="h-4 w-4" />
                <span>12. KNOWLEDGE CHECK</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Kiểm tra Nhanh Kiến thức Chuyên đề {moduleData.name}
              </h2>
            </div>
            <Link
              href="/assessment"
              className="font-mono text-xs text-sky-400 hover:text-sky-300"
            >
              Làm bài đánh giá tổng hợp toàn khóa →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {moduleQuizzes.map((q, qIdx) => {
              const chosenId = selectedAnswers[q.id];
              const chosenOpt = q.options.find((o) => o.id === chosenId);

              return (
                <div
                  key={q.id}
                  className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      Câu hỏi 0{qIdx + 1} ({q.type})
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {q.questionVi}
                  </p>
                  {q.codeContext && (
                    <pre className="rounded border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-slate-300">
                      <code>{q.codeContext}</code>
                    </pre>
                  )}
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isChosen = chosenId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.id,
                            }))
                          }
                          className={`w-full rounded border p-2.5 text-left text-xs transition-colors ${
                            !chosenId
                              ? 'border-slate-800 bg-slate-900 text-slate-200 hover:border-sky-500/50'
                              : isChosen && opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold'
                              : isChosen && !opt.isCorrect
                              ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                              : opt.isCorrect
                              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                              : 'border-slate-800 bg-slate-900/40 text-slate-500'
                          }`}
                        >
                          <span className="font-mono uppercase mr-2 font-bold">
                            [{opt.id}]
                          </span>
                          {opt.textVi}
                        </button>
                      );
                    })}
                  </div>

                  {chosenOpt && (
                    <div
                      className={`rounded border p-3 text-xs space-y-1 ${
                        chosenOpt.isCorrect
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                          : 'border-rose-500/40 bg-rose-950/20 text-rose-200'
                      }`}
                    >
                      <p className="font-bold">
                        {chosenOpt.isCorrect
                          ? '✓ Chính xác!'
                          : '✕ Chưa chính xác.'}
                      </p>
                      <p className="text-slate-200 leading-relaxed">
                        {q.explanationVi}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Prev / Next Module Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6">
          {prevTech ? (
            <Link
              href={prevTech.href}
              className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-sky-400"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Chuyên đề trước: {prevTech.name}</span>
            </Link>
          ) : (
            <Link
              href="/fundamentals"
              className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-sky-400"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại: Nền tảng API</span>
            </Link>
          )}

          {nextTech ? (
            <Link
              href={nextTech.href}
              className="inline-flex items-center gap-2 rounded bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400"
            >
              <span>Chuyên đề tiếp theo: {nextTech.name}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 rounded bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400"
            >
              <span>Tiếp tục tới: Interactive API Laboratory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
