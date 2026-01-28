---
description: Merge code trực tiếp vào branch chính (Fast Track cho Solo/Small Project).
type: procedure
required_skills: []
inputs: ["Feature Branch", "Target Branch (default: dev)"]
outputs: ["Merged Code"]
---

# Workflow Merge Trực Tiếp (`/git-merge`)

> [!WARNING]
> **Use Case**: Chỉ dùng cho dự án cá nhân hoặc khi cần deploy gấp.
> **Skip Verify**: Workflow này bỏ qua bước Code Review của người khác. Bạn phải TỰ chịu trách nhiệm về chất lượng code.

## Các bước thực hiện

### 1. Safety Check (BẮT BUỘC)

Trước khi merge, phải đảm bảo code đạt chuẩn.

```bash
# 1. Kiểm tra linter
npm run lint

# 2. Chạy test (nếu có)
npm test
```

> **STOP**: Nếu lệnh trên thất bại, **KHÔNG ĐƯỢC MERGE**. Hãy sửa lỗi trước.

### 2. Chuẩn bị Branch Đích

```bash
# Chuyển sang branch đích (thường là dev)
git checkout dev

# Cập nhật code mới nhất từ server
git pull origin dev
```

### 3. Thực hiện Merge

```bash
# Merge branch tính năng vào dev
git merge <feature-branch-name>
```

**Xử lý Conflict (Nếu có):**
1.  Nếu có conflict, Git sẽ báo lỗi.
2.  Mở VS Code, sửa các file bị conflict.
3.  Chạy `git add .` và `git commit` để hoàn tất merge.

### 4. Đẩy code & Cleanup

```bash
# Push lên server
git push origin dev

# (Tùy chọn) Xóa branch feature sau khi merge xong
git branch -d <feature-branch-name>
```

## Checklist Tự Review
- [ ] Đã chạy `npm run lint` chưa?
- [ ] Đã kiểm tra lại logic lần cuối chưa?
- [ ] Đã chắc chắn không làm hỏng tính năng cũ không?
