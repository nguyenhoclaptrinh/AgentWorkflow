---
description: Audit toàn diện dự án định kỳ (Architecture, Tech Debt, Security).
type: procedure
required_skills: [lead-architect, security-specialist, devops-engineer]
inputs: ["Codebase", "Docs"]
outputs: ["Audit Report", "Refactoring Plan"]
---

# Workflow Project Review (`/project-review`)

> [!NOTE]
> Khác với `/code-review` (soi từng dòng), workflow này nhìn bức tranh toàn cảnh (Holistic View).

---

## Bước 1: Architecture Audit

1.  **Adopt `[lead-architect]`**:
    -   Scan cấu trúc thư mục và dependencies (`package.json`).
    -   Đánh giá sự tuân thủ Design Patterns (SOLID, Clean Arch).
    -   Phát hiện "Dead Code" hoặc module coupling quá cao.

---

## Bước 2: Security & Dependencies Audit

// turbo

1.  **Adopt `[security-specialist]`**:
    -   Check `npm audit` (nếu có thể).
    -   Review file `.env.example`, `gitignore` (đảm bảo không lộ secret).
2.  **Adopt `[devops-engineer]`**:
    -   Review CI/CD configs.
    -   Review Dockerfile/deployment scripts.

---

## Bước 3: Documentation Audit

1.  **Check Coverage**:
    -   Tài liệu API có khớp code không? (Random check).
    -   README có hướng dẫn setup đúng không?
    -   Các file `docs/` có bị outdated không?

---

## Bước 4: Reporting

1.  **Tạo Audit Report**: `docs/035-QA/Reports/Audit-{Date}.md`.
2.  **Đề xuất Hành động**:
    -   List các item cần `/refactor`.
    -   List các item cần `/update-docs`.
    -   List các rủi ro bảo mật cần fix gấp.
