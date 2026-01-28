# Hướng dẫn Sử dụng Agent Workflows (System 2.0)

Tài liệu này tổng hợp và hướng dẫn sử dụng các quy trình làm việc (Workflows) của Agent trong dự án.

## 1. Giới thiệu & Kiến trúc System 2.0

Hệ thống Workflow được chia làm 2 loại chính:

1.  **Direct Executor (Người thực thi trực tiếp)**: Là các workflow cấp cao, nơi AI tự thực hiện toàn bộ vòng đời phát triển (Research -> Code -> Test) mà không cần giao việc cho agent khác.
    -   Ví dụ: `/code` (Tự động), `/cook` (Tương tác).
2.  **Procedure (Quy trình thực thi)**: Là các quy trình cụ thể, atomic, tập trung vào một nhiệm vụ duy nhất.
    -   Ví dụ: `/git-commit`, `/implement-feature`, `/hotfix`.

**Persona Binding**: Mỗi workflow đều được gắn metadata `required_skills` giúp AI biết cần **đóng vai trò (Persona)** gì (VD: `qa-tester`, `lead-architect`) để thực thi nhiệm vụ tốt nhất.

---

## 2. Git Workflows (Procedure)

Các workflow atomic tương tác với Git.

| Workflow | Lệnh gọi | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Cập nhật Code** | `/git-sync` | **MỚI**: Kéo code từ `dev`, rebase và xử lý conflict an toàn. | `git-sync` (trước khi start task) |
| **Tạo Branch** | `/git-branch` | Tạo branch mới (Có kiểm tra Dirty workspace). | `feature/login-page` |
| **Commit Code** | `/git-commit` | Commit chuẩn Conventional Commits (Có Self-Review). | `feat: thêm nút đăng nhập` |
| **Merge Code** | `/git-merge` | **Fast Track**: Merge feature vào dev với Safety Checks (Lint/Test). | `git-merge` (Solo/Small project) |
| **Tạo PR** | `/git-pr` | Tạo PR (Có kiểm tra Auth GitHub CLI). | PR: Login Feature |

---

## 3. Development Workflows

### A. Core Development
| Workflow | Loại | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `/development` | Procedure | Code task nhỏ. **Tự động Sync code và Retry nếu test lỗi.** | "Sửa lỗi typo", "Đổi màu button" |
| `/implement-feature` | Procedure | Triển khai tính năng trọn gói. **Có Gate chặn bắt buộc User duyệt.** | "Thêm module Thanh toán VNPAY" |
| `/code` | Direct Executor | Engine thực thi trọn gói. **Tự động sửa lỗi (Self-Healing) khi failed.** | "Refactor thư mục `utils`", "Viết test coverage 80%" |
| `/cook` | Interactive | Engine thực thi từng bước, cộng tác chặt chẽ với User. | "Cùng debug lỗi render React", "Hướng dẫn setup ENV" |

### B. Maintenance & Refactoring (Mới)
| Workflow | Loại | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `/hotfix` | Procedure | **Quy trình khẩn cấp**: Sửa lỗi Production, bypass research sâu, merge thẳng vào Main & Dev. | "Sửa gấp lỗi 500 khi checkout" |
| `/refactor` | Procedure | Chuyên dụng cho việc dọn dẹp code, không thay đổi logic, đảm bảo test pass. | "Tách hàm xử lý date ra file riêng" |

---

## 4. Planning & Analysis Workflows

| Workflow | Input | Output | Ví dụ |
| :--- | :--- | :--- | :--- |
| `/brainstorm` | Ý tưởng (Idea) | Roadmap, PRD | "Lên ý tưởng cho App nuôi heo" |
| `/plan` | Requirements | Plan & Tasks | "Lên plan chi tiết cho feature X" |
| `/research` | Topic/Câu hỏi | Báo cáo nghiên cứu sâu | "Tìm hiểu kiến trúc Microservices" |
| `/break-tasks` | PRD/Specs | Danh sách Task (Jira/Markdown) | "Chia nhỏ PRD module Kho thành task" |
| `/bootstrap` | Architecture Spec | Project Init, Config | "Khởi tạo dự án Next.js + NestJS" |
| `/update-docs` | Code Changes | Tài liệu đồng bộ | "Cập nhật API Doc sau khi code Auth" |

---

## 5. QA & Documentation Workflows

| Workflow | Vai trò (Persona) | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `/qa` | `qa-tester` | Lên kế hoạch test (Test Plans) và viết Test Cases. | "Lập Test Plan cho màn hình Login" |
| `/gen-tests` | `qa-tester` | Sinh code test tự động (Unit/E2E). **Có Auto-Run & Self-Healing.** | "Tạo unit test cho `AuthService`" |
| `/debug` | `tester`, `coder` | Quy trình debug khoa học (Giả thuyết -> Chứng minh -> Fix). | "Tìm nguyên nhân lỗi không lưu session" |
| `/documentation` | `architect` | Dịch ngược code ra tài liệu hoặc viết Specs từ PRD. | "Tạo API Doc cho `ProductController`" |
| `/ui-ux-design` | `designer` | Quy trình thiết kế, prototyping. | "Thiết kế UI Dashboard Admin" |

---

## 6. Review & Audit Workflows (Mới)

| Workflow | Input | Output | Ví dụ |
| :--- | :--- | :--- | :--- |
| `/code-review` | Diff/Branch | Review Comments | "Review PR login fix xem có lỗi gì không" |
| `/project-review` | Codebase | Audit Report | "Đánh giá lại toàn bộ kiến trúc và bảo mật" |
| `/review-docs` | Artifacts/Docs | Review Report | "Review logic plan này", "Check grammar file manual" |

---

## 7. Customization

### `/custom-behavior`
- **Mục đích**: Hỗ trợ user điều chỉnh Rules hoặc Workflows một cách an toàn.
- **Tính năng**: Tự động phân tích tác động (Impact Analysis) trước khi ghi đè file hệ thống.

---

## 8. Utility Workflows & Q&A

| Workflow | Input | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `/ask` | Câu hỏi | Hỏi đáp về Codebase/Kiến trúc. Không sửa code. Gợi ý workflow tiếp theo. | "Code flow của hàm `checkout` là gì?" |

---

## 9. Chiến lược Phát triển (Strategy Guide)

> [!IMPORTANT]
> **Checklist Trước khi Tác chiến**:
> 1. Kiểm tra `.agent/rules/` chưa?
> 2. Đã chạy Test chưa?

### Khi nào dùng Workflow nào? (Decision Matrix)

| Tình huống (Scenario) | Workflow | Chiến lược | Ví dụ thực tế |
| :--- | :--- | :--- | :--- |
| **Tôi có câu hỏi / Tôi không hiểu code** | `/ask` | **Research First**: Dùng AI để hiểu rõ trước khi hành động. | "Tại sao hàm `login` lại trả về 403?", "Giải thích architecture của module `Auth`." |
| **Fix bug nhỏ / Refactor / Task đơn giản** | `/development` | **Atomic Flow**: AI tự làm trọn gói (Code -> Test -> Verify). | "Sửa lỗi null pointer ở dòng 50 file `auth.service.ts`", "Đổi tên biến `user` thành `currentUser`." |
| **Tính năng mới / Logic phức tạp** | `/implement-feature` | **Full Flow**: Chia nhỏ task. User Review sau mỗi phase. | "Thêm tính năng đăng nhập bằng Google (OAuth2)", "Tạo API report doanh thu hàng tháng." |
| **Dự án con / Module lớn** | `/code` | **Direct Execution**: AI đóng vai trò Lead Dev, tự lên plan và thực thi. | "Migrate toàn bộ module `User` sang GraphQL", "Viết unit test cho toàn bộ `PaymentService`." |
| **Cần làm việc từng bước cùng AI** | `/cook` | **Interactive**: Cặp đôi hoàn hảo (Pair Programming). | "Hướng dẫn tôi setup môi trường dev mới", "Cùng tôi debug lỗi deadlock này." |

### Nguyên tắc Vàng
1.  **Atomic AI Flow (Task Nhỏ)**: Tin tưởng AI, nhưng luôn kiểm tra kết quả cuối cùng.
2.  **User Full Flow (Task Lớn)**: Đừng để AI đi quá xa mà không kiểm soát. Dùng các "Gate" (Review) để điều chỉnh hướng đi.
