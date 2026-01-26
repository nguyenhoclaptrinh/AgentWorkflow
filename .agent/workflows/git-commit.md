---
description: Commit code đúng chuẩn Conventional Commits (Tiếng Việt).
type: procedure
required_skills: []
inputs: ["Staged Files"]
outputs: ["Git Commit"]
---

# Workflow Commit Code (`/git-commit`)

> [!IMPORTANT]
> **Atomic Workflow**: Chỉ thực hiện thao tác Commit (Add + Commit).

## Các bước thực hiện

1.  **Kiểm tra trạng thái**:
    ```bash
    git status
    ```

2.  **Stage & Review**:
    ```bash
    git add .
    git diff --staged # REVIEW KỸ TRƯỚC KHI COMMIT!
    ```

3.  **Commit**:
    - **BẮT BUỘC**: Dùng Tiếng Việt.
    - **Format**: `type(scope): description`
    - **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
    - **Ví dụ**:
        - `feat(auth): thêm api đăng ký`
        - `fix(db): sửa lỗi connect timeout`
        - `chore: cập nhật dependencies`

    ```bash
    git commit -m "feat: mô tả công việc bằng tiếng Việt"
    ```

## Checklist
- [ ] Đã chạy linter/formatter trước khi commit chưa?
- [ ] Message có đúng format Conventional Commits không?
- [ ] Message có phải Tiếng Việt không?
