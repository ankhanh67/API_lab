'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/data/quizzes';
import { TECH_CLASSIFICATIONS } from '@/config/site';
import { ApiTechnologyId, QuizQuestionType } from '@/types/api';

type ModuleFilter = 'all' | ApiTechnologyId | 'comprehensive';
type TypeFilter = 'all' | QuizQuestionType;

export default function KnowledgeAssessmentPage() {
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    const matchModule =
      moduleFilter === 'all' ? true : q.moduleId === moduleFilter;
    const matchType = typeFilter === 'all' ? true : q.type === typeFilter;
    return matchModule && matchType;
  });

  const answeredCount = filteredQuestions.filter((q) => answers[q.id]).length;
  const correctCount = filteredQuestions.filter((q) => {
    const chosen = answers[q.id];
    if (!chosen) return false;
    return q.options.find((o) => o.id === chosen)?.isCorrect === true;
  }).length;

  const scorePercent =
    filteredQuestions.length > 0
      ? Math.round((correctCount / filteredQuestions.length) * 100)
      : 0;

  const resetQuiz = () => {
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <section className="border-b border-slate-800 bg-engineering-grid py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded border border-sky-500/40 bg-sky-950/60 px-3 py-1 font-mono text-xs text-sky-300">
            <Award className="h-3.5 w-3.5 text-sky-400" />
            <span>SECTION 8: KNOWLEDGE ASSESSMENT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Hệ thống Đánh giá Năng lực Kỹ thuật API (Interactive Quiz System)
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 leading-relaxed">
            Kiểm tra toàn diện kiến thức qua 3 cấp độ: Khái niệm & Thuật ngữ (Type 1:
            Multiple Choice), Cơ chế Truyền thông Kỹ thuật (Type 2: Technical
            Understanding) và Ra quyết định Chọn công nghệ cho Kịch bản Thực tế (Type 3:
            Scenario-Based Questions).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Scoreboard & Filter Bar */}
        <div className="rounded-lg border border-slate-800 bg-slate-925 p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase text-slate-400">
                  Tiến độ làm bài
                </p>
                <p className="font-mono text-xl font-bold text-white">
                  {answeredCount} / {filteredQuestions.length} câu
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase text-slate-400">
                  Số câu đúng
                </p>
                <p className="font-mono text-xl font-bold text-emerald-400">
                  {correctCount} ({scorePercent}%)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetQuiz}
              className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900 px-3.5 py-2 font-mono text-xs text-slate-200 hover:border-sky-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Làm lại Bài đánh giá
            </button>
          </div>

          {/* Filters by Module and Question Type */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-1.5">
              <p className="font-mono text-[11px] uppercase text-slate-400">
                Lọc theo Chuyên đề:
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setModuleFilter('all')}
                  className={`rounded border px-2.5 py-1 font-mono text-xs ${
                    moduleFilter === 'all'
                      ? 'border-sky-400 bg-sky-500 text-slate-950 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  Tổng hợp Toàn khóa ({QUIZ_QUESTIONS.length})
                </button>
                {TECH_CLASSIFICATIONS.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setModuleFilter(tech.id)}
                    className={`rounded border px-2.5 py-1 font-mono text-xs ${
                      moduleFilter === tech.id
                        ? 'border-sky-400 bg-sky-500 text-slate-950 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {tech.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-1.5">
              <p className="font-mono text-[11px] uppercase text-slate-400">
                Lọc theo Dạng câu hỏi:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'all', label: 'Tất cả 3 Dạng' },
                    { id: 'multiple-choice', label: 'Type 1: Khái niệm' },
                    {
                      id: 'technical-understanding',
                      label: 'Type 2: Cơ chế Kỹ thuật',
                    },
                    { id: 'scenario-based', label: 'Type 3: Tình huống Thực tế' },
                  ] as { id: TypeFilter; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeFilter(t.id)}
                    className={`rounded border px-2.5 py-1 font-mono text-xs ${
                      typeFilter === t.id
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-5">
          {filteredQuestions.map((q, idx) => {
            const chosenId = answers[q.id];
            const chosenOpt = q.options.find((o) => o.id === chosenId);

            const typeBadgeLabel =
              q.type === 'multiple-choice'
                ? 'Type 1: Multiple Choice (Khái niệm)'
                : q.type === 'technical-understanding'
                ? 'Type 2: Technical Understanding (Cơ chế)'
                : 'Type 3: Scenario-Based (Tình huống Kiến trúc)';

            return (
              <div
                key={q.id}
                className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-sky-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-sky-300">
                      CÂU {idx + 1}
                    </span>
                    <span className="rounded border border-slate-700 bg-slate-900 px-2.5 py-0.5 font-mono text-[11px] uppercase text-slate-300">
                      Chủ đề: {q.moduleId}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-amber-300">
                    {typeBadgeLabel}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white leading-relaxed">
                  {q.questionVi}
                </h2>

                {q.codeContext && (
                  <pre className="rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <code>{q.codeContext}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {q.options.map((opt) => {
                    const isChosen = chosenId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                        className={`rounded border p-3.5 text-left text-xs leading-relaxed transition-all ${
                          !chosenId
                            ? 'border-slate-800 bg-slate-950 text-slate-200 hover:border-sky-500/50'
                            : isChosen && opt.isCorrect
                            ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200 font-semibold'
                            : isChosen && !opt.isCorrect
                            ? 'border-rose-400 bg-rose-950/40 text-rose-200'
                            : opt.isCorrect
                            ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                            : 'border-slate-800/60 bg-slate-950/40 text-slate-500'
                        }`}
                      >
                        <span className="font-mono font-bold uppercase mr-2 text-sky-400">
                          [{opt.id}]
                        </span>
                        {opt.textVi}
                      </button>
                    );
                  })}
                </div>

                {chosenOpt && (
                  <div
                    className={`rounded border p-4 text-xs space-y-2 ${
                      chosenOpt.isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-rose-500/40 bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {chosenOpt.isCorrect ? (
                        <span className="text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Chính xác!
                        </span>
                      ) : (
                        <span className="text-rose-300 flex items-center gap-1.5">
                          <XCircle className="h-4 w-4" /> Chưa chính xác — Hãy xem
                          giải thích kỹ thuật bên dưới:
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      <strong>Giải thích chi tiết:</strong> {q.explanationVi}
                    </p>
                    <p className="text-sky-300 font-mono text-[11px]">
                      💡 Khuyến nghị học tập: {q.recommendationVi}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
