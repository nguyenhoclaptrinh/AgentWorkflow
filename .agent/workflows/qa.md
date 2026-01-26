---
description: Tạo tài liệu test case và test plan toàn diện dựa trên yêu cầu dự án.
type: procedure
required_skills: [qa-tester]
inputs: ["Requirements Docs", "Source Code"]
outputs: ["Test Plan", "Test Cases"]
---

# Workflow QA (`/qa`)

> [!IMPORTANT]
> **BẮT BUỘC**: Áp dụng `.agent/rules/documents.md` cho mọi việc tạo tài liệu và cấu trúc thư mục. Mọi tài liệu QA PHẢI được lưu dưới `docs/035-QA/`.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng |
| :--- | :--- |
| `sequential-thinking` | Phân tích logic ứng dụng phức tạp và edge cases |
| `context7_query-docs` | Nghiên cứu framework testing hoặc best practices |

---

## Bước 1: Khám phá Yêu cầu

// turbo

1.  **Adopt `[qa-tester]` persona** để:
    -   Phân tích folder `docs/`.
    -   Đề xuất Test Plan (`docs/035-QA/Test-Plans/`).
    -   Viết Test Cases (`docs/035-QA/Test-Cases/`).
2.  Tuân thủ mapping trong `.agent/rules/documents.md`:
    -   Tên Test Plan: `MTP-{Name}.md`
    -   Tên Test Case: `TC-{Feature}-{NNN}.md`
3.  Tạo artifact `draft-qa-docs.md` để review.

---

## Bước 3: Hoàn tất và Tổ chức

// turbo

1.  Sau khi approve, lưu tất cả file vào folder tương ứng trong `docs/035-QA/`.
2.  **Bắt buộc**:
    -   Cập nhật `docs/035-QA/QA-MOC.md`.
    -   Cập nhật `docs/000-Index.md` nếu cần.
    -   Đảm bảo frontmatter (id, type, status, created) đúng chuẩn `.agent/rules/documents.md`.
3.  Trình bày tóm tắt các test đã tạo.
