import { ApiTechnologyId, TechnicalNature } from '@/types/api';

export type Language = 'vi' | 'en';
export type ThemeMode = 'dark' | 'light';

export interface TechClassificationItem {
  id: ApiTechnologyId;
  name: string;
  shortName: string;
  natureEn: TechnicalNature;
  natureVi: string;
  nature: string;
  roleSummaryVi: string;
  roleSummaryEn: string;
  roleSummary: string;
  coexistenceExampleVi: string;
  coexistenceExampleEn: string;
  coexistenceExample: string;
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
  simulationDisclaimerEn:
    'Deterministic Local Simulation Environment — All packets and protocol frames are processed locally with full protocol accuracy without making external network calls.',
  defaultLatencyMs: 140,
  stepIntervalMs: 1400,
} as const;

export function getSiteConfig(lang: Language) {
  return {
    ...SITE_CONFIG,
    headline: lang === 'en' ? SITE_CONFIG.headlineEn : SITE_CONFIG.headlineVi,
    subHeadline: lang === 'en' ? SITE_CONFIG.descriptionEn : SITE_CONFIG.headlineEn,
    description: lang === 'en' ? SITE_CONFIG.descriptionEn : SITE_CONFIG.descriptionVi,
    simulationDisclaimer:
      lang === 'en'
        ? SITE_CONFIG.simulationDisclaimerEn
        : SITE_CONFIG.simulationDisclaimerVi,
  };
}

export const TECH_CLASSIFICATIONS: TechClassificationItem[] = [
  {
    id: 'rest',
    name: 'REST API',
    shortName: 'REST',
    natureEn: 'Architectural Style',
    natureVi: 'Phong cách kiến trúc (Architectural Style)',
    nature: 'Phong cách kiến trúc (Architectural Style)',
    roleSummaryVi:
      'Tổ chức hệ thống xoay quanh Tài nguyên (Resources) định danh bằng URI và thao tác qua các HTTP Method chuẩn theo nguyên lý Stateless.',
    roleSummaryEn:
      'Organizes systems around URI-identified Resources manipulated through standard HTTP methods under strict Stateless constraints.',
    roleSummary:
      'Tổ chức hệ thống xoay quanh Tài nguyên (Resources) định danh bằng URI và thao tác qua các HTTP Method chuẩn theo nguyên lý Stateless.',
    coexistenceExampleVi:
      'REST đóng vai trò cổng CRUD chính cho Web/Mobile Client và thường được mô tả tài liệu bằng OpenAPI.',
    coexistenceExampleEn:
      'REST serves as the primary CRUD gateway for Web/Mobile clients alongside WebSocket real-time channels and internal gRPC services.',
    coexistenceExample:
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
    nature: 'Giao thức truyền thông điệp (Messaging Protocol)',
    roleSummaryVi:
      'Quy định cấu trúc gói tin XML nghiêm ngặt (Envelope, Header, Body, Fault) cùng hợp đồng dịch vụ WSDL cho các hệ thống Enterprise.',
    roleSummaryEn:
      'Enforces a strict XML message specification (Envelope, Header, Body, Fault) and formal WSDL service contracts for enterprise integration.',
    roleSummary:
      'Quy định cấu trúc gói tin XML nghiêm ngặt (Envelope, Header, Body, Fault) cùng hợp đồng dịch vụ WSDL cho các hệ thống Enterprise.',
    coexistenceExampleVi:
      'Hệ thống Core Banking nội bộ dùng SOAP có thể được bọc ngoài bởi một API Gateway phát hành REST hoặc GraphQL cho ứng dụng di động.',
    coexistenceExampleEn:
      'Legacy Core Banking SOAP services are often wrapped behind a modern API Gateway that exposes REST or GraphQL to mobile applications.',
    coexistenceExample:
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
    nature: 'Ngôn ngữ truy vấn & Runtime thực thi (Query Language & API Runtime)',
    roleSummaryVi:
      'Cho phép Client chủ động khai báo chính xác các trường dữ liệu cần lấy qua một Schema định kiểu mạnh, giải quyết triệt để Over-fetching và Under-fetching.',
    roleSummaryEn:
      'Empowers clients to declare the exact nested fields they need against a strongly typed Schema, eliminating over-fetching and under-fetching.',
    roleSummary:
      'Cho phép Client chủ động khai báo chính xác các trường dữ liệu cần lấy qua một Schema định kiểu mạnh, giải quyết triệt để Over-fetching và Under-fetching.',
    coexistenceExampleVi:
      'GraphQL Server thường đóng vai trò lớp tổng hợp dữ liệu (BFF / Data Aggregation) gọi xuống nhiều REST API và gRPC Microservices phía sau.',
    coexistenceExampleEn:
      'A GraphQL Server frequently acts as a Backend-for-Frontend (BFF) aggregation layer resolving data from multiple upstream REST and gRPC services.',
    coexistenceExample:
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
    nature: 'Khung gọi thủ tục từ xa (RPC Framework)',
    roleSummaryVi:
      'Sử dụng Protocol Buffers (nhị phân) và HTTP/2 để các dịch vụ gọi hàm từ xa với hiệu năng cực cao và hỗ trợ 4 mô hình Streaming.',
    roleSummaryEn:
      'Combines binary Protocol Buffers (.proto) with HTTP/2 multiplexing for ultra-low-latency remote procedure calls and 4 streaming modes.',
    roleSummary:
      'Sử dụng Protocol Buffers (nhị phân) và HTTP/2 để các dịch vụ gọi hàm từ xa với hiệu năng cực cao và hỗ trợ 4 mô hình Streaming.',
    coexistenceExampleVi:
      'Các Microservices nội bộ (Order, Payment, Inventory) giao tiếp với nhau bằng gRPC, trong khi API Gateway giao tiếp với trình duyệt bằng REST/GraphQL.',
    coexistenceExampleEn:
      'Internal microservices (Order, Payment, Inventory) communicate via high-speed gRPC, while the public API Gateway serves browsers over REST or GraphQL.',
    coexistenceExample:
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
    nature: 'Giao thức truyền thông hai chiều (Communication Protocol)',
    roleSummaryVi:
      'Nâng cấp từ HTTP Handshake lên kết nối TCP bền vững (Persistent, Full-duplex) giúp Client và Server đẩy dữ liệu tức thời hai chiều.',
    roleSummaryEn:
      'Upgrades an initial HTTP handshake into a persistent, full-duplex TCP connection enabling instant bidirectional frame push.',
    roleSummary:
      'Nâng cấp từ HTTP Handshake lên kết nối TCP bền vững (Persistent, Full-duplex) giúp Client và Server đẩy dữ liệu tức thời hai chiều.',
    coexistenceExampleVi:
      'Ứng dụng dùng REST để đăng nhập và tải lịch sử tin nhắn, sau đó mở kết nối WebSocket để nhận tin nhắn và thông báo thời gian thực.',
    coexistenceExampleEn:
      'Applications use REST to authenticate and load message history, then establish a WebSocket tunnel for live chat and real-time notifications.',
    coexistenceExample:
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
    nature: 'Cơ chế gọi lại hướng sự kiện (Event-Driven Callback Mechanism)',
    roleSummaryVi:
      'Đảo ngược luồng gọi (Reverse API): Hệ thống phát sự kiện chủ động gửi HTTP POST kèm JSON Payload và chữ ký HMAC tới Callback URL của hệ thống nhận.',
    roleSummaryEn:
      'Reverse API pattern: The event producer asynchronously pushes an HTTP POST payload signed with HMAC to the consumer’s registered Callback URL.',
    roleSummary:
      'Đảo ngược luồng gọi (Reverse API): Hệ thống phát sự kiện chủ động gửi HTTP POST kèm JSON Payload và chữ ký HMAC tới Callback URL của hệ thống nhận.',
    coexistenceExampleVi:
      'Ứng dụng Thương mại điện tử gọi REST API sang cổng thanh toán để tạo đơn, rồi lắng nghe Webhook HTTP POST khi khách hàng thanh toán thành công.',
    coexistenceExampleEn:
      'An e-commerce backend calls a payment gateway REST API to create a checkout session, then receives an asynchronous Webhook POST once payment settles.',
    coexistenceExample:
      'Ứng dụng Thương mại điện tử gọi REST API sang cổng thanh toán để tạo đơn, rồi lắng nghe Webhook HTTP POST khi khách hàng thanh toán thành công.',
    accentHex: '#F97316',
    colorName: 'orange',
    href: '/modules/webhook',
  },
  {
    id: 'webrtc',
    name: 'WebRTC API',
    shortName: 'WebRTC',
    natureEn: 'P2P Real-Time Media & Data Protocol',
    natureVi: 'Giao thức & API truyền thông ngang hàng thời gian thực (Peer-to-Peer Real-Time Media & Data)',
    nature: 'Giao thức & API truyền thông ngang hàng thời gian thực (Peer-to-Peer Real-Time Media & Data)',
    roleSummaryVi:
      'Kết nối trực tiếp trình duyệt-tới-trình duyệt (Peer-to-Peer) qua UDP/SRTP/SCTP để truyền tải Video, Audio và dữ liệu độ trễ cực thấp thông qua cơ chế bắt tay SDP và xuyên tường lửa ICE/STUN/TURN.',
    roleSummaryEn:
      'Establishes direct Peer-to-Peer browser tunnels over UDP (SRTP/SCTP) for sub-50ms video, audio, and data streaming via SDP negotiation and ICE/STUN/TURN NAT traversal.',
    roleSummary:
      'Kết nối trực tiếp trình duyệt-tới-trình duyệt (Peer-to-Peer) qua UDP/SRTP/SCTP để truyền tải Video, Audio và dữ liệu độ trễ cực thấp thông qua cơ chế bắt tay SDP và xuyên tường lửa ICE/STUN/TURN.',
    coexistenceExampleVi:
      'WebRTC không tự quy định kênh báo hiệu nên luôn phối hợp cùng WebSocket (hoặc REST) làm Signaling Server để hai Peer trao đổi SDP Offer/Answer và ICE Candidates trước khi mở luồng P2P trực tiếp.',
    coexistenceExampleEn:
      'WebRTC relies on WebSocket (or REST) as an out-of-band Signaling Server to exchange SDP Offers/Answers and ICE Candidates before locking in the direct P2P UDP media path.',
    coexistenceExample:
      'WebRTC không tự quy định kênh báo hiệu nên luôn phối hợp cùng WebSocket (hoặc REST) làm Signaling Server để hai Peer trao đổi SDP Offer/Answer và ICE Candidates trước khi mở luồng P2P trực tiếp.',
    accentHex: '#06B6D4',
    colorName: 'cyan',
    href: '/modules/webrtc',
  },
];

export function getTechClassifications(lang: Language): TechClassificationItem[] {
  return TECH_CLASSIFICATIONS.map((item) => ({
    ...item,
    nature: lang === 'en' ? item.natureEn : item.natureVi,
    roleSummary: lang === 'en' ? item.roleSummaryEn : item.roleSummaryVi,
    coexistenceExample:
      lang === 'en' ? item.coexistenceExampleEn : item.coexistenceExampleVi,
  }));
}

export const MAIN_NAVIGATION = [
  { label: 'Tổng quan', labelEn: 'Overview', href: '/' },
  { label: 'Nền tảng API', labelEn: 'API Fundamentals', href: '/fundamentals' },
  { label: '7 Chuyên đề', labelEn: '7 API Modules', href: '/modules/rest' },
  { label: 'Phòng thí nghiệm (API Lab)', labelEn: 'API Laboratory', href: '/lab' },
  { label: 'Kiến trúc Thực tế', labelEn: 'Real-World Architectures', href: '/scenarios' },
  { label: 'Trung tâm So sánh', labelEn: 'Comparison Center', href: '/comparison' },
  { label: 'Đánh giá Năng lực', labelEn: 'Knowledge Check', href: '/assessment' },
] as const;
