# Hướng dẫn Sử dụng Agent Workflows (System 2.0)

Tài liệu này tổng hợp và hướng dẫn sử dụng các quy trình làm việc (Workflows) của Agent trong dự án.

## 1. Giới thiệu & Kiến trúc System 2.0

Hệ thống Workflow được chia làm 2 loại chính:

1.  **Orchestrator (Người điều phối)**: Là các workflow cấp cao, quản lý vòng đời phát triển và điều phối các sub-agents.
    -   Ví dụ: `/code`, `/cook`.
2.  **Procedure (Quy trình thực thi)**: Là các quy trình cụ thể, atomic, tập trung vào một nhiệm vụ duy nhất.
    -   Ví dụ: `/git-commit`, `/implement-feature`, `/hotfix`.

**Skill Binding**: Mỗi workflow đều được gắn metadata `required_skills` (VD: `qa-tester`, `lead-architect`) giúp Agent biết chính xác cần đóng vai trò gì để thực thi.

---

## 2. Git Workflows (Procedure)

Các workflow atomic tương tác với Git.

| Workflow | Lệnh gọi | Mô tả |
| :--- | :--- | :--- |
| **Tạo Branch** | `/git-branch` | Tạo branch mới từ `dev`. |
| **Commit Code** | `/git-commit` | Stage & Commit với message chuẩn Conventional Commits (Tiếng Việt). |
| **Tạo PR** | `/git-pr` | Đẩy code và tạo Pull Request. |

---

## 3. Development Workflows

### A. Core Development
| Workflow | Loại | Mô tả |
| :--- | :--- | :--- |
| `/development` | Procedure | Code task nhỏ, bug fix, thay đổi đơn giản. |
| `/implement-feature` | Procedure | Triển khai tính năng trọn gói (Research -> Plan -> Code -> Test). |
| `/code` | Orchestrator | Engine điều phối, tự động chạy plan cho `implement-feature`. |
| `/cook` | Orchestrator | Engine điều phối bước-theo-bước (interactive). |

### B. Maintenance & Refactoring (Mới)
| Workflow | Loại | Mô tả |
| :--- | :--- | :--- |
| `/hotfix` | Procedure | **Quy trình khẩn cấp**: Sửa lỗi Production, bypass research sâu, merge thẳng vào Main & Dev. |
| `/refactor` | Procedure | Chuyên dụng cho việc dọn dẹp code, không thay đổi logic, đảm bảo test pass. |

---

## 4. Planning & Analysis Workflows

| Workflow | Input | Output |
| :--- | :--- | :--- |
| `/brainstorm` | Ý tưởng (Idea) | Roadmap, PRD |
| `/break-tasks` | PRD/Specs | Danh sách Task (Jira/Markdown) |
| `/bootstrap` | Architecture Spec | Project Init, Config |

---

## 5. QA & Documentation Workflows

| Workflow | Skill chính | Mô tả |
| :--- | :--- | :--- |
| `/qa` | `qa-tester` | Lên kế hoạch test (Test Plans) và viết Test Cases. |
| `/gen-tests` | `qa-tester` | Sinh code test tự động (Unit/E2E). |
| `/debug` | `tester`, `coder` | Quy trình debug khoa học (Giả thuyết -> Chứng minh -> Fix). |
| `/documentation` | `architect` | Dịch ngược code ra tài liệu hoặc viết Specs từ PRD. |
| `/ui-ux-design` | `designer` | Quy trình thiết kế, prototyping. |

---

## 6. Customization

### `/custom-behavior`
- **Mục đích**: Hỗ trợ user điều chỉnh Rules hoặc Workflows một cách an toàn.
- **Tính năng**: Tự động phân tích tác động (Impact Analysis) trước khi ghi đè file hệ thống.
