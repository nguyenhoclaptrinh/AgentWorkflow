---
description: Điều phối việc triển khai tính năng từ đặc tả đến khi hoàn thành.
type: procedure
required_skills: [research, product-manager, lead-architect, backend-developer, frontend-developer, qa-tester]
inputs: ["docs/020-Requirements/PRD-*.md"]
outputs: ["Source Code", "QA Report", "Updated Specs"]
---

# Quy trình Triển khai Tính năng (`/implement-feature`)

> [!IMPORTANT]
> **BẮT BUỘC**: Đọc `.agent/rules/documents.md` trước khi tạo bất kỳ tài liệu nào.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng | Ví dụ |
| :--- | :--- | :--- |
| `sequential-thinking` | Quyết định phức tạp, debug, thiết kế kiến trúc | Chia nhỏ tính năng thành task |
| `context7_resolve-library-id` | Tìm ID thư viện trước khi tra cứu docs | "react hook form" |
| `context7_query-docs` | Nghiên cứu thư viện UI (shadcn, radix...) | |
| `search_web` | Nghiên cứu xu hướng thiết kế và UX patterns | "modern SaaS dashboard trends 2026" |
| `generate_image` | Tạo wireframe low-fi hoặc tài sản concept | |

---

## Bước 1: Nghiên cứu Chuyên sâu (Deep Research)

// turbo

> 💡 **BẮT BUỘC**: Tuân thủ `.agent/rules/research.md` để đảm bảo tính năng hiện đại.

1.  **Adopt `[researcher]` persona** để:
    -   Tìm các pattern hiệu quả/hiện đại nhất cho tính năng yêu cầu.
    -   Kiểm tra cập nhật mới nhất của các thư viện (Next.js, Prisma...).
    -   Xác định vấn đề scaling hoặc bảo mật tiềm ẩn.
2.  Cập nhật/Tạo tài liệu nghiên cứu trong `docs/050-Research/`.
3.  **CHỜ** user review nếu tìm thấy insight quan trọng.

---

## Bước 2: Đặc tả Nhanh (Optional)

**Bỏ qua nếu**: Đã có User Stories hoặc Specs trong `docs/`.

1.  **Adopt `[product-manager]` persona** để làm rõ yêu cầu.
2.  Tạo artifact `feature-spec.md` gồm: Goal, User, Acceptance Criteria.
3.  **CHỜ** user xác nhận.

---

## Bước 3: Định vị Artifacts Hiện có

// turbo

1.  Tìm kiếm trong `docs/` các tài liệu liên quan: User Stories, SDD, Designs.
2.  **Adopt `[lead-architect]` persona** để xác định phạm vi và dependencies.
3.  Liệt kê các file cần tạo/sửa.
4.  **CHỜ** user xác nhận phạm vi.

---

## Bước 4: Lên Kế hoạch Triển khai

// turbo

1.  **Adopt `[lead-architect]` persona** để chia nhỏ task.
2.  Tạo artifact `implementation-plan.md` với các task theo giai đoạn.
3.  Lưu vào `docs/050-Tasks/Task-{FeatureName}.md` sau khi approve.
4.  **CHỜ** user approve.

---

## Bước 5: Khởi tạo Branch

// turbo

1.  Sử dụng workflow **/git-branch** để tạo branch tính năng mới (`feature/...`).

---

## Bước 6: Implement Backend

// turbo

1.  **Adopt `[backend-developer]` persona** để:
    -   Data models/migrations.
    -   API endpoints/server functions.
    -   Unit tests (TDD).
2.  Chạy test và verify.
3.  Sử dụng **/git-commit** sau khi hoàn thành các milestone nhỏ.
4.  **CHỜ** user checkpoint.

---

## Bước 7: Implement Frontend

// turbo

1.  **Adopt `[frontend-developer]` persona** để:
    -   Components theo design specs.
    -   State management.
    -   Component tests.
2.  Sử dụng **/git-commit** sau khi hoàn thành các milestone nhỏ.
3.  **CHỜ** user checkpoint.

---

## Bước 8: Integration & QA

// turbo

1.  **Adopt `[qa-tester]` persona** để:
    -   Chạy E2E test.
    -   Verify Acceptance Criteria.
    -   Test Edge case.
2.  Tạo artifact `qa-report.md`.
3.  **CHỜ** user xác nhận sẵn sàng.

---

## Bước 9: Finalize

// turbo

1.  **Adopt `[lead-architect]` persona** để:
    -   Cập nhật các file MOC.
    -   Di chuyển task vào `docs/050-Tasks/Completed/`.
    -   Update API/changelog nếu cần.
2.  Trình bày tóm tắt hoàn thành.
3.  Nhắc user sử dụng **/git-pr** để tạo Pull Request.
