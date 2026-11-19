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
  // MODULE 7: OPENAPI SPECIFICATION
  // ==========================================================================
  {
    id: 'openapi',
    order: 7,
    name: 'OpenAPI Specification',
    taglineVi:
      'Tiêu chuẩn đặc tả hợp đồng REST API độc lập ngôn ngữ (YAML/JSON) phục vụ sinh tài liệu tương tác, kiểm tra hợp lệ và sinh mã nguồn tự động.',
    technicalNature: 'API Description Specification',
    technicalNatureVi: 'Đặc tả mô tả cấu trúc & hợp đồng API (API Description Specification)',
    accentColor: '#06B6D4',
    badgeClass: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300',
    borderClass: 'border-cyan-500/40',
    glowClass: 'shadow-cyan-950/50',
    introduction: {
      hookVi:
        'Lưu ý kỹ thuật cực kỳ quan trọng: OpenAPI KHÔNG phải là một giao thức truyền thông mạng như HTTP hay WebSocket, và bản thân nó KHÔNG tự gửi hay nhận dữ liệu. OpenAPI là bản thiết kế (Blueprint) chuẩn hóa dùng để mô tả một REST API.',
      problemSolvedVi:
        'Khi một dự án có hàng chục REST Endpoints, nếu viết tài liệu bằng file Word hay Wiki thủ công thì chỉ sau vài tuần sửa code, tài liệu sẽ lệch hoàn toàn so với thực tế (Documentation Drift), khiến đội Frontend và Mobile gọi sai tham số liên tục.',
      historicalContextVi:
        'Khởi nguồn từ dự án Swagger năm 2010, sau đó được hiến tặng cho Linux Foundation năm 2015 và đổi tên chính thức thành OpenAPI Specification (OAS 3.0 / 3.1).',
      coexistenceNoteVi:
        'OpenAPI là mảnh ghép đồng hành hoàn hảo của REST API. Một file openapi.yaml duy nhất vừa sinh ra trang tài liệu Swagger UI, vừa dùng để cấu hình API Gateway kiểm tra Request tự động, vừa sinh ra TypeScript/Python Client SDK.',
    },
    coreConcepts: [
      {
        termEn: 'OpenAPI Document (YAML / JSON Blueprint)',
        titleVi: 'Tài liệu Đặc tả OpenAPI (Hợp đồng Máy đọc được)',
        summaryVi:
          'Một tệp văn bản theo chuẩn YAML hoặc JSON mô tả toàn diện một REST API: máy chủ đích (servers), danh sách đường dẫn (paths), định nghĩa kiểu dữ liệu (components/schemas) và cơ chế bảo mật.',
        deepDiveVi:
          'Vì máy tính có thể đọc và phân tích cú pháp file này, toàn bộ quy trình kiểm thử, sinh tài liệu và sinh code có thể tự động hóa 100% trong CI/CD.',
      },
      {
        termEn: 'Paths, Operations & Parameters',
        titleVi: 'Đường dẫn (Paths), Thao tác (Operations) & Tham số (Parameters)',
        summaryVi:
          'Mục paths liệt kê từng URI (ví dụ: /students, /students/{id}); bên dưới mỗi URI là các Operations tương ứng với HTTP Methods (get, post, put, delete) cùng danh sách tham số (path, query, header).',
        deepDiveVi:
          'Mỗi tham số đều được khai báo rõ kiểu dữ liệu (string, integer), có bắt buộc hay không (required: true/false) và ràng buộc giá trị.',
        codeSnippet: `paths:
  /students/{id}:
    get:
      summary: Tra cứu sinh viên theo mã ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string`,
      },
      {
        termEn: 'Request Bodies, Responses & Reusable Components',
        titleVi: 'Cấu trúc Request Body, Responses & Tái sử dụng Schemas',
        summaryVi:
          'Thay vì lặp lại cấu trúc đối tượng Sinh viên ở khắp nơi, OpenAPI cho phép định nghĩa một lần trong components.schemas.Student rồi tham chiếu lại bằng từ khóa $ref.',
        deepDiveVi:
          'Mục responses quy định rõ với mỗi mã HTTP Status Code (200, 201, 400, 404), cấu trúc JSON trả về sẽ tuân theo Schema nào.',
      },
      {
        termEn: 'Security Schemes',
        titleVi: 'Khai báo Cơ chế Bảo mật (Security Schemes)',
        summaryVi:
          'Mô tả rõ API yêu cầu xác thực bằng Bearer JWT, API Key trong Header hay OAuth 2.0 để người dùng và công cụ sinh code tự động đính kèm đúng chuẩn.',
        deepDiveVi:
          'Có thể áp dụng bảo mật ở cấp toàn cục (Global Security) hoặc ghi đè riêng cho từng Endpoint cụ thể.',
      },
      {
        termEn: 'OpenAPI vs Swagger (Swagger UI & Swagger Editor)',
        titleVi: 'Phân biệt OpenAPI Specification và Hệ công cụ Swagger',
        summaryVi:
          'OpenAPI là bản thân quy chuẩn đặc tả (Specification); còn Swagger là tên bộ công cụ làm việc với đặc tả đó (Swagger Editor để soạn thảo, Swagger UI để hiển thị trang tài liệu tương tác, Swagger Codegen để sinh SDK).',
        deepDiveVi:
          'Hiểu ngắn gọn: OpenAPI giống như chuẩn ngôn ngữ HTML5, còn Swagger UI giống như trình duyệt hiển thị file HTML đó.',
      },
    ],
    architecture: {
      summaryVi:
        'Kiến trúc "Một hợp đồng — Nhiều đầu ra tự động": OpenAPI Specification (YAML/JSON) → Interactive Documentation (Swagger UI) + API Gateway Request Validation + Client SDK Generation + Server Stub Generation.',
      nodes: [
        {
          id: 'oa-spec',
          label: 'OpenAPI 3.0 Document',
          sublabel: 'openapi.yaml / .json',
          role: 'contract',
          descriptionVi: 'Nguồn chân lý duy nhất (Single Source of Truth) mô tả toàn bộ REST API.',
          techDetails: 'OpenAPI Specification 3.0/3.1',
        },
        {
          id: 'oa-docs',
          label: 'Interactive Documentation',
          sublabel: 'Swagger UI / Redoc',
          role: 'client',
          descriptionVi: 'Tự động dựng giao diện tài liệu trực quan cho phép lập trình viên đọc và thử nghiệm.',
          techDetails: 'Auto-rendered HTML Docs',
        },
        {
          id: 'oa-validator',
          label: 'Request / Response Validator',
          sublabel: 'API Gateway Middleware',
          role: 'gateway',
          descriptionVi: 'Tự động chặn mọi HTTP Request gửi sai kiểu dữ liệu so với file đặc tả.',
          techDetails: 'Runtime Schema Guard',
        },
        {
          id: 'oa-codegen',
          label: 'SDK & Server Stub Generator',
          sublabel: 'TypeScript / Python / Go',
          role: 'server',
          descriptionVi: 'Tự động sinh hàm gọi API định kiểu mạnh cho Frontend và khung Controller cho Backend.',
          techDetails: 'OpenAPI Generator CLI',
        },
      ],
      edges: [
        {
          id: 'o1',
          from: 'oa-spec',
          to: 'oa-docs',
          label: 'Render Live Portal',
          protocol: 'Doc Engine',
        },
        {
          id: 'o2',
          from: 'oa-spec',
          to: 'oa-validator',
          label: 'Enforce Contract Rules',
          protocol: 'JSON Schema Validation',
        },
        {
          id: 'o3',
          from: 'oa-spec',
          to: 'oa-codegen',
          label: 'Compile Typed Clients & Stubs',
          protocol: 'AST Codegen',
        },
      ],
    },
    howItWorks: {
      overviewVi:
        'OpenAPI hỗ trợ hai quy trình phát triển phần mềm hiện đại: Design-First (Viết file OpenAPI trước rồi sinh khung code cho Frontend/Backend làm song song) hoặc Code-First (Viết code Backend có gắn Annotations để tự động xuất ra file OpenAPI).',
      internalMechanismVi: [
        '1. Định nghĩa Hợp đồng: Khai báo thông tin phiên bản, Paths (/students, /students/{id}), Parameters và Components/Schemas.',
        '2. Kiểm tra Cú pháp & Lược đồ (Linting): Công cụ phân tích kiểm tra các tham chiếu $ref và tính hợp lệ của tài liệu.',
        '3. Sinh Tài liệu & SDK: Trình biên dịch đọc cây JSON/YAML của OpenAPI để dựng giao diện Swagger UI và xuất mã nguồn Client SDK.',
        '4. Giám sát Runtime: API Gateway đối chiếu gói tin HTTP thực tế với Schema trong file OpenAPI.',
      ],
    },
    communicationFlow: [
      {
        step: 1,
        actor: 'API Architect',
        actionEn: 'Author openapi.json / openapi.yaml',
        descriptionVi: 'Thiết kế đặc tả cho 4 Endpoints quản lý sinh viên (/students và /students/{id}).',
        payloadExample: `"openapi": "3.0.3", "paths": { "/students": { "get": ..., "post": ... } }`,
      },
      {
        step: 2,
        actor: 'Documentation Engine (Swagger UI)',
        actionEn: 'Parse Spec & Render Interactive UI',
        descriptionVi: 'Đọc file đặc tả và tự động hiển thị danh sách Endpoints, bảng tham số và mẫu Response.',
        payloadExample: `Rendered Endpoints: GET /students | POST /students | GET /students/{id} | PUT /students/{id}`,
      },
      {
        step: 3,
        actor: 'Codegen Engine',
        actionEn: 'Generate Typed Client SDK',
        descriptionVi: 'Tự động sinh các hàm TypeScript Fetch có kiểm tra kiểu dữ liệu cho đội Frontend.',
        payloadExample: `export async function getStudents(params: GetStudentsQuery): Promise<Student[]>`,
      },
      {
        step: 4,
        actor: 'API Gateway Validator',
        actionEn: 'Validate Incoming HTTP Requests',
        descriptionVi: 'Đảm bảo mọi request thực tế gửi tới REST Server đều tuân thủ đúng Schema đã cam kết.',
        payloadExample: `[OPENAPI-GUARD] Incoming POST /students matches CreateStudentSchema -> Allowed.`,
      },
    ],
    practicalExample: {
      scenarioTitleVi: 'Đặc tả Hệ thống Quản lý Sinh viên (Student Management REST API Specification)',
      scenarioDescriptionVi:
        'Sử dụng một tài liệu OpenAPI 3.0 duy nhất để mô tả đầy đủ 4 Endpoints: GET /students, GET /students/{id}, POST /students và PUT /students/{id}.',
      codeExamples: [
        {
          titleVi: 'Đặc tả OpenAPI 3.0 cho Student Management API (YAML)',
          language: 'yaml',
          descriptionVi:
            'Minh họa cách kết hợp Paths, Parameters, RequestBody, Responses và tái sử dụng Schema với $ref.',
          code: `openapi: 3.0.3
info:
  title: Student Management REST API
  version: 1.2.0
paths:
  /students:
    get:
      summary: Lấy danh sách sinh viên
      parameters:
        - name: department
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Danh sách sinh viên
    post:
      summary: Tạo hồ sơ sinh viên mới
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StudentInput'
      responses:
        '201':
          description: Đã tạo thành công
  /students/{id}:
    get:
      summary: Xem chi tiết sinh viên theo ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Thông tin chi tiết sinh viên
    put:
      summary: Cập nhật hồ sơ sinh viên
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Đã cập nhật
components:
  schemas:
    StudentInput:
      type: object
      required: [fullName, email, major]
      properties:
        fullName:
          type: string
        email:
          type: string
        major:
          type: string`,
          annotations: [
            {
              lineHint: '$ref: "#/components/schemas/StudentInput"',
              explanationVi:
                'Tham chiếu tới Schema dùng chung ở cuối file giúp tránh lặp lại định nghĩa đối tượng ở nhiều Endpoints.',
            },
            {
              lineHint: 'in: path / in: query',
              explanationVi:
                'Phân biệt rõ tham số nào nằm trên đường dẫn URI ({id}) và tham số nào nằm trên chuỗi truy vấn (?department=...).',
            },
          ],
        },
      ],
    },
    useCases: [
      {
        titleVi: 'Phát triển Song song Frontend & Backend (Contract-First Development)',
        industry: 'Software Engineering Teams',
        descriptionVi:
          'Thống nhất file OpenAPI ngay từ đầu Sprint để Frontend sinh Mock Server & TypeScript SDK làm việc ngay mà không cần đợi Backend code xong.',
        whyItFitsVi:
          'Loại bỏ điểm nghẽn chờ đợi và xung đột tên trường giữa các nhóm.',
      },
      {
        titleVi: 'Cổng Tài liệu Nhà phát triển (Developer Portal) & Kiểm thử Tự động',
        industry: 'Fintech / Open Banking / SaaS',
        descriptionVi:
          'Xuất bản cổng tài liệu API tương tác luôn đồng bộ 100% với mã nguồn thực tế.',
        whyItFitsVi:
          'Một file đặc tả duy nhất phục vụ cả hiển thị tài liệu, kiểm thử hợp đồng (Contract Testing) và cấu hình Firewall/Gateway.',
      },
    ],
    WhenNotToUseVi: [
      'Khi bạn cần mô tả các hệ thống hướng sự kiện qua Kafka/RabbitMQ/WebSocket (khi đó nên dùng chuẩn anh em của nó là AsyncAPI Specification).',
      'Khi hệ thống sử dụng GraphQL hoặc gRPC (vì GraphQL đã có sẵn SDL Schema và gRPC đã có sẵn file .proto).',
    ],
    advantages: [
      'Chuẩn công nghiệp toàn cầu cho việc mô tả và chuẩn hóa REST API.',
      'Tự động hóa việc sinh tài liệu tương tác, Client SDK cho hàng chục ngôn ngữ và Mock Server.',
      'Giúp phát hiện sớm các thay đổi gây lỗi tương thích ngược (Breaking Changes) trong quy trình CI/CD.',
    ],
    limitations: [
      'File YAML/JSON có thể trở nên rất dài nếu viết thủ công cho hệ thống có hàng trăm Endpoints mà không tách module ($ref).',
      'Chỉ mô tả các API dựa trên HTTP/REST, không thay thế cho đặc tả nhị phân của gRPC hay luồng sự kiện Message Broker.',
    ],
    relatedComparisons: [
      {
        comparedWith: 'WSDL (của SOAP) & .proto (của gRPC)',
        keyDifferenceVi:
          'OpenAPI đóng vai trò hợp đồng đặc tả cho REST/JSON giống như cách WSDL mô tả cho SOAP/XML và file .proto mô tả cho gRPC.',
        whenToChooseThisVi:
          'Khi kiến trúc của bạn sử dụng RESTful HTTP APIs.',
        whenToChooseOtherVi:
          'Khi sử dụng gRPC (.proto) hoặc SOAP (WSDL).',
      },
    ],
    misconceptions: [
      {
        mythVi: '“OpenAPI là một loại giao thức API cạnh tranh với REST hoặc WebSocket.”',
        realityVi:
          'OpenAPI hoàn toàn không phải là giao thức truyền dữ liệu. Nó là ngôn ngữ đặc tả dùng để viết bản thiết kế cho REST API.',
        technicalProofVi:
          'Bạn không thể "gửi một gói tin bằng giao thức OpenAPI"; bạn gửi gói tin bằng HTTP theo kiến trúc REST đã được mô tả trong file OpenAPI.',
      },
    ],
  },
];
