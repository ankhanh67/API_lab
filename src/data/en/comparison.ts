import { ComparisonRow } from '@/types/api';
import { DecisionScenarioOption } from '@/data/comparison';

export const COMPARISON_DIMENSIONS_EN: ComparisonRow[] = [
  {
    dimensionEn: 'Technical Nature',
    dimensionVi: '1. Technical Nature',
    whatItMeansVi:
      'Classifies the exact architectural layer of each subject (architectural style, messaging protocol, query runtime, RPC framework, or P2P media protocol).',
    values: {
      rest: 'Resource-oriented Architectural Style built on standard HTTP semantics.',
      soap: 'Strict XML-based Messaging Protocol governed by formal WSDL contracts.',
      graphql: 'Declarative Data Query Language & server-side execution runtime.',
      grpc: 'High-performance contract-first Remote Procedure Call (RPC) Framework.',
      websocket: 'Persistent full-duplex client-server Communication Protocol over TCP.',
      webhook: 'Event-Driven HTTP POST Callback Mechanism (Reverse API).',
      webrtc: 'Peer-to-Peer Real-Time Media (SRTP) & Data (SCTP) Protocol Suite over UDP.',
    },
  },
  {
    dimensionEn: 'Communication Model',
    dimensionVi: '2. Communication Model',
    whatItMeansVi: 'How peers or client/server endpoints establish connections and exchange messages.',
    values: {
      rest: 'CRUD operations targeting Resource URIs using standard HTTP verbs (GET, POST, PUT, PATCH, DELETE).',
      soap: 'Exchanging structured XML Envelopes (Header + Body) validated against a WSDL contract.',
      graphql: 'Client posts a declarative field-selection tree to a single endpoint (POST /graphql).',
      grpc: 'Client invokes strongly typed methods on generated Stubs multiplexed over HTTP/2 streams.',
      websocket: 'Starts with an HTTP 101 Upgrade handshake, then exchanges bidirectional frames over an open TCP socket.',
      webhook: 'Event producer asynchronously sends a signed HTTP POST payload to the consumer Callback URL.',
      webrtc: 'Exchanges SDP & ICE candidates via a Signaling Server, then streams directly Browser-to-Browser (Peer A ⇄ Peer B) over UDP.',
    },
  },
  {
    dimensionEn: 'Data Format',
    dimensionVi: '3. Data Format',
    whatItMeansVi: 'How payloads are serialized on the wire.',
    values: {
      rest: 'Primarily JSON (also supports XML, HTML, or plain text via Content Negotiation).',
      soap: 'Strictly XML with formal Namespaces (xmlns) and XML Schema Definition (XSD).',
      graphql: 'GraphQL Query syntax for requests; structured JSON matching the query shape for responses.',
      grpc: 'Compact binary Protocol Buffers (Protobuf) defined in .proto schema files.',
      websocket: 'Lightweight WebSocket Frames carrying UTF-8 text (JSON) or raw binary ArrayBuffers.',
      webhook: 'Typically JSON (or form-urlencoded) inside an HTTP POST request body.',
      webrtc: 'Encrypted SRTP media frames (Opus audio, VP8/VP9/H.264/AV1 video), SCTP data channel packets, and SDP session text.',
    },
  },
  {
    dimensionEn: 'Communication Direction',
    dimensionVi: '4. Communication Direction',
    whatItMeansVi: 'Which party initiates the transfer and which direction data flows.',
    values: {
      rest: 'Synchronous Request / Response (Client always initiates the request to the Server).',
      soap: 'Synchronous Request / Response (or asynchronous one-way envelopes over enterprise queues).',
      graphql: 'Request / Response for Queries & Mutations (Subscriptions piggyback over WebSocket/SSE).',
      grpc: '4 modes: Unary (1:1), Server Streaming (1:N), Client Streaming (N:1), Bidirectional Streaming (N⇄N).',
      websocket: 'Full-Duplex Bidirectional communication between Client and Server over TCP.',
      webhook: 'Unidirectional asynchronous event push from Producer to Consumer.',
      webrtc: 'Direct Peer-to-Peer Full-Duplex communication between end-user devices (Peer A ⇄ Peer B).',
    },
  },
  {
    dimensionEn: 'Real-Time Capability',
    dimensionVi: '5. Real-Time Capability',
    whatItMeansVi: 'Ability to push or stream live state changes with minimal latency.',
    values: {
      rest: 'Low (requires repetitive HTTP polling, adding latency and header overhead).',
      soap: 'Low (designed for discrete transactional documents, not continuous real-time streams).',
      graphql: 'Moderate (requires configuring GraphQL Subscriptions over a WebSocket transport).',
      grpc: 'Very High (native millisecond-latency bidirectional streaming over HTTP/2).',
      websocket: 'Excellent for server-coordinated real-time messaging, chat, and live dashboards.',
      webhook: 'High for server-to-server event notifications (pushes immediately when an event fires).',
      webrtc: 'Ultra-High (sub-20ms latency) for live video, audio, and P2P data directly over UDP.',
    },
  },
  {
    dimensionEn: 'Performance Characteristics',
    dimensionVi: '6. Performance Characteristics',
    whatItMeansVi: 'Wire payload overhead, CPU parsing cost, server bandwidth, and network latency.',
    values: {
      rest: 'Good; leverages HTTP/CDN caching effectively, though verbose JSON adds overhead for large payloads.',
      soap: 'Lowest throughput due to verbose XML tags and heavy DOM/XSD validation CPU overhead.',
      graphql: 'Saves client network bandwidth (zero over-fetching), but adds server AST parsing & resolver orchestration cost.',
      grpc: 'Peak server-to-server performance: binary Protobuf is 3–5x smaller than JSON with HTTP/2 multiplexing.',
      websocket: 'Minimal per-message overhead (2–14 byte frame header) with zero repeated handshake latency.',
      webhook: 'Eliminates 99% of wasted CPU and bandwidth compared to periodic HTTP polling loops.',
      webrtc: 'Lowest transport latency and offloads 100% of media bandwidth from central servers once direct P2P connects.',
    },
  },
  {
    dimensionEn: 'Learning & Implementation Complexity',
    dimensionVi: '7. Implementation Complexity',
    whatItMeansVi: 'Learning curve, tooling requirements, and operational overhead.',
    values: {
      rest: 'Low — Universally understood and supported out-of-the-box by every language and browser.',
      soap: 'High — Requires mastering WSDL contracts, XML namespaces, XSD schemas, and WS-* standards.',
      graphql: 'Medium–High — Requires schema design, N+1 query batching (DataLoader), and query depth limiting.',
      grpc: 'Medium–High — Requires .proto compilation toolchains (protoc) and gRPC-Web proxies for browser clients.',
      websocket: 'Medium–High — Requires managing stateful socket connections, heartbeats, reconnection, and Redis Pub/Sub scaling.',
      webhook: 'Medium — Easy to receive, but requires rigorous HMAC verification, exponential retry handling, and idempotency.',
      webrtc: 'Highest — Requires coordinating a Signaling Server, SDP state machines, ICE/STUN/TURN NAT traversal, and SFU scaling.',
    },
  },
  {
    dimensionEn: 'Client-Server Data Flexibility',
    dimensionVi: '8. Data Contract Flexibility',
    whatItMeansVi: 'Balance between strict schema enforcement and client-driven payload customization.',
    values: {
      rest: 'Moderate — The server dictates the fixed JSON shape returned by each endpoint.',
      soap: 'Rigid by design — Any schema change requires updating and recompiling the WSDL/XSD contract.',
      graphql: 'Maximum query flexibility — Clients select exact fields and nested relations in a single request.',
      grpc: 'Strictly typed yet forward/backward compatible thanks to numbered Protobuf field tags.',
      websocket: 'Unconstrained — Frames carry any custom JSON or binary event structure defined by the developer.',
      webhook: 'Event-scoped — Consumers subscribe selectively to specific event topics.',
      webrtc: 'Adaptive — Dynamically adjusts media bitrates to network congestion and supports reliable/unreliable RTCDataChannels.',
    },
  },
  {
    dimensionEn: 'Typical Use Cases',
    dimensionVi: '9. Typical Use Cases',
    whatItMeansVi: 'Real-world engineering scenarios where each technology excels.',
    values: {
      rest: 'Public Web APIs, e-commerce CRUD backends, standard web and mobile applications.',
      soap: 'Core banking settlement, interbank clearing, legacy ERP, telecom, and government systems.',
      graphql: 'Multi-platform apps (Web, Mobile, Smartwatch), Backend-for-Frontend (BFF) data aggregation gateways.',
      grpc: 'Polyglot internal microservices communication, real-time telemetry streaming, and AI inference pipelines.',
      websocket: 'Live text chat, collaborative editors, financial order books, and real-time server notifications.',
      webhook: 'Payment gateway callbacks (Stripe/VNPay), CI/CD triggers (GitHub push), SaaS workflow automation.',
      webrtc: 'Video conferencing (Meet/Zoom), telehealth consultations, screen sharing, P2P file transfer, and cloud gaming.',
    },
  },
];

export const DECISION_ADVISOR_SCENARIOS_EN: DecisionScenarioOption[] = [
  {
    id: 'dec-1',
    requirementTitleVi: 'Build a Public API for external partners & standard Web/Mobile CRUD',
    contextDescriptionVi:
      'Requires universal client compatibility, human-readable JSON, HTTP/CDN caching, and simple stateless scaling.',
    recommendedPrimary: 'rest',
    rationaleVi:
      'REST API is the gold standard for public APIs and CRUD workloads: every platform supports HTTP/JSON natively, HTTP status codes and caching work out-of-the-box, and API Gateways secure it effortlessly.',
    whyNotOthersVi:
      'Forcing external partners to compile binary gRPC stubs or construct verbose SOAP XML envelopes adds unnecessary friction unless required by banking regulations.',
  },
  {
    id: 'dec-2',
    requirementTitleVi: 'High-frequency internal communication across 20 Microservices (Go, Java, Python)',
    contextDescriptionVi:
      'Tens of thousands of RPC calls per second inside a Kubernetes cluster requiring sub-3ms latency, strict typing, and streaming.',
    recommendedPrimary: 'grpc',
    rationaleVi:
      'gRPC with binary Protocol Buffers over HTTP/2 cuts payload sizes by 60–80%, eliminates repetitive JSON text parsing CPU bottlenecks, and auto-generates strongly typed client stubs across Go, Java, and Python.',
    whyNotOthersVi:
      'Using text-based REST/JSON or SOAP/XML for dense east-west microservice traffic wastes significant CPU cycles on serialization.',
  },
  {
    id: 'dec-3',
    requirementTitleVi: 'Real-Time Text Chat, Live Stock Ticker, or Instant System Notifications',
    contextDescriptionVi:
      'A central server must broadcast events within milliseconds to thousands of connected browsers with reliable TCP ordering.',
    recommendedPrimary: 'websocket',
    rationaleVi:
      'WebSocket upgrades HTTP into a persistent, full-duplex TCP connection, allowing the server to push frames instantly to subscribed clients without repeated HTTP header overhead.',
    whyNotOthersVi:
      'REST HTTP polling floods servers with empty request headers, while WebRTC P2P is overly complex when messages must be routed and persisted through a central server.',
  },
  {
    id: 'dec-4',
    requirementTitleVi: 'Live Video/Audio Calls, Screen Sharing, or Direct Browser-to-Browser File Transfer',
    contextDescriptionVi:
      'Requires streaming 1080p@60fps video, echo-cancelled audio, or low-latency game state directly between users under 20ms.',
    recommendedPrimary: 'webrtc',
    recommendedCompanion: 'websocket',
    rationaleVi:
      'WebRTC transmits encrypted media (SRTP) and data (RTCDataChannel/SCTP) directly Peer-to-Peer over UDP, paired with WebSocket as the initial Signaling channel for SDP/ICE exchange.',
    whyNotOthersVi:
      'Routing real-time video over TCP WebSockets causes severe stutter due to TCP Head-of-Line Blocking on packet loss and saturates central server bandwidth.',
  },
  {
    id: 'dec-5',
    requirementTitleVi: 'Asynchronous Payment or Shipping Status Notifications Between Two Servers',
    contextDescriptionVi:
      'Your backend needs to know immediately when a customer finishes paying on an external payment gateway or a courier updates delivery status.',
    recommendedPrimary: 'webhook',
    recommendedCompanion: 'rest',
    rationaleVi:
      'Webhooks (Reverse APIs) let the external provider push an HMAC-signed HTTP POST to your Callback URL the moment the event occurs, saving 99% of resources compared to polling loops.',
    whyNotOthersVi:
      'Maintaining a 24/7 stateful WebSocket connection between two separate companies for sporadic order events is brittle and unnecessary.',
  },
  {
    id: 'dec-6',
    requirementTitleVi: 'Mobile & Web Apps Querying Deeply Relational Data Graphs (Preventing Over-fetching)',
    contextDescriptionVi:
      'Multiple client screens need tailored combinations of User, Department, Courses, and Billing entities in a single network round-trip.',
    recommendedPrimary: 'graphql',
    rationaleVi:
      'GraphQL lets each client screen declare the exact nested fields it needs in one query; server-side resolvers aggregate the data sources and return a tailored JSON payload.',
    whyNotOthersVi:
      'Traditional REST either forces clients to make 4–5 sequential requests (Under-fetching) or returns bloated resource objects with dozens of unused fields (Over-fetching).',
  },
  {
    id: 'dec-7',
    requirementTitleVi: 'Core Banking / Financial ERP Integration Requiring WS-Security & Formal XSD Contracts',
    contextDescriptionVi:
      'Mandates immutable WSDL service contracts, strict XSD type validation, and message-level XML digital signatures across intermediaries.',
    recommendedPrimary: 'soap',
    rationaleVi:
      'SOAP 1.2 with WS-Security and WSDL/XSD is purpose-built for enterprise financial clearing requiring end-to-end message-level cryptographic integrity.',
    whyNotOthersVi:
      'Lightweight JSON APIs typically rely solely on point-to-point transport TLS rather than standardized element-level XML signatures and ACID distributed transaction specs.',
  },
];
