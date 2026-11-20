import { QuizQuestion, ApiTechnologyId } from '@/types/api';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==========================================================================
  // REST API QUESTIONS
  // ==========================================================================
  {
    id: 'q-rest-1',
    moduleId: 'rest',
    type: 'multiple-choice',
    questionVi:
      'Trong kiến trúc REST, đặc tính "Stateless" (Phi trạng thái) có ý nghĩa chính xác là gì?',
    options: [
      {
        id: 'a',
        textVi:
          'Server không lưu giữ ngữ cảnh phiên làm việc (Session Context) của Client trong bộ nhớ giữa các Request; mỗi Request gửi lên phải tự chứa đầy đủ thông tin để xác thực và xử lý.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'Hệ thống Backend không được phép sử dụng Cơ sở dữ liệu (Database) để lưu dữ liệu.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Ứng dụng Client không được phép có chức năng đăng nhập tài khoản.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Mọi Request đều phải sử dụng phương thức HTTP GET.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Stateless trong REST quy định rằng Server không giữ Session State của Client giữa hai lần gọi. Nhờ mỗi Request tự mang đủ thông tin (ví dụ: JWT trong Header Authorization), bất kỳ instance Server nào đứng sau Load Balancer cũng xử lý được yêu cầu.',
    recommendationVi: 'Ôn lại mục Core Concepts: Stateless Communication trong Module 1 (REST API).',
  },
  {
    id: 'q-rest-2',
    moduleId: 'rest',
    type: 'technical-understanding',
    questionVi:
      'Bạn gửi yêu cầu cập nhật riêng trường giá (price) của sản phẩm có ID 101 mà không muốn gửi lại toàn bộ 20 thuộc tính khác của sản phẩm. Tổ hợp HTTP Method + Endpoint và Status Code phản hồi nào chuẩn REST nhất?',
    codeContext: `Payload gửi đi:\n{ "price": 2290000 }`,
    options: [
      {
        id: 'a',
        textVi: 'POST /api/updateProductPrice?id=101 → 200 OK',
        isCorrect: false,
      },
      {
        id: 'b',
        textVi: 'PATCH /api/products/101 → 200 OK',
        isCorrect: true,
      },
      {
        id: 'c',
        textVi: 'PUT /api/products → 201 Created',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'GET /api/products/101/setPrice → 204 No Content',
        isCorrect: false,
      },
    ],
    explanationVi:
      'PATCH được thiết kế chuyên biệt cho cập nhật một phần (Partial Update) tài nguyên tại URI định danh (/api/products/101), trong khi PUT yêu cầu thay thế toàn bộ biểu diễn của tài nguyên.',
    recommendationVi: 'Thực hành thử thao tác PATCH /api/products/101 ngay trong REST Playground.',
  },

  // ==========================================================================
  // SOAP API QUESTIONS
  // ==========================================================================
  {
    id: 'q-soap-1',
    moduleId: 'soap',
    type: 'multiple-choice',
    questionVi:
      'Trong một bức điện SOAP XML, thành phần nào bắt buộc phải có mặt và chứa tên thao tác nghiệp vụ hoặc thông tin lỗi <soap:Fault>?',
    options: [
      {
        id: 'a',
        textVi: '<soap:Header>',
        isCorrect: false,
      },
      {
        id: 'b',
        textVi: '<soap:Body> nằm bên trong <soap:Envelope>',
        isCorrect: true,
      },
      {
        id: 'c',
        textVi: '<wsdl:Definitions>',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'HTTP Query String',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Mọi bức điện SOAP bắt buộc có phần tử gốc <soap:Envelope> và phần tử con <soap:Body> (chứa Payload nghiệp vụ hoặc khối báo lỗi <soap:Fault>). Phần <soap:Header> là tùy chọn.',
    recommendationVi: 'Xem cấu trúc cây XML trong SOAP Banking Playground (Module 2).',
  },
  {
    id: 'q-soap-2',
    moduleId: 'soap',
    type: 'scenario-based',
    questionVi:
      'Một tập đoàn ngân hàng yêu cầu tích hợp hệ thống thanh toán liên ngân hàng với điều kiện: hợp đồng kiểu dữ liệu phải kiểm tra bằng XML Schema (XSD), hỗ trợ chữ ký số ở cấp độ từng phần tử thông điệp (WS-Security) khi đi qua nhiều trạm trung gian và hỗ trợ giao dịch phân tán hai pha. Công nghệ nào đáp ứng trực tiếp yêu cầu này?',
    options: [
      {
        id: 'a',
        textVi: 'SOAP API (kết hợp WSDL & WS-Security)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'WebSocket API',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Webhook thuần túy',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'OpenAPI Specification (chạy độc lập không cần Server)',
        isCorrect: false,
      },
    ],
    explanationVi:
      'SOAP được trang bị bộ tiêu chuẩn doanh nghiệp WS-* (WS-Security, WS-AtomicTransaction) và hợp đồng WSDL/XSD giúp bảo mật ở cấp độ bản thân bức điện XML thay vì chỉ dựa vào kết nối TLS điểm-tới-điểm.',
    recommendationVi: 'Xem Kịch bản 5: Enterprise Integration trong mục Kiến trúc Thực tế.',
  },

  // ==========================================================================
  // GRAPHQL API QUESTIONS
  // ==========================================================================
  {
    id: 'q-graphql-1',
    moduleId: 'graphql',
    type: 'technical-understanding',
    questionVi:
      'Hiện tượng gì xảy ra trên GraphQL Server khi Client gửi câu truy vấn chỉ yêu cầu 2 trường "id" và "fullName" của kiểu Student (mà KHÔNG yêu cầu trường "courses" hay "department")?',
    codeContext: `query {\n  student(id: "SV-101") {\n    id\n    fullName\n  }\n}`,
    options: [
      {
        id: 'a',
        textVi:
          'GraphQL Server chỉ kích hoạt Resolver của Query.student để lấy id và fullName; các Resolver của department và courses hoàn toàn KHÔNG bị gọi.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi:
          'Server vẫn phải truy vấn toàn bộ các bảng courses và department rồi mới xóa bớt ở bước cuối.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Server báo lỗi vì Client không lấy hết các trường trong Schema.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Client phải gọi thêm 2 REST requests phụ mới nhận được kết quả.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'GraphQL thực thi theo cây Resolver dựa trên AST của câu Query. Trường nào không xuất hiện trong Query thì hàm Resolver của trường đó không được kích hoạt, giúp tránh lãng phí cả băng thông mạng lẫn tài nguyên truy vấn nguồn dữ liệu.',
    recommendationVi: 'Bật/tắt các checkbox trường dữ liệu trong GraphQL Playground (Module 3) để quan sát danh sách Resolvers được kích hoạt.',
  },
  {
    id: 'q-graphql-2',
    moduleId: 'graphql',
    type: 'scenario-based',
    questionVi:
      'Bạn đang xây dựng ứng dụng quản lý đào tạo có cả bản Web Dashboard (cần 25 trường thông tin sinh viên, khoa, môn học, điểm số) và ứng dụng Smartwatch/Mobile (chỉ cần 3 trường: tên, GPA, phòng học tiếp theo) trên mạng di động yếu. Công nghệ nào giúp đội Frontend tự chủ lấy đúng dữ liệu cần thiết trong 1 lần gọi mà Backend không phải viết hàng chục endpoints riêng lẻ?',
    options: [
      {
        id: 'a',
        textVi: 'GraphQL API',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'SOAP API',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Webhook',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'OpenAPI Specification',
        isCorrect: false,
      },
    ],
    explanationVi:
      'GraphQL giải quyết hoàn hảo bài toán Over-fetching và Under-fetching cho các hệ thống đa giao diện (Web, Mobile, Wearable) thông qua cơ chế truy vấn khai báo theo trường (Declarative Field Selection).',
    recommendationVi: 'Xem Kịch bản 4: Data Aggregation Platform trong mục Kiến trúc Thực tế.',
  },

  // ==========================================================================
  // gRPC API QUESTIONS
  // ==========================================================================
  {
    id: 'q-grpc-1',
    moduleId: 'grpc',
    type: 'technical-understanding',
    questionVi:
      'Tại sao gói tin Protocol Buffers (Protobuf) trong gRPC lại có kích thước nhỏ hơn và tốc độ tuần tự hóa nhanh hơn đáng kể so với văn bản JSON?',
    codeContext: `message PaymentRequest {\n  string order_id = 1;\n  int64 amount_vnd = 2;\n}`,
    options: [
      {
        id: 'a',
        textVi:
          'Vì Protobuf tuần tự hóa dữ liệu sang định dạng nhị phân (Binary), thay thế chuỗi tên trường dài dòng ("order_id", "amount_vnd") bằng các byte số thứ tự trường (Field Tag 1, 2) kèm kiểu dây (Wire Type) và nén số nguyên bằng Varint.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'Vì gRPC tự động bỏ bớt một nửa dữ liệu trong gói tin khi truyền qua mạng.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Vì Protobuf lưu dữ liệu dưới dạng thẻ XML viết tắt.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Vì gRPC không cần sử dụng tầng giao vận TCP.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Nhờ cả Client và Server đều đã biên dịch file hợp đồng .proto, trên đường truyền mạng Protobuf chỉ cần gửi Field Tag (ví dụ: Tag 1, Tag 2) và byte giá trị nhị phân, loại bỏ hoàn toàn chi phí lặp lại tên khóa văn bản và dấu ngoặc của JSON.',
    recommendationVi: 'Quan sát khung Hex Wire Format trong gRPC Playground (Module 4).',
  },
  {
    id: 'q-grpc-2',
    moduleId: 'grpc',
    type: 'scenario-based',
    questionVi:
      'Trong kiến trúc Microservices của sàn thương mại điện tử, Order Service cần gọi sang Payment Service và Inventory Service hàng chục ngàn lần mỗi giây ở mạng nội bộ (East-West Traffic) với yêu cầu độ trễ dưới 3ms, định kiểu chặt chẽ xuyên ngôn ngữ (Go, Java, Python) và hỗ trợ Streaming hai chiều. Đâu là lựa chọn tối ưu nhất?',
    options: [
      {
        id: 'a',
        textVi: 'gRPC API (trên nền HTTP/2 và Protocol Buffers)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'SOAP XML qua HTTP/1.1',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'HTTP Short Polling',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'OpenAPI YAML',
        isCorrect: false,
      },
    ],
    explanationVi:
      'gRPC là tiêu chuẩn công nghiệp cho giao tiếp nội bộ giữa các Microservices nhờ hiệu năng nhị phân Protobuf, đa hợp luồng HTTP/2 và khả năng sinh Client Stub tự động cho đa ngôn ngữ.',
    recommendationVi: 'Xem Module 4 (gRPC API) và Kịch bản 3 (Microservices Architecture).',
  },

  // ==========================================================================
  // WEBSOCKET API QUESTIONS
  // ==========================================================================
  {
    id: 'q-websocket-1',
    moduleId: 'websocket',
    type: 'scenario-based',
    questionVi:
      'Bạn đang xây dựng một ứng dụng Chat thời gian thực (Real-time Chat) nơi tin nhắn phải được chuyển phát ngay lập tức giữa những người dùng đang kết nối với độ trễ mili-giây. Công nghệ nào phù hợp nhất?',
    options: [
      {
        id: 'a',
        textVi: 'WebSocket API (Persistent, Full-Duplex Connection)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'REST API với HTTP Short Polling mỗi 10 giây',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'SOAP API với WSDL',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'OpenAPI Specification',
        isCorrect: false,
      },
    ],
    explanationVi:
      'WebSocket cung cấp kênh kết nối TCP bền vững và song công toàn phần (Full-Duplex) sau bước bắt tay HTTP 101, cho phép Server đẩy tin nhắn xuống mọi Client đang kết nối ngay lập tức mà không cần đợi Client gửi Request hỏi.',
    recommendationVi: 'Trải nghiệm mô phỏng 2 Client chat trực tiếp trong WebSocket Playground (Module 5).',
  },
  {
    id: 'q-websocket-2',
    moduleId: 'websocket',
    type: 'technical-understanding',
    questionVi:
      'Quá trình thiết lập kết nối WebSocket khởi đầu như thế nào ở tầng giao thức?',
    options: [
      {
        id: 'a',
        textVi:
          'Bắt đầu bằng một HTTP/1.1 GET Request kèm Header "Upgrade: websocket" và "Connection: Upgrade"; nếu thành công Server trả về mã "101 Switching Protocols".',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'Gửi một bức điện SOAP Envelope qua giao thức UDP.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Gọi hàm POST /graphql với từ khóa subscription.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Mở cổng FTP riêng biệt mà không đi qua cổng 80/443.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Theo RFC 6455, WebSocket tương thích với hạ tầng Web hiện có bằng cách tận dụng HTTP Upgrade Handshake trên cổng 80/443, sau khi nhận phản hồi 101 Switching Protocols mới chuyển sang truyền khung nhị phân/văn bản WebSocket.',
    recommendationVi: 'Xem log Handshake 101 trong WebSocket Playground (Module 5).',
  },

  // ==========================================================================
  // WEBHOOK QUESTIONS
  // ==========================================================================
  {
    id: 'q-webhook-1',
    moduleId: 'webhook',
    type: 'technical-understanding',
    questionVi:
      'Vì sao Endpoint nhận Webhook của bạn bắt buộc phải kiểm tra chữ ký HMAC (ví dụ: X-Webhook-Signature) VÀ xử lý tính Lũy đẳng (Idempotency) theo event.id?',
    options: [
      {
        id: 'a',
        textVi:
          'Kiểm tra chữ ký HMAC để chống kẻ gian gửi HTTP POST giả mạo sự kiện thanh toán; kiểm tra Idempotency vì nhà cung cấp có cơ chế tự động Retry nên cùng một sự kiện có thể được gửi tới hơn 1 lần.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'Để nâng cấp kết nối HTTP lên WebSocket 101 Switching Protocols.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Để nén gói tin JSON thành nhị phân Protocol Buffers.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Vì giao thức HTTP không cho phép gửi JSON nếu không có HMAC.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Callback URL của Webhook là một địa chỉ công khai nên phải xác thực chữ ký HMAC-SHA256 để đảm bảo gói tin đến từ đúng nhà cung cấp. Đồng thời cơ chế At-least-once Delivery (Retry khi mạng chập chờn) đòi hỏi Consumer phải lọc trùng theo event.id.',
    recommendationVi: 'Bật thử chế độ "Giả mạo chữ ký" và "Giả lập lỗi 500 & Retry" trong Webhook Playground (Module 6).',
  },
  {
    id: 'q-webhook-2',
    moduleId: 'webhook',
    type: 'scenario-based',
    questionVi:
      'Hệ thống E-Commerce của bạn tích hợp với cổng thanh toán Stripe/VNPay. Sau khi khách hàng chuyển khoản xong trên trang ngân hàng, cổng thanh toán cần báo kết quả về cho Backend của bạn ngay lập tức mà Backend của bạn không phải chạy vòng lặp hỏi (Polling) liên tục. Cơ chế nào được thiết kế cho bài toán này?',
    options: [
      {
        id: 'a',
        textVi: 'Webhook (Event-driven HTTP POST Callback)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'GraphQL Schema Introspection',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'OpenAPI Code Generator',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'REST GET Polling mỗi 500ms',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Webhook đảo ngược luồng gọi: Cổng thanh toán (Event Producer) chủ động gửi HTTP POST chứa payload payment.success tới Callback URL trên Backend của bạn ngay khi giao dịch hoàn tất.',
    recommendationVi: 'Xem Kịch bản 1: E-commerce Platform trong mục Kiến trúc Thực tế.',
  },

  // ==========================================================================
  // WEBRTC API QUESTIONS
  // ==========================================================================
  {
    id: 'q-webrtc-1',
    moduleId: 'webrtc',
    type: 'technical-understanding',
    questionVi:
      'Tại sao một ứng dụng WebRTC (vốn truyền Video/Audio trực tiếp Peer-to-Peer qua UDP) vẫn BẮT BUỘC phải sử dụng một Signaling Server (thường viết bằng WebSocket) và hệ thống STUN/TURN?',
    options: [
      {
        id: 'a',
        textVi:
          'Vì hai trình duyệt không thể tự biết địa chỉ của nhau: Cần Signaling Server để trao đổi bản mô tả phiên (SDP Offer/Answer), cần STUN để khám phá địa chỉ IP/Port công cộng phía sau Router NAT, và cần TURN để chuyển tiếp gói tin nếu tường lửa Symmetric NAT chặn kết nối P2P trực tiếp.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi:
          'Vì WebRTC chỉ có thể truyền dữ liệu dưới dạng bức điện XML SOAP qua máy chủ STUN.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi:
          'Vì STUN Server dùng để lưu trữ cơ sở dữ liệu SQL của ứng dụng.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi:
          'Vì trình duyệt Web không hỗ trợ giao thức UDP nếu không cài thêm Flash Player.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Quá trình kết nối WebRTC gồm 2 pha: Pha bắt tay ban đầu bắt buộc dùng Signaling Server (WebSocket/REST) để trao đổi SDP (Codecs, khóa DTLS) cùng các ứng viên mạng ICE (thu thập qua STUN/TURN); sau khi đục lỗ NAT thành công, pha truyền tải Media (SRTP) và DataChannel (SCTP) mới chảy trực tiếp P2P qua UDP.',
    recommendationVi: 'Thử chuyển đổi giữa 3 địa hình mạng (LAN Host, Cone NAT STUN, Symmetric Firewall TURN) trong WebRTC Playground (Module 7).',
  },
  {
    id: 'q-webrtc-2',
    moduleId: 'webrtc',
    type: 'scenario-based',
    questionVi:
      'Bạn đang xây dựng nền tảng Khám bệnh Từ xa (Telehealth) yêu cầu truyền hình ảnh Video 1080p, âm thanh hai chiều giữa Bác sĩ và Bệnh nhân với độ trễ dưới 25ms, kèm theo kênh truyền trực tiếp chỉ số cảm biến nhịp tim mà không làm nghẽn băng thông máy chủ trung tâm. Công nghệ nào là lựa chọn chuẩn xác nhất?',
    options: [
      {
        id: 'a',
        textVi:
          'WebRTC API (RTCPeerConnection cho luồng SRTP Video/Audio + RTCDataChannel cho luồng cảm biến P2P, kết hợp WebSocket làm Signaling)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'SOAP API qua HTTP/1.1',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'REST API với phương thức GET Polling mỗi giây',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Webhook một chiều',
        isCorrect: false,
      },
    ],
    explanationVi:
      'WebRTC là công nghệ Web duy nhất hỗ trợ truyền tải luồng Media (SRTP) và dữ liệu tùy ý (RTCDataChannel/SCTP) trực tiếp trình duyệt-tới-trình duyệt trên nền giao thức UDP, loại bỏ hiện tượng nghẽn đầu hàng (TCP Head-of-Line Blocking) và giải phóng băng thông cho máy chủ.',
    recommendationVi: 'Xem Kịch bản 6: Telehealth & Real-Time Video Consultation Platform trong mục Kiến trúc Thực tế (/scenarios).',
  },

  // ==========================================================================
  // COMPREHENSIVE & ARCHITECTURE COEXISTENCE QUESTIONS
  // ==========================================================================
  {
    id: 'q-comp-1',
    moduleId: 'comprehensive',
    type: 'scenario-based',
    questionVi:
      'Trong một nền tảng Thương mại điện tử & Tư vấn trực tuyến quy mô lớn, các công nghệ API có thể cùng tồn tại (Coexist) và phối hợp với nhau như thế nào là hợp lý nhất về mặt kiến trúc?',
    options: [
      {
        id: 'a',
        textVi:
          'Dùng REST/GraphQL cho thao tác sản phẩm & đơn hàng; dùng gRPC cho giao tiếp tốc độ cao giữa các Microservices nội bộ; dùng Webhook để nhận thông báo từ cổng thanh toán; dùng WebSocket cho thông báo đẩy & báo hiệu (Signaling); và dùng WebRTC cho cuộc gọi Video tư vấn trực tiếp P2P.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi:
          'Bắt buộc chỉ được chọn duy nhất 1 trong 7 công nghệ cho toàn bộ hệ thống vì chúng xung đột nhau.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi:
          'Dùng SOAP XML để truyền luồng video 60fps giữa hai trình duyệt và dùng WebRTC để truy vấn bảng SQL.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi:
          'Dùng Webhook để gọi trực tiếp vào trình duyệt người dùng cuối mà không cần máy chủ.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Không có công nghệ nào là "viên đạn bạc" cho mọi bài toán. Kiến trúc phần mềm hiện đại luôn phối hợp đúng công cụ cho đúng tầng: REST/GraphQL ở biên ứng dụng, gRPC ở lõi Microservices, Webhook cho sự kiện liên hệ thống, WebSocket cho kết nối hai chiều với Server và WebRTC cho truyền thông Media/Data ngang hàng P2P.',
    recommendationVi: 'Khám phá Sơ đồ Cộng sinh Công nghệ trong Trung tâm So sánh (/comparison).',
  },
];

export function getQuestionsByModule(
  moduleId: ApiTechnologyId | 'all'
): QuizQuestion[] {
  if (moduleId === 'all') return QUIZ_QUESTIONS;
  return QUIZ_QUESTIONS.filter((q) => q.moduleId === moduleId);
}
