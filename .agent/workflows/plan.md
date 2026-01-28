---
description: Lập kế hoạch kỹ thuật và kiến trúc (không bao gồm code/implement).
type: procedure
required_skills: [research, lead-architect, product-manager]
inputs: ["Requirements", "Idea", "PRD"]
outputs: ["Implementation Plan", "Task List", "Architecture Specs"]
---

# Workflow Lập Kế Hoạch (`/plan`)

> [!NOTE]
> Workflow này chỉ tập trung vào giai đoạn **Thinking & Planning**.
> Đầu ra sẽ là các tài liệu kế hoạch chi tiết để User review/approve trước khi thực sự bắt tay vào code (ở workflow khác).

## Các bước thực hiện

### Bước 1: Nghiên cứu & Phân tích (Research)
1.  **Adopt `[research]` persona**.
2.  Nếu yêu cầu chưa rõ, dùng `search_web` hoặc `grep_search` codebase để lấy context.
3.  Xác định các rủi ro kỹ thuật, các thư viện cần dùng, hoặc pattern thiết kế phù hợp.

### Bước 2: Thiết kế Kiến trúc (Architecture)
1.  **Adopt `[lead-architect]` persona**.
2.  Xác định các file cần thay đổi/tạo mới.
3.  Vẽ sơ đồ luồng (nếu phức tạp).
4.  Cập nhật/Tạo các file Specs trong `docs/030-Specs/` (nếu cần).

### Bước 3: Lập Kế hoạch Triển khai (Planning)
1.  **Create Artifact `implementation_plan.md`**:
    -   Mô tả mục tiêu.
    -   Danh sách thay đổi (New/Modify/Delete).
    -   Kế hoạch kiểm thử (Test Plan).
2.  **Create/Update Artifact `task.md`**:
    -   Chia nhỏ công việc thành các checklist item cụ thể (Atomic Tasks).
    -   Estimate độ phức tạp.

### Bước 4: Review & Handover
1.  **Review lại Plan**: Đảm bảo logic chặt chẽ, không bỏ sót dependencies.
2.  **Notify User**: Báo cáo plan đã sẵn sàng.

## Output mong đợi
- [ ] `implementation_plan.md`: Chi tiết kỹ thuật.
- [ ] `task.md`: Checklist công việc.
- [ ] (Optional) `docs/030-Specs/*.md`: Tài liệu thiết kế mới.

> **Tiếp theo làm gì?**
> Sau khi Plan được approve, bạn có thể chạy `/code` (để AI tự làm) hoặc `/implement-feature` (để làm từng bước) dựa trên plan này.
