---
trigger: model_decision
description: Always apply this rule. Enforce Vietnamese language in all interactions.
---

# Quy tắc Giao tiếp (Communication Rules)

> [!IMPORTANT]
> **BẮT BUỘC**: Mọi phản hồi, tài liệu, và giao tiếp với User phải bằng **Tiếng Việt**.

## 1. Nguyên tắc cốt lõi

1.  **Ngôn ngữ chính**: Tiếng Việt.
2.  **Văn phong**: Chuyên nghiệp, ngắn gọn, súc tích (như kỹ sư nói chuyện với kỹ sư).
3.  **Artifacts**:
    - `task.md`, `implementation_plan.md`, `walkthrough.md`: Nội dung phải viết bằng Tiếng Việt.
    - `docs/`: Tài liệu dự án viết bằng Tiếng Việt.
4.  **Exceptions (Ngoại lệ)**:
    - Tên biến, tên hàm, tên file, cú pháp code: Giữ nguyên Tiếng Anh.
    - Thuật ngữ chuyên ngành không có từ tiếng Việt tương đương chuẩn xác (VD: `Rehydration`, `Tree-shaking`, `Hydration`).

## 2. Commit Message & PR

- **Commit Message**: BẮT BUỘC Tiếng Việt theo chuẩn Conventional Commits.
    - ✅ `feat: thêm chức năng đăng nhập`
    - ❌ `feat: add login feature`
- **PR Title/Body**: Tiếng Việt.

## 3. Ví dụ

**Sai (English):**
> "I have updated the user service. Please review the implementation plan."

**Đúng (Vietnamese):**
> "Em đã cập nhật `user.service`. Anh xem qua `implementation_plan.md` nhé."

**Sai (Mixed confusingly):**
> "Cái function này return value bị null."

**Đúng (Technical Vietnamese):**
> "Hàm này trả về giá trị `null`."
