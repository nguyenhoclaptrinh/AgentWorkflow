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

1.  **Kiểm tra & Cập nhật**:
    ```bash
    git status # Check dirty!
    git checkout dev
    git pull origin dev
    ```
    > [!WARNING]
    > Nếu `git status` báo có file thay đổi, hãy Stash hoặc Commit trước khi switch branch!

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
