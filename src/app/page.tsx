'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
  FlaskConical,
  BookOpen,
  Layers,
  GitCompare,
  Award,
  Activity,
  Terminal,
  CheckCircle2,
  Play,
  Network,
} from 'lucide-react';
import { SITE_CONFIG, TECH_CLASSIFICATIONS } from '@/config/site';
import { ApiTechnologyId } from '@/types/api';

type HeroSimMode = 'request-response' | 'bidirectional' | 'event-webhook' | 'binary-rpc';

interface HeroSimPreset {
  id: HeroSimMode;
  label: string;
  techBadge: string;
  sourceLabel: string;
  gatewayLabel: string;
  targetLabel: string;
  packetForward: string;
  packetReturn: string;
  explanationVi: string;
}

const HERO_SIM_PRESETS: HeroSimPreset[] = [
  {
    id: 'request-response',
    label: 'Đồng bộ Request / Response',
    techBadge: 'REST / GraphQL / SOAP',
    sourceLabel: 'Client Application',
    gatewayLabel: 'HTTP / TLS Transport',
    targetLabel: 'API Server & Database',
    packetForward: 'GET /api/products/101 (JSON / XML / GraphQL Query)',
    packetReturn: '200 OK → {"id": 101, "name": "Distributed Systems", "stock": 42}',
    explanationVi:
      'Client chủ động khởi tạo yêu cầu và chờ phản hồi. Mỗi chu kỳ Request/Response là một giao dịch độc lập (Stateless).',
  },
  {
    id: 'bidirectional',
    label: 'Kết nối Bền vững Hai chiều',
    techBadge: 'WebSocket (Full-Duplex)',
    sourceLabel: 'Client A & Client B',
    gatewayLabel: 'Persistent TCP Tunnel (ws://)',
    targetLabel: 'Realtime Event Hub',
    packetForward: 'Frame↗: {"event":"chat.msg","text":"Xin chào!"}',
    packetReturn: 'Frame↙: {"event":"broadcast","from":"user_B","latency":"4ms"}',
    explanationVi:
      'Sau bước bắt tay HTTP 101 Switching Protocols, kênh TCP giữ mở liên tục. Cả Client và Server đều có thể đẩy khung tin (Frame) bất kỳ lúc nào mà không cần mở lại kết nối.',
  },
  {
    id: 'event-webhook',
    label: 'Hướng sự kiện Đảo ngược (Push)',
    techBadge: 'Webhook Callback',
    sourceLabel: 'Payment Provider (Producer)',
    gatewayLabel: 'Signed HTTP POST + HMAC',
    targetLabel: 'Merchant Webhook Endpoint',
    packetForward: 'POST /webhooks/payment → {"event":"payment.success","orderId":"ORD-99"}',
    packetReturn: '200 OK → {"acknowledged":true} (Tránh kích hoạt Retry)',
    explanationVi:
      'Thay vì hệ thống của bạn phải hỏi liên tục (Polling), nhà cung cấp dịch vụ tự động bắn HTTP POST sang Callback URL ngay khi sự kiện phát sinh.',
  },
  {
    id: 'binary-rpc',
    label: 'Gọi thủ tục Nhị phân Nội bộ',
    techBadge: 'gRPC + Protocol Buffers',
    sourceLabel: 'Order Microservice (Stub)',
    gatewayLabel: 'HTTP/2 Multiplexed Stream',
    targetLabel: 'Inventory Microservice',
    packetForward: 'Binary Protobuf: ReserveStockRequest [0x08 0x65 0x10 0x02]',
    packetReturn: 'Binary Protobuf: ReserveStockResponse [0x08 0x01] (1.8ms)',
    explanationVi:
      'Dịch vụ gọi hàm từ xa giống như gọi hàm cục bộ. Dữ liệu được nén thành chuỗi byte nhị phân theo hợp đồng .proto và truyền qua luồng đa hợp HTTP/2.',
  },
];

export default function LandingPage() {
  const [heroMode, setHeroMode] = useState<HeroSimMode>('request-response');
  const [selectedTechId, setSelectedTechId] = useState<ApiTechnologyId>('rest');
  const [packetAnimating, setPacketAnimating] = useState<boolean>(true);

  const activePreset =
    HERO_SIM_PRESETS.find((p) => p.id === heroMode) ?? HERO_SIM_PRESETS[0]!;
  const selectedTech =
    TECH_CLASSIFICATIONS.find((t) => t.id === selectedTechId) ??
    TECH_CLASSIFICATIONS[0]!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO SECTION: Technical Blueprint & Interactive Communication Schematic */}
      <section className="relative border-b border-slate-800/90 bg-engineering-grid py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Core Headline & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded border border-sky-500/30 bg-sky-950/40 px-3 py-1 font-mono text-xs text-sky-300">
                <Activity className="h-3.5 w-3.5 text-sky-400" />
                <span>INTERACTIVE API ENGINEERING PLATFORM</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                  {SITE_CONFIG.headlineEn}
                </h1>
                <p className="font-mono text-sm text-sky-400/90">
                  {SITE_CONFIG.descriptionEn}
                </p>
              </div>

              <p className="text-base leading-relaxed text-slate-300">
                Không chỉ là trang đọc tài liệu tĩnh. Đây là phòng thí nghiệm kỹ thuật
                tương tác nơi bạn trực quan hóa kiến trúc, theo dõi từng bước luân chuyển
                gói tin, trực tiếp chỉnh sửa Request/Schema và kiểm chứng sự khác biệt cốt
                lõi giữa{' '}
                <span className="font-semibold text-white">
                  REST, SOAP, GraphQL, gRPC, WebSocket, Webhook
                </span>{' '}
                và <span className="font-semibold text-white">OpenAPI</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/fundamentals"
                  className="inline-flex items-center gap-2 rounded border border-sky-400 bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Bắt đầu từ Nền tảng API
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/lab"
                  className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900/90 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:border-sky-500/60 hover:bg-slate-800 transition-colors"
                >
                  <FlaskConical className="h-4 w-4 text-sky-400" />
                  Mở Phòng thí nghiệm (API Lab)
                </Link>
              </div>

              {/* Technical metrics strip */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800/90 pt-6">
                <div>
                  <p className="font-mono text-xl font-bold text-white">07</p>
                  <p className="text-xs text-slate-400">
                    Chuyên đề & Playgrounds chuyên biệt
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-sky-400">08 Bước</p>
                  <p className="text-xs text-slate-400">
                    Mô phỏng vòng đời Request/Response
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-emerald-400">06 Kịch bản</p>
                  <p className="text-xs text-slate-400">
                    Kiến trúc hệ thống thực tế
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Application-to-Application Communication Visualizer */}
            <div className="lg:col-span-6">
              <div className="rounded-lg border border-slate-800 bg-slate-925/95 p-5 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-sky-400" />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
                      Mô hình Giao tiếp Liên ứng dụng (App-to-App Telemetry)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPacketAnimating((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-slate-300 hover:border-sky-500/50"
                  >
                    <Play className="h-3 w-3 text-sky-400" />
                    {packetAnimating ? 'Đang truyền xung' : 'Tạm dừng xung'}
                  </button>
                </div>

                {/* Mode Switcher */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-5">
                  {HERO_SIM_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setHeroMode(preset.id)}
                      className={`rounded border px-2.5 py-2 text-left transition-colors ${
                        heroMode === preset.id
                          ? 'border-sky-500 bg-sky-950/50 text-sky-200'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <p className="font-mono text-[10px] font-bold uppercase text-sky-400">
                        {preset.techBadge}
                      </p>
                      <p className="text-[11px] font-medium mt-0.5 line-clamp-1">
                        {preset.label}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Interactive SVG / Schematic Pipeline */}
                <div className="rounded border border-slate-800/90 bg-slate-950 p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 items-center text-center">
                    <div className="rounded border border-sky-500/40 bg-slate-900 p-3">
                      <p className="font-mono text-[10px] uppercase text-sky-400">
                        Node A (Initiator)
                      </p>
                      <p className="text-xs font-semibold text-white mt-1">
                        {activePreset.sourceLabel}
                      </p>
                    </div>

                    <div className="rounded border border-slate-700 bg-slate-900/70 p-2.5">
                      <p className="font-mono text-[10px] uppercase text-amber-400">
                        Transport Layer
                      </p>
                      <p className="text-[11px] font-mono text-slate-200 mt-1">
                        {activePreset.gatewayLabel}
                      </p>
                    </div>

                    <div className="rounded border border-emerald-500/40 bg-slate-900 p-3">
                      <p className="font-mono text-[10px] uppercase text-emerald-400">
                        Node B (Receiver)
                      </p>
                      <p className="text-xs font-semibold text-white mt-1">
                        {activePreset.targetLabel}
                      </p>
                    </div>
                  </div>

                  {/* Animated Wire Lines */}
                  <div className="space-y-2.5 pt-1">
                    <div className="rounded border border-slate-800 bg-slate-900/90 px-3 py-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-sky-300 mb-1">
                        <span>LUỒNG ĐI (OUTBOUND WIRE)</span>
                        <span className={packetAnimating ? 'animate-pulse text-sky-400' : ''}>
                          ●───►
                        </span>
                      </div>
                      <code className="block font-mono text-xs text-slate-200 break-all">
                        {activePreset.packetForward}
                      </code>
                    </div>

                    <div className="rounded border border-slate-800 bg-slate-900/90 px-3 py-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-1">
                        <span>LUỒNG VỀ / PHẢN HỒI (INBOUND WIRE)</span>
                        <span
                          className={
                            packetAnimating ? 'animate-pulse text-emerald-400' : ''
                          }
                        >
                          ◄───●
                        </span>
                      </div>
                      <code className="block font-mono text-xs text-slate-200 break-all">
                        {activePreset.packetReturn}
                      </code>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-300 border-t border-slate-800/80 pt-3">
                    <span className="font-semibold text-sky-400">Cơ chế hoạt động: </span>
                    {activePreset.explanationVi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TECHNICAL CLASSIFICATION & COEXISTENCE ARCHITECTURE */}
      <section className="border-b border-slate-800/90 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
              PHÂN LOẠI KỸ THUẬT CHÍNH XÁC (TECHNICAL CLASSIFICATION)
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              7 Chủ đề này không phải là 7 loại API ngang hàng thay thế lẫn nhau
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Một sai lầm phổ biến của người mới học là đặt câu hỏi{' '}
              <em>&ldquo;Nên chọn OpenAPI hay WebSocket?&rdquo;</em> hoặc{' '}
              <em>&ldquo;Webhook có nhanh hơn REST không?&rdquo;</em>. Thực tế, mỗi công
              nghệ thuộc một <strong className="text-white">bản chất kỹ thuật</strong> khác
              nhau và thường <strong className="text-white">cùng tồn tại (coexist)</strong>{' '}
              trong cùng một kiến trúc phần mềm hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Classification Matrix Table */}
            <div className="lg:col-span-7 overflow-x-auto rounded-lg border border-slate-800 bg-slate-925">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 font-mono text-[11px] uppercase text-slate-400">
                    <th className="py-3 px-4">Công nghệ (Technology)</th>
                    <th className="py-3 px-4">Bản chất Kỹ thuật (Technical Nature)</th>
                    <th className="py-3 px-4">Vai trò cốt lõi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {TECH_CLASSIFICATIONS.map((item) => {
                    const active = item.id === selectedTechId;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedTechId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          active ? 'bg-sky-950/40' : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.accentHex }}
                            />
                            <span>{item.shortName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-sky-300">
                            {item.natureEn}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.natureVi}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-300 leading-relaxed">
                          {item.roleSummaryVi}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Interactive Deep-Dive Card for Selected Technology & Coexistence */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    ĐANG XEM CHI TIẾT PHÂN LOẠI
                  </span>
                  <span
                    className="rounded px-2.5 py-0.5 font-mono text-xs font-bold text-slate-950"
                    style={{ backgroundColor: selectedTech.accentHex }}
                  >
                    {selectedTech.natureEn}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">{selectedTech.name}</h3>
                <p className="text-xs font-mono text-sky-400">{selectedTech.natureVi}</p>

                <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <p className="font-mono text-[11px] uppercase text-slate-400">
                    Định nghĩa & Phạm vi
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {selectedTech.roleSummaryVi}
                  </p>
                </div>

                <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                  <p className="font-mono text-[11px] uppercase text-emerald-400">
                    Cách phối hợp (Coexistence) trong hệ thống thực tế
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedTech.coexistenceExampleVi}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <Link
                  href={selectedTech.href}
                  className="inline-flex items-center gap-2 rounded bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors"
                >
                  Học chuyên đề {selectedTech.shortName} & Thực hành Playground
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/comparison"
                  className="text-xs font-mono text-slate-400 hover:text-sky-400"
                >
                  Xem bảng so sánh 9 chiều →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SEVEN INTERACTIVE API INTRODUCTION MODULES */}
      <section className="border-b border-slate-800/90 py-14 bg-slate-925/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-400">
                7 CHUYÊN ĐỀ KỸ THUẬT CHUYÊN SÂU
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl mt-1">
                Khám phá 7 Công nghệ & Đặc tả API cốt lõi
              </h2>
            </div>
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 font-mono text-xs text-sky-400 hover:text-sky-300"
            >
              <span>Thử nghiệm tất cả trong Interactive API Laboratory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TECH_CLASSIFICATIONS.map((tech, index) => (
              <Link
                key={tech.id}
                href={tech.href}
                className="group flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-925 p-5 transition-all hover:border-slate-600 hover:bg-slate-900"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      MODULE 0{index + 1}
                    </span>
                    <span
                      className="rounded border px-2 py-0.5 font-mono text-[10px] font-semibold"
                      style={{
                        borderColor: `${tech.accentHex}55`,
                        color: tech.accentHex,
                        backgroundColor: `${tech.accentHex}15`,
                      }}
                    >
                      {tech.natureEn}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                    {tech.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tech.roleSummaryVi}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-400">
                    12 Mục lý thuyết + Interactive Playground
                  </span>
                  <span className="font-mono text-sky-400 group-hover:translate-x-1 transition-transform">
                    Mở bài học →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: STRUCTURED LEARNING ROADMAP */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              LỘ TRÌNH HỌC TẬP KỸ THUẬT (STRUCTURED LEARNING ROADMAP)
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              5 Chặng từ Nền tảng Giao thức đến Thiết kế Kiến trúc Phân tán
            </h2>
            <p className="text-sm text-slate-300">
              Được thiết kế dành cho sinh viên Khoa học Máy tính, Khoa học Dữ liệu và lập
              trình viên Backend muốn làm chủ bản chất giao tiếp hệ thống thay vì chỉ học
              thuộc lòng định nghĩa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {[
              {
                stage: 'CHẶNG 01',
                title: 'Nền tảng API & HTTP',
                desc: 'Nắm vững Client/Server, HTTP Methods, Status Codes, JSON/XML/Protobuf, Auth (JWT/OAuth2) và 7 bước vòng đời API.',
                href: '/fundamentals',
                cta: 'Học Nền tảng',
                icon: BookOpen,
              },
              {
                stage: 'CHẶNG 02',
                title: '7 Chuyên đề Công nghệ',
                desc: 'Đi sâu vào kiến trúc, luồng gói tin, code thực tế và Playground chuyên biệt cho REST, SOAP, GraphQL, gRPC, WebSocket, Webhook, OpenAPI.',
                href: '/modules/rest',
                cta: 'Vào Module 1: REST',
                icon: Cpu,
              },
              {
                stage: 'CHẶNG 03',
                title: 'Phòng thí nghiệm API Lab',
                desc: 'Thực nghiệm bộ mô phỏng Universal 8 bước (Start/Pause/Step) và quan sát trực quan hóa luồng dữ liệu đồng bộ trạng thái.',
                href: '/lab',
                cta: 'Mở Phòng Lab',
                icon: FlaskConical,
              },
              {
                stage: 'CHẶNG 04',
                title: 'Kiến trúc Thực tế & So sánh',
                desc: 'Phân tích 6 kịch bản kiến trúc phần mềm thực tế và tra cứu ma trận đối chiếu 9 chiều kỹ thuật.',
                href: '/scenarios',
                cta: 'Xem 6 Kịch bản',
                icon: Layers,
              },
              {
                stage: 'CHẶNG 05',
                title: 'Đánh giá Năng lực',
                desc: 'Kiểm tra kiến thức qua 3 dạng câu hỏi: Khái niệm, Cơ chế kỹ thuật và Ra quyết định chọn công nghệ cho bài toán thực tế.',
                href: '/assessment',
                cta: 'Làm bài kiểm tra',
                icon: Award,
              },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.stage}
                  className="flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-925 p-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {item.stage}
                      </span>
                      <IconComp className="h-4 w-4 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-sky-400 hover:text-sky-300"
                    >
                      <span>{item.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
