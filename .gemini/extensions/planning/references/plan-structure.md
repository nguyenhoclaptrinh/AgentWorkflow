# Plan Structure

Master plan (plan.md) template and guidelines.

## File Naming

```
plans/{YYMMDD}-{plan-name}/
└── plan.md
```

Date format: YYMMDD (e.g., 260104 for Jan 4, 2026)
Name: kebab-case, descriptive (e.g., video-to-app, user-auth)

## Master Plan Template

```markdown
# {Feature Name} - Master Implementation Plan

## Overview
{2-3 sentence description of what this plan accomplishes}

## Status
- Created: {YYYY-MM-DD}
- Current Phase: Planning
- Progress: 0%

## Architecture Summary

\`\`\`
{ASCII diagram showing component flow}

Components:
- Component 1: Description
- Component 2: Description
\`\`\`

## Phases Overview

| # | Phase | Description | Status |
|---|-------|-------------|--------|
| 1 | {Phase Name} | {Brief description} | Pending |
| 2 | {Phase Name} | {Brief description} | Pending |

## File Structure (Target)

\`\`\`
project/
├── folder/
│   └── file.ext
└── ...
\`\`\`

## Phase Details
- Phase 1: `./phase-01-name.md`
- Phase 2: `./phase-02-name.md`

## Tech Stack
- **Category**: Technology (reason)

## Risk Mitigation
1. Risk → Mitigation strategy
2. Risk → Mitigation strategy

## Success Criteria
- Criterion 1
- Criterion 2

## Next Steps
1. First action to take
2. Second action to take
```

## Phase Identification

### Typical Phase Patterns

| Pattern | Phases |
|---------|--------|
| New Feature | Foundation → Core Logic → Integration → Testing |
| API Development | Setup → Endpoints → Auth → Validation → Docs |
| UI Feature | Components → State → Styling → Interactions → Polish |
| Refactoring | Analysis → Extract → Migrate → Cleanup → Verify |

### Phase Sizing

- **Min**: 3 tasks per phase
- **Max**: 7 tasks per phase
- **Ideal**: 4-5 tasks per phase
- If >7 tasks, split into sub-phases

### Dependencies

Always identify:
- What each phase requires to start
- What each phase produces
- Critical path through phases