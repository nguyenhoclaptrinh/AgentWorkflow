---
description: Đồng bộ tài liệu kỹ thuật sau khi code thay đổi (giảm nợ tài liệu).
type: procedure
required_skills: [lead-architect, backend-developer]
inputs: ["Feature Name", "Branch"]
outputs: ["Updated Docs"]
---

# Workflow Cập nhật Tài liệu (`/update-docs`)

> [!IMPORTANT]
> **Khi nào dùng**: Sau khi merge PR hoặc hoàn thành một feature lớn.

## Các bước thực hiện

1.  **Scan Code Changes**:
    -   Đọc các file code đã thay đổi (via `git diff` hoặc user input).

2.  **Identify Docs**:
    -   Xác định các file tài liệu bị ảnh hưởng (PRD, Specs, API Docs, MOCs).

3.  **Adopt `[lead-architect]` persona** để Update:
    -   Cập nhật `docs/030-Specs/` để phản ánh implementation thực tế.
    -   Cập nhật sơ đồ (nếu có).
    -   Đánh dấu trạng thái "Implemented" hoặc "Done" trong PRD/Task list.

4.  **Verify**:
    -   Đảm bảo không còn thông tin lỗi thời (outdated) gây hiểu nhầm.

5.  **Commit**:
    -   Dùng `/git-commit` với type `docs: update documentation for...`.
