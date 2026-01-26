---
description: Thiết lập cấu trúc dự án, cài đặt dependencies, và cấu hình môi trường dựa trên spec kiến trúc.
type: procedure
required_skills: [lead-architect, devops-engineer, frontend-developer, backend-developer, product-manager]
inputs: ["docs/030-Specs/Architecture/SDD-*.md"]
outputs: ["Initialized Project", "CI/CD Config", "Env Config"]
---

# Workflow Khởi tạo Dự án (Bootstrap)

> [!IMPORTANT]
> **Điều kiện tiên quyết**: Đảm bảo SDD đã tồn tại trong `docs/030-Specs/Architecture/`.

---

## Hướng dẫn sử dụng MCP

| MCP Tool | Khi nào dùng |
| :--- | :--- |
| `context7_resolve-library-id` | Tìm tên package chính xác |
| `context7_query-docs` | Nghiên cứu các bước cài đặt/cấu hình |

---

## Bước 1: Khởi tạo Framework & Cấu trúc

// turbo

1.  **Gọi `[lead-architect]` skill** để:
    -   Định nghĩa cấu trúc root (Monorepo vs Polyrepo).
    -   Khởi tạo base project (VD: `git init`, `npx create-next-app`).
    -   Tạo khung thư mục dựa trên SDD.
2.  **CHỜ** quá trình khởi tạo hoàn tất.

---

## Bước 2: Công cụ Maintenance & Chất lượng

// turbo

> 💡 **Vai trò**: DevOps Engineer đảm bảo "Trải nghiệm Phát triển" (DX) tốt.

1.  **Gọi `[devops-engineer]` skill** để cài đặt & cấu hình:
    -   **Quality Tools**: ESLint, Prettier, TypeScript config.
    -   **Git Hooks**: Husky, Lint-staged, Commitlint.
    -   **CI/CD**: Github Actions (build/test cơ bản).
2.  Verify: Chạy `npm run lint` và đảm bảo hooks hoạt động khi commit.

---

## Bước 3: Setup Frontend

// turbo

> 💡 **Vai trò**: Frontend Developer quản lý phía UI/Client.

1.  **Gọi `[frontend-developer]` skill** để:
    -   **UI Ecosystem**: Cài đặt TailwindCSS, Radix/Shadcn, Framer Motion.
    -   **State Manager**: Zustand/Jotai/Redux.
    -   **Structure**: Setup `src/components`, `src/hooks`, `src/pages` (hoặc `app`).
    -   **Assets**: Cấu hình font loaders, image optimization.
2.  **CHỜ** quá trình cài đặt.

---

## Bước 4: Setup Backend

// turbo

> 💡 **Vai trò**: Backend Developer quản lý phía Data/Server.

1.  **Gọi `[backend-developer]` skill** để:
    -   **Database**: Setup Prisma/Drizzle/Supabase client.
    -   **API**: Cấu hình API routes/Server Actions.
    -   **Validation**: Cài đặt Zod/Valibot.
    -   **Environment**: Tạo `.env.example` và validate `.env` keys.
2.  **CHỜ** quá trình cài đặt.

---

## Bước 5: Validation Cuối cùng

// turbo

1.  **Gọi `[devops-engineer]` skill** để:
    -   Chạy full build `npm run build`.
    -   Test Type-checking `tsc --noEmit`.
2.  **Gọi `[product-manager]`** để cập nhật trạng thái Roadmap sang "In Progress".

---

## Quick Reference

| Bước | Skill | Hành động |
| :--- | :--- | :--- |
| 1 | lead-architect | Framework & Structure Init |
| 2 | devops-engineer | Husky, Linter, CI/CD |
| 3 | frontend-developer | Tailwind, Components, State |
| 4 | backend-developer | DB, API, Env |
| 5 | devops-engineer | Final Build Check |
