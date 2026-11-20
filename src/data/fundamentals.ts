export interface FundamentalLifecycleNode {
  id: string;
  order: number;
  nameEn: string;
  nameVi: string;
  roleEn: string;
  summaryVi: string;
  internalWorkingsVi: string[];
  rawArtifactTitle: string;
  rawArtifactCode: string;
}

export interface HttpMethodDetail {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  purposeVi: string;
  idempotent: boolean;
  safe: boolean;
  hasBody: boolean;
  exampleEndpoint: string;
  requestPayload: string;
  responseStatus: string;
  responsePayload: string;
}

export interface StatusCodeCategory {
  range: string;
  titleEn: string;
  titleVi: string;
  colorClass: string;
  codes: {
    code: number;
    text: string;
    meaningVi: string;
    scenarioVi: string;
  }[];
}

export interface AuthMechanismDetail {
  id: 'api-key' | 'bearer-token' | 'jwt' | 'oauth2';
  nameEn: string;
  titleVi: string;
  mechanismVi: string;
  headerExample: string;
  prosVi: string[];
  consVi: string[];
  bestUseCaseVi: string;
}

export const FUNDAMENTAL_LIFECYCLE_STAGES: FundamentalLifecycleNode[] = [
  {
    id: 'client',
    order: 1,
    nameEn: '1. Client (Constructing Request)',
    nameVi: '1. Client khởi tạo Request',
    roleEn: 'Browser / Mobile App / CLI Service',
    summaryVi:
      'Ứng dụng phía người dùng (hoặc dịch vụ gọi) thu thập dữ liệu đầu vào, đóng gói thành cấu trúc yêu cầu hợp lệ trước khi đẩy xuống tầng mạng.',
    internalWorkingsVi: [
      'Xác định URI đích (Endpoint), phương thức (ví dụ: POST /api/orders) và Query Parameters.',
      'Chuyển đổi đối tượng trong bộ nhớ (In-memory Object) thành chuỗi JSON/XML hoặc byte nhị phân (Serialization).',
      'Đính kèm Metadata vào HTTP Headers: Content-Type, Accept, Authorization (Bearer Token/API Key).',
    ],
    rawArtifactTitle: 'Client In-Memory State → Serialized Payload',
    rawArtifactCode: `// State trong ứng dụng Client
const orderDraft = { productId: 101, quantity: 2, currency: "VND" };

// Quá trình Serialization sang chuỗi JSON
const serializedBody = JSON.stringify(orderDraft);`,
  },
  {
    id: 'api-request',
    order: 2,
    nameEn: '2. API Request (Network Transit)',
    nameVi: '2. Truyền tải API Request qua mạng',
    roleEn: 'HTTP / TCP / TLS Transport',
    summaryVi:
      'Yêu cầu được truyền qua kết nối mạng (thường là TCP kết hợp mã hóa TLS/HTTPS) dưới dạng luồng byte tuân thủ đặc tả giao thức.',
    internalWorkingsVi: [
      'Phân giải tên miền (DNS Resolution) và thiết lập bắt tay TCP + TLS Handshake.',
      'Đóng gói dòng đầu tiên (Request Line), danh sách Headers và phần thân (Request Body).',
      'Đảm bảo tính toàn vẹn dữ liệu trên đường truyền tới địa chỉ IP và cổng (Port) của máy chủ.',
    ],
    rawArtifactTitle: 'Raw HTTP/1.1 Request Wire Format',
    rawArtifactCode: `POST /api/v1/orders HTTP/1.1
Host: api.commerce-lab.edu.vn
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
Accept: application/json

{"productId":101,"quantity":2,"currency":"VND"}`,
  },
  {
    id: 'api-layer',
    order: 3,
    nameEn: '3. API Layer (Gateway & Validation)',
    nameVi: '3. Tầng API (Tiếp nhận & Kiểm tra hợp lệ)',
    roleEn: 'API Gateway / Router / Middleware',
    summaryVi:
      'Cửa ngõ của hệ thống Backend tiếp nhận gói tin, kiểm tra bảo mật, giới hạn tần suất (Rate Limiting) và xác thực cấu trúc dữ liệu (Schema Validation).',
    internalWorkingsVi: [
      'Xác thực danh tính (Authentication) qua API Key hoặc chữ ký JWT và kiểm tra quyền truy cập (Authorization).',
      'Giải tuần tự hóa (Deserialization) chuỗi JSON/XML thành cấu trúc dữ liệu mà ngôn ngữ lập trình hiểu được.',
      'Kiểm tra tính hợp lệ của kiểu dữ liệu (Schema Validation); từ chối ngay với mã 400 Bad Request hoặc 401 Unauthorized nếu sai.',
    ],
    rawArtifactTitle: 'Gateway Validation & Routing Log',
    rawArtifactCode: `[API-GATEWAY] Route matched: POST /api/v1/orders -> OrderController.create
[AUTH-MIDDLEWARE] JWT Signature verified (sub: "usr_9082", role: "buyer")
[SCHEMA-VALIDATOR] Payload valid against CreateOrderSchema`,
  },
  {
    id: 'server',
    order: 4,
    nameEn: '4. Server (Business Logic Execution)',
    nameVi: '4. Server xử lý Nghiệp vụ (Business Logic)',
    roleEn: 'Application Server / Domain Service',
    summaryVi:
      'Trái tim xử lý của ứng dụng: thực thi các quy tắc nghiệp vụ, tính toán giá trị, kiểm tra điều kiện tồn kho hoặc gọi sang dịch vụ nội bộ khác.',
    internalWorkingsVi: [
      'Kiểm tra quy tắc nghiệp vụ: Sản phẩm còn hàng không? Mã giảm giá có hợp lệ không?',
      'Tính toán tổng tiền, thuế VAT và khởi tạo mã định danh giao dịch duy nhất.',
      'Chuẩn bị câu lệnh truy vấn hoặc giao dịch (Transaction) để đọc/ghi xuống tầng lưu trữ.',
    ],
    rawArtifactTitle: 'Domain Service Execution',
    rawArtifactCode: `const unitPrice = 450000;
const totalAmount = unitPrice * payload.quantity; // 900,000 VND
if (inventory.available < payload.quantity) {
  throw new DomainError("INSUFFICIENT_STOCK", 409);
}`,
  },
  {
    id: 'database',
    order: 5,
    nameEn: '5. Database (Persistence & Query)',
    nameVi: '5. Tương tác Cơ sở dữ liệu (Database)',
    roleEn: 'PostgreSQL / Redis / Storage Engine',
    summaryVi:
      'Đọc hoặc ghi dữ liệu bền vững xuống ổ đĩa/bộ nhớ với các cam kết toàn vẹn dữ liệu (ACID Transaction).',
    internalWorkingsVi: [
      'Mở Transaction để trừ số lượng tồn kho và chèn bản ghi đơn hàng mới.',
      'Đảm bảo tính nguyên tử (Atomicity): Nếu một bước lỗi, toàn bộ thay đổi được Rollback.',
      'Trả về bản ghi vừa lưu kèm khóa chính (Primary Key) và dấu thời gian (Timestamp) cho Server.',
    ],
    rawArtifactTitle: 'SQL Transaction Execution',
    rawArtifactCode: `BEGIN TRANSACTION;
UPDATE products SET stock = stock - 2 WHERE id = 101 AND stock >= 2;
INSERT INTO orders (id, product_id, qty, total_vnd, status)
VALUES ('ORD-2026-889', 101, 2, 900000, 'CONFIRMED')
RETURNING id, created_at;
COMMIT;`,
  },
  {
    id: 'server-response',
    order: 6,
    nameEn: '6. Server Response (Generating Response)',
    nameVi: '6. Khởi tạo Phản hồi (Generating Response)',
    roleEn: 'Response Formatter & Serializer',
    summaryVi:
      'Server đóng gói kết quả xử lý thành cấu trúc DTO (Data Transfer Object), gán mã trạng thái HTTP phù hợp và tuần tự hóa thành JSON/XML.',
    internalWorkingsVi: [
      'Lọc bỏ các trường nhạy cảm nội bộ (như mật khẩu băm, khóa nội bộ).',
      'Chọn HTTP Status Code chuẩn xác (ví dụ: 201 Created khi tạo mới thành công).',
      'Serialize đối tượng phản hồi sang JSON và gắn Response Headers (Content-Type, Cache-Control).',
    ],
    rawArtifactTitle: 'Raw HTTP/1.1 Response Wire Format',
    rawArtifactCode: `HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
X-Request-Id: req_77a91c02

{
  "orderId": "ORD-2026-889",
  "status": "CONFIRMED",
  "totalAmount": 900000,
  "currency": "VND"
}`,
  },
  {
    id: 'client-receive',
    order: 7,
    nameEn: '7. Client (Deserializing & Rendering)',
    nameVi: '7. Client nhận & Cập nhật Giao diện',
    roleEn: 'Client State Manager & UI Renderer',
    summaryVi:
      'Client nhận gói tin phản hồi, kiểm tra Status Code, giải tuần tự hóa dữ liệu và cập nhật trạng thái giao diện cho người dùng.',
    internalWorkingsVi: [
      'Đọc HTTP Status Code (2xx = thành công, 4xx = lỗi phía Client, 5xx = lỗi phía Server).',
      'Giải tuần tự hóa (JSON.parse) chuỗi văn bản thành Object trong bộ nhớ Client.',
      'Cập nhật UI State để hiển thị thông báo đặt hàng thành công hoặc hướng dẫn sửa lỗi.',
    ],
    rawArtifactTitle: 'Client Response Handling',
    rawArtifactCode: `if (response.status === 201) {
  const data = await response.json();
  uiState.setNotification(\`Đặt hàng thành công: #\${data.orderId}\`);
}`,
  },
];

export const HTTP_METHODS_GUIDE: HttpMethodDetail[] = [
  {
    method: 'GET',
    purposeVi: 'Truy vấn và đọc biểu diễn của một hoặc danh sách tài nguyên (Resource). Không làm thay đổi trạng thái Server.',
    idempotent: true,
    safe: true,
    hasBody: false,
    exampleEndpoint: 'GET /api/products?category=books&limit=2',
    requestPayload: '(Không có Request Body — tham số truyền qua URL Path hoặc Query String)',
    responseStatus: '200 OK',
    responsePayload: `{
  "items": [
    { "id": 101, "name": "System Design Handbook", "price": 320000 },
    { "id": 102, "name": "Distributed Systems in Practice", "price": 410000 }
  ],
  "total": 2
}`,
  },
  {
    method: 'POST',
    purposeVi: 'Khởi tạo một tài nguyên mới trên Server hoặc kích hoạt một tiến trình xử lý nghiệp vụ.',
    idempotent: false,
    safe: false,
    hasBody: true,
    exampleEndpoint: 'POST /api/products',
    requestPayload: `{
  "name": "API Architecture Patterns",
  "price": 295000,
  "stock": 50
}`,
    responseStatus: '201 Created',
    responsePayload: `{
  "id": 103,
  "name": "API Architecture Patterns",
  "price": 295000,
  "stock": 50,
  "createdAt": "2026-11-19T08:00:00Z"
}`,
  },
  {
    method: 'PUT',
    purposeVi: 'Thay thế toàn bộ biểu diễn của một tài nguyên đã biết tại URI xác định. Gọi nhiều lần với cùng dữ liệu cho kết quả như nhau (Idempotent).',
    idempotent: true,
    safe: false,
    hasBody: true,
    exampleEndpoint: 'PUT /api/products/101',
    requestPayload: `{
  "name": "System Design Handbook (2nd Edition)",
  "price": 350000,
  "stock": 120
}`,
    responseStatus: '200 OK',
    responsePayload: `{
  "id": 101,
  "name": "System Design Handbook (2nd Edition)",
  "price": 350000,
  "stock": 120,
  "updatedAt": "2026-11-19T08:05:00Z"
}`,
  },
  {
    method: 'PATCH',
    purposeVi: 'Cập nhật một phần (Partial Update) các thuộc tính của tài nguyên mà không cần gửi lại toàn bộ đối tượng.',
    idempotent: false,
    safe: false,
    hasBody: true,
    exampleEndpoint: 'PATCH /api/products/101',
    requestPayload: `{
  "price": 299000
}`,
    responseStatus: '200 OK',
    responsePayload: `{
  "id": 101,
  "name": "System Design Handbook (2nd Edition)",
  "price": 299000,
  "stock": 120
}`,
  },
  {
    method: 'DELETE',
    purposeVi: 'Xóa tài nguyên được định danh bởi URI khỏi hệ thống.',
    idempotent: true,
    safe: false,
    hasBody: false,
    exampleEndpoint: 'DELETE /api/products/101',
    requestPayload: '(Không yêu cầu Request Body)',
    responseStatus: '200 OK (hoặc 204 No Content)',
    responsePayload: `{
  "deleted": true,
  "resourceId": 101
}`,
  },
];

export const HTTP_STATUS_CATEGORIES: StatusCodeCategory[] = [
  {
    range: '1xx',
    titleEn: 'Informational & Protocol Switching',
    titleVi: 'Thông tin & Chuyển đổi giao thức',
    colorClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
    codes: [
      {
        code: 101,
        text: 'Switching Protocols',
        meaningVi: 'Server đồng ý nâng cấp kết nối theo yêu cầu trong Header Upgrade của Client.',
        scenarioVi: 'Bước bắt tay nâng cấp từ HTTP/1.1 lên kết nối WebSocket bền vững.',
      },
    ],
  },
  {
    range: '2xx',
    titleEn: 'Success',
    titleVi: 'Thành công',
    colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
    codes: [
      {
        code: 200,
        text: 'OK',
        meaningVi: 'Yêu cầu được xử lý thành công và dữ liệu phản hồi nằm trong Response Body.',
        scenarioVi: 'Truy vấn GET danh sách sản phẩm hoặc cập nhật PATCH thành công.',
      },
      {
        code: 201,
        text: 'Created',
        meaningVi: 'Một tài nguyên mới đã được khởi tạo thành công trên Server.',
        scenarioVi: 'Sau khi gọi POST /api/products để thêm sản phẩm mới.',
      },
      {
        code: 204,
        text: 'No Content',
        meaningVi: 'Xử lý thành công nhưng Server không trả về nội dung trong phần thân.',
        scenarioVi: 'Sau khi gọi DELETE xóa tài nguyên hoặc lưu cấu hình.',
      },
    ],
  },
  {
    range: '4xx',
    titleEn: 'Client Error',
    titleVi: 'Lỗi từ phía Client',
    colorClass: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
    codes: [
      {
        code: 400,
        text: 'Bad Request',
        meaningVi: 'Cú pháp JSON/XML lỗi hoặc dữ liệu không vượt qua kiểm tra Schema Validation.',
        scenarioVi: 'Client gửi trường "price" là chuỗi chữ thay vì số dương.',
      },
      {
        code: 401,
        text: 'Unauthorized',
        meaningVi: 'Chưa xác thực danh tính (thiếu Token, API Key sai hoặc Token đã hết hạn).',
        scenarioVi: 'Gọi API bảo mật mà quên đính kèm Header Authorization.',
      },
      {
        code: 403,
        text: 'Forbidden',
        meaningVi: 'Đã xác thực danh tính nhưng tài khoản không đủ quyền (Authorization) truy cập tài nguyên này.',
        scenarioVi: 'Tài khoản Sinh viên gọi endpoint DELETE /api/courses chỉ dành cho Admin.',
      },
      {
        code: 404,
        text: 'Not Found',
        meaningVi: 'Không tìm thấy tài nguyên hoặc URI Endpoint không tồn tại.',
        scenarioVi: 'Truy vấn GET /api/products/999999 khi mã sản phẩm không có trong DB.',
      },
      {
        code: 429,
        text: 'Too Many Requests',
        meaningVi: 'Client gửi quá nhiều yêu cầu vượt ngưỡng Rate Limiting trong một khung thời gian.',
        scenarioVi: 'Vượt ngưỡng 100 requests/phút trên cổng API Gateway.',
      },
    ],
  },
  {
    range: '5xx',
    titleEn: 'Server Error',
    titleVi: 'Lỗi từ phía Server',
    colorClass: 'text-rose-400 border-rose-500/30 bg-rose-950/30',
    codes: [
      {
        code: 500,
        text: 'Internal Server Error',
        meaningVi: 'Lỗi ngoại lệ không lường trước trong mã nguồn Server hoặc truy vấn DB thất bại.',
        scenarioVi: 'Kết nối Database bị đứt đột ngột khi đang thực thi câu lệnh SQL.',
      },
      {
        code: 502,
        text: 'Bad Gateway',
        meaningVi: 'API Gateway hoặc Reverse Proxy nhận được phản hồi không hợp lệ từ Upstream Service.',
        scenarioVi: 'Microservice phía sau bị treo khiến Gateway không đọc được phản hồi.',
      },
      {
        code: 503,
        text: 'Service Unavailable',
        meaningVi: 'Server tạm thời quá tải hoặc đang bảo trì.',
        scenarioVi: 'Hệ thống đang nâng cấp hoặc kích hoạt Circuit Breaker.',
      },
    ],
  },
];

export const DATA_FORMATS_COMPARISON = [
  {
    id: 'json',
    name: 'JSON (JavaScript Object Notation)',
    usedBy: 'REST, GraphQL, Webhook, WebSocket, WebRTC Signaling (SDP Wrapper)',
    characteristicsVi:
      'Định dạng văn bản nhẹ, dễ đọc với con người, hỗ trợ trực tiếp bởi mọi ngôn ngữ lập trình và trình duyệt web.',
    serializationNoteVi:
      'Quá trình Serialization chuyển Object trong RAM thành chuỗi UTF-8; Deserialization (JSON.parse) khôi phục lại cấu trúc Key-Value.',
    sample: `{
  "studentId": "SV-2026-01",
  "fullName": "Nguyễn Minh Quân",
  "gpa": 3.75,
  "active": true,
  "courses": ["CS101", "DS204"]
}`,
    byteSizeEstimate: '138 bytes (Text UTF-8)',
  },
  {
    id: 'xml',
    name: 'XML (eXtensible Markup Language)',
    usedBy: 'SOAP API, Enterprise Integration (WSDL / XSD)',
    characteristicsVi:
      'Ngôn ngữ đánh dấu thẻ đóng-mở nghiêm ngặt, hỗ trợ Namespaces (xmlns), thuộc tính thẻ và kiểm tra kiểu dữ liệu chặt chẽ qua XML Schema (XSD).',
    serializationNoteVi:
      'Chiếm dung lượng lớn hơn JSON do lặp lại thẻ đóng/mở, nhưng cung cấp khả năng xác thực cấu trúc tài liệu cấp doanh nghiệp.',
    sample: `<Student xmlns="http://university.edu.vn/schema">
  <StudentId>SV-2026-01</StudentId>
  <FullName>Nguyễn Minh Quân</FullName>
  <Gpa>3.75</Gpa>
  <Active>true</Active>
  <Courses>
    <CourseCode>CS101</CourseCode>
    <CourseCode>DS204</CourseCode>
  </Courses>
</Student>`,
    byteSizeEstimate: '268 bytes (Verbose XML Tree)',
  },
  {
    id: 'protobuf',
    name: 'Protocol Buffers (Protobuf Binary)',
    usedBy: 'gRPC API, High-Throughput Microservices',
    characteristicsVi:
      'Định dạng tuần tự hóa nhị phân (Binary Serialization). Không truyền tên trường ("studentId") qua mạng mà chỉ truyền số thứ tự trường (Field Tag 1, 2, 3...) kèm kiểu dây (Wire Type).',
    serializationNoteVi:
      'Kích thước gói tin nhỏ hơn 3–5 lần và tốc độ parse nhanh hơn nhiều lần so với JSON/XML, nhưng cần file hợp đồng .proto để giải mã.',
    sample: `// Định nghĩa trong student.proto:
message Student {
  string student_id = 1;
  string full_name = 2;
  double gpa = 3;
  bool active = 4;
  repeated string courses = 5;
}

// Dữ liệu trên đường truyền (Conceptual Hex Stream):
// [Tag 1: 0x0A] [Len: 0x0A] "SV-2026-01" [Tag 3: 0x19] [IEEE754: 3.75] ...`,
    byteSizeEstimate: '~46 bytes (Compact Binary Frame)',
  },
];

export const AUTH_MECHANISMS: AuthMechanismDetail[] = [
  {
    id: 'api-key',
    nameEn: 'API Key',
    titleVi: 'Khóa định danh ứng dụng (API Key)',
    mechanismVi:
      'Một chuỗi bí mật tĩnh được cấp cho ứng dụng Client. Client đính kèm khóa này vào Header (ví dụ: X-API-Key) để Server nhận diện dự án nào đang gọi và tính hạn ngạch (Quota).',
    headerExample: 'X-API-Key: ak_live_9918273645abcdef0123',
    prosVi: [
      'Cực kỳ đơn giản để tích hợp cho giao tiếp Server-to-Server.',
      'Dễ dàng theo dõi lưu lượng (Rate Limiting) và thu hồi khóa khi cần.',
    ],
    consVi: [
      'Không mang thông tin phiên đăng nhập hay quyền chi tiết của từng người dùng cuối.',
      'Nếu lộ trên mã nguồn Frontend (Browser), kẻ tấn công có thể mạo danh toàn bộ ứng dụng.',
    ],
    bestUseCaseVi: 'Kết nối dịch vụ bên thứ ba (Stripe, SendGrid, Google Maps Server SDK) từ Backend.',
  },
  {
    id: 'bearer-token',
    nameEn: 'Bearer Token',
    titleVi: 'Mã thông báo người mang (Opaque Bearer Token)',
    mechanismVi:
      'Sau khi người dùng đăng nhập, Server sinh ra một chuỗi ngẫu nhiên lưu trong Database/Redis và trả về cho Client. Ai cầm ("bear") token này trong Header Authorization sẽ được cấp quyền tương ứng.',
    headerExample: 'Authorization: Bearer tok_9f8e7d6c5b4a3210987654',
    prosVi: [
      'Có thể thu hồi (Revoke) ngay lập tức bằng cách xóa token trong Redis/Database.',
      'Không làm lộ bất kỳ dữ liệu nội bộ nào trong chuỗi token.',
    ],
    consVi: [
      'Mỗi request tới API đều bắt buộc phải tra cứu (Lookup) vào Database hoặc Redis để kiểm tra hiệu lực.',
    ],
    bestUseCaseVi: 'Hệ thống Monolith hoặc cổng API yêu cầu khả năng đăng xuất/khóa phiên tức thời.',
  },
  {
    id: 'jwt',
    nameEn: 'JWT (JSON Web Token)',
    titleVi: 'Token tự chứa có chữ ký số (Stateless JWT)',
    mechanismVi:
      'Bao gồm 3 phần ngăn cách bởi dấu chấm: Header.Payload.Signature (mã hóa Base64Url). Server dùng khóa bí mật hoặc cặp khóa RSA/ECDSA để kiểm tra chữ ký mà không cần truy vấn Database.',
    headerExample:
      'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzk1MDk0NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    prosVi: [
      'Stateless hoàn toàn: Các Microservices có thể tự xác thực chữ ký độc lập với tốc độ cao.',
      'Payload chứa sẵn thông tin Claims (userId, role, exp) giúp phân quyền nhanh.',
    ],
    consVi: [
      'Khó thu hồi trước thời hạn hết hạn (exp) nếu không dựng thêm danh sách đen (Token Blacklist).',
      'Payload chỉ được Base64Url encode chứ KHÔNG được mã hóa ẩn, không được nhét mật khẩu vào trong.',
    ],
    bestUseCaseVi: 'Kiến trúc Microservices và hệ thống phân tán cần xác thực Stateless qua API Gateway.',
  },
  {
    id: 'oauth2',
    nameEn: 'OAuth 2.0',
    titleVi: 'Khung ủy quyền truy cập (OAuth 2.0 Authorization Framework)',
    mechanismVi:
      'Cho phép người dùng cấp quyền có giới hạn (Scopes) cho một ứng dụng bên thứ ba truy cập tài nguyên của họ trên một hệ thống khác mà không cần chia sẻ mật khẩu gốc (thông qua Authorization Code Flow & Access Token).',
    headerExample:
      'POST /oauth/token (grant_type=authorization_code) -> Nhận Access Token với scope="read:profile write:calendar"',
    prosVi: [
      'Tiêu chuẩn công nghiệp cho ủy quyền bên thứ ba với phân quyền chi tiết theo Scope.',
      'Tách biệt rõ ràng giữa Authorization Server (cấp quyền) và Resource Server (chứa API).',
    ],
    consVi: [
      'Luồng bắt tay nhiều bước (Redirect, Authorization Code, PKCE, Refresh Token) phức tạp hơn API Key.',
    ],
    bestUseCaseVi: 'Hệ sinh thái mở ("Đăng nhập và đồng bộ lịch với Google / GitHub") và Enterprise SSO.',
  },
];
