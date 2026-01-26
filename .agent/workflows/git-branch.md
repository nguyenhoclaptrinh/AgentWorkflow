---
description: Quản lý việc tạo branch mới từ dev
type: procedure
required_skills: []
inputs: ["Task Name", "Ticket ID"]
outputs: ["New Git Branch"]
---

# Workflow Tạo Branch (`/git-branch`)

> [!IMPORTANT]
> **Atomic Workflow**: Chỉ thực hiện thao tác tạo Branch.

## Các bước thực hiện

1.  **Checkout về dev & Pull mới nhất**:
    ```bash
    git checkout dev
    git pull origin dev
    ```

2.  **Đặt tên Branch**:
    - **Quy tắc**: `type/short-description`
    - **Types**: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`.
    - **Ví dụ**: `feat/user-auth`, `fix/login-bug`.

3.  **Tạo & Switch**:
    ```bash
    git checkout -b <branch-name>
    ```

## Checklist
- [ ] Đã pull code mới nhất từ `dev` chưa?
- [ ] Tên branch có đúng chuẩn không?
