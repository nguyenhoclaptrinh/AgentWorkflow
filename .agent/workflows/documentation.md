---
description: Tạo tài liệu toàn diện (Kiến trúc, API, Specs) từ Codebase hoặc Requirements.
type: procedure
required_skills: [lead-architect, backend-developer, devops-engineer, business-analysis]
inputs: ["Source Code", "PRD"]
outputs: ["docs/030-Specs/*"]
---

# Workflow Tài liệu (`/documentation`)

> [!IMPORTANT]
> **BẮT BUỘC**: Áp dụng `.agent/rules/documents.md`.

---

## Bước 0: Xác định Chế độ (Mode)

1.  **Mode A (Reverse Engineering)**: Từ Code -> Tài liệu.
2.  **Mode B (Forward Engineering)**: Từ PRD -> Specs (SDD, Epics).

---

## MODE A: Từ Codebase (Reverse)

### Bước A1: Phân tích & Dịch ngược

// turbo

1.  **Adopt `[lead-architect]` persona** để:
    -   Quét codebase, nhận diện Tech stack, API routes.
2.  **Adopt `[backend-developer]` persona** để:
    -   Tạo OpenAPI specs từ code Controller/Resolver.
    -   Vẽ ERD từ code Schema (Prisma/TypeORM).

### Bước A2: Tài liệu Vận hành

// turbo

1.  **Adopt `[devops-engineer]` persona** để:
    -   Document hạ tầng, Env vars, CI/CD pipelines.

---

## MODE B: Từ Requirements (Forward)

### Bước B1: Thiết kế Hệ thống (SDD)

// turbo

1.  **Adopt `[lead-architect]` persona** để:
    -   Phân tích PRD.
    -   Vẽ sơ đồ C4, Sequence Diagram.
    -   Quyết định Tech Stack.
    -   Lưu `docs/030-Specs/Architecture/SDD-*.md`.

### Bước B2: Chi tiết hóa Specs

// turbo

1.  **Adopt `[business-analysis]` persona** để:
    -   Viết User Stories, Epics, Use Cases.

---

## Finalize

1.  **Review**: Kiểm tra tính nhất quán (Consistency).
2.  **Commit**: `/git-commit`.
