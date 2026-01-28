---
description: Hỏi đáp về Codebase, Kiến trúc, hoặc Kiến thức chung.
---

# Quy trình Hỏi đáp (`/ask`)

> [!NOTE]
> Workflow này KHÔNG thay đổi code hoặc tài liệ. Nó chỉ phân tích và trả lời câu hỏi.

## Bước 1: Phân tích Câu hỏi

1.  Xác định phạm vi câu hỏi (Codebase, Kiến trúc, hay General Knowledge).
2.  Nếu câu hỏi liên quan đến code cụ thể, xác định các file liên quan.

## Bước 2: Tìm kiếm Context (Tự động)

1.  Sử dụng `grep_search` hoặc `find_by_name` để tìm file liên quan.
2.  Đọc nội dung file quan trọng (nếu cần).

## Bước 3: Trả lời

1.  Tổng hợp thông tin.
2.  Trả lời câu hỏi một cách "Trung thực tàn nhẫn" (như Development Rules).
3.  Nếu phát hiện vấn đề trong code, chỉ ra nguyên nhân và gợi ý cách sửa.

## Bước 4: Đề xuất Hành động

1.  Gợi ý workflow tiếp theo phù hợp.
    -   Ví dụ: "Để sửa lỗi này, bạn nên dùng `/development`."
    -   Ví dụ: "Để thêm tính năng này, hãy dùng `/implement-feature`."