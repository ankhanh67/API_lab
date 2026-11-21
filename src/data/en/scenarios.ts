import { RealWorldScenario } from '@/types/api';

export const REAL_WORLD_SCENARIOS_EN: RealWorldScenario[] = [
  {
    id: 'ecommerce-platform',
    number: 1,
    titleEn: 'Scenario 1: E-Commerce Platform',
    titleVi: 'Scenario 1: E-Commerce Platform (REST + Webhook + WebSocket Coexistence)',
    subtitleVi:
      'Combines REST for synchronous catalog/order CRUD, Webhooks for asynchronous bank payment confirmation, and WebSockets to push live order status to the customer browser.',
    technologies: ['rest', 'webhook', 'websocket'],
    businessProblemVi:
      'An e-commerce platform must serve product catalogs and order creation for Web and Mobile apps, integrate with an external bank QR payment gateway where customers take minutes to complete payment, and immediately transition the customer’s checkout screen the moment payment settles.',
    whyTheseTechnologiesVi: [
      {
        techId: 'rest',
        reasonVi:
          'Handles synchronous CRUD operations (GET /api/products, POST /api/orders) cleanly and leverages HTTP/CDN caching for catalog browsing.',
      },
      {
        techId: 'webhook',
        reasonVi:
          'Solves asynchronous payment notification: instead of polling the bank every second, the payment gateway pushes an HMAC-signed HTTP POST (payment.success) to the platform’s Callback URL.',
      },
      {
        techId: 'websocket',
        reasonVi:
          'As soon as the backend verifies the payment Webhook, the WebSocket Hub pushes an ORDER_PAID frame to the browser to flip the QR modal to the confirmation screen.',
      },
    ],
    nodes: [
      {
        id: 'ec-client',
        name: 'Web & Mobile Storefront',
        role: 'Customer Interface',
        techUsed: 'REST Client + WebSocket Listener',
        descriptionVi: 'Browses products, submits checkout via REST, and listens on WebSocket for live QR payment status.',
      },
      {
        id: 'ec-api',
        name: 'E-Commerce Order Backend',
        role: 'Core Application Server',
        techUsed: 'REST API + Webhook Receiver',
        descriptionVi: 'Exposes REST endpoints for customers and hosts the /webhooks/payment callback endpoint.',
      },
      {
        id: 'ec-pay',
        name: 'Payment Gateway (Stripe/VNPay)',
        role: 'External Event Producer',
        techUsed: 'Webhook Dispatcher',
        descriptionVi: 'Processes bank transfers and dispatches an HMAC-signed HTTP POST when funds settle.',
      },
      {
        id: 'ec-ws',
        name: 'Realtime Notification Hub',
        role: 'Push Notification Broker',
        techUsed: 'WebSocket Server (wss://)',
        descriptionVi: 'Pushes instant payment completion frames to the customer browser in 4ms.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'ec-client',
        toNodeId: 'ec-api',
        techId: 'rest',
        actionLabel: '1. GET /api/products & POST /api/orders',
        payload: `POST /api/orders\n{"items":[{"productId":101,"qty":1}],"paymentMethod":"QR_BANK"}\n--> 201 Created {"orderId":"ORD-2026-88","status":"PENDING_PAYMENT"}`,
        explanationVi:
          'Customer places an order via REST API. The server persists the order in PENDING_PAYMENT state and returns 201 Created.',
      },
      {
        step: 2,
        fromNodeId: 'ec-pay',
        toNodeId: 'ec-api',
        techId: 'webhook',
        actionLabel: '2. Webhook Push: POST /webhooks/payment (payment.success)',
        payload: `POST /api/webhooks/payment\nX-Webhook-Signature: sha256=9f8e7d6c...\n{"id":"evt_991","event":"payment.success","data":{"orderId":"ORD-2026-88","amount":2450000}}`,
        explanationVi:
          '30 seconds later, the customer completes the QR bank transfer. The payment gateway fires an HMAC-signed Webhook HTTP POST to the backend.',
      },
      {
        step: 3,
        fromNodeId: 'ec-api',
        toNodeId: 'ec-pay',
        techId: 'webhook',
        actionLabel: '3. Verify HMAC, Update Order to PAID & Return 200 OK',
        payload: `HTTP/1.1 200 OK\n{"received":true,"orderStatus":"PAID"}`,
        explanationVi:
          'Backend verifies the HMAC signature, checks event idempotency, updates the order to PAID, and acknowledges with 200 OK.',
      },
      {
        step: 4,
        fromNodeId: 'ec-ws',
        toNodeId: 'ec-client',
        techId: 'websocket',
        actionLabel: '4. WebSocket Push: Instant UI Order Confirmation',
        payload: `WS Frame [Server Push]: {"event":"order.paid","orderId":"ORD-2026-88","redirect":"/orders/ORD-2026-88/success"}`,
        explanationVi:
          'The WebSocket Hub immediately pushes the paid event to the browser, updating the UI without any page reload.',
      },
    ],
    tradeOffsVi: [
      'Combining 3 technologies optimizes each architectural hop but requires managing both JWT authentication for REST/WebSocket clients and HMAC signature verification for incoming Webhooks.',
      'Requires a fallback reconciliation job in case the Webhook endpoint experiences prolonged downtime beyond the payment gateway’s retry window.',
    ],
  },
  {
    id: 'realtime-chat',
    number: 2,
    titleEn: 'Scenario 2: Real-Time Chat Application',
    titleVi: 'Scenario 2: Real-Time Chat Application (WebSocket Full-Duplex)',
    subtitleVi:
      'Maintains persistent bidirectional TCP connections to deliver chat messages and typing indicators in under 10 milliseconds.',
    technologies: ['websocket'],
    businessProblemVi:
      'A team messaging platform requires that whenever a member sends a message or starts typing, every other room participant sees the update immediately without flooding the backend with millions of HTTP polling requests.',
    whyTheseTechnologiesVi: [
      {
        techId: 'websocket',
        reasonVi:
          'After the initial HTTP 101 Switching Protocols handshake, the persistent TCP pipe allows the server to broadcast frames to all room members with only a few bytes of framing overhead.',
      },
    ],
    nodes: [
      {
        id: 'chat-user-a',
        name: 'User A (Web Browser)',
        role: 'Message Sender',
        techUsed: 'WebSocket Client (wss://)',
        descriptionVi: 'Upgrades connection via HTTP 101 and transmits outbound text frames.',
      },
      {
        id: 'chat-hub',
        name: 'WebSocket Gateway & Room Hub',
        role: 'Stateful Connection Broker',
        techUsed: 'WebSocket Server + Pub/Sub',
        descriptionVi: 'Maintains Room → Active Sockets registry and broadcasts frames.',
      },
      {
        id: 'chat-user-b',
        name: 'User B & User C (Mobile)',
        role: 'Room Subscribers',
        techUsed: 'WebSocket Client (wss://)',
        descriptionVi: 'Receive server-pushed chat frames instantaneously over their open sockets.',
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
          'Users A, B, and C establish persistent WebSocket connections to the #architecture chat room.',
      },
      {
        step: 2,
        fromNodeId: 'chat-user-a',
        toNodeId: 'chat-hub',
        techId: 'websocket',
        actionLabel: '2. Outbound Frame: chat.message',
        payload: `WS Frame [Opcode=0x1]: {"event":"chat.message","room":"architecture","text":"gRPC diagram is ready!"}`,
        explanationVi:
          'User A sends a message; the lightweight frame travels immediately over the open socket without a new TCP/TLS handshake.',
      },
      {
        step: 3,
        fromNodeId: 'chat-hub',
        toNodeId: 'chat-user-b',
        techId: 'websocket',
        actionLabel: '3. Server Broadcast Push to Room Members',
        payload: `WS Frame [Server Push]: {"event":"room.broadcast","sender":"User A","text":"gRPC diagram is ready!","latency":"4ms"}`,
        explanationVi:
          'The WebSocket Hub broadcasts the frame to User B and User C in just 4ms.',
      },
    ],
    tradeOffsVi: [
      'Delivers sub-10ms latency and massive bandwidth savings compared to HTTP polling.',
      'Trade-off: WebSocket servers are stateful (holding open sockets in RAM), requiring a Redis Pub/Sub or NATS backplane to synchronize broadcasts across horizontally scaled nodes.',
    ],
  },
  {
    id: 'microservices-grpc',
    number: 3,
    titleEn: 'Scenario 3: Microservices Architecture',
    titleVi: 'Scenario 3: Internal Microservices Mesh (gRPC + Protobuf)',
    subtitleVi:
      'High-throughput internal communication between Order, Inventory, and Payment services using binary .proto contracts over HTTP/2.',
    technologies: ['grpc'],
    businessProblemVi:
      'During checkout, the backend must coordinate three independent polyglot microservices (Order Service in Go, Inventory Service in Python, Payment Service in Java). Using text JSON over HTTP/1.1 creates CPU serialization bottlenecks and adds tail latency.',
    whyTheseTechnologiesVi: [
      {
        techId: 'grpc',
        reasonVi:
          'Provides ultra-compact binary Protocol Buffers serialization, auto-generates strongly typed stubs for Go/Python/Java from a single .proto contract, and multiplexes calls over HTTP/2.',
      },
    ],
    nodes: [
      {
        id: 'ms-order',
        name: 'Order Service (Go)',
        role: 'Orchestrator & gRPC Client',
        techUsed: 'gRPC Generated Stub',
        descriptionVi: 'Orchestrates checkout by invoking strongly typed RPC calls to Inventory and Payment.',
      },
      {
        id: 'ms-inventory',
        name: 'Inventory Service (Python)',
        role: 'Stock Reservation Server',
        techUsed: 'gRPC Server (Protobuf)',
        descriptionVi: 'Verifies and locks product stock quantities in real time.',
      },
      {
        id: 'ms-payment',
        name: 'Payment Service (Java)',
        role: 'Transaction Processor',
        techUsed: 'gRPC Server (Unary & Stream)',
        descriptionVi: 'Authorizes wallet/card charges and streams settlement telemetry.',
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
          'Order Service calls the generated ReserveStock stub; the request is encoded into a 28-byte binary frame sent to Inventory Service.',
      },
      {
        step: 2,
        fromNodeId: 'ms-inventory',
        toNodeId: 'ms-order',
        techId: 'grpc',
        actionLabel: '2. Binary Response: Stock Reserved (1.9ms)',
        payload: `Protobuf Binary [14 bytes]: ReserveStockRes { reserved: true, hold_id: "HLD-88" } | grpc-status: 0`,
        explanationVi:
          'Inventory Service reserves the items and returns a 14-byte binary response in under 2ms.',
      },
      {
        step: 3,
        fromNodeId: 'ms-order',
        toNodeId: 'ms-payment',
        techId: 'grpc',
        actionLabel: '3. Unary RPC: PaymentService.AuthorizeCharge()',
        payload: `Protobuf Binary [34 bytes]: ChargeReq { order_id: "ORD-501", amount_vnd: 4900000 }`,
        explanationVi:
          'Order Service invokes AuthorizeCharge on the Java Payment Service over an existing HTTP/2 connection.',
      },
    ],
    tradeOffsVi: [
      'Maximizes throughput and enforces compile-time type safety across polyglot microservice teams.',
      'Trade-off: Binary wire payloads are not human-readable without loading the .proto schema into inspection tools.',
    ],
  },
  {
    id: 'data-aggregation-graphql',
    number: 4,
    titleEn: 'Scenario 4: Data Aggregation Platform',
    titleVi: 'Scenario 4: Multi-Source Data Aggregation Platform (GraphQL BFF)',
    subtitleVi:
      'Unifies data from independent domain services (Student Profile, Academic Records, Tuition Billing) behind a single graph query gateway.',
    technologies: ['graphql'],
    businessProblemVi:
      'A university platform serves 3 client apps (Web Portal, Mobile App, Campus Kiosk) that need relational data across Student Profiles, Course Grades, and Tuition Billing. Making 3–4 separate REST calls from mobile devices causes slow loading and heavy over-fetching.',
    whyTheseTechnologiesVi: [
      {
        techId: 'graphql',
        reasonVi:
          'Lets any client send a single declarative query specifying only the fields it needs; GraphQL resolvers fetch from underlying services in parallel and stitch a single JSON response.',
      },
    ],
    nodes: [
      {
        id: 'da-client',
        name: 'Mobile & Web Campus Apps',
        role: 'Multi-Platform Clients',
        techUsed: 'GraphQL Query Client',
        descriptionVi: 'Dispatches nested queries requesting only the exact fields required by the active screen.',
      },
      {
        id: 'da-gateway',
        name: 'GraphQL Aggregation Gateway',
        role: 'Unified Schema & Resolvers',
        techUsed: 'GraphQL Execution Engine',
        descriptionVi: 'Parses the query AST and executes matching domain resolvers in parallel.',
      },
      {
        id: 'da-sources',
        name: 'Student DB + Course Service + Billing API',
        role: 'Underlying Data Sources',
        techUsed: 'SQL + Internal Services',
        descriptionVi: 'Specialized backend data stores resolving individual branches of the graph.',
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
          'The mobile app sends a single request spanning three domains: profile, courses, and tuition balance.',
      },
      {
        step: 2,
        fromNodeId: 'da-gateway',
        toNodeId: 'da-sources',
        techId: 'graphql',
        actionLabel: '2. Parallel Resolver Execution & DataLoader Batching',
        payload: `Resolver 1 -> StudentDB | Resolver 2 -> CourseService | Resolver 3 -> BillingAPI`,
        explanationVi:
          'The GraphQL server executes the three domain resolvers concurrently over the fast internal network.',
      },
      {
        step: 3,
        fromNodeId: 'da-gateway',
        toNodeId: 'da-client',
        techId: 'graphql',
        actionLabel: '3. Return Unified Tailored JSON Response',
        payload: `{"data":{"student":{"fullName":"Tran Hoang Minh","gpa":3.82,"courses":[{"title":"Distributed Systems","grade":"A"}],"tuition":{"balanceDue":0}}}}`,
        explanationVi:
          'The client receives a compact JSON payload matching the exact shape of its query in one round-trip.',
      },
    ],
    tradeOffsVi: [
      'Eliminates chained client-side network round-trips and prevents over-fetching on mobile networks.',
      'Trade-off: Requires DataLoader batching (to avoid N+1 database queries) and query depth/complexity limits on the gateway.',
    ],
  },
  {
    id: 'enterprise-soap',
    number: 5,
    titleEn: 'Scenario 5: Enterprise Core Banking Integration',
    titleVi: 'Scenario 5: Enterprise & Core Banking Integration (SOAP + WSDL)',
    subtitleVi:
      'Exchanges strictly validated financial settlement envelopes governed by WSDL contracts, XSD schemas, and WS-Security digital signatures.',
    technologies: ['soap'],
    businessProblemVi:
      'A corporation’s SAP ERP system must integrate directly with a bank’s Core Banking ledger to automate payroll disbursements and supplier settlements with mandatory message-level cryptographic signatures and strict XSD schema enforcement.',
    whyTheseTechnologiesVi: [
      {
        techId: 'soap',
        reasonVi:
          'Guarantees formal WSDL service contracts, XML digital signatures (WS-Security) inside <soap:Header>, and standardized <soap:Fault> error reporting.',
      },
    ],
    nodes: [
      {
        id: 'ent-erp',
        name: 'Corporate ERP System',
        role: 'SOAP Client Initiator',
        techUsed: 'WSDL Generated SOAP Proxy',
        descriptionVi: 'Constructs the XML funds transfer envelope and signs it with the corporate certificate.',
      },
      {
        id: 'ent-gateway',
        name: 'Bank SOAP Endpoint & XSD Guard',
        role: 'Contract & Security Verifier',
        techUsed: 'SOAP 1.2 + WS-Security',
        descriptionVi: 'Verifies WS-Security signatures and validates XML payloads against the bank’s XSD schema.',
      },
      {
        id: 'ent-core',
        name: 'Core Banking Ledger',
        role: 'Financial Settlement Engine',
        techUsed: 'Enterprise Transaction Processor',
        descriptionVi: 'Executes atomic ACID debit/credit postings and issues official settlement IDs.',
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
          'The corporate ERP transmits a digitally signed SOAP XML envelope over the enterprise link.',
      },
      {
        step: 2,
        fromNodeId: 'ent-gateway',
        toNodeId: 'ent-core',
        techId: 'soap',
        actionLabel: '2. Verify XSD Schema & Execute Core Ledger Settlement',
        payload: `[XSD-PASS] Valid TransferMoneyRequest -> Ledger Debit/Credit Committed`,
        explanationVi:
          'After passing XSD validation and signature verification, the transfer is committed in the core banking ledger.',
      },
      {
        step: 3,
        fromNodeId: 'ent-gateway',
        toNodeId: 'ent-erp',
        techId: 'soap',
        actionLabel: '3. Return SOAP Response Envelope',
        payload: `<soap:Envelope><soap:Body><bank:TransferMoneyResponse><bank:SettlementId>STL-99812</bank:SettlementId><bank:Status>SETTLED</bank:Status></bank:TransferMoneyResponse></soap:Body></soap:Envelope>`,
        explanationVi:
          'The bank returns a formal SOAP Response envelope containing the official settlement reference.',
      },
    ],
    tradeOffsVi: [
      'Delivers maximum contract rigor, message-level non-repudiation, and strict XSD type safety.',
      'Trade-off: Verbose XML payloads consume more bandwidth and require heavier initial integration tooling than REST/JSON.',
    ],
  },
  {
    id: 'telehealth-webrtc',
    number: 6,
    titleEn: 'Scenario 6: Telehealth & Real-Time Video Consultation Platform',
    titleVi: 'Scenario 6: Telehealth & P2P Video Consultation (WebRTC + WebSocket Signaling)',
    subtitleVi:
      'Combines WebSocket for out-of-band SDP/ICE signaling with WebRTC to open a direct UDP tunnel streaming 1080p video and live heart-rate telemetry (RTCDataChannel) between Doctor and Patient.',
    technologies: ['webrtc', 'websocket'],
    businessProblemVi:
      'A telehealth platform needs sub-25ms high-definition video/audio consultations between a Doctor’s browser and a Patient’s browser alongside live medical sensor streaming (heart rate / SpO2) without routing costly video bandwidth through central servers.',
    whyTheseTechnologiesVi: [
      {
        techId: 'webrtc',
        reasonVi:
          'Establishes a direct Peer-to-Peer UDP tunnel to stream DTLS-SRTP encrypted video/audio and SCTP RTCDataChannel medical telemetry with sub-20ms latency and zero central media server bandwidth.',
      },
      {
        techId: 'websocket',
        reasonVi:
          'Serves as the mandatory Signaling Server during call setup so the Doctor and Patient browsers can exchange SDP Offers/Answers and ICE NAT traversal candidates.',
      },
    ],
    nodes: [
      {
        id: 'rtc-doc',
        name: 'Doctor Browser (Peer A)',
        role: 'WebRTC Caller & Telemetry Viewer',
        techUsed: 'RTCPeerConnection (SRTP + SCTP)',
        descriptionVi: 'Initiates the consultation call, generates the SDP Offer, and renders live video + patient vitals.',
      },
      {
        id: 'rtc-sig',
        name: 'WebSocket Signaling & STUN Server',
        role: 'Session Negotiation & NAT Discovery',
        techUsed: 'WebSocket (wss://) + STUN (RFC 5389)',
        descriptionVi: 'Relays SDP Offer/Answer packets and helps both peers discover their public IP:Port for UDP hole punching.',
      },
      {
        id: 'rtc-pat',
        name: 'Patient Browser (Peer B)',
        role: 'WebRTC Callee & Sensor Streamer',
        techUsed: 'RTCPeerConnection + RTCDataChannel',
        descriptionVi: 'Returns the SDP Answer and streams camera video + SpO2 vitals directly to the Doctor over P2P UDP.',
      },
    ],
    simulationSteps: [
      {
        step: 1,
        fromNodeId: 'rtc-doc',
        toNodeId: 'rtc-sig',
        techId: 'websocket',
        actionLabel: '1. Signaling: Send SDP Offer & Gather STUN ICE Candidates',
        payload: `WS Signaling -> {"type":"offer","sdp":"v=0\\r\\nm=video 9 UDP/TLS/RTP/SAVPF 98 (VP9)..."} | STUN srflx: 203.113.148.22:54321`,
        explanationVi:
          'The Doctor’s browser creates an SDP Offer sent via the WebSocket Signaling Server and queries STUN to discover its public IP/Port.',
      },
      {
        step: 2,
        fromNodeId: 'rtc-pat',
        toNodeId: 'rtc-sig',
        techId: 'websocket',
        actionLabel: '2. Signaling: Return SDP Answer & Complete ICE Hole Punching',
        payload: `WS Signaling -> {"type":"answer","sdp":"v=0...a=setup:active"} | ICE State: CONNECTED`,
        explanationVi:
          'The Patient’s browser receives the Offer, replies with an SDP Answer via WebSocket, and completes UDP NAT hole punching directly with the Doctor’s browser.',
      },
      {
        step: 3,
        fromNodeId: 'rtc-pat',
        toNodeId: 'rtc-doc',
        techId: 'webrtc',
        actionLabel: '3. Direct P2P UDP Stream: SRTP Video + SCTP Vitals DataChannel',
        payload: `Direct P2P UDP (16ms RTT): [SRTP Video 1080p@60fps] + [RTCDataChannel: {"heartRate":76,"spo2":99}]`,
        explanationVi:
          'Live consultation video and heart-rate telemetry flow directly Peer-to-Peer between the two browsers over DTLS-SRTP encrypted UDP without touching the central server!',
      },
    ],
    tradeOffsVi: [
      'Achieves the lowest possible media latency (< 20ms) and offloads 100% of 1-on-1 video bandwidth from backend servers.',
      'Trade-off: Requires maintaining fallback TURN relay servers for ~15% of calls where restrictive Symmetric NAT firewalls block direct P2P UDP connections.',
    ],
  },
];
