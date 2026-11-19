'use client';

import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Activity,
  Database,
  Server,
  Monitor,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { ApiTechnologyId, HttpMethod } from '@/types/api';
import {
  UniversalSimConfig,
  UniversalSimScenarioMode,
  buildUniversalLifecycleSteps,
} from '@/simulations/engines';
import { SITE_CONFIG, TECH_CLASSIFICATIONS } from '@/config/site';
import { DedicatedModulePlayground } from '@/components/playgrounds/DedicatedPlaygrounds';

export default function InteractiveApiLabPage() {
  // Universal Simulator Configuration State
  const [config, setConfig] = useState<UniversalSimConfig>({
    method: 'POST',
    endpoint: '/api/v1/orders',
    authHeader: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid',
    requestBody: '{"productId": 101, "quantity": 2, "currency": "VND"}',
    mode: 'create-201',
  });

  // Simulation Execution State: idle | running | paused | completed
  const [simStatus, setSimStatus] = useState<
    'idle' | 'running' | 'paused' | 'completed'
  >('idle');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Dedicated Protocol Simulator Tab
  const [selectedTechTab, setSelectedTechTab] =
    useState<ApiTechnologyId>('rest');

  const steps = buildUniversalLifecycleSteps(config);
  const activeStep = steps[currentStepIdx] ?? steps[0]!;

  // Auto-advance timer when simStatus === 'running'
  useEffect(() => {
    if (simStatus !== 'running') return;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= steps.length - 1) {
          setSimStatus('completed');
          return prev;
        }
        return prev + 1;
      });
    }, SITE_CONFIG.stepIntervalMs);

    return () => clearInterval(timer);
  }, [simStatus, steps.length]);

  const handleStart = () => {
    setCurrentStepIdx(0);
    setSimStatus('running');
  };

  const handlePause = () => {
    setSimStatus('paused');
  };

  const handleResume = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setSimStatus('running');
  };

  const handleReset = () => {
    setSimStatus('idle');
    setCurrentStepIdx(0);
  };

  const isComponentActive = (
    comp: 'client' | 'api-layer' | 'server' | 'database'
  ) =>
    activeStep.activeComponent === comp || activeStep.targetComponent === comp;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Lab Header */}
      <section className="border-b border-slate-800 bg-engineering-grid py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded border border-sky-500/40 bg-sky-950/60 px-3 py-1 font-mono text-xs text-sky-300">
            <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
            <span>SECTION 5: INTERACTIVE API LABORATORY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Phòng Thí nghiệm Giao tiếp API (Interactive API Laboratory)
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 leading-relaxed">
            Không gian thực nghiệm kỹ thuật trung tâm: Khám phá Bộ mô phỏng Vòng đời
            Request/Response 8 bước (Universal Simulator) đồng bộ hóa với sơ đồ truyền
            thông trực quan, cùng 7 môi trường mô phỏng chuyên biệt cho từng giao thức.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        {/* PART A & C: UNIVERSAL 8-STEP REQUEST/RESPONSE SIMULATOR + SYNCHRONIZED VISUALIZATION */}
        <section className="rounded-lg border border-sky-500/40 bg-slate-925 p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-sky-400">
                PART A & C: UNIVERSAL REQUEST/RESPONSE SIMULATOR & COMMUNICATION WORKSPACE
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Bộ Mô phỏng Vòng đời 8 Bước: Client → API Layer → Server → Database
              </h2>
            </div>

            {/* Playback Controls: Start, Pause, Resume, Reset, Step Prev/Next */}
            <div className="flex flex-wrap items-center gap-2">
              {simStatus === 'idle' || simStatus === 'completed' ? (
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center gap-1.5 rounded bg-sky-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-sky-400"
                >
                  <Play className="h-3.5 w-3.5" />
                  Start Simulation
                </button>
              ) : null}

              {simStatus === 'running' ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="inline-flex items-center gap-1.5 rounded bg-amber-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </button>
              ) : null}

              {simStatus === 'paused' ? (
                <button
                  type="button"
                  onClick={handleResume}
                  className="inline-flex items-center gap-1.5 rounded bg-emerald-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  <Play className="h-3.5 w-3.5" />
                  Resume
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-200 hover:border-sky-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>

              <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimStatus('paused');
                    setCurrentStepIdx((prev) =>
                      prev > 0 ? prev - 1 : steps.length - 1
                    );
                  }}
                  className="rounded border border-slate-700 bg-slate-900 p-2 text-slate-200 hover:border-sky-400"
                  aria-label="Previous Step"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs px-2 text-sky-300 font-bold">
                  Bước {activeStep.stepNumber} / 8
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSimStatus('paused');
                    setCurrentStepIdx((prev) =>
                      prev < steps.length - 1 ? prev + 1 : 0
                    );
                  }}
                  className="rounded border border-slate-700 bg-slate-900 p-2 text-slate-200 hover:border-sky-400"
                  aria-label="Next Step"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Scenario & Editable Input Configuration Bar */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 rounded border border-slate-800 bg-slate-950 p-4">
            <div className="lg:col-span-5 space-y-2">
              <p className="font-mono text-[11px] font-bold uppercase text-slate-400">
                1. Chọn Kịch bản Trạng thái / Chèn Lỗi (Fault Injection):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'create-201', label: '201 Created (Chuẩn)' },
                    { id: 'normal-200', label: '200 OK (Truy vấn)' },
                    { id: 'bad-request-400', label: '400 Schema Error' },
                    { id: 'unauthorized-401', label: '401 Auth Error' },
                    { id: 'server-error-500', label: '500 DB Failure' },
                  ] as { id: UniversalSimScenarioMode; label: string }[]
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        mode: m.id,
                        method: m.id === 'normal-200' ? 'GET' : 'POST',
                      }));
                      setCurrentStepIdx(0);
                    }}
                    className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                      config.mode === m.id
                        ? 'border-sky-400 bg-sky-500 text-slate-950 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                  Method & Endpoint
                </label>
                <div className="flex gap-1">
                  <select
                    aria-label="Universal Method"
                    value={config.method}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        method: e.target.value as HttpMethod,
                      }))
                    }
                    className="rounded border border-slate-800 bg-slate-900 px-2 py-1.5 font-mono text-xs text-sky-400 font-bold"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={config.endpoint}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, endpoint: e.target.value }))
                    }
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2 py-1.5 font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                  Authorization Header
                </label>
                <input
                  type="text"
                  value={config.authHeader}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, authHeader: e.target.value }))
                  }
                  className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                  JSON Payload
                </label>
                <input
                  type="text"
                  value={config.requestBody}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      requestBody: e.target.value,
                    }))
                  }
                  className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-emerald-300"
                />
              </div>
            </div>
          </div>

          {/* PART C: SYNCHRONIZED VISUAL ARCHITECTURE WORKSPACE (3 Primary Components + DB) */}
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-400" />
                <span className="font-mono text-xs font-bold uppercase text-slate-200">
                  Sơ đồ Trực quan Hóa Truyền thông Đồng bộ Trạng thái (Synchronized
                  Architecture Workspace)
                </span>
              </div>
              <span className="rounded border border-sky-500/40 bg-sky-950/60 px-2.5 py-0.5 font-mono text-xs text-sky-300">
                STATE: {activeStep.communicationState}
              </span>
            </div>

            {/* 4 Component Nodes with Directional Pulse Connectors */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {(
                [
                  {
                    id: 'client',
                    title: '1. CLIENT',
                    subtitle: 'Browser / App / Caller',
                    desc: 'Step 1 (Construct), Step 2 (Send), Step 8 (Receive & Render)',
                    icon: Monitor,
                  },
                  {
                    id: 'api-layer',
                    title: '2. API LAYER',
                    subtitle: 'Gateway / Auth / Schema Guard',
                    desc: 'Step 3 (Validate & Route), Step 7 (Return Response)',
                    icon: ShieldCheck,
                  },
                  {
                    id: 'server',
                    title: '3. SERVER',
                    subtitle: 'Domain Business Logic',
                    desc: 'Step 4 (Execute Logic), Step 6 (Generate Response DTO)',
                    icon: Server,
                  },
                  {
                    id: 'database',
                    title: '4. DATABASE',
                    subtitle: 'ACID Storage Engine',
                    desc: 'Step 5 (Persistence Query & Transaction)',
                    icon: Database,
                  },
                ] as const
              ).map((comp) => {
                const active = isComponentActive(comp.id);
                const IconComp = comp.icon;
                return (
                  <div
                    key={comp.id}
                    className={`rounded-lg border p-4 transition-all ${
                      active
                        ? 'border-sky-400 bg-sky-950/60 shadow-lg shadow-sky-950/50 scale-[1.01]'
                        : 'border-slate-800 bg-slate-900/60 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {comp.title}
                      </span>
                      <IconComp
                        className={`h-4 w-4 ${
                          active ? 'text-sky-400' : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <p className="font-mono text-[11px] text-sky-300">
                      {comp.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                      {comp.desc}
                    </p>
                    {active && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded bg-sky-400/20 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-300">
                        <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                        ACTIVE AT STEP {activeStep.stepNumber}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 8-Step Interactive Progress Timeline Bar */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 pt-2">
              {steps.map((st, idx) => {
                const isCurrent = idx === currentStepIdx;
                const isDone = idx < currentStepIdx;
                return (
                  <button
                    key={st.stepNumber}
                    type="button"
                    onClick={() => {
                      setSimStatus('paused');
                      setCurrentStepIdx(idx);
                    }}
                    className={`rounded border p-2.5 text-left transition-all ${
                      isCurrent
                        ? 'border-sky-400 bg-sky-500/20 text-white'
                        : isDone
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                      <span>STEP 0{st.stepNumber}</span>
                      <span>
                        {st.direction === 'request'
                          ? '──►'
                          : st.direction === 'response'
                          ? '◄──'
                          : '⚙'}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold mt-1 line-clamp-2">
                      {st.titleVi.replace(/^Bước \d+:\s*/, '')}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Step Deep-Dive Panel */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded border border-slate-800 bg-slate-925 p-5">
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {activeStep.titleEn}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-300">
                    Active Node: {activeStep.activeComponent.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {activeStep.titleVi}
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeStep.shortExplanationVi}
                </p>
                <div className="rounded border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                  <span className="font-mono text-[11px] font-bold text-emerald-400 block mb-1">
                    Cơ chế Kỹ thuật (Technical Mechanism):
                  </span>
                  {activeStep.technicalMechanismVi}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-amber-300">
                    Dữ liệu / Gói tin tại Bước {activeStep.stepNumber} (Live Payload
                    Snapshot)
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Direction: {activeStep.direction.toUpperCase()}
                  </span>
                </div>
                <pre className="rounded border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto min-h-[140px]">
                  <code>{activeStep.payloadSnapshot}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* PART B: 7 DEDICATED API SIMULATIONS SWITCHER */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-emerald-400">
                PART B: DEDICATED PROTOCOL SIMULATORS
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                7 Môi trường Mô phỏng Chuyên biệt theo Đặc trưng Công nghệ
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Mỗi công nghệ có một mô hình tương tác riêng biệt. Chọn tab bên dưới để
                thực nghiệm trực tiếp.
              </p>
            </div>
          </div>

          {/* 7 Protocol Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {TECH_CLASSIFICATIONS.map((tech, idx) => {
              const active = tech.id === selectedTechTab;
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedTechTab(tech.id)}
                  className={`rounded border px-3.5 py-2 font-mono text-xs transition-all ${
                    active
                      ? 'border-sky-400 bg-sky-500 text-slate-950 font-bold'
                      : 'border-slate-800 bg-slate-925 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  0{idx + 1}. {tech.shortName} ({tech.natureEn})
                </button>
              );
            })}
          </div>

          {/* Render the selected dedicated playground */}
          <DedicatedModulePlayground moduleId={selectedTechTab} />
        </section>
      </div>
    </div>
  );
}
