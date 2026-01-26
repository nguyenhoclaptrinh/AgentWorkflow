# Research Methodology

Detailed 4-phase autonomous research process.

## Phase 1: Scope Definition

Before searching, clearly define:

**Key Questions:**
- What specific problem/technology needs investigation?
- What decisions will this research inform?
- How current must information be? (last 6mo/1yr/any)
- What depth required? (overview/comprehensive/expert-level)

**Deliverables:**
- List of 3-5 key terms/concepts to investigate
- Evaluation criteria for sources (authority, recency, relevance)
- Research boundaries (what's in/out of scope)

**Ask user if unclear** - better to clarify upfront than waste searches.

## Phase 2: Information Gathering

### Search Execution

Run WebSearch calls **in parallel** for efficiency:

```
Example parallel searches for "React Server Components":
1. "React Server Components best practices 2025"
2. "React Server Components security performance"
3. "React Server Components vs client components comparison"
4. "Next.js RSC production implementation"
```

### Deep Content Analysis

After initial search, use WebFetch on promising URLs:
- Official documentation pages
- GitHub README files from popular repos
- Technical blog posts from recognized experts
- Conference talk transcripts

### Code Snippet Collection

**Critical for planners** - gather implementation patterns:
- Official "Quick Start" / "Getting Started" examples
- Production patterns from high-star GitHub repos
- Migration examples showing old vs new approaches
- Anti-patterns to explicitly avoid

See `code-snippets.md` for format and validation checklist.

### Source Prioritization

**Tier 1 (Highest trust):**
- Official documentation (docs.*, *.dev)
- Major tech company engineering blogs
- Peer-reviewed papers (arxiv, ACM, IEEE)

**Tier 2 (Verify claims):**
- Popular GitHub repos (>1k stars)
- Conference talks (GopherCon, ReactConf, etc.)
- Recognized expert blogs

**Tier 3 (Cross-reference required):**
- Medium articles, Dev.to posts
- Stack Overflow answers
- Tutorial sites

## Phase 3: Analysis & Synthesis

### Pattern Identification
- Common recommendations across sources
- Consensus vs controversial approaches
- Trade-offs between different solutions

### Critical Evaluation
- Maturity/stability of technologies
- Security implications (CVEs, known vulnerabilities)
- Performance characteristics (benchmarks, real-world data)
- Integration/compatibility requirements

### Gap Analysis
- What questions remain unanswered?
- What conflicting information needs resolution?
- What additional research might be needed?

## Phase 4: Report Generation

Use `report-template.md` structure.

**Writing Guidelines:**
- Lead with actionable insights
- Use code examples where helpful
- Include architecture diagrams (mermaid)
- Cite every factual claim
- List limitations/caveats explicitly
