---
name: research
description: This skill should be used for autonomous multi-step research, technical analysis, and solution planning. Activates when users need comprehensive investigation of technologies, best practices, security considerations, or implementation strategies. Produces structured research reports with verified sources, latest-approach code patterns for planners, and actionable recommendations.
license: MIT
version: 2.0.0
---

# Research Skill

Autonomous research agent for technical investigation and analysis.

**Core Principles:** YAGNI, KISS, DRY. Be honest, brutal, straight to the point, concise.

## Workflow Overview

Execute research in 4 phases sequentially:

1. **Scope** - Define boundaries, terms, recency requirements
2. **Gather** - Multi-source parallel search with verification
3. **Analyze** - Cross-reference, identify patterns, evaluate trade-offs
4. **Report** - Generate structured markdown report

See `references/methodology.md` for detailed phase instructions.

## Quick Start

```
1. Clarify research scope with user (ask if unclear)
2. Run parallel WebSearch calls (max 5 searches)
3. Fetch key sources with WebFetch for deep analysis
4. Cross-validate findings across sources
5. Generate report using references/report-template.md
```

## Search Strategy

Run **parallel searches** for efficiency:
- Include year "2025" or "2026" for current information
- Use terms: "best practices", "security", "performance", "production"
- Target: official docs, GitHub repos, authoritative blogs
- Prioritize: major tech companies, recognized experts, conferences

**Search limit:** Max 5 WebSearch calls per research task.

## Source Validation (Critical)

Never trust citations blindly:
- Verify URLs actually exist via WebFetch
- Confirm sources support stated claims
- Check publication dates for currency
- Cross-reference across 2+ independent sources
- Flag conflicting information explicitly

See `references/quality-standards.md` for validation checklist.

## Report Generation

Save reports to: `./plans/<plan-name>/reports/{date}-<topic>.md`

Use template: `references/report-template.md`

Required sections:
- Executive Summary (2-3 paragraphs)
- Key Findings (technology, trends, best practices, security, performance)
- **Code Patterns** - Latest approach snippets for planners (see `references/code-snippets.md`)
- Implementation Recommendations
- Sources with hyperlinks

## Output Rules

- Reports: markdown with proper syntax highlighting
- Include mermaid/ASCII diagrams where helpful
- List unresolved questions at end
- Sacrifice grammar for concision
- Always cite sources with clickable links

## Special Considerations

| Topic Type | Additional Checks |
|------------|-------------------|
| Security | Recent CVEs, security advisories |
| Performance | Benchmarks, real-world case studies |
| New Tech | Community adoption, support levels |
| APIs | Endpoint availability, auth requirements |
| Legacy | Deprecation warnings, migration paths |

## References

- `references/methodology.md` - Detailed 4-phase research process
- `references/report-template.md` - Full report structure template
- `references/quality-standards.md` - Source validation & quality checklist
- `references/code-snippets.md` - Code pattern format & validation for planners
