# AGENT.md — Context & Handover Notes for AI Agents

Tài liệu này lưu lại toàn bộ quyết định kỹ thuật, trạng thái hiện tại của dự án, lưu ý môi trường và quy tắc làm việc của user. **Mọi session mới phải đọc file này trước khi code và cập nhật lại sau mỗi thay đổi quan trọng.**

---

## 1. Quy tắc làm việc bắt buộc (Workflow Rules)
1. **Commit theo từng feature / bugfix nhỏ:** Không đợi hết cả Phase mới commit. Mỗi khi thêm một feature nhỏ hoặc sửa lỗi xong và pass test là tạo commit ngay. Commit message chỉ viết **1 dòng cực ngắn gọn** theo chuẩn `<type>/<short-summary>` (ví dụ: `feat/add logging`, `fix/auth timeout`, `refactor/dry base agent`).
2. **Báo nội dung commit trước khi `git push`:** Luôn hiển thị rõ commit message (và danh sách file chính) cho user xem trước khi đẩy lên remote (`origin/main`).
3. **Cập nhật `AGENT.md`:** Sau mỗi phần hoàn thành hoặc khi có quyết định/lưu ý mới, cập nhật ngay vào file này (kèm commit hash, các file chính, kết quả test/benchmark) để session sau nắm được đầy đủ context.
4. **Quản lý package & môi trường:**
   - **Node.js / TypeScript:** Sử dụng cố định `npm` (Node v24.18.0, npm v11.16.0).
   - **Python (nếu có):** Luôn dùng `uv` (`uv add`, `uv sync`, `.venv/Scripts/python.exe` hoặc `uv run`), không dùng `pip` trực tiếp.
5. **Tiêu chuẩn chất lượng Code & Kiểm thử (Code Quality & Verification):**
   - **DRY & Explicit Types:** Không lặp lại logic khởi tạo/cấu hình dùng chung. Định kiểu tường minh (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`), không dùng `any`.
   - **Config tập trung:** Mọi cấu hình hệ thống, phân loại kỹ thuật, thông số mô phỏng đặt tại `src/config/site.ts`.
   - **Kiểm tra trước khi báo hoàn thành:** Luôn chạy full test suite (`npm test` với Vitest), typecheck (`npm run typecheck`) và production build (`npm run build`) sạch sẽ trước khi commit hoặc báo cáo hoàn tất.

---

## 2. Quyết định kiến trúc & Công nghệ (Key Decisions)

- **Mục tiêu dự án:** Nền tảng học tập kỹ thuật tương tác (**API Visual Lab — Interactive API Learning Platform**) giảng dạy lý thuyết, kiến trúc, luồng gói tin và mô phỏng thực hành cho 7 công nghệ/đặc tả API: **REST API, SOAP API, GraphQL API, gRPC API, WebSocket API, Webhook, và OpenAPI Specification** bằng tiếng Việt (giữ nguyên thuật ngữ kỹ thuật tiếng Anh).
- **Core Stack & Framework:**
  - **Next.js 15 (App Router)** + **React 19** + **TypeScript 5.7 (Strict Mode)**.
  - **Tailwind CSS 3.4** + **Lucide React** (giao diện kỹ thuật Engineering Dark Blueprint).
  - **Vitest 3** cho Unit & Simulation Engine Testing.
- **Kiến trúc tách biệt (Separation of Concerns):**
  - `src/types/api.ts`: Hệ thống kiểu dữ liệu tường minh cho Requests, Responses, Lifecycle Steps, Diagram Nodes/Edges, Learning Modules, Scenarios, Comparisons, Quizzes.
  - `src/config/site.ts`: Cấu hình tập trung và bảng phân loại bản chất kỹ thuật (Technical Classification) của 7 chủ đề.
  - `src/simulations/engines.ts`: Bộ máy mô phỏng cục bộ tất định (Deterministic Local Simulation Engines) hoàn toàn tách biệt khỏi UI components.
  - `src/data/`: Nội dung học thuật chuyên sâu (`fundamentals.ts`, `modulesPart1.ts`, `modulesPart2.ts`, `modules.ts`, `scenarios.ts`, `comparison.ts`, `quizzes.ts`).
- **GitHub Remote:** `https://github.com/ankhanh67/API_lab.git` (nhánh chính: `main`).

---

## 3. Lưu ý môi trường (Environment Quirks)

- **OS & Sandbox Quirks:**
  - Trong Windows Sandbox, lệnh `npm install` cần kết nối mạng ra registry nên chạy với `BypassSandbox: true`. Các lệnh `npm run typecheck`, `npm test`, `npm run build` chạy trực tiếp trong sandbox bình thường.
  - Với `esbuild` trên npm 11, đã chạy `node node_modules/esbuild/install.js` để kích hoạt binary cho Vitest.

---

## 4. Trạng thái tiến độ (Progress Log)

- **[x] Phase 1 — Foundation, Design System, Landing Page & API Fundamentals** (Commit `f1472c8` — `feat/init foundation and fundamentals`):
  - Khởi tạo dự án Next.js + Strict TypeScript + Tailwind CSS + Vitest.
  - Xây dựng `src/types/api.ts`, `src/config/site.ts`, `Navbar`, `Footer`, Landing Page (`src/app/page.tsx`) với bộ mô phỏng App-to-App Telemetry & bảng phân loại kỹ thuật, cùng trang API Fundamentals (`src/app/fundamentals/page.tsx`) với sơ đồ tương tác 7 chặng vòng đời API.
  - Kết quả kiểm thử: `3/3 tests pass, typecheck sạch`.

- **[x] Phase 2 & Phase 3 — 7 API Learning Modules, 7 Dedicated Playgrounds & Interactive API Laboratory** (Commit `b5c9faf` — `feat/add 7 api modules and interactive lab`):
  - Xây dựng đầy đủ 7 chuyên đề học tập (`/modules/rest`, `/modules/soap`, `/modules/graphql`, `/modules/grpc`, `/modules/websocket`, `/modules/webhook`, `/modules/openapi`) với đủ 12 phần học thuật mỗi chuyên đề.
  - Xây dựng `src/simulations/engines.ts` và `src/components/playgrounds/DedicatedPlaygrounds.tsx` cung cấp 7 Playground tương tác chuyên biệt + trang Phòng thí nghiệm trung tâm (`src/app/lab/page.tsx`) với Universal 8-Step Request/Response Simulator (Start/Pause/Resume/Reset/Step + Fault Injection).
  - Kết quả kiểm thử: `10/10 tests pass, typecheck sạch`.

- **[x] Phase 4 & Phase 5 — Real-World Scenario Lab, Comparison Center, Knowledge Assessment & Verification**:
  - **Real-World Scenario Lab (`/scenarios`):** 6 kịch bản kiến trúc thực tế (E-Commerce, Real-Time Chat, Microservices gRPC, Data Aggregation GraphQL, Enterprise Banking SOAP, Contract-First OpenAPI) kèm mô phỏng luồng gói tin đa nút.
  - **Comparison Center (`/comparison`):** Ma trận đối chiếu 9 chiều kỹ thuật, Sơ đồ Kiến trúc Cộng sinh 7 công nghệ (Coexistence Blueprint) và Công cụ Tư vấn Ra quyết định chọn công nghệ.
  - **Knowledge Assessment (`/assessment`):** Hệ thống kiểm tra 3 dạng câu hỏi (Multiple Choice, Technical Understanding, Scenario-Based) với chấm điểm và giải thích tức thì.
  - **Verification:** `13/13 Vitest tests pass`, `tsc --noEmit` 0 lỗi, `next build` thành công toàn bộ routes.
