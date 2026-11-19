'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Server,
  Globe,
  FileCode2,
  Shield,
  Activity,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import {
  FUNDAMENTAL_LIFECYCLE_STAGES,
  HTTP_METHODS_GUIDE,
  HTTP_STATUS_CATEGORIES,
  DATA_FORMATS_COMPARISON,
  AUTH_MECHANISMS,
} from '@/data/fundamentals';

export default function FundamentalsPage() {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [selectedMethodIdx, setSelectedMethodIdx] = useState<number>(0);
  const [selectedFormatId, setSelectedFormatId] = useState<string>('json');
  const [selectedAuthId, setSelectedAuthId] = useState<string>('jwt');

  const activeStage =
    FUNDAMENTAL_LIFECYCLE_STAGES[selectedStageIdx] ??
    FUNDAMENTAL_LIFECYCLE_STAGES[0]!;
  const activeMethod =
    HTTP_METHODS_GUIDE[selectedMethodIdx] ?? HTTP_METHODS_GUIDE[0]!;
  const activeFormat =
    DATA_FORMATS_COMPARISON.find((f) => f.id === selectedFormatId) ??
    DATA_FORMATS_COMPARISON[0]!;
  const activeAuth =
    AUTH_MECHANISMS.find((a) => a.id === selectedAuthId) ?? AUTH_MECHANISMS[0]!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header Banner */}
      <section className="border-b border-slate-800 bg-engineering-grid py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded border border-sky-500/30 bg-sky-950/50 px-3 py-1 font-mono text-xs text-sky-300">
            <BookOpen className="h-3.5 w-3.5" />
            <span>SECTION B: API FUNDAMENTALS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Nền tảng Kỹ thuật Giao tiếp API (API Fundamentals)
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 leading-relaxed">
            Trước khi đi sâu vào 7 công nghệ chuyên biệt, bạn cần nắm vững các khái niệm
            cốt lõi: Bản chất của hợp đồng giao diện lập trình (API Contract), mô hình
            Client–Server, cấu trúc gói tin HTTP, tuần tự hóa dữ liệu (Serialization), cơ
            chế Bảo mật và 7 chặng trong vòng đời của một API Request.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* TOPIC 1 & 2: WHAT IS AN API & CLIENT/SERVER ARCHITECTURE */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
              <span>01. What is an API?</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              API là gì và tại sao phần mềm hiện đại không thể thiếu API?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">
                API (Application Programming Interface)
              </strong>{' '}
              là một <strong className="text-sky-300">hợp đồng kỹ thuật (Contract)</strong>{' '}
              quy định cách thức một phần mềm có thể yêu cầu dịch vụ hoặc trao đổi dữ liệu
              với một phần mềm khác mà không cần biết mã nguồn bên trong của nhau được cài
              đặt như thế nào (nguyên lý Đóng gói & Trừu tượng hóa —{' '}
              <em>Abstraction & Encapsulation</em>).
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="rounded border border-slate-800 bg-slate-950 p-3">
                <p className="font-mono text-xs font-semibold text-white">
                  Tại sao API tồn tại?
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Tách biệt giao diện người dùng (Web, iOS, Android) khỏi lõi xử lý dữ liệu
                  (Backend); cho phép các hệ thống viết bằng ngôn ngữ khác nhau (Python,
                  Go, Java, TypeScript) phối hợp nhịp nhàng.
                </p>
              </div>
              <div className="rounded border border-slate-800 bg-slate-950 p-3">
                <p className="font-mono text-xs font-semibold text-emerald-400">
                  Ví dụ thực tế trong đời sống phần mềm
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Khi bạn đặt vé máy bay trên ứng dụng du lịch, ứng dụng đó không sở hữu
                  máy bay. Nó gửi yêu cầu qua API tới hệ thống của Vietnam Airlines/Vietjet
                  để kiểm tra ghế trống, và gọi API sang cổng VNPay/Stripe để thanh toán.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-emerald-400">
              <Server className="h-4 w-4" />
              <span>02. Client and Server Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Mô hình Client – Server & Kiến trúc Request / Response
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lưu ý quan trọng: <strong className="text-white">Client</strong> không chỉ là
              trình duyệt hay điện thoại. Bất kỳ tiến trình nào{' '}
              <strong className="text-emerald-300">chủ động gửi yêu cầu</strong> đều đóng
              vai trò là Client trong giao dịch đó (ví dụ: Order Microservice gọi sang
              Payment Microservice).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded border border-sky-500/30 bg-slate-950 p-3.5 space-y-1.5">
                <span className="font-mono text-[11px] font-bold uppercase text-sky-400">
                  Vai trò của Client
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  <li>Khởi tạo kết nối và đóng gói tham số đầu vào.</li>
                  <li>Chờ phản hồi (Đồng bộ hoặc Bất đồng bộ).</li>
                  <li>Xử lý lỗi mạng và hiển thị kết quả lên giao diện.</li>
                </ul>
              </div>
              <div className="rounded border border-emerald-500/30 bg-slate-950 p-3.5 space-y-1.5">
                <span className="font-mono text-[11px] font-bold uppercase text-emerald-400">
                  Vai trò của Server
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  <li>Lắng nghe trên cổng mạng (Port) và xác thực quyền.</li>
                  <li>Thực thi quy tắc nghiệp vụ (Business Logic).</li>
                  <li>Đảm bảo toàn vẹn dữ liệu với Database và trả kết quả.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TOPIC 6 (HIGHLIGHTED INTERACTIVE DIAGRAM): 7-STAGE API LIFECYCLE EXPLORER */}
        <section className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
                <Activity className="h-4 w-4" />
                <span>06. Interactive API Lifecycle Diagram</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Sơ đồ Tương tác Vòng đời API: Từ Client đến Database và Quay về
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Nhấp vào từng chặng trong sơ đồ bên dưới để mổ xẻ cơ chế xử lý nội bộ và
                dữ liệu thô trên đường truyền.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedStageIdx((prev) =>
                    prev > 0 ? prev - 1 : FUNDAMENTAL_LIFECYCLE_STAGES.length - 1
                  )
                }
                className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-200 hover:border-sky-500"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Bước trước
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedStageIdx((prev) =>
                    prev < FUNDAMENTAL_LIFECYCLE_STAGES.length - 1 ? prev + 1 : 0
                  )
                }
                className="inline-flex items-center gap-1 rounded border border-sky-500 bg-sky-500/20 px-3 py-1.5 text-xs font-mono font-semibold text-sky-300 hover:bg-sky-500/30"
              >
                Bước tiếp theo
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 7 Interactive Pipeline Nodes: Client -> API Request -> API Layer -> Server -> Database -> Server Response -> Client */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
            {FUNDAMENTAL_LIFECYCLE_STAGES.map((stage, idx) => {
              const isSelected = idx === selectedStageIdx;
              const isPassed = idx < selectedStageIdx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`relative flex flex-col justify-between rounded border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/60 shadow-lg shadow-sky-950/50'
                      : isPassed
                      ? 'border-emerald-500/40 bg-emerald-950/15 text-slate-300'
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-sky-400 text-slate-950'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      STEP 0{stage.order}
                    </span>
                    {idx < FUNDAMENTAL_LIFECYCLE_STAGES.length - 1 && (
                      <span className="font-mono text-xs text-slate-500 hidden sm:inline">
                        →
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white leading-snug">
                    {stage.nameVi}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {stage.roleEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Details Split View */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded border border-slate-800 bg-slate-950 p-5">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-400">
                  {activeStage.nameEn}
                </span>
                <span className="rounded border border-slate-800 bg-slate-900 px-2.5 py-0.5 font-mono text-[11px] text-slate-300">
                  {activeStage.roleEn}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{activeStage.nameVi}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeStage.summaryVi}
              </p>

              <div className="space-y-2 pt-1">
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  Cơ chế xử lý bên trong (Internal Mechanism):
                </p>
                <ul className="space-y-2">
                  {activeStage.internalWorkingsVi.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between rounded border border-slate-800 bg-slate-925 p-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="font-mono text-[11px] font-semibold text-emerald-400">
                    {activeStage.rawArtifactTitle}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    STAGE {activeStage.order}/7
                  </span>
                </div>
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
                  <code>{activeStage.rawArtifactCode}</code>
                </pre>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Muốn tự tay chạy mô phỏng 8 bước với dữ liệu tùy chỉnh?</span>
                <Link
                  href="/lab"
                  className="font-mono font-semibold text-sky-400 hover:text-sky-300"
                >
                  Mở Universal Simulator →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TOPIC 3: HTTP FUNDAMENTALS (METHODS, ANATOMY, STATUS CODES) */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-sky-400">
              <Globe className="h-4 w-4" />
              <span>03. HTTP Fundamentals</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Giải phẫu Giao thức HTTP: Methods, URLs, Headers, Body & Status Codes
            </h2>
          </div>

          {/* URL & Endpoint Anatomy Bar */}
          <div className="rounded-lg border border-slate-800 bg-slate-925 p-5 space-y-3">
            <p className="font-mono text-xs uppercase text-slate-400">
              Giải phẫu một URL Endpoint & Query Parameters
            </p>
            <div className="flex flex-wrap items-center gap-1 rounded border border-slate-800 bg-slate-950 p-3 font-mono text-xs sm:text-sm">
              <span className="rounded bg-emerald-950/80 border border-emerald-500/40 px-2 py-1 text-emerald-300">
                https://
              </span>
              <span className="rounded bg-sky-950/80 border border-sky-500/40 px-2 py-1 text-sky-300">
                api.university.edu.vn
              </span>
              <span className="rounded bg-violet-950/80 border border-violet-500/40 px-2 py-1 text-violet-300">
                /v1/students/101
              </span>
              <span className="rounded bg-amber-950/80 border border-amber-500/40 px-2 py-1 text-amber-300">
                ?semester=2026A&includeGrades=true
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="font-mono font-bold text-emerald-400">Protocol:</span>{' '}
                <span className="text-slate-300">Giao thức truyền tải mã hóa TLS.</span>
              </div>
              <div>
                <span className="font-mono font-bold text-sky-400">Host / Domain:</span>{' '}
                <span className="text-slate-300">Định danh máy chủ đích.</span>
              </div>
              <div>
                <span className="font-mono font-bold text-violet-400">
                  Endpoint & Path Param:
                </span>{' '}
                <span className="text-slate-300">Đường dẫn tài nguyên & ID cụ thể (101).</span>
              </div>
              <div>
                <span className="font-mono font-bold text-amber-400">
                  Query Parameters:
                </span>{' '}
                <span className="text-slate-300">Bộ lọc, phân trang, tùy chọn hiển thị.</span>
              </div>
            </div>
          </div>

          {/* Interactive HTTP Methods Explorer */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-lg border border-slate-800 bg-slate-925 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  5 Phương thức HTTP cốt lõi & Đặc tính Idempotency
                </h3>
                <div className="flex gap-1.5">
                  {HTTP_METHODS_GUIDE.map((item, idx) => (
                    <button
                      key={item.method}
                      type="button"
                      onClick={() => setSelectedMethodIdx(idx)}
                      className={`rounded px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
                        selectedMethodIdx === idx
                          ? 'bg-sky-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {item.method}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeMethod.purposeVi}
              </p>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded border px-2.5 py-1 font-mono text-[11px] ${
                    activeMethod.idempotent
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-amber-500/40 bg-amber-950/30 text-amber-300'
                  }`}
                >
                  Idempotent: {activeMethod.idempotent ? 'CÓ (Gọi N lần = 1 lần)' : 'KHÔNG (Gọi N lần tạo N bản ghi)'}
                </span>
                <span className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                  Safe (Chỉ đọc): {activeMethod.safe ? 'CÓ' : 'KHÔNG'}
                </span>
                <span className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                  Request Body: {activeMethod.hasBody ? 'Có chứa Payload' : 'Không dùng Body'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded border border-slate-800 bg-slate-950 p-3">
                  <p className="font-mono text-[11px] text-sky-400 mb-1">
                    Request: {activeMethod.exampleEndpoint}
                  </p>
                  <pre className="font-mono text-xs text-slate-300 overflow-x-auto">
                    <code>{activeMethod.requestPayload}</code>
                  </pre>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950 p-3">
                  <p className="font-mono text-[11px] text-emerald-400 mb-1">
                    Response: {activeMethod.responseStatus}
                  </p>
                  <pre className="font-mono text-xs text-slate-300 overflow-x-auto">
                    <code>{activeMethod.responsePayload}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* HTTP Status Codes Reference */}
            <div className="lg:col-span-5 rounded-lg border border-slate-800 bg-slate-925 p-5 space-y-3">
              <h3 className="text-base font-bold text-white">
                Hệ thống Mã trạng thái (HTTP Status Codes)
              </h3>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {HTTP_STATUS_CATEGORIES.map((cat) => (
                  <div
                    key={cat.range}
                    className="rounded border border-slate-800 bg-slate-950 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded border px-2 py-0.5 font-mono text-xs font-bold ${cat.colorClass}`}
                      >
                        {cat.range} — {cat.titleVi}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {cat.titleEn}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {cat.codes.map((c) => (
                        <div
                          key={c.code}
                          className="border-t border-slate-800/70 pt-1.5 text-xs"
                        >
                          <p className="font-mono font-semibold text-white">
                            {c.code} {c.text}
                          </p>
                          <p className="text-slate-300 text-[11px]">{c.meaningVi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TOPIC 4 & 5: DATA FORMATS (SERIALIZATION) & AUTHENTICATION */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Topic 4: Data Formats & Serialization */}
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-400">
                  <FileCode2 className="h-4 w-4" />
                  <span>04. Data Formats & Serialization</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Định dạng Dữ liệu & Tuần tự hóa (JSON, XML, Protobuf)
                </h2>
              </div>
            </div>

            <div className="flex gap-2">
              {DATA_FORMATS_COMPARISON.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormatId(fmt.id)}
                  className={`rounded border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                    selectedFormatId === fmt.id
                      ? 'border-amber-400 bg-amber-950/50 text-amber-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fmt.id.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{activeFormat.name}</span>
                <span className="rounded border border-amber-500/30 bg-amber-950/30 px-2 py-0.5 font-mono text-[11px] text-amber-300">
                  Kích thước ước tính: {activeFormat.byteSizeEstimate}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeFormat.characteristicsVi}
              </p>
              <p className="text-xs text-sky-300/90 leading-relaxed">
                <strong>Cơ chế Serialization:</strong> {activeFormat.serializationNoteVi}
              </p>
              <div className="rounded border border-slate-800 bg-slate-950 p-3.5">
                <p className="font-mono text-[10px] uppercase text-slate-400 mb-2">
                  Ứng dụng trong: {activeFormat.usedBy}
                </p>
                <pre className="overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed">
                  <code>{activeFormat.sample}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Topic 5: Authentication & Authorization */}
          <div className="lg:col-span-6 rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-violet-400">
                <Shield className="h-4 w-4" />
                <span>05. Authentication & Authorization</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Xác thực (AuthN) & Phân quyền (AuthZ) trong API
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {AUTH_MECHANISMS.map((auth) => (
                <button
                  key={auth.id}
                  type="button"
                  onClick={() => setSelectedAuthId(auth.id)}
                  className={`rounded border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                    selectedAuthId === auth.id
                      ? 'border-violet-400 bg-violet-950/50 text-violet-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {auth.nameEn}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">{activeAuth.titleVi}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeAuth.mechanismVi}
              </p>

              <div className="rounded border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-violet-400 mb-1">
                  <Lock className="h-3 w-3" />
                  <span>Wire Header / Token Pattern</span>
                </div>
                <code className="block font-mono text-xs text-slate-200 break-all">
                  {activeAuth.headerExample}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded border border-emerald-500/25 bg-emerald-950/15 p-3">
                  <p className="font-mono text-[11px] font-bold text-emerald-400 mb-1">
                    Ưu điểm
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc pl-4">
                    {activeAuth.prosVi.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded border border-rose-500/25 bg-rose-950/15 p-3">
                  <p className="font-mono text-[11px] font-bold text-rose-400 mb-1">
                    Lưu ý / Giới hạn
                  </p>
                  <ul className="space-y-1 text-slate-300 list-disc pl-4">
                    {activeAuth.consVi.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT STEP CTA */}
        <section className="rounded-lg border border-sky-500/40 bg-sky-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-xs font-bold uppercase text-sky-400">
              HOÀN THÀNH NỀN TẢNG API
            </p>
            <h3 className="text-lg font-bold text-white">
              Sẵn sàng bước vào Chuyên đề 01: REST API & Thực hành E-Commerce Playground?
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/modules/rest"
              className="inline-flex items-center gap-2 rounded bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-colors"
            >
              <span>Học Module 1: REST API</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-sky-500"
            >
              <Layers className="h-4 w-4 text-sky-400" />
              <span>Mở Phòng Lab</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
