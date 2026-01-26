---
description: Workflow debug khoa học: Giả thuyết, Đo đạc, Tái hiện, Phân tích, Fix.
type: procedure
required_skills:
  - qa-tester
  - backend-developer
  - frontend-developer
inputs:
  - Bug Report
  - Logs
outputs:
  - Proof of Fix
  - Regression Test
---

# Workflow Debug & Fix (`/debug`)

> [!IMPORTANT]
> **MỤC TIÊU**: Tuân thủ quy trình khoa học để tìm root cause với BẰNG CHỨNG trước khi fix.
> **Tuyệt đối không**: Fix mò (Shotgun debugging).

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng |
| :--- | :--- |
| `sequential-thinking` | **BẮT BUỘC** để xây dựng cây giả thuyết (Hypothesis Tree). |
| `run_command` | Chạy test hoặc script tái hiện. |

---

## Bước 1: Tạo Giả thuyết (Hypothesis)

1.  **Adopt `[qa-tester]` persona** để phân tích.
2.  Sử dụng `sequential-thinking` để liệt kê các nguyên nhân có thể.
    -   *Ví dụ*: "H1: Do fe gửi sai format date", "H2: Do DB chưa index", "H3: Do logic validate bị ngược".
3.  Sắp xếp độ ưu tiên (Likelihood) cho các giả thuyết.

---

## Bước 2: Đo đạc & Tái hiện (Measure & Reproduce)

1.  **Adopt `[backend-developer]` (hoặc Frontend)** để:
    -   Thêm log (`console.log`, `logger`) vào các điểm nghi vấn.
    -   Viết script/test case minimal để tái hiện lỗi.
2.  **Execute**: Chạy script để thu thập log.
3.  **Validate**:
    -   Nếu log chứng minh giả thuyết -> Sang Bước 3.
    -   Nếu không -> Quay lại Bước 1 (Loại trừ giả thuyết sai).

---

## Bước 3: Triển khai Fix

// turbo

1.  **Code Fix**: Sửa code dựa trên nguyên nhân đã tìm ra.
2.  **Cleanup**: Xóa các log debug tạm thời.
3.  **Strict Check**:
    -   Chạy lại test case tái hiện -> Phải Pass.
    -   Chạy regression test -> Phải Pass.

---

## Bước 4: Finalize

1.  **Adopt `[qa-tester]`** để confirm fix.
2.  Commit với message: `fix(scope): ...` (Refer to ticket nếu có).
