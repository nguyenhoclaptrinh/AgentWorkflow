---
description: Workflow coding cơ bản để thực hiện thay đổi, sửa lỗi hoặc tính năng nhỏ.
type: procedure
required_skills: [backend-developer, frontend-developer]
inputs: ["Bug Report", "Small Task"]
outputs: ["Committed Code"]
---

# Quy trình Phát triển (`/development`)

> [!IMPORTANT]
> **BẮT BUỘC**: Luôn đọc `.agent/rules/documents.md` trước khi tạo hoặc sửa đổi tài liệu liên quan.

---

## Bước 1: Đồng bộ & Phân tích

// turbo

1.  **Sync Code**: Chạy workflow `/git-sync` để đảm bảo code mới nhất.
2.  Hiểu rõ yêu cầu hoặc báo cáo lỗi.
3.  **BẮT BUỘC** sử dụng `mcp_sequential-thinking_sequentialthinking` để phân tích tác động.

---

## Bước 2: Khởi tạo Branch

// turbo

1.  Sử dụng workflow **/git-branch** để tạo branch mới.
    -   Ví dụ: `fix/bug-login` hoặc `chore/update-deps`.

---

## Bước 3: Thực hiện Code

// turbo

1.  Thực hiện thay đổi code.
2.  **Backend/Frontend**: Cập nhật logic/UI.
3.  Đảm bảo tuân thủ Clean Code.

---

## Bước 4: Kiểm thử & Tự sửa (Fix-Loop)

// turbo

1.  Chạy test liên quan.
2.  **Self-Correction**:
    - Nếu Test Fail -> **Đọc lỗi** -> **Sửa code** -> **Chạy lại**.
    - Lặp lại tối đa 3 lần. Nếu vẫn fail -> Dừng và báo cáo User.
3.  Verification thủ công (nếu cần).
4.  Ghi lại bằng chứng vào `walkthrough.md`.

---

## Bước 5: Commit & Finalize

// turbo

1.  Sử dụng workflow **/git-commit** để commit code (Tiếng Việt).
2.  Cập nhật tài liệu liên quan (MOCs, API specs, ...).
3.  Don dẹp file tạm.
4.  Báo cáo tóm tắt các thay đổi và kết quả verification.
