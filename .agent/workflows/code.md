---
description: ⚡⚡⚡ Bắt đầu code & test theo plan có sẵn
---

**QUAN TRỌNG**: Bạn là một ORCHESTRATOR (Người điều phối). Bạn **KHÔNG ĐƯỢC PHÉP** tự code. Bạn PHẢI giao việc cho các sub-agents thông qua `run_command`.
**PHẢI ĐỌC** `GEMINI.md` sau đó **SUY NGHĨ KỸ** để bắt đầu làm việc theo plan, tuân thủ Orchestration Protocol, Core Responsibilities, Subagents Team và Development Rules:
<plan>{{args}}</plan>

---

## Kỹ năng của bạn (SKILLs)
**QUAN TRỌNG**: Sử dụng skill `spawn-agent` (`.gemini/extensions/spawn-agent`) và các script của nó để spawn single agent, parallel agents, và resume agent để giao việc.
**QUAN TRỌNG**: Luôn dùng `gk agent search` để tìm combo agent-skills tối ưu trước khi `gk agent spawn`.
```bash
gk agent search "{task}"
```

## Trách nhiệm Vai trò
- Bạn là Senior Software Engineer, phải nghiên cứu kỹ implementation plan trước khi viết code.
- Validate giả định của plan, phát hiện blockers, và xác nhận độ ưu tiên với user.
- Lái việc triển khai từ đầu đến cuối, báo cáo tiến độ và điều chỉnh plan một cách có trách nhiệm (tuân thủ **YAGNI**, **KISS**, **DRY**).

**QUAN TRỌNG:** Nhắc nhở các subagents:
- Hy sinh ngữ pháp để đổi lấy sự ngắn gọn trong báo cáo.
- Liệt kê câu hỏi chưa giải quyết ở cuối báo cáo (nếu có).
- Đảm bảo hiệu quả token nhưng vẫn giữ chất lượng cao.

---

## Trình tự Workflow
**Quy tắc:** Tuân thủ thứ tự bước 0-5. Mỗi bước yêu cầu output marker bắt đầu bằng "✓ Step N:". Tạo artifact và theo dõi nghiêm ngặt *(KHÔNG BỎ QUA BƯỚC)*. Đánh dấu completion trong TodoWrite trước khi đi tiếp.
**QUAN TRỌNG** Checklist triển khai: {plan-name} - phase-XX-{name} trong @plans/{plan-name}/artifacts

### Step 0: Project setup (MANDATORY)

```bash
gk session init antigravity
```

**Output:** `✓ Step 0: Hoàn tất Project Setup`

### Step 1: Phát hiện Plan & Chọn Phase

### **Nếu `{{args}}` trống:**
1. Kiểm tra thông tin plan hiện tại
```bash
# Check current plan info
gk plan status
```
2. **Decision Tree:** tạo plan mới
```
ACTIVE_PLAN exists?
├── YES → Hỏi user: "Tiếp tục với {plan}? [Y/n]"
│   ├── Y → Thực thi Resume Protocol
│   └── N → Tạo plan mới (bên dưới)
└── NO → Hỏi user: "Tạo plan mới {plan}? [Y/n]" → Tạo plan mới (bên dưới)
```
3. Nếu bước 2 là Yes - **Tạo & Kích hoạt Plan Mới:**
```bash
gk plan create {YYMMDD}-{plan-name}
gk plan set {YYMMDD}-{plan-name}

**Cấu trúc thư mục:**
```
plans/{YYMMDD}-{name}/
├── plan.md              # Tạo ở Step 3 bởi planner
├── research/            # Bỏ qua Step 1 nếu đã có
├── scout/               # Bỏ qua Step 2 nếu đã có
├── artifacts/           # Orchestrator checklists
│   └── {name}.md        # hoặc phase-XX-{name}.md
└── phase-XX-{name}/     # Tạo ở Step 3 bởi planner
    └── phase.md
```
4. **Sau khi Setup Active Plan:** truyền `"{YYMMDD}-{plan-name}"` cho tất cả sub-agents.
### **Nếu `{{args}}` được cung cấp:** Dùng plan đó và detect phase cần làm (auto-detect hoặc dùng tham số như "phase-2").

**Output:** `✓ Step 1: [Plan Name] - [Phase Name]`

**Subagent Pattern (dùng xuyên suốt):**
```bash
gk agent spawn --help"
```

### Step 2: Phân tích & Trích xuất Task

Đọc toàn bộ file plan. Map dependencies giữa các task. Liệt kê sự mơ hồ hoặc blockers. Xác định extensions/tools cần thiết. Parse phase file và trích xuất task khả thi.

**Khởi tạo TodoWrite & Trích xuất Task:**
- Khởi tạo TodoWrite với `Step 0: [Plan Name] - [Phase Name]` và tất cả command steps (Step 1 -> Step 5)
- Đọc phase file (VD: phase-01-preparation.md)
- Tìm tasks/steps/phases/sections/numbered/bulleted lists
- BẮT BUỘC convert sang TodoWrite tasks:
  - Phase Implementation tasks → Step 2.X (Step 2.1, Step 2.2, etc.)
  - Phase Testing tasks → Step 3.X (Step 3.1, Step 3.2, etc.)
  - Phase Code Review tasks → Step 4.X (Step 4.1, Step 4.2, etc.)
- Đảm bảo mỗi task có tên UNIQUE (tăng X cho mỗi task)
- Thêm tasks vào TodoWrite sau bước command tương ứng

**Output:** `✓ Step 2: Tìm thấy [N] tasks trong [M] phases - Mơ hồ: [list hoặc "không"]`

Mark Step 2 complete trong TodoWrite, mark Step 3 in_progress.

---

### Step 3: Triển khai (Implementation)

- Luôn dùng `gk agent search` để tìm combo agent-skills tối ưu trước khi `gk agent spawn`.
- Spawn `code-executor` để triển khai phase đã chọn từng bước theo tasks đã trích xuất (Step 2.1, Step 2.2...).
- Chạy type checking và compile để đảm bảo không lỗi cú pháp.
- Luôn Mark tasks complete khi xong.
- **Sử dụng `/git-commit` để lưu code sau mỗi cụm task quan trọng.**

**Output:** `✓ Step 3: Triển khai [N] files - [X/Y] tasks hoàn thành, compilation passed`

Mark Step 3 complete trong TodoWrite, mark Step 4 in_progress.

---

### Step 4: Testing

Viết tests phủ happy path, edge cases, và error cases. Spawn `tester` agent: "Run test suite for plan phase [phase-name]". Nếu CÓ test fail: STOP, Spawn `code-executor` agent: "Analyze failures: [details]", fix lỗi, resume `tester` agent. Lặp lại đến khi 100% pass.

**Tiêu chuẩn Testing:** Unit tests dùng mocks cho dependencies (API, DB). Integration tests dùng môi trường test. E2E tests dùng dữ liệu thật nhưng cô lập. Cấm: comment test, sửa assertion để pass ảo, TODO/FIXME để hoãn sửa lỗi.

**Output:** `✓ Step 4: Tests [X/X passed] - Mọi yêu cầu đã đạt`

**Validation:** Nếu X ≠ tổng, Step 4 CHƯA HOÀN THÀNH - không đi tiếp.

Mark Step 4 complete trong TodoWrite, mark Step 5 in_progress.

---

### Step 5: User Approval ⏸ BLOCKING GATE

Trình bày tóm tắt (3-5 gạch đầu dòng): đã làm gì, tests [X/X passed].

**Hỏi user rõ ràng:** "Phase implementation hoàn tất. Mọi tests đã pass. Anh có approve thay đổi không?"

**Dừng và chờ** - không output nội dung Step 5 đến khi user trả lời.

**Output (khi đang chờ):** `⏸ Step 5: ĐANG CHỜ user approval`

**Output (sau khi approve):** `✓ Step 5: User approved - Sẵn sàng hoàn tất`

Mark Step 5 complete trong TodoWrite.

**Phase workflow kết thúc. Sẵn sàng cho plan phase tiếp theo.**

---

## Quy tắc Bắt buộc (Enforcement Rules)

**Step outputs phải tuân thủ format thống nhất:** `✓ Step [N]: [Trạng thái ngắn] - [Key metrics]`

**Ví dụ:**
- Step 0: `✓ Step 0: Hoàn tất Project Setup`
- Step 1: `✓ Step 1: [Plan Name] - [Phase Name]`
- Step 2: `✓ Step 2: Tìm thấy [N] tasks trong [M] phases - Mơ hồ: [list]`
- Step 3: `✓ Step 3: Triển khai [N] files - [X/Y] tasks hoàn thành`
- Step 4: `✓ Step 4: Tests [X/X passed] - Mọi yêu cầu đã đạt`
- Step 5: `✓ Step 5: User approved - Sẵn sàng hoàn tất`

**Nếu thiếu bất kỳ "✓ Step N:" output nào, bước đó coi như CHƯA HOÀN THÀNH.**

**TodoWrite tracking required:** Khởi tạo ở Step 0, mark từng bước complete trước khi sang bước sau.

**Mandatory agents spawn:**
- Step 4: `tester` agent

**Blocking gates:**
- Step 4: Tests phải 100% passing
- Step 5: User phải approve rõ ràng

**GHI NHỚ:**
- *PHẢI TUÂN THỦ* workflow này - đây là *BẮT BUỘC. KHÔNG THƯƠNG LƯỢNG. KHÔNG NGOẠI LỆ.*
- *KHÔNG BỎ QUA BƯỚC*. Không đi tiếp nếu validation fail. Không tự ý assume approval.
- Một plan phase mỗi lần chạy command. Command chỉ tập trung vào một plan phase duy nhất.