# Documentation Contributing Guide

## Overview
This guide explains how to contribute documentation to the analytics-frontend-scaffold project. We follow a structured approach where each day has a planning document and a completion document.

## Documentation Structure

### Daily Documentation Pattern
Each development day follows this pattern:

1. **Planning Document** (`DAY-X-PLAN.md`)
   - Created at the start of the day
   - Contains detailed tasks, schedules, and decisions to make
   - Serves as the working guide for the day

2. **Completion Document** (`DAY-X-COMPLETE.md`)
   - Created at the end of the day
   - Records what was actually built
   - Documents all decisions made
   - Includes metrics and benchmarks
   - Serves as the permanent record

### Document Locations
All documentation lives in the `/docs` directory:
```
/docs/
  ├── DAY-1-COMPLETE.md      # Day 1 final record
  ├── DAY-2-PLAN.md          # Day 2 working plan
  ├── DAY-2-COMPLETE.md      # Day 2 final record (created end of day)
  ├── CONTRIBUTING-DOCS.md   # This file
  ├── THEME.md               # Theme system docs
  ├── STATE.md               # State management docs
  └── ...                    # Feature-specific docs
```

## Writing Planning Documents

### Structure for DAY-X-PLAN.md
```markdown
# Day X Detailed Plan: [Title]

## Overview
Brief description of the day's main objectives.

## Critical Path Items
1. **Item 1** - Why it's critical
2. **Item 2** - Why it's critical

## Schedule & Tasks

### 9:00-10:30: [Morning Task Block]
**Goal**: What we're achieving

**Tasks**:
1. Specific task with details
2. Another task
   - Subtask
   - Subtask

**Deliverable**: What exists after this block

### [Continue with time blocks through the day]

## Critical Decisions Log
Document decisions that need to be made

## Success Metrics
- [ ] Metric 1
- [ ] Metric 2

## Risk Mitigation
If behind schedule, what to cut

## Dependencies for Day X+1
What must be complete for tomorrow
```

### Planning Best Practices
- Be specific about file paths and component names
- Include code examples for complex patterns
- Set realistic time estimates
- Define clear deliverables for each time block
- Include decision points with recommendations

## Writing Completion Documents

### Structure for DAY-X-COMPLETE.md
```markdown
# Day X Complete Setup Documentation

## Overview
Summary of what was accomplished.

## Project Information
- Current versions
- Key dependencies added

## Technology Stack (As Built)
What was actually implemented vs planned

## Completed Setup Checklist
### ✅ Section Name
- [x] Task completed
- [x] Another task completed
- [ ] Task not completed (moved to Day X+1)

## Key Decisions Log
### 1. Decision Topic
**Decision**: What was decided
**Confidence**: X/10 (consensus if applicable)
**Rationale**: Why this decision

## Configuration Files Created
Document any config files with examples

## Issues Resolved
### 1. Issue Name
**Issue**: What went wrong
**Solution**: How it was fixed

## Build Benchmark Results
Performance metrics, build times, bundle sizes

## Next Steps (Day X+1)
What's planned for tomorrow

## Team Onboarding Notes
Key information for team members

---
*Document created: YYYY-MM-DD*
*Last updated: Day X completion*
```

### Completion Best Practices
- Record actual outcomes, not planned ones
- Include all consensus/decision rationale
- Document workarounds and fixes
- Measure and record performance metrics
- Note what was deferred and why

## Feature Documentation

### When to Create Feature Docs
Create a dedicated feature document when:
- A system spans multiple days
- Complex patterns need detailed explanation
- Multiple team members will use the feature
- External documentation is needed

### Feature Doc Structure
```markdown
# [Feature Name]

## Overview
What this feature/system does

## Architecture
How it's structured

## Usage
### Basic Example
```typescript
// Code example
```

### Advanced Patterns
More complex usage

## API Reference
Detailed API documentation

## Troubleshooting
Common issues and solutions

## Related Documentation
- Link to other docs
```

## Documentation Standards

### Writing Style
- Use clear, concise language
- Prefer bullet points over long paragraphs
- Include code examples liberally
- Explain the "why" not just the "what"

### Code Examples
- All code must be properly formatted
- Include TypeScript types
- Show both usage and implementation
- Test examples before documenting

### Versioning
- Date all documents
- Note last updated time
- Track major changes in git commits
- Archive outdated docs rather than delete

## Review Process

### Before Merging
1. Ensure planning docs are complete before starting work
2. Update completion docs at day's end
3. Cross-reference related documentation
4. Verify code examples work
5. Check for broken links

### Documentation Debt
- Track incomplete docs in TODO.md
- Schedule documentation updates
- Keep docs synchronized with code

## Tools and Resources

### Recommended Tools
- **Markdown Preview**: VS Code Markdown Preview Enhanced
- **Diagrams**: Mermaid for architecture diagrams
- **Screenshots**: Include for UI documentation
- **Linting**: markdownlint for consistency

### Templates
Find templates in `/docs/templates/`:
- `day-plan-template.md`
- `day-complete-template.md`
- `feature-doc-template.md`

## Questions?
For documentation questions:
1. Check existing docs for patterns
2. Ask in #docs Slack channel
3. Create an issue with [docs] label

---
*Last updated: 2025-07-05*