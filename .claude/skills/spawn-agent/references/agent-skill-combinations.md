# Agent-Skill Combination Guide

## Overview

This guide explains the BM25 search engine for finding optimal agent-skill combinations.

## How Search Works

### 1. Query Processing

```
User Query: "implement stripe payment checkout"
     |
     v
+-------------------+
| Synonym Expansion |  "implement" -> "implement, build, create, develop"
+-------------------+
     |
     v
+-------------------+
| Intent Detection  |  "implement" -> execute
+-------------------+
     |
     v
+-------------------+
| Domain Detection  |  "stripe, payment, checkout" -> payment
+-------------------+
     |
     v
+-------------------+
| Complexity Check  |  (no keywords) -> standard
+-------------------+
     |
     v
+-------------------+
| BM25 Search       |  Search combinations.csv
+-------------------+
     |
     v
Result: code-executor + payment-integration|backend-development
```

### 2. BM25 Algorithm

The search uses BM25 (Best Match 25) ranking:
- **TF (Term Frequency)**: How often query terms appear in document
- **IDF (Inverse Document Frequency)**: How rare terms are across all documents
- **Document Length Normalization**: Adjusts for document length

Parameters: `k1=1.5`, `b=0.75`

## Intent Mapping

| Intent | Agent | Primary Keywords |
|--------|-------|------------------|
| `research` | researcher | research, investigate, explore, analyze, study, examine |
| `plan` | planner | plan, design, architecture, roadmap, strategy, blueprint |
| `execute` | code-executor | implement, build, create, add, develop, write, code |
| `debug` | debugger | debug, fix, troubleshoot, error, bug, crash, broken |
| `review` | code-reviewer | review, audit, assess, check, inspect |
| `test` | tester | test, verify, validate, qa, coverage |
| `design` | ui-ux-designer | beautiful, stunning, gorgeous, ui design, ux design |
| `docs` | docs-manager | document, documentation, readme, api docs |
| `git` | git-manager | commit, push, merge, branch, pr, pull request |
| `manage` | project-manager | status, progress, milestone, sprint |

## Domain Mapping

| Domain | Base Skills | Keywords |
|--------|-------------|----------|
| `frontend` | frontend-design | react, vue, svelte, tailwind, css, component |
| `backend` | backend-development | api, endpoint, server, middleware, rest, graphql |
| `auth` | better-auth, backend-development | login, oauth, jwt, authentication, session |
| `payment` | payment-integration | stripe, checkout, billing, subscription |
| `database` | databases | prisma, postgresql, mysql, mongodb, query |
| `mobile` | mobile-development | react native, flutter, ios, android |
| `fullstack` | web-frameworks, backend-development | next.js, nuxt, sveltekit, remix |
| `ecommerce` | shopify | shopify, cart, product, order |
| `ai` | ai-multimodal | llm, openai, claude, gemini, chatbot |
| `media` | ai-multimodal, media-processing | image, video, audio, upload, ocr |
| `codebase` | repomix | codebase, repository, code analysis |

## Complexity Levels

| Level | Keywords | Max Skills |
|-------|----------|------------|
| `simple` | quick, simple, basic, minor, easy | 1 |
| `standard` | (default - no keywords) | 2 |
| `full` | comprehensive, complete, thorough, detailed | 3 |
| `complex` | enterprise, advanced, sophisticated, production | 5 |

## Common Combinations by Task Type

### Research Tasks

| Task | Agent | Skills |
|------|-------|--------|
| General research | researcher | research |
| Deep analysis | researcher | research, sequential-thinking |
| Backend research | researcher | research, backend-development |
| Codebase analysis | researcher | repomix, research |
| Media analysis | researcher | ai-multimodal, media-processing |

### Implementation Tasks

| Task | Agent | Skills |
|------|-------|--------|
| Backend API | code-executor | backend-development |
| With database | code-executor | backend-development, databases |
| Authentication | code-executor | backend-development, better-auth |
| Payment | code-executor | payment-integration, backend-development |
| Frontend UI | code-executor | frontend-design |
| Beautiful UI | code-executor | frontend-design, ui-ux-pro-max |
| Next.js | code-executor | web-frameworks |
| Fullstack | code-executor | backend-development, web-frameworks |
| Mobile | code-executor | mobile-development |

### Debugging Tasks

| Task | Agent | Skills |
|------|-------|--------|
| General debug | debugger | debugging |
| Complex issues | debugger | debugging, sequential-thinking |
| Frontend bugs | debugger | debugging, chrome-devtools |
| Backend bugs | debugger | debugging, backend-development |
| Database issues | debugger | debugging, databases |
| Next.js errors | debugger | debugging, web-frameworks |
| Auth errors | debugger | debugging, better-auth |

### Design Tasks

| Task | Agent | Skills |
|------|-------|--------|
| Basic UI | ui-ux-designer | frontend-design |
| Professional UI | ui-ux-designer | ui-ux-pro-max, frontend-design |
| Dashboard | ui-ux-designer | ui-ux-pro-max, ui-styling |
| Mobile UI | ui-ux-designer | mobile-development, ui-ux-pro-max |
| Landing page | ui-ux-designer | ui-ux-pro-max, frontend-design, frontend-design-pro |

## Using the Search CLI

### Basic Search

```bash
gk agent search "implement user authentication"
```

Output:
```
Search results for: "implement user authentication"

  1. code-executor (score: 12.5)
     Skills: backend-development, better-auth
     
  Suggested command:
    gk agent spawn -a code-executor -s "backend-development,better-auth" -p "implement user authentication"
```

### Search Options

```bash
# Limit results
gk agent search "debug payment" -n 3

# JSON output
gk agent search "build api" --json
```

## Data Files

### combinations.csv

Main search database with columns:
- `id`: Unique identifier
- `agent`: Agent profile name
- `skills`: Pipe-separated skills
- `intent`: Task intent category
- `domain`: Technology domain
- `complexity`: Complexity level
- `keywords`: Searchable keywords
- `description`: Human-readable description
- `use_when`: When to use this combination

### intents.csv

Intent keyword mappings:
- `intent`: Intent name
- `agent`: Default agent
- `primary_keywords`: Main keywords
- `expanded_keywords`: Related terms
- `action_verbs`: Action words

### domains.csv

Domain skill mappings:
- `domain`: Domain name
- `base_skills`: Core skills
- `enhanced_skills`: Additional skills
- `keywords`: Domain keywords
- `frameworks`: Related frameworks

### synonyms.csv

Query expansion:
- `word`: Original word
- `synonyms`: Comma-separated synonyms
- `category`: Word category

## Best Practices

1. **Be Specific**: Include domain keywords
   - Bad: "build form"
   - Good: "build React form with Zod validation"

2. **Use Action Verbs**: Start with intent keywords
   - "research..." -> researcher
   - "implement..." -> code-executor
   - "debug..." -> debugger

3. **Include Framework Names**: Better domain detection
   - "stripe payment" -> payment domain
   - "next.js api" -> fullstack domain

4. **Specify Complexity**: When needed
   - "simple fix" -> simple complexity
   - "comprehensive audit" -> full complexity
