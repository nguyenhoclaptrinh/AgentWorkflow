---
description: Tạo Pull Request (PR) và Merge.
---
# Workflow Pull Request (`/git-pr`)

> [!IMPORTANT]
> **Atomic Workflow**: Chỉ thực hiện thao tác Push và tạo PR.

## Các bước thực hiện

1.  **Review Diff (BẮT BUỘC)**:
    - Kiểm tra những thay đổi sẽ được đẩy lên so với nhánh `dev`.
    ```bash
    git diff origin/dev...HEAD
    ```
    - *Gợi ý*: Nhấn `q` để thoát khỏi màn hình diff.

2.  **Push Branch hiện tại**:
    ```bash
    git push origin HEAD
    ```
    *(Hoặc `git push origin feature/ten-branch` nếu cần chỉ định rõ)*

2.  **Tạo PR (Sử dụng GitHub CLI)**:
    - Target: `dev` (Mặc định).
    - Title: Tiếng Việt, ngắn gọn.
    - Body: Mô tả thay đổi.
    
    ```bash
    gh pr create --base dev --title "feat: tiêu đề PR" --body "- Chi tiết thay đổi 1\n- Chi tiết thay đổi 2"
    ```

3.  **Merge PR (Optional - Nếu workflow yêu cầu merge ngay)**:
    ```bash
    gh pr merge --merge --delete-branch
    ```

## Checklist
- [ ] Đã review lại code diff chưa?
- [ ] Title/Body PR có viết bằng Tiếng Việt không?
- [ ] Đã target vào branch `dev` chưa?
