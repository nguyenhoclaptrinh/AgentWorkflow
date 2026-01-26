# Input Analysis

How to analyze raw input before creating implementation plan.

## Input Types

| Type | Characteristics | Extraction Focus |
|------|-----------------|------------------|
| Research Report | Findings, recommendations, options | Key findings, best practices, risks |
| Feature Request | User story, requirements | Core functionality, constraints, acceptance criteria |
| Bug Report | Issue description, repro steps | Root cause, affected areas, fix scope |
| Technical Spec | Architecture, interfaces | Components, dependencies, integration points |

## Analysis Checklist

1. **Identify Core Objective**: What problem are we solving? (1 sentence)
2. **Extract Requirements**: Functional and non-functional needs
3. **List Constraints**: Tech stack, timeline, dependencies
4. **Identify Components**: Major pieces to build
5. **Map Dependencies**: What depends on what
6. **Assess Risks**: What could go wrong

## Extraction Patterns

### From Research Reports
```
Look for:
- "Key Findings" → Core requirements
- "Recommendations" → Implementation approach
- "Best Practices" → Quality standards
- "Risks/Concerns" → Mitigation strategies
- "Unresolved Questions" → Areas needing clarification
```

### From Feature Requests
```
Look for:
- User story → Objective
- Acceptance criteria → Validation requirements
- Mockups/wireframes → UI requirements
- Edge cases → Test scenarios
```

## Output

After analysis, should have clear understanding of:
- **What** to build (features/components)
- **Why** we're building it (objective)
- **How** to validate success (criteria)
- **What** could block progress (risks)

Proceed to plan structure with these inputs documented.