import { ComparisonRow, ApiTechnologyId } from '@/types/api';

export const COMPARISON_DIMENSIONS: ComparisonRow[] = [
  {
    dimensionEn: 'Technical Nature',
    dimensionVi: '1. Bản chất Kỹ thuật',
    whatItMeansVi:
      'Phân loại chính xác vị trí của công nghệ trong kiến trúc phần mềm (tránh nhầm lẫn giữa giao thức mạng và tài liệu đặc tả).',
    values: {
      rest: 'Phong cách kiến trúc (Architectural Style) dựa trên Tài nguyên & HTTP.',
      soap: 'Giao thức truyền thông điệp (Messaging Protocol) chuẩn hóa bằng XML.',
      graphql: 'Ngôn ngữ truy vấn dữ liệu & Runtime thực thi (Query Language & Runtime).',
      grpc: 'Khung gọi thủ tục từ xa hiệu năng cao (RPC Framework).',
      websocket: 'Giao thức truyền thông hai chiều bền vững (Communication Protocol).',
      webhook: 'Cơ chế gọi lại hướng sự kiện qua HTTP (Event-Driven Callback Mechanism).',
      openapi:
        'Đặc tả mô tả cấu trúc REST API (API Description Specification — Không phải giao thức truyền dữ liệu).',
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
      openapi:
        'Không trực tiếp truyền thông mạng; cung cấp bản thiết kế YAML/JSON để mô tả và kiểm tra các giao tiếp REST.',
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
      openapi: 'Tài liệu đặc tả được viết bằng định dạng YAML hoặc JSON.',
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
      websocket: 'Song công toàn phần hai chiều (Full-Duplex Bidirectional: Client ⇄ Server).',
      webhook: 'Đẩy một chiều hướng sự kiện từ Producer sang Consumer (Event Push / Reverse API).',
      openapi: 'Không áp dụng (Là tài liệu tĩnh/máy đọc được dùng để mô tả các hướng gọi của REST API).',
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
      websocket: 'Xuất sắc (Sinh ra chuyên biệt cho truyền thông hai chiều thời gian thực độ trễ cực thấp).',
      webhook: 'Cao cho thông báo sự kiện Server-to-Server (Bắn HTTP POST ngay khoảnh khắc sự kiện phát sinh).',
      openapi: 'Không áp dụng (Đặc tả tài liệu; với hệ thống thời gian thực có thể tham khảo thêm chuẩn AsyncAPI).',
    },
  },
  {
    dimensionEn: 'Performance Characteristics',
    dimensionVi: '6. Đặc trưng Hiệu năng (Performance)',
    whatItMeansVi: 'Kích thước gói tin, chi phí CPU parse dữ liệu và khả năng tận dụng Cache.',
    values: {
      rest: 'Tốt; tận dụng cực tốt HTTP Caching ở tầng mạng/CDN, nhưng JSON vẫn tốn băng thông khi Object lớn.',
      soap: 'Thấp nhất về tốc độ truyền tải do cấu trúc thẻ XML cồng kềnh và tốn CPU phân tích DOM/XSD.',
      graphql: 'Tối ưu băng thông mạng cho Client (không tải thừa trường), nhưng Server tốn CPU phân tích AST & chạy Resolvers.',
      grpc: 'Đỉnh cao về thông lượng và độ trễ nhờ nén nhị phân Protobuf (nhỏ hơn 3–5 lần JSON) và HTTP/2 Multiplexing.',
      websocket: 'Độ trễ thấp nhất cho luồng tin nhắn liên tục vì Frame Header chỉ tốn 2–14 bytes và không cần bắt tay lại.',
      webhook: 'Hiệu quả tài nguyên vượt trội so với Polling (loại bỏ 99% các request hỏi thăm không có dữ liệu mới).',
      openapi: 'Không xếp hạng hiệu năng truyền mạng (OpenAPI không truyền gói tin; nó giúp tăng tốc độ phát triển & kiểm tra lỗi).',
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
      openapi: 'Thấp–Trung bình — Cú pháp YAML/JSON trực quan, hệ sinh thái công cụ Swagger hỗ trợ rất mạnh.',
    },
  },
  {
    dimensionEn: 'Client-Server Data Flexibility',
    dimensionVi: '8. Tính Linh hoạt Trao đổi Dữ liệu (Flexibility)',
    whatItMeansVi: 'Mức độ linh hoạt giữa hợp đồng cứng nhắc và khả năng tùy biến theo nhu cầu Client.',
    values: {
      rest: 'Trung bình — Server quyết định cứng các trường trả về tại mỗi URL Endpoint.',
      soap: 'Cứng nhắc theo thiết kế — Mọi thay đổi nhỏ đều phải cập nhật và biên dịch lại hợp đồng WSDL/XSD.',
      graphql: 'Linh hoạt cao nhất cho Client — Client tự chọn chính xác từng trường và quan hệ lồng nhau trong 1 lần gọi.',
      grpc: 'Chặt chẽ nhưng tiến hóa tốt — Hợp đồng .proto định kiểu mạnh nhưng hỗ trợ thêm/bỏ trường an toàn nhờ Field Numbers.',
      websocket: 'Tự do — Giao thức không ép buộc cấu trúc Payload bên trong Frame (lập trình viên tự quy ước JSON/Binary event).',
      webhook: 'Theo sự kiện — Consumer đăng ký chọn lọc các loại sự kiện (Event Topics) muốn nhận.',
      openapi: 'Chuẩn hóa linh hoạt — Mô tả được mọi kiểu cấu trúc REST, đa dạng Schema (oneOf, allOf) và Security Schemes.',
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
      websocket: 'Ứng dụng Chat, cộng tác trực tuyến (Figma/Docs), bảng giá tài chính live, thông báo đẩy thời gian thực.',
      webhook: 'Thông báo kết quả thanh toán (Stripe/VNPay), tự động hóa CI/CD (GitHub push), đồng bộ sự kiện giữa các SaaS.',
      openapi: 'Tài liệu hóa REST API tương tác (Swagger UI), phát triển Contract-First, tự động sinh Client SDK và kiểm tra Schema.',
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
      'Cần khả năng tương thích rộng rãi nhất, dễ đọc bằng JSON, tận dụng được HTTP Caching và có cổng tài liệu tương tác chuẩn.',
    recommendedPrimary: 'rest',
    recommendedCompanion: 'openapi',
    rationaleVi:
      'REST API kết hợp cùng đặc tả OpenAPI 3.0 là tiêu chuẩn vàng cho Public API: mọi ngôn ngữ đều gọi được ngay, tận dụng trọn vẹn HTTP Status Codes/Caching và có sẵn trang tài liệu Swagger UI.',
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
    requirementTitleVi: 'Ứng dụng Chat, Bảng giá Chứng khoán Live hoặc Cộng tác Trực tuyến',
    contextDescriptionVi:
      'Server cần đẩy dữ liệu liên tục từng mili-giây xuống trình duyệt người dùng và nhận tương tác ngược lại tức thời.',
    recommendedPrimary: 'websocket',
    rationaleVi:
      'WebSocket thiết lập kênh kết nối TCP bền vững hai chiều (Full-Duplex) ngay trên trình duyệt, cho phép cả Client và Server đẩy Frame bất kỳ lúc nào mà không tốn chi phí mở lại kết nối HTTP.',
    whyNotOthersVi:
      'HTTP Polling bằng REST sẽ làm ngập lụt Server bằng hàng triệu HTTP Headers rỗng, còn Webhook không thể gọi trực tiếp vào trình duyệt của người dùng cuối.',
  },
  {
    id: 'dec-4',
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
    id: 'dec-5',
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
    id: 'dec-6',
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
