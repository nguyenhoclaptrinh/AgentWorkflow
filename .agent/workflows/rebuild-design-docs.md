---
description: Phân tích code và tài liệu hiện có để tái tạo toàn bộ tài liệu thiết kế phần mềm mới, nhất quán, có tính hệ thống, phục vụ onboarding, review kiến trúc và mở rộng dự án.
---

## Mục tiêu
Chuẩn hóa lại toàn bộ tài liệu thiết kế dự án bằng cách tạo một bộ tài liệu mới, tách biệt, phản ánh đúng hiện trạng và định hướng tương lai.

---

## Bước 1: Phân tích hiện trạng
- Quét cấu trúc thư mục project
- Xác định các module chính
- Đọc code ở mức kiến trúc (không đi quá chi tiết implementation)
- Đọc tài liệu hiện có để phát hiện:
  - Mâu thuẫn
  - Nội dung lỗi thời
  - Phần thiếu hoặc không rõ ràng

---

## Bước 2: Xác định nguồn thông tin
- KHÔNG coi code là source of truth duy nhất
- Tổng hợp thông tin từ:
  - Code
  - Tài liệu cũ
  - Cấu trúc project
  - Naming, flow, pattern thể hiện gián tiếp
- Nếu thiếu thông tin:
  - Đánh dấu "Giả định / TODO"
  - Hoặc đề xuất hướng thiết kế hợp lý

---

## Bước 3: Đề xuất cấu trúc tài liệu mới
- Tạo thư mục mới: /docs/design-v2
- Không chỉnh sửa tài liệu cũ
- Mỗi loại tài liệu là 1 file markdown riêng
- Không trùng lặp nội dung giữa các file

---

## Bước 4: Tạo danh sách file
Bắt buộc bao gồm:
- 00-overview.md
- 01-architecture.md
- 02-module-design.md
- 03-api-design.md
- 04-database-design.md
- 05-business-flow.md
- 06-non-functional.md
- 07-assumptions-and-limits.md

---

## Bước 5: Viết nội dung chi tiết
Mỗi file phải có:
- Mục đích
- Phạm vi
- Nội dung chính
- Viết rõ ràng, có hệ thống, dễ đọc cho dev mới
- Ưu tiên kiến trúc và tư duy thiết kế, không sa đà code

---

## Tiêu chí hoàn thành
- Dev mới đọc tài liệu có thể hiểu hệ thống mà không cần đọc code
- Có thể dùng để review kiến trúc hoặc audit
- Là nền tảng để refactor hoặc mở rộng dự án trong tương lai

---

## Quy tắc
- Không suy đoán nghiệp vụ nếu không có bằng chứng
- Nếu thiếu thông tin → ghi rõ
- Luôn phản hồi bằng tiếng Việt
