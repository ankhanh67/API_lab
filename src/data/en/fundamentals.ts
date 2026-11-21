import {
  FundamentalLifecycleNode,
  HttpMethodDetail,
  StatusCodeCategory,
  AuthMechanismDetail,
} from '@/data/fundamentals';

export const FUNDAMENTAL_LIFECYCLE_STAGES_EN: FundamentalLifecycleNode[] = [
  {
    id: 'client',
    order: 1,
    nameEn: '1. Client (Constructing Request)',
    nameVi: '1. Client (Constructing Request)',
    roleEn: 'Browser / Mobile App / CLI Service',
    summaryVi:
      'The client application gathers user input or service parameters and packages them into a well-formed request structure before handing it off to the network stack.',
    internalWorkingsVi: [
      'Determine the target URI (Endpoint), HTTP method (e.g., POST /api/orders), and Query Parameters.',
      'Serialize in-memory application objects into a UTF-8 JSON/XML string or binary payload.',
      'Attach metadata into HTTP Headers: Content-Type, Accept, and Authorization (Bearer Token / API Key).',
    ],
    rawArtifactTitle: 'Client In-Memory State → Serialized Payload',
    rawArtifactCode: `// Client in-memory state
const orderDraft = { productId: 101, quantity: 2, currency: "USD" };

// Serialization into JSON string
const serializedBody = JSON.stringify(orderDraft);`,
  },
  {
    id: 'api-request',
    order: 2,
    nameEn: '2. API Request (Network Transit)',
    nameVi: '2. API Request (Network Transit)',
    roleEn: 'HTTP / TCP / TLS Transport',
    summaryVi:
      'The request travels over the network connection (typically TCP encrypted via TLS/HTTPS) as a stream of bytes conforming to the protocol specification.',
    internalWorkingsVi: [
      'Resolve the domain name via DNS and complete the TCP 3-way handshake + TLS cryptographic handshake.',
      'Frame the Request Line, HTTP Header block, and Request Body onto the wire.',
      'Ensure packet integrity and ordered delivery to the destination IP address and server port.',
    ],
    rawArtifactTitle: 'Raw HTTP/1.1 Request Wire Format',
    rawArtifactCode: `POST /api/v1/orders HTTP/1.1
Host: api.commerce-lab.edu.vn
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
Accept: application/json

{"productId":101,"quantity":2,"currency":"USD"}`,
  },
  {
    id: 'api-layer',
    order: 3,
    nameEn: '3. API Layer (Gateway & Validation)',
    nameVi: '3. API Layer (Gateway & Validation)',
    roleEn: 'API Gateway / Router / Middleware',
    summaryVi:
      'The backend entry point receives the packet, enforces security policies, applies rate limiting, and validates payload schema before business execution.',
    internalWorkingsVi: [
      'Verify identity (Authentication) via API Key or JWT signature and check resource permissions (Authorization).',
      'Deserialize the raw JSON/XML byte stream into native typed data structures.',
      'Run Schema Validation; immediately reject malformed inputs with 400 Bad Request or 401 Unauthorized.',
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
    nameVi: '4. Server (Business Logic Execution)',
    roleEn: 'Application Server / Domain Service',
    summaryVi:
      'The core domain engine enforces business rules, calculates totals, verifies inventory availability, or coordinates downstream internal services.',
    internalWorkingsVi: [
      'Enforce domain invariants: Is the item in stock? Is the promotional code valid?',
      'Compute totals, taxes, and generate a unique transaction identifier.',
      'Prepare parameterized database queries or transactional commands for the persistence layer.',
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
    nameVi: '5. Database (Persistence & Query)',
    roleEn: 'PostgreSQL / Redis / Storage Engine',
    summaryVi:
      'Reads or persists state durably to disk or memory with strict ACID transactional guarantees.',
    internalWorkingsVi: [
      'Open an atomic transaction to decrement available stock and insert the new order record.',
      'Guarantee Atomicity: if any statement fails, the entire transaction rolls back cleanly.',
      'Return the persisted record along with generated primary keys and timestamps to the server.',
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
    nameVi: '6. Server Response (Generating Response)',
    roleEn: 'Response Formatter & Serializer',
    summaryVi:
      'The server maps the domain result into a clean Data Transfer Object (DTO), assigns the appropriate HTTP status code, and serializes it into JSON/XML.',
    internalWorkingsVi: [
      'Strip internal or sensitive fields (such as password hashes or internal database keys).',
      'Assign an accurate HTTP Status Code (e.g., 201 Created for new resource creation).',
      'Serialize the response object into JSON and attach Response Headers (Content-Type, Cache-Control).',
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
    nameVi: '7. Client (Deserializing & Rendering)',
    roleEn: 'Client State Manager & UI Renderer',
    summaryVi:
      'The client receives the response packet, inspects the status code, deserializes the payload, and updates the user interface state.',
    internalWorkingsVi: [
      'Inspect the HTTP Status Code (2xx = success, 4xx = client error, 5xx = server fault).',
      'Parse (JSON.parse) the UTF-8 response string back into an in-memory JavaScript object.',
      'Update UI state to render the order confirmation or actionable error feedback.',
    ],
    rawArtifactTitle: 'Client Response Handling',
    rawArtifactCode: `if (response.status === 201) {
  const data = await response.json();
  uiState.setNotification(\`Order confirmed: #\${data.orderId}\`);
}`,
  },
];

export const HTTP_METHODS_GUIDE_EN: HttpMethodDetail[] = [
  {
    method: 'GET',
    purposeVi:
      'Retrieves a representation of a single resource or collection of resources. Read-only; never mutates server state.',
    idempotent: true,
    safe: true,
    hasBody: false,
    exampleEndpoint: 'GET /api/products?category=books&limit=2',
    requestPayload: '(No Request Body — parameters are passed via URL Path or Query String)',
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
    purposeVi:
      'Creates a new subordinate resource on the server or triggers a non-idempotent business action.',
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
    purposeVi:
      'Replaces the entire representation of an existing resource at a known URI. Calling it N times with the same payload yields the same state (Idempotent).',
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
    purposeVi:
      'Applies a partial update to specific fields of a resource without resending the full object representation.',
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
    purposeVi: 'Removes the resource identified by the target URI from the system.',
    idempotent: true,
    safe: false,
    hasBody: false,
    exampleEndpoint: 'DELETE /api/products/101',
    requestPayload: '(No Request Body required)',
    responseStatus: '200 OK (or 204 No Content)',
    responsePayload: `{
  "deleted": true,
  "resourceId": 101
}`,
  },
];

export const HTTP_STATUS_CATEGORIES_EN: StatusCodeCategory[] = [
  {
    range: '1xx',
    titleEn: 'Informational & Protocol Switching',
    titleVi: 'Informational & Protocol Switching',
    colorClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
    codes: [
      {
        code: 101,
        text: 'Switching Protocols',
        meaningVi:
          'The server agrees to switch application protocols as requested by the client Upgrade header.',
        scenarioVi: 'Upgrading an HTTP/1.1 handshake into a persistent full-duplex WebSocket connection.',
      },
    ],
  },
  {
    range: '2xx',
    titleEn: 'Success',
    titleVi: 'Success',
    colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30',
    codes: [
      {
        code: 200,
        text: 'OK',
        meaningVi:
          'The request succeeded and the resulting payload is returned in the response body.',
        scenarioVi: 'Fetching a product list with GET or applying a successful PATCH update.',
      },
      {
        code: 201,
        text: 'Created',
        meaningVi: 'A new resource was successfully created and persisted on the server.',
        scenarioVi: 'Returned after calling POST /api/products to create a new product.',
      },
      {
        code: 204,
        text: 'No Content',
        meaningVi:
          'The server fulfilled the request successfully and intentionally returns no response body.',
        scenarioVi: 'Returned after a DELETE operation or saving user preferences.',
      },
    ],
  },
  {
    range: '4xx',
    titleEn: 'Client Error',
    titleVi: 'Client Error',
    colorClass: 'text-amber-400 border-amber-500/30 bg-amber-950/30',
    codes: [
      {
        code: 400,
        text: 'Bad Request',
        meaningVi: 'Malformed JSON/XML syntax or input failed domain schema validation.',
        scenarioVi: 'Client sends a string for "price" instead of a positive number.',
      },
      {
        code: 401,
        text: 'Unauthorized',
        meaningVi:
          'Missing, invalid, or expired authentication credentials (token or API key).',
        scenarioVi: 'Calling a protected endpoint without an Authorization header.',
      },
      {
        code: 403,
        text: 'Forbidden',
        meaningVi:
          'Authenticated identity is known, but lacks permission (Authorization) to access this resource.',
        scenarioVi: 'A student account attempts to call an admin-only DELETE /api/courses endpoint.',
      },
      {
        code: 404,
        text: 'Not Found',
        meaningVi: 'The target resource ID or URI endpoint does not exist on the server.',
        scenarioVi: 'Requesting GET /api/products/999999 when that ID is absent from the database.',
      },
      {
        code: 429,
        text: 'Too Many Requests',
        meaningVi: 'The client exceeded the allowed rate limit within the configured time window.',
        scenarioVi: 'Exceeding 100 requests/minute on an API Gateway.',
      },
    ],
  },
  {
    range: '5xx',
    titleEn: 'Server Error',
    titleVi: 'Server Error',
    colorClass: 'text-rose-400 border-rose-500/30 bg-rose-950/30',
    codes: [
      {
        code: 500,
        text: 'Internal Server Error',
        meaningVi: 'An unhandled exception occurred in server code or a database query crashed.',
        scenarioVi: 'Database connection dropped unexpectedly while executing a SQL transaction.',
      },
      {
        code: 502,
        text: 'Bad Gateway',
        meaningVi:
          'An API Gateway or Reverse Proxy received an invalid response from an upstream service.',
        scenarioVi: 'Downstream microservice crashed before sending a valid response header.',
      },
      {
        code: 503,
        text: 'Service Unavailable',
        meaningVi: 'The server is temporarily overloaded or undergoing scheduled maintenance.',
        scenarioVi: 'Circuit breaker tripped during a traffic spike or deployment rollout.',
      },
    ],
  },
];

export const DATA_FORMATS_COMPARISON_EN = [
  {
    id: 'json',
    name: 'JSON (JavaScript Object Notation)',
    usedBy: 'REST, GraphQL, Webhook, WebSocket, WebRTC Signaling (SDP Wrapper)',
    characteristicsVi:
      'Lightweight, human-readable text format natively parsed by every web browser and modern programming language.',
    serializationNoteVi:
      'Serialization converts in-memory objects into UTF-8 text; Deserialization (JSON.parse) reconstructs the key-value tree.',
    sample: `{
  "studentId": "SV-2026-01",
  "fullName": "Nguyen Minh Quan",
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
      'Strict hierarchical tag markup supporting XML Namespaces (xmlns), attributes, and formal contract validation via XML Schema (XSD).',
    serializationNoteVi:
      'Larger payload size than JSON due to opening/closing tags, but offers enterprise-grade document schema enforcement.',
    sample: `<Student xmlns="http://university.edu.vn/schema">
  <StudentId>SV-2026-01</StudentId>
  <FullName>Nguyen Minh Quan</FullName>
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
      'Compact binary serialization format. Field names ("studentId") are stripped from the wire and replaced by numeric Field Tags (1, 2, 3...) plus Wire Types.',
    serializationNoteVi:
      '3–5x smaller payloads and dramatically faster CPU parsing than JSON/XML, requiring a shared .proto contract file to decode.',
    sample: `// Defined in student.proto:
message Student {
  string student_id = 1;
  string full_name = 2;
  double gpa = 3;
  bool active = 4;
  repeated string courses = 5;
}

// Wire Format (Conceptual Hex Stream):
// [Tag 1: 0x0A] [Len: 0x0A] "SV-2026-01" [Tag 3: 0x19] [IEEE754: 3.75] ...`,
    byteSizeEstimate: '~46 bytes (Compact Binary Frame)',
  },
];

export const AUTH_MECHANISMS_EN: AuthMechanismDetail[] = [
  {
    id: 'api-key',
    nameEn: 'API Key',
    titleVi: 'Application Identifier Key (API Key)',
    mechanismVi:
      'A static secret token issued to a client application. The client sends this key in an HTTP header (e.g., X-API-Key) so the server can identify the calling project and enforce rate quotas.',
    headerExample: 'X-API-Key: ak_live_9918273645abcdef0123',
    prosVi: [
      'Extremely simple to integrate for Server-to-Server communication.',
      'Easy to meter quota usage, apply rate limiting, and rotate keys.',
    ],
    consVi: [
      'Identifies the calling application rather than an individual end user session.',
      'If leaked in frontend browser code, attackers can impersonate the entire application.',
    ],
    bestUseCaseVi:
      'Connecting backend servers to third-party services (Stripe, SendGrid, Google Maps Server SDK).',
  },
  {
    id: 'bearer-token',
    nameEn: 'Bearer Token',
    titleVi: 'Opaque Session Bearer Token',
    mechanismVi:
      'After login, the server generates a cryptographically random token stored in Redis/Database and returns it to the client. Any request carrying ("bearing") this token in the Authorization header is granted access.',
    headerExample: 'Authorization: Bearer tok_9f8e7d6c5b4a3210987654',
    prosVi: [
      'Can be revoked instantaneously by deleting the session record from Redis/Database.',
      'Completely opaque—exposes zero internal claims or metadata on the client side.',
    ],
    consVi: [
      'Requires a Redis or database lookup on every incoming API request to validate the session.',
    ],
    bestUseCaseVi:
      'Monolithic backends or high-security API gateways requiring instant session revocation.',
  },
  {
    id: 'jwt',
    nameEn: 'JWT (JSON Web Token)',
    titleVi: 'Self-Contained Digitally Signed Token (Stateless JWT)',
    mechanismVi:
      'Consists of 3 Base64Url-encoded parts separated by dots: Header.Payload.Signature. Any microservice can verify the signature using the secret or RSA/ECDSA public key without querying a database.',
    headerExample:
      'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzk1MDk0NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    prosVi: [
      '100% Stateless verification: distributed microservices verify signatures locally in microseconds.',
      'Embeds user claims (userId, role, exp) directly inside the signed payload.',
    ],
    consVi: [
      'Harder to revoke before expiration (exp) without maintaining a token revocation blacklist.',
      'Payload is only Base64Url-encoded, NOT encrypted—never store sensitive secrets inside JWT claims.',
    ],
    bestUseCaseVi:
      'Distributed microservices and API Gateways needing high-speed stateless authentication.',
  },
  {
    id: 'oauth2',
    nameEn: 'OAuth 2.0',
    titleVi: 'Delegated Authorization Framework (OAuth 2.0)',
    mechanismVi:
      'Allows an end user to grant limited, scoped permissions (Scopes) to a third-party application to access their resources on another platform without sharing their raw password (via Authorization Code Flow + PKCE).',
    headerExample:
      'POST /oauth/token (grant_type=authorization_code) -> Issues Access Token with scope="read:profile write:calendar"',
    prosVi: [
      'Industry standard for third-party delegated access with fine-grained Scope control.',
      'Cleanly decouples the Authorization Server (issuing tokens) from the Resource Server (hosting APIs).',
    ],
    consVi: [
      'Multi-step redirect handshake (Authorization Code, PKCE, Refresh Token) is more complex to implement than static API keys.',
    ],
    bestUseCaseVi:
      'Open platform ecosystems ("Sign in & sync calendar with Google / GitHub") and Enterprise SSO.',
  },
];
