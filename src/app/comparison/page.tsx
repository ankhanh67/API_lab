'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  Network,
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  COMPARISON_DIMENSIONS,
  DECISION_ADVISOR_SCENARIOS,
} from '@/data/comparison';
import { TECH_CLASSIFICATIONS } from '@/config/site';
import { ApiTechnologyId } from '@/types/api';

interface CoexistenceZone {
  id: ApiTechnologyId;
  zoneLabel: string;
  systemComponent: string;
  roleInSystemVi: string;
  interactionFlowVi: string;
}

const COEXISTENCE_BLUEPRINT_ZONES: CoexistenceZone[] = [
  {
    id: 'rest',
    zoneLabel: '1. Cổng CRUD Công khai (North-South API)',
    systemComponent: 'Web & Mobile Storefront ↔ API Gateway',
    roleInSystemVi:
      'REST API xử lý các thao tác sản phẩm, giỏ hàng và tạo đơn hàng chuẩn (GET /products, POST /orders) tận dụng tối đa HTTP Caching ở tầng CDN.',
    interactionFlowVi:
      'Client gửi HTTP Request kèm JSON; Gateway kiểm tra JWT và trả về Status Codes chuẩn.',
  },
  {
    id: 'openapi',
    zoneLabel: '2. Hợp đồng & Cổng Tài liệu (API Contract Layer)',
    systemComponent: 'openapi.yaml → Swagger UI + Gateway Validator + SDK Codegen',
    roleInSystemVi:
      'OpenAPI không truyền dữ liệu trên mạng mà mô tả toàn bộ cấu trúc của tầng REST API phía trên, giúp tự động sinh tài liệu và kiểm tra Schema.',
    interactionFlowVi:
      'Đội Frontend dùng TypeScript SDK sinh từ file OpenAPI để gọi REST API không bao giờ sai kiểu dữ liệu.',
  },
  {
    id: 'graphql',
    zoneLabel: '3. Tầng Tổng hợp Dữ liệu Linh hoạt (BFF / Data Aggregation)',
    systemComponent: 'Mobile Dashboard ↔ GraphQL Server ↔ Multiple Services',
    roleInSystemVi:
      'GraphQL tồn tại song song với REST để phục vụ các màn hình phức tạp cần gom dữ liệu từ Hồ sơ, Đơn hàng, Khuyến mãi trong 1 lần gọi mà không bị Over-fetching.',
    interactionFlowVi:
      'GraphQL Resolvers gọi xuống các gRPC/REST Services bên dưới và trả về JSON theo đúng câu Query của Mobile App.',
  },
  {
    id: 'websocket',
    zoneLabel: '4. Kênh Thông báo & Trò chuyện Thời gian thực (Full-Duplex Push)',
    systemComponent: 'Customer Browser ⇄ WebSocket Hub Server',
    roleInSystemVi:
      'Bổ sung khả năng đẩy hai chiều tức thời cho REST: Hiển thị trạng thái shipper đang di chuyển trên bản đồ và khung chat hỗ trợ khách hàng trực tuyến.',
    interactionFlowVi:
      'Sau khi đăng nhập qua REST, trình duyệt nâng cấp 1 kết nối HTTP 101 lên wss:// để nhận sự kiện live.',
  },
  {
    id: 'grpc',
    zoneLabel: '5. Giao tiếp Nội bộ Giữa các Microservices (East-West Traffic)',
    systemComponent: 'Order Service ⇄ Inventory Service ⇄ Pricing Service',
    roleInSystemVi:
      'Bên dưới API Gateway, các Microservices nội bộ viết bằng Go, Java, Python gọi nhau hàng vạn lần/giây bằng nhị phân Protocol Buffers trên HTTP/2.',
    interactionFlowVi:
      'Order Service gọi hàm Stub gRPC sang Inventory Service với độ trễ < 2ms.',
  },
  {
    id: 'webhook',
    zoneLabel: '6. Nhận Sự kiện Bất đồng bộ từ Đối tác (Event Callback)',
    systemComponent: 'External Payment Gateway (Stripe/VNPay) → Merchant Webhook URL',
    roleInSystemVi:
      'Khi khách hàng quét mã QR thanh toán xong ở ngân hàng, cổng thanh toán chủ động bắn HTTP POST có chữ ký HMAC về hệ thống.',
    interactionFlowVi:
      'Webhook Endpoint nhận sự kiện payment.success, kiểm tra HMAC & Idempotency rồi kích hoạt WebSocket báo lên màn hình khách hàng.',
  },
  {
    id: 'soap',
    zoneLabel: '7. Kết nối Hệ thống Ngân hàng Lõi & ERP Di sản (Enterprise Contract)',
    systemComponent: 'Payment Microservice ↔ Corporate ERP / Core Banking WSDL',
    roleInSystemVi:
      'Ở tầng sâu nhất, khi cần đối soát hạch toán với hệ thống Core Banking hoặc SAP ERP của tập đoàn, dịch vụ thanh toán giao tiếp qua hợp đồng SOAP XML + WS-Security.',
    interactionFlowVi:
      'Đóng gói bức điện <soap:Envelope> tuân thủ XSD để thực hiện bút toán quyết toán cuối ngày.',
  },
];

export default function ComparisonCenterPage() {
  const [visibleTechIds, setVisibleTechIds] = useState<ApiTechnologyId[]>([
    'rest',
    'soap',
    'graphql',
    'grpc',
    'websocket',
    'webhook',
    'openapi',
  ]);
  const [selectedCoexistId, setSelectedCoexistId] =
    useState<ApiTechnologyId>('rest');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(
    DECISION_ADVISOR_SCENARIOS[0]?.id ?? 'dec-1'
  );

  const toggleTechColumn = (id: ApiTechnologyId) => {
    setVisibleTechIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // Keep at least 2 for comparison
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const activeCoexistZone =
    COEXISTENCE_BLUEPRINT_ZONES.find((z) => z.id === selectedCoexistId) ??
    COEXISTENCE_BLUEPRINT_ZONES[0]!;
  const activeDecision =
    DECISION_ADVISOR_SCENARIOS.find((d) => d.id === selectedDecisionId) ??
    DECISION_ADVISOR_SCENARIOS[0]!;

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
            Trung tâm So sánh Đa chiều & Sơ đồ Cộng sinh Công nghệ
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 leading-relaxed">
            Đối chiếu 7 công nghệ trên 9 chiều kỹ thuật cốt lõi, khám phá cách chúng cùng
            tồn tại và bổ trợ lẫn nhau trong một kiến trúc thương mại điện tử thống nhất,
            và thực hành ra quyết định lựa chọn công nghệ theo yêu cầu hệ thống.
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
                Ma trận Đối chiếu 9 Chiều Kỹ thuật
              </h2>
            </div>

            {/* Column Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] text-slate-400 mr-1">
                Lọc cột hiển thị (tối thiểu 2):
              </span>
              {TECH_CLASSIFICATIONS.map((tech) => {
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
                onClick={() =>
                  setVisibleTechIds(TECH_CLASSIFICATIONS.map((t) => t.id))
                }
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[11px] text-sky-300"
              >
                Hiện tất cả (7)
              </button>
            </div>
          </div>

          {/* Accuracy Warning Note */}
          <div className="rounded border border-amber-500/30 bg-amber-950/15 p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Nguyên tắc Chính xác Kỹ thuật:</strong> Tránh các phép so sánh khập
              khiễng. Ví dụ: <strong>OpenAPI Specification</strong> là một tiêu chuẩn mô tả
              hợp đồng tài liệu cho REST API, không phải là giao thức truyền gói tin nên
              không xếp hạng đua tốc độ truyền tải mạng thô với{' '}
              <strong>WebSocket</strong> hay <strong>gRPC</strong>.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-925">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 font-mono text-xs uppercase text-slate-300">
                  <th className="py-3.5 px-4 w-52 sticky left-0 bg-slate-900 z-10 border-r border-slate-800">
                    Chiều So sánh (Dimension)
                  </th>
                  {TECH_CLASSIFICATIONS.filter((t) =>
                    visibleTechIds.includes(t.id)
                  ).map((tech) => (
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
                {COMPARISON_DIMENSIONS.map((row) => (
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
                    {TECH_CLASSIFICATIONS.filter((t) =>
                      visibleTechIds.includes(t.id)
                    ).map((tech) => (
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
              Sơ đồ Kiến trúc Cộng sinh: Cách cả 7 Công nghệ Phối hợp trong Một Hệ thống
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Việc lựa chọn công nghệ phụ thuộc vào yêu cầu của từng tầng hệ thống chứ
              không có một công nghệ nào độc tôn. Nhấp vào từng vị trí trong kiến trúc
              Thương mại Điện tử bên dưới để xem vai trò của mỗi công nghệ.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: 7 Coexistence Architectural Zones */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COEXISTENCE_BLUEPRINT_ZONES.map((zone) => {
                const active = zone.id === selectedCoexistId;
                const techMeta = TECH_CLASSIFICATIONS.find(
                  (t) => t.id === zone.id
                );
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
                  VỊ TRÍ TRONG KIẾN TRÚC TỔNG THỂ
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeCoexistZone.zoneLabel}
                </h3>
                <div className="rounded border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-emerald-300">
                  {activeCoexistZone.systemComponent}
                </div>

                <div className="space-y-2 pt-2">
                  <p className="font-mono text-[11px] uppercase text-slate-400">
                    Vai trò trong hệ thống:
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeCoexistZone.roleInSystemVi}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="font-mono text-[11px] uppercase text-emerald-400">
                    Cách phối hợp với các tầng khác:
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeCoexistZone.interactionFlowVi}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <Link
                  href={`/modules/${activeCoexistZone.id}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  <span>Mở chuyên đề {activeCoexistZone.id.toUpperCase()}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/scenarios"
                  className="font-mono text-xs text-slate-400 hover:text-white"
                >
                  Xem trong Scenario Lab →
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
              Hướng dẫn Ra Quyết định Chọn Công nghệ theo Bài toán Thực tế
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Chọn yêu cầu kiến trúc bên dưới để xem khuyến nghị công nghệ chính, công nghệ
              bổ trợ và lý giải kỹ thuật.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-2">
              {DECISION_ADVISOR_SCENARIOS.map((item, idx) => (
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
                    BÀI TOÁN 0{idx + 1}
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
                  Khuyến nghị lựa chọn:
                </span>
                <Link
                  href={`/modules/${activeDecision.recommendedPrimary}`}
                  className="rounded bg-emerald-500 px-3 py-1 font-mono text-xs font-bold uppercase text-slate-950 hover:bg-emerald-400"
                >
                  Chính: {activeDecision.recommendedPrimary}
                </Link>
                {activeDecision.recommendedCompanion && (
                  <Link
                    href={`/modules/${activeDecision.recommendedCompanion}`}
                    className="rounded border border-sky-500/40 bg-sky-950/60 px-3 py-1 font-mono text-xs font-bold uppercase text-sky-300"
                  >
                    Kết hợp cùng: {activeDecision.recommendedCompanion}
                  </Link>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {activeDecision.requirementTitleVi}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Bối cảnh: {activeDecision.contextDescriptionVi}
                </p>
              </div>

              <div className="rounded border border-emerald-500/30 bg-emerald-950/15 p-4 space-y-1.5 text-xs">
                <p className="font-mono font-bold text-emerald-400">
                  ✓ Tại sao đây là lựa chọn tối ưu:
                </p>
                <p className="text-slate-200 leading-relaxed">
                  {activeDecision.rationaleVi}
                </p>
              </div>

              <div className="rounded border border-slate-800 bg-slate-900 p-4 space-y-1.5 text-xs">
                <p className="font-mono font-bold text-amber-400">
                  ⚠ Tại sao không chọn các công nghệ khác cho tầng này:
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
