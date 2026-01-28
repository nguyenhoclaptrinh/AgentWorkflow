---
description: quy trinh thuc hien task theo chuan cong nghiep: lap ke hoach, tao branch cho tung module, code tung phan nho, commit ro rang, kiem tra loi, sua loi, cai thien code va de xuat pull request theo dung git/github workflow
---

1. Phân tích task
   - Đọc yêu cầu
   - Xác định mục tiêu và phạm vi
   - Chia task thành các module nhỏ

2. Lập kế hoạch
   - Liệt kê các module
   - Xác định thứ tự làm
   - Đề xuất branch cho từng module
   - Xác định Definition of Done

3. Khởi tạo Git
   - Checkout từ branch gốc phù hợp
   - Tạo branch mới theo module

4. Triển khai module
   - Code từng phần nhỏ
   - Commit thường xuyên
   - Mỗi commit có message rõ nghĩa

5. Kiểm tra
   - Chạy lint
   - Chạy type check
   - Chạy build

6. Sửa lỗi
   - Fix toàn bộ lỗi phát hiện
   - Commit các fix riêng biệt

7. Review & cải thiện
   - Tự review code như một reviewer thật
   - Gợi ý refactor / tối ưu
   - Ghi rõ technical debt nếu có

8. Pull Request
   - Đề xuất mở PR
   - Ghi nội dung PR
   - Đánh giá rủi ro khi merge

9. Hoàn tất
   - Xác nhận module sẵn sàng merge
   - Đề xuất bước tiếp theo
