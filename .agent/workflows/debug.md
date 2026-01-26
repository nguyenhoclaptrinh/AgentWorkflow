---
description: Workflow debug khoa học: Giả thuyết, Đo đạc, Tái hiện, Phân tích, Fix.
type: procedure
required_skills: [qa-tester, backend-developer, frontend-developer]
inputs: ["Bug Report", "Logs"]
outputs: ["Proof of Fix", "Regression Test"]
---

# Workflow Debug & Fix Khoa học

> [!IMPORTANT]
> **MỤC TIÊU**: Tuân thủ quy trình khoa học để tìm root cause với BẰNG CHỨNG trước khi fix.
> **Phù hợp cho**: Bug khó tái hiện, race conditions, vấn đề hiệu năng, và regressions.

---

## Bước 1: Tạo Giả thuyết

1.  **Phân tích Vấn đề**: Review báo cáo bug và context có sẵn.
2.  **Tạo Giả thuyết**: Brainstorm nhiều nguyên nhân tiềm năng (VD: "Race condition khi fetch data", "Logic update state sai", "Edge case khi validate input").
3.  **Chọn Ứng viên Hàng đầu**: Ưu tiên những giả thuyết khả thi nhất để điều tra trước.

---

## Bước 2: Đo đạc (Instrumentation)

1.  **Lên kế hoạch Log**: Quyết định xem thông tin gì đang thiếu để validate giả thuyết.
2.  **Thêm Log**: Chèn code log có mục tiêu (`console.log`, logger calls, markers).
    -   *Mục tiêu*: Bắt được state lúc runtime, giá trị biến, và luồng thực thi liên quan đến giả thuyết.
    -   *Tip*: Thêm prefix độc nhất (VD: `[DEBUG-HYPOTHESIS-1]`) để dễ lọc.

---

## Bước 3: Tái hiện & Thu thập Dữ liệu

1.  **Thực thi**: Chạy ứng dụng hoặc test case để tái hiện bug.
    -   Nếu chưa có script tái hiện, hãy tạo ngay nếu có thể.
2.  **Thu thập Dữ liệu**: Lấy output từ việc đo đạc ở bước trên.

---

## Bước 4: Phân tích & Root Cause

1.  **Phân tích Bằng chứng**: Nhìn vào logs/data thu thập được.
    -   Dữ liệu có xác nhận giả thuyết không?
    -   Nó có loại trừ giả thuyết nào không?
2.  **Chốt Root Cause**: Xác định chính xác *tại sao* bug xảy ra dựa trên bằng chứng.
3.  **Lặp lại (nếu cần)**: Nếu chưa kết luận được, quay lại Bước 1 hoặc 2 với kiến thức mới.

---

## Bước 5: Triển khai Fix có mục tiêu

1.  **Apply Fix**: Triển khai fix dựa *duy nhất* vào root cause đã xác nhận. Tránh "shotgun debugging" (sửa mò, sửa lung tung).
2.  **Dọn dẹp**: Xóa các code log/đo đạc tạm thời.

---

## Bước 6: Verification

// turbo

1.  **Chạy Test Tái hiện**: Xác nhận bug đã hết.
2.  **Chạy Regression Tests**: Chạy unit tests liên quan để đảm bảo không có side effects.
3.  **Lint & Type Check**: Đảm bảo chất lượng code.

---

## Bước 7: Finalize

1.  **Draft Commit**: Tạo commit message ngắn gọn (VD: `fix(module): mô tả fix`).
2.  **Báo cáo**: Tóm tắt quy trình:
    -   Giả thuyết là gì?
    -   Bằng chứng nào xác nhận nó?
    -   Đã fix như thế nào?
