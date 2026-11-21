import { QuizQuestion } from '@/types/api';

export const QUIZ_QUESTIONS_EN: QuizQuestion[] = [
  {
    id: 'q-rest-1',
    moduleId: 'rest',
    type: 'multiple-choice',
    questionVi:
      'In REST architecture, what does the "Stateless" constraint specifically require?',
    options: [
      {
        id: 'a',
        textVi:
          'The server stores no client session context in memory between requests; every incoming request must be self-contained with all information needed to authenticate and process it.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'The backend server is prohibited from storing data in a relational database.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Client applications are not allowed to have user authentication or login flows.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Every API request must exclusively use the HTTP GET method.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Statelessness in REST dictates that the server holds no client session state between calls. Because every request carries its own credentials and context (e.g., a JWT in the Authorization header), any server instance behind a Load Balancer can handle any request.',
    recommendationVi: 'Review Core Concepts: Stateless Communication in Module 1 (REST API).',
  },
  {
    id: 'q-rest-2',
    moduleId: 'rest',
    type: 'technical-understanding',
    questionVi:
      'You want to update ONLY the price field of product ID 101 without resending the other 20 attributes of that product. Which HTTP Method + Endpoint and response Status Code follow REST best practices?',
    codeContext: `Request Payload:\n{ "price": 2290000 }`,
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
      'HTTP PATCH is designed specifically for partial updates to an existing resource URI (/api/products/101), whereas PUT requires replacing the entire resource representation.',
    recommendationVi: 'Try executing PATCH /api/products/101 in the REST Playground.',
  },
  {
    id: 'q-soap-1',
    moduleId: 'soap',
    type: 'multiple-choice',
    questionVi:
      'Inside a SOAP XML message, which element is mandatory and contains the target operation payload or <soap:Fault> error block?',
    options: [
      {
        id: 'a',
        textVi: '<soap:Header>',
        isCorrect: false,
      },
      {
        id: 'b',
        textVi: '<soap:Body> nested inside <soap:Envelope>',
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
      'Every valid SOAP message must have a root <soap:Envelope> containing a mandatory <soap:Body> element (which holds either the operation payload or a <soap:Fault>). The <soap:Header> block is optional.',
    recommendationVi: 'Inspect the XML tree in the SOAP Banking Playground (Module 2).',
  },
  {
    id: 'q-soap-2',
    moduleId: 'soap',
    type: 'scenario-based',
    questionVi:
      'A banking consortium requires an interbank settlement integration where payloads are strictly validated against an XML Schema (XSD), carry element-level XML digital signatures (WS-Security) across multiple intermediary gateways, and support two-phase distributed transactions. Which technology directly fulfills these requirements?',
    options: [
      {
        id: 'a',
        textVi: 'SOAP API (with WSDL & WS-Security)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'WebSocket API',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Standalone Webhooks',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Unauthenticated REST GET endpoints',
        isCorrect: false,
      },
    ],
    explanationVi:
      'SOAP provides the enterprise WS-* suite (WS-Security, WS-AtomicTransaction) and formal WSDL/XSD contracts, securing the XML message payload itself rather than relying only on point-to-point transport TLS.',
    recommendationVi: 'Explore Scenario 5: Enterprise Core Banking Integration in Real-World Systems.',
  },
  {
    id: 'q-graphql-1',
    moduleId: 'graphql',
    type: 'technical-understanding',
    questionVi:
      'What happens on a GraphQL Server when a client sends a query requesting ONLY the "id" and "fullName" fields of a Student (omitting "courses" and "department")?',
    codeContext: `query {\n  student(id: "SV-101") {\n    id\n    fullName\n  }\n}`,
    options: [
      {
        id: 'a',
        textVi:
          'The GraphQL Server executes only the Query.student resolver to fetch id and fullName; the department and courses resolvers are NOT executed at all.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi:
          'The server still queries the courses and department database tables and strips them out right before sending.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'The server returns a validation error because not all schema fields were requested.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'The client must make 2 additional REST requests to retrieve the response.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'GraphQL traverses the query AST and invokes resolvers strictly for requested fields. Omitted fields never trigger their field resolvers, saving both network bandwidth and backend database queries.',
    recommendationVi: 'Toggle the field checkboxes in the GraphQL Playground (Module 3) to watch active resolvers change.',
  },
  {
    id: 'q-graphql-2',
    moduleId: 'graphql',
    type: 'scenario-based',
    questionVi:
      'You are building a university platform supporting both a rich Web Dashboard (needing 25 fields across student, department, courses, and grades) and a Mobile/Smartwatch app (needing only 3 fields: name, GPA, next room) over cellular networks. Which technology lets frontend teams fetch their exact data shape in 1 round-trip without backend engineers building dozens of custom endpoints?',
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
        textVi: 'Static XML files',
        isCorrect: false,
      },
    ],
    explanationVi:
      'GraphQL eliminates both Over-fetching and Under-fetching across multi-device platforms (Web, Mobile, Wearable) through client-driven declarative field selection.',
    recommendationVi: 'Review Scenario 4: Data Aggregation Platform in Real-World Systems.',
  },
  {
    id: 'q-grpc-1',
    moduleId: 'grpc',
    type: 'technical-understanding',
    questionVi:
      'Why is a Protocol Buffers (Protobuf) payload in gRPC significantly smaller and faster to serialize than a JSON text payload?',
    codeContext: `message PaymentRequest {\n  string order_id = 1;\n  int64 amount_vnd = 2;\n}`,
    options: [
      {
        id: 'a',
        textVi:
          'Because Protobuf serializes into binary format, replacing verbose string field names ("order_id", "amount_vnd") with compact numeric Field Tags (1, 2) + Wire Types and Varint-encoded integers.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'Because gRPC randomly drops half of the fields during network transmission.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Because Protobuf stores data as abbreviated XML tags.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Because gRPC bypasses the TCP transport layer.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Because both client and server compile the shared .proto contract ahead of time, Protobuf only transmits compact numeric field tags (Tag 1, Tag 2) and binary values on the wire, eliminating JSON key repetition and text parsing overhead.',
    recommendationVi: 'Inspect the Hex Wire Format panel in the gRPC Playground (Module 4).',
  },
  {
    id: 'q-grpc-2',
    moduleId: 'grpc',
    type: 'scenario-based',
    questionVi:
      'In an e-commerce microservices mesh, the Order Service calls Payment Service and Inventory Service tens of thousands of times per second (east-west traffic) requiring sub-3ms latency, strict cross-language typing (Go, Java, Python), and bidirectional streaming. Which technology is optimal?',
    options: [
      {
        id: 'a',
        textVi: 'gRPC API (over HTTP/2 with Protocol Buffers)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'SOAP XML over HTTP/1.1',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'HTTP Short Polling',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Uncompressed HTML forms',
        isCorrect: false,
      },
    ],
    explanationVi:
      'gRPC is the industry standard for internal microservice-to-microservice communication thanks to binary Protobuf serialization, HTTP/2 stream multiplexing, and multi-language code generation.',
    recommendationVi: 'Explore Module 4 (gRPC API) and Scenario 3 (Microservices Architecture).',
  },
  {
    id: 'q-websocket-1',
    moduleId: 'websocket',
    type: 'scenario-based',
    questionVi:
      'You are engineering a Real-Time Chat application where messages and typing indicators must be broadcast instantaneously among connected users with millisecond latency. Which technology fits best?',
    options: [
      {
        id: 'a',
        textVi: 'WebSocket API (Persistent, Full-Duplex TCP Connection)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'REST API with HTTP Short Polling every 10 seconds',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'SOAP API with WSDL',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Batch nightly CSV uploads',
        isCorrect: false,
      },
    ],
    explanationVi:
      'WebSocket establishes a persistent, full-duplex TCP connection after an HTTP 101 handshake, allowing the server to push chat frames to all connected clients immediately without waiting for client polling requests.',
    recommendationVi: 'Simulate two clients chatting live in the WebSocket Playground (Module 5).',
  },
  {
    id: 'q-websocket-2',
    moduleId: 'websocket',
    type: 'technical-understanding',
    questionVi:
      'How is a WebSocket connection established at the protocol level?',
    options: [
      {
        id: 'a',
        textVi:
          'It begins as an HTTP/1.1 GET request carrying "Upgrade: websocket" and "Connection: Upgrade" headers; if accepted, the server responds with "101 Switching Protocols".',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'It sends a SOAP XML Envelope over raw UDP.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'It sends a POST /graphql request with a mutation keyword.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'It opens a dedicated FTP port bypassing ports 80 and 443.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Per RFC 6455, WebSocket maintains compatibility with existing web infrastructure by starting with an HTTP Upgrade handshake over port 80/443 before switching the underlying TCP socket to bidirectional WebSocket framing.',
    recommendationVi: 'Inspect the 101 Handshake log in the WebSocket Playground (Module 5).',
  },
  {
    id: 'q-webhook-1',
    moduleId: 'webhook',
    type: 'technical-understanding',
    questionVi:
      'Why must your Webhook receiver endpoint verify the cryptographic HMAC signature (e.g., X-Webhook-Signature) AND enforce Idempotency by event.id?',
    options: [
      {
        id: 'a',
        textVi:
          'HMAC verification prevents attackers from spoofing fake payment HTTP POST requests to your public URL, while Idempotency prevents duplicate processing when the provider retries delivery.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'To upgrade the HTTP connection into a WebSocket 101 tunnel.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'To compress the JSON payload into binary Protocol Buffers.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Because HTTP POST requests cannot carry JSON bodies without HMAC.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Because a Webhook Callback URL is publicly reachable over the internet, verifying the HMAC-SHA256 signature proves authenticity. Furthermore, at-least-once retry policies mean the same event ID may arrive multiple times, requiring idempotent deduplication.',
    recommendationVi: 'Test "Tamper HMAC Signature" and "Simulate 500 & Retry" in the Webhook Playground (Module 6).',
  },
  {
    id: 'q-webhook-2',
    moduleId: 'webhook',
    type: 'scenario-based',
    questionVi:
      'Your e-commerce backend integrates with Stripe/VNPay. Once a customer completes a bank transfer, the payment gateway needs to notify your backend immediately without your server running a continuous polling loop. Which mechanism is purpose-built for this?',
    options: [
      {
        id: 'a',
        textVi: 'Webhook (Event-Driven HTTP POST Callback)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'GraphQL Schema Introspection',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Static WSDL files',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'REST GET Polling every 500ms',
        isCorrect: false,
      },
    ],
    explanationVi:
      'Webhooks invert the call direction (Reverse API): the event producer actively dispatches an HTTP POST carrying the payment.success payload to your registered Callback URL the moment payment settles.',
    recommendationVi: 'Review Scenario 1: E-Commerce Platform in Real-World Systems.',
  },
  {
    id: 'q-webrtc-1',
    moduleId: 'webrtc',
    type: 'technical-understanding',
    questionVi:
      'Why does a WebRTC application (which streams Video/Audio directly Peer-to-Peer over UDP) STILL require a Signaling Server (typically over WebSocket) and STUN/TURN servers?',
    options: [
      {
        id: 'a',
        textVi:
          'Because two browsers cannot discover each other blindly: a Signaling Server exchanges session descriptions (SDP Offer/Answer), STUN discovers public IP:Port mappings behind NAT routers, and TURN relays packets when Symmetric NAT firewalls block direct P2P UDP.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'Because WebRTC encodes all video frames as SOAP XML envelopes routed through STUN.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'Because STUN servers store the application’s relational SQL tables.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Because web browsers require a Flash Player plugin to send UDP packets.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'WebRTC connection setup has two phases: first, out-of-band signaling (via WebSocket/REST) exchanges SDP metadata (codecs, DTLS fingerprints) and ICE network candidates gathered via STUN/TURN; once NAT hole punching succeeds, encrypted media (SRTP) and data (SCTP) flow directly Peer-to-Peer over UDP.',
    recommendationVi: 'Switch between the 3 network topologies (LAN Host, Cone NAT STUN, Symmetric Firewall TURN) in the WebRTC Playground (Module 7).',
  },
  {
    id: 'q-webrtc-2',
    moduleId: 'webrtc',
    type: 'scenario-based',
    questionVi:
      'You are architecting a Telehealth platform requiring 1080p two-way video and audio between a Doctor and a Patient with sub-25ms latency, plus a live P2P heart-rate sensor stream without overloading central server bandwidth. Which technology combination is most accurate?',
    options: [
      {
        id: 'a',
        textVi:
          'WebRTC API (RTCPeerConnection for SRTP Video/Audio + RTCDataChannel for P2P sensor telemetry, paired with WebSocket for Signaling)',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi: 'SOAP API over HTTP/1.1',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi: 'REST API with GET Polling every second',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi: 'Unidirectional Webhooks',
        isCorrect: false,
      },
    ],
    explanationVi:
      'WebRTC is the only browser-native standard supporting direct Peer-to-Peer media (SRTP) and low-latency data channels (RTCDataChannel/SCTP) over UDP, avoiding TCP Head-of-Line Blocking and offloading media bandwidth from central servers.',
    recommendationVi: 'Explore Scenario 6: Telehealth & Real-Time Video Consultation Platform in Real-World Systems (/scenarios).',
  },
  {
    id: 'q-comp-1',
    moduleId: 'comprehensive',
    type: 'scenario-based',
    questionVi:
      'In a large-scale E-Commerce & Live Consultation platform, how do modern API technologies coexist across architectural layers?',
    options: [
      {
        id: 'a',
        textVi:
          'Use REST/GraphQL for storefront catalog & order CRUD; gRPC for high-speed internal microservices; Webhooks for external payment gateway callbacks; WebSockets for push notifications & signaling; and WebRTC for direct P2P video consultations.',
        isCorrect: true,
      },
      {
        id: 'b',
        textVi:
          'A software system must pick strictly ONE of the 7 technologies because they cannot coexist in the same architecture.',
        isCorrect: false,
      },
      {
        id: 'c',
        textVi:
          'Use SOAP XML to stream 60fps browser video and WebRTC to execute SQL database migrations.',
        isCorrect: false,
      },
      {
        id: 'd',
        textVi:
          'Use Webhooks to push events directly into end-user web browsers without a server.',
        isCorrect: false,
      },
    ],
    explanationVi:
      'No single technology is a silver bullet. Production architectures combine the right protocol for each boundary: REST/GraphQL at the client edge, gRPC inside the microservice mesh, Webhooks for cross-organization events, WebSockets for server push/signaling, and WebRTC for P2P real-time media and data.',
    recommendationVi: 'Explore the 7-Technology Coexistence Blueprint in the Comparison Center (/comparison).',
  },
];
