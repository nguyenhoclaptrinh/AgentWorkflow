---
description: Workflow để tùy chỉnh Rule/Workflow an toàn, có phân tích tác động và xác nhận của user.
type: procedure
required_skills: [rules-workflows]
inputs: ["User Requirement", "Existing Rules"]
outputs: ["Updated Rule/Workflow"]
---

# Workflow Tùy chỉnh Hành vi (Custom Behavior)

## Hướng dẫn sử dụng công cụ

| Tool | Khi nào dùng | Ví dụ |
| :--- | :--- | :--- |
| `find_by_name` | Bước 1: Tìm xem rule/workflow đã tồn tại chưa | `Pattern="*security*", SearchDirectory=".agent/rules"` |
| `view_file` | Bước 2: Đọc nội dung hiện tại để so sánh | `AbsolutePath="/.../.agent/rules/security.md"` |
| `notify_user` | Bước 3: Trình bày phân tích và hỏi xác nhận | `Message="Em tìm thấy rule cũ. Anh có muốn ghi đè không?"` |
| `write_to_file` | Bước 4: Tạo hoặc ghi đè file | `Overwrite=true` |

---

## Bước 1: Nhận diện & Tìm kiếm

// turbo

> 💡 **Tip**: Đừng đoán là file không tồn tại. Luôn tìm kiếm trước.

1.  Phân tích yêu cầu của user để xác định _ý định_ (VD: "Thêm linting chặt hơn", "Bỏ qua test khi deploy").
2.  Tìm kiếm Rule hoặc Workflow hiện có có thể liên quan.
    -   Rules: tìm trong `.agent/rules/`
    -   Workflows: tìm trong `.agent/workflows/`

---

## Bước 2: Phân tích Tác động

> 💡 **Tip**: Nếu file tồn tại, PHẢI đọc và so sánh với yêu cầu.

**Tình huống A: Mục tiêu CHƯA tồn tại:**

1.  Kiểm tra xem có template nào trong `.agent/assets/` hoặc `references/` dùng làm base được không.
2.  Draft nội dung mới trong bộ nhớ.

**Tình huống B: Mục tiêu ĐÃ tồn tại:**

1.  **Đọc** nội dung hiện tại của file.
2.  **So sánh** yêu cầu của User vs Nội dung hiện tại.
3.  **Nhận diện Xung đột**:
    -   Việc này có phá vỡ ràng buộc hiện có không?
    -   Đây là "Breaking Change" hay chỉ là "Enhancement"?
4.  **Đưa ra Khuyến nghị**:
    -   _Thích ứng_: "Em đề xuất tạo file mới `custom-X.md` để tránh phá vỡ chuẩn X."
    -   _Ghi đè_: "Việc này khớp nhu cầu của anh, nhưng sẽ bỏ qua bước kiểm tra an toàn Y."

---

## Bước 3: User Xác nhận

> 💡 **Tip**: Phải nói rõ những gì sẽ thay đổi.

1.  **Thông báo User** tóm tắt phân tích.
    -   Nếu **Mới**: "Em sẽ tạo rule mới [filename] để [làm X]."
    -   Nếu **Sửa đổi**: "Em sẽ sửa [filename]. \n**Hiện tại**: [Tóm tắt cũ]\n**Đề xuất**: [Tóm tắt mới]\n**Tác động**: [Cảnh báo side effects]"
2.  **CHỜ** user approve.

---

## Bước 4: Thực thi

1.  Thực hiện thao tác file (`write_to_file` hoặc `replace_file_content`).
2.  **Validate**: Đọc lại file để đảm bảo đúng cú pháp (Markdown/YAML frontmatter).
3.  **Đăng ký**: Nếu là rule, nhắc user xem họ có cần kích hoạt thủ công không (trừ khi là `always_on`).

---

## Bước 5: Verification

1.  Kiểm tra xem tùy chỉnh có hoạt động như mong đợi không (nếu được, chạy dry-run hoặc nhờ user test).
