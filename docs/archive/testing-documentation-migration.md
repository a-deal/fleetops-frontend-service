> ⚠️ **ARCHIVED**: This document is preserved for historical context.
> See [../testing-comprehensive-guide.md](./../testing-comprehensive-guide.md) for current practices.

# Testing Documentation Migration Plan

> **Purpose**: Guide for consolidating our testing documentation
> **Created**: 2025-07-06

## Current State

We have testing information spread across multiple documents:

1. **testing-suite-strategy.md** (365 lines)
   - Framework selection (Jest + Playwright)
   - 12-week implementation timeline
   - Tool comparisons

2. **telemetry-testing-strategy.md** (678 lines)
   - Safety-critical testing philosophy
   - Progressive validation approach
   - Field simulation requirements

3. **pwa-testing-guide.md** (221 lines)
   - Manual PWA testing procedures
   - Lighthouse audit results
   - Network performance testing

4. **phase-1-telemetry-implementation.md** (NEW)
   - Actual implementation details
   - Lessons learned
   - Current test examples

## Migration Strategy

### Phase 1: Immediate Actions ✅ COMPLETED
- [x] Create `../testing-comprehensive-guide.md` as single source of truth
- [x] Include all recent learnings and patterns
- [x] Add practical examples from actual implementation

### Phase 2: Archive Historical Docs (Next Sprint)
1. Add header to old docs:
   ```markdown
   > ⚠️ **ARCHIVED**: This document is preserved for historical context.
   > See [../testing-comprehensive-guide.md](./../testing-comprehensive-guide.md) for current practices.
   ```

2. Move to `docs/archive/` folder:
   - `testing-suite-strategy.md` → Keep high-level decisions
   - `telemetry-testing-strategy.md` → Extract safety principles
   - `pwa-testing-guide.md` → Keep as reference for manual testing

### Phase 3: Update References
Search and update all references in:
- README.md
- CONTRIBUTING.md
- Package.json scripts
- CI/CD configurations

## What to Preserve

### From testing-suite-strategy.md:
- Framework selection rationale (Jest vs Vitest debate)
- Consensus decision process
- Cost/benefit analysis

### From telemetry-testing-strategy.md:
- Safety-critical testing philosophy
- Performance as correctness principle
- Field failure scenarios

### From pwa-testing-guide.md:
- Manual testing checklists
- Device-specific test results
- Network throttling procedures

## What's New in Comprehensive Guide

1. **Configuration Details**
   - Jest multi-project setup explained
   - TypeScript/Jest integration fixes
   - Path resolution patterns

2. **Testing Patterns**
   - Property-based testing examples
   - Performance characterization approach
   - Memory leak detection

3. **Troubleshooting**
   - Common errors and solutions
   - CI/CD considerations
   - Hardware variance handling

4. **Current State**
   - What's actually implemented
   - Recent learnings
   - Next steps

## Benefits of Consolidation

1. **Single Source of Truth**: No more searching multiple docs
2. **Reduced Maintenance**: Update one place, not three
3. **Better Onboarding**: New developers start here
4. **Living Document**: Encourages updates as we learn

## Action Items

- [ ] Team review of comprehensive guide
- [ ] Archive old documents with headers
- [ ] Update all cross-references
- [ ] Add guide to onboarding checklist
- [ ] Schedule quarterly review

## Success Metrics

- Time to first test for new developer: <30 minutes
- Documentation update frequency: Monthly
- Test coverage: >80% for critical paths
- Performance regression detection: <24 hours