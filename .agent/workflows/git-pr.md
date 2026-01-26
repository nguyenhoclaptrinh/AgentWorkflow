---
description: Tạo Pull Request (PR) và Merge.
type: procedure
required_skills: []
inputs: ["Current Branch"]
outputs: ["Pull Request URL"]
---

# Workflow Tạo PR (`/git-pr`)

> [!IMPORTANT]
> **Atomic Workflow**: Đẩy code và tạo PR.

## Các bước thực hiện

0.  **Check Auth**:
    ```bash
    gh auth status
    ```
    *(Nếu chưa login, dùng `gh auth login` hoặc tạo PR thủ công)*

1.  **Push Branch**:
    ```bash
    git push origin <current-branch>
    ```

2.  **Tạo PR bằng GH CLI**:
    ```bash
    gh pr create --base dev --title "feat: ..." --body "Mô tả thay đổi..."
    ```
    *(Hoặc hướng dẫn user mở link Github để tạo PR)*

3.  **Merge (Nếu được approve)**:
    - Không tự merge nếu không có quyền.
    - Nhắc user review và merge.

## Checklist
- [ ] Đã push hết commit chưa?
- [ ] Title PR có theo chuẩn Conventional Commits không?
