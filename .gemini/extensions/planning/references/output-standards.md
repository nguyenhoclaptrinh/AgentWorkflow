# Output Standards

Quality standards and validation for implementation plans.

## Plan Quality Checklist

### Master Plan (plan.md)

| Criterion | Check |
|-----------|-------|
| Overview | Clear 2-3 sentence summary |
| Architecture | Diagram present and accurate |
| Phases | 4-8 phases, logically ordered |
| Dependencies | All phase dependencies mapped |
| File Structure | Target files/folders listed |
| Tech Stack | All technologies specified |
| Success Criteria | Measurable outcomes defined |

### Phase Files (phase-XX-name.md)

| Criterion | Check |
|-----------|-------|
| Objective | Single sentence, clear goal |
| Prerequisites | All requirements listed |
| Tasks | 3-7 tasks, each with file path |
| Code Snippets | Intent-showing, not full code |
| Steps | Numbered, actionable items |
| Deliverables | Checkbox list of outputs |
| Validation | Measurable criteria |
| Test Cases | At least 2 scenarios |

## Common Issues to Avoid

### Vague Tasks
**Bad**: "Set up the database"
**Good**: "Create PostgreSQL schema with users, sessions, and logs tables"

### Missing File Paths
**Bad**: "Create the component"
**Good**: `**File**: src/components/LoginForm.tsx`

### No Validation Criteria
**Bad**: Just list deliverables
**Good**: Include how to verify (e.g., "npm test passes", "API returns 200")

### Over-specification
**Bad**: Full 200-line implementation in plan
**Good**: 10-20 line snippet showing structure/approach

### Missing Dependencies
**Bad**: Tasks that assume implicit setup
**Good**: Explicit prerequisite listing

## Final Validation Steps

1. **Read through entire plan** - Does flow make sense?
2. **Check phase order** - Can each phase start when its prereqs complete?
3. **Verify deliverables** - Do they match phase objectives?
4. **Test criteria check** - Can someone verify completion objectively?
5. **File paths audit** - All referenced files have paths?

## Deliverable Format

After plan completion, respond with:

```
Plan created at: plans/{date}-{name}/

Files:
- plan.md (master plan)
- phase-01-{name}.md
- phase-02-{name}.md
- ...

Summary:
{2-3 sentences about what the plan covers}

Next step: Execute Phase 1
```