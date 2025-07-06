# FleetOps Documentation Index

> **Purpose**: Central index of all project documentation
> **Last Updated**: 2025-07-06
> **Status**: Current documentation structure

## 📍 Current Status

**As of 2025-07-06**: We are in **Week 1, Day 2** (Completed) of the 10-week MVP plan
- ✅ Project setup, PWA implementation, testing infrastructure
- ✅ CircularBuffer implementation with comprehensive tests
- 🚧 Next: Day 3 - Real-time infrastructure and telemetry aggregation

See [Development Roadmap](./DEVELOPMENT-ROADMAP.md) for complete timeline and next steps.

## Primary Documentation

### 🎯 Core Implementation Guides

0. **[Development Roadmap](./DEVELOPMENT-ROADMAP.md)** 🆕
   - Unified development timeline
   - Current progress tracking
   - Phase definitions and milestones
   - Next immediate steps

1. **[Frontend Comprehensive Guide](./frontend-comprehensive-guide.md)**
   - Technology stack and decisions
   - Component architecture
   - UI development patterns
   - Real-time features
   - Performance targets

2. **[Telemetry Comprehensive Guide](./telemetry-comprehensive-guide.md)**
   - Real-time data architecture
   - CircularBuffer implementation
   - Performance optimizations
   - Testing strategies
   - Field operation benefits

3. **[Testing Comprehensive Guide](./testing-comprehensive-guide.md)**
   - Testing philosophy and patterns
   - Jest/Playwright configuration
   - Performance characterization
   - Field testing requirements
   - Framework selection history

4. **[PWA Comprehensive Guide](./pwa-comprehensive-guide.md)**
   - Progressive Web App setup
   - Offline capabilities
   - Service worker strategies
   - Implementation findings

### 🏗️ Architecture & Design

5. **[System Architecture Guide](./system-architecture-guide.md)**
   - High-level IoT architecture
   - Backend services design
   - Data flow patterns
   - Security architecture
   - Scalability considerations

~~6. Fleet Theme System - Merged into Frontend Comprehensive Guide~~

~~7. UI Development Guidelines - Merged into Frontend Comprehensive Guide~~

### 📊 Project Management

8. **[Project Journal](./project-journal.md)**
   - Daily development log
   - Key decisions record
   - Lessons learned
   - Upcoming milestones

~~9. Phase 1 Telemetry Implementation - Merged into Telemetry Comprehensive Guide~~

10. **[Real-Time State Architecture v2](./real-time-state-architecture-v2.md)**
    - Refined architecture after consensus
    - 6 mandatory optimizations
    - Performance analysis

### 📚 Reference

11. **[Contributing to Docs](./CONTRIBUTING-DOCS.md)**
    - Documentation standards
    - Review process
    - Style guide

## Archived Documentation

Historical documents preserved for reference in [`./archive/`](./archive/):

### Testing Evolution
- `testing-suite-strategy.md` - Original framework selection
- `telemetry-testing-strategy.md` - Initial testing approach
- `pwa-testing-guide.md` - Manual PWA testing
- `testing-documentation-migration.md` - Consolidation plan

### Architecture Evolution
- `real-time-state-architecture.md` - v1 architecture
- `telemetry-implementation-quickstart.md` - Original quickstart
- `frontend-architecture-plan.md` - Initial frontend plan
- `implementation-guide.md` - 10-week timeline v1
- `MVP-FRONTEND-CONSIDERATIONS.md` - MVP decisions

### Daily Logs
- `DAY-1-COMPLETE.md` - Day 1 accomplishments
- `DAY-2-PLAN.md` - Day 2 planning
- `DAY-2-ACTIONS.md` - Day 2 action items
- `WEEK-1-FLEET-PLAN.md` - Week 1 objectives

## Documentation Guidelines

### Active Documents
- Keep updated as implementation progresses
- Add "Last Updated" dates
- Mark sections as implemented/pending

### Creating New Docs
1. Check this index first to avoid duplication
2. Link to related documentation
3. Add to appropriate section in this index
4. Consider if content belongs in existing doc

### Archiving Process
1. Add deprecation header pointing to new location
2. Move to `./archive/` folder
3. Update this index
4. Fix any broken links

## Quick Links by Topic

### For New Developers
1. Start with [Frontend Comprehensive Guide](./frontend-comprehensive-guide.md)
2. Read [Testing Comprehensive Guide](./testing-comprehensive-guide.md)
3. Check [Project Journal](./project-journal.md) for current status
4. Review [System Architecture](./system-architecture-guide.md)

### For Testing
- [Testing Comprehensive Guide](./testing-comprehensive-guide.md) - Everything testing
- [Telemetry Guide](./telemetry-comprehensive-guide.md) - Telemetry tests

### For Real-Time Features
- [Telemetry Guide](./telemetry-comprehensive-guide.md) - Data processing
- [System Architecture](./system-architecture-guide.md) - IoT design
- [Real-Time State v2](./real-time-state-architecture-v2.md) - State management

### For UI Development
- [Frontend Comprehensive Guide](./frontend-comprehensive-guide.md) - Patterns, theme, typography
- [PWA Guide](./pwa-comprehensive-guide.md) - Progressive web app features

---

*This index is the starting point for all FleetOps documentation. If you can't find what you're looking for, check the [archive](./archive/) or ask the team.*