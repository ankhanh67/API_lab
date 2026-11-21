import { LearningModule } from '@/types/api';

export const MODULES_PART_2_EN: LearningModule[] = [
  // ==========================================================================
  // MODULE 5: WEBSOCKET API
  // ==========================================================================
  {
    id: 'websocket',
    order: 5,
    name: 'WebSocket API',
    taglineVi:
      'Persistent Full-Duplex communication protocol over a single TCP connection upgraded from an initial HTTP handshake.',
    technicalNature: 'Communication Protocol',
    technicalNatureVi: 'Persistent Full-Duplex Communication Protocol',
    accentColor: '#8B5CF6',
    badgeClass: 'border-violet-500/40 bg-violet-950/60 text-violet-300',
    borderClass: 'border-violet-500/40',
    glowClass: 'shadow-violet-950/50',
    introduction: {
      hookVi:
        'Traditional HTTP is strictly client-initiated: a server cannot push new data to a browser unless the client sends a request first. WebSocket (RFC 6455) breaks this barrier by keeping a single bidirectional TCP pipe open.',
      problemSolvedVi:
        'Before WebSocket, live chat or stock tickers had to poll the server every second via HTTP GET, wasting millions of redundant HTTP headers and suffering high latency.',
      historicalContextVi:
        'Standardized by the IETF (RFC 6455) and W3C in 2011, becoming the foundational protocol for real-time collaborative apps (Slack, Discord, Figma, TradingView).',
      coexistenceNoteVi:
        'Production apps pair REST with WebSocket: REST handles login, room listing, and historical message pagination, while WebSocket (wss://) delivers live incoming messages and typing indicators.',
    },
    coreConcepts: [
      {
        termEn: 'HTTP Handshake & Connection Upgrade (101)',
        titleVi: 'HTTP Upgrade Handshake (101 Switching Protocols)',
        summaryVi:
          'Every WebSocket session begins as a standard HTTP/1.1 GET request carrying Connection: Upgrade and Upgrade: websocket headers.',
        deepDiveVi:
          'If accepted, the server replies with HTTP 101 Switching Protocols and a hashed Sec-WebSocket-Accept header. From that instant, HTTP framing ends and the raw TCP socket exchanges lightweight WebSocket frames.',
        codeSnippet: `GET /realtime/chat HTTP/1.1
Host: ws.chatlab.vn
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13`,
      },
      {
        termEn: 'Persistent & Full-Duplex Communication',
        titleVi: 'Persistent Connection & True Full-Duplex Framing',
        summaryVi:
          'The TCP connection stays open until explicitly closed. Both client and server can transmit frames simultaneously without waiting for request/response turns.',
        deepDiveVi:
          'Each WebSocket frame carries only 2 to 14 bytes of framing overhead—hundreds of times smaller than resending full HTTP headers and cookies on every poll.',
      },
      {
        termEn: 'Heartbeat: Ping & Pong Frames',
        titleVi: 'Connection Keep-Alive: Ping & Pong Control Frames',
        summaryVi:
          'NAT routers, firewalls, and load balancers drop idle TCP sockets. WebSocket uses Ping (0x9) and Pong (0xA) control frames to verify liveness.',
        deepDiveVi:
          'The server periodically sends a Ping frame every 25–30 seconds; the client protocol stack automatically replies with a Pong frame. Missing Pongs allow the server to clean up dead sockets.',
      },
      {
        termEn: 'Reconnection & Backoff Strategy',
        titleVi: 'Connection Drops & Exponential Backoff Reconnection',
        summaryVi:
          'Because WebSockets are stateful, switching between Wi-Fi and cellular networks severs the underlying TCP pipe.',
        deepDiveVi:
          'Resilient clients listen for onclose events and reconnect using Exponential Backoff with random Jitter (e.g., waiting 1s, 2s, 4s, 8s) to prevent thundering-herd server outages.',
      },
      {
        termEn: 'WebSocket vs HTTP Polling / Long Polling',
        titleVi: 'WebSocket vs. HTTP Polling',
        summaryVi:
          'HTTP Short Polling sends requests repeatedly even when no data has changed; WebSocket transmits bytes only when an actual event occurs.',
        deepDiveVi:
          'With 10,000 online users, 1-second HTTP polling generates 10,000 HTTP requests/sec; WebSocket maintains 10,000 idle sockets and pushes frames in under 5ms when needed.',
      },
    ],
    architecture: {
      summaryVi:
        'Real-time bidirectional hub: Client A ⇄ WebSocket Server (Connection Registry & Room Broadcaster) ⇄ Client B.',
      nodes: [
        {
          id: 'ws-client-a',
          label: 'Client A (Browser)',
          sublabel: 'Connected Socket #1',
          role: 'client',
          descriptionVi: 'Maintains a persistent wss:// socket to send and receive live frames.',
          techDetails: 'Browser WebSocket API',
        },
        {
          id: 'ws-server',
          label: 'WebSocket Hub Server',
          sublabel: 'Stateful Connection Manager',
          role: 'server',
          descriptionVi: 'Tracks active sockets in memory, runs Ping/Pong heartbeats, and broadcasts room events.',
          techDetails: 'WS Server + Redis Pub/Sub',
        },
        {
          id: 'ws-client-b',
          label: 'Client B (Mobile App)',
          sublabel: 'Connected Socket #2',
          role: 'client',
          descriptionVi: 'Receives server-pushed frames instantaneously without polling.',
          techDetails: 'Mobile WebSocket Client',
        },
      ],
      edges: [
        {
          id: 'w1',
          from: 'ws-client-a',
          to: 'ws-server',
          label: 'Full-Duplex WS Frames (⇄)',
          protocol: 'wss:// (RFC 6455)',
          bidirectional: true,
        },
        {
          id: 'w2',
          from: 'ws-server',
          to: 'ws-client-b',
          label: 'Instant Broadcast Push (⇄)',
          protocol: 'wss:// (RFC 6455)',
          bidirectional: true,
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'A WebSocket lifecycle spans 3 distinct phases: Opening HTTP Upgrade Handshake → Bidirectional Data Framing & Heartbeats → Closing Handshake.',
      internalMechanismVi: [
        '1. HTTP Upgrade Handshake: Client sends GET with Upgrade: websocket and Sec-WebSocket-Key; server hashes the key with the RFC 6455 GUID and returns 101 Switching Protocols.',
        '2. Bidirectional Framing: Text (Opcode 0x1) or binary (Opcode 0x2) payloads are exchanged freely in lightweight frames.',
        '3. Ping/Pong Keep-Alive: Control frames detect silently dropped connections.',
        '4. Graceful Close / Reconnect: Either peer sends a Close Frame (Opcode 0x8) with a status code (e.g., 1000 Normal Closure).',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Client A & Client B → Server',
        actionEn: 'HTTP Upgrade Handshake (101)',
        descriptionVi: 'Both clients upgrade their HTTP connections into persistent WebSocket tunnels.',
        payloadExample: `HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade`,
      },
      {
        step: 2,
        actor: 'Client A → WebSocket Server',
        actionEn: 'Send Outbound Message Frame',
        descriptionVi: 'Client A types a chat message and pushes a JSON frame over the open pipe.',
        payloadExample: `WS Frame [FIN=1, Opcode=0x1 Text]: {"type":"chat.message","room":"eng-team","text":"Deployment succeeded!"}`,
      },
      {
        step: 3,
        actor: 'WebSocket Server → Client B & A',
        actionEn: 'Instant Server-to-Client Broadcast',
        descriptionVi: 'Server immediately pushes the message frame to Client B (and ACKs Client A) within milliseconds.',
        payloadExample: `WS Frame [Server Push]: {"type":"chat.broadcast","sender":"Client A","text":"Deployment succeeded!","ts":"09:15:02"}`,
      },
      {
        step: 4,
        actor: 'WebSocket Server ⇄ Clients',
        actionEn: 'Ping / Pong Heartbeat & Reconnection',
        descriptionVi: 'Exchanges Ping/Pong heartbeats; if network drops, clients automatically re-run the handshake.',
        payloadExample: `Control Frame: PING (0x9) ───► ◄─── PONG (0xA)`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Real-Time Team Chat & Collaboration Hub',
      scenarioDescriptionVi:
        'Connects multiple engineers into a live discussion room with bidirectional messaging, Ping/Pong heartbeats, and automatic exponential backoff reconnection.',
      codeExamples: [
        {
          titleVi: 'WebSocket Lifecycle Manager & Auto-Reconnect (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Shows how to establish a WebSocket connection, receive server pushes, and recover from network drops.',
          code: `class RealtimeChatClient {
  private ws: WebSocket | null = null;
  private retryCount = 0;

  connect(roomUrl: string) {
    // Initiates HTTP Upgrade Handshake to wss://
    this.ws = new WebSocket(roomUrl);

    this.ws.onopen = () => {
      this.retryCount = 0;
      console.log('[WS] 101 Switching Protocols -> Persistent socket open!');
    };

    // Triggered immediately whenever the server pushes a frame
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const packet = JSON.parse(event.data);
      console.log('[WS Inbound Frame]:', packet);
    };

    this.ws.onclose = (event) => {
      if (event.code !== 1000) {
        // Reconnect with Exponential Backoff on abnormal drop
        const delayMs = Math.min(1000 * Math.pow(2, this.retryCount++), 15000);
        setTimeout(() => this.connect(roomUrl), delayMs);
      }
    };
  }

  sendMessage(text: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: 'chat.msg', text }));
    }
  }
}`,
          annotations: [
            {
              lineHint: 'new WebSocket(roomUrl)',
              explanationVi:
                'Browser automatically sends HTTP GET with Upgrade: websocket and awaits 101 Switching Protocols.',
            },
            {
              lineHint: 'this.ws.onmessage',
              explanationVi:
                'Fires instantaneously whenever the server pushes a new frame down the open socket.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Real-Time Chat, Live Rooms & Collaborative Editing',
        industry: 'Collaboration / Social / Multiplayer Gaming',
        descriptionVi:
          'Multi-user chat rooms, live document co-editing (Google Docs, Figma), and multiplayer game state sync.',
        whyItFitsVi:
          'Requires continuous bidirectional messaging with millisecond latency and minimal framing overhead.',
      },
      {
        titleVi: 'Live Financial Order Books & DevOps Telemetry Dashboards',
        industry: 'Fintech / Cloud Monitoring',
        descriptionVi:
          'Streaming dozens of stock price ticks or server CPU/Memory metrics per second to browser dashboards.',
        whyItFitsVi:
          'Server pushes state deltas the instant they occur without waiting for client polling.',
      },
    ],
    WhenNotToUseVi: [
      'Standard CRUD operations (fetching articles, updating user profiles) where REST is simpler and cacheable.',
      'Infrequent server-to-server event notifications (e.g., payment completed) where Webhooks avoid holding open sockets.',
    ],
    advantages: [
      'True full-duplex bidirectional communication with millisecond latency.',
      'Tiny per-message framing overhead (2–14 bytes after handshake).',
      'Natively supported across all modern web browsers without plugins.',
    ],
    limitations: [
      'Stateful connections: horizontal scaling across multiple server nodes requires a Pub/Sub backplane (such as Redis).',
      'No built-in HTTP caching, per-message status codes, or URI routing inside frames.',
      'Requires custom logic for heartbeats, exponential backoff reconnection, and missed-message catch-up.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'HTTP Polling & REST',
        keyDifferenceVi:
          'REST opens and closes discrete Request/Response transactions; WebSocket maintains a continuous two-way tunnel.',
        whenToChooseThisVi:
          'When data changes every second and requires instant bidirectional push.',
        whenToChooseOtherVi:
          'When data is fetched on user demand and benefits from standard HTTP caching.',
      },
      {
        comparedWith: 'Webhook',
        keyDifferenceVi:
          'WebSocket keeps a stateful TCP pipe open between Browser/App and Server; Webhook fires a discrete HTTP POST between two servers when an event occurs.',
        whenToChooseThisVi:
          'When the recipient is an end-user browser or mobile app behind NAT (which cannot expose a public Webhook URL).',
        whenToChooseOtherVi:
          'When delivering asynchronous events between two backend servers.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“WebSocket is completely unrelated to HTTP.”',
        realityVi:
          'While WebSocket frame transport is independent of HTTP, every WebSocket connection MUST start with an HTTP/1.1 Upgrade handshake over port 80 or 443.',
        technicalProofVi:
          'RFC 6455 Section 1.3 specifies that the opening handshake is designed to be compatible with existing HTTP load balancers and firewalls.',
      },
    ],
  },

  // ==========================================================================
  // MODULE 6: WEBHOOK
  // ==========================================================================
  {
    id: 'webhook',
    order: 6,
    name: 'Webhook',
    taglineVi:
      'Event-driven callback mechanism (Reverse API): the event producer actively dispatches an HTTP POST to your Callback URL the moment an event occurs.',
    technicalNature: 'Event-Driven Callback Mechanism',
    technicalNatureVi: 'Event-Driven HTTP Callback Mechanism (Reverse API)',
    accentColor: '#F97316',
    badgeClass: 'border-orange-500/40 bg-orange-950/60 text-orange-300',
    borderClass: 'border-orange-500/40',
    glowClass: 'shadow-orange-950/50',
    introduction: {
      hookVi:
        'Webhooks are often called "Reverse APIs" or the "Don’t call us, we’ll call you" pattern of software architecture.',
      problemSolvedVi:
        'When a customer scans a bank QR code to pay, settlement might take 10 seconds or 10 minutes. If your e-commerce backend polls the payment gateway every 2 seconds ("Is it paid yet?") across thousands of orders, both servers waste 99% of their resources.',
      historicalContextVi:
        'Coined by Jeff Lindsay in 2007, extending the programming concept of callback hooks across the Web via HTTP POST.',
      coexistenceNoteVi:
        'A Webhook is not a new wire protocol—it uses standard HTTP POST requests. A classic workflow pairs REST and Webhooks: call a REST API to create a checkout session, then receive a Webhook HTTP POST when payment settles.',
    },
    coreConcepts: [
      {
        termEn: 'Event Producer, Consumer & Callback URL',
        titleVi: 'Event Producer, Consumer & Public Callback URL',
        summaryVi:
          'Your backend (Consumer) exposes a public HTTPS endpoint (Callback URL, e.g., https://shop.vn/api/webhooks/payment) and registers it with the external platform (Producer, e.g., Stripe, VNPay, GitHub).',
        deepDiveVi:
          'In a Webhook flow, client/server roles invert: the external provider acts as the HTTP Client sending the POST request, while your backend acts as the HTTP Server receiving it.',
      },
      {
        termEn: 'HTTP POST Delivery & Event Payload',
        titleVi: 'HTTP POST Delivery & JSON Event Payload',
        summaryVi:
          'The instant an event fires (payment.success, order.shipped), the Producer serializes the event details into JSON and sends an HTTP POST to your Callback URL.',
        deepDiveVi:
          'Your receiver endpoint should acknowledge receipt quickly with a 2xx status (200 OK or 202 Accepted) before running heavy downstream tasks.',
        codeSnippet: `POST /api/webhooks/payment HTTP/1.1
Host: api.myshop.vn
Content-Type: application/json
X-Webhook-Signature: sha256=7f8a9b...

{
  "id": "evt_2026_901",
  "event": "payment.success",
  "data": { "orderId": "ORD-778", "amountVnd": 900000 }
}`,
      },
      {
        termEn: 'Delivery Failures & Automatic Retry (Exponential Backoff)',
        titleVi: 'Delivery Failures & Exponential Backoff Retries',
        summaryVi:
          'If your server is temporarily down, returns 500/503, or times out, the Producer automatically queues the event for retry using Exponential Backoff.',
        deepDiveVi:
          'For example: Retry #1 after 5 seconds, Retry #2 after 30 seconds, Retry #3 after 5 minutes—continuing until it receives HTTP 200 OK or exhausts its retry schedule.',
      },
      {
        termEn: 'Idempotency in Webhook Consumers',
        titleVi: 'Idempotent Event Deduplication',
        summaryVi:
          'Because of automatic retries, your endpoint may receive the exact same payment.success event two or three times (At-least-once Delivery).',
        deepDiveVi:
          'Your Webhook handler MUST record processed event IDs (event.id) in a database table. If an incoming event.id was already processed, return 200 OK immediately without crediting the account or shipping the order twice!',
      },
      {
        termEn: 'HMAC Signature Verification & Security',
        titleVi: 'Webhook Security & HMAC-SHA256 Signature Verification',
        summaryVi:
          'Because your Callback URL is publicly reachable on the internet, an attacker could send a forged HTTP POST claiming "Order Paid".',
        deepDiveVi:
          'During setup, Producer and Consumer share a Webhook Secret. The Producer computes HMAC-SHA256(Secret, RawBody) and sends it in the X-Webhook-Signature header. Your server recomputes the HMAC and rejects the request with 401 if the signatures do not match.',
      },
    ],
    architecture: {
      summaryVi:
        'Unidirectional event push pipeline: Event Provider (Payment Gateway) → Event Trigger → Signed HTTP POST → Merchant Webhook Endpoint (HMAC Verifier & Idempotency Guard) → Event Processing.',
      nodes: [
        {
          id: 'wh-provider',
          label: 'Payment Provider',
          sublabel: 'Event Producer (Stripe/VNPay)',
          role: 'server',
          descriptionVi: 'Detects domain events (e.g., customer completed bank payment).',
          techDetails: 'Event Dispatcher & Retry Queue',
        },
        {
          id: 'wh-post',
          label: 'Signed HTTP POST',
          sublabel: 'JSON + HMAC Signature',
          role: 'contract',
          descriptionVi: 'HTTP POST request carrying event JSON and X-Webhook-Signature header.',
          techDetails: 'HMAC-SHA256 Signed Payload',
        },
        {
          id: 'wh-endpoint',
          label: 'Merchant Webhook Endpoint',
          sublabel: '/api/webhooks/payment',
          role: 'gateway',
          descriptionVi: 'Verifies HMAC signature, checks event.id idempotency, and returns 200 OK.',
          techDetails: 'Consumer Callback URL',
        },
        {
          id: 'wh-worker',
          label: 'Order Fulfillment Service',
          sublabel: 'Internal Business Logic',
          role: 'database',
          descriptionVi: 'Marks the order as PAID and dispatches the customer receipt.',
          techDetails: 'Async Worker & Order DB',
        },
      ],
      edges: [
        {
          id: 'wh1',
          from: 'wh-provider',
          to: 'wh-post',
          label: 'Event Trigger (payment.success)',
          protocol: 'Internal Event',
        },
        {
          id: 'wh2',
          from: 'wh-post',
          to: 'wh-endpoint',
          label: 'HTTP POST to Callback URL',
          protocol: 'HTTPS + HMAC Header',
        },
        {
          id: 'wh3',
          from: 'wh-endpoint',
          to: 'wh-worker',
          label: 'Verified & Deduplicated Event',
          protocol: 'Queue / DB Transaction',
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'Instead of client pull/polling, Webhooks operate on an asynchronous Event-Driven Push model.',
      internalMechanismVi: [
        '1. Subscription Registration: You register your public Callback URL and subscribed event types (payment.success, payment.failed) in the provider dashboard and receive a shared Webhook Secret.',
        '2. Trigger & Sign: When the event occurs, the Producer serializes the JSON body, computes HMAC = SHA256(Secret, RawBody), and sends an HTTP POST to your URL.',
        '3. Verify & Deduplicate: Your endpoint verifies the HMAC signature and checks whether event.id exists in the processed_webhooks table.',
        '4. ACK & Retry Loop: Returning 200 OK marks delivery complete; returning 5xx or timing out triggers exponential backoff retries.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Event Provider',
        actionEn: 'Event Triggered (payment.success)',
        descriptionVi: 'Payment gateway confirms funds settlement for order ORD-2026-778.',
        payloadExample: `Internal Event: payment.success | Order: ORD-2026-778 | Amount: 900,000 VND`,
      },
      {
        step: 2,
        actor: 'Webhook Dispatcher',
        actionEn: 'Sign Payload & Send HTTP POST',
        descriptionVi: 'Computes HMAC-SHA256 signature and dispatches HTTP POST to the merchant Callback URL.',
        payloadExample: `POST https://api.myshop.vn/webhooks/payment\nX-Webhook-Signature: sha256=e7c41a09...`,
      },
      {
        step: 3,
        actor: 'Webhook Endpoint',
        actionEn: 'Verify HMAC Signature & Idempotency',
        descriptionVi: 'Confirms valid HMAC signature and verifies eventId has not been processed yet.',
        payloadExample: `[SECURITY] HMAC Signature Matched! | [IDEMPOTENCY] evt_2026_901 is new.`,
      },
      {
        step: 4,
        actor: 'Webhook Endpoint → Provider',
        actionEn: 'Acknowledge with HTTP 200 OK',
        descriptionVi: 'Updates order status to PAID and returns 200 OK to stop the retry schedule.',
        payloadExample: `HTTP/1.1 200 OK\n{"received": true, "eventId": "evt_2026_901"}`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Production Payment & Order Webhook Receiver',
      scenarioDescriptionVi:
        'Implements a resilient Webhook endpoint handling payment.success and payment.failed events with HMAC-SHA256 verification and idempotent deduplication.',
      codeExamples: [
        {
          titleVi: 'Webhook Receiver with HMAC Verification & Idempotency (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Production-grade handler for incoming payment gateway HTTP POST callbacks.',
          code: `import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET!;
const processedEventIds = new Set<string>();

export async function handlePaymentWebhook(
  rawBody: string,
  signatureHeader: string
) {
  // Step 1: Recompute HMAC-SHA256 from raw request body and shared secret
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Step 2: Reject tampered or forged requests
  if (signatureHeader !== expectedSig) {
    return { status: 401, body: { error: 'INVALID_WEBHOOK_SIGNATURE' } };
  }

  const event = JSON.parse(rawBody);

  // Step 3: Enforce Idempotency (prevent duplicate processing on retries)
  if (processedEventIds.has(event.id)) {
    return { status: 200, body: { received: true, duplicate: true } };
  }
  processedEventIds.add(event.id);

  // Step 4: Process domain event and acknowledge with 200 OK
  if (event.event === 'payment.success') {
    await markOrderAsPaid(event.data.orderId);
  }
  return { status: 200, body: { received: true } };
}`,
          annotations: [
            {
              lineHint: 'createHmac("sha256", WEBHOOK_SECRET)',
              explanationVi:
                'Proves the request originated from the authentic payment provider and was not altered in transit.',
            },
            {
              lineHint: 'if (processedEventIds.has(event.id))',
              explanationVi:
                'Safely returns 200 OK on duplicate retries without double-crediting the order.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Asynchronous Payment & Banking Settlement Notifications',
        industry: 'Fintech / E-Commerce',
        descriptionVi:
          'Receiving instant notifications when customers complete QR bank transfers, card charges, or refunds.',
        whyItFitsVi:
          'Eliminates polling loops while updating orders the moment funds settle.',
      },
      {
        titleVi: 'CI/CD Automation & SaaS Workflow Triggers',
        industry: 'DevOps / Cloud Automation',
        descriptionVi:
          'GitHub dispatches a Webhook to GitHub Actions, Jenkins, or Vercel on every git push to trigger automated builds.',
        whyItFitsVi:
          'Consumes zero compute resources until a commit event actually occurs.',
      },
    ],
    WhenNotToUseVi: [
      'When the recipient is a web browser or mobile app (client devices behind NAT cannot host public HTTPS callback URLs—use WebSocket or Push Notifications).',
      'When the caller requires an immediate synchronous computation result in the same call (use REST or gRPC).',
    ],
    advantages: [
      'Near real-time event delivery without wasting CPU or bandwidth on polling.',
      'Simple to implement using standard HTTP POST and JSON infrastructure.',
      'Cleanly decouples event producers from downstream event subscribers.',
    ],
    limitations: [
      'Strictly unidirectional push from Producer to Consumer; Consumer must expose a public HTTPS URL.',
      'If the Consumer server is down longer than the Producer’s max retry window (e.g., 72 hours), events can be missed unless paired with a reconciliation REST API.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'HTTP Polling (REST)',
        keyDifferenceVi:
          'In Polling, the Consumer repeatedly asks the Producer; in Webhooks, the Producer notifies the Consumer only when new data arrives.',
        whenToChooseThisVi:
          'When events occur asynchronously and you want to eliminate 99% of redundant polling requests.',
        whenToChooseOtherVi:
          'When your server runs inside a restricted private network that blocks inbound HTTP POST requests.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“Webhooks and WebSockets are two names for the same technology.”',
        realityVi:
          'Despite similar names, they are fundamentally different: WebSocket keeps a stateful bidirectional TCP connection open (typically Browser ⇄ Server), whereas a Webhook is a one-off HTTP POST sent from one Server to another when an event occurs.',
        technicalProofVi:
          'Webhooks run over standard stateless HTTP POST requests without any 101 Switching Protocols upgrade.',
      },
    ],
  },

  // ==========================================================================
  // MODULE 7: WEBRTC API
  // ==========================================================================
  {
    id: 'webrtc',
    order: 7,
    name: 'WebRTC API',
    taglineVi:
      'W3C/IETF standard protocol suite and browser API enabling direct Peer-to-Peer (P2P) real-time Video, Audio, and Data streaming over UDP.',
    technicalNature: 'P2P Real-Time Media & Data Protocol',
    technicalNatureVi:
      'Peer-to-Peer Real-Time Media (SRTP) & Data (SCTP) Protocol Suite',
    accentColor: '#06B6D4',
    badgeClass: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
    borderClass: 'border-cyan-500/40',
    glowClass: 'shadow-cyan-950/50',
    introduction: {
      hookVi:
        'Unlike the previous 6 technologies—which all follow a Client–Server topology where traffic flows through central backend servers—WebRTC (Web Real-Time Communication) establishes a direct Peer-to-Peer tunnel between User A’s browser and User B’s browser over UDP.',
      problemSolvedVi:
        'During live video calls, screen sharing, or fast-paced multiplayer games, routing every video frame over TCP through a central server adds hundreds of milliseconds of latency and suffers from TCP Head-of-Line Blocking stutter. WebRTC streams encrypted UDP (DTLS-SRTP) directly between peers for sub-30ms latency.',
      historicalContextVi:
        'Google acquired Global IP Solutions (GIPS) and open-sourced WebRTC in 2011; subsequently standardized by the W3C and IETF and built natively into every modern browser without plugins.',
      coexistenceNoteVi:
        'Critical architectural coexistence rule: WebRTC peers CANNOT discover each other on the internet by themselves. WebRTC MUST pair with an out-of-band Signaling Server (typically built with WebSocket or REST) during setup to exchange session descriptions (SDP Offer/Answer) and network coordinates (ICE Candidates) before direct P2P UDP media flows!',
    },
    coreConcepts: [
      {
        termEn: 'Signaling & SDP (Session Description Protocol) Offer/Answer',
        titleVi: 'Signaling Channel & SDP Offer/Answer Negotiation',
        summaryVi:
          'Before connecting directly, Peer A and Peer B must agree on supported video codecs (VP8, VP9, H.264, AV1), audio codecs (Opus), and DTLS encryption fingerprints using a text manifest called SDP.',
        deepDiveVi:
          'The WebRTC spec intentionally leaves Signaling transport up to the developer. Typically, a WebSocket server relays the SDP Offer from Peer A to Peer B, and relays Peer B’s SDP Answer back to Peer A.',
        codeSnippet: `v=0
o=- 4611731400430051336 2 IN IP4 127.0.0.1
m=video 9 UDP/TLS/RTP/SAVPF 96 98
a=rtpmap:96 VP9/90000
a=fingerprint:sha-256 4A:AD:B9:B1:3F...`,
      },
      {
        termEn: 'NAT Traversal: ICE, STUN & TURN Servers',
        titleVi: 'Firewall & NAT Traversal with ICE, STUN, and TURN',
        summaryVi:
          'Most user devices sit behind home Wi-Fi or corporate NAT routers with private local IPs (e.g., 192.168.1.5) and cannot accept direct inbound connections without NAT traversal.',
        deepDiveVi:
          '1. STUN Server: Tells a peer "What is my public IP and port mapped by my NAT router?" (Server Reflexive Candidate - srflx, succeeds in ~80% of connections).\n2. TURN Server: When restrictive corporate firewalls (Symmetric NAT) block direct P2P UDP, TURN acts as a cloud relay server forwarding encrypted packets.\n3. ICE (Interactive Connectivity Establishment): Automatically tests all candidate pairs in priority order: Local LAN (host) → Direct NAT Hole Punching via STUN (srflx) → Cloud Relay via TURN (relay).',
      },
      {
        termEn: 'RTCPeerConnection & MediaStream (SRTP over UDP)',
        titleVi: 'Audio/Video Streaming via RTCPeerConnection (SRTP/UDP)',
        summaryVi:
          'navigator.mediaDevices.getUserMedia() captures camera/microphone tracks and attaches them to RTCPeerConnection, transmitting encrypted SRTP (Secure Real-time Transport Protocol) packets over UDP.',
        deepDiveVi:
          'Why UDP instead of TCP? In live video calls, timeliness beats retransmission: if one video frame drops, the browser skips it and renders the latest frame immediately rather than freezing the entire video stream waiting for a TCP retransmission.',
      },
      {
        termEn: 'RTCDataChannel (SCTP over DTLS/UDP)',
        titleVi: 'Arbitrary Peer-to-Peer Data Channels (RTCDataChannel)',
        summaryVi:
          'WebRTC is not limited to Video/Audio! RTCDataChannel opens a high-speed P2P binary/JSON pipe between browsers for multiplayer game coordinates, P2P file sharing, or live telemetry.',
        deepDiveVi:
          'Powered by SCTP over DTLS/UDP, RTCDataChannel can be configured as Reliable & Ordered (TCP-like for file transfers) or Unreliable & Unordered (pure UDP-like with zero Head-of-Line Blocking for action games).',
      },
      {
        termEn: 'Mandatory Encryption (DTLS & SRTP) & Group Topologies (Mesh / SFU)',
        titleVi: 'Mandatory DTLS-SRTP Encryption & Group Call Topologies (Mesh vs. SFU)',
        summaryVi:
          'Every WebRTC stream is encrypted end-to-end via DTLS (Datagram TLS) and SRTP. For group calls with >4 participants, architectures transition from P2P Mesh to an SFU (Selective Forwarding Unit) media router.',
        deepDiveVi:
          'In a 4-way P2P Mesh, each browser encodes and uploads 3 separate video streams. For 50-person meetings (Google Meet, Zoom), each browser sends 1 WebRTC upstream to an SFU server which forwards streams selectively.',
      },
    ],
    architecture: {
      summaryVi:
        'Two-phase hybrid architecture: Phase 1 uses a WebSocket Signaling Server + STUN to exchange SDP & discover public IPs; Phase 2 opens a direct UDP tunnel (SRTP/SCTP) between Peer A ⇄ Peer B (or falls back to a TURN Relay if blocked by Symmetric NAT).',
      nodes: [
        {
          id: 'rtc-peer-a',
          label: 'Peer A (Caller Browser)',
          sublabel: 'RTCPeerConnection',
          role: 'client',
          descriptionVi: 'Captures camera/DataChannel, generates SDP Offer, and gathers ICE Candidates.',
          techDetails: 'WebRTC Engine (DTLS-SRTP/SCTP)',
        },
        {
          id: 'rtc-signaling',
          label: 'Signaling Server',
          sublabel: 'WebSocket / REST Channel',
          role: 'broker',
          descriptionVi: 'Relays SDP Offer/Answer text manifests and ICE candidates between peers.',
          techDetails: 'Out-of-band Signaling Relay',
        },
        {
          id: 'rtc-stun-turn',
          label: 'STUN / TURN Infrastructure',
          sublabel: 'NAT Traversal & Fallback',
          role: 'gateway',
          descriptionVi: 'STUN discovers public IP/Port mappings; TURN relays UDP if Symmetric NAT blocks P2P.',
          techDetails: 'RFC 5389 (STUN) / RFC 5766 (TURN)',
        },
        {
          id: 'rtc-peer-b',
          label: 'Peer B (Callee Browser)',
          sublabel: 'RTCPeerConnection',
          role: 'client',
          descriptionVi: 'Accepts SDP Offer, returns SDP Answer, and locks in direct UDP P2P transport.',
          techDetails: 'WebRTC Engine (DTLS-SRTP/SCTP)',
        },
      ],
      edges: [
        {
          id: 'rtc1',
          from: 'rtc-peer-a',
          to: 'rtc-signaling',
          label: '1. Exchange SDP Offer/Answer & ICE (via WebSocket)',
          protocol: 'WSS / JSON',
          bidirectional: true,
        },
        {
          id: 'rtc2',
          from: 'rtc-peer-a',
          to: 'rtc-stun-turn',
          label: '2. STUN Binding Request / TURN Allocation',
          protocol: 'UDP / STUN',
          bidirectional: true,
        },
        {
          id: 'rtc3',
          from: 'rtc-peer-a',
          to: 'rtc-peer-b',
          label: '3. Direct P2P Media (SRTP) & DataChannel (SCTP)',
          protocol: 'Direct UDP / DTLS',
          bidirectional: true,
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'To connect two browsers directly across NAT routers and firewalls, WebRTC executes a 4-stage negotiation pipeline.',
      internalMechanismVi: [
        '1. SDP Negotiation (Signaling): Peer A calls createOffer(), sets setLocalDescription(), and sends the SDP Offer over WebSocket to Peer B. Peer B calls setRemoteDescription(), generates createAnswer(), and sends the SDP Answer back.',
        '2. ICE Candidate Gathering (STUN/TURN): Simultaneously, both browsers query STUN servers to discover their public IP:Port (srflx) and exchange ICE candidates via the Signaling Server.',
        '3. ICE Connectivity Checks & UDP Hole Punching: Both peers send direct STUN probe packets to punch through NAT firewalls and lock in the lowest-latency working candidate pair.',
        '4. DTLS Cryptographic Handshake & Direct P2P Streaming: Peers verify certificate fingerprints against the SDP a=fingerprint line and stream SRTP (Video/Audio) and SCTP (RTCDataChannel) directly Peer-to-Peer.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Peer A → Signaling Server → Peer B',
        actionEn: 'SDP Offer & Answer Exchange',
        descriptionVi: 'Browsers exchange SDP session descriptions (VP9/Opus codecs, DTLS fingerprints) over WebSocket.',
        payloadExample: `Signaling JSON: { "type": "offer", "sdp": "v=0\\r\\nm=video 9 UDP/TLS/RTP/SAVPF 96\\r\\na=rtpmap:96 VP9/90000..." }`,
      },
      {
        step: 2,
        actor: 'Peer A & B ⇄ STUN Server',
        actionEn: 'Gather ICE Candidates (NAT Discovery)',
        descriptionVi: 'Each peer queries STUN to discover its public IP and NAT-mapped UDP port.',
        payloadExample: `a=candidate:842163049 1 udp 1677729535 203.113.148.22 54321 typ srflx raddr 192.168.1.10 rport 51002`,
      },
      {
        step: 3,
        actor: 'Peer A ⇄ Peer B (Direct UDP)',
        actionEn: 'ICE Connectivity Check & DTLS Handshake',
        descriptionVi: 'Completes UDP NAT hole punching and verifies DTLS-SRTP encryption keys.',
        payloadExample: `[ICE] Selected Pair: 203.113.148.22:54321 <-> 118.70.12.99:60112 (STATE: connected, RTT: 14ms)`,
      },
      {
        step: 4,
        actor: 'Peer A ⇄ Peer B (P2P Stream)',
        actionEn: 'Direct P2P SRTP Media & SCTP DataChannel',
        descriptionVi: 'Streams live video/audio frames and RTCDataChannel packets directly browser-to-browser.',
        payloadExample: `P2P UDP Stream: [SRTP Video 1080p@60fps | 2.4 Mbps] + [SCTP DataChannel: {"cursorX":420,"cursorY":180}]`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Peer-to-Peer Video & RTCDataChannel Setup (Telehealth & Collaboration)',
      scenarioDescriptionVi:
        'Implements a standard RTCPeerConnection handshake with STUN/TURN configuration, ICE candidate trickle, and a low-latency P2P RTCDataChannel.',
      codeExamples: [
        {
          titleVi: 'RTCPeerConnection, SDP Offer & RTCDataChannel Initialization (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Shows how a browser pairs a WebSocket signaling channel with RTCPeerConnection to open a direct P2P pipe.',
          code: `const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Fallback TURN relay when Symmetric NAT blocks direct P2P UDP
    {
      urls: 'turn:turn.enterprise-lab.vn:3478',
      username: 'webrtc_user',
      credential: 'turn_secret_key'
    }
  ]
};

export async function startPeerConnection(signalingWs: WebSocket) {
  const pc = new RTCPeerConnection(rtcConfig);

  // 1. Create a P2P RTCDataChannel over SCTP/UDP
  const dataChannel = pc.createDataChannel('telemetry-sync', {
    ordered: false,       // Prioritize immediate delivery over strict ordering
    maxRetransmits: 0     // Pure UDP-like mode for real-time state sync
  });
  dataChannel.onopen = () => dataChannel.send(JSON.stringify({ ping: Date.now() }));

  // 2. Forward discovered ICE Candidates to the remote peer via Signaling
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      signalingWs.send(JSON.stringify({
        type: 'ice-candidate',
        candidate: event.candidate
      }));
    }
  };

  // 3. Generate SDP Offer and transmit over Signaling Server
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signalingWs.send(JSON.stringify({ type: 'sdp-offer', sdp: offer.sdp }));

  return pc;
}`,
          annotations: [
            {
              lineHint: 'iceServers: [stun:..., turn:...]',
              explanationVi:
                'Configures STUN for public IP discovery and TURN as a fallback relay when firewalls block direct UDP.',
            },
            {
              lineHint: 'pc.createDataChannel("telemetry-sync", ...)',
              explanationVi:
                'Opens a direct browser-to-browser binary/text data channel bypassing backend servers.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Video Conferencing, Telehealth & Sub-Second Interactive Streaming',
        industry: 'Telecommunications / Healthcare / EdTech',
        descriptionVi:
          'Two-way HD video calls, remote medical consultations, and interactive screen sharing (Google Meet, Discord Voice).',
        whyItFitsVi:
          'Built-in acoustic echo cancellation (AEC), noise suppression, and adaptive UDP bitrate control.',
      },
      {
        titleVi: 'P2P File Sharing, Cloud Gaming & Multiplayer State Sync',
        industry: 'Gaming / P2P File Transfer / Collaborative Tools',
        descriptionVi:
          'Transferring large files directly between browsers on a LAN/WAN or streaming frames from Cloud Gaming GPUs.',
        whyItFitsVi:
          'RTCDataChannel offloads 100% of transfer bandwidth from central servers and avoids TCP Head-of-Line Blocking.',
      },
    ],
    WhenNotToUseVi: [
      'Standard business API calls (login, checkout, database CRUD) which must authenticate and persist through a backend server via REST, GraphQL, or gRPC.',
      'Standard text chat rooms needing centralized server persistence and moderation across thousands of users (WebSocket is much simpler).',
    ],
    advantages: [
      'Lowest latency of any web technology thanks to direct P2P paths and UDP transport (zero TCP Head-of-Line Blocking).',
      'Massive server bandwidth savings when streaming high-bitrate video or large files directly between peers.',
      'Industrial-grade built-in media engine (Opus, VP9/AV1, echo cancellation, adaptive congestion control) with mandatory DTLS-SRTP encryption.',
    ],
    limitations: [
      'Most complex connection setup: requires operating a separate Signaling Server (WebSocket), STUN servers, and bandwidth-heavy TURN relays for firewall fallback.',
      'Pure P2P Mesh topology does not scale beyond 4–6 participants in a group video call without deploying an SFU media server.',
      'Direct P2P connections expose public IP addresses between peers unless forced through a TURN relay (iceTransportPolicy: "relay").',
    ],
    relatedComparisons: [
      {
        comparedWith: 'WebSocket API',
        keyDifferenceVi:
          'WebSocket is a Client ⇄ Server TCP connection (guaranteed ordering, server-routed); WebRTC is a Peer A ⇄ Peer B UDP connection (optimized for ultra-low-latency media & P2P data channels).',
        whenToChooseThisVi:
          'When streaming live Video/Audio, screen sharing, or sending P2P files/game telemetry.',
        whenToChooseOtherVi:
          'When building text chat, live notifications, or dashboards coordinated by a central backend server.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“Because WebRTC is Peer-to-Peer, it doesn’t need any backend servers at all.”',
        realityVi:
          'False! Even though media/data flows P2P, every production WebRTC app requires: (1) a Signaling Server (usually WebSocket) to exchange SDP offers/answers, (2) a STUN server to discover public IPs, and (3) a TURN server to relay traffic for the ~15–20% of users behind strict Symmetric NAT firewalls.',
        technicalProofVi:
          'The W3C WebRTC 1.0 specification mandates external out-of-band SDP exchange before RTCPeerConnection can initiate ICE checks.',
      },
    ],
  },
];
