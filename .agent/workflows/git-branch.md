---
description: Quản lý branch (tạo, chuyển, checkout).
---
# Workflow Quản lý Branch (`/git-branch`)

> [!IMPORTANT]
> **Atomic Workflow**: Chỉ thực hiện các thao tác liên quan đến Branch.

## Các bước thực hiện

1.  **Cập nhật `dev` (Luôn làm bước này trước khi tạo branch mới)**:
    ```bash
    git checkout dev
    git pull origin dev
    ```

2.  **Tạo Branch Mới**:
    - **Cú pháp**: `git checkout -b <type>/<context-short-description>`
    - **Type**: `feature`, `fix`, `refactor`, `chore`, `docs`.
    - **Ví dụ**:
        - `feature/user-login`
        - `fix/api-timeout`
    ```bash
    git checkout -b feature/ten-tinh-nang
    ```

3.  **Chuyển đổi Branch (Nếu đã tồn tại)**:
    ```bash
    git checkout feature/ten-tinh-nang-da-co
    ```

## Checklist
- [ ] Tên branch có đúng chuẩn `type/description` không?
- [ ] Đã pull code mới nhất từ `dev` chưa?
