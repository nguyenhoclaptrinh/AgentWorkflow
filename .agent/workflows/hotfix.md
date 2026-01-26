---
description: Sửa lỗi khẩn cấp trên môi trường Production (Hotfix).
type: procedure
required_skills: [backend-developer, devops-engineer, qa-tester]
inputs: ["Production Incident", "Critical Bug"]
outputs: ["Hotfix Branch", "PR to Main"]
---

# Quy trình Hotfix (`/hotfix`)

> [!WARNING]
> **CHỈ DÙNG CHO**: Lỗi nghiêm trọng ảnh hưởng trực tiếp đến người dùng hoặc dữ liệu trên Production.
> Không dùng cho bug thường, feature request.

---

## Bước 1: Kiểm tra An toàn & Chuẩn bị

// turbo

1.  **Safety Check**:
    ```bash
    git status
    ```
    - Nếu có file chưa commit (dirty) -> **DỪNG LẠI**. Yêu cầu user stash hoặc commit.

2.  **Sync Main**:
    ```bash
    git fetch origin main
    ```
    - Đảm bảo hotfix được tạo từ code production mới nhất.

---

## Bước 2: Khởi tạo Hotfix Branch

// turbo

1.  **Checkout & Reset**:
    ```bash
    git checkout main
    git reset --hard origin/main
    ```
2.  **Tạo Branch**:
    ```bash
    git checkout -b hotfix/<ticket-id>-<description>
    ```

---

## Bước 3: Minimal Fix

// turbo

1.  **Nguyên tắc**: "Change ít nhất có thể". Không refactor, không format code thừa.
2.  **Logic fix**: Sửa đúng chỗ gây lỗi.
3.  **Test**: Viết test case tái hiện lỗi và verify fix.

---

## Bước 4: Validation Kép

// turbo

1.  **Local Test**: Chạy unit test liên quan.
2.  **Pre-prod Check**: Nhờ user kiểm tra logic fix (nếu có thể).

---

## Bước 5: Release & Merge Back

1.  **Commit**: `/git-commit` với message `hotfix: ...`.
2.  **Merge to Main**: Tạo PR vào `main`.
3.  **Merge to Dev**: **QUAN TRỌNG** - phải merge ngược lại vào `dev` để đồng bộ code.
    ```bash
    git checkout dev
    git merge hotfix/...
    git push origin dev
    ```
