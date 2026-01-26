---
description: Cập nhật code mới nhất từ dev về branch hiện tại (Fetch & Rebase)
type: procedure
required_skills: []
inputs: ["Current Branch"]
outputs: ["Updated Branch"]
---

# Workflow Cập nhật Code (`/git-sync`)

> [!IMPORTANT]
> **Mục tiêu**: Kéo code mới nhất từ `dev` về để tránh conflict sau này, giữ history sạch (Rebase).

## Các bước thực hiện

1.  **Fetch dữ liệu mới**:
    ```bash
    git fetch origin
    ```

2.  **Rebase với dev**:
    > [!CAUTION]
    > Chỉ chạy khi đang ở trên branch feature của bạn (KHÔNG PHẢI `dev` hay `main`).

    ```bash
    git rebase origin/dev
    ```

3.  **Xử lý Conflict (Nếu có)**:
    - Nếu có conflict, git sẽ dừng lại.
    - Sửa file conflict -> `git add .` -> `git rebase --continue`.
    - Nếu muốn huỷ: `git rebase --abort`.

4.  **Force Push (Nếu đã push trước đó)**:
    - Vì rebase thay đổi history, bạn cần force push (cẩn thận):
    ```bash
    git push origin <your-branch> --force-with-lease
    ```

## Khi nào dùng?
- Trước khi tạo Pull Request.
- Khi team báo có update quan trọng trên `dev`.
- Mỗi sáng trước khi bắt đầu code.
