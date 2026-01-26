---
name: planning
description: Create detailed implementation plans from raw input (research reports, feature requests, requirements). Produces master plan (plan.md) with overview, phases table, architecture, and individual phase files (phase-XX-name.md) with actionable tasks, code snippets, deliverables, and validation criteria. Use when creating implementation roadmaps, breaking down complex features, architecting systems, or converting research into actionable development plans.
version: 1.0.0
license: MIT
---

# Planning Extension

Transform raw input into structured, actionable implementation plans with master plan and phase breakdowns.

## When to Use

- Converting research reports into implementation plans
- Breaking down feature requests into phases
- Creating development roadmaps from requirements
- Architecting new systems or features
- Planning complex multi-phase implementations

## Core Principles

**YAGNI - KISS - DRY**: No over-engineering. Simple solutions. No duplication.

**Be direct**: Concise, actionable, no fluff.

## Workflow

1. **Analyze Input** → `references/input-analysis.md`
   - Extract requirements from raw input (research reports, feature requests)
2. **Research (optional)** → `references/research-phase.md`
   - Skip if provided with researcher reports
3. **Codebase Understanding (optional)** → `references/codebase-understanding.md`
   - Skip if provided with scout reports
4. **Solution Design** → `references/solution-design.md`
   - Trade-off analysis, security, performance considerations
5. **Plan Organization** → `references/plan-organization.md`
   - Directory structure, active plan state tracking
6. **Structure Master Plan** → `references/plan-structure.md`
7. **Write Phase Files** → `references/phase-template.md`
8. **Validate Output** → `references/output-standards.md`

## Output Structure

```
plans/{date}-{plan-name}/
├── research/              # Research reports (Step 1)
├── scout/                 # Scout reports (Step 2)
├── reports/               # Agent reports (Steps 5-7)
├── artifacts/             # Orchestrator checklists
│   └── phase-XX-{name}.md
├── plan.md                # Main plan overview (<80 lines)
└── phase-XX-{name}/
    └── phase.md           # Detailed phase documentation
```

## Master Plan Sections (plan.md)

| Section | Content |
|---------|---------|
| Overview | 2-3 sentence summary |
| Status | Created date, current phase, progress % |
| Architecture | ASCII diagram or mermaid, component list |
| Phases Table | #, Name, Description, Status |
| File Structure | Target directory tree |
| Tech Stack | Languages, frameworks, tools |
| Risk Mitigation | Key risks and solutions |
| Success Criteria | Measurable outcomes |
| Next Steps | Immediate actions |

## Phase File Sections (phase-XX-name.md)

| Section | Content |
|---------|---------|
| Objective | Single sentence goal |
| Prerequisites | Required completions |
| Tasks | Numbered tasks with implementation details |
| Deliverables | Checkbox list of outputs |
| Validation Criteria | How to verify completion |
| Test Cases | Scenarios to verify |
| Dependencies | What this phase requires |
| Next Phase | Link to next phase |

## Task Format

Each task includes: **Title** → **File path** → **Implementation snippet** → **Numbered steps**

See `references/phase-template.md` for complete template with examples.

## Rules

- DO NOT implement code, only plan
- Phases: 4-8 phases typical, each self-contained
- Tasks: 3-7 tasks per phase, specific and actionable
- Code snippets: Include for clarity, not full implementation
- File paths: Always specify target file paths
- No time estimates: Focus on what, not when

Load references for detailed guidance on each workflow step.