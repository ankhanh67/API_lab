import {
  HttpMethod,
  SimulatedApiResponse,
  UniversalLifecycleStep,
  CommunicationEvent,
} from '@/types/api';
import { Language } from '@/config/site';

function tr(lang: Language, vi: string, en: string): string {
  return lang === 'en' ? en : vi;
}

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
  config: UniversalSimConfig,
  lang: Language = 'vi'
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
      titleVi: tr(lang, 'Bước 1: Client khởi tạo và đóng gói Request', 'Step 1: Client constructs and serializes Request'),
      activeComponent: 'client',
      direction: 'internal',
      shortExplanationVi: tr(
        lang,
        'Ứng dụng Client thu thập dữ liệu, thiết lập HTTP Method, URI Endpoint, Headers và tuần tự hóa (Serialize) dữ liệu sang JSON.',
        'Client application collects user input, sets the HTTP Method, URI Endpoint, and Headers, and serializes the payload into JSON.'
      ),
      technicalMechanismVi: tr(
        lang,
        'In-memory JavaScript Object được chuyển đổi qua JSON.stringify() thành chuỗi UTF-8 và gắn kèm Header Content-Type: application/json.',
        'In-memory JavaScript Object is converted via JSON.stringify() into a UTF-8 string with Content-Type: application/json.'
      ),
      communicationState: 'CLIENT_PREPARING_PAYLOAD',
      payloadSnapshot: `${config.method} ${config.endpoint}\nAuthorization: ${
        config.authHeader || '(Missing)'
      }\nContent-Type: application/json\n\n${config.requestBody}`,
    },
    {
      stepNumber: 2,
      titleEn: 'Step 2: Client sends the request',
      titleVi: tr(lang, 'Bước 2: Client truyền gói tin Request qua mạng', 'Step 2: Client transmits Request packet over the network'),
      activeComponent: 'client',
      targetComponent: 'api-layer',
      direction: 'request',
      shortExplanationVi: tr(
        lang,
        'Gói tin HTTP được đẩy xuống tầng giao vận TCP/TLS và di chuyển qua đường truyền mạng tới địa chỉ của API Layer.',
        'The HTTP packet is pushed down to the TCP/TLS transport stack and travels across the network to the API Layer.'
      ),
      technicalMechanismVi: tr(
        lang,
        'Thiết lập kết nối TCP + TLS Handshake; dữ liệu được chia thành các TCP segments mang HTTP Request Line, Headers và Body.',
        'Establishes TCP + TLS Handshake; data is segmented into TCP packets carrying the HTTP Request Line, Headers, and Body.'
      ),
      communicationState: 'IN_FLIGHT_TO_API_LAYER',
      payloadSnapshot: `[TCP/TLS STREAM -> api.lab.local:443]\n>>> ${config.method} ${config.endpoint} HTTP/1.1`,
    },
    {
      stepNumber: 3,
      titleEn: 'Step 3: API receives and validates the request',
      titleVi: tr(lang, 'Bước 3: Tầng API tiếp nhận, xác thực & kiểm tra Schema', 'Step 3: API Layer receives, authenticates & validates Schema'),
      activeComponent: 'api-layer',
      direction: 'internal',
      shortExplanationVi: isError401
        ? tr(lang, 'Tầng API phát hiện thiếu hoặc sai thông tin xác thực (Authorization Header) và chặn yêu cầu ngay tại cửa ngõ!', 'API Layer detected a missing or invalid Authorization Header and rejected the request at the gateway!')
        : isError400
        ? tr(lang, 'Tầng API giải mã JSON và phát hiện dữ liệu vi phạm Schema Validation (400 Bad Request)!', 'API Layer parsed the JSON body and detected a Schema Validation violation (400 Bad Request)!')
        : tr(lang, 'API Gateway định tuyến URI, xác thực chữ ký Token hợp lệ và kiểm tra Schema dữ liệu đầu vào thành công.', 'API Gateway matched the URI route, verified the Bearer token signature, and validated the input Schema.'),
      technicalMechanismVi: tr(
        lang,
        'Middleware chạy tuần tự: Rate Limiter → Auth Verifier → JSON Deserializer → Schema Validator.',
        'Middleware executes sequentially: Rate Limiter → Auth Verifier → JSON Deserializer → Schema Validator.'
      ),
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
      titleVi: tr(lang, 'Bước 4: Server thực thi Logic Nghiệp vụ (Business Logic)', 'Step 4: Server executes Domain Business Logic'),
      activeComponent: 'server',
      direction: 'internal',
      shortExplanationVi:
        isError401 || isError400
          ? tr(lang, 'Bước này bị bỏ qua (Skipped) do tầng API đã từ chối yêu cầu ở Bước 3 nhằm bảo vệ tài nguyên Server.', 'Skipped because the API Layer short-circuited the invalid request at Step 3 to protect backend resources.')
          : tr(lang, 'Application Server thực thi các quy tắc nghiệp vụ: kiểm tra quyền hạn chi tiết, tính toán giá trị và chuẩn bị câu lệnh truy vấn.', 'Application Server executes domain rules: checks fine-grained permissions, computes totals, and prepares database queries.'),
      technicalMechanismVi: tr(
        lang,
        'Domain Service xử lý đối tượng đã Deserialize trong bộ nhớ RAM, áp dụng quy tắc miền (Domain Rules).',
        'Domain Service processes the deserialized in-memory DTO and enforces business invariants.'
      ),
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
      titleVi: tr(lang, 'Bước 5: Server truy vấn / ghi Cơ sở dữ liệu (Database)', 'Step 5: Server queries / persists to the Database'),
      activeComponent: 'database',
      direction: 'internal',
      shortExplanationVi:
        isError401 || isError400
          ? tr(lang, 'Không có tương tác Database nào xảy ra (tiết kiệm I/O vì yêu cầu không hợp lệ).', 'No Database interaction occurred (saving disk I/O since the request failed early validation).')
          : isError500
          ? tr(lang, 'Lỗi kết nối hoặc xung đột khóa trong Database khi thực thi câu lệnh SQL (500 Internal Server Error)!', 'Database deadlock or connection timeout while executing SQL statement (500 Internal Server Error)!')
          : tr(lang, 'Database thực thi truy vấn đọc hoặc giao dịch ACID (Transaction) để lưu trữ dữ liệu bền vững và trả bản ghi về Server.', 'Database executes a read query or ACID Transaction to persist state durably and returns records to the Server.'),
      technicalMechanismVi: tr(
        lang,
        'Connection Pool cấp phát kết nối tới PostgreSQL/Storage Engine; thực thi Prepared Statement.',
        'Connection Pool allocates a PostgreSQL/Storage Engine connection and executes a parameterized Prepared Statement.'
      ),
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
      titleVi: tr(lang, 'Bước 6: Server khởi tạo gói tin Phản hồi (Response)', 'Step 6: Server constructs and serializes the Response'),
      activeComponent: 'server',
      direction: 'internal',
      shortExplanationVi: tr(
        lang,
        'Server đóng gói kết quả (hoặc thông báo lỗi chuẩn hóa) vào cấu trúc DTO, gắn mã trạng thái HTTP Status Code và Serialize sang JSON.',
        'Server packages the result (or standardized error payload) into a response DTO, assigns the HTTP Status Code, and serializes to JSON.'
      ),
      technicalMechanismVi: tr(
        lang,
        `Ánh xạ kết quả sang Response Object, gán HTTP Status (${statusText}) và tính toán Content-Length.`,
        `Maps domain output into Response DTO, assigns HTTP Status (${statusText}), and computes Content-Length.`
      ),
      communicationState: 'SERIALIZING_RESPONSE_DTO',
      payloadSnapshot: isError401
        ? `{"error":"UNAUTHORIZED","message":"Missing or invalid authentication token.","status":401}`
        : isError400
        ? `{"error":"VALIDATION_FAILED","message":"Input payload violated schema constraints.","status":400}`
        : isError500
        ? `{"error":"INTERNAL_DB_ERROR","message":"Database transaction could not be completed.","status":500}`
        : `{"status":"SUCCESS","code":"${statusText}","endpoint":"${config.endpoint}","data":${config.requestBody}}`,
    },
    {
      stepNumber: 7,
      titleEn: 'Step 7: API returns the response',
      titleVi: tr(lang, 'Bước 7: Tầng API gửi trả Response qua mạng về Client', 'Step 7: API Layer transmits Response back over the network'),
      activeComponent: 'api-layer',
      targetComponent: 'client',
      direction: 'response',
      shortExplanationVi: tr(
        lang,
        'Tầng API đính kèm các Headers bảo mật (CORS, X-Request-Id, Cache-Control) và truyền luồng byte phản hồi về lại Client.',
        'API Layer attaches security and caching headers (CORS, X-Request-Id, Cache-Control) and streams the response bytes back to the Client.'
      ),
      technicalMechanismVi: tr(
        lang,
        'Ghi HTTP Status Line, Response Headers và JSON Payload lên kết nối TCP đang mở.',
        'Writes the HTTP Status Line, Response Headers, and JSON Payload onto the open TCP socket.'
      ),
      communicationState: 'RESPONSE_IN_FLIGHT_TO_CLIENT',
      payloadSnapshot: `HTTP/1.1 ${statusText}\nContent-Type: application/json; charset=utf-8\nX-Simulation-Mode: Deterministic-Local\n\n(JSON Payload in transit)`,
    },
    {
      stepNumber: 8,
      titleEn: 'Step 8: Client receives and processes the result',
      titleVi: tr(lang, 'Bước 8: Client nhận phản hồi, giải mã và cập nhật UI', 'Step 8: Client receives response, deserializes JSON & updates UI'),
      activeComponent: 'client',
      direction: 'internal',
      shortExplanationVi: tr(
        lang,
        `Client kiểm tra mã trạng thái HTTP (${statusText}), giải tuần tự hóa (JSON.parse) dữ liệu và cập nhật trạng thái giao diện người dùng.`,
        `Client inspects the HTTP Status Code (${statusText}), deserializes (JSON.parse) the payload, and updates the user interface state.`
      ),
      technicalMechanismVi: tr(
        lang,
        'Promise của fetch() hoàn tất; ứng dụng phân nhánh logic theo response.ok (2xx) hoặc khối xử lý lỗi (4xx/5xx).',
        'The fetch() Promise resolves; client code branches on response.ok (2xx) vs. error handling (4xx/5xx).'
      ),
      communicationState: 'LIFECYCLE_COMPLETE',
      payloadSnapshot: `// Client State Updated:\nStatus: ${statusText}\nisError: ${
        isError400 || isError401 || isError500
      }\nUI Action: ${
        isError400 || isError401 || isError500
          ? tr(lang, 'Hiển thị thông báo lỗi & hướng dẫn khắc phục', 'Render error alert & recovery guidance')
          : tr(lang, 'Render dữ liệu mới lên màn hình', 'Render updated resource data on screen')
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
  input: RestSimulationInput,
  lang: Language = 'vi'
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
            message: tr(lang, 'Bearer Token không hợp lệ hoặc đã hết hạn.', 'Invalid or expired Bearer Token.'),
          },
          null,
          2
        ),
        latencyMs: 32,
        explanationVi: tr(
          lang,
          'Yêu cầu bị từ chối ở tầng Auth Middleware với mã 401 vì Header Authorization chứa token không hợp lệ.',
          'Request rejected at the Auth Middleware with HTTP 401 because the Authorization header contains an invalid token.'
        ),
        isError: true,
        stepsTrace: [
          tr(lang, 'Client gửi HTTP Request kèm Authorization Header', 'Client sent HTTP Request with Authorization Header'),
          tr(lang, 'API Gateway kiểm tra chữ ký Bearer Token -> Thất bại', 'API Gateway verified Bearer Token signature -> Failed'),
          tr(lang, 'Trả về ngay 401 Unauthorized, không gọi xuống Database', 'Short-circuited with 401 Unauthorized without querying Database'),
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
            message: tr(
              lang,
              `Không tìm thấy tài nguyên tại đường dẫn '${cleanPath}'. Hãy sử dụng /api/products hoặc /api/products/{id}.`,
              `No resource found at URI '${cleanPath}'. Use /api/products or /api/products/{id}.`
            ),
          },
          null,
          2
        ),
        latencyMs: 28,
        explanationVi: tr(
          lang,
          'URI không khớp với bất kỳ Resource Route nào trên REST Server nên trả về 404 Not Found.',
          'The URI did not match any registered Resource Route on the REST Server, returning 404 Not Found.'
        ),
        isError: true,
        stepsTrace: [
          tr(lang, `Client gửi ${input.method} ${cleanPath}`, `Client sent ${input.method} ${cleanPath}`),
          tr(lang, 'Router tra cứu bảng định tuyến (Routing Table) -> Không khớp', 'Router checked Routing Table -> No match'),
          tr(lang, 'Server trả về 404 Not Found', 'Server returned 404 Not Found'),
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
        explanationVi: tr(
          lang,
          'Phương thức GET truy vấn danh sách tài nguyên Products (Stateless & Idempotent). Các Query Parameters được dùng để lọc kết quả mà không làm thay đổi dữ liệu gốc.',
          'HTTP GET retrieves the Products collection resource (Stateless & Idempotent). Query Parameters filter the returned list without mutating server state.'
        ),
        isError: false,
        stepsTrace: [
          tr(lang, `Client gửi GET ${cleanPath} kèm Query Params`, `Client sent GET ${cleanPath} with Query Params`),
          tr(lang, 'REST Controller đọc bộ lọc và truy vấn SELECT từ Database', 'REST Controller applied filters and executed SELECT on Database'),
          tr(lang, 'Trả về 200 OK cùng mảng JSON biểu diễn danh sách sản phẩm', 'Returned 200 OK with JSON array representation of products'),
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
              message: tr(lang, `Không tồn tại sản phẩm có ID = ${id}.`, `Product with ID = ${id} does not exist.`),
            },
            null,
            2
          ),
          latencyMs: 44,
          explanationVi: tr(
            lang,
            `Endpoint hợp lệ nhưng tài nguyên Product #${id} không tồn tại trong Database nên trả về mã chuẩn 404 Not Found.`,
            `Valid endpoint route, but Product resource #${id} does not exist in the Database, returning HTTP 404 Not Found.`
          ),
          isError: true,
          stepsTrace: [
            tr(lang, `Client gửi GET /api/products/${id}`, `Client sent GET /api/products/${id}`),
            tr(lang, `Database thực thi SELECT * FROM products WHERE id = ${id} -> 0 rows`, `Database executed SELECT * FROM products WHERE id = ${id} -> 0 rows`),
            tr(lang, 'Trả về 404 Not Found', 'Returned 404 Not Found'),
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
        explanationVi: tr(
          lang,
          `Truy xuất thành công biểu diễn (Representation) JSON của tài nguyên sản phẩm #${id} qua Path Parameter.`,
          `Successfully retrieved the JSON representation of singleton product resource #${id} via Path Parameter.`
        ),
        isError: false,
        stepsTrace: [
          tr(lang, `Client gửi GET /api/products/${id}`, `Client sent GET /api/products/${id}`),
          tr(lang, `Database tìm thấy bản ghi #${id}`, `Database found record #${id}`),
          tr(lang, 'Serialize sang JSON và trả về 200 OK kèm ETag Header', 'Serialized to JSON and returned 200 OK with ETag Header'),
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
              message: tr(lang, 'Request Body không phải là chuỗi JSON hợp lệ.', 'Request Body is not valid JSON syntax.'),
            },
            null,
            2
          ),
          latencyMs: 25,
          explanationVi: tr(
            lang,
            'JSON Deserializer báo lỗi cú pháp khi đọc Request Body nên trả về 400 Bad Request.',
            'JSON Deserializer encountered a syntax error while parsing the Request Body and returned 400 Bad Request.'
          ),
          isError: true,
          stepsTrace: [
            tr(lang, 'Client gửi POST /api/products', 'Client sent POST /api/products'),
            tr(lang, 'Tầng API parse JSON thất bại -> 400 Bad Request', 'API Layer JSON parsing failed -> 400 Bad Request'),
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
              message: tr(
                lang,
                'Trường "name" (chuỗi khác rỗng) và "price" (số > 0) là bắt buộc.',
                'Fields "name" (non-empty string) and "price" (number > 0) are required.'
              ),
            },
            null,
            2
          ),
          latencyMs: 35,
          explanationVi: tr(
            lang,
            'Dữ liệu JSON đúng cú pháp nhưng vi phạm ràng buộc nghiệp vụ (thiếu tên hoặc giá <= 0), trả về 400 Bad Request.',
            'JSON syntax is valid but violates domain schema constraints (missing name or price <= 0), returning 400 Bad Request.'
          ),
          isError: true,
          stepsTrace: [
            tr(lang, 'Client gửi POST /api/products', 'Client sent POST /api/products'),
            tr(lang, 'Schema Validator phát hiện trường name/price không hợp lệ -> 400 Bad Request', 'Schema Validator rejected invalid name/price fields -> 400 Bad Request'),
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
        explanationVi: tr(
          lang,
          `Tạo mới tài nguyên thành công! Server sinh ID mới (#${created.id}), trả về mã chuẩn 201 Created cùng Header Location trỏ tới URI của sản phẩm mới. Lưu ý: POST không có tính Idempotent.`,
          `Resource created! The server generated a new ID (#${created.id}) and returned HTTP 201 Created with a Location header pointing to the new URI. Note: POST is NOT idempotent.`
        ),
        isError: false,
        stepsTrace: [
          tr(lang, 'Client gửi POST /api/products kèm JSON Body', 'Client sent POST /api/products with JSON Body'),
          tr(lang, 'Server xác thực Schema và thực thi INSERT INTO products', 'Server validated Schema and executed INSERT INTO products'),
          tr(lang, `Trả về 201 Created kèm Location: /api/products/${created.id}`, `Returned 201 Created with Location: /api/products/${created.id}`),
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
              message: tr(lang, `Không tìm thấy sản phẩm #${id} để cập nhật.`, `Product #${id} not found for update.`),
            },
            null,
            2
          ),
          latencyMs: 45,
          explanationVi: tr(
            lang,
            `Không thể cập nhật vì tài nguyên #${id} không tồn tại (404 Not Found).`,
            `Cannot update because resource #${id} does not exist (404 Not Found).`
          ),
          isError: true,
          stepsTrace: [
            tr(lang, `Client gửi ${input.method} /api/products/${id}`, `Client sent ${input.method} /api/products/${id}`),
            tr(lang, 'Không tìm thấy bản ghi trong Database -> 404 Not Found', 'Record not found in Database -> 404 Not Found'),
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
              message: tr(lang, 'Body gửi lên không phải JSON hợp lệ.', 'Request body is not valid JSON.'),
            },
            null,
            2
          ),
          latencyMs: 29,
          explanationVi: tr(lang, 'Lỗi cú pháp JSON trong phần thân yêu cầu cập nhật.', 'JSON syntax error in update request body.'),
          isError: true,
          stepsTrace: [tr(lang, 'Parse JSON thất bại -> 400 Bad Request', 'JSON parse failed -> 400 Bad Request')],
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
            ? tr(
                lang,
                `Cập nhật một phần (Partial Update - PATCH) tài nguyên #${id} thành công. Chỉ các trường có mặt trong JSON Body mới bị thay đổi.`,
                `Partial Update (HTTP PATCH) applied to resource #${id}. Only the fields provided in the JSON Body were modified.`
              )
            : tr(
                lang,
                `Thay thế toàn bộ biểu diễn (PUT - Idempotent) của tài nguyên #${id} thành công.`,
                `Full representation replacement (HTTP PUT - Idempotent) completed for resource #${id}.`
              ),
        isError: false,
        stepsTrace: [
          tr(lang, `Client gửi ${input.method} /api/products/${id}`, `Client sent ${input.method} /api/products/${id}`),
          tr(lang, `Server cập nhật bản ghi #${id} trong Database`, `Server updated record #${id} in Database`),
          tr(lang, 'Trả về 200 OK kèm trạng thái mới của sản phẩm', 'Returned 200 OK with updated product representation'),
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
              message: tr(lang, `Sản phẩm #${id} không tồn tại hoặc đã bị xóa trước đó.`, `Product #${id} does not exist or was already deleted.`),
            },
            null,
            2
          ),
          latencyMs: 41,
          explanationVi: tr(
            lang,
            `Tài nguyên #${id} không còn tồn tại trong hệ thống nên trả về 404 Not Found.`,
            `Resource #${id} is no longer present in the system, returning 404 Not Found.`
          ),
          isError: true,
          stepsTrace: [
            tr(lang, `Client gửi DELETE /api/products/${id}`, `Client sent DELETE /api/products/${id}`),
            tr(lang, 'Không tìm thấy bản ghi -> 404 Not Found', 'Record not found -> 404 Not Found'),
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
        explanationVi: tr(
          lang,
          `Đã xóa sản phẩm #${id} khỏi danh mục. DELETE có tính Idempotent về trạng thái hệ thống (tài nguyên #${id} không còn tồn tại sau lệnh xóa).`,
          `Deleted product #${id} from the catalog. DELETE is idempotent with respect to server state (resource #${id} remains absent).`
        ),
        isError: false,
        stepsTrace: [
          tr(lang, `Client gửi DELETE /api/products/${id}`, `Client sent DELETE /api/products/${id}`),
          tr(lang, `Database thực thi DELETE FROM products WHERE id = ${id}`, `Database executed DELETE FROM products WHERE id = ${id}`),
          tr(lang, 'Trả về 200 OK xác nhận đã xóa tài nguyên', 'Returned 200 OK confirming deletion'),
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
          message: tr(
            lang,
            `Phương thức ${input.method} không được phép trên đường dẫn ${cleanPath}.`,
            `HTTP method ${input.method} is not allowed on URI ${cleanPath}.`
          ),
        },
        null,
        2
      ),
      latencyMs: 24,
      explanationVi: tr(
        lang,
        'REST quy định rõ phương thức nào áp dụng cho Collection (/api/products) hay Item (/api/products/{id}). Gọi sai tổ hợp sẽ nhận mã 405 Method Not Allowed.',
        'REST strictly defines which verbs apply to a Collection (/api/products) vs. a Singleton Item (/api/products/{id}). Invalid combinations return 405 Method Not Allowed.'
      ),
      isError: true,
      stepsTrace: [
        tr(lang, `Client gửi ${input.method} ${cleanPath}`, `Client sent ${input.method} ${cleanPath}`),
        tr(lang, 'Router phát hiện Method không được hỗ trợ cho URI này -> 405 Method Not Allowed', 'Router rejected unsupported HTTP verb for this URI -> 405 Method Not Allowed'),
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
  requestXml: string,
  lang: Language = 'vi'
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
        <soap:Text xml:lang="${lang}">${tr(
          lang,
          'Tài khoản nguồn không tồn tại hoặc số tiền vượt hạn mức thanh toán (XSD Contract Violation).',
          'Source account does not exist or transfer amount exceeds settlement limit (XSD Contract Violation).'
        )}</soap:Text>
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
        envelopeVi: tr(
          lang,
          'Phần tử gốc <soap:Envelope> định nghĩa không gian tên (XML Namespace) chuẩn SOAP 1.2.',
          'The root <soap:Envelope> element defines the standard SOAP 1.2 XML Namespace.'
        ),
        headerVi: tr(
          lang,
          'Phần <soap:Header> chứa thông tin định danh kênh gọi (CORP_ERP_01) và chữ ký bảo mật WS-Security.',
          'The <soap:Header> carries the calling channel identity (CORP_ERP_01) and WS-Security credentials.'
        ),
        bodyVi: tr(
          lang,
          'Khi xảy ra lỗi, <soap:Body> chứa khối <soap:Fault> chuẩn hóa thay vì thẻ kết quả thông thường.',
          'When an error occurs, <soap:Body> contains a standardized <soap:Fault> block instead of a normal result tag.'
        ),
        faultVi: tr(
          lang,
          'Khối <soap:Fault> bắt buộc có <soap:Code>, <soap:Reason> và <soap:Detail> mô tả mã lỗi nghiệp vụ ngân hàng theo hợp đồng WSDL.',
          'The <soap:Fault> block mandates <soap:Code>, <soap:Reason>, and <soap:Detail> describing the WSDL banking domain error code.'
        ),
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
        envelopeVi: tr(
          lang,
          '<soap:Envelope> đóng gói toàn bộ bức điện XML, đảm bảo cả Client và Core Banking hiểu cùng phiên bản giao thức.',
          '<soap:Envelope> wraps the entire SOAP XML message, ensuring both Client and Core Banking enforce the same protocol version.'
        ),
        headerVi: tr(
          lang,
          '<soap:Header> truyền Metadata cấp giao thức (Token WS-Security ở chiều đi, mã Node xử lý ở chiều về) tách biệt khỏi dữ liệu nghiệp vụ.',
          '<soap:Header> carries protocol-level metadata (WS-Security token outbound, processing CoreNode trace inbound) decoupled from business payload.'
        ),
        bodyVi: tr(
          lang,
          '<soap:Body> chứa <bank:GetAccountBalanceResponse> tuân thủ nghiêm ngặt kiểu dữ liệu XSD trong tài liệu WSDL.',
          '<soap:Body> contains <bank:GetAccountBalanceResponse> strictly validated against the XSD types in the WSDL contract.'
        ),
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
        envelopeVi: tr(
          lang,
          'Khung XML SOAP bảo toàn tính toàn vẹn cấu trúc cho giao dịch chuyển tiền liên ngân hàng.',
          'The SOAP XML envelope preserves structural integrity for the interbank funds transfer transaction.'
        ),
        headerVi: tr(
          lang,
          'Sử dụng TransactionIdempotencyKey trong <soap:Header> để chống trừ tiền hai lần nếu đường truyền bị đứt giữa chừng.',
          'Uses TransactionIdempotencyKey inside <soap:Header> to prevent double-debiting if a network drop triggers a retry.'
        ),
        bodyVi: tr(
          lang,
          '<bank:TransferMoneyResponse> xác nhận mã hạch toán (SettlementId) và số dư còn lại.',
          '<bank:TransferMoneyResponse> confirms the official SettlementId and remaining balance.'
        ),
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
      envelopeVi: tr(
        lang,
        'Gói tin SOAP Envelope chứa danh sách lịch sử giao dịch có cấu trúc phân cấp.',
        'The SOAP Envelope wraps a hierarchically structured list of ledger transactions.'
      ),
      headerVi: tr(
        lang,
        'Xác thực kênh kết nối doanh nghiệp qua AuthHeader.',
        'Authenticates the enterprise channel via AuthHeader.'
      ),
      bodyVi: tr(
        lang,
        'Trả về danh sách các phần tử <bank:Transaction> theo đúng định nghĩa mảng trong WSDL.',
        'Returns a sequence of <bank:Transaction> elements conforming to the WSDL array sequence definition.'
      ),
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
  selection: GraphqlFieldSelection,
  lang: Language = 'vi'
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
    explanationVi: tr(
      lang,
      `GraphQL Server chỉ thực thi ${resolvers.length} Resolver tương ứng với các trường được yêu cầu trong Query, trả về đúng ${graphqlByteSize} bytes (so với ${restByteSize} bytes nếu gọi REST lấy toàn bộ Object kèm các trường thừa như phone, address, budgetVnd).`,
      `The GraphQL Server executed only ${resolvers.length} Resolver(s) matching the requested fields in your Query, returning ${graphqlByteSize} bytes (compared to ${restByteSize} bytes if calling REST and over-fetching unused fields like phone, address, and budgetVnd).`
    ),
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
  amountVnd: number,
  lang: Language = 'vi'
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
          explanationVi: tr(
            lang,
            'Order Service gọi hàm Stub cục bộ; Protobuf nén các trường thành Tag-Length-Value nhị phân và gửi qua 1 HTTP/2 DATA Frame.',
            'Order Service invokes the local Stub method; Protobuf encodes fields into binary Tag-Length-Value bytes sent in a single HTTP/2 DATA Frame.'
          ),
        },
        {
          frameIndex: 2,
          direction: 'server-to-client',
          timestampOffsetMs: 4,
          methodName: 'PaymentService/ProcessPayment',
          structuredMessage: `PaymentResponse { transaction_id: "TXN-9921", status: APPROVED, grpc_status: 0 (OK) }`,
          conceptualBinaryHex: '0A 08 54 58 4E 2D 39 39 32 31 10 01 [HEADERS: grpc-status=0]',
          explanationVi: tr(
            lang,
            'Payment Service giải mã nhị phân, xử lý thanh toán và trả về kết quả kèm HTTP/2 Trailing Header grpc-status: 0 (OK).',
            'Payment Service decodes the binary frame, authorizes payment, and returns the binary response with HTTP/2 Trailing Header grpc-status: 0 (OK).'
          ),
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
          explanationVi: tr(
            lang,
            'Client gửi 1 yêu cầu duy nhất để đăng ký nhận luồng trạng thái đơn hàng.',
            'Client sends a single request to subscribe to the live order fulfillment stream.'
          ),
        },
        {
          frameIndex: 2,
          direction: 'server-to-client',
          timestampOffsetMs: 15,
          methodName: 'Stream Frame #1',
          structuredMessage: `FulfillmentEvent { stage: "PAYMENT_VERIFIED", progress_pct: 33 }`,
          conceptualBinaryHex: '0A 10 50 41 59 4D 45 4E 54 5F 56 45 52 49 46 49 45 44 10 21',
          explanationVi: tr(
            lang,
            'Server đẩy Frame #1 ngay khi xác nhận thanh toán trên cùng luồng HTTP/2.',
            'Server pushes Frame #1 over the open HTTP/2 stream as soon as payment is verified.'
          ),
        },
        {
          frameIndex: 3,
          direction: 'server-to-client',
          timestampOffsetMs: 40,
          methodName: 'Stream Frame #2',
          structuredMessage: `FulfillmentEvent { stage: "INVENTORY_RESERVED", progress_pct: 66 }`,
          conceptualBinaryHex: '0A 12 49 4E 56 45 4E 54 4F 52 59 5F 52 45 53 45 52 56 45 44 10 42',
          explanationVi: tr(
            lang,
            'Server đẩy tiếp Frame #2 khi kho hàng đã khóa tồn kho sản phẩm.',
            'Server pushes Frame #2 once the warehouse service locks inventory.'
          ),
        },
        {
          frameIndex: 4,
          direction: 'server-to-client',
          timestampOffsetMs: 75,
          methodName: 'Stream Frame #3 (EOS)',
          structuredMessage: `FulfillmentEvent { stage: "READY_FOR_DISPATCH", progress_pct: 100 }`,
          conceptualBinaryHex: '0A 12 52 45 41 44 59 5F 46 4F 52 5F 44 49 53 50 41 54 43 48 10 64',
          explanationVi: tr(
            lang,
            'Server gửi Frame cuối cùng và đóng stream với cờ END_STREAM.',
            'Server transmits the final frame and closes the stream with the END_STREAM flag.'
          ),
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
          explanationVi: tr(
            lang,
            'Client đẩy liên tiếp các bản ghi biến động kho lên Server qua stream.',
            'Client streams consecutive inventory delta chunks to the Server.'
          ),
        },
        {
          frameIndex: 2,
          direction: 'client-to-server',
          timestampOffsetMs: 18,
          methodName: 'Client Stream Chunk #2 (EOF)',
          structuredMessage: `StockDelta { sku: "SKU-204", warehouse: "WH-HN", delta: +50 }`,
          conceptualBinaryHex: '0A 07 53 4B 55 2D 32 30 34 18 32',
          explanationVi: tr(
            lang,
            'Client gửi bản ghi thứ hai và báo hiệu kết thúc luồng gửi (Half-Close).',
            'Client sends the second chunk and signals stream completion (Half-Close).'
          ),
        },
        {
          frameIndex: 3,
          direction: 'server-to-client',
          timestampOffsetMs: 32,
          methodName: 'InventoryService/UploadStockTelemetry',
          structuredMessage: `BatchSyncSummary { processed_items: 2, status: "COMMITTED" }`,
          conceptualBinaryHex: '08 02 12 09 43 4F 4D 4D 49 54 54 45 44',
          explanationVi: tr(
            lang,
            'Server tổng hợp toàn bộ luồng dữ liệu của Client và trả về 1 phản hồi tổng kết.',
            'Server aggregates the entire client stream and returns a single summary response.'
          ),
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
        explanationVi: tr(
          lang,
          'Client phát tín hiệu giao dịch #1 lên luồng hai chiều.',
          'Client emits transaction signal #1 onto the bidirectional stream.'
        ),
      },
      {
        frameIndex: 2,
        direction: 'server-to-client',
        timestampOffsetMs: 6,
        methodName: 'Decision #1',
        structuredMessage: `RiskDecision { risk_score: 0.04, action: "ALLOW" }`,
        conceptualBinaryHex: '0D CD CC 2C 3D 12 05 41 4C 4C 4F 57',
        explanationVi: tr(
          lang,
          'Server phản hồi ngay quyết định ALLOW trong khi luồng vẫn mở.',
          'Server immediately streams back an ALLOW decision while keeping the stream open.'
        ),
      },
      {
        frameIndex: 3,
        direction: 'client-to-server',
        timestampOffsetMs: 14,
        methodName: 'Signal #2',
        structuredMessage: `TransactionSignal { order_id: "${orderId}-B", velocity_1m: 18 }`,
        conceptualBinaryHex: '0A 0C 4F 52 44 2D 32 30 32 36 2D 42 18 12',
        explanationVi: tr(
          lang,
          'Client phát tiếp tín hiệu thứ 2 độc lập trên cùng kết nối HTTP/2.',
          'Client transmits a second independent signal over the same HTTP/2 stream.'
        ),
      },
      {
        frameIndex: 4,
        direction: 'server-to-client',
        timestampOffsetMs: 19,
        methodName: 'Decision #2',
        structuredMessage: `RiskDecision { risk_score: 0.89, action: "STEP_UP_2FA" }`,
        conceptualBinaryHex: '0D EC 51 63 3F 12 0B 53 54 45 50 5F 55 50 5F 32 46 41',
        explanationVi: tr(
          lang,
          'Server phát hiện tần suất bất thường và đẩy phản hồi yêu cầu xác thực 2FA tức thì.',
          'Server detects abnormal velocity and pushes an instant STEP_UP_2FA risk decision.'
        ),
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

export function simulateWebhookDelivery(
  params: {
    eventType: WebhookEventType;
    callbackUrl: string;
    secretKey: string;
    tamperSignature: boolean;
    simulateReceiver500Error: boolean;
    orderAmountVnd: number;
  },
  lang: Language = 'vi'
): WebhookSimulationResult {
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
      explanationVi: tr(
        lang,
        'Webhook Endpoint nhận HTTP POST nhưng khi tính lại HMAC-SHA256 từ Body và Secret Key thì không khớp với Header X-Webhook-Signature -> Từ chối với mã 401 để chống giả mạo!',
        'Webhook Endpoint received HTTP POST, but recomputing HMAC-SHA256 from the Body and Secret Key did not match X-Webhook-Signature -> Rejected with HTTP 401!'
      ),
    });
  } else if (params.simulateReceiver500Error) {
    attempts.push(
      {
        attemptNumber: 1,
        delayLabel: '0s (Initial Push)',
        httpStatus: 500,
        outcome: 'FAILED_WILL_RETRY',
        explanationVi: tr(
          lang,
          'Lần gửi #1: Server nhận Webhook đang quá tải trả về 500 Internal Server Error. Nhà cung cấp đưa sự kiện vào hàng đợi Retry.',
          'Attempt #1: Receiver endpoint returned 500 Internal Server Error. Provider queued the event for Exponential Backoff retry.'
        ),
      },
      {
        attemptNumber: 2,
        delayLabel: '+5s (Exponential Backoff #1)',
        httpStatus: 503,
        outcome: 'FAILED_WILL_RETRY',
        explanationVi: tr(
          lang,
          'Lần gửi #2 (sau 5 giây): Endpoint vẫn phản hồi 503 Service Unavailable. Tăng gấp đôi thời gian chờ (Exponential Backoff).',
          'Attempt #2 (+5s): Receiver returned 503 Service Unavailable. Provider doubled the backoff interval.'
        ),
      },
      {
        attemptNumber: 3,
        delayLabel: '+25s (Exponential Backoff #2 - Recovered)',
        httpStatus: 200,
        outcome: 'DELIVERED',
        explanationVi: tr(
          lang,
          'Lần gửi #3 (sau 25 giây): Server nhận đã phục hồi, kiểm tra Idempotency Key chưa xử lý, cập nhật đơn hàng và trả về 200 OK để dừng chu trình Retry.',
          'Attempt #3 (+25s): Receiver recovered, verified HMAC & Idempotency Key, updated the order, and returned 200 OK to stop retries.'
        ),
      }
    );
  } else {
    attempts.push({
      attemptNumber: 1,
      delayLabel: '0s (Immediate Push)',
      httpStatus: 200,
      outcome: 'DELIVERED',
      explanationVi: tr(
        lang,
        'Nhà cung cấp chủ động bắn HTTP POST tới Callback URL; hệ thống nhận xác thực chữ ký HMAC thành công và phản hồi 200 OK trong 38ms.',
        'Provider actively pushed HTTP POST to Callback URL; consumer verified the HMAC-SHA256 signature and acknowledged with 200 OK in 38ms.'
      ),
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
// 7. MODULE 7: WEBRTC P2P SIGNALING, ICE/STUN/TURN & MEDIA/DATACHANNEL ENGINE
// ============================================================================

export type WebRtcNatTopology =
  | 'lan-host'
  | 'cone-nat-stun'
  | 'symmetric-nat-turn';

export type WebRtcVideoCodec = 'VP9' | 'H264' | 'AV1';

export interface WebRtcIceCandidateItem {
  id: string;
  peer: 'Peer A' | 'Peer B';
  type: 'host' | 'srflx' | 'relay';
  ipPort: string;
  priority: number;
  selected: boolean;
  descriptionVi: string;
}

export interface WebRtcSimulationResult {
  natTopology: WebRtcNatTopology;
  videoCodec: WebRtcVideoCodec;
  enableVideo: boolean;
  enableAudio: boolean;
  enableDataChannel: boolean;
  isDirectP2P: boolean;
  activePathLabel: string;
  estimatedRttMs: number;
  sdpOfferText: string;
  sdpAnswerText: string;
  iceCandidates: WebRtcIceCandidateItem[];
  handshakeStages: {
    stage: number;
    title: string;
    detailVi: string;
  }[];
}

export function simulateWebRtcSession(
  params: {
    natTopology: WebRtcNatTopology;
    videoCodec: WebRtcVideoCodec;
    enableVideo: boolean;
    enableAudio: boolean;
    enableDataChannel: boolean;
  },
  lang: Language = 'vi'
): WebRtcSimulationResult {
  const isDirectP2P = params.natTopology !== 'symmetric-nat-turn';

  const activePathLabel =
    params.natTopology === 'lan-host'
      ? 'Direct Local LAN P2P (Peer A 192.168.1.10 ⇄ Peer B 192.168.1.25 via UDP)'
      : params.natTopology === 'cone-nat-stun'
      ? 'NAT Hole-Punched Direct P2P via STUN (203.113.148.22:54321 ⇄ 118.70.12.99:60112)'
      : 'TURN Relay Fallback (Peer A ⇄ TURN Server 34.120.88.10:3478 ⇄ Peer B)';

  const estimatedRttMs =
    params.natTopology === 'lan-host'
      ? 4
      : params.natTopology === 'cone-nat-stun'
      ? 16
      : 48;

  const sdpOfferLines: string[] = [
    'v=0',
    'o=peerA 48291049123 2 IN IP4 127.0.0.1',
    's=WebRTC P2P Engineering Session',
    't=0 0',
    'a=group:BUNDLE ' +
      [
        params.enableAudio ? '0' : null,
        params.enableVideo ? '1' : null,
        params.enableDataChannel ? '2' : null,
      ]
        .filter(Boolean)
        .join(' '),
    'a=fingerprint:sha-256 7F:4B:12:9C:E0:A1:88:3D:55:21:9B:04:C2:F1:11:90',
    'a=setup:actpass',
  ];

  if (params.enableAudio) {
    sdpOfferLines.push(
      'm=audio 9 UDP/TLS/RTP/SAVPF 111',
      'a=mid:0',
      'a=sendrecv',
      'a=rtpmap:111 opus/48000/2'
    );
  }
  if (params.enableVideo) {
    const pt = params.videoCodec === 'VP9' ? 98 : params.videoCodec === 'AV1' ? 45 : 102;
    sdpOfferLines.push(
      `m=video 9 UDP/TLS/RTP/SAVPF ${pt}`,
      'a=mid:1',
      'a=sendrecv',
      `a=rtpmap:${pt} ${params.videoCodec}/90000`
    );
  }
  if (params.enableDataChannel) {
    sdpOfferLines.push(
      'm=application 9 UDP/DTLS/SCTP webrtc-datachannel',
      'a=mid:2',
      'a=sctp-port:5000',
      'a=max-message-size:262144'
    );
  }

  const sdpOfferText = sdpOfferLines.join('\n');
  const sdpAnswerText = sdpOfferText
    .replace('o=peerA 48291049123', 'o=peerB 99182736451')
    .replace('a=setup:actpass', 'a=setup:active');

  const iceCandidates: WebRtcIceCandidateItem[] = [
    {
      id: 'cand-host-a',
      peer: 'Peer A',
      type: 'host',
      ipPort: '192.168.1.10:51002 (UDP)',
      priority: 2122260223,
      selected: params.natTopology === 'lan-host',
      descriptionVi: tr(
        lang,
        'Địa chỉ IP nội bộ (LAN Host Candidate). Được chọn khi cả 2 máy cùng nằm trong một mạng Wi-Fi/LAN.',
        'Local LAN Host Candidate. Selected when both peers share the same local Wi-Fi/LAN subnet.'
      ),
    },
    {
      id: 'cand-srflx-a',
      peer: 'Peer A',
      type: 'srflx',
      ipPort: '203.113.148.22:54321 (STUN Reflexive)',
      priority: 1686052607,
      selected: params.natTopology === 'cone-nat-stun',
      descriptionVi: tr(
        lang,
        'Địa chỉ IP/Port công cộng do STUN Server phát hiện. Cho phép đục lỗ NAT (UDP Hole Punching) để truyền P2P trực tiếp qua Internet.',
        'Public IP/Port discovered via STUN Server (srflx). Enables UDP Hole Punching for direct P2P streaming over the Internet.'
      ),
    },
    {
      id: 'cand-relay-a',
      peer: 'Peer A',
      type: 'relay',
      ipPort: '34.120.88.10:3478 (TURN Relay)',
      priority: 41819903,
      selected: params.natTopology === 'symmetric-nat-turn',
      descriptionVi: tr(
        lang,
        'Địa chỉ chuyển tiếp trên TURN Server. Chỉ kích hoạt khi tường lửa Symmetric NAT chặn hoàn toàn kết nối P2P trực tiếp.',
        'TURN Relay address. Activated only when restrictive Symmetric NAT firewalls block direct P2P UDP connections.'
      ),
    },
  ];

  const handshakeStages = [
    {
      stage: 1,
      title: '1. WebSocket Signaling (SDP Offer & Answer)',
      detailVi: tr(
        lang,
        `Peer A và Peer B kết nối tới Signaling Server (WebSocket) để trao đổi bản mô tả phiên SDP (thống nhất codec ${params.videoCodec}/Opus và khóa vân tay DTLS).`,
        `Peer A and Peer B connect to the WebSocket Signaling Server to exchange SDP Offer/Answer manifests (negotiating ${params.videoCodec}/Opus codecs and DTLS fingerprints).`
      ),
    },
    {
      stage: 2,
      title: '2. ICE Candidate Gathering (STUN / TURN)',
      detailVi:
        params.natTopology === 'lan-host'
          ? tr(
              lang,
              'Hai Peer phát hiện cùng dải mạng LAN nội bộ nên chọn ngay cặp Host Candidate (192.168.1.x).',
              'Both peers detect the same local LAN subnet and select the direct Host Candidate pair (192.168.1.x).'
            )
          : params.natTopology === 'cone-nat-stun'
          ? tr(
              lang,
              'Hai Peer gọi STUN Server (stun:19302) để lấy IP/Port công cộng (srflx) và đục lỗ UDP thành công.',
              'Both peers query the STUN Server (stun:19302) to discover their public IP/Port (srflx) and complete UDP NAT hole punching.'
            )
          : tr(
              lang,
              'Tường lửa doanh nghiệp (Symmetric NAT) chặn kết nối UDP trực tiếp! ICE tự động chuyển sang ứng viên dự phòng TURN Relay (typ relay).',
              'Corporate Symmetric NAT firewall blocked direct UDP! ICE automatically falls back to the TURN Relay candidate (typ relay).'
            ),
    },
    {
      stage: 3,
      title: '3. DTLS-SRTP Encrypted Handshake',
      detailVi: tr(
        lang,
        'Hai Peer thực hiện bắt tay mật mã DTLS trực tiếp trên luồng UDP và đối chiếu khớp chứng chỉ a=fingerprint trong SDP.',
        'Both peers complete a direct DTLS cryptographic handshake over UDP and verify certificate fingerprints against the SDP a=fingerprint attribute.'
      ),
    },
    {
      stage: 4,
      title: isDirectP2P
        ? '4. Direct P2P Media & DataChannel Streaming'
        : '4. TURN-Relayed Media & DataChannel Streaming',
      detailVi: isDirectP2P
        ? tr(
            lang,
            `Luồng dữ liệu chảy trực tiếp giữa trình duyệt Peer A ⇄ Peer B với độ trễ chỉ ${estimatedRttMs}ms, tải trên Signaling Server = 0%.`,
            `Media and DataChannel packets flow directly Peer A ⇄ Peer B with ${estimatedRttMs}ms RTT and 0% media bandwidth on the Signaling Server.`
          )
        : tr(
            lang,
            `Luồng dữ liệu được chuyển tiếp an toàn qua TURN Server với độ trễ ${estimatedRttMs}ms để vượt qua tường lửa khắt khe.`,
            `Encrypted packets are relayed through the TURN Server with ${estimatedRttMs}ms RTT to bypass the restrictive firewall.`
          ),
    },
  ];

  return {
    natTopology: params.natTopology,
    videoCodec: params.videoCodec,
    enableVideo: params.enableVideo,
    enableAudio: params.enableAudio,
    enableDataChannel: params.enableDataChannel,
    isDirectP2P,
    activePathLabel,
    estimatedRttMs,
    sdpOfferText,
    sdpAnswerText,
    iceCandidates,
    handshakeStages,
  };
}
