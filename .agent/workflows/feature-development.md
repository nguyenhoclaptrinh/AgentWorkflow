---
description: Phát triển tính năng mới từ yêu cầu → code → test → commit → PR.
---

# FEATURE DEVELOPMENT WORKFLOW

## 1. Hiểu yêu cầu
- Phân tích mô tả feature
- Xác định input/output, edge cases
- Ghi lại assumptions nếu thiếu thông tin

## 2. Lập kế hoạch
- Chia nhỏ feature thành các task
- Xác định file/module cần chỉnh sửa
- Đánh giá ảnh hưởng tới hệ thống hiện tại

## 3. Implement
- Viết code theo coding convention dự án
- Tránh hard-code, ưu tiên config
- Comment ngắn gọn ở logic quan trọng

## 4. Local test
- Tự viết test thủ công hoặc chạy app local
- Kiểm tra case thường + case biên

## 5. Commit
- Gợi ý commit message theo format:
  feat(scope): mô tả ngắn

## 6. Push & PR
- Push branch feature/*
- Tạo PR với:
  - Mô tả feature
  - Checklist test
  - Screenshot/log nếu cần
