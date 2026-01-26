# Code Snippets & Implementation Patterns

Guidelines for capturing latest-approach code in research reports.

## Purpose

Research reports should include actionable code snippets so planners can:
- Understand current best practices at implementation level
- Copy/adapt patterns directly into plans
- Avoid outdated approaches

## Code Gathering Strategy

During research, actively collect:

### 1. Official Quick Start Examples
```
Sources: Official docs "Getting Started" / "Quick Start" sections
Priority: Highest - reflects maintainer-recommended approach
```

### 2. Production Patterns
```
Sources: GitHub repos with >1k stars, tech company engineering blogs
Priority: High - battle-tested in real applications
```

### 3. Migration Examples
```
Sources: Upgrade guides, "What's New" docs, release notes
Priority: High for evolving tech - shows latest vs deprecated
```

### 4. Anti-Patterns (What NOT to do)
```
Sources: Security advisories, "Common Mistakes" articles
Priority: Critical for avoiding pitfalls
```

## Code Snippet Format

Each snippet in report should include:

```markdown
### [Pattern Name]

**Use when:** [specific scenario]
**Source:** [URL with date accessed]
**Version:** [library/framework version]

\`\`\`language
// Latest approach (2025)
code here
\`\`\`

**Why this approach:**
- Reason 1
- Reason 2

**Avoid (deprecated):**
\`\`\`language
// Old approach - don't use
deprecated code
\`\`\`
```

## Essential Snippets Per Topic

| Topic | Must Include |
|-------|--------------|
| Libraries | setup, basic usage, config, error handling |
| APIs | auth, request/response, pagination, errors |
| Architecture | directory structure, core abstractions, data flow |

**Always specify versions** (e.g., Node 22.x, React 19.x)

## Code Validation Checklist

Before including snippet:
- [ ] Syntax is correct (no typos)
- [ ] Imports are complete
- [ ] Version matches documentation
- [ ] Not deprecated in latest release
- [ ] Security best practices followed
