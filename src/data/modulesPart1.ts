import { LearningModule } from '@/types/api';

export const MODULES_PART_1: LearningModule[] = [
  // ==========================================================================
  // MODULE 1: REST API
  // ==========================================================================
  {
    id: 'rest',
    order: 1,
    name: 'REST API',
    taglineVi:
      'Phong cách kiến trúc xoay quanh Tài nguyên (Resource-Oriented Architecture) vận hành trên nền tảng chuẩn HTTP.',
    technicalNature: 'Architectural Style',
    technicalNatureVi: 'Phong cách kiến trúc phần mềm (Architectural Style)',
    accentColor: '#38BDF8',
    badgeClass: 'border-sky-500/40 bg-sky-950/60 text-sky-300',
    borderClass: 'border-sky-500/40',
    glowClass: 'shadow-sky-950/50',
    introduction: {
      hookVi:
        'REST (Representational State Transfer) không phải là một giao thức hay một thư viện có sẵn để cài đặt, mà là một tập hợp các ràng buộc kiến trúc do Roy Fielding đề xuất năm 2000 nhằm tận dụng tối đa sức mạnh của giao thức HTTP.',
      problemSolvedVi:
        'Trước khi có REST, các hệ thống phân tán phải định nghĩa hàng trăm hàm RPC tùy biến khó chuẩn hóa và không tận dụng được bộ nhớ đệm (HTTP Caching) hay ngữ nghĩa Status Code của Web.',
      historicalContextVi:
        'Trở thành nền tảng thống trị cho các Public Web API, Mobile Backend và cổng giao tiếp Cloud suốt hơn hai thập kỷ qua.',
      coexistenceNoteVi:
        'Trong một hệ thống hiện đại, REST thường được mô tả tài liệu bằng OpenAPI, kết hợp với Webhook để báo sự kiện bất đồng bộ và gọi xuống các Microservices nội bộ bằng gRPC.',
    },
    coreConcepts: [
      {
        termEn: 'Resources & Endpoints (URI)',
        titleVi: 'Tài nguyên và Định danh URI',
        summaryVi:
          'Mọi thực thể nghiệp vụ (Sản phẩm, Đơn hàng, Người dùng) được trừu tượng hóa thành Tài nguyên (Resource) và định danh bằng danh từ số nhiều trên URI.',
        deepDiveVi:
          'Trong thiết kế chuẩn REST, URI chỉ dùng để chỉ định "Cái gì" (ví dụ: /api/products/101), tuyệt đối không nhét động từ hành động như /api/getProduct?id=101 hay /api/deleteProduct.',
        codeSnippet: `GET /api/products          // Collection Resource
GET /api/products/101      // Singleton Resource`,
      },
      {
        termEn: 'HTTP Methods & Semantics',
        titleVi: 'Ngữ nghĩa Phương thức HTTP (GET, POST, PUT, PATCH, DELETE)',
        summaryVi:
          'Thay vì đặt tên hàm trong URL, REST dùng chính các HTTP Verbs chuẩn để biểu đạt hành động thao tác lên tài nguyên.',
        deepDiveVi:
          'GET dùng để đọc; POST khởi tạo tài nguyên mới; PUT thay thế toàn bộ tài nguyên; PATCH cập nhật một phần trường dữ liệu; DELETE xóa tài nguyên.',
      },
      {
        termEn: 'Stateless Communication',
        titleVi: 'Giao tiếp Phi trạng thái (Statelessness)',
        summaryVi:
          'Server không lưu giữ ngữ cảnh phiên làm việc (Session State) của Client trong bộ nhớ giữa hai lần gọi liên tiếp.',
        deepDiveVi:
          'Mỗi HTTP Request gửi lên phải tự chứa đầy đủ thông tin cần thiết để Server hiểu và xác thực (ví dụ: đính kèm JWT trong Header Authorization ở mọi request). Nhờ đó bất kỳ máy chủ nào sau Load Balancer cũng xử lý được request.',
      },
      {
        termEn: 'Idempotency',
        titleVi: 'Tính Lũy đẳng (Idempotency)',
        summaryVi:
          'Một thao tác có tính Idempotent nếu thực hiện 1 lần hay lặp lại N lần liên tiếp với cùng bộ tham số thì trạng thái cuối cùng trên Server vẫn giống hệt nhau.',
        deepDiveVi:
          'GET, PUT và DELETE là Idempotent (an toàn để Client tự động Retry khi rớt mạng). Ngược lại, POST KHÔNG Idempotent (gọi POST /api/orders 3 lần sẽ tạo ra 3 đơn hàng trùng lặp nếu không dùng thêm Idempotency-Key).',
      },
      {
        termEn: 'Resource Representation (JSON)',
        titleVi: 'Biểu diễn Tài nguyên & Content Negotiation',
        summaryVi:
          'Client không thao tác trực tiếp lên bảng Database của Server mà trao đổi "Bản biểu diễn" (Representation) của tài nguyên, phổ biến nhất là JSON.',
        deepDiveVi:
          'Thông qua Header Accept: application/json và Content-Type: application/json, Client và Server thống nhất định dạng biểu diễn dữ liệu.',
      },
      {
        termEn: 'Query Params vs Path Params & Status Codes',
        titleVi: 'Tham số Đường dẫn, Truy vấn & Mã trạng thái HTTP',
        summaryVi:
          'Path Params (/products/101) định danh tài nguyên cụ thể; Query Params (?category=books&sort=price) dùng để lọc/phân trang; Status Codes (200, 201, 400, 401, 404, 500) báo kết quả chuẩn hóa.',
        deepDiveVi:
          'Một REST API đúng chuẩn không bao giờ trả về HTTP 200 OK khi có lỗi bên trong JSON (anti-pattern: 200 OK kèm {"success": false}).',
      },
    ],
    architecture: {
      summaryVi:
        'Kiến trúc phân lớp tuần tự: Client → HTTP Request → REST Endpoint (Router/Controller) → Business Logic → Database → HTTP Response → Client.',
      nodes: [
        {
          id: 'rest-client',
          label: 'Web / Mobile Client',
          sublabel: 'Consumer',
          role: 'client',
          descriptionVi: 'Khởi tạo HTTP Request kèm Method, URI, Headers và JSON Body.',
          techDetails: 'Fetch API / Axios / Mobile HTTP Client',
        },
        {
          id: 'rest-endpoint',
          label: 'REST Endpoint & Middleware',
          sublabel: '/api/products',
          role: 'gateway',
          descriptionVi: 'Ánh xạ URI + HTTP Verb vào Controller, xác thực JWT và kiểm tra Schema.',
          techDetails: 'REST Router, Auth Guard, JSON Parser',
        },
        {
          id: 'rest-logic',
          label: 'Product Business Logic',
          sublabel: 'Domain Service',
          role: 'server',
          descriptionVi: 'Kiểm tra quy tắc tồn kho, giá bán, phân quyền và điều phối giao dịch.',
          techDetails: 'Stateless Application Service',
        },
        {
          id: 'rest-db',
          label: 'Product Database',
          sublabel: 'Relational / NoSQL',
          role: 'database',
          descriptionVi: 'Lưu trữ bền vững các bản ghi sản phẩm và thực thi truy vấn ACID.',
          techDetails: 'PostgreSQL / Indexed Storage',
        },
      ],
      edges: [
        {
          id: 'e1',
          from: 'rest-client',
          to: 'rest-endpoint',
          label: 'HTTP Request (GET/POST/PATCH/DELETE)',
          protocol: 'HTTPS / JSON',
        },
        {
          id: 'e2',
          from: 'rest-endpoint',
          to: 'rest-logic',
          label: 'Validated DTO',
          protocol: 'In-Process Call',
        },
        {
          id: 'e3',
          from: 'rest-logic',
          to: 'rest-db',
          label: 'SQL SELECT / INSERT / UPDATE',
          protocol: 'TCP / DB Wire',
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'Mỗi giao dịch REST là một chu kỳ HTTP Request/Response khép kín và hoàn toàn độc lập với các yêu cầu trước đó.',
      internalMechanismVi: [
        '1. Định tuyến theo Tổ hợp (Method + Path): Bộ định tuyến (Router) kết hợp cả HTTP Method lẫn mẫu đường dẫn (ví dụ: PATCH + /api/products/:id) để chọn hàm xử lý.',
        '2. Giải tuần tự hóa & Kiểm tra hợp lệ: Chuỗi JSON trong Request Body được parse thành Object và kiểm tra kiểu dữ liệu.',
        '3. Thực thi Nghiệp vụ & Truy vấn DB: Dịch vụ thực hiện đọc/ghi Database, sau đó ánh xạ bản ghi sang đối tượng phản hồi (Response Representation).',
        '4. Gắn Ngữ nghĩa HTTP: Server chọn Status Code phản ánh đúng bản chất kết quả (200 OK, 201 Created, 404 Not Found) cùng các Header điều khiển Cache (ETag, Cache-Control).',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Client',
        actionEn: 'Construct & Send HTTP Request',
        descriptionVi:
          'Client gửi yêu cầu cập nhật giá sản phẩm #101 bằng phương thức PATCH.',
        payloadExample: `PATCH /api/products/101 HTTP/1.1\nContent-Type: application/json\n\n{"price": 2290000}`,
      },
      {
        step: 2,
        actor: 'REST Endpoint',
        actionEn: 'Route Match & Schema Validation',
        descriptionVi:
          'Endpoint trích xuất Path Parameter id=101 và kiểm tra trường price > 0.',
        payloadExample: `Route Params: { id: 101 } | Body DTO: { price: 2290000 }`,
      },
      {
        step: 3,
        actor: 'Business Logic & DB',
        actionEn: 'Execute Partial Update',
        descriptionVi:
          'Cập nhật cột price cho sản phẩm #101 trong Database và lấy bản ghi mới nhất.',
        payloadExample: `UPDATE products SET price = 2290000 WHERE id = 101 RETURNING *;`,
      },
      {
        step: 4,
        actor: 'REST Server → Client',
        actionEn: 'Return HTTP 200 OK Representation',
        descriptionVi:
          'Trả về biểu diễn JSON hoàn chỉnh của sản phẩm #101 sau khi cập nhật.',
        payloadExample: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":101,"name":"Bàn phím cơ Engineering Keychron K8","price":2290000,"stock":35}`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Hệ thống Quản lý Sản phẩm Thương mại Điện tử (E-Commerce Product API)',
      scenarioDescriptionVi:
        'Triển khai bộ 5 Endpoints chuẩn RESTful cho tài nguyên /api/products phục vụ hiển thị danh mục, xem chi tiết, thêm mới, sửa giá và xóa sản phẩm.',
      codeExamples: [
        {
          titleVi: 'Triển khai REST Controller & Client Fetch (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Minh họa cách ánh xạ 5 HTTP Methods chuẩn lên tài nguyên /api/products và trả về đúng HTTP Status Codes.',
          code: `// 1. GET /api/products?category=hardware (Đọc danh sách + lọc)
// 2. GET /api/products/101              (Đọc chi tiết 1 tài nguyên)
// 3. POST /api/products                 (Tạo mới -> 201 Created)
// 4. PATCH /api/products/101            (Cập nhật 1 phần -> 200 OK)
// 5. DELETE /api/products/101           (Xóa tài nguyên -> 200 OK)

async function createAndPatchProduct() {
  // Tạo sản phẩm mới với POST
  const createRes = await fetch('https://api.shop.vn/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOi...'
    },
    body: JSON.stringify({
      name: 'Tai nghe chống ồn Sony WH-1000XM5',
      category: 'hardware',
      price: 6990000,
      stock: 25
    })
  });
  // Status: 201 Created | Header Location: /api/products/104
  const createdProduct = await createRes.json();

  // Cập nhật riêng trường giá khuyến mãi với PATCH
  const patchRes = await fetch(\`https://api.shop.vn/api/products/\${createdProduct.id}\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 6490000 })
  });
  return patchRes.json();
}`,
          annotations: [
            {
              lineHint: 'POST /api/products',
              explanationVi:
                'Dùng danh từ số nhiều /api/products kết hợp POST và trả về 201 Created kèm Header Location.',
            },
            {
              lineHint: 'PATCH /api/products/${id}',
              explanationVi:
                'Chỉ truyền trường cần thay đổi ({ price: 6490000 }) thay vì phải gửi lại toàn bộ đối tượng như PUT.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Public API & Hệ sinh thái Đối tác Mở',
        industry: 'E-Commerce / SaaS / Cloud Platforms',
        descriptionVi:
          'Cung cấp API cho hàng ngàn lập trình viên bên ngoài tích hợp (như Stripe, GitHub, Shopee Open Platform).',
        whyItFitsVi:
          'Mọi ngôn ngữ lập trình đều có sẵn thư viện HTTP/JSON; dễ đọc, dễ bảo mật qua API Gateway và tận dụng được CDN/HTTP Cache.',
      },
      {
        titleVi: 'Ứng dụng CRUD Nghiệp vụ Chuẩn',
        industry: 'Enterprise Web & Mobile Apps',
        descriptionVi:
          'Quản lý danh mục sản phẩm, hồ sơ khách hàng, đơn hàng với các thao tác Tạo, Đọc, Sửa, Xóa rõ ràng.',
        whyItFitsVi:
          'Ánh xạ tự nhiên 1-1 giữa thực thể nghiệp vụ và Resource URI.',
      },
    ],
    WhenNotToUseVi: [
      'Khi ứng dụng cần truyền luồng dữ liệu hai chiều độ trễ mili-giây như Chat hoặc Game thời gian thực (nên dùng WebSocket).',
      'Khi màn hình Mobile phức tạp cần ghép dữ liệu từ 15 bảng quan hệ sâu nhưng băng thông mạng yếu (GraphQL sẽ tối ưu hơn).',
      'Khi hai Microservices nội bộ gọi nhau hàng chục ngàn lần/giây cần hiệu năng nhị phân tối đa (gRPC phù hợp hơn).',
    ],
    advantages: [
      'Đơn giản, phổ biến toàn cầu, mọi lập trình viên đều quen thuộc với HTTP và JSON.',
      'Khả năng mở rộng ngang (Horizontal Scaling) tuyệt vời nhờ kiến trúc Stateless.',
      'Tận dụng trực tiếp cơ chế HTTP Caching (Cache-Control, ETag, 304 Not Modified) ở tầng trình duyệt và CDN.',
      'Hệ sinh thái công cụ cực mạnh (OpenAPI/Swagger, Postman, API Gateways).',
    ],
    limitations: [
      'Over-fetching: Server trả về toàn bộ 30 trường của sản phẩm trong khi giao diện chỉ cần hiển thị Tên và Giá.',
      'Under-fetching (N+1 Requests): Để vẽ 1 trang chi tiết, Client phải gọi GET /users/1 rồi gọi tiếp GET /users/1/orders và GET /orders/99/items.',
      'Không có hợp đồng kiểu dữ liệu (Type Schema) bắt buộc ở tầng giao thức nếu không kết hợp thêm OpenAPI.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'GraphQL',
        keyDifferenceVi:
          'REST phân tách dữ liệu thành nhiều URL Endpoints cố định cấu trúc trả về; GraphQL dùng 1 Endpoint duy nhất cho phép Client tự chọn trường.',
        whenToChooseThisVi:
          'Khi cấu trúc tài nguyên rõ ràng, cần tận dụng HTTP Caching ở tầng mạng và muốn kiến trúc Backend đơn giản.',
        whenToChooseOtherVi:
          'Khi nhiều loại Client (Web, Mobile, Smartwatch) cần các tập con dữ liệu rất khác nhau từ đồ thị thực thể phức tạp.',
      },
      {
        comparedWith: 'gRPC',
        keyDifferenceVi:
          'REST dùng văn bản JSON trên HTTP/1.1 (hoặc HTTP/2); gRPC dùng nhị phân Protocol Buffers trên HTTP/2 với mô hình gọi hàm từ xa.',
        whenToChooseThisVi:
          'Khi giao tiếp trực tiếp với trình duyệt Web hoặc cung cấp Public API cho bên thứ ba.',
        whenToChooseOtherVi:
          'Khi kết nối nội bộ giữa các Microservices yêu cầu thông lượng lớn và Streaming hai chiều.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“Cứ API nào trả về JSON qua HTTP thì đều là REST API.”',
        realityVi:
          'Nhiều API dùng HTTP + JSON nhưng thiết kế theo kiểu RPC (ví dụ: POST /api/doTransferMoney hoặc GET /api/deleteUser?id=5). Đó là HTTP JSON-RPC chứ không phải REST.',
        technicalProofVi:
          'Một API chỉ thực sự tuân thủ REST khi định danh bằng Resource Nouns, sử dụng đúng ngữ nghĩa HTTP Verbs, Stateless và trả về Status Codes chuẩn.',
      },
      {
        mythVi: '“Stateless trong REST nghĩa là ứng dụng không được phép có chức năng Đăng nhập.”',
        realityVi:
          'Stateless có nghĩa là Server không lưu Session trong RAM của riêng nó. Trạng thái đăng nhập vẫn được duy trì bằng cách Client tự gửi kèm Token (như JWT) trong mỗi Request.',
        technicalProofVi:
          'Constraint 5.1.3 trong luận án của Roy Fielding quy định trạng thái phiên (Session State) được giữ hoàn toàn ở phía Client.',
      },
    ],
  },

  // ==========================================================================
  // MODULE 2: SOAP API
  // ==========================================================================
  {
    id: 'soap',
    order: 2,
    name: 'SOAP API',
    taglineVi:
      'Giao thức truyền thông điệp XML nghiêm ngặt với hợp đồng WSDL và tiêu chuẩn bảo mật cấp doanh nghiệp.',
    technicalNature: 'Messaging Protocol',
    technicalNatureVi: 'Giao thức truyền thông điệp chuẩn hóa (Messaging Protocol)',
    accentColor: '#F59E0B',
    badgeClass: 'border-amber-500/40 bg-amber-950/60 text-amber-300',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-amber-950/50',
    introduction: {
      hookVi:
        'Khác với REST (vốn chỉ là phong cách kiến trúc), SOAP (Simple Object Access Protocol) là một giao thức chính thức của W3C quy định chặt chẽ từng thẻ XML của bức điện trao đổi giữa các hệ thống.',
      problemSolvedVi:
        'Trong lĩnh vực Ngân hàng lõi (Core Banking), Viễn thông và Chính phủ, các hệ thống đòi hỏi hợp đồng kiểu dữ liệu tuyệt đối chính xác, chữ ký số ở cấp độ từng phần tử thông điệp (WS-Security) và giao dịch phân tán hai pha (WS-AtomicTransaction).',
      historicalContextVi:
        'Ra đời cuối thập niên 1990 bởi Microsoft, IBM và W3C; đến nay vẫn là xương sống của nhiều hệ thống thanh toán liên ngân hàng, SWIFT/ISO 20022 và ERP doanh nghiệp lớn.',
      coexistenceNoteVi:
        'Trong kiến trúc hiện đại, các hệ thống Core Banking dùng SOAP thường đứng phía sau tầng API Gateway hoặc ESB; Gateway sẽ chuyển đổi (Transform) gói tin REST/JSON từ ứng dụng Mobile sang XML SOAP.',
    },
    coreConcepts: [
      {
        termEn: 'SOAP Envelope, Header & Body',
        titleVi: 'Cấu trúc Phong bì XML (Envelope, Header, Body)',
        summaryVi:
          'Mọi bức điện SOAP bắt buộc phải được bọc trong thẻ gốc <soap:Envelope>, bên trong gồm <soap:Header> (tùy chọn) và <soap:Body> (bắt buộc).',
        deepDiveVi:
          'Header chứa thông tin điều khiển (chữ ký số WS-Security, mã định danh giao dịch, định tuyến), trong khi Body chứa tên hàm nghiệp vụ và các tham số đầu vào/đầu ra.',
        codeSnippet: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header><!-- WS-Security & Metadata --></soap:Header>
  <soap:Body><!-- Business Operation Payload --></soap:Body>
</soap:Envelope>`,
      },
      {
        termEn: 'SOAP Fault',
        titleVi: 'Cấu trúc Báo lỗi Chuẩn hóa (SOAP Fault)',
        summaryVi:
          'SOAP không dựa vào HTTP Status Codes để phân loại lỗi nghiệp vụ mà định nghĩa thẻ <soap:Fault> ngay bên trong <soap:Body>.',
        deepDiveVi:
          'Một khối <soap:Fault> chứa <soap:Code> (ví dụ: soap:Sender hoặc soap:Receiver), <soap:Reason> (mô tả lỗi đa ngôn ngữ) và <soap:Detail> (mã lỗi chi tiết theo Schema nghiệp vụ).',
      },
      {
        termEn: 'WSDL (Web Services Description Language)',
        titleVi: 'Hợp đồng Dịch vụ WSDL & XSD',
        summaryVi:
          'WSDL là một tài liệu XML đóng vai trò hợp đồng máy đọc được, liệt kê chính xác mọi hàm (Operations), cấu trúc tham số (XSD Types) và địa chỉ kết nối (Bindings).',
        deepDiveVi:
          'Nhờ WSDL, các IDE (Visual Studio, Eclipse, IntelliJ) có thể tự động sinh ra toàn bộ class Client Proxy chỉ bằng một lệnh import URL ?wsdl.',
      },
      {
        termEn: 'Transport Independence & WS-* Standards',
        titleVi: 'Độc lập Giao vận & Bộ tiêu chuẩn Enterprise WS-*',
        summaryVi:
          'Mặc dù 95% chạy qua HTTP POST (SOAP over HTTP), bức điện SOAP hoàn toàn có thể gửi qua SMTP (Email), JMS (Message Queue) hoặc TCP thuần.',
        deepDiveVi:
          'Nhờ thông tin bảo mật (WS-Security) nằm ngay trong <soap:Header> chứ không phụ thuộc vào kết nối TLS điểm-tới-điểm, bức điện SOAP vẫn giữ nguyên chữ ký mã hóa khi đi qua nhiều trạm trung gian (Intermediaries).',
      },
    ],
    architecture: {
      summaryVi:
        'Luồng xử lý dựa trên hợp đồng WSDL: SOAP Client → XML SOAP Message → SOAP Endpoint (XSD Validator) → Core Banking Service → SOAP Response / SOAP Fault.',
      nodes: [
        {
          id: 'soap-client',
          label: 'SOAP Client (Generated Proxy)',
          sublabel: 'ERP / Partner System',
          role: 'client',
          descriptionVi: 'Đóng gói lời gọi hàm thành bức điện XML theo đúng hợp đồng WSDL.',
          techDetails: 'JAX-WS / WCF / Zeep SOAP Client',
        },
        {
          id: 'soap-xml',
          label: 'XML SOAP Envelope',
          sublabel: 'HTTP POST Wire',
          role: 'contract',
          descriptionVi: 'Bức điện XML chứa Header bảo mật WS-Security và Body nghiệp vụ.',
          techDetails: 'application/soap+xml',
        },
        {
          id: 'soap-endpoint',
          label: 'SOAP Endpoint & XSD Engine',
          sublabel: 'WSDL Contract Guard',
          role: 'gateway',
          descriptionVi: 'Kiểm tra chữ ký XML, đối chiếu từng thẻ với XML Schema (XSD).',
          techDetails: 'WS-Security + XSD Validator',
        },
        {
          id: 'soap-service',
          label: 'Core Banking Processor',
          sublabel: 'Enterprise Service',
          role: 'server',
          descriptionVi: 'Thực thi giao dịch tài chính và trả về SOAP Response hoặc SOAP Fault.',
          techDetails: 'ACID Ledger Engine',
        },
      ],
      edges: [
        {
          id: 's1',
          from: 'soap-client',
          to: 'soap-xml',
          label: 'Serialize XML Envelope',
          protocol: 'SOAP 1.2 XML',
        },
        {
          id: 's2',
          from: 'soap-xml',
          to: 'soap-endpoint',
          label: 'HTTP POST /ws/banking',
          protocol: 'HTTP/TLS',
        },
        {
          id: 's3',
          from: 'soap-endpoint',
          to: 'soap-service',
          label: 'Unmarshalled Java/C# Object',
          protocol: 'Strict Contract Call',
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'Khác với REST dùng nhiều URL và nhiều HTTP Methods, SOAP thường gửi mọi thao tác qua một địa chỉ Endpoint duy nhất bằng phương thức HTTP POST; hành động cụ thể nằm ở tên thẻ XML bên trong <soap:Body>.',
      internalMechanismVi: [
        '1. Khám phá Hợp đồng (WSDL Binding): Client đọc file WSDL để biết danh sách Operations (GetAccountBalance, TransferMoney) và cấu trúc XSD.',
        '2. Đóng gói XML (Marshalling): Tham số được chuyển thành cây XML đặt trong <soap:Body>, kèm thông tin xác thực trong <soap:Header>.',
        '3. Xác thực XSD & WS-Security: Server kiểm tra tính hợp lệ của không gian tên (xmlns) và kiểu dữ liệu XSD trước khi cho phép chạm vào logic nghiệp vụ.',
        '4. Phản hồi hoặc Phát sinh Fault: Kết quả trả về luôn là một <soap:Envelope> hợp lệ.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'SOAP Client',
        actionEn: 'Marshal SOAP Request Envelope',
        descriptionVi: 'Hệ thống ERP tạo bức điện XML gọi nghiệp vụ GetAccountBalance.',
        payloadExample: `<soap:Body><bank:GetAccountBalanceRequest><bank:AccountId>ACC-VN-8801</bank:AccountId></bank:GetAccountBalanceRequest></soap:Body>`,
      },
      {
        step: 2,
        actor: 'SOAP Endpoint',
        actionEn: 'Validate WSDL/XSD & WS-Security Header',
        descriptionVi: 'Kiểm tra WSSEToken trong <soap:Header> và cấu trúc thẻ theo file XSD.',
        payloadExample: `[XSD-VALIDATOR] Namespace http://corebanking.enterprise.vn/wsdl verified.`,
      },
      {
        step: 3,
        actor: 'Core Banking Service',
        actionEn: 'Execute Ledger Operation',
        descriptionVi: 'Truy vấn số dư tài khoản doanh nghiệp trong sổ cái Core Banking.',
        payloadExample: `Account ACC-VN-8801 -> AvailableBalance: 1,450,000,000 VND`,
      },
      {
        step: 4,
        actor: 'SOAP Endpoint → Client',
        actionEn: 'Return SOAP Response XML',
        descriptionVi: 'Đóng gói kết quả vào <bank:GetAccountBalanceResponse> trong <soap:Body>.',
        payloadExample: `<soap:Body><bank:GetAccountBalanceResponse><bank:AvailableBalance>1450000000</bank:AvailableBalance></bank:GetAccountBalanceResponse></soap:Body>`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Dịch vụ Ngân hàng Lõi (Core Banking Service: Số dư & Chuyển khoản)',
      scenarioDescriptionVi:
        'Kết nối hệ thống kế toán doanh nghiệp với cổng Core Banking qua hợp đồng SOAP 1.2 sử dụng các thao tác GetAccountBalance, TransferMoney và xử lý lỗi SOAP Fault.',
      codeExamples: [
        {
          titleVi: 'Cấu trúc Bức điện SOAP Request & WSDL Operation',
          language: 'xml',
          descriptionVi:
            'Bức điện SOAP 1.2 thực hiện lệnh chuyển tiền kèm khóa chống trùng lặp giao dịch trong phần Header.',
          code: `POST /ws/CoreBankingService HTTP/1.1
Host: gateway.corebank.vn
Content-Type: application/soap+xml; charset=utf-8

<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Header>
    <bank:AuthHeader>
      <bank:ChannelId>CORP_ERP_01</bank:ChannelId>
      <bank:TransactionIdempotencyKey>TXN-2026-8812</bank:TransactionIdempotencyKey>
    </bank:AuthHeader>
  </soap:Header>
  <soap:Body>
    <bank:TransferMoneyRequest>
      <bank:FromAccount>ACC-VN-8801</bank:FromAccount>
      <bank:ToAccount>ACC-VN-9920</bank:ToAccount>
      <bank:Amount>25000000</bank:Amount>
      <bank:Currency>VND</bank:Currency>
    </bank:TransferMoneyRequest>
  </soap:Body>
</soap:Envelope>`,
          annotations: [
            {
              lineHint: 'xmlns:soap & xmlns:bank',
              explanationVi:
                'Khai báo XML Namespaces giúp phân biệt thẻ khung giao thức (soap:) và thẻ nghiệp vụ ngân hàng (bank:).',
            },
            {
              lineHint: '<soap:Header>',
              explanationVi:
                'Tách biệt hoàn toàn Metadata xác thực và khóa Idempotency ra khỏi phần thân dữ liệu nghiệp vụ.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Hệ thống Thanh toán Liên ngân hàng & Core Banking',
        industry: 'Banking & Financial Services',
        descriptionVi:
          'Xử lý hạch toán tài khoản, bù trừ điện tử và tích hợp ERP tập đoàn.',
        whyItFitsVi:
          'Đòi hỏi xác thực lược đồ XML (XSD) tuyệt đối, chữ ký số cấp thông điệp (WS-Security) và giao dịch phân tán (ACID).',
      },
      {
        titleVi: 'Tích hợp Hệ thống Di sản (Legacy Enterprise Integration)',
        industry: 'Telecom / Aviation / Government',
        descriptionVi:
          'Kết nối các hệ thống quản lý cước viễn thông, đặt chỗ hàng không (GDS) đã vận hành ổn định hàng chục năm.',
        whyItFitsVi:
          'Hợp đồng WSDL bất biến đảm bảo tính tương thích ngược lâu dài giữa các tổ chức lớn.',
      },
    ],
    WhenNotToUseVi: [
      'Khi xây dựng ứng dụng Web SPA hoặc Mobile App hiện đại (parse XML nặng nề và tốn băng thông).',
      'Khi cần phát triển nhanh, linh hoạt thay đổi giao diện dữ liệu theo từng màn hình.',
    ],
    advantages: [
      'Hợp đồng dịch vụ WSDL + XSD cực kỳ chặt chẽ, phát hiện sai lệch kiểu dữ liệu ngay từ bước biên dịch.',
      'Hỗ trợ bộ tiêu chuẩn doanh nghiệp WS-Security (mã hóa/ký số từng phần tử XML) và WS-AtomicTransaction.',
      'Độc lập với giao thức truyền tải (chạy được trên HTTP, SMTP, JMS, MQ).',
      'Xử lý lỗi chuẩn hóa ở cấp giao thức với cấu trúc <soap:Fault>.',
    ],
    limitations: [
      'Kích thước gói tin XML rất lớn (Verbose), tiêu tốn băng thông gấp nhiều lần JSON hoặc Protobuf.',
      'Tốc độ phân tích cú pháp (XML Parsing/DOM) chậm và tốn CPU/RAM.',
      'Độ phức tạp cao khi cấu hình và gỡ lỗi từ phía trình duyệt Web.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'REST API',
        keyDifferenceVi:
          'SOAP là giao thức đóng gói thông điệp XML hướng hành động (Operation-centric); REST là phong cách kiến trúc hướng tài nguyên (Resource-centric) thường dùng JSON.',
        whenToChooseThisVi:
          'Khi tích hợp hệ thống tài chính/doanh nghiệp bắt buộc có WSDL, XSD và WS-Security.',
        whenToChooseOtherVi:
          'Khi phát triển Web/Mobile API hiện đại cần sự gọn nhẹ của JSON và khả năng HTTP Caching.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“SOAP đã chết và không còn hệ thống nào sử dụng.”',
        realityVi:
          'SOAP ít xuất hiện ở tầng Frontend, nhưng ở tầng Backend của các ngân hàng, bảo hiểm, hàng không và cổng thanh toán quốc tế, hàng tỷ giao dịch vẫn chạy qua SOAP/XML mỗi ngày.',
        technicalProofVi:
          'Nhiều cổng Open Banking hiện đại thực chất là lớp REST/JSON Wrapper bọc bên ngoài lõi SOAP Core Banking.',
      },
    ],
  },

  // ==========================================================================
  // MODULE 3: GRAPHQL API
  // ==========================================================================
  {
    id: 'graphql',
    order: 3,
    name: 'GraphQL API',
    taglineVi:
      'Ngôn ngữ truy vấn định kiểu mạnh cho phép Client yêu cầu chính xác cấu trúc dữ liệu mình cần trong một lần gọi.',
    technicalNature: 'Query Language & Runtime',
    technicalNatureVi: 'Ngôn ngữ truy vấn & Runtime thực thi phía Server (Query Language & API Runtime)',
    accentColor: '#EC4899',
    badgeClass: 'border-pink-500/40 bg-pink-950/60 text-pink-300',
    borderClass: 'border-pink-500/40',
    glowClass: 'shadow-pink-950/50',
    introduction: {
      hookVi:
        'Được Facebook phát triển năm 2012 và mã nguồn mở năm 2015, GraphQL trao quyền cho Client chủ động mô tả hình dáng (Shape) của dữ liệu JSON mà nó muốn nhận về.',
      problemSolvedVi:
        'Giải quyết triệt để hai bài toán kinh điển của REST khi ứng dụng mở rộng: Over-fetching (tải thừa hàng chục trường không dùng đến) và Under-fetching (phải gọi 4–5 REST Endpoints liên tiếp mới đủ dữ liệu vẽ 1 màn hình).',
      historicalContextVi:
        'Ra đời khi Facebook chuyển dịch sang ứng dụng Mobile Native trên mạng di động chậm, nơi mỗi kilobyte thừa và mỗi vòng lặp mạng (Round-trip) đều làm giảm trải nghiệm người dùng.',
      coexistenceNoteVi:
        'GraphQL không nhất thiết phải thay thế REST hay gRPC. Mô hình phổ biến nhất là đặt GraphQL làm tầng tổng hợp dữ liệu (API Aggregation / BFF), bên dưới các Resolvers sẽ gọi sang các REST Services hoặc gRPC Microservices hiện có.',
    },
    coreConcepts: [
      {
        termEn: 'Strongly Typed Schema (SDL)',
        titleVi: 'Lược đồ Định kiểu Mạnh (GraphQL Schema)',
        summaryVi:
          'Trái tim của mọi GraphQL Server là Schema được viết bằng SDL (Schema Definition Language), định nghĩa toàn bộ các Types, Fields và mối quan hệ giữa chúng.',
        deepDiveVi:
          'Dấu chấm than (!) như String! hay ID! biểu thị trường bắt buộc khác null (Non-nullable). Client có thể tự khám phá toàn bộ Schema qua cơ chế Introspection.',
        codeSnippet: `type Student {
  id: ID!
  fullName: String!
  gpa: Float!
  department: Department!
  courses: [Course!]!
}`,
      },
      {
        termEn: 'Queries & Mutations',
        titleVi: 'Truy vấn Đọc (Query) và Thao tác Ghi (Mutation)',
        summaryVi:
          'Query dùng để đọc dữ liệu (các trường chạy song song được); Mutation dùng để thêm/sửa/xóa dữ liệu (các trường chạy tuần tự để đảm bảo an toàn trạng thái) và vẫn cho phép chọn các trường muốn nhận lại sau khi sửa.',
        deepDiveVi:
          'Khác với REST dùng nhiều URL, cả Query và Mutation thường được gửi qua một Endpoint duy nhất (POST /graphql).',
      },
      {
        termEn: 'Resolvers & Execution Tree',
        titleVi: 'Hàm Phân giải (Resolvers)',
        summaryVi:
          'Mỗi trường (Field) trong Schema được gắn với một hàm Resolver trên Server chịu trách nhiệm lấy dữ liệu thực tế cho trường đó (từ SQL, NoSQL, hay một REST/gRPC API khác).',
        deepDiveVi:
          'Nếu Client KHÔNG yêu cầu trường department trong câu Query, hàm Resolver của department sẽ KHÔNG bao giờ bị gọi — tiết kiệm tài nguyên tính toán cho Server.',
      },
      {
        termEn: 'Nested Queries & Arguments',
        titleVi: 'Truy vấn Lồng nhau (Nested Queries) & Tham số (Arguments)',
        summaryVi:
          'Client có thể đi xuyên qua đồ thị quan hệ (Student → Department, Student → Courses → Grade) ngay trong 1 câu truy vấn duy nhất và truyền tham số cho bất kỳ trường nào.',
        deepDiveVi:
          'Giúp thay thế chuỗi gọi N+1 requests từ phía mạng Client bằng một lần truyền tải duy nhất.',
      },
      {
        termEn: 'Over-fetching & Under-fetching',
        titleVi: 'Giải quyết Over-fetching và Under-fetching',
        summaryVi:
          'Over-fetching là nhận về nhiều dữ liệu hơn mức cần thiết; Under-fetching là 1 endpoint trả về không đủ dữ liệu khiến Client phải gọi thêm nhiều endpoints phụ.',
        deepDiveVi:
          'Với GraphQL, hình dáng JSON trả về khớp 100% từng trường với câu Query mà Client đã gửi lên.',
      },
    ],
    architecture: {
      summaryVi:
        'Luồng phân giải đồ thị: Client → GraphQL Query → GraphQL Server (Parser & Schema Validator) → Field Resolvers → Multiple Data Sources → Tailored JSON Response.',
      nodes: [
        {
          id: 'gql-client',
          label: 'Web / Mobile App',
          sublabel: 'Declarative Query',
          role: 'client',
          descriptionVi: 'Chỉ định chính xác các trường dữ liệu cần lấy trong câu Query.',
          techDetails: 'Apollo / Relay / Fetch POST /graphql',
        },
        {
          id: 'gql-server',
          label: 'GraphQL Execution Engine',
          sublabel: 'Schema & AST Parser',
          role: 'gateway',
          descriptionVi: 'Phân tích cú pháp câu Query thành AST và đối chiếu với Schema.',
          techDetails: 'GraphQL Runtime & Type Validator',
        },
        {
          id: 'gql-resolvers',
          label: 'Field Resolvers Tree',
          sublabel: 'Student / Course / Grade',
          role: 'server',
          descriptionVi: 'Chỉ kích hoạt các hàm Resolver tương ứng với các trường có trong Query.',
          techDetails: 'DataLoader & Resolver Functions',
        },
        {
          id: 'gql-sources',
          label: 'Data Sources (DB & Services)',
          sublabel: 'PostgreSQL + Microservices',
          role: 'database',
          descriptionVi: 'Nguồn dữ liệu đa dạng: Cơ sở dữ liệu sinh viên, dịch vụ đào tạo, dịch vụ điểm.',
          techDetails: 'SQL DB + Internal REST/gRPC',
        },
      ],
      edges: [
        {
          id: 'g1',
          from: 'gql-client',
          to: 'gql-server',
          label: 'POST /graphql { query }',
          protocol: 'HTTP POST / JSON',
        },
        {
          id: 'g2',
          from: 'gql-server',
          to: 'gql-resolvers',
          label: 'Traverse Requested Fields',
          protocol: 'AST Execution',
        },
        {
          id: 'g3',
          from: 'gql-resolvers',
          to: 'gql-sources',
          label: 'Batch Fetch Only Needed Data',
          protocol: 'SQL / RPC',
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'GraphQL Runtime hoạt động như một bộ thông dịch truy vấn thông minh đứng giữa Client và các nguồn dữ liệu.',
      internalMechanismVi: [
        '1. Parse (Phân tích cú pháp): Chuyển chuỗi văn bản GraphQL Query của Client thành cây cú pháp trừu tượng (AST - Abstract Syntax Tree).',
        '2. Validate (Kiểm tra lược đồ): Đối chiếu AST với GraphQL Schema; nếu Client hỏi một trường không tồn tại, từ chối ngay trước khi chạy code.',
        '3. Execute (Thực thi cây Resolver): Duyệt từ gốc (Query) xuống từng nhánh trường con, gọi hàm Resolver tương ứng và gom kết quả.',
        '4. Assemble Response: Ghép kết quả vào khóa "data" (và "errors" nếu có trường lỗi cục bộ) theo đúng cấu trúc cây mà Client yêu cầu.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Client',
        actionEn: 'Send GraphQL Query via POST /graphql',
        descriptionVi:
          'Ứng dụng cổng thông tin sinh viên chỉ yêu cầu id, fullName, gpa và tên Khoa của sinh viên SV-101.',
        payloadExample: `query { student(id: "SV-101") { id fullName gpa department { name } } }`,
      },
      {
        step: 2,
        actor: 'GraphQL Server',
        actionEn: 'Parse AST & Validate Against Schema',
        descriptionVi:
          'Kiểm tra kiểu Student có các trường id, fullName, gpa, department hay không.',
        payloadExample: `[SCHEMA CHECK] Valid Query AST. Fields to resolve: 4.`,
      },
      {
        step: 3,
        actor: 'Resolvers',
        actionEn: 'Resolve Only Requested Fields',
        descriptionVi:
          'Chạy Query.student và Student.department; bỏ qua hoàn toàn CourseService và GradeService vì Client không hỏi.',
        payloadExample: `Resolved: Student("SV-101") + Department("DEPT-CS")`,
      },
      {
        step: 4,
        actor: 'GraphQL Server → Client',
        actionEn: 'Return Exact Shape JSON',
        descriptionVi:
          'Trả về đối tượng JSON khớp 100% với cấu trúc câu truy vấn.',
        payloadExample: `{"data":{"student":{"id":"SV-101","fullName":"Trần Hoàng Minh","gpa":3.82,"department":{"name":"Khoa Khoa học Máy tính & Trí tuệ Nhân tạo"}}}}`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Hệ thống Quản lý Đại học (University Management System)',
      scenarioDescriptionVi:
        'Mô hình hóa các thực thể Student, Course, Department, Grade trong một GraphQL Schema thống nhất cho phép lấy hồ sơ học tập đa tầng chỉ trong 1 request.',
      codeExamples: [
        {
          titleVi: 'GraphQL Schema, Query Lồng nhau & Mutation Cập nhật Điểm',
          language: 'graphql',
          descriptionVi:
            'So sánh cách Client lấy đúng các trường cần thiết và thực hiện Mutation cập nhật điểm GPA.',
          code: `# 1. Định nghĩa Schema (SDL)
type Department {
  id: ID!
  name: String!
}

type CourseEnrollment {
  code: String!
  title: String!
  credits: Int!
  grade: String
}

type Student {
  id: ID!
  fullName: String!
  gpa: Float!
  department: Department!
  courses: [CourseEnrollment!]!
}

# 2. Truy vấn lồng nhau (Nested Query) từ Client
query GetStudentTranscript($studentId: ID!) {
  student(id: $studentId) {
    fullName
    gpa
    department {
      name
    }
    courses {
      code
      title
      grade
    }
  }
}

# 3. Thao tác cập nhật dữ liệu (Mutation)
mutation UpdateGpa {
  updateStudentGpa(studentId: "SV-101", newGpa: 3.90) {
    id
    fullName
    gpa
  }
}`,
          annotations: [
            {
              lineHint: 'courses { code title grade }',
              explanationVi:
                'Client lấy luôn danh sách môn học và điểm số trong cùng 1 request mà không cần gọi thêm endpoint /students/101/courses.',
            },
            {
              lineHint: 'mutation UpdateGpa',
              explanationVi:
                'Ngay sau khi cập nhật GPA, Client chỉ định luôn các trường (id, fullName, gpa) muốn nhận lại để cập nhật UI.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Nền tảng Đa giao diện (Web, Mobile, Tablet, TV) & BFF',
        industry: 'Social Media / E-Learning / E-Commerce',
        descriptionVi:
          'Màn hình Mobile chỉ cần 3 trường tóm tắt trong khi màn hình Web Dashboard cần 20 trường chi tiết cùng 1 thực thể.',
        whyItFitsVi:
          'Backend không phải viết hàng chục REST endpoints tùy chỉnh cho từng màn hình; mỗi Client tự truy vấn tập trường phù hợp.',
      },
      {
        titleVi: 'Hệ thống Tổng hợp Dữ liệu Đa nguồn (Data Aggregation Layer)',
        industry: 'Fintech / Enterprise Portals',
        descriptionVi:
          'Hợp nhất dữ liệu từ nhiều Microservices (User, Billing, Recommendation) sau một cổng đồ thị thống nhất.',
        whyItFitsVi:
          'Client chỉ cần biết 1 GraphQL Schema duy nhất; các Resolvers lo việc gom dữ liệu từ nhiều dịch vụ phía sau.',
      },
    ],
    WhenNotToUseVi: [
      'Các API CRUD đơn giản chỉ có vài thực thể phẳng (dùng REST nhanh và đơn giản hơn nhiều).',
      'Khi hệ thống phụ thuộc nặng vào HTTP Caching ở tầng CDN dựa trên URL (vì GraphQL gửi mọi truy vấn qua POST /graphql).',
      'Truyền tải file dung lượng lớn hoặc luồng nhị phân thuần túy.',
    ],
    advantages: [
      'Không còn Over-fetching hay Under-fetching: Tiết kiệm băng thông và giảm số lần gọi mạng.',
      'Schema định kiểu mạnh đóng vai trò tài liệu sống (Self-documenting) và hỗ trợ sinh Type tự động cho Frontend.',
      'Phát triển sản phẩm linh hoạt mà không cần chia phiên bản URL (/v1, /v2) liên tục.',
    ],
    limitations: [
      'Bài toán N+1 Query ở tầng Database nếu lập trình viên Backend không sử dụng kỹ thuật gom nhóm truy vấn (DataLoader).',
      'Khó tận dụng HTTP Caching mặc định của trình duyệt/CDN hơn REST GET.',
      'Nguy cơ bảo mật DoS nếu không giới hạn độ sâu truy vấn (Query Depth Limiting) khi Client gửi truy vấn lồng nhau vô tận.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'REST API',
        keyDifferenceVi:
          'Trong REST, Server quyết định hình dáng dữ liệu trả về tại mỗi Endpoint; trong GraphQL, Server định nghĩa khả năng (Schema) còn Client quyết định dữ liệu thực tế trả về.',
        whenToChooseThisVi:
          'Khi dữ liệu có tính liên kết đồ thị phức tạp và nhiều ứng dụng Client cần tối ưu hóa payload.',
        whenToChooseOtherVi:
          'Khi cần kiến trúc đơn giản, tận dụng tối đa HTTP Caching, Status Codes chuẩn và Rate Limiting theo URL.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“GraphQL là một ngôn ngữ truy vấn trực tiếp vào Database (thay thế cho SQL).”',
        realityVi:
          'Hoàn toàn sai! GraphQL hoàn toàn độc lập với Database. Nó là tầng API Runtime; dữ liệu bên dưới Resolver có thể lấy từ PostgreSQL, MongoDB, Redis hay thậm chí gọi sang một REST API khác.',
        technicalProofVi:
          'Đặc tả GraphQL Specification chỉ định nghĩa cú pháp truy vấn và thuật toán thực thi Resolver trên tầng ứng dụng.',
      },
    ],
  },

  // ==========================================================================
  // MODULE 4: gRPC API
  // ==========================================================================
  {
    id: 'grpc',
    order: 4,
    name: 'gRPC API',
    taglineVi:
      'Khung gọi thủ tục từ xa hiệu năng cao sử dụng tuần tự hóa nhị phân Protocol Buffers trên nền giao thức HTTP/2.',
    technicalNature: 'RPC Framework',
    technicalNatureVi: 'Khung gọi thủ tục từ xa hiệu năng cao (High-Performance RPC Framework)',
    accentColor: '#10B981',
    badgeClass: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-emerald-950/50',
    introduction: {
      hookVi:
        'Được Google phát triển (tiền thân là hệ thống Stubby nội bộ xử lý hàng chục tỷ RPC mỗi giây) và tặng cho CNCF, gRPC cho phép một ứng dụng gọi hàm nằm trên một máy chủ khác dễ dàng và chặt chẽ như gọi một hàm cục bộ trong cùng bộ nhớ.',
      problemSolvedVi:
        'Khi một hệ thống phân tách thành hàng chục Microservices, việc serialize/deserialize văn bản JSON liên tục qua HTTP/1.1 tạo ra độ trễ lớn và ngốn CPU. gRPC giải quyết bằng định dạng nhị phân siêu gọn (Protocol Buffers) và luồng đa hợp HTTP/2.',
      historicalContextVi:
        'Ra mắt năm 2015, gRPC đã trở thành tiêu chuẩn vàng cho giao tiếp nội bộ (East-West Traffic) trong các hệ thống Cloud-Native, Kubernetes, Docker và Microservices quy mô lớn.',
      coexistenceNoteVi:
        'Do trình duyệt Web không hỗ trợ đầy đủ việc kiểm soát khung HTTP/2 thô của gRPC, kiến trúc chuẩn là: Trình duyệt gọi REST hoặc GraphQL tới API Gateway, sau đó Gateway và các Microservices bên trong gọi nhau bằng gRPC.',
    },
    coreConcepts: [
      {
        termEn: 'Remote Procedure Call (RPC) & Client Stub',
        titleVi: 'Gọi Thủ tục Từ xa & Cơ chế Client Stub',
        summaryVi:
          'Thay vì tự ghép chuỗi URL và parse JSON, lập trình viên gọi trực tiếp hàm có định kiểu như paymentClient.processPayment(request).',
        deepDiveVi:
          'Trình biên dịch protoc tự động sinh ra Client Stub (ở phía gọi) và Server Skeleton (ở phía nhận) cho hơn 10 ngôn ngữ (Go, Java, Python, TypeScript, Rust, C++).',
      },
      {
        termEn: 'Protocol Buffers (.proto & Binary Serialization)',
        titleVi: 'Hợp đồng .proto & Tuần tự hóa Nhị phân',
        summaryVi:
          'Mọi dịch vụ và thông điệp phải được định nghĩa trước trong file .proto. Mỗi trường được gán một mã số định danh duy nhất (Field Number: 1, 2, 3...).',
        deepDiveVi:
          'Khi truyền qua mạng, Protobuf KHÔNG gửi chuỗi tên trường như "order_id" hay "amount_vnd", mà chỉ gửi byte Tag (kết hợp Field Number + Wire Type) và giá trị nhị phân đã nén (Varint), giúp giảm dung lượng gói tin từ 60% đến 80% so với JSON.',
        codeSnippet: `message PaymentRequest {
  string order_id = 1;
  int64 amount_vnd = 2;
  string currency = 3;
}`,
      },
      {
        termEn: 'Four RPC Communication Patterns',
        titleVi: '4 Mô hình Giao tiếp RPC (Unary & 3 chế độ Streaming)',
        summaryVi:
          'Nhờ chạy trên HTTP/2, gRPC hỗ trợ tự nhiên 4 kiểu giao tiếp: Unary RPC (1-1), Server Streaming (1-N), Client Streaming (N-1) và Bidirectional Streaming (N-N).',
        deepDiveVi:
          'Trong Bidirectional Streaming, cả Client và Server có thể gửi các luồng tin nhắn độc lập song song trên cùng một kết nối TCP duy nhất mà không cần chờ bên kia trả lời xong.',
      },
      {
        termEn: 'HTTP/2 Framing & Multiplexing',
        titleVi: 'Đa hợp Luồng trên HTTP/2 (Multiplexing & HPACK)',
        summaryVi:
          'gRPC bắt buộc sử dụng HTTP/2 làm tầng giao vận, cho phép gửi hàng trăm lệnh gọi RPC đồng thời trên một kết nối TCP duy nhất mà không bị nghẽn đầu hàng (Head-of-Line Blocking ở tầng HTTP).',
        deepDiveVi:
          'Headers được nén bằng thuật toán HPACK và mã trạng thái kết quả (grpc-status: 0) được gửi qua HTTP/2 Trailing Headers.',
      },
    ],
    architecture: {
      summaryVi:
        'Chuỗi thực thi nhị phân: Client Application → gRPC Stub → Protobuf Binary Serialization → HTTP/2 Multiplexed Stream → gRPC Server → Service Implementation.',
      nodes: [
        {
          id: 'grpc-client',
          label: 'Order Microservice',
          sublabel: 'Caller Application',
          role: 'client',
          descriptionVi: 'Gọi hàm từ xa thông qua đối tượng Stub sinh tự động từ file .proto.',
          techDetails: 'Generated gRPC Client Stub',
        },
        {
          id: 'grpc-proto',
          label: 'Protobuf Serializer',
          sublabel: 'Binary Wire Encoder',
          role: 'contract',
          descriptionVi: 'Mã hóa cấu trúc dữ liệu thành luồng byte nhị phân Tag-Length-Value siêu nhẹ.',
          techDetails: 'Protocol Buffers v3 (protoc)',
        },
        {
          id: 'grpc-http2',
          label: 'HTTP/2 Transport Channel',
          sublabel: 'Multiplexed Frames',
          role: 'gateway',
          descriptionVi: 'Truyền tải các khung DATA và HEADERS song song trên 1 kết nối TCP bền vững.',
          techDetails: 'HTTP/2 Streams + HPACK',
        },
        {
          id: 'grpc-server',
          label: 'Payment & Inventory Services',
          sublabel: 'gRPC Server Skeleton',
          role: 'server',
          descriptionVi: 'Giải mã byte nhị phân và gọi hàm cài đặt nghiệp vụ tương ứng.',
          techDetails: 'gRPC Server Runtime',
        },
      ],
      edges: [
        {
          id: 'r1',
          from: 'grpc-client',
          to: 'grpc-proto',
          label: 'Invoke Local Stub Method',
          protocol: 'Typed Struct',
        },
        {
          id: 'r2',
          from: 'grpc-proto',
          to: 'grpc-http2',
          label: 'Binary Payload [0x0A 0x08...]',
          protocol: 'Protobuf Wire',
        },
        {
          id: 'r3',
          from: 'grpc-http2',
          to: 'grpc-server',
          label: 'HTTP/2 DATA Frame (Unary / Stream)',
          protocol: 'HTTP/2 over TCP',
          bidirectional: true,
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'gRPC tuân theo triết lý Contract-First: Hợp đồng file .proto là nguồn chân lý duy nhất để sinh mã nguồn cho mọi dịch vụ.',
      internalMechanismVi: [
        '1. Biên dịch Hợp đồng (.proto): Lập trình viên định nghĩa service và message trong file .proto, chạy protoc để sinh mã nguồn Stub cho các ngôn ngữ đích.',
        '2. Tuần tự hóa Nhị phân (Protobuf Encoding): Khi hàm Stub được gọi, đối tượng được mã hóa thành mảng byte nhị phân dựa trên Field Numbers.',
        '3. Đóng khung HTTP/2: Dữ liệu nhị phân được gắn tiền tố 5-byte (1 byte cờ nén + 4 byte độ dài message) và đẩy vào HTTP/2 DATA Frame.',
        '4. Giải mã & Thực thi: Server đọc 5-byte prefix, khôi phục lại Struct từ luồng byte và thực thi hàm nghiệp vụ.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Order Service (Stub)',
        actionEn: 'Call stub.ProcessPayment(req)',
        descriptionVi: 'Order Service gọi hàm thanh toán cho đơn hàng ORD-2026.',
        payloadExample: `PaymentRequest { order_id: "ORD-2026", amount_vnd: 900000, currency: "VND" }`,
      },
      {
        step: 2,
        actor: 'Protobuf Encoder',
        actionEn: 'Serialize to Binary Wire Format',
        descriptionVi: 'Chuyển các trường số 1, 2, 3 thành chuỗi byte nhị phân (chỉ 34 bytes).',
        payloadExample: `Hex Wire: 0A 08 4F 52 44 2D 32 30 32 36 10 80 F7 36 1A 03 56 4E 44`,
      },
      {
        step: 3,
        actor: 'HTTP/2 Transport',
        actionEn: 'Transmit HEADERS & DATA Frames',
        descriptionVi: 'Truyền qua đường dẫn POST /commerce.PaymentService/ProcessPayment trên HTTP/2.',
        payloadExample: `:method: POST | :path: /commerce.PaymentService/ProcessPayment | content-type: application/grpc`,
      },
      {
        step: 4,
        actor: 'Payment Service → Order Service',
        actionEn: 'Return Binary Response & Trailing Status',
        descriptionVi: 'Giải mã kết quả và xác nhận trạng thái thành công grpc-status: 0.',
        payloadExample: `PaymentResponse { transaction_id: "TXN-9921", status: APPROVED } | grpc-status: 0`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Giao tiếp Liên dịch vụ (Order Service ⇄ Payment & Inventory Microservices)',
      scenarioDescriptionVi:
        'Định nghĩa hợp đồng commerce.proto cho phép Order Service gọi Unary RPC sang Payment Service và theo dõi luồng xử lý kho hàng qua Server Streaming.',
      codeExamples: [
        {
          titleVi: 'Định nghĩa Hợp đồng commerce.proto (Protobuf v3)',
          language: 'protobuf',
          descriptionVi:
            'File .proto định nghĩa rõ 4 mô hình RPC giữa Order, Payment và Inventory Service.',
          code: `syntax = "proto3";
package commerce.v1;

service OrderPaymentService {
  // 1. Unary RPC: Gửi 1 yêu cầu thanh toán, nhận 1 kết quả
  rpc ProcessPayment (PaymentRequest) returns (PaymentResponse);

  // 2. Server Streaming: Theo dõi tiến độ xử lý đơn hàng theo thời gian thực
  rpc WatchOrderFulfillment (OrderQuery) returns (stream FulfillmentEvent);

  // 3. Client Streaming: Kho hàng đẩy luồng biến động tồn kho lên Server
  rpc UploadStockTelemetry (stream StockDelta) returns (BatchSyncSummary);

  // 4. Bidirectional Streaming: Chấm điểm rủi ro gian lận hai chiều tức thời
  rpc LiveFraudScoring (stream TransactionSignal) returns (stream RiskDecision);
}

message PaymentRequest {
  string order_id = 1;
  int64 amount_vnd = 2;
  string currency = 3;
}

message PaymentResponse {
  string transaction_id = 1;
  bool approved = 2;
}`,
          annotations: [
            {
              lineHint: 'string order_id = 1;',
              explanationVi:
                'Con số = 1, = 2 là Field Tag được truyền dưới dạng byte nhị phân trên mạng thay cho tên biến dài dòng.',
            },
            {
              lineHint: 'returns (stream FulfillmentEvent)',
              explanationVi:
                'Từ khóa stream kích hoạt chế độ truyền luồng liên tục trên một kết nối HTTP/2.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Giao tiếp Nội bộ giữa các Microservices (Internal Service-to-Service)',
        industry: 'Cloud-Native / Fintech / Ride-Hailing',
        descriptionVi:
          'Kết nối hàng chục dịch vụ viết bằng Go, Java, Python, Node.js trong cụm Kubernetes.',
        whyItFitsVi:
          'Độ trễ cực thấp, tiết kiệm CPU/Băng thông và sinh code tự động đảm bảo an toàn kiểu dữ liệu xuyên ngôn ngữ (Polyglot).',
      },
      {
        titleVi: 'Hệ thống IoT Telemetry & Luồng Dữ liệu Thời gian thực',
        industry: 'IoT / Financial Trading / AI Inference',
        descriptionVi:
          'Truyền luồng dữ liệu cảm biến hoặc gọi mô hình AI Inference với tần suất cao.',
        whyItFitsVi:
          'Khả năng Streaming hai chiều trên HTTP/2 và gói tin nhị phân siêu nhỏ.',
      },
    ],
    WhenNotToUseVi: [
      'Khi gọi trực tiếp từ trình duyệt Web mà không muốn dựng thêm proxy chuyển đổi gRPC-Web.',
      'Khi xây dựng Public API cho cộng đồng bên ngoài muốn test nhanh bằng cURL hoặc Postman với văn bản JSON dễ đọc.',
    ],
    advantages: [
      'Hiệu năng vượt trội: Gói tin nhị phân Protobuf nhỏ hơn 3–5 lần và tốc độ serialize nhanh hơn 5–10 lần so với JSON.',
      'Hỗ trợ sẵn 4 mô hình giao tiếp (Unary, Server/Client/Bidirectional Streaming) nhờ HTTP/2.',
      'Hợp đồng .proto nghiêm ngặt và tự động sinh Client Stub cho đa ngôn ngữ.',
      'Tích hợp sẵn cơ chế Deadline/Timeout, Cancellation và chuẩn mã lỗi gRPC riêng biệt.',
    ],
    limitations: [
      'Dữ liệu nhị phân không thể đọc trực tiếp bằng mắt thường khi bắt gói tin mạng (cần file .proto để decode).',
      'Hạn chế hỗ trợ trực tiếp trên trình duyệt Web (do Browser Fetch API chưa cho phép kiểm soát toàn diện HTTP/2 Frames).',
    ],
    relatedComparisons: [
      {
        comparedWith: 'REST API',
        keyDifferenceVi:
          'gRPC tối ưu cho giao tiếp máy-với-máy tốc độ cao bằng nhị phân Protobuf và Streaming; REST tối ưu cho tính chuẩn hóa tài nguyên và khả năng đọc hiểu rộng rãi bằng JSON.',
        whenToChooseThisVi:
          'Giao tiếp nội bộ giữa các Microservices hoặc hệ thống cần Streaming hiệu năng cao.',
        whenToChooseOtherVi:
          'Giao tiếp từ trình duyệt Web/Mobile ra cổng API Gateway hoặc Public API.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“gRPC luôn tốt hơn REST nên cần thay thế toàn bộ REST bằng gRPC ở mọi tầng.”',
        realityVi:
          'Dùng gRPC trực tiếp cho trình duyệt Web đòi hỏi cấu hình Envoy/gRPC-Web Proxy phức tạp và mất đi sự tiện lợi của JSON Inspector trên Browser DevTools.',
        technicalProofVi:
          'Kiến trúc thực tế tốt nhất là kết hợp cả hai: REST/GraphQL cho North-South Traffic (Client ↔ Gateway) và gRPC cho East-West Traffic (Microservice ↔ Microservice).',
      },
    ],
  },
];
