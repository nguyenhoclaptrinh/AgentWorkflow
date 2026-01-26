---
description: Dọn dẹp code, tối ưu hóa, giảm nợ kỹ thuật (không thay đổi tính năng).
type: procedure
required_skills: [lead-architect, backend-developer]
inputs: ["Legacy Code", "Deep Nested Logic", "Duplication"]
outputs: ["Refactored Code", "Clean Code"]
---

# Quy trình Refactor (`/refactor`)

> [!IMPORTANT]
> **NGUYÊN TẮC**: "Refactoring không làm thay đổi hành vi bên ngoài của code".
> Phải đảm bảo Test Pass 100% trước và sau khi refactor.

---

## Bước 1: Xác định Phạm vi

// turbo

1.  Chọn **MỘT** mục tiêu cụ thể (VD: "Tách hàm xử lý Auth", "Gộp các utility trùng lặp").
2.  Đảm bảo khu vực code đó đã có Unit Test bao phủ.
    - *Nếu chưa có test*: **DỪNG LẠI**. Dùng `/gen-tests` để viết test trước.

---

## Bước 2: Tạo Branch Refactor

// turbo

1.  Dùng `/git-branch` với prefix `refactor/`.
    - Ví dụ: `refactor/auth-service-split`.

---

## Bước 3: Thực hiện Refactor

// turbo

**Các kỹ thuật phổ biến**:
1.  **Extract Method**: Tách đoạn code dài thành hàm nhỏ có tên rõ nghĩa.
2.  **Rename Variable**: Đổi tên biến a, b, c thành `userEmail`, `isValidDate`.
3.  **Remove Dead Code**: Xóa code không dùng, comment cũ.
4.  **Apply Design Pattern**: Nếu code quá phức tạp (Strategy, Factory...).

> 💡 **Lưu ý**: Commit thường xuyên sau mỗi bước nhỏ (Micro-commits).

---

## Bước 4: Verification

// turbo

1.  **Chạy Test**: `npm test` (hoặc tương đương).
2.  **So sánh**: Input/Output phải y hệt như trước.
3.  **Performance**: Đảm bảo không làm chậm hệ thống (nếu thay đổi thuật toán).

---

## Bước 5: Finalize

1.  Dùng `/git-commit` với type `refactor`.
2.  Tạo PR merge vào `dev`.
