---
description: Điều phối việc chia nhỏ yêu cầu thành các task khả thi để triển khai.
type: procedure
required_skills: [business-analysis, lead-architect]
inputs: ["PRD", "User Stories", "SDD"]
outputs: ["docs/050-Tasks/Task-*.md", "task.md"]
---

# Workflow Chia nhỏ Task (`/break-tasks`)

> [!IMPORTANT]
> **BẮT BUỘC**: Tuân thủ `.agent/rules/documents.md` cho mọi tài liệu liên quan đến task.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng |
| :--- | :--- |
| `sequential-thinking` | **BẮT BUỘC** để chia nhỏ yêu cầu thành các atomic tasks |
| `context7_query-docs` | Để check best practices cho các công nghệ cụ thể |

---

## Bước 1: Xác định Tài liệu Nguồn

1.  Xác định tài liệu nguồn (PRD, User Story, Feature Spec, hoặc SDD).
2.  Nếu có nhiều phiên bản, hỏi user để làm rõ.
3.  Các folder liên quan cần check:
    -   `docs/020-Requirements/`
    -   `docs/022-User-Stories/`
    -   `docs/030-Specs/`

---

## Bước 2: Phân tích Yêu cầu

// turbo

1.  **Gọi `[business-analysis]` skill** để trích xuất các tính năng chính và acceptance criteria.
2.  Sử dụng `sequential-thinking` để:
    -   Nhận diện các phụ thuộc kỹ thuật (dependencies).
    -   Tách biệt yêu cầu backend, frontend, và QA.
    -   Phát hiện các chi tiết mơ hồ hoặc thiếu sót.
3.  Liệt kê các câu hỏi cần làm rõ cho user.
4.  **CHỜ** user giải đáp nếu cần.

---

## Bước 3: Phân rã Atomic Task

// turbo

> 💡 **MCP**: **PHẢI** dùng `sequential-thinking` ở đây để đảm bảo task nhỏ và dễ quản lý (atomic).

1.  **Gọi `[lead-architect]` skill** để tạo danh sách task có cấu trúc.
2.  Nhóm task theo component hoặc giai đoạn (VD: Database, API, Logic, UI, Testing).
3.  Với mỗi task, bao gồm:
    -   Mục tiêu/Mô tả.
    -   Acceptance Criteria.
    -   Độ phức tạp ước tính (nếu áp dụng).
4.  Tạo artifact `task-breakdown.md` đại diện cho trình tự đề xuất.

---

## Bước 4: Hoàn tất Tài liệu Task

// turbo

1.  Sau khi user approve `task-breakdown.md`:
2.  Cập nhật `task.md` của session hiện tại hoặc tạo file task mới trong `docs/050-Tasks/`.
3.  Nếu tạo file mới, tuân thủ naming: `docs/050-Tasks/Task-{FeatureName}.md`.
4.  Cập nhật `docs/050-Tasks/Tasks-MOC.md`.
5.  Trình bày danh sách task cuối cùng cho user.

---

## Quick Reference

| Vai trò | Skill | Trách nhiệm |
| :--- | :--- | :--- |
| Product Manager | `product-manager` | Validation yêu cầu & ưu tiên |
| Lead Architect | `lead-architect` | Phân rã kỹ thuật & dependencies |
| Developer | `backend-developer` | Backend/API tasks |
| Frontend Developer | `frontend-developer` | UI/UX tasks |
| QA Tester | `qa-tester` | Verification & Edge case tasks |
