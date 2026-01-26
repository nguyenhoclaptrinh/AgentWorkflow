---
description: Workflow coding cơ bản để thực hiện thay đổi, sửa lỗi hoặc tính năng nhỏ.
---

# Quy trình Phát triển (`/development`)

> [!IMPORTANT]
> **BẮT BUỘC**: Luôn đọc `.agent/rules/documents.md` trước khi tạo hoặc sửa đổi tài liệu liên quan.

---

## Bước 1: Phân tích & Lên kế hoạch

// turbo

1.  Hiểu rõ yêu cầu hoặc báo cáo lỗi.
2.  **BẮT BUỘC** sử dụng `mcp_sequential-thinking_sequentialthinking` để:
    -   Phân tích cấu trúc code hiện tại.
    -   Thiết kế giải pháp.
    -   Xác định các edge cases và rủi ro tiềm ẩn.
3.  Nếu task phức tạp, tạo artifact `implementation_plan.md`.
4.  **CHỜ** user xác nhận nếu kế hoạch liên quan đến thay đổi kiến trúc lớn.

---

## Bước 2: Khởi tạo Branch

// turbo

1.  Sử dụng workflow **/git-branch** để tạo branch mới từ `dev`.
    -   Ví dụ: `fix/bug-login` hoặc `chore/update-deps`.

---

## Bước 3: Thực hiện Code

// turbo

1.  Thực hiện các thay đổi code theo kế hoạch.
2.  **Backend**: Cập nhật models, logic, APIs nếu cần.
3.  **Frontend**: Cập nhật UI components và state management.
4.  Đảm bảo code tuân thủ chuẩn clean code và linting của dự án.

---

## Bước 4: Kiểm thử & Xác minh

// turbo

1.  Chạy test hiện có để đảm bảo không có regressions.
2.  Thêm unit hoặc integration tests mới cho các thay đổi.
3.  Thực hiện verification thủ công (ví dụ: dùng browser tool để check UI).
4.  **BẮT BUỘC** ghi lại bằng chứng (proof of work) vào artifact `walkthrough.md` nếu thay đổi lớn.

---

## Bước 5: Commit & Finalize

// turbo

1.  Sử dụng workflow **/git-commit** để commit code (Tiếng Việt).
2.  Cập nhật tài liệu liên quan (MOCs, API specs, ...).
3.  Don dẹp file tạm.
4.  Báo cáo tóm tắt các thay đổi và kết quả verification.
