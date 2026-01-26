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

1.  **Gọi `[qa-tester]` skill** để phân tích folder `docs/`.
2.  Nhận diện tính năng, ràng buộc và business logic cần test.
3.  Lên bản đồ:
    -   Happy Paths (Golden Flows)
    -   Negative Paths (Xử lý lỗi)
    -   Boundary Cases
    -   Cân nhắc về Security/Performance
4.  **CHỜ** user xác nhận danh sách kịch bản (scenarios) cần làm tài liệu.

---

## Bước 2: Soạn thảo Tài liệu Test

// turbo

1.  **Gọi `[qa-tester]` skill** để tạo:
    -   **Test Plan**: Chiến lược mức cao cho release/feature hiện tại (`docs/035-QA/Test-Plans/`).
    -   **Test Cases**: Chi tiết từng bước (`docs/035-QA/Test-Cases/`).
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
