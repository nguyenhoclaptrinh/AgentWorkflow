---
description: Điều tra, tái hiện, sửa lỗi và đảm bảo không tái phát.
---

# BUG FIX WORKFLOW

## 1. Tái hiện bug
- Đọc mô tả lỗi
- Xác định bước gây lỗi
- Ghi lại log/error message

## 2. Phân tích nguyên nhân
- Xác định root cause
- Đánh giá phạm vi ảnh hưởng

## 3. Fix
- Sửa đúng nguyên nhân, không workaround
- Không phá logic liên quan

## 4. Test lại
- Test case lỗi cũ
- Test regression

## 5. Commit
- Commit message:
  fix(scope): mô tả lỗi

## 6. PR
- Mô tả:
  - Nguyên nhân
  - Cách fix
  - Test đã chạy
