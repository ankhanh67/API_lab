import {
  HttpMethod,
  SimulatedApiResponse,
  UniversalLifecycleStep,
  CommunicationEvent,
} from '@/types/api';

// ============================================================================
// 1. UNIVERSAL 8-STEP REQUEST/RESPONSE SIMULATOR ENGINE
// ============================================================================

export type UniversalSimScenarioMode =
  | 'normal-200'
  | 'create-201'
  | 'bad-request-400'
  | 'unauthorized-401'
  | 'server-error-500';

export interface UniversalSimConfig {
  method: HttpMethod;
  endpoint: string;
  authHeader: string;
  requestBody: string;
  mode: UniversalSimScenarioMode;
}

export function buildUniversalLifecycleSteps(
  config: UniversalSimConfig
): UniversalLifecycleStep[] {
  const isError401 = config.mode === 'unauthorized-401' || !config.authHeader.trim();
  const isError400 = config.mode === 'bad-request-400';
  const isError500 = config.mode === 'server-error-500';

  const statusText = isError401
    ? '401 Unauthorized'
    : isError400
    ? '400 Bad Request'
    : isError500
    ? '500 Internal Server Error'
    : config.method === 'POST' || config.mode === 'create-201'
    ? '201 Created'
    : '200 OK';

  return [
    {
      stepNumber: 1,
      titleEn: 'Step 1: Client constructs a request',
      titleVi: 'Bước 1: Client khởi tạo và đóng gói Request',
      activeComponent: 'client',
      direction: 'internal',
      shortExplanationVi:
        'Ứng dụng Client thu thập dữ liệu, thiết lập HTTP Method, URI Endpoint, Headers và tuần tự hóa (Serialize) dữ liệu sang JSON.',
      technicalMechanismVi:
        'In-memory JavaScript Object được chuyển đổi qua JSON.stringify() thành chuỗi UTF-8 và gắn kèm Header Content-Type: application/json.',
      communicationState: 'CLIENT_PREPARING_PAYLOAD',
      payloadSnapshot: `${config.method} ${config.endpoint}\nAuthorization: ${
        config.authHeader || '(Missing)'
      }\nContent-Type: application/json\n\n${config.requestBody}`,
    },
    {
      stepNumber: 2,
      titleEn: 'Step 2: Client sends the request',
      titleVi: 'Bước 2: Client truyền gói tin Request qua mạng',
      activeComponent: 'client',
      targetComponent: 'api-layer',
      direction: 'request',
      shortExplanationVi:
        'Gói tin HTTP được đẩy xuống tầng giao vận TCP/TLS và di chuyển qua đường truyền mạng tới địa chỉ của API Layer.',
      technicalMechanismVi:
        'Thiết lập kết nối TCP + TLS Handshake; dữ liệu được chia thành các TCP segments mang HTTP Request Line, Headers và Body.',
      communicationState: 'IN_FLIGHT_TO_API_LAYER',
      payloadSnapshot: `[TCP/TLS STREAM -> api.lab.local:443]\n>>> ${config.method} ${config.endpoint} HTTP/1.1`,
    },
    {
      stepNumber: 3,
      titleEn: 'Step 3: API receives and validates the request',
      titleVi: 'Bước 3: Tầng API tiếp nhận, xác thực & kiểm tra Schema',
      activeComponent: 'api-layer',
      direction: 'internal',
      shortExplanationVi: isError401
        ? 'Tầng API phát hiện thiếu hoặc sai thông tin xác thực (Authorization Header) và chặn yêu cầu ngay tại cửa ngõ!'
        : isError400
        ? 'Tầng API giải mã JSON và phát hiện dữ liệu vi phạm Schema Validation (400 Bad Request)!'
        : 'API Gateway định tuyến URI, xác thực chữ ký Token hợp lệ và kiểm tra Schema dữ liệu đầu vào thành công.',
      technicalMechanismVi:
        'Middleware chạy tuần tự: Rate Limiter → Auth Verifier → JSON Deserializer → Schema Validator.',
      communicationState: isError401
        ? 'REJECTED_AT_AUTH_MIDDLEWARE (401)'
        : isError400
        ? 'REJECTED_AT_SCHEMA_VALIDATOR (400)'
        : 'VALIDATED_FORWARDING_TO_SERVER',
      payloadSnapshot: isError401
        ? `[AUTH ERROR] Missing or invalid Bearer token.\nShort-circuiting pipeline -> 401 Unauthorized`
        : isError400
        ? `[VALIDATION ERROR] Field "price" must be a positive number.\nShort-circuiting pipeline -> 400 Bad Request`
        : `[GATEWAY PASS] Auth OK | Schema OK | Route -> Controller`,
    },
    {
      stepNumber: 4,
      titleEn: 'Step 4: Server executes business logic',
      titleVi: 'Bước 4: Server thực thi Logic Nghiệp vụ (Business Logic)',
      activeComponent: 'server',
      direction: 'internal',
      shortExplanationVi:
        isError401 || isError400
          ? 'Bước này bị bỏ qua (Skipped) do tầng API đã từ chối yêu cầu ở Bước 3 nhằm bảo vệ tài nguyên Server.'
          : 'Application Server thực thi các quy tắc nghiệp vụ: kiểm tra quyền hạn chi tiết, tính toán giá trị và chuẩn bị câu lệnh truy vấn.',
      technicalMechanismVi:
        'Domain Service xử lý đối tượng đã Deserialize trong bộ nhớ RAM, áp dụng quy tắc miền (Domain Rules).',
      communicationState:
        isError401 || isError400 ? 'SKIPPED_BY_EARLY_RETURN' : 'EXECUTING_DOMAIN_LOGIC',
      payloadSnapshot:
        isError401 || isError400
          ? '// Skipped: Request did not pass API Layer validation.'
          : `[DomainService] Executing handler for ${config.method} ${config.endpoint}\n[RuleCheck] Inventory & user quota rules satisfied.`,
    },
    {
      stepNumber: 5,
      titleEn: 'Step 5: Server interacts with the database',
      titleVi: 'Bước 5: Server truy vấn / ghi Cơ sở dữ liệu (Database)',
      activeComponent: 'database',
      direction: 'internal',
      shortExplanationVi:
        isError401 || isError400
          ? 'Không có tương tác Database nào xảy ra (tiết kiệm I/O vì yêu cầu không hợp lệ).'
          : isError500
          ? 'Lỗi kết nối hoặc xung đột khóa trong Database khi thực thi câu lệnh SQL (500 Internal Server Error)!'
          : 'Database thực thi truy vấn đọc hoặc giao dịch ACID (Transaction) để lưu trữ dữ liệu bền vững và trả bản ghi về Server.',
      technicalMechanismVi:
        'Connection Pool cấp phát kết nối tới PostgreSQL/Storage Engine; thực thi Prepared Statement.',
      communicationState:
        isError401 || isError400
          ? 'DB_IDLE'
          : isError500
          ? 'DB_TRANSACTION_FAILED (ROLLBACK)'
          : 'DB_QUERY_COMMITTED',
      payloadSnapshot:
        isError401 || isError400
          ? '-- No SQL executed'
          : isError500
          ? `ERROR: deadlock detected or connection timeout on table "records"\nROLLBACK TRANSACTION;`
          : config.method === 'GET'
          ? `SELECT id, name, price, stock FROM products WHERE active = true LIMIT 10;\n-- Returned 3 rows in 2.4ms`
          : `BEGIN;\nINSERT INTO records (payload, created_at) VALUES ('${config.requestBody.replace(
              /\s+/g,
              ' '
            )}', NOW()) RETURNING id;\nCOMMIT;`,
    },
    {
      stepNumber: 6,
      titleEn: 'Step 6: Server generates a response',
      titleVi: 'Bước 6: Server khởi tạo gói tin Phản hồi (Response)',
      activeComponent: 'server',
      direction: 'internal',
      shortExplanationVi:
        'Server đóng gói kết quả (hoặc thông báo lỗi chuẩn hóa) vào cấu trúc DTO, gắn mã trạng thái HTTP Status Code và Serialize sang JSON.',
      technicalMechanismVi:
        'Ánh xạ kết quả sang Response Object, gán HTTP Status (' +
        statusText +
        ') và tính toán Content-Length.',
      communicationState: 'SERIALIZING_RESPONSE_DTO',
      payloadSnapshot: isError401
        ? `{"error":"UNAUTHORIZED","message":"Token xác thực không hợp lệ hoặc bị thiếu.","status":401}`
        : isError400
        ? `{"error":"VALIDATION_FAILED","message":"Dữ liệu đầu vào không đúng định dạng Schema.","status":400}`
        : isError500
        ? `{"error":"INTERNAL_DB_ERROR","message":"Không thể hoàn tất giao dịch cơ sở dữ liệu.","status":500}`
        : `{"status":"SUCCESS","code":"${statusText}","endpoint":"${config.endpoint}","data":${config.requestBody}}`,
    },
    {
      stepNumber: 7,
      titleEn: 'Step 7: API returns the response',
      titleVi: 'Bước 7: Tầng API gửi trả Response qua mạng về Client',
      activeComponent: 'api-layer',
      targetComponent: 'client',
      direction: 'response',
      shortExplanationVi:
        'Tầng API đính kèm các Headers bảo mật (CORS, X-Request-Id, Cache-Control) và truyền luồng byte phản hồi về lại Client.',
      technicalMechanismVi:
        'Ghi HTTP Status Line, Response Headers và JSON Payload lên kết nối TCP đang mở.',
      communicationState: 'RESPONSE_IN_FLIGHT_TO_CLIENT',
      payloadSnapshot: `HTTP/1.1 ${statusText}\nContent-Type: application/json; charset=utf-8\nX-Simulation-Mode: Deterministic-Local\n\n(JSON Payload in transit)`,
    },
    {
      stepNumber: 8,
      titleEn: 'Step 8: Client receives and processes the result',
      titleVi: 'Bước 8: Client nhận phản hồi, giải mã và cập nhật UI',
      activeComponent: 'client',
      direction: 'internal',
      shortExplanationVi:
        'Client kiểm tra mã trạng thái HTTP (' +
        statusText +
        '), giải tuần tự hóa (JSON.parse) dữ liệu và cập nhật trạng thái giao diện người dùng.',
      technicalMechanismVi:
        'Promise của fetch() hoàn tất; ứng dụng phân nhánh logic theo response.ok (2xx) hoặc khối xử lý lỗi (4xx/5xx).',
      communicationState: 'LIFECYCLE_COMPLETE',
      payloadSnapshot: `// Client State Updated:\nStatus: ${statusText}\nisError: ${
        isError400 || isError401 || isError500
      }\nUI Action: ${
        isError400 || isError401 || isError500
          ? 'Hiển thị thông báo lỗi & hướng dẫn khắc phục'
          : 'Render dữ liệu mới lên màn hình'
      }`,
    },
  ];
}

// ============================================================================
// 2. MODULE 1: REST API SIMULATOR (E-COMMERCE PRODUCT MANAGEMENT)
// ============================================================================

export interface RestProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export const INITIAL_REST_PRODUCTS: RestProduct[] = [
  {
    id: 101,
    name: 'Bàn phím cơ Engineering Keychron K8',
    category: 'hardware',
    price: 2450000,
    stock: 35,
  },
  {
    id: 102,
    name: 'Sách Designing Data-Intensive Applications',
    category: 'books',
    price: 480000,
    stock: 120,
  },
  {
    id: 103,
    name: 'Màn hình lập trình UltraSharp 27 inch 4K',
    category: 'hardware',
    price: 11900000,
    stock: 14,
  },
];

export interface RestSimulationInput {
  method: HttpMethod;
  path: string;
  queryParams: Record<string, string>;
  headers: Record<string, string>;
  bodyText: string;
  currentProducts: RestProduct[];
}

export interface RestSimulationOutput {
  response: SimulatedApiResponse;
  updatedProducts: RestProduct[];
}

export function simulateRestRequest(
  input: RestSimulationInput
): RestSimulationOutput {
  const products = [...input.currentProducts];
  const cleanPath = input.path.trim().replace(/\?.*$/, '');

  // Check optional auth simulation if user explicitly sets invalid token
  if (input.headers['Authorization'] === 'Bearer invalid_token') {
    return {
      updatedProducts: products,
      response: {
        statusCode: 401,
        statusText: 'Unauthorized',
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer realm="ecommerce-api"',
        },
        body: JSON.stringify(
          {
            error: 'UNAUTHORIZED',
            message: 'Bearer Token không hợp lệ hoặc đã hết hạn.',
          },
          null,
          2
        ),
        latencyMs: 32,
        explanationVi:
          'Yêu cầu bị từ chối ở tầng Auth Middleware với mã 401 vì Header Authorization chứa token không hợp lệ.',
        isError: true,
        stepsTrace: [
          'Client gửi HTTP Request kèm Authorization Header',
          'API Gateway kiểm tra chữ ký Bearer Token -> Thất bại',
          'Trả về ngay 401 Unauthorized, không gọi xuống Database',
        ],
      },
    };
  }

  // Match /api/products or /api/products/:id
  const collectionMatch = /^\/api\/products\/?$/.test(cleanPath);
  const itemMatch = cleanPath.match(/^\/api\/products\/(\d+)\/?$/);

  if (!collectionMatch && !itemMatch) {
    return {
      updatedProducts: products,
      response: {
        statusCode: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            error: 'ENDPOINT_NOT_FOUND',
            message: `Không tìm thấy tài nguyên tại đường dẫn '${cleanPath}'. Hãy sử dụng /api/products hoặc /api/products/{id}.`,
          },
          null,
          2
        ),
        latencyMs: 28,
        explanationVi:
          'URI không khớp với bất kỳ Resource Route nào trên REST Server nên trả về 404 Not Found.',
        isError: true,
        stepsTrace: [
          `Client gửi ${input.method} ${cleanPath}`,
          'Router tra cứu bảng định tuyến (Routing Table) -> Không khớp',
          'Server trả về 404 Not Found',
        ],
      },
    };
  }

  // GET /api/products
  if (collectionMatch && input.method === 'GET') {
    let filtered = [...products];
    const categoryFilter = input.queryParams['category']?.trim();
    const minPriceFilter = Number(input.queryParams['minPrice'] || 0);

    if (categoryFilter) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    if (!Number.isNaN(minPriceFilter) && minPriceFilter > 0) {
      filtered = filtered.filter((p) => p.price >= minPriceFilter);
    }

    return {
      updatedProducts: products,
      response: {
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
          'X-Total-Count': String(filtered.length),
        },
        body: JSON.stringify(
          {
            resource: 'products',
            count: filtered.length,
            filtersApplied: input.queryParams,
            data: filtered,
          },
          null,
          2
        ),
        latencyMs: 65,
        explanationVi:
          'Phương thức GET truy vấn danh sách tài nguyên Products (Stateless & Idempotent). Các Query Parameters được dùng để lọc kết quả mà không làm thay đổi dữ liệu gốc.',
        isError: false,
        stepsTrace: [
          `Client gửi GET ${cleanPath} kèm Query Params`,
          'REST Controller đọc bộ lọc và truy vấn SELECT từ Database',
          'Trả về 200 OK cùng mảng JSON biểu diễn danh sách sản phẩm',
        ],
      },
    };
  }

  // GET /api/products/:id
  if (itemMatch && input.method === 'GET') {
    const id = Number(itemMatch[1]);
    const found = products.find((p) => p.id === id);
    if (!found) {
      return {
        updatedProducts: products,
        response: {
          statusCode: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              error: 'PRODUCT_NOT_FOUND',
              message: `Không tồn tại sản phẩm có ID = ${id}.`,
            },
            null,
            2
          ),
          latencyMs: 44,
          explanationVi: `Endpoint hợp lệ nhưng tài nguyên Product #${id} không tồn tại trong Database nên trả về mã chuẩn 404 Not Found.`,
          isError: true,
          stepsTrace: [
            `Client gửi GET /api/products/${id}`,
            `Database thực thi SELECT * FROM products WHERE id = ${id} -> 0 rows`,
            'Trả về 404 Not Found',
          ],
        },
      };
    }

    return {
      updatedProducts: products,
      response: {
        statusCode: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ETag: `"prod-${found.id}-v1"`,
        },
        body: JSON.stringify(found, null, 2),
        latencyMs: 48,
        explanationVi: `Truy xuất thành công biểu diễn (Representation) JSON của tài nguyên sản phẩm #${id} qua Path Parameter.`,
        isError: false,
        stepsTrace: [
          `Client gửi GET /api/products/${id}`,
          `Database tìm thấy bản ghi #${id}`,
          'Serialize sang JSON và trả về 200 OK kèm ETag Header',
        ],
      },
    };
  }

  // POST /api/products
  if (collectionMatch && input.method === 'POST') {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(input.bodyText) as Record<string, unknown>;
    } catch {
      return {
        updatedProducts: products,
        response: {
          statusCode: 400,
          statusText: 'Bad Request',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              error: 'INVALID_JSON_SYNTAX',
              message: 'Request Body không phải là chuỗi JSON hợp lệ.',
            },
            null,
            2
          ),
          latencyMs: 25,
          explanationVi:
            'JSON Deserializer báo lỗi cú pháp khi đọc Request Body nên trả về 400 Bad Request.',
          isError: true,
          stepsTrace: [
            'Client gửi POST /api/products',
            'Tầng API parse JSON thất bại -> 400 Bad Request',
          ],
        },
      };
    }

    const name = typeof parsed['name'] === 'string' ? parsed['name'].trim() : '';
    const price = Number(parsed['price']);
    const category =
      typeof parsed['category'] === 'string' ? parsed['category'].trim() : 'general';
    const stock = Number(parsed['stock'] ?? 10);

    if (!name || Number.isNaN(price) || price <= 0) {
      return {
        updatedProducts: products,
        response: {
          statusCode: 400,
          statusText: 'Bad Request',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              error: 'SCHEMA_VALIDATION_ERROR',
              message:
                'Trường "name" (chuỗi khác rỗng) và "price" (số > 0) là bắt buộc.',
            },
            null,
            2
          ),
          latencyMs: 35,
          explanationVi:
            'Dữ liệu JSON đúng cú pháp nhưng vi phạm ràng buộc nghiệp vụ (thiếu tên hoặc giá <= 0), trả về 400 Bad Request.',
          isError: true,
          stepsTrace: [
            'Client gửi POST /api/products',
            'Schema Validator phát hiện trường name/price không hợp lệ -> 400 Bad Request',
          ],
        },
      };
    }

    const nextId =
      products.reduce((max, item) => (item.id > max ? item.id : max), 100) + 1;
    const created: RestProduct = {
      id: nextId,
      name,
      category,
      price,
      stock: Number.isNaN(stock) ? 10 : stock,
    };
    const nextList = [...products, created];

    return {
      updatedProducts: nextList,
      response: {
        statusCode: 201,
        statusText: 'Created',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Location: `/api/products/${created.id}`,
        },
        body: JSON.stringify(created, null, 2),
        latencyMs: 92,
        explanationVi: `Tạo mới tài nguyên thành công! Server sinh ID mới (#${created.id}), trả về mã chuẩn 201 Created cùng Header Location trỏ tới URI của sản phẩm mới. Lưu ý: POST không có tính Idempotent.`,
        isError: false,
        stepsTrace: [
          'Client gửi POST /api/products kèm JSON Body',
          'Server xác thực Schema và thực thi INSERT INTO products',
          `Trả về 201 Created kèm Location: /api/products/${created.id}`,
        ],
      },
    };
  }

  // PATCH or PUT /api/products/:id
  if (itemMatch && (input.method === 'PATCH' || input.method === 'PUT')) {
    const id = Number(itemMatch[1]);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        updatedProducts: products,
        response: {
          statusCode: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              error: 'PRODUCT_NOT_FOUND',
              message: `Không tìm thấy sản phẩm #${id} để cập nhật.`,
            },
            null,
            2
          ),
          latencyMs: 45,
          explanationVi: `Không thể cập nhật vì tài nguyên #${id} không tồn tại (404 Not Found).`,
          isError: true,
          stepsTrace: [
            `Client gửi ${input.method} /api/products/${id}`,
            'Không tìm thấy bản ghi trong Database -> 404 Not Found',
          ],
        },
      };
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(input.bodyText) as Record<string, unknown>;
    } catch {
      return {
        updatedProducts: products,
        response: {
          statusCode: 400,
          statusText: 'Bad Request',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              error: 'INVALID_JSON',
              message: 'Body gửi lên không phải JSON hợp lệ.',
            },
            null,
            2
          ),
          latencyMs: 29,
          explanationVi: 'Lỗi cú pháp JSON trong phần thân yêu cầu cập nhật.',
          isError: true,
          stepsTrace: ['Parse JSON thất bại -> 400 Bad Request'],
        },
      };
    }

    const existing = products[index]!;
    const updatedItem: RestProduct = {
      id: existing.id,
      name:
        typeof parsed['name'] === 'string' && parsed['name'].trim()
          ? parsed['name'].trim()
          : existing.name,
      category:
        typeof parsed['category'] === 'string' && parsed['category'].trim()
          ? parsed['category'].trim()
          : existing.category,
      price:
        parsed['price'] !== undefined && !Number.isNaN(Number(parsed['price']))
          ? Number(parsed['price'])
          : existing.price,
      stock:
        parsed['stock'] !== undefined && !Number.isNaN(Number(parsed['stock']))
          ? Number(parsed['stock'])
          : existing.stock,
    };

    products[index] = updatedItem;

    return {
      updatedProducts: products,
      response: {
        statusCode: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(updatedItem, null, 2),
        latencyMs: 78,
        explanationVi:
          input.method === 'PATCH'
            ? `Cập nhật một phần (Partial Update - PATCH) tài nguyên #${id} thành công. Chỉ các trường có mặt trong JSON Body mới bị thay đổi.`
            : `Thay thế toàn bộ biểu diễn (PUT - Idempotent) của tài nguyên #${id} thành công.`,
        isError: false,
        stepsTrace: [
          `Client gửi ${input.method} /api/products/${id}`,
          `Server cập nhật bản ghi #${id} trong Database`,
          'Trả về 200 OK kèm trạng thái mới của sản phẩm',
        ],
      },
    };
  }

  // DELETE /api/products/:id
  if (itemMatch && input.method === 'DELETE') {
    const id = Number(itemMatch[1]);
    const exists = products.some((p) => p.id === id);
    if (!exists) {
      return {
        updatedProducts: products,
        response: {
          statusCode: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              error: 'PRODUCT_NOT_FOUND',
              message: `Sản phẩm #${id} không tồn tại hoặc đã bị xóa trước đó.`,
            },
            null,
            2
          ),
          latencyMs: 41,
          explanationVi: `Tài nguyên #${id} không còn tồn tại trong hệ thống nên trả về 404 Not Found.`,
          isError: true,
          stepsTrace: [
            `Client gửi DELETE /api/products/${id}`,
            'Không tìm thấy bản ghi -> 404 Not Found',
          ],
        },
      };
    }

    const remaining = products.filter((p) => p.id !== id);
    return {
      updatedProducts: remaining,
      response: {
        statusCode: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(
          {
            deleted: true,
            productId: id,
            remainingCount: remaining.length,
          },
          null,
          2
        ),
        latencyMs: 60,
        explanationVi: `Đã xóa sản phẩm #${id} khỏi danh mục. DELETE có tính Idempotent về trạng thái hệ thống (tài nguyên #${id} không còn tồn tại sau lệnh xóa).`,
        isError: false,
        stepsTrace: [
          `Client gửi DELETE /api/products/${id}`,
          `Database thực thi DELETE FROM products WHERE id = ${id}`,
          'Trả về 200 OK xác nhận đã xóa tài nguyên',
        ],
      },
    };
  }

  return {
    updatedProducts: products,
    response: {
      statusCode: 405,
      statusText: 'Method Not Allowed',
      headers: {
        'Content-Type': 'application/json',
        Allow: collectionMatch ? 'GET, POST' : 'GET, PUT, PATCH, DELETE',
      },
      body: JSON.stringify(
        {
          error: 'METHOD_NOT_ALLOWED',
          message: `Phương thức ${input.method} không được phép trên đường dẫn ${cleanPath}.`,
        },
        null,
        2
      ),
      latencyMs: 24,
      explanationVi: `REST quy định rõ phương thức nào áp dụng cho Collection (/api/products) hay Item (/api/products/{id}). Gọi sai tổ hợp sẽ nhận mã 405 Method Not Allowed.`,
      isError: true,
      stepsTrace: [
        `Client gửi ${input.method} ${cleanPath}`,
        'Router phát hiện Method không được hỗ trợ cho URI này -> 405 Method Not Allowed',
      ],
    },
  };
}

// ============================================================================
// 3. MODULE 2: SOAP API SIMULATOR (CORE BANKING SERVICE)
// ============================================================================

export type SoapOperationName =
  | 'GetAccountBalance'
  | 'TransferMoney'
  | 'GetTransactionHistory'
  | 'TriggerSoapFault';

export interface SoapSimulationResult {
  operation: SoapOperationName;
  httpStatus: number;
  isFault: boolean;
  requestXml: string;
  responseXml: string;
  envelopeBreakdown: {
    envelopeVi: string;
    headerVi: string;
    bodyVi: string;
    faultVi?: string;
  };
}

export function buildSoapRequestTemplate(
  operation: SoapOperationName,
  params: { accountId: string; toAccountId: string; amount: number }
): string {
  if (operation === 'GetAccountBalance') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Header>
    <bank:AuthHeader>
      <bank:ChannelId>CORP_ERP_01</bank:ChannelId>
      <bank:WSSEToken>wsse_live_token_9981</bank:WSSEToken>
    </bank:AuthHeader>
  </soap:Header>
  <soap:Body>
    <bank:GetAccountBalanceRequest>
      <bank:AccountId>${params.accountId}</bank:AccountId>
      <bank:Currency>VND</bank:Currency>
    </bank:GetAccountBalanceRequest>
  </soap:Body>
</soap:Envelope>`;
  }

  if (operation === 'TransferMoney') {
    return `<?xml version="1.0" encoding="UTF-8"?>
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
      <bank:FromAccount>${params.accountId}</bank:FromAccount>
      <bank:ToAccount>${params.toAccountId}</bank:ToAccount>
      <bank:Amount>${params.amount}</bank:Amount>
      <bank:Currency>VND</bank:Currency>
    </bank:TransferMoneyRequest>
  </soap:Body>
</soap:Envelope>`;
  }

  if (operation === 'GetTransactionHistory') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Header>
    <bank:AuthHeader>
      <bank:ChannelId>CORP_ERP_01</bank:ChannelId>
    </bank:AuthHeader>
  </soap:Header>
  <soap:Body>
    <bank:GetTransactionHistoryRequest>
      <bank:AccountId>${params.accountId}</bank:AccountId>
      <bank:Limit>3</bank:Limit>
    </bank:GetTransactionHistoryRequest>
  </soap:Body>
</soap:Envelope>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Header>
    <bank:AuthHeader>
      <bank:ChannelId>CORP_ERP_01</bank:ChannelId>
    </bank:AuthHeader>
  </soap:Header>
  <soap:Body>
    <bank:TransferMoneyRequest>
      <bank:FromAccount>INVALID-ACC-000</bank:FromAccount>
      <bank:ToAccount>${params.toAccountId}</bank:ToAccount>
      <bank:Amount>999999999999</bank:Amount>
    </bank:TransferMoneyRequest>
  </soap:Body>
</soap:Envelope>`;
}

export function executeSoapSimulation(
  operation: SoapOperationName,
  requestXml: string
): SoapSimulationResult {
  const hasInvalidAcc =
    operation === 'TriggerSoapFault' ||
    requestXml.includes('INVALID-ACC') ||
    !requestXml.includes('</soap:Envelope>');

  if (hasInvalidAcc) {
    return {
      operation,
      httpStatus: 500,
      isFault: true,
      requestXml,
      responseXml: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Body>
    <soap:Fault>
      <soap:Code>
        <soap:Value>soap:Sender</soap:Value>
      </soap:Code>
      <soap:Reason>
        <soap:Text xml:lang="vi">Tài khoản nguồn không tồn tại hoặc số tiền vượt hạn mức thanh toán (XSD Contract Violation).</soap:Text>
      </soap:Reason>
      <soap:Detail>
        <bank:BankingErrorDetail>
          <bank:ErrorCode>ERR_CORE_BANK_4092</bank:ErrorCode>
          <bank:Severity>CRITICAL</bank:Severity>
        </bank:BankingErrorDetail>
      </soap:Detail>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`,
      envelopeBreakdown: {
        envelopeVi:
          'Phần tử gốc <soap:Envelope> định nghĩa không gian tên (XML Namespace) chuẩn SOAP 1.2.',
        headerVi:
          'Phần <soap:Header> chứa thông tin định danh kênh gọi (CORP_ERP_01) và chữ ký bảo mật WS-Security.',
        bodyVi:
          'Khi xảy ra lỗi, <soap:Body> chứa khối <soap:Fault> chuẩn hóa thay vì thẻ kết quả thông thường.',
        faultVi:
          'Khối <soap:Fault> bắt buộc có <soap:Code>, <soap:Reason> và <soap:Detail> mô tả mã lỗi nghiệp vụ ngân hàng theo hợp đồng WSDL.',
      },
    };
  }

  if (operation === 'GetAccountBalance') {
    return {
      operation,
      httpStatus: 200,
      isFault: false,
      requestXml,
      responseXml: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Header>
    <bank:ResponseTrace>
      <bank:CoreNode>CORE-HN-02</bank:CoreNode>
      <bank:Timestamp>2026-11-19T08:30:00Z</bank:Timestamp>
    </bank:ResponseTrace>
  </soap:Header>
  <soap:Body>
    <bank:GetAccountBalanceResponse>
      <bank:AccountId>ACC-VN-8801</bank:AccountId>
      <bank:AccountHolder>CONG TY TNHH CONG NGHE SO VIET</bank:AccountHolder>
      <bank:AvailableBalance>1450000000</bank:AvailableBalance>
      <bank:Currency>VND</bank:Currency>
      <bank:Status>ACTIVE</bank:Status>
    </bank:GetAccountBalanceResponse>
  </soap:Body>
</soap:Envelope>`,
      envelopeBreakdown: {
        envelopeVi:
          '<soap:Envelope> đóng gói toàn bộ bức điện XML, đảm bảo cả Client và Core Banking hiểu cùng phiên bản giao thức.',
        headerVi:
          '<soap:Header> truyền Metadata cấp giao thức (Token WS-Security ở chiều đi, mã Node xử lý ở chiều về) tách biệt khỏi dữ liệu nghiệp vụ.',
        bodyVi:
          '<soap:Body> chứa <bank:GetAccountBalanceResponse> tuân thủ nghiêm ngặt kiểu dữ liệu XSD trong tài liệu WSDL.',
      },
    };
  }

  if (operation === 'TransferMoney') {
    return {
      operation,
      httpStatus: 200,
      isFault: false,
      requestXml,
      responseXml: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Header>
    <bank:ResponseTrace>
      <bank:IdempotencyStatus>NEW_EXECUTION_COMMITTED</bank:IdempotencyStatus>
    </bank:ResponseTrace>
  </soap:Header>
  <soap:Body>
    <bank:TransferMoneyResponse>
      <bank:SettlementId>STL-20261119-9041</bank:SettlementId>
      <bank:Status>SETTLED</bank:Status>
      <bank:RemainingBalance>1425000000</bank:RemainingBalance>
      <bank:Currency>VND</bank:Currency>
    </bank:TransferMoneyResponse>
  </soap:Body>
</soap:Envelope>`,
      envelopeBreakdown: {
        envelopeVi: 'Khung XML SOAP bảo toàn tính toàn vẹn cấu trúc cho giao dịch chuyển tiền liên ngân hàng.',
        headerVi:
          'Sử dụng TransactionIdempotencyKey trong <soap:Header> để chống trừ tiền hai lần nếu đường truyền bị đứt giữa chừng.',
        bodyVi:
          '<bank:TransferMoneyResponse> xác nhận mã hạch toán (SettlementId) và số dư còn lại.',
      },
    };
  }

  return {
    operation,
    httpStatus: 200,
    isFault: false,
    requestXml,
    responseXml: `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:bank="http://corebanking.enterprise.vn/wsdl">
  <soap:Body>
    <bank:GetTransactionHistoryResponse>
      <bank:Transactions>
        <bank:Transaction>
          <bank:TxId>TX-901</bank:TxId>
          <bank:Type>CREDIT</bank:Type>
          <bank:Amount>85000000</bank:Amount>
        </bank:Transaction>
        <bank:Transaction>
          <bank:TxId>TX-902</bank:TxId>
          <bank:Type>DEBIT</bank:Type>
          <bank:Amount>25000000</bank:Amount>
        </bank:Transaction>
      </bank:Transactions>
    </bank:GetTransactionHistoryResponse>
  </soap:Body>
</soap:Envelope>`,
    envelopeBreakdown: {
      envelopeVi: 'Gói tin SOAP Envelope chứa danh sách lịch sử giao dịch có cấu trúc phân cấp.',
      headerVi: 'Xác thực kênh kết nối doanh nghiệp qua AuthHeader.',
      bodyVi: 'Trả về danh sách các phần tử <bank:Transaction> theo đúng định nghĩa mảng trong WSDL.',
    },
  };
}

// ============================================================================
// 4. MODULE 3: GRAPHQL API SIMULATOR (UNIVERSITY MANAGEMENT SYSTEM)
// ============================================================================

export interface GraphqlFieldSelection {
  studentId: string;
  includeFullName: boolean;
  includeGpa: boolean;
  includeEmail: boolean;
  includeDepartment: boolean;
  includeCourses: boolean;
  includeGrades: boolean;
}

export interface GraphqlSimulationResult {
  generatedQuery: string;
  graphqlResponseJson: string;
  restEquivalentResponseJson: string;
  graphqlByteSize: number;
  restByteSize: number;
  resolversTriggered: string[];
  explanationVi: string;
}

interface UniversityStudentRecord {
  id: string;
  fullName: string;
  gpa: number;
  email: string;
  phone: string;
  address: string;
  enrollmentYear: number;
  advisorCode: string;
  department: {
    id: string;
    name: string;
    building: string;
    budgetVnd: number;
  };
  courses: {
    code: string;
    title: string;
    credits: number;
    grade: string;
  }[];
}

const UNIVERSITY_DB: Record<string, UniversityStudentRecord> = {
  'SV-101': {
    id: 'SV-101',
    fullName: 'Trần Hoàng Minh',
    gpa: 3.82,
    email: 'minh.th@univ.edu.vn',
    phone: '0901234567',
    address: 'Khu Công Nghệ Cao, TP.HCM',
    enrollmentYear: 2023,
    advisorCode: 'GV-88',
    department: {
      id: 'DEPT-CS',
      name: 'Khoa Khoa học Máy tính & Trí tuệ Nhân tạo',
      building: 'Tòa nhà A1',
      budgetVnd: 15000000000,
    },
    courses: [
      {
        code: 'CS301',
        title: 'Kiến trúc Hệ thống Phân tán (Distributed Systems)',
        credits: 4,
        grade: 'A',
      },
      {
        code: 'DS205',
        title: 'Kỹ thuật Dữ liệu Lớn (Data Engineering)',
        credits: 3,
        grade: 'A-',
      },
    ],
  },
  'SV-102': {
    id: 'SV-102',
    fullName: 'Lê Ngọc Bảo Trân',
    gpa: 3.91,
    email: 'tran.lnb@univ.edu.vn',
    phone: '0919888777',
    address: 'Cầu Giấy, Hà Nội',
    enrollmentYear: 2024,
    advisorCode: 'GV-42',
    department: {
      id: 'DEPT-DS',
      name: 'Khoa Khoa học Dữ liệu & Hệ thống Thông tin',
      building: 'Tòa nhà B2',
      budgetVnd: 12000000000,
    },
    courses: [
      {
        code: 'DS101',
        title: 'Nhập môn Học máy (Machine Learning)',
        credits: 4,
        grade: 'A+',
      },
      {
        code: 'CS210',
        title: 'Thiết kế & Phát triển Web API',
        credits: 3,
        grade: 'A',
      },
    ],
  },
};

export function executeGraphqlSimulation(
  selection: GraphqlFieldSelection
): GraphqlSimulationResult {
  const record = UNIVERSITY_DB[selection.studentId] ?? UNIVERSITY_DB['SV-101']!;

  const queryLines: string[] = [
    `query GetStudentProfile {`,
    `  student(id: "${record.id}") {`,
    `    id`,
  ];

  const resolvers: string[] = ['Query.student(id: "' + record.id + '")'];
  const resultStudent: Record<string, unknown> = { id: record.id };

  if (selection.includeFullName) {
    queryLines.push(`    fullName`);
    resultStudent['fullName'] = record.fullName;
  }
  if (selection.includeGpa) {
    queryLines.push(`    gpa`);
    resultStudent['gpa'] = record.gpa;
  }
  if (selection.includeEmail) {
    queryLines.push(`    email`);
    resultStudent['email'] = record.email;
  }
  if (selection.includeDepartment) {
    queryLines.push(`    department {`, `      id`, `      name`, `    }`);
    resolvers.push('Student.department -> DepartmentService.findById');
    resultStudent['department'] = {
      id: record.department.id,
      name: record.department.name,
    };
  }
  if (selection.includeCourses) {
    queryLines.push(
      `    courses {`,
      `      code`,
      `      title`,
      `      credits`
    );
    if (selection.includeGrades) {
      queryLines.push(`      grade`);
      resolvers.push('Course.grade -> GradeService.findByStudentAndCourse');
    }
    queryLines.push(`    }`);
    resolvers.push('Student.courses -> CourseService.findByStudentId');

    resultStudent['courses'] = record.courses.map((c) => {
      const item: Record<string, unknown> = {
        code: c.code,
        title: c.title,
        credits: c.credits,
      };
      if (selection.includeGrades) {
        item['grade'] = c.grade;
      }
      return item;
    });
  }

  queryLines.push(`  }`, `}`);

  const generatedQuery = queryLines.join('\n');
  const graphqlResponseJson = JSON.stringify(
    { data: { student: resultStudent } },
    null,
    2
  );
  const restEquivalentResponseJson = JSON.stringify(record, null, 2);

  const graphqlByteSize = Buffer.byteLength(graphqlResponseJson, 'utf8');
  const restByteSize = Buffer.byteLength(restEquivalentResponseJson, 'utf8');

  return {
    generatedQuery,
    graphqlResponseJson,
    restEquivalentResponseJson,
    graphqlByteSize,
    restByteSize,
    resolversTriggered: resolvers,
    explanationVi: `GraphQL Server chỉ thực thi ${resolvers.length} Resolver tương ứng với các trường được yêu cầu trong Query, trả về đúng ${graphqlByteSize} bytes (so với ${restByteSize} bytes nếu gọi REST lấy toàn bộ Object kèm các trường thừa như phone, address, budgetVnd).`,
  };
}

// ============================================================================
// 5. MODULE 4: gRPC API SIMULATOR (MICROSERVICES & 4 RPC STREAMING PATTERNS)
// ============================================================================

export type GrpcPatternType =
  | 'unary'
  | 'server-streaming'
  | 'client-streaming'
  | 'bidirectional-streaming';

export interface GrpcStreamFrame {
  frameIndex: number;
  direction: 'client-to-server' | 'server-to-client';
  timestampOffsetMs: number;
  methodName: string;
  structuredMessage: string;
  conceptualBinaryHex: string;
  explanationVi: string;
}

export interface GrpcSimulationResult {
  pattern: GrpcPatternType;
  serviceName: string;
  rpcSignature: string;
  jsonEquivalentBytes: number;
  protobufBinaryBytes: number;
  frames: GrpcStreamFrame[];
}

export function executeGrpcSimulation(
  pattern: GrpcPatternType,
  orderId: string,
  amountVnd: number
): GrpcSimulationResult {
  if (pattern === 'unary') {
    return {
      pattern,
      serviceName: 'OrderService / PaymentService',
      rpcSignature: 'rpc ProcessPayment (PaymentRequest) returns (PaymentResponse);',
      jsonEquivalentBytes: 142,
      protobufBinaryBytes: 34,
      frames: [
        {
          frameIndex: 1,
          direction: 'client-to-server',
          timestampOffsetMs: 1,
          methodName: 'PaymentService/ProcessPayment',
          structuredMessage: `PaymentRequest { order_id: "${orderId}", amount_vnd: ${amountVnd}, currency: "VND" }`,
          conceptualBinaryHex: '0A 0A 4F 52 44 2D 32 30 32 36 10 80 C2 D7 2F 1A 03 56 4E 44',
          explanationVi:
            'Order Service gọi hàm Stub cục bộ; Protobuf nén các trường thành Tag-Length-Value nhị phân và gửi qua 1 HTTP/2 DATA Frame.',
        },
        {
          frameIndex: 2,
          direction: 'server-to-client',
          timestampOffsetMs: 4,
          methodName: 'PaymentService/ProcessPayment',
          structuredMessage: `PaymentResponse { transaction_id: "TXN-9921", status: APPROVED, grpc_status: 0 (OK) }`,
          conceptualBinaryHex: '0A 08 54 58 4E 2D 39 39 32 31 10 01 [HEADERS: grpc-status=0]',
          explanationVi:
            'Payment Service giải mã nhị phân, xử lý thanh toán và trả về kết quả kèm HTTP/2 Trailing Header grpc-status: 0 (OK).',
        },
      ],
    };
  }

  if (pattern === 'server-streaming') {
    return {
      pattern,
      serviceName: 'OrderService',
      rpcSignature:
        'rpc WatchOrderFulfillment (OrderQuery) returns (stream FulfillmentEvent);',
      jsonEquivalentBytes: 420,
      protobufBinaryBytes: 112,
      frames: [
        {
          frameIndex: 1,
          direction: 'client-to-server',
          timestampOffsetMs: 1,
          methodName: 'OrderService/WatchOrderFulfillment',
          structuredMessage: `OrderQuery { order_id: "${orderId}" }`,
          conceptualBinaryHex: '0A 0A 4F 52 44 2D 32 30 32 36',
          explanationVi: 'Client gửi 1 yêu cầu duy nhất để đăng ký nhận luồng trạng thái đơn hàng.',
        },
        {
          frameIndex: 2,
          direction: 'server-to-client',
          timestampOffsetMs: 15,
          methodName: 'Stream Frame #1',
          structuredMessage: `FulfillmentEvent { stage: "PAYMENT_VERIFIED", progress_pct: 33 }`,
          conceptualBinaryHex: '0A 10 50 41 59 4D 45 4E 54 5F 56 45 52 49 46 49 45 44 10 21',
          explanationVi: 'Server đẩy Frame #1 ngay khi xác nhận thanh toán trên cùng luồng HTTP/2.',
        },
        {
          frameIndex: 3,
          direction: 'server-to-client',
          timestampOffsetMs: 40,
          methodName: 'Stream Frame #2',
          structuredMessage: `FulfillmentEvent { stage: "INVENTORY_RESERVED", progress_pct: 66 }`,
          conceptualBinaryHex: '0A 12 49 4E 56 45 4E 54 4F 52 59 5F 52 45 53 45 52 56 45 44 10 42',
          explanationVi: 'Server đẩy tiếp Frame #2 khi kho hàng đã khóa tồn kho sản phẩm.',
        },
        {
          frameIndex: 4,
          direction: 'server-to-client',
          timestampOffsetMs: 75,
          methodName: 'Stream Frame #3 (EOS)',
          structuredMessage: `FulfillmentEvent { stage: "READY_FOR_DISPATCH", progress_pct: 100 }`,
          conceptualBinaryHex: '0A 12 52 45 41 44 59 5F 46 4F 52 5F 44 49 53 50 41 54 43 48 10 64',
          explanationVi: 'Server gửi Frame cuối cùng và đóng stream với cờ END_STREAM.',
        },
      ],
    };
  }

  if (pattern === 'client-streaming') {
    return {
      pattern,
      serviceName: 'InventoryService',
      rpcSignature:
        'rpc UploadStockTelemetry (stream StockDelta) returns (BatchSyncSummary);',
      jsonEquivalentBytes: 380,
      protobufBinaryBytes: 96,
      frames: [
        {
          frameIndex: 1,
          direction: 'client-to-server',
          timestampOffsetMs: 5,
          methodName: 'Client Stream Chunk #1',
          structuredMessage: `StockDelta { sku: "SKU-101", warehouse: "WH-HCM", delta: -2 }`,
          conceptualBinaryHex: '0A 07 53 4B 55 2D 31 30 31 18 FE FF FF FF 0F',
          explanationVi: 'Client đẩy liên tiếp các bản ghi biến động kho lên Server qua stream.',
        },
        {
          frameIndex: 2,
          direction: 'client-to-server',
          timestampOffsetMs: 18,
          methodName: 'Client Stream Chunk #2 (EOF)',
          structuredMessage: `StockDelta { sku: "SKU-204", warehouse: "WH-HN", delta: +50 }`,
          conceptualBinaryHex: '0A 07 53 4B 55 2D 32 30 34 18 32',
          explanationVi: 'Client gửi bản ghi thứ hai và báo hiệu kết thúc luồng gửi (Half-Close).',
        },
        {
          frameIndex: 3,
          direction: 'server-to-client',
          timestampOffsetMs: 32,
          methodName: 'InventoryService/UploadStockTelemetry',
          structuredMessage: `BatchSyncSummary { processed_items: 2, status: "COMMITTED" }`,
          conceptualBinaryHex: '08 02 12 09 43 4F 4D 4D 49 54 54 45 44',
          explanationVi: 'Server tổng hợp toàn bộ luồng dữ liệu của Client và trả về 1 phản hồi tổng kết.',
        },
      ],
    };
  }

  return {
    pattern,
    serviceName: 'PaymentFraudEngine',
    rpcSignature:
      'rpc LiveFraudScoring (stream TransactionSignal) returns (stream RiskDecision);',
    jsonEquivalentBytes: 490,
    protobufBinaryBytes: 124,
    frames: [
      {
        frameIndex: 1,
        direction: 'client-to-server',
        timestampOffsetMs: 2,
        methodName: 'Signal #1',
        structuredMessage: `TransactionSignal { order_id: "${orderId}", ip_region: "VN", amount: ${amountVnd} }`,
        conceptualBinaryHex: '0A 0A 4F 52 44 2D 32 30 32 36 12 02 56 4E',
        explanationVi: 'Client phát tín hiệu giao dịch #1 lên luồng hai chiều.',
      },
      {
        frameIndex: 2,
        direction: 'server-to-client',
        timestampOffsetMs: 6,
        methodName: 'Decision #1',
        structuredMessage: `RiskDecision { risk_score: 0.04, action: "ALLOW" }`,
        conceptualBinaryHex: '0D CD CC 2C 3D 12 05 41 4C 4C 4F 57',
        explanationVi: 'Server phản hồi ngay quyết định ALLOW trong khi luồng vẫn mở.',
      },
      {
        frameIndex: 3,
        direction: 'client-to-server',
        timestampOffsetMs: 14,
        methodName: 'Signal #2',
        structuredMessage: `TransactionSignal { order_id: "${orderId}-B", velocity_1m: 18 }`,
        conceptualBinaryHex: '0A 0C 4F 52 44 2D 32 30 32 36 2D 42 18 12',
        explanationVi: 'Client phát tiếp tín hiệu thứ 2 độc lập trên cùng kết nối HTTP/2.',
      },
      {
        frameIndex: 4,
        direction: 'server-to-client',
        timestampOffsetMs: 19,
        methodName: 'Decision #2',
        structuredMessage: `RiskDecision { risk_score: 0.89, action: "STEP_UP_2FA" }`,
        conceptualBinaryHex: '0D EC 51 63 3F 12 0B 53 54 45 50 5F 55 50 5F 32 46 41',
        explanationVi: 'Server phát hiện tần suất bất thường và đẩy phản hồi yêu cầu xác thực 2FA tức thì.',
      },
    ],
  };
}

// ============================================================================
// 6. MODULE 6: WEBHOOK SIMULATOR (PAYMENT EVENT PRODUCER & RETRY ENGINE)
// ============================================================================

export type WebhookEventType =
  | 'payment.success'
  | 'payment.failed'
  | 'order.created'
  | 'order.shipped';

export interface WebhookAttemptLog {
  attemptNumber: number;
  delayLabel: string;
  httpStatus: number;
  outcome: 'DELIVERED' | 'FAILED_WILL_RETRY' | 'SIGNATURE_REJECTED';
  explanationVi: string;
}

export interface WebhookSimulationResult {
  eventId: string;
  eventType: WebhookEventType;
  callbackUrl: string;
  computedSignature: string;
  providedSignature: string;
  signatureValid: boolean;
  httpHeaders: Record<string, string>;
  jsonPayload: string;
  attempts: WebhookAttemptLog[];
}

export function simulateWebhookDelivery(params: {
  eventType: WebhookEventType;
  callbackUrl: string;
  secretKey: string;
  tamperSignature: boolean;
  simulateReceiver500Error: boolean;
  orderAmountVnd: number;
}): WebhookSimulationResult {
  const eventId = `evt_${params.eventType.replace('.', '_')}_2026_901`;
  const payloadObj = {
    id: eventId,
    event: params.eventType,
    created: '2026-11-19T09:00:00Z',
    idempotencyKey: `idem_${eventId}`,
    data: {
      orderId: 'ORD-2026-778',
      amountVnd: params.orderAmountVnd,
      currency: 'VND',
      status:
        params.eventType === 'payment.success'
          ? 'PAID'
          : params.eventType === 'payment.failed'
          ? 'DECLINED'
          : params.eventType === 'order.shipped'
          ? 'IN_TRANSIT'
          : 'CREATED',
    },
  };

  const jsonPayload = JSON.stringify(payloadObj, null, 2);

  // Deterministic pseudo-HMAC signature based on secretKey + eventType + amount
  const rawHashSeed = `${params.secretKey}:${params.eventType}:${params.orderAmountVnd}`;
  let hashAcc = 0x811c9dc5;
  for (let i = 0; i < rawHashSeed.length; i++) {
    hashAcc ^= rawHashSeed.charCodeAt(i);
    hashAcc = Math.imul(hashAcc, 0x01000193) >>> 0;
  }
  const computedSignature = `sha256=${hashAcc.toString(16).padStart(8, '0')}a9f4c2e1b807d356`;
  const providedSignature = params.tamperSignature
    ? 'sha256=00000000tampered_invalid_sig'
    : computedSignature;
  const signatureValid = computedSignature === providedSignature;

  const attempts: WebhookAttemptLog[] = [];

  if (!signatureValid) {
    attempts.push({
      attemptNumber: 1,
      delayLabel: '0s (Immediate)',
      httpStatus: 401,
      outcome: 'SIGNATURE_REJECTED',
      explanationVi:
        'Webhook Endpoint nhận HTTP POST nhưng khi tính lại HMAC-SHA256 từ Body và Secret Key thì không khớp với Header X-Webhook-Signature -> Từ chối với mã 401 để chống giả mạo!',
    });
  } else if (params.simulateReceiver500Error) {
    attempts.push(
      {
        attemptNumber: 1,
        delayLabel: '0s (Initial Push)',
        httpStatus: 500,
        outcome: 'FAILED_WILL_RETRY',
        explanationVi:
          'Lần gửi #1: Server nhận Webhook đang quá tải trả về 500 Internal Server Error. Nhà cung cấp đưa sự kiện vào hàng đợi Retry.',
      },
      {
        attemptNumber: 2,
        delayLabel: '+5s (Exponential Backoff #1)',
        httpStatus: 503,
        outcome: 'FAILED_WILL_RETRY',
        explanationVi:
          'Lần gửi #2 (sau 5 giây): Endpoint vẫn phản hồi 503 Service Unavailable. Tăng gấp đôi thời gian chờ (Exponential Backoff).',
      },
      {
        attemptNumber: 3,
        delayLabel: '+25s (Exponential Backoff #2 - Recovered)',
        httpStatus: 200,
        outcome: 'DELIVERED',
        explanationVi:
          'Lần gửi #3 (sau 25 giây): Server nhận đã phục hồi, kiểm tra Idempotency Key chưa xử lý, cập nhật đơn hàng và trả về 200 OK để dừng chu trình Retry.',
      }
    );
  } else {
    attempts.push({
      attemptNumber: 1,
      delayLabel: '0s (Immediate Push)',
      httpStatus: 200,
      outcome: 'DELIVERED',
      explanationVi:
        'Nhà cung cấp chủ động bắn HTTP POST tới Callback URL; hệ thống nhận xác thực chữ ký HMAC thành công và phản hồi 200 OK trong 38ms.',
    });
  }

  return {
    eventId,
    eventType: params.eventType,
    callbackUrl: params.callbackUrl,
    computedSignature,
    providedSignature,
    signatureValid,
    httpHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'PayGate-Webhook-Dispatcher/2.4',
      'X-Webhook-Event': params.eventType,
      'X-Webhook-Id': eventId,
      'X-Webhook-Signature': providedSignature,
    },
    jsonPayload,
    attempts,
  };
}

// ============================================================================
// 7. MODULE 7: OPENAPI SPECIFICATION PARSER & GENERATOR ENGINE
// ============================================================================

export interface ParsedOpenApiEndpoint {
  path: string;
  method: HttpMethod;
  summary: string;
  parameters: string[];
  requestSchema?: string;
  responseCode: string;
  responseDescription: string;
}

export interface OpenApiParseResult {
  isValid: boolean;
  title: string;
  version: string;
  errorMessage?: string;
  endpoints: ParsedOpenApiEndpoint[];
  generatedTypeScriptSdk: string;
}

export const DEFAULT_OPENAPI_SPEC_JSON = JSON.stringify(
  {
    openapi: '3.0.3',
    info: {
      title: 'Student Management REST API',
      version: '1.2.0',
      description: 'Đặc tả chuẩn hóa cho hệ thống quản lý hồ sơ sinh viên.',
    },
    paths: {
      '/students': {
        get: {
          summary: 'Lấy danh sách sinh viên (hỗ trợ lọc theo khoa)',
          parameters: ['department (query, string)', 'limit (query, integer)'],
          responses: {
            '200': 'Danh sách mảng StudentSchema',
          },
        },
        post: {
          summary: 'Thêm mới một hồ sơ sinh viên',
          requestBody: 'CreateStudentSchema { fullName, email, major }',
          responses: {
            '201': 'Hồ sơ sinh viên vừa được khởi tạo',
          },
        },
      },
      '/students/{id}': {
        get: {
          summary: 'Tra cứu chi tiết sinh viên theo mã định danh',
          parameters: ['id (path, required, string)'],
          responses: {
            '200': 'Đối tượng StudentSchema chi tiết',
          },
        },
        put: {
          summary: 'Cập nhật toàn bộ hồ sơ sinh viên theo ID',
          parameters: ['id (path, required, string)'],
          requestBody: 'UpdateStudentSchema { fullName, gpa, major }',
          responses: {
            '200': 'Cập nhật thành công',
          },
        },
      },
    },
  },
  null,
  2
);

export function parseOpenApiSpec(specText: string): OpenApiParseResult {
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(specText) as Record<string, unknown>;
  } catch (err) {
    return {
      isValid: false,
      title: 'Invalid Specification',
      version: '0.0.0',
      errorMessage:
        'Lỗi cú pháp trong tài liệu OpenAPI (JSON không hợp lệ). Vui lòng kiểm tra dấu ngoặc hoặc dấu phẩy.',
      endpoints: [],
      generatedTypeScriptSdk: '// Không thể sinh SDK khi đặc tả OpenAPI bị lỗi cú pháp.',
    };
  }

  const openapiVersion =
    typeof raw['openapi'] === 'string' ? raw['openapi'] : '';
  if (!openapiVersion.startsWith('3.')) {
    return {
      isValid: false,
      title: 'Missing OpenAPI Version',
      version: '0.0.0',
      errorMessage:
        'Tài liệu thiếu trường "openapi": "3.0.x" ở cấp gốc (Root Object).',
      endpoints: [],
      generatedTypeScriptSdk: '// Thiếu phiên bản openapi 3.x',
    };
  }

  const info = (raw['info'] as Record<string, unknown>) ?? {};
  const title =
    typeof info['title'] === 'string' ? info['title'] : 'Untitled API';
  const version =
    typeof info['version'] === 'string' ? info['version'] : '1.0.0';

  const paths = (raw['paths'] as Record<string, unknown>) ?? {};
  const endpoints: ParsedOpenApiEndpoint[] = [];

  for (const [pathKey, pathObj] of Object.entries(paths)) {
    if (typeof pathObj !== 'object' || pathObj === null) continue;
    for (const [methodKey, opVal] of Object.entries(
      pathObj as Record<string, unknown>
    )) {
      const upper = methodKey.toUpperCase() as HttpMethod;
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(upper)) continue;
      const op = (opVal as Record<string, unknown>) ?? {};
      const summary =
        typeof op['summary'] === 'string' ? op['summary'] : `${upper} ${pathKey}`;
      const params = Array.isArray(op['parameters'])
        ? op['parameters'].map((p) => String(p))
        : [];
      const requestSchema =
        typeof op['requestBody'] === 'string' ? op['requestBody'] : undefined;
      const responses = (op['responses'] as Record<string, unknown>) ?? {};
      const firstCode = Object.keys(responses)[0] ?? '200';
      const firstDesc = String(responses[firstCode] ?? 'Success');

      endpoints.push({
        path: pathKey,
        method: upper,
        summary,
        parameters: params,
        requestSchema,
        responseCode: firstCode,
        responseDescription: firstDesc,
      });
    }
  }

  const sdkFunctions = endpoints
    .map((ep, idx) => {
      const fnName = `${ep.method.toLowerCase()}Endpoint${idx + 1}`;
      return `/** ${ep.summary} */\nexport async function ${fnName}(baseUrl: string) {\n  const res = await fetch(\`\${baseUrl}${ep.path}\`, { method: '${ep.method}' });\n  return res.json();\n}`;
    })
    .join('\n\n');

  return {
    isValid: true,
    title,
    version,
    endpoints,
    generatedTypeScriptSdk: `// Auto-generated TypeScript Client SDK from OpenAPI ${openapiVersion} (${title} v${version})\n\n${sdkFunctions}`,
  };
}
