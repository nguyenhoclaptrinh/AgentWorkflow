---
name: spawn-agent
description: Delegate tasks to Gemini sub-agents with intelligent BM25 search for optimal agent-skill combinations. Supports intent/domain/complexity detection and synonym expansion.
license: MIT
version: 2.0.0-mvp
---

# Spawn Gemini Agents

Delegate tasks to specialized Gemini sub-agents with intelligent search for optimal agent-skill combinations.

```
+------------------+
|  Gemini (You)    |  Main coordinator
+--------+---------+
         | gk agent spawn
    +----+----+----+
    v    v    v    v
  [Gemini Sub-Agents]
```

## Quick Start

```bash
# Search for best agent-skill combination
gk agent search "implement stripe payment integration"

# Spawn with recommended combination
gk agent spawn -a code-executor -s "payment-integration,backend-development" -p "Implement Stripe checkout"
```

## CLI Commands

### Search for Optimal Combination

```bash
gk agent search "<task description>"
```

Returns ranked results with:
- **Agent**: Best agent for the task
- **Skills**: Optimal skill combination
- **Score**: BM25 relevance score
- **Suggested command**: Ready-to-use spawn command

### Spawn Agent

```bash
gk agent spawn [options]
```

| Option | Short | Description |
|--------|-------|-------------|
| `--prompt` | `-p` | Task for sub-agent (required) |
| `--agent` | `-a` | Agent profile name |
| `--skills` | `-s` | Comma-separated skills |
| `--model` | `-m` | Model override |
| `--music` | | Enable elevator music |
| `--no-music` | | Disable elevator music |

### List Agents

```bash
gk agent list
```

### Agent Info

```bash
gk agent info <agent-name>
```

## Search Engine

The search uses **BM25 algorithm** with:

### Intent Detection

Automatically detects task intent from keywords:

| Intent | Keywords | Agent |
|--------|----------|-------|
| `research` | research, investigate, explore, analyze | `researcher` |
| `plan` | plan, design, architecture, roadmap | `planner` |
| `execute` | implement, build, create, add | `code-executor` |
| `debug` | debug, fix, troubleshoot, error | `debugger` |
| `review` | review, audit, assess | `code-reviewer` |
| `test` | test, verify, validate | `tester` |
| `design` | beautiful, stunning, ui design | `ui-ux-designer` |
| `docs` | document, write docs | `docs-manager` |
| `git` | commit, push, merge, branch | `git-manager` |

### Domain Detection

Identifies technology domain:

| Domain | Keywords |
|--------|----------|
| `frontend` | react, vue, tailwind, component |
| `backend` | api, endpoint, server, middleware |
| `auth` | login, oauth, authentication, jwt |
| `payment` | stripe, checkout, billing, subscription |
| `database` | prisma, postgresql, query, migration |
| `mobile` | react native, flutter, ios, android |
| `fullstack` | next.js, nuxt, sveltekit |
| `ecommerce` | shopify, cart, checkout |
| `ai` | llm, openai, chatbot, embedding |
| `media` | image, video, upload, ocr |

### Complexity Detection

Determines skill count based on keywords:

| Complexity | Keywords | Max Skills |
|------------|----------|------------|
| `simple` | quick, simple, basic | 1 |
| `standard` | (default) | 2 |
| `full` | comprehensive, complete, thorough | 3 |
| `complex` | enterprise, advanced, sophisticated | 5 |

### Synonym Expansion

Query terms are expanded using synonyms for better matching:
- "build" -> build, create, implement, develop
- "fix" -> fix, debug, repair, troubleshoot
- "check" -> check, review, audit, verify

## Examples

### Research Tasks

```bash
# Simple research
gk agent spawn -a researcher -s research -p "Research JWT best practices"

# Deep codebase analysis
gk agent spawn -a researcher -s "repomix,research" -p "Analyze project architecture"

# Backend research
gk agent spawn -a researcher -s "research,backend-development" -p "Research API design patterns"
```

### Implementation Tasks

```bash
# Backend API
gk agent spawn -a code-executor -s backend-development -p "Implement user registration API"

# Payment integration
gk agent spawn -a code-executor -s "payment-integration,backend-development" -p "Implement Stripe checkout"

# Beautiful UI
gk agent spawn -a code-executor -s "frontend-design,ui-ux-pro-max" -p "Create stunning pricing page"

# Fullstack auth
gk agent spawn -a code-executor -s "backend-development,better-auth,web-frameworks" -p "Implement OAuth login"
```

### Debugging Tasks

```bash
# General debugging
gk agent spawn -a debugger -s debugging -p "Fix login error"

# Database issues
gk agent spawn -a debugger -s "debugging,databases" -p "Debug slow query performance"

# Next.js errors
gk agent spawn -a debugger -s "debugging,web-frameworks" -p "Fix hydration mismatch error"
```

### Design Tasks

```bash
# UI design
gk agent spawn -a ui-ux-designer -s "ui-ux-pro-max,frontend-design" -p "Design user dashboard"

# Mobile design
gk agent spawn -a ui-ux-designer -s "mobile-development,ui-ux-pro-max" -p "Design mobile app navigation"
```

## Available Agents

| Agent | Purpose | Default Skills |
|-------|---------|----------------|
| `researcher` | Research, investigation, analysis | `research` |
| `planner` | Architecture, planning, roadmaps | `planning` |
| `code-executor` | Implementation, development | varies by domain |
| `debugger` | Bug fixing, troubleshooting | `debugging` |
| `tester` | Testing, validation | `testing` |
| `code-reviewer` | Code review, security audit | `code-review` |
| `ui-ux-designer` | UI/UX design | `frontend-design` |
| `docs-manager` | Documentation | `planning` |
| `git-manager` | Git operations | `planning` |

## Data Files

Search data stored in `.gemini/extensions/spawn-agent/data/`:

| File | Purpose |
|------|---------|
| `combinations.csv` | Agent-skill combinations with keywords |
| `intents.csv` | Intent keywords and mappings |
| `domains.csv` | Domain keywords and skills |
| `synonyms.csv` | Query expansion synonyms |

## Elevator Music

Enable for long-running tasks:

```bash
# Enable for single spawn
gk agent spawn -a researcher -p "Deep research task" --music

# Configure default
gk config set spawn.music true
```

## Configuration

In `.gemini/.gk.json`:

```json
{
  "spawn": {
    "defaultModel": "gemini-2.5-flash",
    "music": false,
    "musicFile": null
  }
}
```

## References

- `./references/agent-skill-combinations.md` - Full combination guide
- `./data/combinations.csv` - Searchable combinations database
