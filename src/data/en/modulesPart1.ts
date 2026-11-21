import { LearningModule } from '@/types/api';

export const MODULES_PART_1_EN: LearningModule[] = [
  // ==========================================================================
  // MODULE 1: REST API
  // ==========================================================================
  {
    id: 'rest',
    order: 1,
    name: 'REST API',
    taglineVi:
      'Resource-Oriented Architectural Style built on top of standard HTTP semantics.',
    technicalNature: 'Architectural Style',
    technicalNatureVi: 'Software Architectural Style',
    accentColor: '#38BDF8',
    badgeClass: 'border-sky-500/40 bg-sky-950/60 text-sky-300',
    borderClass: 'border-sky-500/40',
    glowClass: 'shadow-sky-950/50',
    introduction: {
      hookVi:
        'REST (Representational State Transfer) is neither a wire protocol nor an installable library—it is a set of architectural constraints defined by Roy Fielding in 2000 to unlock the full potential of the HTTP protocol.',
      problemSolvedVi:
        'Before REST, distributed systems invented hundreds of ad-hoc RPC method endpoints that ignored HTTP caching, uniform URI identification, and standard status code semantics.',
      historicalContextVi:
        'Has served as the dominant foundation for public Web APIs, mobile backends, and cloud platform gateways for over two decades.',
      coexistenceNoteVi:
        'In modern architectures, REST endpoints are frequently documented via OpenAPI, paired with Webhooks for asynchronous event callbacks, and backed by internal gRPC microservices.',
    },
    coreConcepts: [
      {
        termEn: 'Resources & Endpoints (URI)',
        titleVi: 'Resources & Uniform Resource Identifiers (URI)',
        summaryVi:
          'Every domain entity (Products, Orders, Users) is modeled as a Resource and identified by plural nouns in the URI path.',
        deepDiveVi:
          'In proper REST design, a URI identifies "What" the resource is (e.g., /api/products/101), never embedding action verbs like /api/getProduct?id=101 or /api/deleteProduct.',
        codeSnippet: `GET /api/products          // Collection Resource
GET /api/products/101      // Singleton Resource`,
      },
      {
        termEn: 'HTTP Methods & Semantics',
        titleVi: 'HTTP Verb Semantics (GET, POST, PUT, PATCH, DELETE)',
        summaryVi:
          'Instead of encoding method names inside URLs, REST uses standard HTTP verbs to express the action performed on a resource.',
        deepDiveVi:
          'GET retrieves representations; POST creates new resources; PUT replaces an entire resource; PATCH applies a partial update; DELETE removes a resource.',
      },
      {
        termEn: 'Stateless Communication',
        titleVi: 'Stateless Client-Server Interaction',
        summaryVi:
          'The server stores zero client session state in memory between consecutive HTTP requests.',
        deepDiveVi:
          'Every incoming HTTP request must carry all context and credentials required to process it (e.g., a JWT in the Authorization header). Consequently, any server instance behind a Load Balancer can serve any request.',
      },
      {
        termEn: 'Idempotency',
        titleVi: 'Idempotency Guarantees',
        summaryVi:
          'An operation is Idempotent if executing it once or repeating it N times with identical parameters leaves the server in the exact same state.',
        deepDiveVi:
          'GET, PUT, and DELETE are idempotent (safe for automatic network retries). Conversely, POST is NOT idempotent (calling POST /api/orders 3 times creates 3 duplicate orders unless an Idempotency-Key header is enforced).',
      },
      {
        termEn: 'Resource Representation (JSON)',
        titleVi: 'Resource Representation & Content Negotiation',
        summaryVi:
          'Clients never mutate raw database tables directly—they exchange serialized "Representations" of resources, most commonly formatted as JSON.',
        deepDiveVi:
          'Using Accept: application/json and Content-Type: application/json headers, client and server negotiate the data representation format.',
      },
      {
        termEn: 'Query Params vs Path Params & Status Codes',
        titleVi: 'Path Parameters, Query Strings & Standard Status Codes',
        summaryVi:
          'Path Params (/products/101) identify a specific resource; Query Params (?category=books&sort=price) filter or paginate collections; Status Codes (200, 201, 400, 401, 404, 500) signal standardized outcomes.',
        deepDiveVi:
          'A well-designed REST API never returns HTTP 200 OK wrapping an error payload (avoid the anti-pattern: 200 OK with {"success": false}).',
      },
    ],
    architecture: {
      summaryVi:
        'Layered request pipeline: Client → HTTP Request → REST Endpoint (Router/Controller) → Business Logic → Database → HTTP Response → Client.',
      nodes: [
        {
          id: 'rest-client',
          label: 'Web / Mobile Client',
          sublabel: 'Consumer',
          role: 'client',
          descriptionVi: 'Constructs HTTP requests with Method, URI, Headers, and JSON Body.',
          techDetails: 'Fetch API / Axios / Mobile HTTP Client',
        },
        {
          id: 'rest-endpoint',
          label: 'REST Endpoint & Middleware',
          sublabel: '/api/products',
          role: 'gateway',
          descriptionVi: 'Maps URI + HTTP Verb to Controller, verifies JWT, and validates Schema.',
          techDetails: 'REST Router, Auth Guard, JSON Parser',
        },
        {
          id: 'rest-logic',
          label: 'Product Business Logic',
          sublabel: 'Domain Service',
          role: 'server',
          descriptionVi: 'Enforces inventory rules, pricing invariants, and transaction coordination.',
          techDetails: 'Stateless Application Service',
        },
        {
          id: 'rest-db',
          label: 'Product Database',
          sublabel: 'Relational / NoSQL',
          role: 'database',
          descriptionVi: 'Persists product records durably and executes ACID queries.',
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
        'Every REST interaction is a self-contained HTTP Request/Response cycle completely independent of prior requests.',
      internalMechanismVi: [
        '1. Composite Routing (Method + Path): The router matches both the HTTP Verb and URI pattern (e.g., PATCH + /api/products/:id) to dispatch the controller handler.',
        '2. Deserialization & Schema Validation: The raw JSON request body is parsed into an object and validated against domain constraints.',
        '3. Domain Execution & DB Query: The service reads or mutates the database and maps the entity into a clean Response Representation.',
        '4. HTTP Semantics Attachment: The server assigns an accurate Status Code (200 OK, 201 Created, 404 Not Found) and cache headers (ETag, Cache-Control).',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Client',
        actionEn: 'Construct & Send HTTP Request',
        descriptionVi:
          'Client sends a partial update request to modify the price of product #101 using HTTP PATCH.',
        payloadExample: `PATCH /api/products/101 HTTP/1.1\nContent-Type: application/json\n\n{"price": 2290000}`,
      },
      {
        step: 2,
        actor: 'REST Endpoint',
        actionEn: 'Route Match & Schema Validation',
        descriptionVi:
          'Endpoint extracts path parameter id=101 and verifies that price > 0.',
        payloadExample: `Route Params: { id: 101 } | Body DTO: { price: 2290000 }`,
      },
      {
        step: 3,
        actor: 'Business Logic & DB',
        actionEn: 'Execute Partial Update',
        descriptionVi:
          'Updates the price column for product #101 in the database and fetches the updated row.',
        payloadExample: `UPDATE products SET price = 2290000 WHERE id = 101 RETURNING *;`,
      },
      {
        step: 4,
        actor: 'REST Server → Client',
        actionEn: 'Return HTTP 200 OK Representation',
        descriptionVi:
          'Returns the complete JSON representation of product #101 after the update.',
        payloadExample: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":101,"name":"Keychron K8 Mechanical Keyboard","price":2290000,"stock":35}`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'E-Commerce Product Management REST API',
      scenarioDescriptionVi:
        'Implements 5 standard RESTful endpoints on /api/products supporting catalog filtering, detail retrieval, creation, partial price updates, and deletion.',
      codeExamples: [
        {
          titleVi: 'REST Controller & Client Fetch Implementation (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Demonstrates mapping the 5 standard HTTP methods onto /api/products with proper HTTP status codes.',
          code: `// 1. GET /api/products?category=hardware (List & filter collection)
// 2. GET /api/products/101              (Read singleton resource)
// 3. POST /api/products                 (Create new -> 201 Created)
// 4. PATCH /api/products/101            (Partial update -> 200 OK)
// 5. DELETE /api/products/101           (Delete resource -> 200 OK)

async function createAndPatchProduct() {
  // Create a new product with POST
  const createRes = await fetch('https://api.shop.vn/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOi...'
    },
    body: JSON.stringify({
      name: 'Sony WH-1000XM5 Headphones',
      category: 'hardware',
      price: 6990000,
      stock: 25
    })
  });
  // Status: 201 Created | Header Location: /api/products/104
  const createdProduct = await createRes.json();

  // Partially update only the promotional price with PATCH
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
                'Uses plural noun /api/products with POST and returns 201 Created plus a Location header.',
            },
            {
              lineHint: 'PATCH /api/products/${id}',
              explanationVi:
                'Sends only the modified field ({ price: 6490000 }) instead of replacing the entire resource as PUT requires.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Public APIs & Open Partner Ecosystems',
        industry: 'E-Commerce / SaaS / Cloud Platforms',
        descriptionVi:
          'Exposing APIs for thousands of external developers (e.g., Stripe, GitHub, Shopify Open Platform).',
        whyItFitsVi:
          'Every programming language supports HTTP/JSON natively; easy to secure at API Gateways and cache via CDNs.',
      },
      {
        titleVi: 'Standard Business CRUD Applications',
        industry: 'Enterprise Web & Mobile Apps',
        descriptionVi:
          'Managing product catalogs, customer profiles, and order records with clear Create, Read, Update, Delete semantics.',
        whyItFitsVi:
          'Clean 1-to-1 mapping between domain entities and Resource URIs.',
      },
    ],
    WhenNotToUseVi: [
      'When applications require sub-10ms bidirectional server push such as live chat or multiplayer gaming (use WebSocket).',
      'When complex mobile screens must stitch data across 15 deeply nested relations over slow cellular networks (GraphQL is better suited).',
      'When two internal microservices call each other 50,000 times/sec needing binary throughput (use gRPC).',
    ],
    advantages: [
      'Simple and universally understood across every language, browser, and platform.',
      'Effortless horizontal scaling thanks to strict Statelessness.',
      'Native HTTP caching (Cache-Control, ETag, 304 Not Modified) across browsers and CDN edges.',
      'Unmatched tooling ecosystem (OpenAPI/Swagger, Postman, cURL, API Gateways).',
    ],
    limitations: [
      'Over-fetching: Server returns all 30 product fields when a mobile card only needs Name and Price.',
      'Under-fetching (N+1 Requests): Rendering a dashboard may require calling GET /users/1, then GET /users/1/orders, then GET /orders/99/items.',
      'No built-in compile-time wire schema unless paired with an external specification like OpenAPI.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'GraphQL',
        keyDifferenceVi:
          'REST splits data across multiple URL endpoints with server-defined shapes; GraphQL exposes a single endpoint where the client selects exact fields.',
        whenToChooseThisVi:
          'When resource boundaries are clear, HTTP/CDN caching is important, and you want a straightforward backend.',
        whenToChooseOtherVi:
          'When diverse clients (Web, Mobile, Smartwatch) need tailored subsets of a deeply connected entity graph.',
      },
      {
        comparedWith: 'gRPC',
        keyDifferenceVi:
          'REST uses human-readable JSON over HTTP; gRPC uses binary Protocol Buffers over HTTP/2 with remote procedure call semantics.',
        whenToChooseThisVi:
          'When serving web browsers directly or publishing external partner APIs.',
        whenToChooseOtherVi:
          'When connecting internal polyglot microservices requiring high throughput and bidirectional streaming.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“Any API that returns JSON over HTTP is automatically a REST API.”',
        realityVi:
          'Many HTTP + JSON APIs are actually RPC-over-HTTP (e.g., POST /api/doTransferMoney or GET /api/deleteUser?id=5). That is JSON-RPC, not REST.',
        technicalProofVi:
          'True REST compliance requires Resource noun URIs, proper HTTP verb semantics, Statelessness, and standard status codes.',
      },
      {
        mythVi: '“Statelessness in REST means an application cannot have user login.”',
        realityVi:
          'Statelessness means the server does not store session state in its own RAM. Logged-in state is preserved by the client sending a self-contained token (such as a JWT) on every request.',
        technicalProofVi:
          'Section 5.1.3 of Roy Fielding’s dissertation states that session state is kept entirely on the client.',
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
      'Strict XML messaging protocol governed by formal WSDL contracts and enterprise WS-* security standards.',
    technicalNature: 'Messaging Protocol',
    technicalNatureVi: 'Standardized XML Messaging Protocol',
    accentColor: '#F59E0B',
    badgeClass: 'border-amber-500/40 bg-amber-950/60 text-amber-300',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-amber-950/50',
    introduction: {
      hookVi:
        'Unlike REST (which is an architectural style), SOAP (Simple Object Access Protocol) is a formal W3C protocol specification that strictly governs every XML tag inside messages exchanged between systems.',
      problemSolvedVi:
        'In Core Banking, Telecom, and Government systems, integrations demand strict XML Schema (XSD) type checking, element-level digital signatures (WS-Security) across intermediary hops, and two-phase distributed transactions (WS-AtomicTransaction).',
      historicalContextVi:
        'Co-developed in the late 1990s by Microsoft, IBM, and the W3C; remains the backbone of interbank clearing, SWIFT/ISO 20022 gateways, and enterprise ERPs.',
      coexistenceNoteVi:
        'In modern architectures, core banking SOAP services often sit behind an API Gateway that translates external REST/JSON mobile requests into internal SOAP XML envelopes.',
    },
    coreConcepts: [
      {
        termEn: 'SOAP Envelope, Header & Body',
        titleVi: 'XML Message Structure (Envelope, Header, Body)',
        summaryVi:
          'Every SOAP message must be wrapped in a root <soap:Envelope> containing an optional <soap:Header> and a mandatory <soap:Body>.',
        deepDiveVi:
          'The Header carries protocol metadata (WS-Security signatures, idempotency keys, routing), while the Body contains the target operation name and typed input/output parameters.',
        codeSnippet: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header><!-- WS-Security & Metadata --></soap:Header>
  <soap:Body><!-- Business Operation Payload --></soap:Body>
</soap:Envelope>`,
      },
      {
        termEn: 'SOAP Fault',
        titleVi: 'Standardized Error Structure (<soap:Fault>)',
        summaryVi:
          'SOAP does not rely on HTTP status codes alone for business errors—it defines a dedicated <soap:Fault> element inside <soap:Body>.',
        deepDiveVi:
          'A <soap:Fault> block contains <soap:Code> (e.g., soap:Sender or soap:Receiver), <soap:Reason> (human-readable explanation), and <soap:Detail> (schema-typed domain error codes).',
      },
      {
        termEn: 'WSDL (Web Services Description Language)',
        titleVi: 'WSDL Service Contracts & XSD Schemas',
        summaryVi:
          'WSDL is a machine-readable XML contract listing every supported operation, strict XSD parameter types, and transport bindings.',
        deepDiveVi:
          'Using a ?wsdl URL, enterprise IDEs (Visual Studio, IntelliJ, Eclipse) automatically generate strongly typed client proxy classes.',
      },
      {
        termEn: 'Transport Independence & WS-* Standards',
        titleVi: 'Transport Independence & Enterprise WS-* Suite',
        summaryVi:
          'Although 95% of SOAP runs over HTTP POST, a SOAP XML envelope can be transmitted over SMTP (Email), JMS/MQ (Message Queues), or raw TCP.',
        deepDiveVi:
          'Because WS-Security signatures live inside <soap:Header> rather than relying solely on point-to-point TLS, the XML message remains cryptographically verifiable across multiple intermediary routers.',
      },
    ],
    architecture: {
      summaryVi:
        'Contract-enforced pipeline: SOAP Client → XML SOAP Message → SOAP Endpoint (XSD Validator) → Core Banking Service → SOAP Response / SOAP Fault.',
      nodes: [
        {
          id: 'soap-client',
          label: 'SOAP Client (Generated Proxy)',
          sublabel: 'ERP / Partner System',
          role: 'client',
          descriptionVi: 'Marshals method calls into a WSDL-compliant XML Envelope.',
          techDetails: 'JAX-WS / WCF / Zeep SOAP Client',
        },
        {
          id: 'soap-xml',
          label: 'XML SOAP Envelope',
          sublabel: 'HTTP POST Wire',
          role: 'contract',
          descriptionVi: 'XML document carrying WS-Security Header and operation Body.',
          techDetails: 'application/soap+xml',
        },
        {
          id: 'soap-endpoint',
          label: 'SOAP Endpoint & XSD Engine',
          sublabel: 'WSDL Contract Guard',
          role: 'gateway',
          descriptionVi: 'Verifies XML signatures and validates every tag against XSD schemas.',
          techDetails: 'WS-Security + XSD Validator',
        },
        {
          id: 'soap-service',
          label: 'Core Banking Processor',
          sublabel: 'Enterprise Service',
          role: 'server',
          descriptionVi: 'Executes financial ledger transactions and returns SOAP Response or Fault.',
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
        'Unlike REST which uses multiple URLs and HTTP verbs, SOAP sends all operations to a single endpoint URL via HTTP POST; the specific action is identified by the XML element tag inside <soap:Body>.',
      internalMechanismVi: [
        '1. Contract Discovery (WSDL Binding): The client reads the WSDL file to discover operations (GetAccountBalance, TransferMoney) and XSD types.',
        '2. XML Marshalling: Parameters are serialized into an XML tree inside <soap:Body>, with security credentials placed in <soap:Header>.',
        '3. XSD & WS-Security Verification: The server validates XML namespaces (xmlns) and XSD data types before invoking domain code.',
        '4. Envelope Response or Fault: The returned payload is always a formal <soap:Envelope>.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'SOAP Client',
        actionEn: 'Marshal SOAP Request Envelope',
        descriptionVi: 'Corporate ERP constructs an XML envelope invoking GetAccountBalance.',
        payloadExample: `<soap:Body><bank:GetAccountBalanceRequest><bank:AccountId>ACC-VN-8801</bank:AccountId></bank:GetAccountBalanceRequest></soap:Body>`,
      },
      {
        step: 2,
        actor: 'SOAP Endpoint',
        actionEn: 'Validate WSDL/XSD & WS-Security Header',
        descriptionVi: 'Verifies WSSEToken inside <soap:Header> and validates tag types against XSD.',
        payloadExample: `[XSD-VALIDATOR] Namespace http://corebanking.enterprise.vn/wsdl verified.`,
      },
      {
        step: 3,
        actor: 'Core Banking Service',
        actionEn: 'Execute Ledger Operation',
        descriptionVi: 'Queries the corporate account balance in the Core Banking ledger.',
        payloadExample: `Account ACC-VN-8801 -> AvailableBalance: 1,450,000,000 VND`,
      },
      {
        step: 4,
        actor: 'SOAP Endpoint → Client',
        actionEn: 'Return SOAP Response XML',
        descriptionVi: 'Wraps the result inside <bank:GetAccountBalanceResponse> in <soap:Body>.',
        payloadExample: `<soap:Body><bank:GetAccountBalanceResponse><bank:AvailableBalance>1450000000</bank:AvailableBalance></bank:GetAccountBalanceResponse></soap:Body>`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Core Banking Settlement Service (Balance & Funds Transfer)',
      scenarioDescriptionVi:
        'Connects an enterprise ERP to a Core Banking gateway via SOAP 1.2 supporting GetAccountBalance, TransferMoney, and structured SOAP Faults.',
      codeExamples: [
        {
          titleVi: 'SOAP 1.2 Request Envelope & WSDL Operation',
          language: 'xml',
          descriptionVi:
            'A SOAP 1.2 envelope executing an interbank transfer with an idempotency token in the Header.',
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
                'XML Namespaces disambiguate protocol framing tags (soap:) from banking domain tags (bank:).',
            },
            {
              lineHint: '<soap:Header>',
              explanationVi:
                'Cleanly separates authentication and idempotency metadata from the business payload.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Interbank Clearing & Core Banking Ledgers',
        industry: 'Banking & Financial Services',
        descriptionVi:
          'Processing account settlements, automated clearing, and corporate ERP disbursements.',
        whyItFitsVi:
          'Demands strict XSD schema validation, message-level digital signatures (WS-Security), and distributed ACID transactions.',
      },
      {
        titleVi: 'Mission-Critical Legacy Enterprise Integration',
        industry: 'Telecom / Aviation / Government',
        descriptionVi:
          'Integrating telecom billing engines and airline reservation systems (GDS) operating across organizational boundaries.',
        whyItFitsVi:
          'Immutable WSDL contracts guarantee long-term backward compatibility.',
      },
    ],
    WhenNotToUseVi: [
      'When building modern Web SPAs or mobile apps where XML parsing bloats bandwidth and battery usage.',
      'When rapid frontend iteration requires flexible payload shapes.',
    ],
    advantages: [
      'Strict WSDL + XSD contracts catch type mismatches at compile time.',
      'Native support for enterprise WS-Security (element-level XML encryption/signatures) and WS-AtomicTransaction.',
      'Transport-agnostic (works over HTTP, SMTP, JMS, IBM MQ).',
      'Standardized protocol-level error reporting via <soap:Fault>.',
    ],
    limitations: [
      'Highly verbose XML payloads consume several times more bandwidth than JSON or Protobuf.',
      'DOM/XSD XML parsing is CPU- and memory-intensive.',
      'Steep learning curve and awkward to consume directly from browser JavaScript.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'REST API',
        keyDifferenceVi:
          'SOAP is an operation-centric XML messaging protocol; REST is a resource-centric architectural style typically using JSON.',
        whenToChooseThisVi:
          'When integrating enterprise financial systems requiring WSDL, XSD, and WS-Security.',
        whenToChooseOtherVi:
          'When building modern Web/Mobile APIs needing lightweight JSON and HTTP caching.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“SOAP is completely dead and no longer used anywhere.”',
        realityVi:
          'While rare in frontend web development, billions of daily transactions still flow through SOAP/XML inside core banking, insurance, aviation, and payment clearing backbones.',
        technicalProofVi:
          'Many modern Open Banking REST APIs act as thin JSON translation gateways over core SOAP ledgers.',
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
      'Strongly typed query language and runtime enabling clients to request the exact data shape they need in a single round-trip.',
    technicalNature: 'Query Language & Runtime',
    technicalNatureVi: 'Declarative Query Language & Server Execution Runtime',
    accentColor: '#EC4899',
    badgeClass: 'border-pink-500/40 bg-pink-950/60 text-pink-300',
    borderClass: 'border-pink-500/40',
    glowClass: 'shadow-pink-950/50',
    introduction: {
      hookVi:
        'Created by Facebook in 2012 and open-sourced in 2015, GraphQL shifts control to the client to declaratively specify the exact shape of the JSON response it wants back.',
      problemSolvedVi:
        'Eliminates the two classic scaling bottlenecks of REST: Over-fetching (downloading dozens of unused fields) and Under-fetching (chaining 4–5 sequential REST calls to render a single view).',
      historicalContextVi:
        'Born when Facebook transitioned to native mobile apps over constrained cellular networks where every redundant kilobyte and network round-trip degraded user experience.',
      coexistenceNoteVi:
        'GraphQL rarely replaces REST or gRPC outright. Instead, it thrives as an API Aggregation / Backend-for-Frontend (BFF) layer whose resolvers call downstream REST and gRPC microservices.',
    },
    coreConcepts: [
      {
        termEn: 'Strongly Typed Schema (SDL)',
        titleVi: 'Strongly Typed Schema Definition Language (SDL)',
        summaryVi:
          'Every GraphQL server is anchored by a Schema written in SDL that defines all object Types, Fields, and relationships.',
        deepDiveVi:
          'An exclamation mark (!) such as String! or ID! marks a non-nullable field. Clients can inspect the entire schema automatically via Introspection.',
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
        titleVi: 'Read Queries & Write Mutations',
        summaryVi:
          'Queries fetch data (fields resolve in parallel); Mutations create/update/delete data (top-level fields run sequentially for state safety) and return the updated fields in the same call.',
        deepDiveVi:
          'Unlike REST’s multiple resource URLs, both Queries and Mutations are typically sent to a single endpoint (POST /graphql).',
      },
      {
        termEn: 'Resolvers & Execution Tree',
        titleVi: 'Field Resolvers & AST Execution',
        summaryVi:
          'Each field in the Schema is backed by a server-side Resolver function responsible for fetching that field’s data from SQL, NoSQL, or an internal microservice.',
        deepDiveVi:
          'If a client omits the department field from its query, the department resolver function is NEVER executed—saving backend compute and database load.',
      },
      {
        termEn: 'Nested Queries & Arguments',
        titleVi: 'Nested Graph Traversal & Field Arguments',
        summaryVi:
          'Clients can traverse entity relationships (Student → Department, Student → Courses → Grade) in a single query and pass arguments to any field.',
        deepDiveVi:
          'Replaces N+1 client network round-trips with a single consolidated HTTP request.',
      },
      {
        termEn: 'Over-fetching & Under-fetching',
        titleVi: 'Eliminating Over-fetching and Under-fetching',
        summaryVi:
          'Over-fetching means downloading more fields than the UI displays; Under-fetching means one endpoint returns too little data, forcing follow-up calls.',
        deepDiveVi:
          'With GraphQL, the returned JSON mirrors the exact field selection tree sent by the client.',
      },
    ],
    architecture: {
      summaryVi:
        'Graph resolution flow: Client → GraphQL Query → GraphQL Server (AST Parser & Schema Validator) → Field Resolvers → Multiple Data Sources → Tailored JSON Response.',
      nodes: [
        {
          id: 'gql-client',
          label: 'Web / Mobile App',
          sublabel: 'Declarative Query',
          role: 'client',
          descriptionVi: 'Declares the exact nested fields required for the current screen.',
          techDetails: 'Apollo / Relay / Fetch POST /graphql',
        },
        {
          id: 'gql-server',
          label: 'GraphQL Execution Engine',
          sublabel: 'Schema & AST Parser',
          role: 'gateway',
          descriptionVi: 'Parses the query string into an AST and validates it against the Schema.',
          techDetails: 'GraphQL Runtime & Type Validator',
        },
        {
          id: 'gql-resolvers',
          label: 'Field Resolvers Tree',
          sublabel: 'Student / Course / Grade',
          role: 'server',
          descriptionVi: 'Invokes only the resolver functions corresponding to requested fields.',
          techDetails: 'DataLoader & Resolver Functions',
        },
        {
          id: 'gql-sources',
          label: 'Data Sources (DB & Services)',
          sublabel: 'PostgreSQL + Microservices',
          role: 'database',
          descriptionVi: 'Underlying student database, course catalog service, and grading API.',
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
        'The GraphQL Runtime operates as an intelligent query interpreter sitting between clients and underlying data sources.',
      internalMechanismVi: [
        '1. Parse: Converts the client’s GraphQL query text into an Abstract Syntax Tree (AST).',
        '2. Validate: Type-checks the AST against the GraphQL Schema; unknown fields are rejected immediately before execution.',
        '3. Execute: Walks the AST from the root type down each requested field branch, invoking the matching resolver functions.',
        '4. Assemble Response: Packages resolved values under the "data" key (and partial errors under "errors") matching the query hierarchy.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Client',
        actionEn: 'Send GraphQL Query via POST /graphql',
        descriptionVi:
          'Student portal requests only id, fullName, gpa, and department name for student SV-101.',
        payloadExample: `query { student(id: "SV-101") { id fullName gpa department { name } } }`,
      },
      {
        step: 2,
        actor: 'GraphQL Server',
        actionEn: 'Parse AST & Validate Against Schema',
        descriptionVi:
          'Verifies that Student defines id, fullName, gpa, and department.',
        payloadExample: `[SCHEMA CHECK] Valid Query AST. Fields to resolve: 4.`,
      },
      {
        step: 3,
        actor: 'Resolvers',
        actionEn: 'Resolve Only Requested Fields',
        descriptionVi:
          'Executes Query.student and Student.department; skips CourseService and GradeService entirely.',
        payloadExample: `Resolved: Student("SV-101") + Department("DEPT-CS")`,
      },
      {
        step: 4,
        actor: 'GraphQL Server → Client',
        actionEn: 'Return Exact Shape JSON',
        descriptionVi:
          'Returns a compact JSON object mirroring the exact query structure.',
        payloadExample: `{"data":{"student":{"id":"SV-101","fullName":"Tran Hoang Minh","gpa":3.82,"department":{"name":"Faculty of Computer Science & AI"}}}}`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'University Management Graph API',
      scenarioDescriptionVi:
        'Models Student, Course, Department, and Grade entities in a unified GraphQL Schema enabling multi-level transcript retrieval in a single request.',
      codeExamples: [
        {
          titleVi: 'GraphQL Schema, Nested Query & GPA Update Mutation',
          language: 'graphql',
          descriptionVi:
            'Shows how a client selects exact nested transcript fields and executes a typed GPA mutation.',
          code: `# 1. Schema Definition (SDL)
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

# 2. Client Nested Query
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

# 3. Data Mutation
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
                'Fetches enrolled courses and grades in the same round-trip without calling a separate /students/101/courses endpoint.',
            },
            {
              lineHint: 'mutation UpdateGpa',
              explanationVi:
                'Immediately selects the updated fields (id, fullName, gpa) to refresh the UI after mutation.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Multi-Platform Frontends (Web, Mobile, Smartwatch) & BFF',
        industry: 'Social Media / E-Learning / E-Commerce',
        descriptionVi:
          'A smartwatch view needs 3 summary fields while a desktop dashboard needs 20 fields from the same domain entities.',
        whyItFitsVi:
          'Backend engineers maintain one GraphQL Schema while each client queries its own optimal payload.',
      },
      {
        titleVi: 'Multi-Service Data Aggregation Gateways',
        industry: 'Fintech / Enterprise Portals',
        descriptionVi:
          'Stitching data from User, Billing, and Academic microservices behind one unified graph endpoint.',
        whyItFitsVi:
          'Resolvers abstract away the complexity of fetching and joining multiple backend services.',
      },
    ],
    WhenNotToUseVi: [
      'Simple CRUD services with a handful of flat resources (REST is simpler and faster to ship).',
      'Workloads relying heavily on URL-based CDN HTTP caching (since GraphQL sends queries via POST /graphql).',
      'Large binary file uploads or raw media streaming.',
    ],
    advantages: [
      'Eliminates Over-fetching and Under-fetching, saving mobile bandwidth and round-trips.',
      'Strongly typed SDL schema acts as living documentation and enables automatic frontend TypeScript codegen.',
      'Smooth schema evolution without breaking existing clients or proliferating /v1, /v2 URLs.',
    ],
    limitations: [
      'Risk of N+1 database queries if backend resolvers do not use batching (e.g., DataLoader).',
      'Cannot use standard browser/CDN HTTP GET caching out-of-the-box for POST queries.',
      'Requires query depth and complexity limits to prevent malicious deeply nested DoS queries.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'REST API',
        keyDifferenceVi:
          'In REST, the server dictates the payload shape of each endpoint; in GraphQL, the server defines the schema capabilities while the client dictates the returned fields.',
        whenToChooseThisVi:
          'When domain data is deeply relational and multiple client platforms need custom field subsets.',
        whenToChooseOtherVi:
          'When you want simplicity, URL-based HTTP caching, and standard HTTP status code monitoring.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“GraphQL is a database query language that replaces SQL.”',
        realityVi:
          'False! GraphQL is completely database-agnostic. It is an application-layer API runtime whose resolvers can fetch from PostgreSQL, MongoDB, Redis, or even other REST/gRPC APIs.',
        technicalProofVi:
          'The official GraphQL specification defines only query syntax and resolver execution semantics at the API layer.',
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
      'High-performance Remote Procedure Call framework powered by binary Protocol Buffers over multiplexed HTTP/2 streams.',
    technicalNature: 'RPC Framework',
    technicalNatureVi: 'High-Performance Contract-First RPC Framework',
    accentColor: '#10B981',
    badgeClass: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-emerald-950/50',
    introduction: {
      hookVi:
        'Originated at Google (evolving from their internal Stubby RPC backbone handling tens of billions of calls per second) and donated to the CNCF, gRPC lets an application invoke a method on a remote server as naturally as calling a local function.',
      problemSolvedVi:
        'When a backend scales to dozens of microservices, repeatedly serializing and parsing verbose JSON text over HTTP/1.1 burns CPU and inflates tail latency. gRPC solves this with compact binary Protocol Buffers and multiplexed HTTP/2 streams.',
      historicalContextVi:
        'Open-sourced in 2015, gRPC quickly became the gold standard for internal service-to-service (East-West) communication across Cloud-Native and Kubernetes infrastructures.',
      coexistenceNoteVi:
        'Because web browsers do not expose full raw HTTP/2 frame control required by native gRPC, production systems expose REST or GraphQL at the API Gateway while internal microservices communicate via gRPC.',
    },
    coreConcepts: [
      {
        termEn: 'Remote Procedure Call (RPC) & Client Stub',
        titleVi: 'Remote Procedure Calls & Auto-Generated Client Stubs',
        summaryVi:
          'Instead of manually building URLs and parsing JSON, developers call strongly typed methods like paymentClient.processPayment(request).',
        deepDiveVi:
          'The protoc compiler reads the shared contract and auto-generates Client Stubs and Server Skeletons across 10+ languages (Go, Java, Python, TypeScript, Rust, C++).',
      },
      {
        termEn: 'Protocol Buffers (.proto & Binary Serialization)',
        titleVi: '.proto Contracts & Binary Wire Serialization',
        summaryVi:
          'Every service and message is declared ahead of time in a .proto file where each field is assigned a unique numeric tag (Field Number: 1, 2, 3...).',
        deepDiveVi:
          'On the network wire, Protobuf strips string field names ("order_id", "amount_vnd") and transmits only compact numeric Field Tags + Wire Types and Varint-compressed values—shrinking payloads by 60–80% compared to JSON.',
        codeSnippet: `message PaymentRequest {
  string order_id = 1;
  int64 amount_vnd = 2;
  string currency = 3;
}`,
      },
      {
        termEn: 'Four RPC Communication Patterns',
        titleVi: '4 RPC Modes (Unary & 3 Native Streaming Patterns)',
        summaryVi:
          'Built on HTTP/2, gRPC natively supports Unary RPC (1:1), Server Streaming (1:N), Client Streaming (N:1), and Bidirectional Streaming (N⇄N).',
        deepDiveVi:
          'In Bidirectional Streaming, both client and server transmit independent asynchronous streams of binary messages over a single TCP connection without waiting for turn-by-turn replies.',
      },
      {
        termEn: 'HTTP/2 Framing & Multiplexing',
        titleVi: 'HTTP/2 Stream Multiplexing & HPACK Compression',
        summaryVi:
          'gRPC mandates HTTP/2 as its transport layer, allowing hundreds of concurrent RPC calls to share a single TCP connection without HTTP-layer Head-of-Line Blocking.',
        deepDiveVi:
          'Headers are compressed via HPACK, and final RPC execution statuses (e.g., grpc-status: 0) are delivered via HTTP/2 Trailing Headers.',
      },
    ],
    architecture: {
      summaryVi:
        'Binary execution pipeline: Client Application → gRPC Stub → Protobuf Binary Serialization → HTTP/2 Multiplexed Stream → gRPC Server → Service Implementation.',
      nodes: [
        {
          id: 'grpc-client',
          label: 'Order Microservice',
          sublabel: 'Caller Application',
          role: 'client',
          descriptionVi: 'Invokes remote methods on the auto-generated .proto Client Stub.',
          techDetails: 'Generated gRPC Client Stub',
        },
        {
          id: 'grpc-proto',
          label: 'Protobuf Serializer',
          sublabel: 'Binary Wire Encoder',
          role: 'contract',
          descriptionVi: 'Encodes typed structs into compact Tag-Length-Value binary byte streams.',
          techDetails: 'Protocol Buffers v3 (protoc)',
        },
        {
          id: 'grpc-http2',
          label: 'HTTP/2 Transport Channel',
          sublabel: 'Multiplexed Frames',
          role: 'gateway',
          descriptionVi: 'Multiplexes concurrent DATA and HEADERS frames over a persistent TCP socket.',
          techDetails: 'HTTP/2 Streams + HPACK',
        },
        {
          id: 'grpc-server',
          label: 'Payment & Inventory Services',
          sublabel: 'gRPC Server Skeleton',
          role: 'server',
          descriptionVi: 'Decodes binary frames and dispatches the strongly typed service handler.',
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
        'gRPC follows a strict Contract-First workflow: the .proto file is the single source of truth for code generation across all microservices.',
      internalMechanismVi: [
        '1. Contract Compilation (.proto): Engineers define services and messages in a .proto file and run protoc to generate stubs for target languages.',
        '2. Binary Encoding (Protobuf): Calling a stub method encodes the struct into a compact binary byte array indexed by field numbers.',
        '3. HTTP/2 Length-Prefixed Framing: The binary message is prefixed with 5 bytes (1 compression flag byte + 4-byte message length) and packed into HTTP/2 DATA frames.',
        '4. Unmarshalling & Execution: The server reads the 5-byte prefix, reconstructs the typed struct, runs the handler, and appends grpc-status trailers.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Order Service (Stub)',
        actionEn: 'Call stub.ProcessPayment(req)',
        descriptionVi: 'Order Service invokes ProcessPayment for order ORD-2026.',
        payloadExample: `PaymentRequest { order_id: "ORD-2026", amount_vnd: 900000, currency: "VND" }`,
      },
      {
        step: 2,
        actor: 'Protobuf Encoder',
        actionEn: 'Serialize to Binary Wire Format',
        descriptionVi: 'Encodes fields 1, 2, and 3 into a 34-byte binary stream.',
        payloadExample: `Hex Wire: 0A 08 4F 52 44 2D 32 30 32 36 10 80 F7 36 1A 03 56 4E 44`,
      },
      {
        step: 3,
        actor: 'HTTP/2 Transport',
        actionEn: 'Transmit HEADERS & DATA Frames',
        descriptionVi: 'Sends frames over POST /commerce.PaymentService/ProcessPayment on HTTP/2.',
        payloadExample: `:method: POST | :path: /commerce.PaymentService/ProcessPayment | content-type: application/grpc`,
      },
      {
        step: 4,
        actor: 'Payment Service → Order Service',
        actionEn: 'Return Binary Response & Trailing Status',
        descriptionVi: 'Decodes the response struct and confirms grpc-status: 0 (OK).',
        payloadExample: `PaymentResponse { transaction_id: "TXN-9921", status: APPROVED } | grpc-status: 0`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Inter-Service Mesh (Order Service ⇄ Payment & Inventory Microservices)',
      scenarioDescriptionVi:
        'Defines a commerce.proto contract allowing Order Service to invoke Unary RPCs on Payment Service and subscribe to Server Streaming fulfillment updates.',
      codeExamples: [
        {
          titleVi: 'commerce.proto Service Contract (Protobuf v3)',
          language: 'protobuf',
          descriptionVi:
            'Defines all 4 RPC communication patterns between Order, Payment, and Inventory services.',
          code: `syntax = "proto3";
package commerce.v1;

service OrderPaymentService {
  // 1. Unary RPC: Single payment request -> Single response
  rpc ProcessPayment (PaymentRequest) returns (PaymentResponse);

  // 2. Server Streaming: Stream live order fulfillment stages
  rpc WatchOrderFulfillment (OrderQuery) returns (stream FulfillmentEvent);

  // 3. Client Streaming: Warehouse streams stock deltas to server
  rpc UploadStockTelemetry (stream StockDelta) returns (BatchSyncSummary);

  // 4. Bidirectional Streaming: Real-time two-way fraud scoring
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
                'Field numbers (= 1, = 2) are transmitted as single binary tag bytes on the wire instead of verbose field names.',
            },
            {
              lineHint: 'returns (stream FulfillmentEvent)',
              explanationVi:
                'The stream keyword enables continuous multi-frame streaming over a single HTTP/2 call.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Internal Polyglot Microservices Communication',
        industry: 'Cloud-Native / Fintech / Ride-Hailing',
        descriptionVi:
          'Connecting dozens of Go, Java, Python, and Node.js services inside a Kubernetes cluster.',
        whyItFitsVi:
          'Ultra-low latency, minimal CPU/bandwidth footprint, and guaranteed cross-language type safety.',
      },
      {
        titleVi: 'IoT Telemetry & Real-Time AI Inference Pipelines',
        industry: 'IoT / Quantitative Trading / AI Serving',
        descriptionVi:
          'Streaming high-frequency sensor data or invoking GPU inference services.',
        whyItFitsVi:
          'Native HTTP/2 bidirectional streaming paired with compact binary framing.',
      },
    ],
    WhenNotToUseVi: [
      'When calling directly from a web browser without deploying an Envoy / gRPC-Web translation proxy.',
      'When publishing an external developer API where users expect human-readable JSON testable with plain cURL.',
    ],
    advantages: [
      'Superior performance: Binary Protobuf payloads are 3–5x smaller and 5–10x faster to serialize than JSON.',
      'First-class support for 4 communication modes (Unary, Server/Client/Bidirectional Streaming) over HTTP/2.',
      'Strict .proto contracts with automated multi-language Client Stub generation.',
      'Built-in Deadlines/Timeouts, request cancellation propagation, and structured gRPC status codes.',
    ],
    limitations: [
      'Binary payloads are not human-readable in network packet captures without the .proto file.',
      'Limited direct browser support because browser Fetch/XHR APIs do not expose raw HTTP/2 frame trailers.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'REST API',
        keyDifferenceVi:
          'gRPC optimizes machine-to-machine throughput via binary Protobuf and streaming; REST optimizes resource uniformity and universal browser readability via JSON.',
        whenToChooseThisVi:
          'Internal microservice-to-microservice communication or low-latency streaming pipelines.',
        whenToChooseOtherVi:
          'Browser/Mobile-to-Gateway traffic or public third-party developer APIs.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“gRPC is faster than REST, so we should replace REST with gRPC everywhere.”',
        realityVi:
          'Exposing gRPC directly to web browsers requires operating a gRPC-Web proxy and sacrifices native JSON inspection in Browser DevTools.',
        technicalProofVi:
          'Industry best practice combines both: REST/GraphQL for North-South traffic (Client ↔ API Gateway) and gRPC for East-West traffic (Service ↔ Service).',
      },
    ],
  },
];
