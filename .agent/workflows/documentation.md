---
description: Tạo tài liệu toàn diện (Kiến trúc, API, Specs) từ Codebase hoặc Requirements.
type: procedure
required_skills: [lead-architect, backend-developer, devops-engineer, business-analysis]
inputs: ["Source Code", "PRD"]
outputs: ["docs/030-Specs/*"]
---

# Workflow Tài liệu (`/documentation`)

> [!IMPORTANT]
> **BẮT BUỘC**: Áp dụng `.agent/rules/documents.md` cho mọi hoạt động tạo tài liệu.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng |
| :--- | :--- |
| `sequential-thinking` | Phân tích kiến trúc phức tạp, quyết định thiết kế |
| `context7_query-docs` | Nghiên cứu pattern framework, cú pháp diagram |

---

## Bước 0: Xác định Chế độ (Mode)

**Xác định nguồn sự thật (source of truth):**

1.  **Từ Codebase (Mode A)**: Dịch ngược (Reverse engineer) tài liệu từ code hiện có.
2.  **Từ Requirements (Mode B)**: Thiết kế xuôi (Forward engineer) specs chi tiết (SDD, Stories) từ PRD/Roadmap.

---

# MODE A: Từ Codebase

## Bước A1: Khám phá Codebase

// turbo

> 💡 **MCP**: Sử dụng `sequential-thinking` để phân tích cấu trúc dự án lạ.

1.  **Gọi `[lead-architect]` skill** để phân tích cấu trúc codebase.
2.  Nhận diện: tech stack, entry points, API routes, DB schemas.
3.  **Làm rõ & Xác nhận**:
    -   **QUAN TRỌNG**: Nếu cấu trúc không rõ ràng, **HỎI** user ngay.
    -   Tóm tắt những gì tìm thấy và **CHỜ** user xác nhận hiểu đúng.

---

## Bước A2: Tài liệu Kỹ thuật (Kiến trúc, API, Schema)

// turbo

1.  **Gọi `[lead-architect]` skill** để tạo:
    -   System Context (C4 Context Diagram).
    -   Component View (C4 Component Diagram).
    -   **Sequence Diagrams** cho các luồng nghiệp vụ quan trọng.
2.  **Gọi `[backend-developer]` skill** để:
    -   Tài liệu API endpoints (phong cách OpenAPI/Swagger).
    -   Tạo ERD (Entity Relationship Diagram).
    -   Tài liệu các thuật toán chính hoặc pipeline xử lý dữ liệu.
3.  Lưu vào `docs/030-Specs/` và `docs/030-Specs/Architecture/`.

---

## Bước A3: Tài liệu Chức năng (Reverse Engineering)

// turbo

**Mục tiêu**: Suy ra logic nghiệp vụ và yêu cầu từ code đã triển khai.

1.  **Gọi `[business-analysis]` skill** để:
    -   Phân tích codebase (controllers, services, frontend views) để hiểu user flows.
    -   **Reverse Engineer** ra PRD/Functional Specs:
        -   Nhận diện Epics mức cao.
        -   Tài liệu User Stories & Acceptance Criteria ngầm hiểu.
        -   Tạo định nghĩa Use Case cho các tính năng chính.
2.  **Draft Artifacts**:
    -   `docs/020-Requirements/Reverse-Engineered-Specs.md`
    -   `docs/022-User-Stories/Implied-User-Stories.md`
3.  **Review**: Trình bày cho user để xác nhận khớp với thực tế nghiệp vụ.

---

## Bước A4: Tài liệu Vận hành & Chất lượng

// turbo

**Mục tiêu**: Tài liệu hóa cách chạy, test và deploy hệ thống.

1.  **Gọi `[devops-engineer]` skill** để tạo:
    -   **Infrastructure**: Tài nguyên cloud, Docker setup (`docs/030-Specs/Architecture/Infrastructure.md`).
    -   **Deployment**: CI/CD pipelines và quy trình release (`docs/030-Specs/Architecture/Deployment.md`).
    -   **Configuration**: Tham chiếu biến môi trường (`docs/030-Specs/Configuration.md`).
2.  **Gọi `[qa-tester]` skill** để tạo:
    -   **Test Strategy**: Tổng quan công cụ test và phương pháp (`docs/035-QA/Test-Plans/Strategy.md`).
    -   **Coverage Report**: Tóm tắt độ phủ test hiện tại và các khoảng trống (`docs/035-QA/Reports/Coverage.md`).
3.  **Gọi `[backend-developer]` skill** để tạo/cập nhật:
    -   **Onboarding**: `docs/060-Manuals/Admin-Guide/Setup-Guide.md` (Điều kiện cần, cài đặt, chạy local).
    -   **Scripts**: Tài liệu sử dụng `package.json` scripts (`docs/060-Manuals/Admin-Guide/Scripts.md`).

---

## Bước A5: Kế hoạch Dự án & Chiến lược

// turbo

**Mục tiêu**: Thiết lập chiến lược mức cao và roadmap dựa trên trạng thái hiện tại.

1.  **Gọi `[product-manager]` skill** để:
    -   **Phân tích độ trưởng thành**: Đánh giá tính năng hiện có so với chuẩn thị trường.
    -   **Reverse Engineer Roadmap**: Draft `docs/010-Planning/Roadmap.md` dựa trên tính năng đã có vs chưa có.
    -   **Định nghĩa Mục tiêu**: Draft `docs/010-Planning/OKRs.md` (Objectives and Key Results).
    -   **Báo cáo Trạng thái**: Tạo snapshot tiến độ hiện tại (`docs/010-Planning/Sprints/Current-Status.md`).
2.  **Review**: Trình bày các tài liệu chiến lược này cho user.

---

# MODE B: Từ Requirements

**Điều kiện tiên quyết**: Đã có PRD (từ `/brainstorm`).

## Bước B1: Tạo SDD (System Design Document)

// turbo

> 💡 **MCP**:
>
> - **PHẢI** dùng `sequential-thinking` cho các quyết định kiến trúc.
> - Dùng `context7` với `/vercel/next.js`, `/supabase/supabase` để nghiên cứu tech stack.

1.  **Phân tích Yêu cầu**: Review PRD/Roadmap. Nếu có mơ hồ, **HỎI** user làm rõ.
2.  **Gọi `[lead-architect]` skill** để draft:
    -   Kiến trúc hệ thống mức cao.
    -   Quyết định Tech stack.
    -   Component diagram.
    -   Tổng quan luồng dữ liệu.
3.  Tạo artifact `draft-sdd.md`.
4.  Sau khi approve → Lưu vào `docs/030-Specs/Architecture/SDD-{ProjectName}.md`.

---

## Bước B2: Tạo Epics & Use Cases

// turbo

1.  **Gọi `[business-analysis]` skill** để:
    -   Chia nhỏ tính năng PRD thành Epics (`docs/022-User-Stories/Epics/`).
    -   Định nghĩa Use Cases với Mermaid diagrams (`docs/020-Requirements/Use-Cases/`).
    -   **Note**: Nếu yêu cầu không rõ, hỏi thêm.
2.  Tạo artifacts để review trước khi lưu.

---

## Bước B3: Tạo User Stories

// turbo

1.  **Gọi `[business-analysis]` skill** để tạo:
    -   User Stories với Acceptance Criteria (`docs/022-User-Stories/Backlog/`).
    -   Ước lượng độ phức tạp.
2.  Tạo artifact `draft-user-stories.md`.
3.  Sau khi approve → Lưu.

---

## Bước B4: Tạo ADRs (Optional)

// turbo

**Bỏ qua nếu**: User không yêu cầu ADRs.

1.  **Gọi `[lead-architect]` skill** để tài liệu hóa các quyết định kỹ thuật.
2.  Lưu vào `docs/030-Specs/Architecture/ADR-{NNN}-{Decision}.md`.

---

# Finalize

## Bước X: Finalize

// turbo

1.  Tạo/cập nhật các file MOC.
2.  Validate wiki-links và frontmatter.
3.  Trình bày tóm tắt và gợi ý bước tiếp theo (`/ui-ux-design` hoặc `/implement-feature`).
