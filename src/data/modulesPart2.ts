import { LearningModule } from '@/types/api';

export const MODULES_PART_2: LearningModule[] = [
  // ==========================================================================
  // MODULE 5: WEBSOCKET API
  // ==========================================================================
  {
    id: 'websocket',
    order: 5,
    name: 'WebSocket API',
    taglineVi:
      'Giao thức truyền thông hai chiều (Full-Duplex) trên một kết nối TCP bền vững được nâng cấp từ bước bắt tay HTTP.',
    technicalNature: 'Communication Protocol',
    technicalNatureVi: 'Giao thức truyền thông hai chiều bền vững (Full-Duplex Communication Protocol)',
    accentColor: '#8B5CF6',
    badgeClass: 'border-violet-500/40 bg-violet-950/60 text-violet-300',
    borderClass: 'border-violet-500/40',
    glowClass: 'shadow-violet-950/50',
    introduction: {
      hookVi:
        'Giao thức HTTP truyền thống hoạt động theo mô hình "Hỏi mới Đáp": Server không thể tự ý đẩy dữ liệu xuống trình duyệt nếu Client không gửi Request trước. WebSocket (RFC 6455) phá vỡ giới hạn này bằng cách giữ mở một đường ống TCP hai chiều liên tục.',
      problemSolvedVi:
        'Trước khi có WebSocket, để cập nhật tin nhắn chat hay giá cổ phiếu, Client phải gửi HTTP Request hỏi Server mỗi giây (HTTP Polling) gây lãng phí hàng triệu HTTP Headers vô ích và tạo độ trễ lớn.',
      historicalContextVi:
        'Chuẩn hóa năm 2011 bởi IETF (RFC 6455) và W3C, trở thành nền tảng bắt buộc cho mọi ứng dụng cộng tác thời gian thực (Slack, Discord, Figma, TradingView).',
      coexistenceNoteVi:
        'Ứng dụng thực tế hầu như luôn kết hợp REST và WebSocket: dùng REST API để đăng nhập, lấy danh sách phòng chat và tải lịch sử tin nhắn cũ; sau đó mở kết nối WebSocket (wss://) để nhận/gửi tin nhắn mới tức thời.',
    },
    coreConcepts: [
      {
        termEn: 'HTTP Handshake & Connection Upgrade (101)',
        titleVi: 'Bắt tay HTTP & Nâng cấp Kết nối (101 Switching Protocols)',
        summaryVi:
          'Mọi kết nối WebSocket đều bắt đầu bằng một HTTP/1.1 GET Request đặc biệt có kèm Header Connection: Upgrade và Upgrade: websocket.',
        deepDiveVi:
          'Nếu Server chấp nhận, nó phản hồi mã trạng thái HTTP 101 Switching Protocols kèm khóa băm Sec-WebSocket-Accept. Kể từ giây phút đó, giao thức HTTP kết thúc và đường ống TCP chuyển sang truyền các WebSocket Frames.',
        codeSnippet: `GET /realtime/chat HTTP/1.1
Host: ws.chatlab.vn
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13`,
      },
      {
        termEn: 'Persistent & Full-Duplex Communication',
        titleVi: 'Kết nối Bền vững (Persistent) & Song công Toàn phần (Full-Duplex)',
        summaryVi:
          'Kết nối được giữ mở cho đến khi một trong hai bên chủ động đóng. Cả Client và Server có thể phát khung tin (Frames) đồng thời trên cùng một kênh mà không cần chờ lượt.',
        deepDiveVi:
          'Mỗi WebSocket Frame chỉ tốn từ 2 đến 14 bytes phần đầu (Frame Header), nhỏ hơn hàng trăm lần so với việc phải gửi lại toàn bộ HTTP Headers và Cookies trong mỗi lần HTTP Polling.',
      },
      {
        termEn: 'Heartbeat: Ping & Pong Frames',
        titleVi: 'Cơ chế Nhịp tim: Khung điều khiển Ping & Pong',
        summaryVi:
          'Các thiết bị mạng trung gian (NAT, Firewall, Load Balancer) thường tự ngắt các kết nối TCP im lặng quá lâu. WebSocket dùng khung Ping (0x9) và Pong (0xA) để giữ kết nối sống.',
        deepDiveVi:
          'Server định kỳ gửi khung Ping mỗi 25–30 giây; nếu Client còn kết nối, tầng giao thức tự động phản hồi khung Pong. Nếu quá hạn không nhận được Pong, Server giải phóng tài nguyên kết nối chết.',
      },
      {
        termEn: 'Reconnection & Backoff Strategy',
        titleVi: 'Xử lý Đứt kết nối & Tự động Kết nối lại (Reconnection)',
        summaryVi:
          'Vì kết nối có trạng thái (Stateful), khi người dùng đi vào thang máy hoặc chuyển từ Wi-Fi sang 5G, ống WebSocket sẽ bị đứt.',
        deepDiveVi:
          'Client chuyên nghiệp luôn lắng nghe sự kiện onclose và tự động kết nối lại theo thuật toán Exponential Backoff kèm Jitter (ví dụ: chờ 1s, 2s, 4s, 8s) để tránh làm sập Server khi hàng vạn người dùng kết nối lại cùng lúc.',
      },
      {
        termEn: 'WebSocket vs HTTP Polling / Long Polling',
        titleVi: 'So sánh WebSocket và HTTP Polling',
        summaryVi:
          'HTTP Short Polling gửi request định kỳ dù không có dữ liệu mới; WebSocket chỉ truyền byte khi thực sự có sự kiện phát sinh.',
        deepDiveVi:
          'Với 10,000 người dùng online, HTTP Polling mỗi giây tạo ra 10,000 HTTP connections/giây; WebSocket chỉ duy trì 10,000 socket nhàn rỗi và đẩy Frame tức thời với độ trễ < 5ms.',
      },
    ],
    architecture: {
      summaryVi:
        'Kiến trúc Hub hai chiều thời gian thực: Client A ⇄ WebSocket Server (Connection Registry & Room Broadcaster) ⇄ Client B.',
      nodes: [
        {
          id: 'ws-client-a',
          label: 'Client A (Browser)',
          sublabel: 'Connected Socket #1',
          role: 'client',
          descriptionVi: 'Duy trì kết nối wss:// bền vững, vừa gửi vừa lắng nghe sự kiện.',
          techDetails: 'Browser WebSocket API',
        },
        {
          id: 'ws-server',
          label: 'WebSocket Hub Server',
          sublabel: 'Stateful Connection Manager',
          role: 'server',
          descriptionVi: 'Quản lý danh sách Socket đang mở, xử lý Ping/Pong và phát tán (Broadcast) tin nhắn.',
          techDetails: 'WS Server + Redis Pub/Sub',
        },
        {
          id: 'ws-client-b',
          label: 'Client B (Mobile App)',
          sublabel: 'Connected Socket #2',
          role: 'client',
          descriptionVi: 'Nhận khung tin nhắn từ Server tức thời mà không cần gửi Request hỏi.',
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
        'Vòng đời của WebSocket gồm 3 giai đoạn rõ rệt: Bắt tay nâng cấp (Opening Handshake) → Truyền khung tin hai chiều (Data Framing & Heartbeat) → Đóng kết nối (Closing Handshake).',
      internalMechanismVi: [
        '1. HTTP Upgrade Handshake: Client gửi GET kèm Upgrade: websocket và Sec-WebSocket-Key; Server băm khóa này với chuỗi GUID chuẩn RFC 6455 và trả về 101 Switching Protocols.',
        '2. Bi-directional Framing: Dữ liệu văn bản (Opcode 0x1) hoặc nhị phân (Opcode 0x2) được chia thành các Frames nhẹ truyền qua lại tự do.',
        '3. Ping/Pong Keep-Alive: Server và Client trao đổi Control Frames để phát hiện sớm kết nối bị treo.',
        '4. Graceful Close / Reconnect: Khi kết thúc, một bên gửi Close Frame (Opcode 0x8) kèm mã đóng (ví dụ: 1000 Normal Closure).',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Client A & Client B → Server',
        actionEn: 'HTTP Upgrade Handshake (101)',
        descriptionVi: 'Cả hai Client thực hiện bắt tay nâng cấp từ HTTP lên kết nối WebSocket bền vững.',
        payloadExample: `HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade`,
      },
      {
        step: 2,
        actor: 'Client A → WebSocket Server',
        actionEn: 'Send Outbound Message Frame',
        descriptionVi: 'Client A gõ tin nhắn và đẩy 1 khung JSON qua ống kết nối đang mở.',
        payloadExample: `WS Frame [FIN=1, Opcode=0x1 Text]: {"type":"chat.message","room":"eng-team","text":"Deploy thành công!"}`,
      },
      {
        step: 3,
        actor: 'WebSocket Server → Client B & A',
        actionEn: 'Instant Server-to-Client Broadcast',
        descriptionVi: 'Server lập tức đẩy (Push) tin nhắn xuống socket của Client B (và xác nhận cho Client A) với độ trễ chỉ vài mili-giây.',
        payloadExample: `WS Frame [Server Push]: {"type":"chat.broadcast","sender":"Client A","text":"Deploy thành công!","ts":"09:15:02"}`,
      },
      {
        step: 4,
        actor: 'WebSocket Server ⇄ Clients',
        actionEn: 'Ping / Pong Heartbeat & Reconnection',
        descriptionVi: 'Duy trì nhịp tim Ping/Pong; nếu mạng chập chờn, Client tự động thực hiện Handshake kết nối lại.',
        payloadExample: `Control Frame: PING (0x9) ───► ◄─── PONG (0xA)`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Ứng dụng Chat & Cộng tác Thời gian thực (Real-time Team Chat)',
      scenarioDescriptionVi:
        'Kết nối nhiều người dùng vào phòng thảo luận kỹ thuật, hỗ trợ gửi nhận tin nhắn hai chiều tức thời, kiểm tra nhịp tim Ping/Pong và tự động kết nối lại khi rớt mạng.',
      codeExamples: [
        {
          titleVi: 'Quản lý Vòng đời Kết nối WebSocket & Tự động Reconnect (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Minh họa cách mở kết nối WebSocket, gửi/nhận sự kiện hai chiều và xử lý kết nối lại khi mạng bị gián đoạn.',
          code: `class RealtimeChatClient {
  private ws: WebSocket | null = null;
  private retryCount = 0;

  connect(roomUrl: string) {
    // Bắt đầu bằng HTTP Handshake và nâng cấp lên wss://
    this.ws = new WebSocket(roomUrl);

    this.ws.onopen = () => {
      this.retryCount = 0;
      console.log('[WS] 101 Switching Protocols -> Kết nối bền vững đã mở!');
    };

    // Lắng nghe dữ liệu do Server chủ động đẩy xuống bất kỳ lúc nào
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const packet = JSON.parse(event.data);
      console.log('[WS Inbound Frame]:', packet);
    };

    this.ws.onclose = (event) => {
      if (event.code !== 1000) {
        // Tự động kết nối lại với Exponential Backoff khi rớt mạng
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
                'Trình duyệt tự động gửi HTTP GET kèm Header Upgrade: websocket và chờ mã 101 từ Server.',
            },
            {
              lineHint: 'this.ws.onmessage',
              explanationVi:
                'Hàm callback được kích hoạt ngay lập tức mỗi khi Server đẩy một khung tin xuống Client.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Ứng dụng Nhắn tin, Phòng họp & Cộng tác Trực tuyến',
        industry: 'Collaboration / Social / Gaming',
        descriptionVi:
          'Chat nhiều người, cùng chỉnh sửa tài liệu (như Google Docs, Figma) hoặc trạng thái người chơi trong game.',
        whyItFitsVi:
          'Yêu cầu giao tiếp hai chiều liên tục với độ trễ cực thấp và chi phí Header tối thiểu.',
      },
      {
        titleVi: 'Bảng giá Chứng khoán, Tiền số & Giám sát Hệ thống Live',
        industry: 'Fintech / DevOps Monitoring',
        descriptionVi:
          'Đẩy hàng chục biến động giá hoặc chỉ số CPU/Memory mỗi giây xuống màn hình Dashboard.',
        whyItFitsVi:
          'Server chủ động stream dữ liệu ngay khi có biến động mà không đợi Client hỏi.',
      },
    ],
    WhenNotToUseVi: [
      'Các thao tác CRUD thông thường (lấy danh sách bài viết, cập nhật hồ sơ cá nhân) — dùng REST đơn giản và dễ cache hơn nhiều.',
      'Khi hai hệ thống Backend cần báo tin sự kiện không thường xuyên (ví dụ: thanh toán xong đơn hàng) — nên dùng Webhook thay vì giữ kết nối WebSocket tốn tài nguyên.',
    ],
    advantages: [
      'Giao tiếp hai chiều (Full-duplex) thực sự với độ trễ tính bằng mili-giây.',
      'Chi phí khung tin (Frame Overhead) cực thấp (chỉ vài bytes sau khi đã bắt tay xong).',
      'Hỗ trợ natively trên mọi trình duyệt Web hiện đại mà không cần cài thêm plugin.',
    ],
    limitations: [
      'Có trạng thái (Stateful): Việc cân bằng tải (Load Balancing) và mở rộng nhiều máy chủ đòi hỏi thêm tầng Pub/Sub (như Redis) để đồng bộ giữa các Node.',
      'Không có sẵn cơ chế Caching, định tuyến URI hay mã trạng thái cho từng tin nhắn như HTTP REST.',
      'Phải tự lập trình cơ chế Reconnection, Heartbeat và đồng bộ lại tin nhắn bị lỡ khi mất mạng.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'HTTP Polling & REST',
        keyDifferenceVi:
          'REST đóng mở giao dịch theo từng cặp Request/Response; WebSocket giữ mở một đường hầm hai chiều liên tục.',
        whenToChooseThisVi:
          'Khi dữ liệu thay đổi liên tục từng giây và cần tương tác hai chiều tức thời.',
        whenToChooseOtherVi:
          'Khi dữ liệu chỉ cần truy xuất theo yêu cầu của người dùng và cần tận dụng HTTP Caching.',
      },
      {
        comparedWith: 'Webhook',
        keyDifferenceVi:
          'WebSocket giữ kết nối TCP mở liên tục giữa Client (Trình duyệt/App) và Server; Webhook chỉ bắn 1 HTTP POST ngắn hạn giữa hai Server khi có sự kiện.',
        whenToChooseThisVi:
          'Khi bên nhận là trình duyệt Web/Mobile App của người dùng cuối (không có Public IP để nhận Webhook).',
        whenToChooseOtherVi:
          'Khi giao tiếp sự kiện bất đồng bộ giữa hai máy chủ Backend (Server-to-Server).',
      },
    ],
    misconceptions: [
      {
        mythVi: '“WebSocket là một giao thức hoàn toàn tách biệt, không liên quan gì đến HTTP.”',
        realityVi:
          'WebSocket là một giao thức độc lập ở giai đoạn truyền dữ liệu, nhưng bắt buộc phải khởi đầu bằng bước bắt tay HTTP/1.1 Upgrade trên cùng cổng 80 hoặc 443.',
        technicalProofVi:
          'RFC 6455 mục 1.3 quy định rõ Opening Handshake tương thích hoàn toàn với HTTP Server để đi xuyên qua Firewall và Reverse Proxy.',
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
      'Cơ chế gọi lại hướng sự kiện (Reverse API): Nhà cung cấp chủ động gửi HTTP POST tới Callback URL của bạn ngay khi sự kiện xảy ra.',
    technicalNature: 'Event-Driven Callback Mechanism',
    technicalNatureVi: 'Cơ chế gọi lại hướng sự kiện qua HTTP (Event-Driven Callback Mechanism)',
    accentColor: '#F97316',
    badgeClass: 'border-orange-500/40 bg-orange-950/60 text-orange-300',
    borderClass: 'border-orange-500/40',
    glowClass: 'shadow-orange-950/50',
    introduction: {
      hookVi:
        'Webhook thường được gọi là "Reverse API" (API đảo ngược) hay nguyên lý "Đừng gọi cho chúng tôi, chúng tôi sẽ gọi cho bạn khi có kết quả".',
      problemSolvedVi:
        'Khi khách hàng quét mã QR thanh toán ngân hàng, quá trình có thể mất 10 giây hoặc 10 phút. Nếu hệ thống thương mại điện tử của bạn cứ gọi REST API hỏi cổng thanh toán mỗi 2 giây ("Đã trả tiền chưa?") cho hàng vạn đơn hàng (Polling), cả hai hệ thống sẽ sớm quá tải.',
      historicalContextVi:
        'Khái niệm "Webhook" được Jeff Lindsay đặt tên năm 2007 dựa trên ý tưởng lập trình Hook (hàm callback) được kích hoạt qua mạng Web.',
      coexistenceNoteVi:
        'Webhook không phải là một giao thức mạng mới mà sử dụng chính phương thức HTTP POST chuẩn. Một luồng điển hình luôn kết hợp: Gọi REST API để tạo phiên thanh toán → Nhận Webhook HTTP POST khi giao dịch hoàn tất.',
    },
    coreConcepts: [
      {
        termEn: 'Event Producer, Consumer & Callback URL',
        titleVi: 'Bên phát sự kiện (Producer), Bên nhận (Consumer) & Callback URL',
        summaryVi:
          'Hệ thống của bạn (Consumer) mở sẵn một địa chỉ REST Endpoint công khai (Callback URL, ví dụ: https://shop.vn/api/webhooks/payment) và đăng ký địa chỉ này với nhà cung cấp dịch vụ (Producer, ví dụ: Stripe/VNPay/GitHub).',
        deepDiveVi:
          'Trong giao dịch Webhook, vai trò bị đảo ngược: Nhà cung cấp dịch vụ trở thành HTTP Client chủ động gửi Request, còn máy chủ của bạn đóng vai trò HTTP Server tiếp nhận.',
      },
      {
        termEn: 'HTTP POST Delivery & Event Payload',
        titleVi: 'Truyền tải bằng HTTP POST & Cấu trúc Gói tin Sự kiện',
        summaryVi:
          'Ngay khi sự kiện phát sinh (payment.success, order.shipped), Producer đóng gói thông tin chi tiết vào một JSON Payload và bắn HTTP POST tới Callback URL đã đăng ký.',
        deepDiveVi:
          'Bên nhận cần phản hồi mã HTTP 2xx (200 OK hoặc 202 Accepted) thật nhanh để báo hiệu đã nhận được gói tin trước khi xử lý các tác vụ nặng.',
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
        titleVi: 'Xử lý Lỗi Truyền tải & Cơ chế Tự động Thử lại (Retries)',
        summaryVi:
          'Nếu máy chủ của bạn đang bảo trì, trả về mã lỗi 500/503 hoặc quá thời gian chờ (Timeout), Producer sẽ không bỏ cuộc ngay mà tự động gửi lại theo lịch Exponential Backoff.',
        deepDiveVi:
          'Ví dụ: Thử lại lần 1 sau 5 giây, lần 2 sau 30 giây, lần 3 sau 5 phút... cho đến khi nhận được HTTP 200 OK hoặc hết số lần thử tối đa.',
      },
      {
        termEn: 'Idempotency in Webhook Consumers',
        titleVi: 'Tính Lũy đẳng (Idempotency) khi Nhận Sự kiện Trùng lặp',
        summaryVi:
          'Do cơ chế Retry tự động, hệ thống của bạn có thể nhận cùng một sự kiện payment.success 2 hoặc 3 lần (At-least-once Delivery).',
        deepDiveVi:
          'Endpoint nhận Webhook bắt buộc phải lưu mã định danh sự kiện (event.id hoặc Idempotency Key) vào Database. Nếu thấy event.id đã được xử lý trước đó, chỉ cần trả về 200 OK ngay mà không cộng tiền hay xuất kho lần hai!',
      },
      {
        termEn: 'HMAC Signature Verification & Security',
        titleVi: 'Bảo mật Webhook & Xác thực Chữ ký Số (HMAC-SHA256)',
        summaryVi:
          'Vì Callback URL của bạn phải mở công khai trên Internet để Producer gọi vào, kẻ tấn công có thể gửi một HTTP POST giả mạo báo "Đã thanh toán thành công".',
        deepDiveVi:
          'Để chống giả mạo, khi đăng ký Webhook hai bên chia sẻ một khóa bí mật (Webhook Secret). Producer dùng khóa này băm toàn bộ Request Body bằng thuật toán HMAC-SHA256 và gửi kèm trong Header X-Webhook-Signature. Server của bạn tự tính lại mã băm và so sánh khớp 100% mới chấp nhận xử lý.',
      },
    ],
    architecture: {
      summaryVi:
        'Luồng đẩy sự kiện một chiều: Event Provider (Payment Gateway) → Event Trigger → Signed HTTP POST → Merchant Webhook Endpoint (HMAC Verifier & Idempotency Guard) → Event Processing.',
      nodes: [
        {
          id: 'wh-provider',
          label: 'Payment Provider',
          sublabel: 'Event Producer (Stripe/VNPay)',
          role: 'server',
          descriptionVi: 'Phát hiện sự kiện nghiệp vụ (khách hàng vừa thanh toán thành công).',
          techDetails: 'Event Dispatcher & Retry Queue',
        },
        {
          id: 'wh-post',
          label: 'Signed HTTP POST',
          sublabel: 'JSON + HMAC Signature',
          role: 'contract',
          descriptionVi: 'Gói tin HTTP POST mang dữ liệu sự kiện và chữ ký bảo mật X-Webhook-Signature.',
          techDetails: 'HMAC-SHA256 Signed Payload',
        },
        {
          id: 'wh-endpoint',
          label: 'Merchant Webhook Endpoint',
          sublabel: '/api/webhooks/payment',
          role: 'gateway',
          descriptionVi: 'Xác thực chữ ký HMAC, kiểm tra trùng lặp event.id và phản hồi 200 OK.',
          techDetails: 'Consumer Callback URL',
        },
        {
          id: 'wh-worker',
          label: 'Order Fulfillment Service',
          sublabel: 'Internal Business Logic',
          role: 'database',
          descriptionVi: 'Cập nhật trạng thái đơn hàng sang PAID và gửi email hóa đơn cho khách.',
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
        'Khác với mô hình Client kéo dữ liệu (Pull/Polling), Webhook hoạt động theo mô hình Đẩy hướng sự kiện (Event-Driven Push).',
      internalMechanismVi: [
        '1. Đăng ký (Subscription): Bạn cấu hình Callback URL và danh sách sự kiện muốn nghe (payment.success, payment.failed) trên trang quản trị của nhà cung cấp và nhận về 1 chuỗi Webhook Secret.',
        '2. Phát sinh & Ký số (Trigger & Sign): Khi sự kiện xảy ra, Producer tạo JSON Payload, tính chữ ký HMAC = SHA256(Secret, RawBody) và bắn HTTP POST tới URL của bạn.',
        '3. Xác thực & Chống trùng (Verify & Deduplicate): Endpoint của bạn kiểm tra chữ ký HMAC và tra cứu event.id trong bảng processed_webhooks.',
        '4. Phản hồi ACK & Retry: Nếu Endpoint trả về 200 OK, Producer đánh dấu hoàn tất. Nếu trả về 5xx hoặc timeout, Producer lập lịch gửi lại tự động.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Event Provider',
        actionEn: 'Event Triggered (payment.success)',
        descriptionVi: 'Ngân hàng xác nhận giao dịch thanh toán cho đơn hàng ORD-2026-778 đã thành công.',
        payloadExample: `Internal Event: payment.success | Order: ORD-2026-778 | Amount: 900,000 VND`,
      },
      {
        step: 2,
        actor: 'Webhook Dispatcher',
        actionEn: 'Sign Payload & Send HTTP POST',
        descriptionVi: 'Tính chữ ký HMAC-SHA256 và gửi HTTP POST tới Callback URL của hệ thống thương mại điện tử.',
        payloadExample: `POST https://api.myshop.vn/webhooks/payment\nX-Webhook-Signature: sha256=e7c41a09...`,
      },
      {
        step: 3,
        actor: 'Webhook Endpoint',
        actionEn: 'Verify HMAC Signature & Idempotency',
        descriptionVi: 'Kiểm tra chữ ký hợp lệ và xác nhận eventId chưa từng được xử lý trước đó.',
        payloadExample: `[SECURITY] HMAC Signature Matched! | [IDEMPOTENCY] evt_2026_901 is new.`,
      },
      {
        step: 4,
        actor: 'Webhook Endpoint → Provider',
        actionEn: 'Acknowledge with HTTP 200 OK',
        descriptionVi: 'Cập nhật trạng thái đơn hàng thành PAID và trả về 200 OK để nhà cung cấp dừng chu trình Retry.',
        payloadExample: `HTTP/1.1 200 OK\n{"received": true, "eventId": "evt_2026_901"}`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Xử lý Thông báo Thanh toán & Đơn hàng (Payment & Order Webhook Handler)',
      scenarioDescriptionVi:
        'Xây dựng Endpoint nhận các sự kiện payment.success, payment.failed, order.created, order.shipped với đầy đủ bước xác thực chữ ký HMAC-SHA256 và chống xử lý trùng lặp.',
      codeExamples: [
        {
          titleVi: 'Triển khai Webhook Receiver với Xác thực HMAC & Idempotency (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Mẫu code chuẩn sản xuất (Production-grade) khi nhận HTTP POST từ cổng thanh toán.',
          code: `import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET!;
const processedEventIds = new Set<string>();

export async function handlePaymentWebhook(
  rawBody: string,
  signatureHeader: string
) {
  // Bước 1: Tính lại chữ ký HMAC-SHA256 từ Raw Body và Secret Key
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Bước 2: So sánh an toàn chống Timing Attack
  if (signatureHeader !== expectedSig) {
    return { status: 401, body: { error: 'INVALID_WEBHOOK_SIGNATURE' } };
  }

  const event = JSON.parse(rawBody);

  // Bước 3: Kiểm tra Idempotency (chống xử lý trùng khi Provider Retry)
  if (processedEventIds.has(event.id)) {
    return { status: 200, body: { received: true, duplicate: true } };
  }
  processedEventIds.add(event.id);

  // Bước 4: Xử lý theo loại sự kiện và trả về 200 OK thật nhanh
  if (event.event === 'payment.success') {
    await markOrderAsPaid(event.data.orderId);
  }
  return { status: 200, body: { received: true } };
}`,
          annotations: [
            {
              lineHint: 'createHmac("sha256", WEBHOOK_SECRET)',
              explanationVi:
                'Đảm bảo gói tin thực sự xuất phát từ cổng thanh toán và nội dung không bị chỉnh sửa trên đường truyền.',
            },
            {
              lineHint: 'if (processedEventIds.has(event.id))',
              explanationVi:
                'Nếu cổng thanh toán gửi lặp lại do mạng trễ, hệ thống vẫn trả về 200 OK nhưng không cộng tiền lần hai.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Thông báo Trạng thái Thanh toán & Ngân hàng (Payment Gateways)',
        industry: 'Fintech / E-Commerce',
        descriptionVi:
          'Nhận thông báo tức thời khi khách hàng hoàn tất chuyển khoản QR, thẻ tín dụng hoặc khi giao dịch bị hoàn tiền.',
        whyItFitsVi:
          'Thanh toán là quá trình bất đồng bộ; Webhook giúp cập nhật đơn hàng ngay lập tức mà không cần Polling.',
      },
      {
        titleVi: 'Tự động hóa CI/CD & Tích hợp Hệ thống SaaS',
        industry: 'DevOps / Cloud Automation',
        descriptionVi:
          'GitHub bắn Webhook sang Jenkins/Vercel mỗi khi có lệnh git push để tự động kích hoạt bản build mới.',
        whyItFitsVi:
          'Chỉ tiêu tốn tài nguyên khi thực sự có sự kiện commit mới phát sinh.',
      },
    ],
    WhenNotToUseVi: [
      'Khi ứng dụng của bạn là trình duyệt Web hoặc Mobile App (không thể mở cổng HTTP Server cố định trên điện thoại để nhận Webhook — hãy dùng WebSocket hoặc Push Notification).',
      'Khi bên gọi cần nhận kết quả tính toán trả về ngay lập tức trong cùng một luồng đồng bộ (dùng REST hoặc gRPC).',
    ],
    advantages: [
      'Cập nhật gần như thời gian thực ngay khi sự kiện phát sinh mà không tốn tài nguyên Polling.',
      'Đơn giản để cài đặt vì tận dụng chính hạ tầng HTTP POST và JSON quen thuộc.',
      'Tách biệt lỏng (Loose Coupling) giữa hệ thống phát sự kiện và các hệ thống đăng ký nhận.',
    ],
    limitations: [
      'Chỉ truyền một chiều từ Producer sang Consumer; Consumer phải có Public HTTPS URL.',
      'Nếu hệ thống nhận sập quá lâu vượt quá thời hạn Retry của Producer (ví dụ 72 giờ), sự kiện có thể bị mất nếu không có cơ chế đối soát (Reconciliation API) bổ trợ.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'HTTP Polling (REST)',
        keyDifferenceVi:
          'Trong Polling, Consumer liên tục hỏi Producer; trong Webhook, Producer chủ động báo cho Consumer khi có dữ liệu mới.',
        whenToChooseThisVi:
          'Khi sự kiện xảy ra không theo chu kỳ cố định và bạn muốn tiết kiệm 99% số lượng requests dư thừa.',
        whenToChooseOtherVi:
          'Khi máy chủ của bạn nằm trong mạng nội bộ đóng kín (Private Firewall) không cho phép bên ngoài gọi HTTP POST vào.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“Webhook và WebSocket là hai tên gọi của cùng một công nghệ.”',
        realityVi:
          'Mặc dù tên gần giống nhau, chúng hoàn toàn khác biệt: WebSocket là một giao thức giữ kết nối TCP hai chiều liên tục (thường giữa Browser và Server); còn Webhook là cơ chế một Server bắn một HTTP POST ngắn hạn sang một Server khác khi có sự kiện rồi đóng kết nối ngay.',
        technicalProofVi:
          'Webhook hoạt động hoàn toàn trên HTTP/1.1 hoặc HTTP/2 POST thông thường mà không có bất kỳ bước nâng cấp giao thức 101 Switching Protocols nào.',
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
      'Tổ hợp giao thức và API chuẩn W3C/IETF cho phép truyền tải Video, Audio và Dữ liệu trực tiếp ngang hàng (Peer-to-Peer) giữa các trình duyệt với độ trễ cực thấp qua UDP.',
    technicalNature: 'P2P Real-Time Media & Data Protocol',
    technicalNatureVi:
      'Giao thức & API truyền thông ngang hàng thời gian thực (Peer-to-Peer Real-Time Media & Data Protocol)',
    accentColor: '#06B6D4',
    badgeClass: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
    borderClass: 'border-cyan-500/40',
    glowClass: 'shadow-cyan-950/50',
    introduction: {
      hookVi:
        'Khác với 6 công nghệ trước vốn đều đi theo mô hình Client–Server (dữ liệu luôn phải đi qua máy chủ trung tâm), WebRTC (Web Real-Time Communication) thiết lập đường truyền trực tiếp từ trình duyệt của người dùng A sang trình duyệt của người dùng B (Peer-to-Peer) trên nền tảng giao thức UDP.',
      problemSolvedVi:
        'Khi gọi Video Call, họp trực tuyến hay chơi game tốc độ cao, nếu mọi khung hình video đều gửi qua TCP lên Server rồi mới vòng xuống người nhận, độ trễ sẽ lên tới hàng trăm mili-giây và hiện tượng nghẽn đầu hàng (TCP Head-of-Line Blocking) sẽ làm hình ảnh bị giật đứng. WebRTC dùng UDP mã hóa (DTLS-SRTP) truyền thẳng giữa 2 thiết bị để đạt độ trễ dưới 30ms.',
      historicalContextVi:
        'Google mua lại công nghệ của Global IP Solutions (GIPS) và mở mã nguồn dự án WebRTC vào năm 2011; sau đó được W3C và IETF chuẩn hóa tích hợp sẵn trong mọi trình duyệt hiện đại mà không cần cài đặt Flash hay Plugin.',
      coexistenceNoteVi:
        'Lưu ý sống còn về cộng sinh kiến trúc: Bản thân WebRTC KHÔNG tự tìm thấy nhau trên Internet. Nó BẮT BUỘC phải mượn một Signaling Server (thường viết bằng WebSocket hoặc REST) ở giai đoạn khởi tạo để hai Peer trao đổi thông tin phiên (SDP Offer/Answer) và tọa độ mạng (ICE Candidates). Sau khi bắt tay xong, luồng Video/Data mới chảy trực tiếp P2P!',
    },
    coreConcepts: [
      {
        termEn: 'Signaling & SDP (Session Description Protocol) Offer/Answer',
        titleVi: 'Kênh Báo hiệu (Signaling) & Trao đổi SDP Offer/Answer',
        summaryVi:
          'Trước khi kết nối trực tiếp, Peer A và Peer B phải thống nhất xem mỗi bên hỗ trợ chuẩn nén Video nào (VP8, VP9, H.264, AV1), Audio nào (Opus) và khóa mã hóa là gì thông qua bản mô tả văn bản gọi là SDP.',
        deepDiveVi:
          'Đặc tả WebRTC cố tình không ép buộc giao thức cho Signaling. Lập trình viên thường dùng một kết nối WebSocket làm Signaling Server: Peer A tạo SDP Offer gửi qua WebSocket cho Peer B; Peer B nhận được và trả lại SDP Answer.',
        codeSnippet: `v=0
o=- 4611731400430051336 2 IN IP4 127.0.0.1
m=video 9 UDP/TLS/RTP/SAVPF 96 98
a=rtpmap:96 VP9/90000
a=fingerprint:sha-256 4A:AD:B9:B1:3F...`,
      },
      {
        termEn: 'NAT Traversal: ICE, STUN & TURN Servers',
        titleVi: 'Xuyên Tường lửa & NAT với bộ ba ICE, STUN và TURN',
        summaryVi:
          'Hầu hết máy tính và điện thoại đều nằm sau bộ định tuyến Wi-Fi (NAT/Firewall) chỉ có IP nội bộ (như 192.168.1.5) nên không thể kết nối trực tiếp từ Internet vào nếu không có cơ chế xuyên NAT.',
        deepDiveVi:
          '1. STUN Server: Giúp mỗi Peer tự hỏi "Địa chỉ IP Public và Port mà Router mở cho tôi là gì?" (Server Reflexive Candidate - srflx, thành công ~80% trường hợp).\n2. TURN Server: Khi gặp tường lửa doanh nghiệp khắt khe (Symmetric NAT) chặn kết nối P2P trực tiếp, TURN đóng vai trò trạm chuyển tiếp (Relay) luồng UDP.\n3. ICE (Interactive Connectivity Establishment): Thuật toán tự động thử mọi cặp tọa độ theo thứ tự ưu tiên: LAN nội bộ (host) → Xuyên NAT qua STUN (srflx) → Chuyển tiếp qua TURN (relay).',
      },
      {
        termEn: 'RTCPeerConnection & MediaStream (SRTP over UDP)',
        titleVi: 'Truyền tải Âm thanh & Hình ảnh qua RTCPeerConnection (SRTP/UDP)',
        summaryVi:
          'API navigator.mediaDevices.getUserMedia() thu nhận luồng Camera/Micro và gắn vào đối tượng RTCPeerConnection để truyền đi dưới dạng các gói tin SRTP (Secure Real-time Transport Protocol) trên nền UDP.',
        deepDiveVi:
          'Tại sao dùng UDP thay vì TCP? Trong cuộc gọi trực tuyến, tính thời sự quan trọng hơn việc truyền lại gói tin cũ: nếu rớt 1 khung hình video ở giây trước, trình duyệt bỏ qua luôn để vẽ khung hình mới nhất ngay lập tức thay vì dừng cả video chờ gửi lại như TCP.',
      },
      {
        termEn: 'RTCDataChannel (SCTP over DTLS/UDP)',
        titleVi: 'Kênh Dữ liệu Ngang hàng Tùy ý (RTCDataChannel)',
        summaryVi:
          'WebRTC không chỉ dùng cho Video/Audio! RTCDataChannel cung cấp một đường ống P2P tốc độ cao để truyền bất kỳ dữ liệu JSON hoặc Binary nào (tọa độ nhân vật game, chia sẻ file P2P, đồng bộ con trỏ chuột) trực tiếp giữa hai trình duyệt.',
        deepDiveVi:
          'RTCDataChannel sử dụng giao thức SCTP đóng gói trong DTLS/UDP, cho phép lập trình viên tự chọn chế độ: Tin cậy & Đúng thứ tự (Reliable & Ordered — giống TCP) hoặc Không cần chờ gửi lại (Unreliable & Unordered — giống UDP thuần cho game hành động).',
      },
      {
        termEn: 'Mandatory Encryption (DTLS & SRTP) & Group Topologies (Mesh / SFU)',
        titleVi: 'Mã hóa Bắt buộc (DTLS-SRTP) & Mô hình Phòng họp (Mesh vs SFU)',
        summaryVi:
          'Mọi kết nối WebRTC bắt buộc phải được mã hóa đầu-cuối ở tầng giao vận bằng DTLS (Datagram TLS) và SRTP. Với cuộc gọi nhóm > 4 người, kiến trúc thường chuyển từ P2P Mesh sang máy chủ điều phối SFU (Selective Forwarding Unit).',
        deepDiveVi:
          'Trong mô hình P2P Mesh 4 người, mỗi máy phải mã hóa và tải lên 3 luồng video riêng biệt. Khi họp 50 người (như Google Meet, Zoom), các Peer kết nối WebRTC tới một máy chủ SFU để mỗi người chỉ cần upload 1 luồng và SFU phân phối lại.',
      },
    ],
    architecture: {
      summaryVi:
        'Kiến trúc lai hai pha: Pha 1 dùng WebSocket Signaling Server + STUN để trao đổi SDP & tìm IP Public; Pha 2 mở đường hầm UDP (SRTP/SCTP) kết nối trực tiếp Peer A ⇄ Peer B (hoặc fallback qua TURN Relay nếu tường lửa chặn).',
      nodes: [
        {
          id: 'rtc-peer-a',
          label: 'Peer A (Caller Browser)',
          sublabel: 'RTCPeerConnection',
          role: 'client',
          descriptionVi: 'Thu luồng Camera/DataChannel, tạo SDP Offer và thu thập ICE Candidates.',
          techDetails: 'WebRTC Engine (DTLS-SRTP/SCTP)',
        },
        {
          id: 'rtc-signaling',
          label: 'Signaling Server',
          sublabel: 'WebSocket / REST Channel',
          role: 'broker',
          descriptionVi: 'Chuyển tiếp gói văn bản SDP Offer/Answer và danh sách ICE Candidates giữa hai Peer.',
          techDetails: 'Out-of-band Signaling Relay',
        },
        {
          id: 'rtc-stun-turn',
          label: 'STUN / TURN Infrastructure',
          sublabel: 'NAT Traversal & Fallback',
          role: 'gateway',
          descriptionVi: 'STUN khám phá IP/Port công cộng; TURN chuyển tiếp gói UDP nếu tường lửa Symmetric NAT chặn P2P.',
          techDetails: 'RFC 5389 (STUN) / RFC 5766 (TURN)',
        },
        {
          id: 'rtc-peer-b',
          label: 'Peer B (Callee Browser)',
          sublabel: 'RTCPeerConnection',
          role: 'client',
          descriptionVi: 'Nhận SDP Offer, phản hồi SDP Answer và thiết lập luồng UDP P2P trực tiếp với Peer A.',
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
        'Để hai trình duyệt kết nối trực tiếp xuyên qua các lớp Router/Firewall, WebRTC thực thi quy trình bắt tay 4 giai đoạn chặt chẽ.',
      internalMechanismVi: [
        '1. Khởi tạo & Đàm phán SDP (Signaling): Peer A gọi createOffer() sinh bản mô tả năng lực codec/mã hóa (SDP Offer), lưu vào setLocalDescription() rồi gửi qua WebSocket Signaling Server cho Peer B. Peer B gọi setRemoteDescription(), tạo createAnswer() và gửi ngược về cho Peer A.',
        '2. Thu thập Tọa độ Mạng (ICE Gathering via STUN/TURN): Song song đó, ICE Agent trong trình duyệt hỏi STUN Server để lấy cặp IP:Port công cộng (srflx) và gửi từng ICE Candidate tìm được sang cho đối phương qua Signaling Server.',
        '3. Kiểm tra Kết nối & Xuyên lỗ UDP (ICE Connectivity Checks & UDP Hole Punching): Hai bên gửi các gói thăm dò STUN trực tiếp cho nhau để đục lỗ NAT và chọn cặp đường đi có độ trễ thấp nhất (Selected Candidate Pair).',
        '4. Bắt tay Bảo mật DTLS & Truyền Luồng P2P: Hai Peer xác thực chứng chỉ số khớp với mã băm a=fingerprint trong SDP, mở luồng SRTP (cho Video/Audio) và SCTP (cho RTCDataChannel) truyền thẳng giữa hai máy mà không còn đi qua Signaling Server nữa.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'Peer A → Signaling Server → Peer B',
        actionEn: 'SDP Offer & Answer Exchange',
        descriptionVi: 'Hai trình duyệt trao đổi bản mô tả phiên SDP (Codecs VP9/Opus, DTLS Fingerprint) qua kênh WebSocket.',
        payloadExample: `Signaling JSON: { "type": "offer", "sdp": "v=0\\r\\nm=video 9 UDP/TLS/RTP/SAVPF 96\\r\\na=rtpmap:96 VP9/90000..." }`,
      },
      {
        step: 2,
        actor: 'Peer A & B ⇄ STUN Server',
        actionEn: 'Gather ICE Candidates (NAT Discovery)',
        descriptionVi: 'Mỗi Peer hỏi STUN Server để khám phá địa chỉ IP Public/Port ánh xạ qua Router NAT của mình.',
        payloadExample: `a=candidate:842163049 1 udp 1677729535 203.113.148.22 54321 typ srflx raddr 192.168.1.10 rport 51002`,
      },
      {
        step: 3,
        actor: 'Peer A ⇄ Peer B (Direct UDP)',
        actionEn: 'ICE Connectivity Check & DTLS Handshake',
        descriptionVi: 'Đục lỗ UDP NAT thành công (UDP Hole Punching) và hoàn tất bắt tay khóa mã hóa DTLS-SRTP.',
        payloadExample: `[ICE] Selected Pair: 203.113.148.22:54321 <-> 118.70.12.99:60112 (STATE: connected, RTT: 14ms)`,
      },
      {
        step: 4,
        actor: 'Peer A ⇄ Peer B (P2P Stream)',
        actionEn: 'Direct P2P SRTP Media & SCTP DataChannel',
        descriptionVi: 'Truyền trực tiếp khung hình Video/Audio và gói tin RTCDataChannel ngang hàng không qua Server trung gian.',
        payloadExample: `P2P UDP Stream: [SRTP Video 1080p@60fps | 2.4 Mbps] + [SCTP DataChannel: {"cursorX":420,"cursorY":180}]`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Thiết lập Kết nối Ngang hàng Video & RTCDataChannel (P2P Telehealth & Collaboration)',
      scenarioDescriptionVi:
        'Cài đặt luồng bắt tay RTCPeerConnection tiêu chuẩn kết hợp STUN Server, xử lý ICE Candidates và mở kênh truyền dữ liệu P2P độ trễ thấp.',
      codeExamples: [
        {
          titleVi: 'Khởi tạo RTCPeerConnection, SDP Offer & RTCDataChannel (TypeScript)',
          language: 'typescript',
          descriptionVi:
            'Minh họa cách trình duyệt kết hợp WebSocket làm kênh báo hiệu (Signaling) để mở đường truyền P2P trực tiếp.',
          code: `const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Dự phòng TURN Server khi gặp tường lửa Symmetric NAT chặn P2P
    {
      urls: 'turn:turn.enterprise-lab.vn:3478',
      username: 'webrtc_user',
      credential: 'turn_secret_key'
    }
  ]
};

export async function startPeerConnection(signalingWs: WebSocket) {
  const pc = new RTCPeerConnection(rtcConfig);

  // 1. Tạo kênh dữ liệu P2P (RTCDataChannel) truyền qua SCTP/UDP
  const dataChannel = pc.createDataChannel('telemetry-sync', {
    ordered: false,       // Không chờ sắp xếp lại thứ tự để ưu tiên độ trễ thấp nhất
    maxRetransmits: 0     // Chế độ UDP thuần cho đồng bộ trạng thái thời gian thực
  });
  dataChannel.onopen = () => dataChannel.send(JSON.stringify({ ping: Date.now() }));

  // 2. Khi tìm thấy tọa độ mạng (ICE Candidate), gửi sang Peer kia qua Signaling
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      signalingWs.send(JSON.stringify({
        type: 'ice-candidate',
        candidate: event.candidate
      }));
    }
  };

  // 3. Tạo SDP Offer và gửi qua Signaling Server
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signalingWs.send(JSON.stringify({ type: 'sdp-offer', sdp: offer.sdp }));

  return pc;
}`,
          annotations: [
            {
              lineHint: 'iceServers: [stun:..., turn:...]',
              explanationVi:
                'Cung cấp STUN để tìm IP công cộng cho kết nối P2P trực tiếp, và TURN làm phương án dự phòng khi tường lửa chặn UDP trực tiếp.',
            },
            {
              lineHint: 'pc.createDataChannel("telemetry-sync", ...)',
              explanationVi:
                'Mở kênh truyền dữ liệu nhị phân/văn bản trực tiếp giữa 2 trình duyệt mà không đi qua máy chủ.',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Họp Trực tuyến, Khám bệnh Từ xa (Telehealth) & Livestream Độ trễ Dưới 1 Giây',
        industry: 'Telecommunications / Healthcare / EdTech',
        descriptionVi:
          'Gọi Video/Audio hai chiều và chia sẻ màn hình tương tác trực tiếp (như Google Meet, Discord Voice, Messenger Call).',
        whyItFitsVi:
          'Bộ xử lý âm thanh/hình ảnh tích hợp sẵn khả năng khử tiếng vọng (AEC), chống nhiễu và tự động điều chỉnh bitrate theo chất lượng mạng UDP.',
      },
      {
        titleVi: 'Chia sẻ Tệp tin P2P, Cloud Gaming & Đồng bộ Trạng thái Đa người chơi',
        industry: 'Gaming / P2P File Sharing / Collaborative Design',
        descriptionVi:
          'Truyền file dung lượng lớn trực tiếp giữa 2 máy tính trong mạng LAN/Internet hoặc stream khung hình từ máy chủ Cloud Gaming (GeForce Now, Parsec).',
        whyItFitsVi:
          'RTCDataChannel giải phóng hoàn toàn chi phí băng thông cho máy chủ trung tâm và loại bỏ hiện tượng nghẽn đầu hàng của TCP.',
      },
    ],
    WhenNotToUseVi: [
      'Các thao tác gọi API nghiệp vụ thông thường (Đăng nhập, Đặt hàng, Lưu cơ sở dữ liệu) — bắt buộc phải đi qua Backend Server bằng REST, GraphQL hoặc gRPC.',
      'Chat văn bản thông thường cần lưu lịch sử tập trung trên Server cho hàng ngàn người đọc lại (WebSocket phù hợp và đơn giản hơn nhiều).',
    ],
    advantages: [
      'Độ trễ thấp nhất trong mọi công nghệ Web nhờ đường truyền trực tiếp P2P và giao vận UDP (không bị TCP Head-of-Line Blocking).',
      'Tiết kiệm chi phí băng thông máy chủ khổng lồ khi truyền Video/File trực tiếp giữa các thiết bị người dùng.',
      'Tích hợp sẵn bộ engine xử lý đa phương tiện chuyên nghiệp (Opus, VP9/AV1, chống vọng âm, thích ứng băng thông) và mã hóa bắt buộc DTLS-SRTP.',
    ],
    limitations: [
      'Quy trình bắt tay phức tạp nhất: Bắt buộc phải dựng riêng Signaling Server (WebSocket), cấu hình STUN và duy trì cụm TURN Server tốn băng thông khi xuyên NAT thất bại.',
      'Mô hình P2P Mesh thuần túy không mở rộng được cho phòng họp đông người (> 6 người) nếu không triển khai thêm máy chủ điều phối SFU/MCU.',
      'Kết nối P2P trực tiếp sẽ làm lộ địa chỉ IP công cộng giữa hai Peer nếu không cấu hình chính sách chỉ đi qua TURN Relay (iceTransportPolicy: "relay").',
    ],
    relatedComparisons: [
      {
        comparedWith: 'WebSocket API',
        keyDifferenceVi:
          'WebSocket là kết nối Client ⇄ Server qua giao thức TCP (đảm bảo thứ tự tin nhắn nhưng trễ hơn khi rớt gói); WebRTC là kết nối Peer A ⇄ Peer B qua giao thức UDP (tối ưu cho Media Stream & P2P DataChannel độ trễ cực thấp).',
        whenToChooseThisVi:
          'Khi truyền luồng Video/Audio thời gian thực, chia sẻ màn hình, gọi thoại hoặc truyền file/tọa độ game P2P.',
        whenToChooseOtherVi:
          'Khi truyền tin nhắn chat, thông báo hệ thống hoặc bảng giá cần máy chủ trung tâm kiểm soát và điều phối qua TCP.',
      },
    ],
    misconceptions: [
      {
        mythVi: '“WebRTC là công nghệ P2P hoàn toàn nên không cần bất kỳ máy chủ (Server) nào để hoạt động.”',
        realityVi:
          'Sai! Dù luồng Video/Data chạy P2P, bạn vẫn bắt buộc phải có: (1) Signaling Server (thường dùng WebSocket) để hai bên trao đổi SDP ban đầu, (2) STUN Server để tìm IP công cộng, và (3) TURN Server để chuyển tiếp gói tin cho ~15–20% người dùng nằm sau tường lửa nghiêm ngặt.',
        technicalProofVi:
          'Đặc tả W3C WebRTC 1.0 quy định rõ RTCPeerConnection không thể khởi tạo kết nối nếu không được cung cấp SDP từ kênh Signaling bên ngoài.',
      },
    ],
  },
];
