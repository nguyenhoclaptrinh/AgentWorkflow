---
description: Review nhanh các thay đổi trước khi merge (Diff Review).
type: procedure
required_skills: [lead-architect, backend-developer, security-specialist]
inputs: ["Git Diff", "Branch Name", "PR"]
outputs: ["Review Comments", "Approval/Rejection"]
---

# Workflow Code Review (`/code-review`)

> [!IMPORTANT]
> **TIÊU CHÍ**: Clean Code, Security, Performance, và Tuân thủ Rules.

---

## Bước 1: Diff & Context Analysis

// turbo

1.  **Lấy Diff**:
    -   Nếu review local: `git diff dev...HEAD` (hoặc branch hiện tại).
    -   Nếu review file: `read_file`.
2.  **Adopt `[lead-architect]`**:
    -   Đánh giá sự phù hợp với cấu trúc dự án.
    -   Phát hiện "Smell Code" (Hàm quá dài, biến đặt tên sai standard, logic lặp).

---

## Bước 2: Deep Dive (Logic & Security)

// turbo

1.  **Adopt `[backend-developer]` (hoặc Frontend)**:
    -   Kiểm tra logic nghiệp vụ.
    -   Edge cases: Null safety, try-catch sót.
2.  **Adopt `[security-specialist]`**:
    -   Quét lỗi bảo mật: SQLi, XSS, lộ secrets.
    -   Kiểm tra permission/auth check.

---

## Bước 3: Report & Verdict

1.  **Tổng hợp Comments**:
    -   Phân loại: `[CRITICAL]`, `[MAJOR]`, `[MINOR]`, `[NITPICK]`.
2.  **Đề xuất**:
    -   Reject: Nếu có lỗi Critical/Major.
    -   Approve: Nếu chỉ có Minor/Nitpick (hoặc không lỗi).
3.  **Action**: Notify kết quả review cho user.
