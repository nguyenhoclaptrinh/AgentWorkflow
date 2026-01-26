---
description: Tạo unit, E2E, security, và performance tests sử dụng qa-tester skill.
---

# Workflow Sinh Test (`/gen-tests`)

> [!IMPORTANT]
> **BẮT BUỘC**: Áp dụng `.agent/rules/documents.md` cho mọi việc tạo tài liệu và cấu trúc thư mục. Mọi tài liệu QA PHẢI được lưu dưới `docs/035-QA/`.

---

## Bước 1: Khám phá & Chiến lược

// turbo

1.  **Gọi `[qa-tester]` skill** để phân tích folder `docs/` và cấu trúc codebase hiện tại.
2.  Hỏi user loại test họ muốn sinh ra:
    -   **Unit Tests**: Cho hàm hoặc utility cụ thể (VD: `tests/unit/`).
    -   **E2E Tests**: Cho luồng người dùng (VD: `tests/e2e/`).
    -   **Security Tests**: Đánh giá lỗ hổng bảo mật.
    -   **Performance Tests**: Kiểm tra tải và độ phản hồi.
3.  Xác định file hoặc tính năng cụ thể cần test dựa trên input của user.

---

## Bước 2: Kế hoạch Test & Sinh Test Case

// turbo

1.  **Gọi `[qa-tester]` skill** để tạo/cập nhật Test Plan và Test Cases:
    -   Với **Unit Tests**: Nhận diện edge cases, điều kiện biên, và happy paths.
    -   Với **E2E Tests**: luồng hợp lệ/không hợp lệ.
    -   Với **Security**: điểm injection tiềm năng, lỗi auth.
2.  Tạo tài liệu test trong `docs/035-QA/Test-Cases/` theo chuẩn tên `TC-{Feature}-{NNN}.md`.
3.  Tạo artifact `draft-test-docs.md` với các test case đề xuất để review.

---

## Bước 3: Sinh Code Test

1.  **Chờ** user approve các test case.
2.  **Gọi `[qa-tester]` skill** để sinh code test thực tế.
    -   Sử dụng framework test hiện có của dự án (VD: Jest, Playwright, Vitest).
    -   Đảm bảo mocks và stubs được triển khai đúng cho unit tests.
    -   Đảm bảo selectors và các bước tương tác ổn định cho E2E tests.
3.  Lưu code test đã sinh vào thư mục phù hợp (VD: `tests/unit/`, `tests/e2e/`).

---

## Bước 4: Verification & Báo cáo

1.  Chạy các test vừa tạo bằng test runner của dự án.
2.  Nếu test fail:
    -   Phân tích lỗi.
    -   **Gọi `[qa-tester]` skill** để sửa code test hoặc báo bug nếu là lỗi thật.
3.  **Bắt buộc**:
    -   Cập nhật `docs/035-QA/QA-MOC.md`.
    -   Cập nhật `docs/000-Index.md` nếu cần.
