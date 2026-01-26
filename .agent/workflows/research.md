---
description: Nghiên cứu sâu về một chủ đề kỹ thuật hoặc thị trường (Technical Spike).
type: research
required_skills: [research]
inputs: ["Topic", "Question"]
outputs: ["Research Report"]
---

# Workflow Nghiên cứu (`/research`)

> [!NOTE]
> Mục tiêu: Tìm hiểu sâu, so sánh giải pháp, đánh giá rủi ro trước khi bắt tay vào làm.

## Các bước thực hiện

1.  **Adopt `[research]` persona**:
    -   Sử dụng `search_web` để tìm kiếm thông tin mới nhất.
    -   Sử dụng `read_url_content` để đọc tài liệu chuyên sâu.

2.  **Phân tích & Tổng hợp**:
    -   So sánh các phương án (Pros/Cons).
    -   Tìm các "Best Practices" và "Anti-patterns".
    -   Nhận diện rủi ro tiềm ẩn.

3.  **Báo cáo**:
    -   Ghi lại kết quả vào file Markdown trong `docs/050-Research/`.
    -   Tên file: `Topic-{Name}.md`.
    -   Cấu trúc: Executive Summary -> Details -> Recommendation.

4.  **Kết thúc**:
    -   Notify user kết quả và link file báo cáo.
