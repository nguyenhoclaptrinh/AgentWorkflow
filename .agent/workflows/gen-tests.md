---
description: Tạo unit, E2E, security, và performance tests sử dụng qa-tester skill.
type: procedure
required_skills: [qa-tester]
inputs: ["Source Code", "Docs"]
outputs: ["Test Plan", "Test Cases", "Test Code"]
---

# Workflow Sinh Test (`/gen-tests`)

> [!IMPORTANT]
> **BẮT BUỘC**: Áp dụng `.agent/rules/documents.md` cho mọi việc tạo tài liệu và cấu trúc thư mục.
> **OUTPUT**: Test code phải chạy được (Green).

---

## Bước 1: Khám phá & Chiến lược

// turbo

1.  **Adopt `[qa-tester]` persona** để phân tích:
    -   Folder `docs/` và cấu trúc codebase.
    -   Xác định loại test cần sinh (Unit, E2E, Security, Performance).
2.  Xác định file/tính năng cụ thể cần test.

---

## Bước 2: Kế hoạch Test & Sinh Test Case

// turbo

1.  **Adopt `[qa-tester]` persona** để tạo Test Plan/Cases:
    -   Nhận diện edge cases, boundary conditions.
    -   Lưu vào `docs/035-QA/Test-Cases/TC-{Feature}-{NNN}.md`.
2.  **Verify**: Đảm bảo test case bao phủ đủ yêu cầu (Acceptance Criteria).

---

## Bước 3: Sinh Code Test

// turbo

1.  **Adopt `[qa-tester]` persona** để sinh code:
    -   Sử dụng framework test hiện có (Jest/Vitest/Playwright).
    -   Tạo file test tương ứng (VD: `__tests__/auth.test.ts`).
    -   **QUAN TRỌNG**: Mock đầy đủ các dependencies. Không để test unit phụ thuộc DB thật.

---

## Bước 4: Validation & Fix-Loop

// turbo

1.  **Auto-Run**:
    ```bash
    npm test path/to/new-test-file
    ```
2.  **Self-healing**:
    -   Nếu Fail -> Đọc lỗi -> Sửa code test -> Chạy lại.
    -   Lặp lại tối đa 3 lần.

3.  **Final Report**:
    -   Nếu Pass: Commit code.
    -   Nếu Fail: Báo cáo bug (hoặc lỗi workflow) cho user.
