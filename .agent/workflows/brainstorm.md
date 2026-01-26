---
description: Phân tích ý tưởng cùng user và tạo các tài liệu sơ bộ mức cao (Roadmap, PRD).
---

# Workflow Brainstorm

> [!IMPORTANT]
> **BẮT BUỘC**: Đọc `.agent/rules/documents.md` trước khi tạo bất kỳ tài liệu nào.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng | Ví dụ |
| :--- | :--- | :--- |
| `sequential-thinking` | Phân tích yêu cầu, phụ thuộc tính năng, đánh đổi | Chia nhỏ request mơ hồ |
| `context7_resolve-library-id` | Tìm ID thư viện trước khi tra cứu | "mermaid js" |
| `context7_query-docs` | Nghiên cứu pattern, API thư viện, best practices | "How to setup auth in Next.js" |
| `search_web` | Nghiên cứu chủ động các pattern triển khai | "best architecture for agentic systems" |

---

## Bước 1: Nghiên cứu Chuyên sâu (Deep Research)

// turbo

> 💡 **BẮT BUỘC**: Tuân thủ `.agent/rules/research.md` trước khi bắt đầu lên ý tưởng.

1.  **Gọi `[research]`** (via `search_web` + `read_url_content`) để:
    -   Xác định 5-10 xu hướng chính trong domain dự án.
    -   Tìm các ví dụ "best-in-class" của sản phẩm tương tự.
    -   Nhận diện các cạm bẫy phổ biến và "Wow Factors" hiện đại.
2.  Tạo artifact `research-insights.md` trong `docs/050-Research/`.
3.  **CHỜ** user review kết quả nghiên cứu.

---

## Thứ tự Ưu tiên Tài liệu

```
Priority 0: Roadmap       ← Quy hoạch Dự án & Dòng thời gian
Priority 1: PRD           ← Tổng quan Chiến lược
```

---

## Bước 2: Làm rõ & Thấu hiểu

**Vai trò: Product Manager**

> [!NOTE]
> Bước này là **BẮT BUỘC**. KHÔNG ĐƯỢC đi tiếp nếu chưa có xác nhận của user.

> 💡 **MCP**: Sử dụng `sequential-thinking` để phân tích các yêu cầu mơ hồ hoặc phức tạp.

1.  **Gọi `[product-manager]` skill** để:
    -   Tóm tắt mức độ hiểu.
    -   Tạo câu hỏi làm rõ (clarification questions).
2.  Tạo artifact `clarification-questions.md`.
3.  **CHỜ** user review và xác nhận.

---

## Bước 3: Tạo Roadmap

// turbo

> 💡 **MCP**: Sử dụng `sequential-thinking` cho việc lên kế hoạch theo giai đoạn và đánh giá rủi ro.

1.  **Gọi `[product-manager]` skill** để soạn thảo:
    -   Timeline dự án và các cột mốc (milestones).
    -   Phân chia giai đoạn (MVP, v1.0, v2.0).
    -   Các deliverables chính theo từng giai đoạn.
2.  Tạo artifact `draft-roadmap.md`.
3.  Sau khi approve → Lưu vào `docs/010-Planning/Roadmap-{ProjectName}.md`.
4.  **CHỜ** phản hồi của user.

---

## Bước 4: Tạo PRD

// turbo

1.  **Gọi `[product-manager]` skill** để soạn thảo:
    -   Mục tiêu kinh doanh và chỉ số thành công.
    -   Đối tượng mục tiêu/User personas.
    -   Độ ưu tiên tính năng (MoSCoW).
2.  Tạo artifact `draft-prd.md`.
3.  Sau khi approve → Lưu vào `docs/020-Requirements/PRD-{ProjectName}.md`.
4.  **CHỜ** phản hồi của user.

---

## Bước 5: Chuyển tiếp sang Documentation

1.  Trình bày tóm tắt các artifact đã tạo (Roadmap, PRD).
2.  Đề xuất bước tiếp theo: Chạy `/documentation` để tạo đặc tả chi tiết (SDD, Epics, Stories).
