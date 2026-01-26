# Phase Template

Template and guidelines for individual phase files.

## File Naming

```
phase-{XX}-{kebab-case-name}.md
```

Examples:
- `phase-01-foundation.md`
- `phase-02-video-processing.md`
- `phase-03-ui-extraction.md`

## Phase File Template

```markdown
# Phase {N}: {Phase Name}

## Objective
{Single sentence describing what this phase accomplishes}

## Prerequisites
- {List of requirements before starting}
- {Previous phases, tools, credentials, etc.}

## Tasks

### {N}.1 {Task Name}
{Brief description of the task}

**File**: `{path/to/target/file.ext}`

**Implementation**:
\`\`\`{language}
// Key code snippet or pseudocode
// Not full implementation, just clarity
\`\`\`

**Steps**:
1. {First step}
2. {Second step}
3. {Third step}

### {N}.2 {Task Name}
{Repeat task format...}

## Deliverables
- [ ] `{file-1.ext}` - {description}
- [ ] `{file-2.ext}` - {description}

## Validation Criteria
- {How to verify task completion}
- {Expected output/behavior}

## Test Cases
1. {Test scenario 1}
2. {Test scenario 2}

## Dependencies
- {What this phase requires from previous phases}

## Next Phase
Phase {N+1}: {Next Phase Name}
```

## Task Writing Guidelines

### Good Task
```markdown
### 2.3 Create Gemini API Client
Wrapper for Gemini API video analysis calls.

**File**: `scripts/gemini-client.py`

**Implementation**:
\`\`\`python
class GeminiClient:
    def __init__(self, api_key: str):
        self.client = genai.configure(api_key)

    def analyze_video(self, video_path: str, prompt: str) -> dict:
        # Upload file, send request, parse response
        pass
\`\`\`

**Steps**:
1. Create GeminiClient class with API key config
2. Implement upload_file method
3. Implement analyze_video method
4. Add retry logic for transient failures
```

### Bad Task
```markdown
### 2.3 API Integration
Set up the API client and make it work with videos.
```

## Checklist Before Finalizing Phase

- [ ] Each task has specific file path
- [ ] Code snippets show intent, not full implementation
- [ ] Steps are numbered and actionable
- [ ] Deliverables match tasks
- [ ] Validation criteria are measurable
- [ ] Dependencies clearly stated