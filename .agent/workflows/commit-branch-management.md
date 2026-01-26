---
description: Quản lý branch, commit đúng chuẩn team (Full Cycle).
---
# Workflow Quản lý Branch và Commit (Composite)

> [!NOTE]
> Workflow này là bản tổng hợp (Composite) của 3 workflow nguyên tử:
> 1. `/git-branch`: Quản lý Branch.
> 2. `/git-commit`: Quản lý Commit.
> 3. `/git-pr`: Quản lý Pull Request.

---

## Quy trình chuẩn (Full Cycle)

### Bước 1: Khởi tạo (`/git-branch`)
 Sử dụng workflow `/git-branch` để tạo branch mới từ `dev`.

### Bước 2: Phát triển và Commit (`/git-commit`)
Sau khi code xong, sử dụng workflow `/git-commit` để add và commit code đúng chuẩn Conventional Commits (Tiếng Việt).

### Bước 3: Đẩy code và tạo PR (`/git-pr`)
Cuối cùng, sử dụng workflow `/git-pr` để đẩy code lên server và tạo Pull Request review.

---

## Quick Reference Commands

```bash
# 1. Tạo branch
/git-branch

# 2. Commit
/git-commit

# 3. PR
/git-pr
```
