import { RealWorldScenario } from '@/types/api';

export const REAL_WORLD_SCENARIOS: RealWorldScenario[] = [
  // ==========================================================================
  // SCENARIO 1: E-COMMERCE PLATFORM (REST + WEBHOOK + OPENAPI COEXISTENCE)
  // ==========================================================================
  {
    id: 'ecommerce-platform',
    number: 1,
    titleEn: 'Scenario 1: E-Commerce Platform',
    titleVi: 'Kịch bản 1: Nền tảng Thương mại Điện tử (Sự cộng sinh REST + Webhook + OpenAPI)',
    subtitleVi:
      'Kết hợp REST cho quản lý sản phẩm/đơn hàng, OpenAPI để chuẩn hóa hợp đồng tài liệu và Webhook để nhận thông báo thanh toán bất đồng bộ.',
    technologies: ['rest', 'webhook', 'openapi'],
    businessProblemVi:
      'Một sàn thương mại điện tử cần cung cấp API lấy danh sách sản phẩm và tạo đơn hàng cho cả Web và Mobile App (đòi hỏi tài liệu đồng bộ cho đội Frontend), đồng thời tích hợp với cổng thanh toán ngân hàng bên ngoài vốn cần vài phút để khách hàng quét mã QR chuyển khoản.',
    whyTheseTechnologiesVi: [
      {
        techId: 'rest',
        reasonVi:
          'Xử lý hoàn hảo các thao tác CRUD đồng bộ (GET /api/products, POST /api/orders) từ trình duyệt và tận dụng được HTTP Caching cho trang danh mục.',
      },
      {
        techId: 'openapi',
        reasonVi:
          'Đóng vai trò hợp đồng (openapi.yaml) mô tả toàn bộ các REST Endpoints, giúp tự động sinh tài liệu Swagger UI, kiểm tra Schema ở API Gateway và sinh TypeScript SDK cho đội Frontend.',
      },
      {
        techId: 'webhook',
        reasonVi:
          'Giải quyết bài toán thanh toán bất đồng bộ: Thay vì Backend phải gọi hỏi ngân hàng mỗi giây (Polling), cổng thanh toán tự động bắn HTTP POST (payment.success) về Callback URL của sàn ngay khi khách trả tiền xong.',
      },
    ],
    nodes: [
      {
        id: 'ec-spec',
        name: 'OpenAPI 3.0 Contract',
        role: 'Blueprint & Validator',
        techUsed: 'OpenAPI Specification',
        descriptionVi: 'Mô tả Schema cho /products và /orders; cấu hình bộ lọc kiểm tra hợp lệ trên Gateway.',
      },
      {
        id: 'ec-client',
        name: 'Web & Mobile Storefront',
        role: 'Customer Interface',
        techUsed: 'REST Client (Auto-generated SDK)',
        descriptionVi: 'Duyệt danh mục sản phẩm và gửi yêu cầu tạo đơn hàng mới.',
      },
      {
        id: 'ec-api',
        name: 'E-Commerce Order Backend',
        role: 'Core Application Server',
        techUsed: 'REST API + Webhook Receiver',
        descriptionVi: 'Cung cấp REST Endpoints cho khách hàng và mở Callback URL /webhooks/payment chờ cổng thanh toán.',
      },
      {
        id: 'ec-pay',
        name: 'Payment Gateway (Stripe/VNPay)',
        role: 'External Event Producer',
        techUsed: 'Webhook Dispatcher',
        descriptionVi: 'Xử lý giao dịch ngân hàng và chủ động bắn HTTP POST có chữ ký HMAC khi thanh toán hoàn tất.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'ec-spec',
        toNodeId: 'ec-api',
        techId: 'openapi',
        actionLabel: '1. Load OpenAPI Contract & Schema Rules',
        payload: `openapi: 3.0.3 | paths: { "/api/products": GET, "/api/orders": POST }`,
        explanationVi:
          'API Gateway nạp tài liệu OpenAPI để kích hoạt cơ chế tự động kiểm tra Schema cho mọi REST Request.',
      },
      {
        step: 2,
        fromNodeId: 'ec-client',
        toNodeId: 'ec-api',
        techId: 'rest',
        actionLabel: '2. GET /api/products & POST /api/orders',
        payload: `POST /api/orders\n{"items":[{"productId":101,"qty":1}],"paymentMethod":"QR_BANK"}\n--> 201 Created {"orderId":"ORD-2026-88","status":"PENDING_PAYMENT"}`,
        explanationVi:
          'Khách hàng đặt mua sản phẩm qua REST API. Server tạo đơn ở trạng thái PENDING_PAYMENT và trả về 201 Created.',
      },
      {
        step: 3,
        fromNodeId: 'ec-pay',
        toNodeId: 'ec-api',
        techId: 'webhook',
        actionLabel: '3. Webhook Push: POST /webhooks/payment (payment.success)',
        payload: `POST /api/webhooks/payment\nX-Webhook-Signature: sha256=9f8e7d6c...\n{"id":"evt_991","event":"payment.success","data":{"orderId":"ORD-2026-88","amount":2450000}}`,
        explanationVi:
          '30 giây sau, khách quét QR thanh toán thành công. Cổng thanh toán chủ động bắn Webhook HTTP POST kèm chữ ký HMAC sang Backend.',
      },
      {
        step: 4,
        fromNodeId: 'ec-api',
        toNodeId: 'ec-pay',
        techId: 'webhook',
        actionLabel: '4. Verify HMAC, Update Order to PAID & Return 200 OK',
        payload: `HTTP/1.1 200 OK\n{"received":true,"orderStatus":"PAID"}`,
        explanationVi:
          'Backend xác thực chữ ký HMAC, kiểm tra Idempotency, chuyển đơn hàng sang trạng thái PAID và trả về 200 OK để hoàn tất.',
      },
    ],
    tradeOffsVi: [
      'Phối hợp 3 công nghệ giúp mỗi tầng đạt hiệu quả tối ưu nhưng đòi hỏi quản lý bảo mật ở cả 2 chiều: JWT cho REST Client và HMAC Signature cho Webhook Endpoint.',
      'Cần xây dựng thêm cơ chế đối soát định kỳ đề phòng trường hợp Webhook Endpoint bị đứt mạng quá thời hạn Retry của cổng thanh toán.',
    ],
  },

  // ==========================================================================
  // SCENARIO 2: REAL-TIME CHAT APPLICATION (WEBSOCKET)
  // ==========================================================================
  {
    id: 'realtime-chat',
    number: 2,
    titleEn: 'Scenario 2: Real-Time Chat Application',
    titleVi: 'Kịch bản 2: Ứng dụng Trò chuyện Thời gian thực (WebSocket Full-Duplex)',
    subtitleVi:
      'Duy trì kết nối bền vững hai chiều để chuyển phát tin nhắn và trạng thái gõ phím (Typing Indicator) dưới 10 mili-giây.',
    technologies: ['websocket'],
    businessProblemVi:
      'Một nền tảng nhắn tin nhóm yêu cầu khi một thành viên gửi tin nhắn hoặc đang gõ phím, tất cả các thành viên khác trong phòng phải nhìn thấy ngay lập tức mà không được tạo ra hàng triệu HTTP Polling requests làm nghẽn máy chủ.',
    whyTheseTechnologiesVi: [
      {
        techId: 'websocket',
        reasonVi:
          'Sau bước bắt tay HTTP 101 Switching Protocols, kết nối TCP giữ mở liên tục cho phép Server phát tán (Broadcast) khung tin tới mọi thành viên trong phòng với chi phí Header chỉ vài bytes.',
      },
    ],
    nodes: [
      {
        id: 'chat-user-a',
        name: 'User A (Web Browser)',
        role: 'Message Sender',
        techUsed: 'WebSocket Client (wss://)',
        descriptionVi: 'Đã nâng cấp kết nối HTTP 101 và gửi khung tin nhắn văn bản.',
      },
      {
        id: 'chat-hub',
        name: 'WebSocket Gateway & Room Hub',
        role: 'Stateful Connection Broker',
        techUsed: 'WebSocket Server + Pub/Sub',
        descriptionVi: 'Quản lý bảng ánh xạ Room → Active Sockets và thực hiện Broadcast.',
      },
      {
        id: 'chat-user-b',
        name: 'User B & User C (Mobile)',
        role: 'Room Subscribers',
        techUsed: 'WebSocket Client (wss://)',
        descriptionVi: 'Nhận khung tin do Server đẩy xuống tức thời trên ống kết nối sẵn có.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'chat-user-a',
        toNodeId: 'chat-hub',
        techId: 'websocket',
        actionLabel: '1. HTTP Upgrade Handshake → 101 Switching Protocols',
        payload: `GET /ws/rooms/architecture HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade\n--> 101 Switching Protocols`,
        explanationVi:
          'User A, B, C thiết lập kết nối WebSocket bền vững vào phòng chat #architecture.',
      },
      {
        step: 2,
        fromNodeId: 'chat-user-a',
        toNodeId: 'chat-hub',
        techId: 'websocket',
        actionLabel: '2. Outbound Frame: chat.message',
        payload: `WS Frame [Opcode=0x1]: {"event":"chat.message","room":"architecture","text":"Sơ đồ gRPC đã sẵn sàng!"}`,
        explanationVi:
          'User A nhấn Enter gửi tin nhắn; khung dữ liệu bay thẳng qua kết nối đang mở mà không cần bắt tay TCP/TLS lại.',
      },
      {
        step: 3,
        fromNodeId: 'chat-hub',
        toNodeId: 'chat-user-b',
        techId: 'websocket',
        actionLabel: '3. Server Broadcast Push to Room Members',
        payload: `WS Frame [Server Push]: {"event":"room.broadcast","sender":"User A","text":"Sơ đồ gRPC đã sẵn sàng!","latency":"4ms"}`,
        explanationVi:
          'WebSocket Hub đẩy tin nhắn xuống socket của User B và User C chỉ sau 4ms.',
      },
    ],
    tradeOffsVi: [
      'Độ trễ cực thấp và tiết kiệm băng thông vượt trội so với HTTP Polling.',
      'Đánh đổi: Máy chủ WebSocket là Stateful (giữ kết nối mở trong RAM), nên khi mở rộng ra nhiều Server bắt buộc phải có Redis Pub/Sub hoặc Message Bus để đồng bộ tin nhắn liên máy chủ.',
    ],
  },

  // ==========================================================================
  // SCENARIO 3: MICROSERVICES ARCHITECTURE (gRPC)
  // ==========================================================================
  {
    id: 'microservices-grpc',
    number: 3,
    titleEn: 'Scenario 3: Microservices Architecture',
    titleVi: 'Kịch bản 3: Giao tiếp Nội bộ Hệ thống Microservices (gRPC + Protobuf)',
    subtitleVi:
      'Kết nối tốc độ cao giữa Order Service, Payment Service và Inventory Service bằng hợp đồng nhị phân .proto trên HTTP/2.',
    technologies: ['grpc'],
    businessProblemVi:
      'Khi một đơn hàng được đặt, hệ thống Backend phải gọi qua lại giữa 3 dịch vụ độc lập (Order Service viết bằng Go, Payment Service viết bằng Java, Inventory Service viết bằng Python). Nếu dùng JSON qua HTTP/1.1, chi phí parse văn bản và độ trễ mạng nội bộ làm chậm toàn bộ luồng đặt hàng.',
    whyTheseTechnologiesVi: [
      {
        techId: 'grpc',
        reasonVi:
          'Cung cấp tuần tự hóa nhị phân Protocol Buffers siêu gọn, sinh mã Client Stub định kiểu mạnh cho cả Go/Java/Python từ 1 file .proto duy nhất và truyền đa hợp trên HTTP/2.',
      },
    ],
    nodes: [
      {
        id: 'ms-order',
        name: 'Order Service (Go)',
        role: 'Orchestrator & gRPC Client',
        techUsed: 'gRPC Generated Stub',
        descriptionVi: 'Điều phối quy trình tạo đơn, gọi RPC sang Inventory và Payment.',
      },
      {
        id: 'ms-inventory',
        name: 'Inventory Service (Python)',
        role: 'Stock Reservation Server',
        techUsed: 'gRPC Server (Protobuf)',
        descriptionVi: 'Kiểm tra và khóa số lượng tồn kho sản phẩm trong thời gian thực.',
      },
      {
        id: 'ms-payment',
        name: 'Payment Service (Java)',
        role: 'Transaction Processor',
        techUsed: 'gRPC Server (Unary & Stream)',
        descriptionVi: 'Thực hiện扣 trừ hạn mức ví/thẻ và phát luồng trạng thái hạch toán.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'ms-order',
        toNodeId: 'ms-inventory',
        techId: 'grpc',
        actionLabel: '1. Unary RPC: InventoryService.ReserveStock()',
        payload: `Protobuf Binary [28 bytes]: ReserveStockReq { order_id: "ORD-501", sku: "SKU-101", qty: 2 }`,
        explanationVi:
          'Order Service gọi hàm Stub ReserveStock; dữ liệu được mã hóa thành 28 bytes nhị phân gửi tới Inventory Service.',
      },
      {
        step: 2,
        fromNodeId: 'ms-inventory',
        toNodeId: 'ms-order',
        techId: 'grpc',
        actionLabel: '2. Binary Response: Stock Reserved (1.9ms)',
        payload: `Protobuf Binary [14 bytes]: ReserveStockRes { reserved: true, hold_id: "HLD-88" } | grpc-status: 0`,
        explanationVi:
          'Inventory Service khóa hàng thành công và phản hồi trong chưa đầy 2ms.',
      },
      {
        step: 3,
        fromNodeId: 'ms-order',
        toNodeId: 'ms-payment',
        techId: 'grpc',
        actionLabel: '3. Unary RPC: PaymentService.AuthorizeCharge()',
        payload: `Protobuf Binary [34 bytes]: ChargeReq { order_id: "ORD-501", amount_vnd: 4900000 }`,
        explanationVi:
          'Order Service tiếp tục gọi hàm nhị phân sang Payment Service (Java) để xử lý thanh toán.',
      },
    ],
    tradeOffsVi: [
      'Đạt thông lượng (Throughput) cực đại và an toàn kiểu dữ liệu tuyệt đối giữa các dịch vụ đa ngôn ngữ.',
      'Đánh đổi: Gói tin nhị phân không tự đọc được bằng mắt thường khi debug mạng nếu không nạp file .proto vào công cụ quan sát.',
    ],
  },

  // ==========================================================================
  // SCENARIO 4: DATA AGGREGATION PLATFORM (GRAPHQL)
  // ==========================================================================
  {
    id: 'data-aggregation-graphql',
    number: 4,
    titleEn: 'Scenario 4: Data Aggregation Platform',
    titleVi: 'Kịch bản 4: Nền tảng Tổng hợp Dữ liệu Đa nguồn (GraphQL Federation / BFF)',
    subtitleVi:
      'Hợp nhất dữ liệu từ nhiều dịch vụ độc lập (Sinh viên, Đào tạo, Tài chính) qua một cổng truy vấn đồ thị duy nhất.',
    technologies: ['graphql'],
    businessProblemVi:
      'Cổng thông tin Đại học có 3 ứng dụng (Web Portal, Mobile App, Kiosk tra cứu) cần lấy thông tin liên kết từ 3 nguồn dữ liệu tách biệt: Hồ sơ sinh viên, Lịch học/Điểm số và Công nợ học phí. Nếu gọi 3–4 REST API riêng biệt từ điện thoại, ứng dụng bị chậm và tải thừa quá nhiều dữ liệu.',
    whyTheseTechnologiesVi: [
      {
        techId: 'graphql',
        reasonVi:
          'Cho phép mọi Client gửi 1 câu Query duy nhất mô tả đúng các trường cần lấy; tầng GraphQL Resolvers sẽ tự động gọi song song xuống các nguồn dữ liệu và ghép thành 1 JSON hoàn chỉnh.',
      },
    ],
    nodes: [
      {
        id: 'da-client',
        name: 'Mobile & Web Campus Apps',
        role: 'Multi-Platform Clients',
        techUsed: 'GraphQL Query Client',
        descriptionVi: 'Gửi truy vấn lồng nhau chỉ lấy đúng các trường màn hình hiện tại cần.',
      },
      {
        id: 'da-gateway',
        name: 'GraphQL Aggregation Gateway',
        role: 'Unified Schema & Resolvers',
        techUsed: 'GraphQL Execution Engine',
        descriptionVi: 'Phân tích AST câu truy vấn và kích hoạt song song các Resolvers liên quan.',
      },
      {
        id: 'da-sources',
        name: 'Student DB + Course Service + Billing API',
        role: 'Underlying Data Sources',
        techUsed: 'SQL + Internal Services',
        descriptionVi: 'Các nguồn dữ liệu chuyên biệt cung cấp thông tin cho từng nhánh Resolver.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'da-client',
        toNodeId: 'da-gateway',
        techId: 'graphql',
        actionLabel: '1. POST /graphql (Single Nested Query)',
        payload: `query { student(id: "SV-101") { fullName gpa courses { title grade } tuition { balanceDue } } }`,
        explanationVi:
          'Mobile App gửi 1 request duy nhất yêu cầu thông tin từ cả 3 miền: Hồ sơ, Điểm môn học và Học phí.',
      },
      {
        step: 2,
        fromNodeId: 'da-gateway',
        toNodeId: 'da-sources',
        techId: 'graphql',
        actionLabel: '2. Parallel Resolver Execution & DataLoader Batching',
        payload: `Resolver 1 -> StudentDB | Resolver 2 -> CourseService | Resolver 3 -> BillingAPI`,
        explanationVi:
          'GraphQL Server thực thi song song 3 Resolvers trên mạng nội bộ tốc độ cao.',
      },
      {
        step: 3,
        fromNodeId: 'da-gateway',
        toNodeId: 'da-client',
        techId: 'graphql',
        actionLabel: '3. Return Unified Tailored JSON Response',
        payload: `{"data":{"student":{"fullName":"Trần Hoàng Minh","gpa":3.82,"courses":[{"title":"Distributed Systems","grade":"A"}],"tuition":{"balanceDue":0}}}}`,
        explanationVi:
          'Client nhận về 1 gói JSON duy nhất gọn nhẹ, khớp 100% với giao diện cần hiển thị.',
      },
    ],
    tradeOffsVi: [
      'Loại bỏ hoàn toàn chuỗi gọi tuần tự nhiều vòng (Round-trips) từ thiết bị di động của người dùng.',
      'Đánh đổi: Cần cài đặt DataLoader và giới hạn độ sâu truy vấn (Query Complexity/Depth Limit) trên GraphQL Gateway để bảo vệ các Database phía sau.',
    ],
  },

  // ==========================================================================
  // SCENARIO 5: ENTERPRISE INTEGRATION (SOAP)
  // ==========================================================================
  {
    id: 'enterprise-soap',
    number: 5,
    titleEn: 'Scenario 5: Enterprise Core Banking Integration',
    titleVi: 'Kịch bản 5: Tích hợp Hệ thống Doanh nghiệp & Ngân hàng Lõi (SOAP + WSDL)',
    subtitleVi:
      'Trao đổi điện thanh toán có cấu trúc nghiêm ngặt thông qua hợp đồng WSDL, lược đồ XSD và chữ ký thông điệp WS-Security.',
    technologies: ['soap'],
    businessProblemVi:
      'Hệ thống hoạch định nguồn lực doanh nghiệp (SAP ERP) của một tập đoàn cần kết nối trực tiếp với hệ thống Core Banking của ngân hàng để giải ngân lương và thanh toán nhà cung cấp tự động với yêu cầu bảo mật cấp thông điệp và kiểm tra kiểu dữ liệu XSD bắt buộc.',
    whyTheseTechnologiesVi: [
      {
        techId: 'soap',
        reasonVi:
          'Đảm bảo hợp đồng dịch vụ WSDL chặt chẽ, xác thực chữ ký số XML (WS-Security) bên trong <soap:Header> và báo lỗi chuẩn hóa qua <soap:Fault>.',
      },
    ],
    nodes: [
      {
        id: 'ent-erp',
        name: 'Corporate ERP System',
        role: 'SOAP Client Initiator',
        techUsed: 'WSDL Generated SOAP Proxy',
        descriptionVi: 'Tạo bức điện XML chuyển tiền và ký số bằng chứng thư doanh nghiệp.',
      },
      {
        id: 'ent-gateway',
        name: 'Bank SOAP Endpoint & XSD Guard',
        role: 'Contract & Security Verifier',
        techUsed: 'SOAP 1.2 + WS-Security',
        descriptionVi: 'Kiểm tra chữ ký WS-Security và đối chiếu cấu trúc XML với file XSD.',
      },
      {
        id: 'ent-core',
        name: 'Core Banking Ledger',
        role: 'Financial Settlement Engine',
        techUsed: 'Enterprise Transaction Processor',
        descriptionVi: 'Thực hiện bút toán nợ/có ACID và phát hành mã hạch toán.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'ent-erp',
        toNodeId: 'ent-gateway',
        techId: 'soap',
        actionLabel: '1. Send Signed SOAP Envelope (TransferMoneyRequest)',
        payload: `<soap:Envelope><soap:Header><wsse:Security>...</wsse:Security></soap:Header><soap:Body><bank:TransferMoneyRequest><bank:Amount>250000000</bank:Amount></bank:TransferMoneyRequest></soap:Body></soap:Envelope>`,
        explanationVi:
          'Hệ thống ERP gửi bức điện SOAP XML đã ký số qua kênh kết nối doanh nghiệp.',
      },
      {
        step: 2,
        fromNodeId: 'ent-gateway',
        toNodeId: 'ent-core',
        techId: 'soap',
        actionLabel: '2. Verify XSD Schema & Execute Core Ledger Settlement',
        payload: `[XSD-PASS] Valid TransferMoneyRequest -> Ledger Debit/Credit Committed`,
        explanationVi:
          'Sau khi vượt qua kiểm tra XSD và chữ ký, giao dịch được thực thi trong sổ cái ngân hàng.',
      },
      {
        step: 3,
        fromNodeId: 'ent-gateway',
        toNodeId: 'ent-erp',
        techId: 'soap',
        actionLabel: '3. Return SOAP Response Envelope',
        payload: `<soap:Envelope><soap:Body><bank:TransferMoneyResponse><bank:SettlementId>STL-99812</bank:SettlementId><bank:Status>SETTLED</bank:Status></bank:TransferMoneyResponse></soap:Body></soap:Envelope>`,
        explanationVi:
          'Ngân hàng trả về bức điện SOAP Response chứa mã đối soát hạch toán chính thức.',
      },
    ],
    tradeOffsVi: [
      'Độ tin cậy hợp đồng, tính pháp lý của chữ ký thông điệp và khả năng kiểm tra lỗi cấu trúc đạt mức cao nhất.',
      'Đánh đổi: Chi phí băng thông XML lớn và thời gian tích hợp ban đầu lâu hơn so với REST/JSON.',
    ],
  },

  // ==========================================================================
  // SCENARIO 6: API DOCUMENTATION & CONTRACT PLATFORM (OPENAPI)
  // ==========================================================================
  {
    id: 'api-documentation-openapi',
    number: 6,
    titleEn: 'Scenario 6: Contract-First API Governance & Documentation Platform',
    titleVi: 'Kịch bản 6: Nền tảng Quản trị Hợp đồng & Tự động hóa Tài liệu (OpenAPI 3.0)',
    subtitleVi:
      'Sử dụng một đặc tả OpenAPI duy nhất để tự động hóa cổng tài liệu Swagger UI, sinh Client SDK đa ngôn ngữ và chặn Request sai chuẩn tại Gateway.',
    technologies: ['openapi', 'rest'],
    businessProblemVi:
      'Một công ty phần mềm có 15 nhóm phát triển cùng xây dựng hơn 80 REST Endpoints. Việc viết tài liệu thủ công khiến tài liệu luôn lỗi thời so với code, đội Mobile và Frontend liên tục gặp lỗi Runtime vì Backend đổi tên trường JSON mà không báo trước.',
    whyTheseTechnologiesVi: [
      {
        techId: 'openapi',
        reasonVi:
          'Thiết lập quy trình Contract-First: Mọi thay đổi API phải được cập nhật vào file openapi.yaml trước, từ đó hệ thống CI/CD tự động dựng trang tài liệu, sinh TypeScript/Kotlin SDK và nạp luật kiểm tra vào API Gateway.',
      },
      {
        techId: 'rest',
        reasonVi:
          'Kiến trúc RESTful cung cấp nền tảng tài nguyên và HTTP Status Codes chuẩn mực để OpenAPI mô tả chính xác.',
      },
    ],
    nodes: [
      {
        id: 'doc-spec',
        name: 'Single Source of Truth (openapi.yaml)',
        role: 'Git-Versioned API Contract',
        techUsed: 'OpenAPI Specification 3.0',
        descriptionVi: 'Tệp đặc tả trung tâm được kiểm duyệt qua Pull Request.',
      },
      {
        id: 'doc-portal',
        name: 'Developer Portal & SDK Generator',
        role: 'Documentation & Codegen Pipeline',
        techUsed: 'Swagger UI + OpenAPI Generator',
        descriptionVi: 'Tự động xuất bản cổng tài liệu tương tác và gói npm/pip Client SDK.',
      },
      {
        id: 'doc-gateway',
        name: 'Contract-Enforcing API Gateway',
        role: 'Runtime Validation Layer',
        techUsed: 'OpenAPI Validation Middleware',
        descriptionVi: 'Đối chiếu mọi REST Request/Response thực tế với Schema trong file OpenAPI.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'doc-spec',
        toNodeId: 'doc-portal',
        techId: 'openapi',
        actionLabel: '1. CI/CD Parses openapi.yaml → Renders Docs & Generates SDKs',
        payload: `Generated: Swagger UI Portal + @company/student-api-sdk@1.2.0 (TypeScript)`,
        explanationVi:
          'Khi file openapi.yaml được cập nhật, pipeline tự động xuất bản trang tài liệu mới và gói SDK có định kiểu đầy đủ.',
      },
      {
        step: 2,
        fromNodeId: 'doc-spec',
        toNodeId: 'doc-gateway',
        techId: 'openapi',
        actionLabel: '2. Deploy JSON Schema Rules to API Gateway',
        payload: `Loaded 4 Paths & 6 Component Schemas into Gateway Validation Engine`,
        explanationVi:
          'API Gateway nạp trực tiếp các ràng buộc kiểu dữ liệu từ cùng file OpenAPI đó.',
      },
      {
        step: 3,
        fromNodeId: 'doc-portal',
        toNodeId: 'doc-gateway',
        techId: 'rest',
        actionLabel: '3. Client Calls REST Endpoint Using Generated Typed SDK',
        payload: `POST /students {"fullName":"Nguyễn Văn A","email":"a@univ.edu.vn","major":"CS"} --> 201 Created`,
        explanationVi:
          'Ứng dụng Frontend gọi REST API qua hàm SDK sinh tự động, đảm bảo khớp 100% với bộ kiểm tra trên Gateway.',
      },
    ],
    tradeOffsVi: [
      'Loại bỏ triệt để tình trạng lệch tài liệu (Documentation Drift) và lỗi sai kiểu dữ liệu giữa Frontend và Backend.',
      'Đánh đổi: Đòi hỏi kỷ luật kỹ thuật của đội ngũ trong việc duy trì và review file đặc tả OpenAPI trong quy trình CI/CD.',
    ],
  },
];
