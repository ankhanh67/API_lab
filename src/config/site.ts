import { ApiTechnologyId, TechnicalNature } from '@/types/api';

export interface TechClassificationItem {
  id: ApiTechnologyId;
  name: string;
  shortName: string;
  natureEn: TechnicalNature;
  natureVi: string;
  roleSummaryVi: string;
  coexistenceExampleVi: string;
  accentHex: string;
  colorName: string;
  href: string;
}

export const SITE_CONFIG = {
  name: 'API Visual Lab',
  headlineEn: 'Understanding APIs: How Applications Communicate',
  descriptionEn:
    'Explore the technologies, protocols, and architectures that connect modern software systems.',
  headlineVi: 'Hiểu sâu về API: Cách các ứng dụng phần mềm giao tiếp',
  descriptionVi:
    'Môi trường học tập kỹ thuật tương tác giúp bạn trực quan hóa kiến trúc, luồng gói tin và thực hành mô phỏng 7 công nghệ API cốt lõi.',
  simulationDisclaimerVi:
    'Môi trường Mô phỏng Kỹ thuật (Deterministic Local Simulation) — Mọi gói tin được xử lý cục bộ với độ chính xác giao thức cao, không phát sinh request mạng thực tế ra ngoài.',
  defaultLatencyMs: 140,
  stepIntervalMs: 1400,
} as const;

export const TECH_CLASSIFICATIONS: TechClassificationItem[] = [
  {
    id: 'rest',
    name: 'REST API',
    shortName: 'REST',
    natureEn: 'Architectural Style',
    natureVi: 'Phong cách kiến trúc (Architectural Style)',
    roleSummaryVi:
      'Tổ chức hệ thống xoay quanh Tài nguyên (Resources) định danh bằng URI và thao tác qua các HTTP Method chuẩn theo nguyên lý Stateless.',
    coexistenceExampleVi:
      'REST đóng vai trò cổng CRUD chính cho Web/Mobile Client và thường được mô tả tài liệu bằng OpenAPI.',
    accentHex: '#38BDF8',
    colorName: 'sky',
    href: '/modules/rest',
  },
  {
    id: 'soap',
    name: 'SOAP API',
    shortName: 'SOAP',
    natureEn: 'Messaging Protocol',
    natureVi: 'Giao thức truyền thông điệp (Messaging Protocol)',
    roleSummaryVi:
      'Quy định cấu trúc gói tin XML nghiêm ngặt (Envelope, Header, Body, Fault) cùng hợp đồng dịch vụ WSDL cho các hệ thống Enterprise.',
    coexistenceExampleVi:
      'Hệ thống Core Banking nội bộ dùng SOAP có thể được bọc ngoài bởi một API Gateway phát hành REST hoặc GraphQL cho ứng dụng di động.',
    accentHex: '#F59E0B',
    colorName: 'amber',
    href: '/modules/soap',
  },
  {
    id: 'graphql',
    name: 'GraphQL API',
    shortName: 'GraphQL',
    natureEn: 'Query Language & Runtime',
    natureVi: 'Ngôn ngữ truy vấn & Runtime thực thi (Query Language & API Runtime)',
    roleSummaryVi:
      'Cho phép Client chủ động khai báo chính xác các trường dữ liệu cần lấy qua một Schema định kiểu mạnh, giải quyết triệt để Over-fetching và Under-fetching.',
    coexistenceExampleVi:
      'GraphQL Server thường đóng vai trò lớp tổng hợp dữ liệu (BFF / Data Aggregation) gọi xuống nhiều REST API và gRPC Microservices phía sau.',
    accentHex: '#EC4899',
    colorName: 'pink',
    href: '/modules/graphql',
  },
  {
    id: 'grpc',
    name: 'gRPC API',
    shortName: 'gRPC',
    natureEn: 'RPC Framework',
    natureVi: 'Khung gọi thủ tục từ xa (RPC Framework)',
    roleSummaryVi:
      'Sử dụng Protocol Buffers (nhị phân) và HTTP/2 để các dịch vụ gọi hàm từ xa với hiệu năng cực cao và hỗ trợ 4 mô hình Streaming.',
    coexistenceExampleVi:
      'Các Microservices nội bộ (Order, Payment, Inventory) giao tiếp với nhau bằng gRPC, trong khi API Gateway giao tiếp với trình duyệt bằng REST/GraphQL.',
    accentHex: '#10B981',
    colorName: 'emerald',
    href: '/modules/grpc',
  },
  {
    id: 'websocket',
    name: 'WebSocket API',
    shortName: 'WebSocket',
    natureEn: 'Communication Protocol',
    natureVi: 'Giao thức truyền thông hai chiều (Communication Protocol)',
    roleSummaryVi:
      'Nâng cấp từ HTTP Handshake lên kết nối TCP bền vững (Persistent, Full-duplex) giúp Client và Server đẩy dữ liệu tức thời hai chiều.',
    coexistenceExampleVi:
      'Ứng dụng dùng REST để đăng nhập và tải lịch sử tin nhắn, sau đó mở kết nối WebSocket để nhận tin nhắn và thông báo thời gian thực.',
    accentHex: '#8B5CF6',
    colorName: 'violet',
    href: '/modules/websocket',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    shortName: 'Webhook',
    natureEn: 'Event-Driven Callback Mechanism',
    natureVi: 'Cơ chế gọi lại hướng sự kiện (Event-Driven Callback Mechanism)',
    roleSummaryVi:
      'Đảo ngược luồng gọi (Reverse API): Hệ thống phát sự kiện chủ động gửi HTTP POST kèm JSON Payload và chữ ký HMAC tới Callback URL của hệ thống nhận.',
    coexistenceExampleVi:
      'Ứng dụng Thương mại điện tử gọi REST API sang cổng thanh toán để tạo đơn, rồi lắng nghe Webhook HTTP POST khi khách hàng thanh toán thành công.',
    accentHex: '#F97316',
    colorName: 'orange',
    href: '/modules/webhook',
  },
  {
    id: 'openapi',
    name: 'OpenAPI Specification',
    shortName: 'OpenAPI',
    natureEn: 'API Description Specification',
    natureVi: 'Đặc tả mô tả API (API Description Specification)',
    roleSummaryVi:
      'Chuẩn định dạng YAML/JSON mô tả cấu trúc REST API (Paths, Parameters, Schemas, Security) phục vụ sinh tài liệu, kiểm tra hợp lệ và sinh SDK tự động.',
    coexistenceExampleVi:
      'OpenAPI không tự truyền dữ liệu trên mạng mà mô tả hợp đồng cho các REST API để đội Frontend, Backend và QA làm việc đồng bộ.',
    accentHex: '#06B6D4',
    colorName: 'cyan',
    href: '/modules/openapi',
  },
];

export const MAIN_NAVIGATION = [
  { label: 'Tổng quan', href: '/' },
  { label: 'Nền tảng API', href: '/fundamentals' },
  { label: '7 Chuyên đề', href: '/modules/rest' },
  { label: 'Phòng thí nghiệm (API Lab)', href: '/lab' },
  { label: 'Kiến trúc Thực tế', href: '/scenarios' },
  { label: 'Trung tâm So sánh', href: '/comparison' },
  { label: 'Đánh giá Năng lực', href: '/assessment' },
] as const;
