---
description: Kiểm tra luồng tích hợp giữa nhiều module/service.
---

# INTEGRATION TEST WORKFLOW

## 1. Xác định flow
- API → Service → DB
- FE → BE → API ngoài

## 2. Chuẩn bị dữ liệu test
- Seed data
- Mock service ngoài nếu cần

## 3. Viết test
- Test theo kịch bản người dùng

## 4. Chạy test
- Kiểm tra log & response

## 5. Báo cáo
- Ghi lại case fail nếu có
