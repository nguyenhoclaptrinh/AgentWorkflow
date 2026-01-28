---
description: Workflow tổng thể để AI thực hiện review dự án — bao gồm code, thiết kế, tests, tài liệu và chuẩn chất lượng
---
1. **Xác định scope review**  
   - Hỏi user/owner phần cần review (code, docs, test, thiết kế).  
   - Xác định mục tiêu chính của review (chất lượng, test coverage, bảo mật…).

2. **Thu thập artifacts cần review**  
   - PR/branch hiện tại, tài liệu thiết kế, test plans, CI logs.  
   - Lấy danh sách tất cả file/code liên quan.

3. **Review mô tả mục tiêu & yêu cầu**  
   - Đọc yêu cầu tính năng/issue ticket.  
   - Đảm bảo user story có acceptance criteria rõ ràng.

4. **Kiểm tra code style & quality**  
   - Review code dựa trên coding standards (style, conventions).  
   - Dùng checklist kiểm tra readability & maintainability. :contentReference[oaicite:0]{index=0}

5. **Đánh giá logic & kiến trúc**  
   - Xác định code có đúng theo yêu cầu không.  
   - Kiểm tra logic chính và edge cases.  
   - Đảm bảo không có duplicated code hay anti-patterns.

6. **Review test coverage**  
   - Kiểm tra unit tests & integration tests có đầy đủ không.  
   - Đảm bảo test cover case chính & edge case. :contentReference[oaicite:1]{index=1}

7. **Kiểm tra CI/CD status**  
   - Xem kết quả lint, test, build trong pipeline CI.  
   - Nếu có lỗi CI, report lại & hướng dẫn fix trước khi tiếp tục.

8. **Review tài liệu & comment**  
   - Đảm bảo code mới có comment rõ ràng nếu logic phức tạp.  
   - Kiểm tra tài liệu thiết kế/test plan mô tả đúng nội dung. :contentReference[oaicite:2]{index=2}

9. **Security & performance check**  
   - Xem xét phần xử lý dữ liệu, authorization, input validation.  
   - Gợi ý thêm nếu cần security check đặc thù (tiêu chuẩn OWASP). :contentReference[oaicite:3]{index=3}

10. **Ghi nhận feedback có cấu trúc**  
    - Ghi lại từng issue/đề xuất theo dạng: **Điểm cần fix**, **Lý do**, **Gợi ý giải pháp**.  
    - Ưu tiên feedback rõ ràng, hành động cụ thể.

11. **Tạo tổng kết review**  
    - Tổng hợp: what’s good, what’s risky, what must change.  
    - Đề xuất mức độ ưu tiên fix (critical, recommended, nice-to-have).

12. **Tương tác với user/author review**  
    - Hỏi user có cần giải thích chi tiết từng feedback hay không.  
    - Xác nhận lại danh sách items để user action.

13. **Đề xuất next steps / follow-up tasks**  
    - Tạo tasks list fix bugs, improve tests, update docs.  
    - Nếu cần, assign người/agent chịu trách nhiệm thực hiện.

14. **Cập nhật checklist cho tương lai**  
    - Dựa trên vấn đề tìm được, bổ sung checklist nếu thiếu.  
    - Lưu lại pattern review để cải thiện workflow.
