'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  Network,
  Compass,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { getComparisonData } from '@/data/comparison';
import { getTechClassifications, Language } from '@/config/site';
import { ApiTechnologyId } from '@/types/api';
import { useAppPreferences } from '@/context/AppPreferencesContext';

interface CoexistenceZone {
  id: ApiTechnologyId;
  zoneLabel: string;
  systemComponent: string;
  roleInSystem: string;
  interactionFlow: string;
}

function getCoexistenceZones(lang: Language): CoexistenceZone[] {
  if (lang === 'en') {
    return [
      {
        id: 'rest',
        zoneLabel: '1. Public CRUD Gateway (North-South API)',
        systemComponent: 'Web & Mobile Storefront ↔ API Gateway',
        roleInSystem:
          'REST API serves standard catalog, cart, and order creation endpoints (GET /products, POST /orders) while leveraging CDN HTTP caching.',
        interactionFlow:
          'Clients send HTTP/JSON requests; the API Gateway validates JWTs and returns standard HTTP status codes.',
      },
      {
        id: 'webrtc',
        zoneLabel: '2. Direct P2P Video Consultation & Screen Share (UDP Media/Data)',
        systemComponent: 'Customer Browser ⇄ STUN/TURN ⇄ Support Agent Browser',
        roleInSystem:
          'When a customer clicks "Live Video Product Consultation", WebRTC opens a direct Peer-to-Peer UDP tunnel streaming video/audio (SRTP) and co-browsing cursor telemetry (RTCDataChannel) with zero backend media bandwidth.',
        interactionFlow:
          'WebRTC uses the Layer 4 WebSocket channel as its Signaling Server to exchange SDP Offer/Answer and ICE Candidates before switching to direct P2P UDP.',
      },
      {
        id: 'graphql',
        zoneLabel: '3. Flexible Data Aggregation Layer (BFF / Graph Gateway)',
        systemComponent: 'Mobile Dashboard ↔ GraphQL Server ↔ Multiple Services',
        roleInSystem:
          'GraphQL coexists alongside REST to power rich composite views that stitch Profile, Orders, and Loyalty data in a single round-trip without over-fetching.',
        interactionFlow:
          'GraphQL resolvers fan out to internal gRPC/REST services in parallel and return a tailored JSON tree.',
      },
      {
        id: 'websocket',
        zoneLabel: '4. Real-Time Push Notifications & Live Chat (Full-Duplex TCP)',
        systemComponent: 'Customer Browser ⇄ WebSocket Hub Server',
        roleInSystem:
          'Complements REST with server-initiated push: streams live courier GPS coordinates on a map and powers instant customer support text chat.',
        interactionFlow:
          'After authenticating via REST, the browser upgrades an HTTP 101 connection into a persistent wss:// socket.',
      },
      {
        id: 'grpc',
        zoneLabel: '5. High-Speed Internal Microservice Mesh (East-West Traffic)',
        systemComponent: 'Order Service ⇄ Inventory Service ⇄ Pricing Service',
        roleInSystem:
          'Behind the API Gateway, polyglot microservices written in Go, Java, and Python call each other tens of thousands of times per second using binary Protocol Buffers over HTTP/2.',
        interactionFlow:
          'Order Service invokes strongly typed gRPC stubs on Inventory Service with sub-2ms latency.',
      },
      {
        id: 'webhook',
        zoneLabel: '6. Asynchronous External Partner Event Callbacks (Reverse API)',
        systemComponent: 'External Payment Gateway (Stripe/VNPay) → Merchant Webhook URL',
        roleInSystem:
          'When a customer finishes paying via bank QR code, the external payment provider actively dispatches an HMAC-signed HTTP POST to the merchant callback endpoint.',
        interactionFlow:
          'The Webhook endpoint verifies the HMAC signature and event.id idempotency, marks the order PAID, and triggers WebSocket push to the browser.',
      },
      {
        id: 'soap',
        zoneLabel: '7. Core Banking & Legacy Enterprise ERP Settlement (WSDL Contract)',
        systemComponent: 'Payment Microservice ↔ Corporate ERP / Core Banking WSDL',
        roleInSystem:
          'At the deepest enterprise settlement tier, end-of-day financial clearing with Core Banking or SAP ERP executes over formal SOAP XML + WS-Security contracts.',
        interactionFlow:
          'Marshals XSD-validated <soap:Envelope> messages signed with corporate digital certificates.',
      },
    ];
  }

  return [
    {
      id: 'rest',
      zoneLabel: '1. Cổng CRUD Công khai (North-South API)',
      systemComponent: 'Web & Mobile Storefront ↔ API Gateway',
      roleInSystem:
        'REST API xử lý các thao tác sản phẩm, giỏ hàng và tạo đơn hàng chuẩn (GET /products, POST /orders) tận dụng tối đa HTTP Caching ở tầng CDN.',
      interactionFlow:
        'Client gửi HTTP Request kèm JSON; Gateway kiểm tra JWT và trả về Status Codes chuẩn.',
    },
    {
      id: 'webrtc',
      zoneLabel: '2. Tư vấn Video Trực tiếp & Chia sẻ Màn hình P2P (Direct UDP Media/Data)',
      systemComponent: 'Customer Browser ⇄ STUN/TURN ⇄ Support Agent Browser',
      roleInSystem:
        'Khi khách hàng nhấn nút "Gọi Video tư vấn sản phẩm trực tiếp", WebRTC thiết lập đường truyền UDP ngang hàng (Peer-to-Peer) truyền Video/Audio (SRTP) và đồng bộ con trỏ hướng dẫn (RTCDataChannel) không tốn băng thông Backend.',
      interactionFlow:
        'WebRTC mượn kênh WebSocket ở tầng 4 làm Signaling Server để trao đổi SDP Offer/Answer và ICE Candidates trước khi mở luồng P2P trực tiếp.',
    },
    {
      id: 'graphql',
      zoneLabel: '3. Tầng Tổng hợp Dữ liệu Linh hoạt (BFF / Data Aggregation)',
      systemComponent: 'Mobile Dashboard ↔ GraphQL Server ↔ Multiple Services',
      roleInSystem:
        'GraphQL tồn tại song song với REST để phục vụ các màn hình phức tạp cần gom dữ liệu từ Hồ sơ, Đơn hàng, Khuyến mãi trong 1 lần gọi mà không bị Over-fetching.',
      interactionFlow:
        'GraphQL Resolvers gọi xuống các gRPC/REST Services bên dưới và trả về JSON theo đúng câu Query của Mobile App.',
    },
    {
      id: 'websocket',
      zoneLabel: '4. Kênh Thông báo & Trò chuyện Thời gian thực (Full-Duplex Push)',
      systemComponent: 'Customer Browser ⇄ WebSocket Hub Server',
      roleInSystem:
        'Bổ sung khả năng đẩy hai chiều tức thời cho REST: Hiển thị trạng thái shipper đang di chuyển trên bản đồ và khung chat hỗ trợ khách hàng trực tuyến.',
      interactionFlow:
        'Sau khi đăng nhập qua REST, trình duyệt nâng cấp 1 kết nối HTTP 101 lên wss:// để nhận sự kiện live.',
    },
    {
      id: 'grpc',
      zoneLabel: '5. Giao tiếp Nội bộ Giữa các Microservices (East-West Traffic)',
      systemComponent: 'Order Service ⇄ Inventory Service ⇄ Pricing Service',
      roleInSystem:
        'Bên dưới API Gateway, các Microservices nội bộ viết bằng Go, Java, Python gọi nhau hàng vạn lần/giây bằng nhị phân Protocol Buffers trên HTTP/2.',
      interactionFlow:
        'Order Service gọi hàm Stub gRPC sang Inventory Service với độ trễ < 2ms.',
    },
    {
      id: 'webhook',
      zoneLabel: '6. Nhận Sự kiện Bất đồng bộ từ Đối tác (Event Callback)',
      systemComponent: 'External Payment Gateway (Stripe/VNPay) → Merchant Webhook URL',
      roleInSystem:
        'Khi khách hàng quét mã QR thanh toán xong ở ngân hàng, cổng thanh toán chủ động bắn HTTP POST có chữ ký HMAC về hệ thống.',
      interactionFlow:
        'Webhook Endpoint nhận sự kiện payment.success, kiểm tra HMAC & Idempotency rồi kích hoạt WebSocket báo lên màn hình khách hàng.',
    },
    {
      id: 'soap',
      zoneLabel: '7. Kết nối Hệ thống Ngân hàng Lõi & ERP Di sản (Enterprise Contract)',
      systemComponent: 'Payment Microservice ↔ Corporate ERP / Core Banking WSDL',
      roleInSystem:
        'Ở tầng sâu nhất, khi cần đối soát hạch toán với hệ thống Core Banking hoặc SAP ERP của tập đoàn, dịch vụ thanh toán giao tiếp qua hợp đồng SOAP XML + WS-Security.',
      interactionFlow:
        'Đóng gói bức điện <soap:Envelope> tuân thủ XSD để thực hiện bút toán quyết toán cuối ngày.',
    },
  ];
}

export default function ComparisonCenterPage() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';
  const { dimensions, decisionScenarios } = getComparisonData(lang);
  const techList = getTechClassifications(lang);
  const coexistenceZones = getCoexistenceZones(lang);

  const [visibleTechIds, setVisibleTechIds] = useState<ApiTechnologyId[]>([
    'rest',
    'soap',
    'graphql',
    'grpc',
    'websocket',
    'webhook',
    'webrtc',
  ]);
  const [selectedCoexistId, setSelectedCoexistId] =
    useState<ApiTechnologyId>('rest');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(
    decisionScenarios[0]?.id ?? 'dec-1'
  );

  const toggleTechColumn = (id: ApiTechnologyId) => {
    setVisibleTechIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const activeCoexistZone =
    coexistenceZones.find((z) => z.id === selectedCoexistId) ??
    coexistenceZones[0]!;
  const activeDecision =
    decisionScenarios.find((d) => d.id === selectedDecisionId) ??
    decisionScenarios[0]!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <section className="border-b border-slate-800 bg-engineering-grid py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded border border-sky-500/40 bg-sky-950/60 px-3 py-1 font-mono text-xs text-sky-300">
            <GitCompare className="h-3.5 w-3.5 text-sky-400" />
            <span>SECTION 7: COMPARISON CENTER & COEXISTENCE ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {isEn
              ? '9-Dimension Comparison Center & Technology Coexistence Blueprint'
              : 'Trung tâm So sánh Đa chiều & Sơ đồ Cộng sinh Công nghệ'}
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 leading-relaxed">
            {isEn
              ? 'Compare all 7 technologies across 9 core engineering dimensions, explore how they coexist inside a unified production system, and use the interactive decision advisor to pick the right tool for your workload.'
              : 'Đối chiếu 7 công nghệ trên 9 chiều kỹ thuật cốt lõi, khám phá cách chúng cùng tồn tại và bổ trợ lẫn nhau trong một kiến trúc thương mại điện tử thống nhất, và thực hành ra quyết định lựa chọn công nghệ theo yêu cầu hệ thống.'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* PART 1: 9-DIMENSION COMPARISON MATRIX */}
        <section className="space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-sky-400">
                01. MULTI-DIMENSIONAL TECHNICAL COMPARISON MATRIX
              </p>
              <h2 className="text-2xl font-bold text-white mt-1">
                {isEn
                  ? '9-Dimension Engineering Comparison Matrix'
                  : 'Ma trận Đối chiếu 9 Chiều Kỹ thuật'}
              </h2>
            </div>

            {/* Column Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] text-slate-400 mr-1">
                {isEn ? 'Filter columns (min 2):' : 'Lọc cột hiển thị (tối thiểu 2):'}
              </span>
              {techList.map((tech) => {
                const isShown = visibleTechIds.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => toggleTechColumn(tech.id)}
                    className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                      isShown
                        ? 'border-sky-400 bg-sky-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isShown ? '✓ ' : '+ '}
                    {tech.shortName}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setVisibleTechIds(techList.map((t) => t.id))}
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-sky-300"
              >
                {isEn ? 'Show All (7)' : 'Hiện tất cả (7)'}
              </button>
            </div>
          </div>

          {/* Accuracy Warning Note */}
          <div className="rounded border border-amber-500/30 bg-amber-950/15 p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            {isEn ? (
              <p className="leading-relaxed">
                <strong>Technical Accuracy Principle:</strong> Avoid false equivalences. For
                example, <strong>WebRTC</strong> is a Peer-to-Peer UDP media/data protocol
                that relies on <strong>WebSocket</strong> or <strong>REST</strong> as its
                Signaling Server for initial SDP exchange—it does not replace REST or
                GraphQL for database CRUD queries.
              </p>
            ) : (
              <p className="leading-relaxed">
                <strong>Nguyên tắc Chính xác Kỹ thuật:</strong> Tránh các phép so sánh khập
                khiễng. Ví dụ: <strong>WebRTC</strong> là giao thức truyền tải Media/Data
                ngang hàng (Peer-to-Peer) trên nền UDP và vẫn cần{' '}
                <strong>WebSocket</strong> hoặc <strong>REST</strong> làm kênh báo hiệu
                (Signaling Server) để trao đổi SDP ban đầu, chứ không phải là công nghệ thay
                thế cho REST hay GraphQL trong việc truy vấn Cơ sở dữ liệu.
              </p>
            )}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-925">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 font-mono text-xs uppercase text-slate-300">
                  <th className="py-3.5 px-4 w-52 sticky left-0 bg-slate-900 z-10 border-r border-slate-800">
                    {isEn ? 'Dimension' : 'Chiều So sánh (Dimension)'}
                  </th>
                  {techList
                    .filter((t) => visibleTechIds.includes(t.id))
                    .map((tech) => (
                      <th key={tech.id} className="py-3.5 px-4 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: tech.accentHex }}
                          />
                          <span className="text-white font-bold">
                            {tech.shortName}
                          </span>
                        </div>
                        <span className="block font-mono text-[10px] text-slate-400 font-normal mt-0.5">
                          {tech.natureEn}
                        </span>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {dimensions.map((row) => (
                  <tr key={row.dimensionEn} className="hover:bg-slate-900/50">
                    <td className="py-4 px-4 align-top sticky left-0 bg-slate-925 z-10 border-r border-slate-800">
                      <p className="font-bold text-white">{row.dimensionVi}</p>
                      <p className="font-mono text-[10px] text-sky-400 mt-0.5">
                        {row.dimensionEn}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {row.whatItMeansVi}
                      </p>
                    </td>
                    {techList
                      .filter((t) => visibleTechIds.includes(t.id))
                      .map((tech) => (
                        <td
                          key={tech.id}
                          className="py-4 px-4 align-top text-slate-200 leading-relaxed"
                        >
                          {row.values[tech.id]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PART 2: TECHNOLOGY RELATIONSHIP & COEXISTENCE ARCHITECTURE DIAGRAM */}
        <section className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-emerald-400">
              <Network className="h-4 w-4" />
              <span>02. TECHNOLOGY RELATIONSHIP & COEXISTENCE ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              {isEn
                ? 'Coexistence Blueprint: How All 7 Technologies Work Together in One System'
                : 'Sơ đồ Kiến trúc Cộng sinh: Cách cả 7 Công nghệ Phối hợp trong Một Hệ thống'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {isEn
                ? 'Architectural choices depend on the specific system boundary—no single technology replaces all others. Click any zone in the unified E-Commerce architecture below to inspect its role.'
                : 'Việc lựa chọn công nghệ phụ thuộc vào yêu cầu của từng tầng hệ thống chứ không có một công nghệ nào độc tôn. Nhấp vào từng vị trí trong kiến trúc Thương mại Điện tử bên dưới để xem vai trò của mỗi công nghệ.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: 7 Coexistence Architectural Zones */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {coexistenceZones.map((zone) => {
                const active = zone.id === selectedCoexistId;
                const techMeta = techList.find((t) => t.id === zone.id);
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedCoexistId(zone.id)}
                    className={`rounded-lg border p-3.5 text-left transition-all ${
                      active
                        ? 'border-sky-400 bg-sky-950/60 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="rounded px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950"
                        style={{
                          backgroundColor: techMeta?.accentHex ?? '#38BDF8',
                        }}
                      >
                        {techMeta?.shortName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {techMeta?.natureEn}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">
                      {zone.zoneLabel}
                    </p>
                    <p className="font-mono text-[11px] text-sky-300 mt-1">
                      {zone.systemComponent}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Coexistence Zone Details */}
            <div className="lg:col-span-5 rounded-lg border border-sky-500/40 bg-slate-950 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold uppercase text-sky-400">
                  {isEn
                    ? 'ARCHITECTURAL BOUNDARY & ROLE'
                    : 'VỊ TRÍ TRONG KIẾN TRÚC TỔNG THỂ'}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeCoexistZone.zoneLabel}
                </h3>
                <div className="rounded border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-emerald-300">
                  {activeCoexistZone.systemComponent}
                </div>

                <div className="space-y-2 pt-2">
                  <p className="font-mono text-[11px] uppercase text-slate-400">
                    {isEn ? 'Role in the System:' : 'Vai trò trong hệ thống:'}
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeCoexistZone.roleInSystem}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="font-mono text-[11px] uppercase text-emerald-400">
                    {isEn
                      ? 'How it Interacts with Neighboring Layers:'
                      : 'Cách phối hợp với các tầng khác:'}
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeCoexistZone.interactionFlow}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <Link
                  href={`/modules/${activeCoexistZone.id}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  <span>
                    {isEn
                      ? `Open ${activeCoexistZone.id.toUpperCase()} Module`
                      : `Mở chuyên đề ${activeCoexistZone.id.toUpperCase()}`}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/scenarios"
                  className="font-mono text-xs text-slate-400 hover:text-white"
                >
                  {isEn ? 'View in Scenario Lab →' : 'Xem trong Scenario Lab →'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PART 3: INTERACTIVE TECHNOLOGY SELECTION ADVISOR */}
        <section className="rounded-lg border border-slate-800 bg-slate-925 p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-400">
              <Compass className="h-4 w-4" />
              <span>03. PRACTICAL TECHNOLOGY SELECTION GUIDANCE</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              {isEn
                ? 'Interactive Architecture Decision Advisor'
                : 'Hướng dẫn Ra Quyết định Chọn Công nghệ theo Bài toán Thực tế'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isEn
                ? 'Select an engineering requirement below to view the recommended primary protocol, companion technology, and technical rationale.'
                : 'Chọn yêu cầu kiến trúc bên dưới để xem khuyến nghị công nghệ chính, công nghệ bổ trợ và lý giải kỹ thuật.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-2">
              {decisionScenarios.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDecisionId(item.id)}
                  className={`w-full rounded border p-3.5 text-left transition-all ${
                    selectedDecisionId === item.id
                      ? 'border-amber-400 bg-amber-950/30 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold text-amber-400">
                    {isEn ? `REQUIREMENT 0${idx + 1}` : `BÀI TOÁN 0${idx + 1}`}
                  </span>
                  <p className="text-xs font-bold mt-0.5">
                    {item.requirementTitleVi}
                  </p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 rounded border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-slate-400">
                  {isEn ? 'Recommended Stack:' : 'Khuyến nghị lựa chọn:'}
                </span>
                <Link
                  href={`/modules/${activeDecision.recommendedPrimary}`}
                  className="rounded bg-emerald-500 px-3 py-1 font-mono text-xs font-bold uppercase text-slate-950 hover:bg-emerald-400"
                >
                  {isEn ? 'Primary: ' : 'Chính: '}
                  {activeDecision.recommendedPrimary}
                </Link>
                {activeDecision.recommendedCompanion && (
                  <Link
                    href={`/modules/${activeDecision.recommendedCompanion}`}
                    className="rounded border border-sky-500/40 bg-sky-950/60 px-3 py-1 font-mono text-xs font-bold uppercase text-sky-300"
                  >
                    {isEn ? 'Paired with: ' : 'Kết hợp cùng: '}
                    {activeDecision.recommendedCompanion}
                  </Link>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {activeDecision.requirementTitleVi}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isEn ? 'Context: ' : 'Bối cảnh: '}
                  {activeDecision.contextDescriptionVi}
                </p>
              </div>

              <div className="rounded border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1.5 text-xs">
                <p className="font-mono font-bold text-emerald-400">
                  {isEn
                    ? '✓ Why this is the optimal choice:'
                    : '✓ Tại sao đây là lựa chọn tối ưu:'}
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {activeDecision.rationaleVi}
                </p>
              </div>

              <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-1.5 text-xs">
                <p className="font-mono font-bold text-amber-400">
                  {isEn
                    ? '⚠ Why other technologies are less suitable here:'
                    : '⚠ Tại sao không chọn các công nghệ khác cho tầng này:'}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {activeDecision.whyNotOthersVi}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
