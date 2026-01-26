---
description: Chuyển đổi yêu cầu thành các thiết kế UI/UX toàn diện.
type: procedure
required_skills: [designer, frontend-developer]
inputs: ["User Stories", "PRD"]
outputs: ["Design System", "Flows", "Prototypes"]
---

# Workflow Thiết kế UI/UX (`/ui-ux-design`)

> [!IMPORTANT]
> **BẮT BUỘC**: Tuân thủ `.agent/rules/nano-banana.md` khi generate ảnh.

---

## Bước 1: Nghiên cứu & Concept

// turbo

1.  **Adopt `[designer]` persona** để:
    -   Nghiên cứu UX Trends via `search_web`.
    -   Xác định Moodboard & Style.
    -   Quyết định Design System (Shadcn/Tailwind/Custom).

---

## Bước 2: Thiết kế Flow & Wireframe

// turbo

1.  **Adopt `[designer]` persona** để:
    -   Vẽ User Flows (text-based hoặc mermaid).
    -   Mô tả cấu trúc Layout.
    -   **Generate Assets**: Dùng `generate_image` để tạo concept art/icons nếu cần.

---

## Bước 3: Prototyping (Code-First)

// turbo

1.  **Adopt `[frontend-developer]` persona** để:
    -   Dựng khung HTML/CSS nhanh (Low-fi prototype).
    -   Sử dụng các component thư viện có sẵn để tiết kiệm thời gian.

---

## Bước 4: Review

1.  Trình bày Design/Prototype cho user.
2.  **Action**: Gọi `notify_user` để xin feedback.
