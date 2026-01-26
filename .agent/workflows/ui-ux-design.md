---
description: Chuyển đổi yêu cầu thành các thiết kế UI/UX toàn diện.
---

# Workflow Thiết kế UI/UX (`/ui-ux-design`)

> [!IMPORTANT]
> **BẮT BUỘC**: Áp dụng `.agent/rules/documents.md` cho cấu trúc tài liệu.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng |
| :--- | :--- |
| `context7_query-docs` | Nghiên cứu thư viện UI (shadcn, radix, tailwind) |
| `search_web` | Nghiên cứu xu hướng thiết kế và UX patterns |
| `generate_image` | Tạo wireframe low-fi hoặc tài sản concept |

---

## Bước 1: Nghiên cứu Chuyên sâu (Deep Research)

// turbo

> 💡 **BẮT BUỘC**: Tuân thủ `.agent/rules/research.md` để đảm bảo chất lượng hình ảnh và UX.

1.  **Gọi `[designer]` skill** và `search_web` để:
    -   Xác định xu hướng "Design of the Year" cho lĩnh vực cụ thể.
    -   Tìm các UX pattern sáng tạo (micro-interactions, navigation).
    -   Thu thập hình ảnh tham khảo/style cho mood board.
2.  Tạo `design-research.md` trong `docs/050-Research/`.
3.  **CHỜ** user approve định hướng sáng tạo.

---

## Bước 2: Khám phá & Context

// turbo

1.  **Gọi `[designer]` skill** để:
    -   Kiểm tra xem Design System đã có trong `docs/` chưa.
    -   Phân tích yêu cầu/PRD.
    -   xác định phạm vi thiết kế (Hệ thống mới vs Tính năng mới).
2.  **CHỜ** kết quả phân tích.

---

## Bước 3: Design System (Nếu cần)

// turbo

**Bỏ qua nếu**: Design system đã tồn tại.

> 💡 **MCP**: Sử dụng `context7` với `/tailwindcss/tailwindcss` hoặc `/shadcn/ui` để config.

1.  **Gọi `[designer]` skill** để định nghĩa:
    -   Typography, Colors, Spacing scale.
    -   Các thành phần cơ bản (Buttons, Inputs, Cards).
    -   Nguyên lý chuyển động (Motion).
2.  Tạo/Cập nhật tài liệu Design System.
3.  **CHỜ** user approve.

---

## Bước 4: Thiết kế Component & Flow

// turbo

1.  **Gọi `[designer]` skill** để:
    -   Vẽ user flows dựa trên User Stories.
    -   Định nghĩa các component cần thiết (Tái sử dụng vs Mới).
    -   Tạo specs cho component.
2.  Tạo tài liệu flow và component.
3.  **CHỜ** user review.

---

## Bước 5: Prototyping

// turbo

> 💡 **MCP**: Sử dụng `generate_image` để validate concept hình ảnh nếu cần.

1.  **Gọi `[frontend-developer]` skill** để:
    -   Xây dựng HTML/CSS prototypes trong `prototype/` (giữ đơn giản).
    -   Hoặc tạo mockups tương tác.
2.  **Gọi `[designer]` skill** để:
    -   Review khả năng tiếp cận (Accessibility - Tương phản, Semantic HTML).
    -   Kiểm tra tính nhất quán với Design System.

---

## Bước 6: Review & Bàn giao

// turbo

1.  Trình bày prototypes cho user.
2.  Thu thập và áp dụng feedback.
3.  Cập nhật file MOC và hoàn thiện tài liệu.
4.  **Bàn giao**: Kích hoạt `/implement-feature` nếu được approve.

---

## Quick Reference

| Bước | Skill | Output |
| :--- | :--- | :--- |
| 1 | designer | Design Research |
| 2 | designer | Scope analysis |
| 3 | designer | Design System docs |
| 4 | designer | Flow/Component docs |
| 5 | frontend-developer | HTML Prototypes |
