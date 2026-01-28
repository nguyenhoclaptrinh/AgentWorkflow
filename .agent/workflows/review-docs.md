---
description: Review tài liệu và artifacts về tính Chính xác Kỹ thuật, Logic/Quy trình và Chất lượng Biên tập.
---

# Quy trình Review Tài liệu & Artifacts

Workflow này hướng dẫn AI review các file tài liệu (`docs/`) và Agent Artifacts (`task.md`, `implementation_plan.md`, `walkthrough.md`) để đảm bảo chất lượng. Quy trình bao gồm 3 khía cạnh: **Quy trình & Logic** (quan trọng cho artifacts), **Chính xác Kỹ thuật** (khớp với code) và **Chất lượng Biên tập** (rõ ràng/văn phong).

## Các bước thực hiện

### 1. Phân tích Yêu cầu & Phạm vi
- **Input**: Yêu cầu của User (VD: "Review plan này", "Check cú pháp docs API") và file mục tiêu.
- **Action**: Xác định loại review cần thiết.
    -   **Artifacts (Plan/Task/Walkthrough)**: Bắt buộc **Review Quy trình & Logic** trước tiên.
    -   **Tài liệu Kỹ thuật**: Cần **Review Kỹ thuật** + **Review Biên tập**.
- **Persona**: `[lead-architect]` (để xác định phạm vi).

### 2. Review Quy trình & Logic (Ưu tiên cho Artifacts)
- **Điều kiện**: Nếu file mục tiêu là Agent Artifact (`.md` trong `brain/`) hoặc Tài liệu Quy trình.
- **Persona**: `[lead-architect]` (Tính khả thi kỹ thuật) & `[business-analysis]` (Khớp yêu cầu).
- **Kiểm tra**:
    -   **Implementation Plan**:
        -   "Mô tả Mục tiêu" có rõ ràng và chính xác không?
        -   "Các thay đổi đề xuất" có sắp xếp logic không (Dependency trước)?
        -   "Kế hoạch kiểm thử" có cụ thể (lệnh exact) không?
        -   Đã giải quyết hết yêu cầu của user chưa?
    -   **Walkthrough**:
        -   "Kết quả xác minh" có chứng minh được task đã hoàn thành?
        -   Có bằng chứng cụ thể (screenshots, logs)?
        -   Có khớp với `task.md` không?
    -   **Task List (`task.md`)**:
        -   Chia nhỏ task có đủ chi tiết (granular) không?
        -   Trạng thái (`[ ]`, `[/]`, `[x]`) có chính xác không?
- **Output**: Danh sách "Lỗ hổng Logic" hoặc "Vấn đề Quy trình".

### 3. Review Kỹ thuật
- **Điều kiện**: Luôn chạy cho Tài liệu Kỹ thuật; Chạy cho Artifacts để kiểm tra code snippets.
- **Persona**: `[lead-architect]` hoặc `[backend-developer]/[frontend-developer]`.
- **Kiểm tra**:
    -   **Độ chính xác Code**: Các snippet code/đường dẫn file có khớp với codebase thực tế?
    -   **Tính lỗi thời**: Thông tin có bị cũ so với code hiện tại không?
    -   **Cấu trúc**: Có tuân thủ rule `documents.md` (headers, metadata, tên file) không?
    -   **Bảo mật**: Có lộ secrets hoặc hướng dẫn bad practice không?

### 4. Review Biên tập
- **Điều kiện**: Tất cả tài liệu.
- **Persona**: `[qa-tester]` (đóng vai trò Technical Writer).
- **Kiểm tra**:
    -   **Ngôn ngữ**: Tiếng Việt (tuân thủ `communication.md`).
    -   **Sự rõ ràng**: Dễ hiểu không? Câu có quá dài dòng?
    -   **Định dạng**: Cú pháp Markdown (headers, lists, links).
    -   **Link gãy**: Kiểm tra link `[text](path)` có phải là đường dẫn tuyệt đối hoặc tương đối hợp lệ không.

### 5. Báo cáo & Sửa lỗi
- **Action**:
    -   Nếu lỗi nhỏ (typo, format): **Tự động sửa** ngay lập tức.
    -   Nếu lỗi logic/kỹ thuật: **Báo cáo** cho user qua `notify_user` hoặc tạo artifact báo cáo.
- **Output**: Tổng hợp kết quả review (Approved / Needs Changes) và danh sách các mục đã sửa.

## Ví dụ Sử dụng

### Review một Implementation Plan
> User: "Review plan này xem logic ok chưa"
> Agent: Chạy Bước 1 -> Bước 2 (Check Logic Sâu) -> Bước 3 (Check Kỹ thuật).

### Review một Tài liệu Kỹ thuật
> User: "Review lại docs/Manuals/Architecture.md"
> Agent: Chạy Bước 1 -> Bước 3 (Kỹ thuật) -> Bước 4 (Biên tập).