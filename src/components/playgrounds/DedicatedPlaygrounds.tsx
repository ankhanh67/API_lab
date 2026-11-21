'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Wifi,
  WifiOff,
  Send,
  ShieldAlert,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { ApiTechnologyId, HttpMethod } from '@/types/api';
import {
  INITIAL_REST_PRODUCTS,
  RestProduct,
  simulateRestRequest,
  SoapOperationName,
  buildSoapRequestTemplate,
  executeSoapSimulation,
  GraphqlFieldSelection,
  executeGraphqlSimulation,
  GrpcPatternType,
  executeGrpcSimulation,
  WebhookEventType,
  simulateWebhookDelivery,
  WebRtcNatTopology,
  WebRtcVideoCodec,
  simulateWebRtcSession,
} from '@/simulations/engines';
import { useAppPreferences } from '@/context/AppPreferencesContext';

// ============================================================================
// 1. REST API INTERACTIVE PLAYGROUND
// ============================================================================
export function RestPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [products, setProducts] = useState<RestProduct[]>(INITIAL_REST_PRODUCTS);
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [path, setPath] = useState<string>('/api/products');
  const [categoryQuery, setCategoryQuery] = useState<string>('');
  const [minPriceQuery, setMinPriceQuery] = useState<string>('');
  const [authHeader, setAuthHeader] = useState<string>('Bearer valid_jwt_token_2026');
  const [bodyText, setBodyText] = useState<string>(
    JSON.stringify(
      {
        name: 'Sony WH-1000XM5 Headphones',
        category: 'hardware',
        price: 6990000,
        stock: 20,
      },
      null,
      2
    )
  );

  const [lastResult, setLastResult] = useState(() =>
    simulateRestRequest(
      {
        method: 'GET',
        path: '/api/products',
        queryParams: {},
        headers: { Authorization: 'Bearer valid_jwt_token_2026' },
        bodyText: '',
        currentProducts: INITIAL_REST_PRODUCTS,
      },
      lang
    )
  );

  useEffect(() => {
    const qParams: Record<string, string> = {};
    if (categoryQuery.trim()) qParams['category'] = categoryQuery.trim();
    if (minPriceQuery.trim()) qParams['minPrice'] = minPriceQuery.trim();
    setLastResult(
      simulateRestRequest(
        {
          method: 'GET',
          path: '/api/products',
          queryParams: qParams,
          headers: { Authorization: authHeader },
          bodyText,
          currentProducts: products,
        },
        lang
      )
    );
    // Re-localize active explanation when language changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const runSimulation = (override?: {
    method?: HttpMethod;
    path?: string;
    body?: string;
    auth?: string;
  }) => {
    const m = override?.method ?? method;
    const p = override?.path ?? path;
    const b = override?.body ?? bodyText;
    const a = override?.auth ?? authHeader;

    if (override?.method) setMethod(override.method);
    if (override?.path) setPath(override.path);
    if (override?.body !== undefined) setBodyText(override.body);
    if (override?.auth !== undefined) setAuthHeader(override.auth);

    const qParams: Record<string, string> = {};
    if (categoryQuery.trim()) qParams['category'] = categoryQuery.trim();
    if (minPriceQuery.trim()) qParams['minPrice'] = minPriceQuery.trim();

    const out = simulateRestRequest(
      {
        method: m,
        path: p,
        queryParams: qParams,
        headers: {
          Authorization: a,
          'Content-Type': 'application/json',
        },
        bodyText: b,
        currentProducts: products,
      },
      lang
    );

    setProducts(out.updatedProducts);
    setLastResult(out);
  };

  const resetPlayground = () => {
    setProducts(INITIAL_REST_PRODUCTS);
    setMethod('GET');
    setPath('/api/products');
    setCategoryQuery('');
    setMinPriceQuery('');
    setAuthHeader('Bearer valid_jwt_token_2026');
    const initialOut = simulateRestRequest(
      {
        method: 'GET',
        path: '/api/products',
        queryParams: {},
        headers: { Authorization: 'Bearer valid_jwt_token_2026' },
        bodyText: '',
        currentProducts: INITIAL_REST_PRODUCTS,
      },
      lang
    );
    setLastResult(initialOut);
  };

  return (
    <div className="rounded-lg border border-sky-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-sky-400">
            REST API INTERACTIVE PLAYGROUND — E-COMMERCE PRODUCT MANAGEMENT
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? '/api/products Resource CRUD Simulator'
              : 'Trình Mô phỏng CRUD Tài nguyên /api/products'}
          </h3>
        </div>
        <button
          type="button"
          onClick={resetPlayground}
          className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-sky-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {isEn ? 'Reset Initial Data' : 'Khôi phục Dữ liệu Gốc'}
        </button>
      </div>

      {/* Quick Scenario Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-slate-400">
          {isEn ? 'Presets:' : 'Kịch bản mẫu:'}
        </span>
        <button
          type="button"
          onClick={() => runSimulation({ method: 'GET', path: '/api/products' })}
          className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-sky-300 hover:border-sky-500"
        >
          GET /api/products
        </button>
        <button
          type="button"
          onClick={() =>
            runSimulation({ method: 'GET', path: '/api/products/101' })
          }
          className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-sky-300 hover:border-sky-500"
        >
          GET /api/products/101
        </button>
        <button
          type="button"
          onClick={() =>
            runSimulation({
              method: 'POST',
              path: '/api/products',
              body: JSON.stringify(
                {
                  name: 'Sony WH-1000XM5 Headphones',
                  category: 'hardware',
                  price: 6990000,
                  stock: 20,
                },
                null,
                2
              ),
            })
          }
          className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-emerald-300 hover:border-emerald-500"
        >
          POST /api/products (201)
        </button>
        <button
          type="button"
          onClick={() =>
            runSimulation({
              method: 'PATCH',
              path: '/api/products/101',
              body: JSON.stringify({ price: 2150000, stock: 50 }, null, 2),
            })
          }
          className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-amber-300 hover:border-amber-500"
        >
          PATCH /api/products/101
        </button>
        <button
          type="button"
          onClick={() =>
            runSimulation({ method: 'DELETE', path: '/api/products/101' })
          }
          className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs text-rose-300 hover:border-rose-500"
        >
          DELETE /api/products/101
        </button>
        <button
          type="button"
          onClick={() =>
            runSimulation({
              method: 'GET',
              path: '/api/products/999',
            })
          }
          className="rounded border border-rose-500/30 bg-rose-950/20 px-2.5 py-1 font-mono text-xs text-rose-300 hover:border-rose-400"
        >
          {isEn ? 'Test 404 Error' : 'Test Lỗi 404'}
        </button>
        <button
          type="button"
          onClick={() =>
            runSimulation({
              method: 'POST',
              path: '/api/products',
              auth: 'Bearer invalid_token',
            })
          }
          className="rounded border border-rose-500/30 bg-rose-950/20 px-2.5 py-1 font-mono text-xs text-rose-300 hover:border-rose-400"
        >
          {isEn ? 'Test 401 Error' : 'Test Lỗi 401'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Request Builder Column */}
        <div className="lg:col-span-6 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              aria-label="HTTP Method"
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs font-bold text-sky-400"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              aria-label="Endpoint URL"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-white"
              placeholder="/api/products"
            />
            <button
              type="button"
              onClick={() => runSimulation()}
              className="inline-flex items-center justify-center gap-1.5 rounded bg-sky-500 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-sky-400"
            >
              <Play className="h-3.5 w-3.5" />
              {isEn ? 'Send Request' : 'Gửi Request'}
            </button>
          </div>

          {/* Query Params & Headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                {isEn
                  ? 'Query Param: category (e.g., hardware, books)'
                  : 'Query Param: category (ví dụ: hardware, books)'}
              </label>
              <input
                type="text"
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                placeholder={isEn ? 'All categories' : 'Tất cả danh mục'}
                className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
                Query Param: minPrice (VND)
              </label>
              <input
                type="number"
                value={minPriceQuery}
                onChange={(e) => setMinPriceQuery(e.target.value)}
                placeholder="0"
                className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              {isEn
                ? 'Authorization Header (Set to "Bearer invalid_token" to test 401)'
                : 'Header Authorization (Đổi thành "Bearer invalid_token" để test lỗi 401)'}
            </label>
            <input
              type="text"
              value={authHeader}
              onChange={(e) => setAuthHeader(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              {isEn
                ? 'JSON Request Body (Used for POST / PATCH / PUT)'
                : 'JSON Request Body (Dùng cho POST / PATCH / PUT)'}
            </label>
            <textarea
              rows={5}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-900 p-2.5 font-mono text-xs text-slate-200"
            />
          </div>

          {/* Live In-Memory Database State */}
          <div className="border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-400">
                <Database className="h-3.5 w-3.5" />
                {isEn
                  ? `Live 'products' Database Table (${products.length} rows)`
                  : `Bảng Database \`products\` Hiện tại (${products.length} bản ghi)`}
              </span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded border border-slate-800/80 bg-slate-900/70 px-2.5 py-1.5 text-xs font-mono"
                >
                  <span className="text-sky-300">#{p.id}</span>
                  <span className="text-slate-200 truncate max-w-[180px]">{p.name}</span>
                  <span className="text-emerald-400">
                    {p.price.toLocaleString('vi-VN')}đ ({isEn ? 'Stock' : 'Kho'}: {p.stock})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response & Explanation Column */}
        <div className="lg:col-span-6 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-2.5 py-1 font-mono text-xs font-bold ${
                  lastResult.response.isError
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                HTTP {lastResult.response.statusCode} {lastResult.response.statusText}
              </span>
              <span className="font-mono text-xs text-slate-400">
                {lastResult.response.latencyMs} ms (Simulated)
              </span>
            </div>
          </div>

          <div className="rounded border border-sky-500/30 bg-sky-950/20 p-3 text-xs text-slate-200 space-y-1.5">
            <p className="font-mono text-[11px] font-bold uppercase text-sky-400">
              {isEn
                ? 'What Just Happened Under the Hood:'
                : 'Giải thích Cơ chế vừa diễn ra:'}
            </p>
            <p className="leading-relaxed">{lastResult.response.explanationVi}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lastResult.response.stepsTrace.map((st, idx) => (
                <span
                  key={st}
                  className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                >
                  {idx + 1}. {st}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase text-slate-400 mb-1">
              Response Headers
            </p>
            <pre className="rounded border border-slate-800 bg-slate-900 p-2.5 font-mono text-[11px] text-slate-300 overflow-x-auto">
              {Object.entries(lastResult.response.headers)
                .map(([k, v]) => `${k}: ${v}`)
                .join('\n')}
            </pre>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase text-slate-400 mb-1">
              Response JSON Payload
            </p>
            <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-emerald-300 overflow-x-auto max-h-60">
              <code>{lastResult.response.body}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. SOAP API INTERACTIVE PLAYGROUND (CORE BANKING SERVICE)
// ============================================================================
export function SoapPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [operation, setOperation] =
    useState<SoapOperationName>('GetAccountBalance');
  const [accountId] = useState<string>('ACC-VN-8801');
  const [toAccountId] = useState<string>('ACC-VN-9920');
  const [amount] = useState<number>(25000000);
  const [requestXml, setRequestXml] = useState<string>(() =>
    buildSoapRequestTemplate('GetAccountBalance', {
      accountId: 'ACC-VN-8801',
      toAccountId: 'ACC-VN-9920',
      amount: 25000000,
    })
  );
  const [highlightSection, setHighlightSection] = useState<
    'envelope' | 'header' | 'body'
  >('body');

  const result = executeSoapSimulation(operation, requestXml, lang);

  const selectOperation = (op: SoapOperationName) => {
    setOperation(op);
    const tpl = buildSoapRequestTemplate(op, {
      accountId,
      toAccountId,
      amount,
    });
    setRequestXml(tpl);
  };

  return (
    <div className="rounded-lg border border-amber-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-amber-400">
            SOAP 1.2 XML PLAYGROUND — CORE BANKING WSDL SERVICE
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? 'SOAP XML Envelope & WSDL Operations Simulator'
              : 'Trình Mô phỏng Bức điện SOAP Envelope & WSDL Operations'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              'GetAccountBalance',
              'TransferMoney',
              'GetTransactionHistory',
              'TriggerSoapFault',
            ] as SoapOperationName[]
          ).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => selectOperation(op)}
              className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                operation === op
                  ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500/50'
              }`}
            >
              {op === 'TriggerSoapFault'
                ? isEn
                  ? '⚡ Trigger SOAP Fault'
                  : '⚡ Giả lập lỗi SOAP Fault'
                : op}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive XML Anatomy Inspector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(
          [
            {
              id: 'envelope',
              title: '1. <soap:Envelope>',
              desc: result.envelopeBreakdown.envelopeVi,
            },
            {
              id: 'header',
              title: '2. <soap:Header>',
              desc: result.envelopeBreakdown.headerVi,
            },
            {
              id: 'body',
              title: result.isFault
                ? '3. <soap:Body> & <soap:Fault>'
                : '3. <soap:Body>',
              desc: result.isFault
                ? result.envelopeBreakdown.faultVi ?? result.envelopeBreakdown.bodyVi
                : result.envelopeBreakdown.bodyVi,
            },
          ] as const
        ).map((part) => (
          <button
            key={part.id}
            type="button"
            onClick={() => setHighlightSection(part.id)}
            className={`rounded border p-3 text-left transition-colors ${
              highlightSection === part.id
                ? 'border-amber-400 bg-amber-950/30'
                : 'border-slate-800 bg-slate-950'
            }`}
          >
            <p className="font-mono text-xs font-bold text-amber-400">
              {part.title}
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {part.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-3 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-amber-300">
              {isEn
                ? 'SOAP XML Request (Editable Live)'
                : 'SOAP XML Request (Có thể chỉnh sửa trực tiếp)'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-amber-500 px-3 py-1 font-mono text-xs font-bold text-slate-950">
              <Play className="h-3.5 w-3.5" />
              {isEn ? 'Live WSDL Execution' : 'Thực thi SOAP Call'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isEn ? (
              <>
                Tip: Change the value inside{' '}
                <code className="text-amber-300">&lt;bank:AccountId&gt;</code> to{' '}
                <code className="text-rose-300">INVALID-ACC</code> to trigger a live{' '}
                <code className="text-rose-300">&lt;soap:Fault&gt;</code>.
              </>
            ) : (
              <>
                Mẹo: Bạn có thể sửa giá trị trong thẻ{' '}
                <code className="text-amber-300">&lt;bank:AccountId&gt;</code> thành{' '}
                <code className="text-rose-300">INVALID-ACC</code> để tự kích hoạt lỗi{' '}
                <code className="text-rose-300">&lt;soap:Fault&gt;</code>.
              </>
            )}
          </p>
          <textarea
            rows={13}
            value={requestXml}
            onChange={(e) => setRequestXml(e.target.value)}
            className="w-full rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-200 leading-relaxed"
          />
        </div>

        <div className="lg:col-span-6 space-y-3 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-emerald-300">
              SOAP XML Response
            </span>
            <span
              className={`rounded px-2.5 py-0.5 font-mono text-xs font-bold ${
                result.isFault
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              HTTP {result.httpStatus} {result.isFault ? 'SOAP Fault' : 'OK'}
            </span>
          </div>
          <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-amber-200 overflow-x-auto max-h-[340px] leading-relaxed">
            <code>{result.responseXml}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. GRAPHQL API INTERACTIVE PLAYGROUND (UNIVERSITY MANAGEMENT SYSTEM)
// ============================================================================
export function GraphqlPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [selection, setSelection] = useState<GraphqlFieldSelection>({
    studentId: 'SV-101',
    includeFullName: true,
    includeGpa: true,
    includeEmail: false,
    includeDepartment: true,
    includeCourses: true,
    includeGrades: false,
  });

  const simResult = executeGraphqlSimulation(selection, lang);
  const savedPercent = Math.max(
    0,
    Math.round(
      ((simResult.restByteSize - simResult.graphqlByteSize) /
        simResult.restByteSize) *
        100
    )
  );

  const toggleField = (field: keyof Omit<GraphqlFieldSelection, 'studentId'>) => {
    setSelection((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="rounded-lg border border-pink-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-pink-400">
            GRAPHQL QUERY & RESOLVER PLAYGROUND — UNIVERSITY MANAGEMENT SYSTEM
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? 'Interactive Graph Query Builder & REST Over-fetching Comparison'
              : 'Trình Xây dựng Truy vấn Đồ thị & So sánh Over-fetching với REST'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">
            {isEn ? 'Select Student:' : 'Chọn Sinh viên:'}
          </span>
          {(['SV-101', 'SV-102'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelection((prev) => ({ ...prev, studentId: id }))}
              className={`rounded border px-3 py-1 font-mono text-xs font-bold ${
                selection.studentId === id
                  ? 'border-pink-400 bg-pink-500 text-slate-950'
                  : 'border-slate-700 bg-slate-900 text-slate-300'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Field Selector Checkboxes */}
      <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
        <p className="font-mono text-xs font-semibold text-pink-300">
          {isEn
            ? 'Toggle Schema Fields to watch the GraphQL Query, Active Resolvers, and JSON Payload adapt in real time:'
            : 'Bật/tắt các trường (Fields) trong Schema để xem GraphQL Query và Payload thay đổi tức thì:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: 'includeFullName', label: 'fullName: String!' },
              { key: 'includeGpa', label: 'gpa: Float!' },
              { key: 'includeEmail', label: 'email: String!' },
              { key: 'includeDepartment', label: 'department { id name }' },
              { key: 'includeCourses', label: 'courses { code title credits }' },
              { key: 'includeGrades', label: 'courses.grade: String' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleField(item.key)}
              className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
                selection[item.key]
                  ? 'border-pink-500 bg-pink-950/60 text-pink-200 font-semibold'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {selection[item.key] ? '☑ ' : '☐ '}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Generated GraphQL Query & Triggered Resolvers */}
        <div className="lg:col-span-5 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div>
            <p className="font-mono text-xs font-semibold text-pink-400 mb-2">
              {isEn
                ? 'POST /graphql — Generated Query:'
                : 'POST /graphql — Câu truy vấn được tạo:'}
            </p>
            <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-pink-200 overflow-x-auto">
              <code>{simResult.generatedQuery}</code>
            </pre>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2">
            <p className="font-mono text-xs font-semibold text-sky-400">
              {isEn
                ? `Server Resolver Execution Tree (${simResult.resolversTriggered.length} resolvers):`
                : `Cây Resolver thực thi trên Server (${simResult.resolversTriggered.length} resolvers):`}
            </p>
            <ul className="space-y-1.5">
              {simResult.resolversTriggered.map((res) => (
                <li
                  key={res}
                  className="rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-emerald-300"
                >
                  ⚡ {res}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 leading-relaxed">
              {simResult.explanationVi}
            </p>
          </div>
        </div>

        {/* Side-by-side GraphQL vs REST Over-fetching Response */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded border border-pink-500/40 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-pink-400">
                GraphQL Response
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                {simResult.graphqlByteSize} bytes (-{savedPercent}%)
              </span>
            </div>
            <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-emerald-300 overflow-x-auto max-h-72">
              <code>{simResult.graphqlResponseJson}</code>
            </pre>
          </div>

          <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-400">
                REST Equivalent (Over-fetching)
              </span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[11px] text-amber-300">
                {simResult.restByteSize} bytes
              </span>
            </div>
            <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-400 overflow-x-auto max-h-72">
              <code>{simResult.restEquivalentResponseJson}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. gRPC API INTERACTIVE PLAYGROUND (MICROSERVICES & PROTOBUF BINARY)
// ============================================================================
export function GrpcPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [pattern, setPattern] = useState<GrpcPatternType>('unary');
  const [orderId, setOrderId] = useState<string>('ORD-2026');
  const [amountVnd, setAmountVnd] = useState<number>(950000);

  const sim = executeGrpcSimulation(pattern, orderId, amountVnd, lang);

  return (
    <div className="rounded-lg border border-emerald-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-emerald-400">
            gRPC & PROTOCOL BUFFERS PLAYGROUND — MICROSERVICES COMMUNICATION
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? '4 RPC Streaming Patterns & HTTP/2 Binary Framing Simulator'
              : 'Trình Mô phỏng 4 Mô hình RPC Streaming & Khung Nhị phân HTTP/2'}
          </h3>
        </div>
        <span className="rounded border border-amber-500/30 bg-amber-950/30 px-2.5 py-1 font-mono text-[11px] text-amber-300">
          {isEn
            ? 'Local Protobuf Binary Wire Simulation'
            : 'Mô phỏng tuần tự hóa Protobuf cục bộ (Conceptual Binary Wire)'}
        </span>
      </div>

      {/* 4 RPC Patterns Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        {(
          [
            { id: 'unary', label: '1. Unary RPC (1 → 1)' },
            { id: 'server-streaming', label: '2. Server Streaming (1 → N)' },
            { id: 'client-streaming', label: '3. Client Streaming (N → 1)' },
            {
              id: 'bidirectional-streaming',
              label: '4. Bidirectional Stream (N ⇄ N)',
            },
          ] as const
        ).map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPattern(p.id)}
            className={`rounded border px-3 py-2 font-mono text-xs font-semibold text-left transition-colors ${
              pattern === p.id
                ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Controls & Protobuf vs JSON Efficiency Bar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-center rounded border border-slate-800 bg-slate-950 p-4">
        <div className="lg:col-span-6 flex flex-wrap items-center gap-3">
          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              Field 1: order_id (string)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              Field 2: amount_vnd (int64)
            </label>
            <input
              type="number"
              value={amountVnd}
              onChange={(e) => setAmountVnd(Number(e.target.value) || 0)}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-1">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-emerald-400 font-bold">
              Protobuf Binary: {sim.protobufBinaryBytes} bytes
            </span>
            <span className="text-slate-400">
              {isEn ? 'JSON Equivalent: ' : 'Tương đương JSON: '}
              {sim.jsonEquivalentBytes} bytes
            </span>
          </div>
          <p className="font-mono text-[11px] text-sky-300">{sim.rpcSignature}</p>
        </div>
      </div>

      {/* HTTP/2 Multiplexed Frames Stream Timeline */}
      <div className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase text-slate-300">
          {isEn
            ? 'HTTP/2 Multiplexed Frame Stream (DATA & HEADERS Frames):'
            : 'Luồng Khung tin HTTP/2 (HTTP/2 DATA & HEADERS Frames):'}
        </p>
        <div className="space-y-2.5">
          {sim.frames.map((frame) => (
            <div
              key={frame.frameIndex}
              className={`rounded border p-3.5 ${
                frame.direction === 'client-to-server'
                  ? 'border-sky-500/30 bg-sky-950/15'
                  : 'border-emerald-500/30 bg-emerald-950/15'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-white">
                  Frame #{frame.frameIndex} —{' '}
                  {frame.direction === 'client-to-server'
                    ? 'CLIENT STUB ───► gRPC SERVER'
                    : 'gRPC SERVER ───► CLIENT STUB'}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  +{frame.timestampOffsetMs}ms | {frame.methodName}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-200">
                {frame.structuredMessage}
              </p>
              <p className="font-mono text-[11px] text-emerald-400 mt-1">
                Wire Hex: [{frame.conceptualBinaryHex}]
              </p>
              <p className="text-xs text-slate-300 mt-1.5">{frame.explanationVi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. WEBSOCKET API INTERACTIVE PLAYGROUND (DUAL-CLIENT REALTIME CHAT)
// ============================================================================
interface WsLogFrame {
  id: string;
  time: string;
  direction: string;
  opcode: string;
  payload: string;
}

export function WebsocketPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [clientAConnected, setClientAConnected] = useState<boolean>(true);
  const [clientBConnected, setClientBConnected] = useState<boolean>(true);
  const [inputA, setInputA] = useState<string>('Hello from Client A!');
  const [inputB, setInputB] = useState<string>('Client B received the signal!');
  const [frames, setFrames] = useState<WsLogFrame[]>([
    {
      id: 'init-1',
      time: '09:00:01',
      direction: 'Client A & B ⇄ Server',
      opcode: 'HTTP 101 Switching Protocols',
      payload: 'Upgrade: websocket | Connection: Upgrade -> Persistent Tunnel OPEN',
    },
  ]);

  const appendFrame = (direction: string, opcode: string, payload: string) => {
    const now = new Date().toTimeString().slice(0, 8);
    setFrames((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: now,
        direction,
        opcode,
        payload,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const sendFromA = () => {
    if (!clientAConnected) return;
    appendFrame(
      `Client A ───► Server ${clientBConnected ? '───► Client B' : '(Client B Offline)'}`,
      '0x1 Text Frame',
      JSON.stringify({ from: 'Client A', text: inputA })
    );
  };

  const sendFromB = () => {
    if (!clientBConnected) return;
    appendFrame(
      `Client B ───► Server ${clientAConnected ? '───► Client A' : '(Client A Offline)'}`,
      '0x1 Text Frame',
      JSON.stringify({ from: 'Client B', text: inputB })
    );
  };

  const sendPingPong = () => {
    appendFrame(
      'Server ⇄ Connected Clients',
      '0x9 PING / 0xA PONG',
      'Heartbeat Keep-Alive Frame verified in 2ms'
    );
  };

  const simulateDropAndReconnect = () => {
    setClientAConnected(false);
    appendFrame(
      'Client A ✕ Server',
      '0x8 Close (1006 Abnormal)',
      isEn
        ? 'Network dropped! Triggering Exponential Backoff Reconnection...'
        : 'Mất kết nối mạng đột ngột! Kích hoạt bộ đếm Exponential Backoff Reconnect...'
    );
    setTimeout(() => {
      setClientAConnected(true);
      appendFrame(
        'Client A ⇄ Server',
        'HTTP 101 Re-Handshake',
        isEn
          ? 'Auto-reconnected successfully after 1.2s!'
          : 'Tự động kết nối lại thành công sau 1.2s!'
      );
    }, 900);
  };

  return (
    <div className="rounded-lg border border-violet-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-violet-400">
            WEBSOCKET FULL-DUPLEX PLAYGROUND — REAL-TIME CHAT & TELEMETRY
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? 'Persistent Full-Duplex Tunnel: Client A ⇄ WebSocket Server ⇄ Client B'
              : 'Trình Mô phỏng Kết nối Bền vững Hai chiều: Client A ⇄ WebSocket Server ⇄ Client B'}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={sendPingPong}
            className="rounded border border-violet-500/40 bg-violet-950/40 px-3 py-1.5 font-mono text-xs text-violet-200 hover:border-violet-400"
          >
            {isEn ? 'Send Heartbeat (Ping/Pong)' : 'Phát xung Heartbeat (Ping/Pong)'}
          </button>
          <button
            type="button"
            onClick={simulateDropAndReconnect}
            className="rounded border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 font-mono text-xs text-amber-300 hover:border-amber-400"
          >
            {isEn
              ? 'Simulate Drop & Auto-Reconnect'
              : 'Giả lập Đứt mạng & Auto-Reconnect'}
          </button>
        </div>
      </div>

      {/* Visual Topology: Client A <-> Server <-> Client B */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Client A */}
        <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-sky-400">
              CLIENT A (Web App)
            </span>
            <button
              type="button"
              onClick={() => {
                const next = !clientAConnected;
                setClientAConnected(next);
                appendFrame(
                  'Client A',
                  next ? 'HTTP 101 Upgrade' : '0x8 Close (1000)',
                  next
                    ? isEn
                      ? 'Client A opened wss:// socket'
                      : 'Client A đã mở kết nối wss://'
                    : isEn
                    ? 'Client A closed connection'
                    : 'Client A chủ động đóng kết nối'
                );
              }}
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                clientAConnected
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {clientAConnected ? (
                <>
                  <Wifi className="h-3 w-3" /> CONNECTED
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" /> DISCONNECTED
                </>
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              disabled={!clientAConnected}
              className="flex-1 rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-white disabled:opacity-40"
            />
            <button
              type="button"
              onClick={sendFromA}
              disabled={!clientAConnected}
              className="inline-flex items-center gap-1 rounded bg-sky-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 disabled:opacity-40"
            >
              <Send className="h-3 w-3" />
              {isEn ? 'Send' : 'Gửi'}
            </button>
          </div>
        </div>

        {/* WebSocket Hub Server */}
        <div className="rounded border border-violet-500/40 bg-violet-950/20 p-4 flex flex-col justify-between text-center">
          <p className="font-mono text-xs font-bold uppercase text-violet-300">
            WEBSOCKET HUB SERVER (wss://)
          </p>
          <p className="text-xs text-slate-300 my-2">
            {isEn ? 'Active TCP Sockets: ' : 'Kênh TCP đang mở: '}
            {(clientAConnected ? 1 : 0) + (clientBConnected ? 1 : 0)} / 2 Sockets
          </p>
          <button
            type="button"
            onClick={() =>
              appendFrame(
                'Server ───► All Connected Clients',
                '0x1 Server Broadcast',
                JSON.stringify({
                  systemAlert: isEn
                    ? 'Live price ticker updated by Server!'
                    : 'Hệ thống vừa cập nhật bảng giá thời gian thực!',
                })
              )
            }
            className="rounded border border-violet-400 bg-violet-500/20 px-3 py-1.5 font-mono text-xs font-semibold text-violet-200 hover:bg-violet-500/30"
          >
            {isEn ? 'Server Push Broadcast' : 'Server Chủ động Push Thông báo'}
          </button>
        </div>

        {/* Client B */}
        <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-400">
              CLIENT B (Mobile App)
            </span>
            <button
              type="button"
              onClick={() => {
                const next = !clientBConnected;
                setClientBConnected(next);
                appendFrame(
                  'Client B',
                  next ? 'HTTP 101 Upgrade' : '0x8 Close (1000)',
                  next
                    ? isEn
                      ? 'Client B opened wss:// socket'
                      : 'Client B đã mở kết nối wss://'
                    : isEn
                    ? 'Client B closed connection'
                    : 'Client B chủ động đóng kết nối'
                );
              }}
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                clientBConnected
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {clientBConnected ? (
                <>
                  <Wifi className="h-3 w-3" /> CONNECTED
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" /> DISCONNECTED
                </>
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              disabled={!clientBConnected}
              className="flex-1 rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-white disabled:opacity-40"
            />
            <button
              type="button"
              onClick={sendFromB}
              disabled={!clientBConnected}
              className="inline-flex items-center gap-1 rounded bg-emerald-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 disabled:opacity-40"
            >
              <Send className="h-3 w-3" />
              {isEn ? 'Send' : 'Gửi'}
            </button>
          </div>
        </div>
      </div>

      {/* Live WebSocket Frame Inspector Log */}
      <div className="rounded border border-slate-800 bg-slate-950 p-4 space-y-2">
        <p className="font-mono text-xs font-semibold uppercase text-slate-400">
          {isEn
            ? 'Live WebSocket Frame Stream Inspector:'
            : 'Nhật ký Khung truyền WebSocket Thời gian thực (Live Frame Stream):'}
        </p>
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {frames.map((f) => (
            <div
              key={f.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded border border-slate-800/80 bg-slate-900 px-3 py-2 font-mono text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500">[{f.time}]</span>
                <span className="text-violet-300 font-bold">{f.opcode}</span>
                <span className="text-sky-300">{f.direction}</span>
              </div>
              <code className="text-slate-200 break-all">{f.payload}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. WEBHOOK INTERACTIVE PLAYGROUND (EVENT PRODUCER, HMAC & RETRIES)
// ============================================================================
export function WebhookPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [eventType, setEventType] = useState<WebhookEventType>('payment.success');
  const [callbackUrl, setCallbackUrl] = useState<string>(
    'https://api.myshop.vn/api/webhooks/payment'
  );
  const [secretKey, setSecretKey] = useState<string>('whsec_live_9988776655');
  const [tamperSignature, setTamperSignature] = useState<boolean>(false);
  const [simulate500, setSimulate500] = useState<boolean>(false);
  const [orderAmountVnd] = useState<number>(1250000);

  const result = simulateWebhookDelivery(
    {
      eventType,
      callbackUrl,
      secretKey,
      tamperSignature,
      simulateReceiver500Error: simulate500,
      orderAmountVnd,
    },
    lang
  );

  return (
    <div className="rounded-lg border border-orange-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-orange-400">
            WEBHOOK EVENT CALLBACK PLAYGROUND — PAYMENT & ORDER EVENTS
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? 'Reverse API Simulator: HTTP POST Delivery, HMAC Verification & Exponential Backoff'
              : 'Trình Mô phỏng Reverse API: HTTP POST Delivery, Chữ ký HMAC & Exponential Backoff Retry'}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Subscription & Event Trigger Config */}
        <div className="lg:col-span-5 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              {isEn
                ? '1. Select Event Triggered by Payment Provider (Producer):'
                : '1. Chọn Sự kiện Phát sinh từ Cổng Thanh toán (Producer):'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  'payment.success',
                  'payment.failed',
                  'order.created',
                  'order.shipped',
                ] as WebhookEventType[]
              ).map((evt) => (
                <button
                  key={evt}
                  type="button"
                  onClick={() => setEventType(evt)}
                  className={`rounded border px-2.5 py-1.5 font-mono text-xs text-left ${
                    eventType === evt
                      ? 'border-orange-400 bg-orange-500 text-slate-950 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-300'
                  }`}
                >
                  {evt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              {isEn
                ? '2. Consumer Callback URL (Receiver Endpoint):'
                : '2. Callback URL của Hệ thống Nhận (Consumer Endpoint):'}
            </label>
            <input
              type="text"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-white"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-slate-400 mb-1">
              {isEn
                ? '3. Shared Webhook Secret (For HMAC-SHA256 Signing):'
                : '3. Shared Webhook Secret (Dùng để ký HMAC-SHA256):'}
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-orange-300"
            />
          </div>

          {/* Fault & Security Toggles */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={simulate500}
                onChange={(e) => setSimulate500(e.target.checked)}
                className="rounded border-slate-700"
              />
              <span>
                {isEn
                  ? 'Simulate Receiver 500/503 Outage (Observe 3x Exponential Backoff Retries)'
                  : 'Giả lập Server nhận bị lỗi 500/503 (Xem cơ chế Tự động Retry 3 lần)'}
              </span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={tamperSignature}
                onChange={(e) => setTamperSignature(e.target.checked)}
                className="rounded border-slate-700"
              />
              <span>
                {isEn
                  ? 'Simulate Attacker Payload Tampering (Invalid HMAC → Blocked 401)'
                  : 'Giả lập Hacker giả mạo gói tin (Sai chữ ký HMAC → Bị chặn 401)'}
              </span>
            </label>
          </div>
        </div>

        {/* Right: Outgoing HTTP POST Payload & Delivery Timeline */}
        <div className="lg:col-span-7 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-bold text-white">
              POST {result.callbackUrl}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 font-mono text-xs font-bold ${
                result.signatureValid
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {result.signatureValid ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> HMAC Signature Verified
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5" /> Invalid Signature (401)
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase text-slate-400 mb-1">
                HTTP POST Headers
              </p>
              <pre className="rounded border border-slate-800 bg-slate-900 p-2.5 font-mono text-[11px] text-orange-200 overflow-x-auto">
                {Object.entries(result.httpHeaders)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}
              </pre>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-slate-400 mb-1">
                Event JSON Payload
              </p>
              <pre className="rounded border border-slate-800 bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-36">
                <code>{result.jsonPayload}</code>
              </pre>
            </div>
          </div>

          {/* Delivery & Retry Timeline */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <p className="font-mono text-xs font-semibold text-orange-400">
              {isEn
                ? 'Delivery & Exponential Backoff Retry Timeline:'
                : 'Nhật ký Chuyển phát & Chu trình Thử lại (Delivery & Retry Timeline):'}
            </p>
            {result.attempts.map((att) => (
              <div
                key={att.attemptNumber}
                className={`rounded border p-3 text-xs ${
                  att.outcome === 'DELIVERED'
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-rose-500/40 bg-rose-950/20'
                }`}
              >
                <div className="flex items-center justify-between font-mono mb-1">
                  <span className="font-bold text-white">
                    {isEn ? 'Attempt #' : 'Lần thử #'}
                    {att.attemptNumber} ({att.delayLabel})
                  </span>
                  <span
                    className={
                      att.outcome === 'DELIVERED'
                        ? 'text-emerald-300 font-bold'
                        : 'text-rose-300 font-bold'
                    }
                  >
                    HTTP {att.httpStatus} — {att.outcome}
                  </span>
                </div>
                <p className="text-slate-300">{att.explanationVi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. WEBRTC API INTERACTIVE PLAYGROUND (P2P SIGNALING, ICE/STUN/TURN & DATACHANNEL)
// ============================================================================
export function WebRtcPlayground() {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';

  const [natTopology, setNatTopology] =
    useState<WebRtcNatTopology>('cone-nat-stun');
  const [videoCodec, setVideoCodec] = useState<WebRtcVideoCodec>('VP9');
  const [enableVideo, setEnableVideo] = useState<boolean>(true);
  const [enableAudio, setEnableAudio] = useState<boolean>(true);
  const [enableDataChannel, setEnableDataChannel] = useState<boolean>(true);
  const [dcInput, setDcInput] = useState<string>(
    '{"cursorX": 480, "cursorY": 210, "action": "DRAW_VECTOR"}'
  );
  const [dcPackets, setDcPackets] = useState<
    { id: string; sender: string; payload: string; rttMs: number }[]
  >([
    {
      id: 'dc-init',
      sender: 'Peer A ⇄ Peer B (SCTP/UDP)',
      payload: '{"event":"DATACHANNEL_OPEN","ordered":false,"maxRetransmits":0}',
      rttMs: 16,
    },
  ]);

  const session = simulateWebRtcSession(
    {
      natTopology,
      videoCodec,
      enableVideo,
      enableAudio,
      enableDataChannel,
    },
    lang
  );

  const sendDataChannelPacket = (fromPeer: 'Peer A' | 'Peer B') => {
    if (!enableDataChannel) return;
    const targetPeer = fromPeer === 'Peer A' ? 'Peer B' : 'Peer A';
    setDcPackets((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        sender: `${fromPeer} ───► ${
          session.isDirectP2P ? 'Direct UDP P2P' : 'TURN Relay'
        } ───► ${targetPeer}`,
        payload: dcInput,
        rttMs: session.estimatedRttMs,
      },
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div className="rounded-lg border border-cyan-500/40 bg-slate-925 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase text-cyan-400">
            WEBRTC PEER-TO-PEER PLAYGROUND — SIGNALING, ICE/STUN/TURN & DATACHANNEL
          </span>
          <h3 className="text-lg font-bold text-white">
            {isEn
              ? 'SDP Negotiation, NAT Traversal (ICE/STUN/TURN) & P2P UDP Simulator'
              : 'Trình Mô phỏng Đàm phán SDP, Xuyên NAT (ICE/STUN/TURN) & Truyền tải P2P UDP'}
          </h3>
        </div>
        <span
          className={`rounded border px-3 py-1 font-mono text-xs font-bold ${
            session.isDirectP2P
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
          }`}
        >
          {session.isDirectP2P
            ? `⚡ DIRECT P2P UDP (${session.estimatedRttMs}ms RTT)`
            : `⇄ TURN RELAY FALLBACK (${session.estimatedRttMs}ms RTT)`}
        </span>
      </div>

      {/* Topology & Media Tracks Configuration */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 rounded border border-slate-800 bg-slate-950 p-4">
        <div className="lg:col-span-7 space-y-2">
          <p className="font-mono text-xs font-semibold text-cyan-300">
            {isEn
              ? '1. Select Network & NAT Firewall Topology (ICE / STUN / TURN):'
              : '1. Chọn Địa hình Mạng & Tường lửa NAT (ICE / STUN / TURN Topology):'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                {
                  id: 'lan-host',
                  title: isEn ? 'Local LAN (typ host)' : 'Cùng mạng LAN (typ host)',
                  sub: isEn
                    ? 'Direct private IP link (4ms)'
                    : 'Kết nối IP nội bộ trực tiếp (4ms)',
                },
                {
                  id: 'cone-nat-stun',
                  title: isEn
                    ? 'STUN NAT Traversal (typ srflx)'
                    : 'Xuyên NAT qua STUN (typ srflx)',
                  sub: 'UDP Hole Punching P2P (16ms)',
                },
                {
                  id: 'symmetric-nat-turn',
                  title: isEn
                    ? 'Symmetric Firewall (typ relay)'
                    : 'Tường lửa Chặn P2P (typ relay)',
                  sub: isEn
                    ? 'Relayed via TURN Server (48ms)'
                    : 'Chuyển tiếp qua TURN Server (48ms)',
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setNatTopology(item.id)}
                className={`rounded border p-2.5 text-left transition-colors ${
                  natTopology === item.id
                    ? 'border-cyan-400 bg-cyan-950/60 text-white'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="font-mono text-xs font-bold text-cyan-300">
                  {item.title}
                </p>
                <p className="text-[11px] mt-0.5">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-2">
          <p className="font-mono text-xs font-semibold text-cyan-300">
            {isEn
              ? '2. Configure Active Media Tracks & Codec:'
              : '2. Cấu hình Kênh Truyền (Media Tracks & Codec):'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEnableVideo((v) => !v)}
              className={`rounded border px-2.5 py-1.5 font-mono text-xs ${
                enableVideo
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-500'
              }`}
            >
              {enableVideo ? '☑' : '☐'} Video (SRTP)
            </button>
            <button
              type="button"
              onClick={() => setEnableAudio((v) => !v)}
              className={`rounded border px-2.5 py-1.5 font-mono text-xs ${
                enableAudio
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-500'
              }`}
            >
              {enableAudio ? '☑' : '☐'} Audio (Opus)
            </button>
            <button
              type="button"
              onClick={() => setEnableDataChannel((v) => !v)}
              className={`rounded border px-2.5 py-1.5 font-mono text-xs ${
                enableDataChannel
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-500'
              }`}
            >
              {enableDataChannel ? '☑' : '☐'} RTCDataChannel (SCTP)
            </button>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="font-mono text-[11px] text-slate-400">
              Video Codec:
            </span>
            {(['VP9', 'H264', 'AV1'] as WebRtcVideoCodec[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setVideoCodec(c)}
                className={`rounded px-2 py-0.5 font-mono text-xs ${
                  videoCodec === c
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Stage Handshake & ICE Candidate Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: SDP Offer/Answer & ICE Candidate Table */}
        <div className="lg:col-span-6 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div>
            <p className="font-mono text-xs font-bold text-cyan-400 mb-1.5">
              {isEn
                ? 'ICE Candidate Gathering Table:'
                : 'Bảng Thu thập Ứng viên Mạng (ICE Candidate Gathering Table):'}
            </p>
            <div className="space-y-2">
              {session.iceCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className={`rounded border p-2.5 text-xs ${
                    cand.selected
                      ? 'border-emerald-500/50 bg-emerald-950/25'
                      : 'border-slate-800 bg-slate-900/60 opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white">
                      typ {cand.type} — {cand.ipPort}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        cand.selected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {cand.selected ? 'SELECTED PAIR' : 'STANDBY'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">
                    {cand.descriptionVi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs font-bold text-cyan-400 mb-1">
              {isEn
                ? 'SDP Offer Manifest (Exchanged over WebSocket Signaling):'
                : 'Bản mô tả phiên SDP Offer (Trao đổi qua WebSocket Signaling):'}
            </p>
            <pre className="rounded border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-cyan-200 overflow-x-auto max-h-44">
              <code>{session.sdpOfferText}</code>
            </pre>
          </div>
        </div>

        {/* Right: Active P2P Path, 4 Handshake Stages & Live RTCDataChannel */}
        <div className="lg:col-span-6 space-y-4 rounded border border-slate-800 bg-slate-950 p-4">
          <div className="rounded border border-cyan-500/30 bg-cyan-950/20 p-3">
            <p className="font-mono text-[10px] uppercase text-cyan-400">
              {isEn
                ? 'Active Physical Media/Data Tunnel:'
                : 'Đường truyền Vật lý Đang Hoạt động (Active Media/Data Tunnel):'}
            </p>
            <p className="font-mono text-xs font-bold text-white mt-0.5">
              {session.activePathLabel}
            </p>
          </div>

          <div className="space-y-1.5">
            {session.handshakeStages.map((st) => (
              <div
                key={st.stage}
                className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-xs"
              >
                <p className="font-mono font-bold text-cyan-300">{st.title}</p>
                <p className="text-slate-300 text-[11px] mt-0.5">{st.detailVi}</p>
              </div>
            ))}
          </div>

          {/* Live RTCDataChannel P2P Tester */}
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <p className="font-mono text-xs font-bold text-emerald-400">
              {isEn
                ? 'Test P2P Packet Streaming over RTCDataChannel (SCTP/UDP):'
                : 'Thử nghiệm Truyền Gói tin P2P qua RTCDataChannel (SCTP/UDP):'}
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={dcInput}
                onChange={(e) => setDcInput(e.target.value)}
                disabled={!enableDataChannel}
                className="flex-1 rounded border border-slate-800 bg-slate-900 px-2.5 py-1.5 font-mono text-xs text-white disabled:opacity-40"
              />
              <button
                type="button"
                disabled={!enableDataChannel}
                onClick={() => sendDataChannelPacket('Peer A')}
                className="rounded bg-cyan-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-40"
              >
                Peer A → Peer B
              </button>
              <button
                type="button"
                disabled={!enableDataChannel}
                onClick={() => sendDataChannelPacket('Peer B')}
                className="rounded bg-emerald-500 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-40"
              >
                Peer B → Peer A
              </button>
            </div>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {dcPackets.map((pkt) => (
                <div
                  key={pkt.id}
                  className="flex items-center justify-between rounded border border-slate-800/80 bg-slate-900/70 px-2.5 py-1 font-mono text-[11px]"
                >
                  <span className="text-cyan-300">{pkt.sender}</span>
                  <code className="text-slate-200 truncate max-w-[210px]">
                    {pkt.payload}
                  </code>
                  <span className="text-emerald-400">{pkt.rttMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DedicatedModulePlayground({
  moduleId,
}: {
  moduleId: ApiTechnologyId;
}) {
  switch (moduleId) {
    case 'rest':
      return <RestPlayground />;
    case 'soap':
      return <SoapPlayground />;
    case 'graphql':
      return <GraphqlPlayground />;
    case 'grpc':
      return <GrpcPlayground />;
    case 'websocket':
      return <WebsocketPlayground />;
    case 'webhook':
      return <WebhookPlayground />;
    case 'webrtc':
      return <WebRtcPlayground />;
  }
}
