import { ComparisonRow, ApiTechnologyId } from '@/types/api';

export const COMPARISON_DIMENSIONS: ComparisonRow[] = [
  {
    dimensionEn: 'Technical Nature',
    dimensionVi: '1. Bản chất Kỹ thuật',
    whatItMeansVi:
      'Phân loại chính xác vị trí của công nghệ trong kiến trúc phần mềm (phong cách kiến trúc, giao thức thông điệp, ngôn ngữ truy vấn, khung RPC hay giao thức P2P).',
    values: {
      rest: 'Phong cách kiến trúc (Architectural Style) dựa trên Tài nguyên & HTTP.',
      soap: 'Giao thức truyền thông điệp (Messaging Protocol) chuẩn hóa bằng XML.',
      graphql: 'Ngôn ngữ truy vấn dữ liệu & Runtime thực thi (Query Language & Runtime).',
      grpc: 'Khung gọi thủ tục từ xa hiệu năng cao (RPC Framework).',
      websocket: 'Giao thức truyền thông hai chiều bền vững Client–Server (Communication Protocol).',
      webhook: 'Cơ chế gọi lại hướng sự kiện qua HTTP (Event-Driven Callback Mechanism).',
      webrtc:
        'Tổ hợp giao thức & API truyền thông ngang hàng thời gian thực (P2P Real-Time Media & Data Protocol).',
    },
  },
  {
    dimensionEn: 'Communication Model',
    dimensionVi: '2. Cơ chế Tương tác (Communication)',
    whatItMeansVi: 'Cách thức các thành phần khởi tạo kết nối và trao đổi thông điệp với nhau.',
    values: {
      rest: 'Thao tác CRUD lên các URI Tài nguyên qua các HTTP Verbs chuẩn (GET, POST, PUT, PATCH, DELETE).',
      soap: 'Gửi bức điện XML Envelope (Header + Body) tới Endpoint, được định nghĩa bởi hợp đồng WSDL.',
      graphql: 'Client gửi câu truy vấn khai báo cây trường dữ liệu tới một Endpoint duy nhất (POST /graphql).',
      grpc: 'Client gọi trực tiếp các hàm trên đối tượng Stub sinh từ file .proto qua luồng đa hợp HTTP/2.',
      websocket: 'Bắt tay nâng cấp HTTP 101 rồi trao đổi các khung dữ liệu (Frames) tự do trên kênh TCP giữ mở.',
      webhook: 'Bên phát sự kiện (Producer) chủ động bắn HTTP POST tới Callback URL của bên nhận khi sự kiện xảy ra.',
      webrtc:
        'Bắt tay báo hiệu SDP & xuyên tường lửa ICE/STUN/TURN, sau đó truyền trực tiếp giữa 2 trình duyệt (Peer A ⇄ Peer B) qua UDP.',
    },
  },
  {
    dimensionEn: 'Data Format',
    dimensionVi: '3. Định dạng Dữ liệu (Data Format)',
    whatItMeansVi: 'Cách dữ liệu được tuần tự hóa (Serialize) trên đường truyền hoặc lưu trữ.',
    values: {
      rest: 'Chủ yếu là JSON (ngoài ra hỗ trợ XML, HTML, Text qua Content Negotiation).',
      soap: 'Bắt buộc sử dụng XML nghiêm ngặt kèm Namespaces và XML Schema (XSD).',
      graphql: 'Truy vấn bằng cú pháp GraphQL Query; phản hồi trả về định dạng JSON.',
      grpc: 'Nhị phân Protocol Buffers (Protobuf Binary) siêu gọn theo định nghĩa .proto.',
      websocket: 'WebSocket Frames mang chuỗi Văn bản (UTF-8 JSON) hoặc mảng Nhị phân (Binary ArrayBuffer).',
      webhook: 'Thường là JSON (hoặc Form-urlencoded) đặt trong phần thân của HTTP POST.',
      webrtc:
        'Khung đa phương tiện mã hóa SRTP (Opus Audio, VP8/VP9/H.264/AV1 Video) và gói dữ liệu nhị phân/văn bản SCTP (RTCDataChannel) kèm bản mô tả phiên SDP.',
    },
  },
  {
    dimensionEn: 'Communication Direction',
    dimensionVi: '4. Chiều Giao tiếp (Direction)',
    whatItMeansVi: 'Ai là bên chủ động khởi tạo luồng dữ liệu và dữ liệu chảy theo hướng nào.',
    values: {
      rest: 'Đồng bộ Request / Response (Client luôn là bên chủ động hỏi Server).',
      soap: 'Đồng bộ Request / Response (hoặc One-way message qua hàng đợi doanh nghiệp).',
      graphql: 'Request / Response cho Query & Mutation (Subscriptions thường phải mượn WebSocket/SSE).',
      grpc: 'Linh hoạt 4 chế độ: Unary (1-1), Server Stream (1-N), Client Stream (N-1), Bidirectional (N⇄N).',
      websocket: 'Song công toàn phần hai chiều Client ⇄ Server (Full-Duplex Bidirectional over TCP).',
      webhook: 'Đẩy một chiều hướng sự kiện từ Producer sang Consumer (Event Push / Reverse API).',
      webrtc: 'Song công ngang hàng trực tiếp giữa các thiết bị đầu cuối (Direct Peer-to-Peer Full-Duplex Peer A ⇄ Peer B).',
    },
  },
  {
    dimensionEn: 'Real-Time Capability',
    dimensionVi: '5. Khả năng Thời gian thực (Real-Time)',
    whatItMeansVi: 'Mức độ hỗ trợ cập nhật dữ liệu tức thời khi trạng thái thay đổi.',
    values: {
      rest: 'Thấp (Phải dùng HTTP Polling hỏi lặp đi lặp lại gây trễ và tốn băng thông).',
      soap: 'Thấp (Không thiết kế cho luồng sự kiện thời gian thực liên tục).',
      graphql: 'Trung bình (Cần cấu hình thêm GraphQL Subscriptions chạy bên trên WebSocket).',
      grpc: 'Rất cao (Hỗ trợ Streaming hai chiều liên tục với độ trễ mili-giây trên HTTP/2).',
      websocket: 'Xuất sắc cho dữ liệu tin nhắn/sự kiện đi qua máy chủ trung tâm (TCP Full-Duplex).',
      webhook: 'Cao cho thông báo sự kiện Server-to-Server (Bắn HTTP POST ngay khoảnh khắc sự kiện phát sinh).',
      webrtc:
        'Đỉnh cao tuyệt đối (Sub-20ms) cho Video/Audio & P2P Data nhờ truyền thẳng ngang hàng trên nền giao thức UDP không chờ gửi lại.',
    },
  },
  {
    dimensionEn: 'Performance Characteristics',
    dimensionVi: '6. Đặc trưng Hiệu năng (Performance)',
    whatItMeansVi: 'Kích thước gói tin, chi phí CPU parse dữ liệu, băng thông máy chủ và độ trễ.',
    values: {
      rest: 'Tốt; tận dụng cực tốt HTTP Caching ở tầng mạng/CDN, nhưng JSON vẫn tốn băng thông khi Object lớn.',
      soap: 'Thấp nhất về tốc độ truyền tải do cấu trúc thẻ XML cồng kềnh và tốn CPU phân tích DOM/XSD.',
      graphql: 'Tối ưu băng thông mạng cho Client (không tải thừa trường), nhưng Server tốn CPU phân tích AST & chạy Resolvers.',
      grpc: 'Đỉnh cao cho giao tiếp Server-to-Server nhờ nén nhị phân Protobuf (nhỏ hơn 3–5 lần JSON) và HTTP/2 Multiplexing.',
      websocket: 'Độ trễ thấp cho luồng tin nhắn liên tục vì Frame Header chỉ tốn 2–14 bytes và không cần bắt tay lại.',
      webhook: 'Hiệu quả tài nguyên vượt trội so với Polling (loại bỏ 99% các request hỏi thăm không có dữ liệu mới).',
      webrtc:
        'Độ trễ đường truyền thấp nhất và giải phóng 100% băng thông máy chủ trung tâm khi kết nối P2P trực tiếp thành công (tránh TCP Head-of-Line Blocking).',
    },
  },
  {
    dimensionEn: 'Learning & Implementation Complexity',
    dimensionVi: '7. Độ phức tạp Triển khai (Complexity)',
    whatItMeansVi: 'Chi phí học tập, công cụ cần thiết và độ khó khi vận hành hệ thống.',
    values: {
      rest: 'Thấp — Dễ học và dễ triển khai nhất với mọi ngôn ngữ và trình duyệt.',
      soap: 'Cao — Đòi hỏi nắm vững WSDL, XML Namespaces, XSD và bộ tiêu chuẩn WS-*.',
      graphql: 'Trung bình–Cao — Cần thiết kế Schema, Resolvers, xử lý N+1 Query (DataLoader) và bảo mật độ sâu truy vấn.',
      grpc: 'Trung bình–Cao — Cần quy trình biên dịch file .proto (protoc) và proxy nếu muốn gọi từ trình duyệt.',
      websocket: 'Trung bình–Cao — Phải quản lý kết nối Stateful, nhịp tim Ping/Pong, Reconnection và đồng bộ Pub/Sub khi scale.',
      webhook: 'Trung bình — Dễ viết Endpoint nhận nhưng bắt buộc phải làm chuẩn xác thực HMAC, Retry và Idempotency.',
      webrtc:
        'Cao nhất — Phải phối hợp cả Signaling Server (WebSocket), đàm phán trạng thái SDP, xử lý xuyên tường lửa ICE/STUN/TURN và máy chủ SFU nếu họp nhóm đông.',
    },
  },
  {
    dimensionEn: 'Client-Server Data Flexibility',
    dimensionVi: '8. Tính Linh hoạt Trao đổi Dữ liệu (Flexibility)',
    whatItMeansVi: 'Mức độ linh hoạt giữa hợp đồng cứng nhắc và khả năng tùy biến theo nhu cầu.',
    values: {
      rest: 'Trung bình — Server quyết định cứng các trường trả về tại mỗi URL Endpoint.',
      soap: 'Cứng nhắc theo thiết kế — Mọi thay đổi nhỏ đều phải cập nhật và biên dịch lại hợp đồng WSDL/XSD.',
      graphql: 'Linh hoạt cao nhất cho truy vấn dữ liệu — Client tự chọn chính xác từng trường và quan hệ lồng nhau trong 1 lần gọi.',
      grpc: 'Chặt chẽ nhưng tiến hóa tốt — Hợp đồng .proto định kiểu mạnh nhưng hỗ trợ thêm/bỏ trường an toàn nhờ Field Numbers.',
      websocket: 'Tự do — Giao thức không ép buộc cấu trúc Payload bên trong Frame (lập trình viên tự quy ước JSON/Binary event).',
      webhook: 'Theo sự kiện — Consumer đăng ký chọn lọc các loại sự kiện (Event Topics) muốn nhận.',
      webrtc:
        'Đa năng cho Media & P2P — Tự động thích ứng bitrate Video/Audio theo chất lượng mạng và cho phép cấu hình RTCDataChannel tin cậy (Reliable) hoặc không tin cậy (Unreliable).',
    },
  },
  {
    dimensionEn: 'Typical Use Cases',
    dimensionVi: '9. Trường hợp Sử dụng Điển hình (Typical Use Cases)',
    whatItMeansVi: 'Bài toán thực tế mà công nghệ này phát huy tối đa giá trị.',
    values: {
      rest: 'Public Web APIs, dịch vụ CRUD thương mại điện tử, ứng dụng Web/Mobile tiêu chuẩn.',
      soap: 'Core Banking, thanh toán liên ngân hàng, hệ thống ERP/Viễn thông/Chính phủ yêu cầu hợp đồng và bảo mật WS-*.',
      graphql: 'Ứng dụng đa nền tảng (Web/Mobile/Smartwatch), cổng tổng hợp dữ liệu (BFF) có đồ thị thực thể phức tạp.',
      grpc: 'Giao tiếp nội bộ tốc độ cao giữa các Microservices đa ngôn ngữ, hệ thống Streaming Telemetry & AI Inference.',
      websocket: 'Ứng dụng Chat văn bản, bảng giá tài chính live, thông báo đẩy thời gian thực cần máy chủ điều phối.',
      webhook: 'Thông báo kết quả thanh toán (Stripe/VNPay), tự động hóa CI/CD (GitHub push), đồng bộ sự kiện giữa các SaaS.',
      webrtc:
        'Họp trực tuyến Video/Audio (Google Meet, Zoom), khám bệnh từ xa (Telehealth), chia sẻ màn hình, truyền file P2P và Cloud Gaming.',
    },
  },
];

export interface DecisionScenarioOption {
  id: string;
  requirementTitleVi: string;
  contextDescriptionVi: string;
  recommendedPrimary: ApiTechnologyId;
  recommendedCompanion?: ApiTechnologyId;
  rationaleVi: string;
  whyNotOthersVi: string;
}

export const DECISION_ADVISOR_SCENARIOS: DecisionScenarioOption[] = [
  {
    id: 'dec-1',
    requirementTitleVi: 'Xây dựng Public API cho đối tác bên ngoài & CRUD Web/Mobile chuẩn',
    contextDescriptionVi:
      'Cần khả năng tương thích rộng rãi nhất, dễ đọc bằng JSON, tận dụng được HTTP Caching và kiến trúc Stateless đơn giản.',
    recommendedPrimary: 'rest',
    rationaleVi:
      'REST API là tiêu chuẩn vàng cho Public API và ứng dụng CRUD: mọi ngôn ngữ đều gọi được ngay, tận dụng trọn vẹn HTTP Status Codes, CDN/Browser Caching và dễ dàng bảo mật qua API Gateway.',
    whyNotOthersVi:
      'Không nên ép đối tác bên ngoài phải cài đặt bộ biên dịch nhị phân gRPC hay xây dựng bức điện XML SOAP phức tạp trừ khi ở ngành ngân hàng đặc thù.',
  },
  {
    id: 'dec-2',
    requirementTitleVi: 'Giao tiếp nội bộ tần suất cao giữa 20 Microservices (Go, Java, Python)',
    contextDescriptionVi:
      'Hàng chục ngàn lệnh gọi RPC mỗi giây trong cụm Kubernetes, yêu cầu độ trễ < 3ms, tiết kiệm băng thông và hỗ trợ Streaming.',
    recommendedPrimary: 'grpc',
    rationaleVi:
      'gRPC với nhị phân Protocol Buffers trên nền HTTP/2 giúp giảm 60–80% kích thước gói tin, loại bỏ chi phí parse văn bản JSON và tự động sinh Client Stub định kiểu mạnh cho cả Go, Java, Python.',
    whyNotOthersVi:
      'Dùng REST/JSON hoặc SOAP/XML ở tầng giao tiếp nội bộ mật độ cao sẽ gây nghẽn CPU do quá trình serialize/deserialize văn bản lặp đi lặp lại.',
  },
  {
    id: 'dec-3',
    requirementTitleVi: 'Ứng dụng Chat Văn bản, Bảng giá Chứng khoán Live hoặc Thông báo Hệ thống',
    contextDescriptionVi:
      'Server trung tâm cần đẩy dữ liệu liên tục từng mili-giây xuống hàng ngàn trình duyệt người dùng và đảm bảo không mất gói tin qua TCP.',
    recommendedPrimary: 'websocket',
    rationaleVi:
      'WebSocket thiết lập kênh kết nối TCP bền vững hai chiều (Full-Duplex) giữa Client và Server, cho phép Server phát tán (Broadcast) sự kiện bất kỳ lúc nào mà không tốn chi phí mở lại kết nối HTTP.',
    whyNotOthersVi:
      'HTTP Polling bằng REST sẽ làm ngập lụt Server bằng hàng triệu HTTP Headers rỗng, còn WebRTC P2P quá phức tạp nếu chỉ cần gửi tin nhắn văn bản qua máy chủ quản lý tập trung.',
  },
  {
    id: 'dec-4',
    requirementTitleVi: 'Gọi Video/Audio Trực tuyến, Chia sẻ Màn hình hoặc Truyền File P2P giữa 2 Trình duyệt',
    contextDescriptionVi:
      'Cần truyền luồng hình ảnh 1080p@60fps, âm thanh khử vọng hoặc dữ liệu tọa độ game trực tiếp giữa các người dùng với độ trễ dưới 20ms.',
    recommendedPrimary: 'webrtc',
    recommendedCompanion: 'websocket',
    rationaleVi:
      'WebRTC truyền trực tiếp luồng Media (SRTP) và dữ liệu (RTCDataChannel/SCTP) ngang hàng (Peer-to-Peer) trên nền giao thức UDP, kết hợp cùng WebSocket làm kênh báo hiệu (Signaling SDP/ICE) ban đầu.',
    whyNotOthersVi:
      'Nếu đẩy luồng Video thời gian thực qua WebSocket (TCP Client-Server), hiện tượng TCP Head-of-Line Blocking khi rớt gói sẽ làm video bị khựng và làm nổ chi phí băng thông máy chủ trung tâm.',
  },
  {
    id: 'dec-5',
    requirementTitleVi: 'Nhận thông báo kết quả Thanh toán / Vận chuyển bất đồng bộ giữa hai Server',
    contextDescriptionVi:
      'Khi khách hàng thanh toán xong trên cổng ngân hàng hoặc đơn vị vận chuyển giao hàng xong, hệ thống của bạn cần được báo tin ngay.',
    recommendedPrimary: 'webhook',
    recommendedCompanion: 'rest',
    rationaleVi:
      'Webhook (Reverse API) giúp cổng thanh toán chủ động bắn 1 lệnh HTTP POST có chữ ký HMAC tới Callback URL của bạn ngay khi sự kiện xảy ra, tiết kiệm 99% tài nguyên so với việc chạy vòng lặp Polling.',
    whyNotOthersVi:
      'Không cần duy trì kết nối WebSocket mở 24/7 tốn tài nguyên giữa hai hệ thống nếu sự kiện chỉ phát sinh rải rác theo từng đơn hàng.',
  },
  {
    id: 'dec-6',
    requirementTitleVi: 'Ứng dụng Mobile & Web cần truy vấn đồ thị dữ liệu liên kết sâu (Tránh Over-fetching)',
    contextDescriptionVi:
      'Nhiều màn hình khác nhau cần lấy dữ liệu kết hợp từ User, Department, Courses, Orders nhưng muốn gói gọn trong 1 lần gọi mạng duy nhất.',
    recommendedPrimary: 'graphql',
    rationaleVi:
      'GraphQL cho phép từng màn hình Client chủ động khai báo đúng các trường cần lấy trong 1 câu Query duy nhất; tầng Resolvers trên Server sẽ gom dữ liệu và trả về JSON vừa khít.',
    whyNotOthersVi:
      'Với REST truyền thống, hoặc bạn phải gọi 4–5 Endpoints liên tiếp (Under-fetching), hoặc Server phải trả về một Object khổng lồ chứa hàng chục trường thừa (Over-fetching).',
  },
  {
    id: 'dec-7',
    requirementTitleVi: 'Tích hợp Hệ thống Core Banking / ERP Tài chính yêu cầu WS-Security & XSD',
    contextDescriptionVi:
      'Đòi hỏi hợp đồng WSDL bất biến, kiểm tra lược đồ XSD nghiêm ngặt và chữ ký số ở cấp độ từng phần tử XML khi đi qua nhiều trạm trung gian.',
    recommendedPrimary: 'soap',
    rationaleVi:
      'SOAP 1.2 cùng hệ sinh thái WS-Security và WSDL/XSD được thiết kế chuyên biệt cho các giao dịch tài chính doanh nghiệp đòi hỏi tính toàn vẹn cấp thông điệp cao nhất.',
    whyNotOthersVi:
      'Các giải pháp JSON nhẹ thường chỉ dựa vào bảo mật tầng đường truyền (TLS điểm-tới-điểm) mà thiếu tiêu chuẩn ký số/mã hóa cấp phần tử thông điệp chuẩn hóa như WS-Security.',
  },
];
