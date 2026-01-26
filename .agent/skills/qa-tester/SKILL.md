---
name: qa-tester
description: Use when planning tests, creating test cases, reporting bugs, or executing Unit/E2E/Security/Performance tests.
version: "1.4"
allowed-tools: read_file list_dir search_web read_url_content
---

# QA Testing Standards

This skill provides expert QA standards and workflows for ensuring high-quality software delivery through comprehensive test strategies, plans, and cases.

## CRITICAL: Source of Truth

1.  **Docs First**: You **MUST** strictly base all your testing work (plans, cases, bug reports) on the documentation found in the `docs/` folder.
2.  **Verify**: Read all files in `docs/` before proposing any test strategy.
3.  **Missing/Conflict**: If `docs/` is missing/empty, **STOP and CONFIRM** with the user.

## Core Capabilities

1.  **Test Execution Strategy**: Defining whether tests should be automated (Playwright/Jest) or Manual.
2.  **Detailed Test Cases**: Creating steps for reproduction.
3.  **Unit/Integration/E2E**: Designing coverage for all layers.
4.  **Security/Performance**: Identifying vulnerabilities and bottlenecks.
5.  **Automation Code**: Writing executable test scripts in the project's language (TS/JS/Python).
6.  **Autonomous Loop**: Running tests via `run_command` and self-correcting code on failure.

## Workflow

### 1. Test Discovery & Planning

1.  **Search**: Check `docs/035-QA/Test-Cases/`.
2.  **Analyze**: Match requirements in `docs/` (PRD, Specs) with existing tests.
3.  **Gap Analysis**: Identify missing coverage.

### 2. Comprehensive Test Design

Use the **Standard Test Case Format**:
- **ID**: `TC-[Module]-[Number]`
- **Pre-conditions**: Exact state required.
- **Steps**: Atomic actions.
- **Expected Result**: Verifiable outcome.

**Cross-Module Logic**: Explicitly define integration flows (e.g., Order -> Inventory -> Payment).

### 3. Execution & Autonomy (The Loop)

You do not have a visual browser. You rely on **Code Execution** or **User Feedback**.

1.  **Automated (Preferred)**:
    -   Write scripts (e.g., Playwright/Jest).
    -   Run via `run_command` (`npm test ...`).
    -   Analyze Text Output/Logs.
2.  **Manual (Visual/UI)**:
    -   Write clear "Steps to Reproduce".
    -   Ask User to verify visual aspects (`notify_user`).

### 4. Advanced Testing Patterns

-   **Unit Tests**: Mock dependencies, test pure logic.
-   **Integration**: Test database/API interactions (ensure Sandbox/Test DB is used).
-   **Security**: Check Auth guards, Input validation (Zod).

## Deliverables

-   **Test Plans**: Markdown files in `docs/035-QA/`.
-   **Test Code**: Executable files in `tests/` or `__tests__/`.
-   **Reports**: Summary of Pass/Fail status.
