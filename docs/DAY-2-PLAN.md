# Day 2 Detailed Plan: Unified Theme System & State Management

## Overview
Day 2 establishes the architectural foundation that will support 10 weeks of development. This includes unified theming for multiple UI libraries, state management patterns, mock infrastructure, and reference components.

## Critical Path Items
1. **Theme System** - Prevents CSS conflicts between shadcn/ui and Tremor
2. **State Architecture** - Changing patterns mid-project is extremely costly  
3. **Mock Infrastructure** - Team blocked without realistic API mocks
4. **Reference Components** - Establishes patterns for 50+ future components

## Schedule & Tasks

### 9:00-10:30: Unified Theme System Foundation
**Goal**: Create a theme provider that handles CSS variable conflicts between UI libraries

**Tasks**:
1. Analyze CSS variable conflicts between shadcn/ui and Tremor
   - Document overlapping variables (--radius vs --tremor-radius)
   - Map color systems between libraries
   - Identify dark mode switching points

2. Create namespace strategy
   ```
   --app-* (our custom variables)
   --ui-* (shadcn variables) 
   --tremor-* (Tremor variables)
   ```

3. Build ThemeProvider component
   - `/lib/theme/provider.tsx` with React Context
   - System preference detection
   - Local storage persistence
   - CSS variable injection

4. Implement dark mode toggle
   - Smooth transitions
   - No flash of unstyled content
   - Accessible keyboard shortcuts

**Deliverable**: Working theme system with documentation

### 10:30-12:00: Design Tokens & Documentation
**Goal**: Establish design system foundation

**Tasks**:
1. Define core design tokens
   - Color palette (primary, secondary, accent, semantic)
   - Typography scale (font sizes, weights, line heights)
   - Spacing system (4px base unit)
   - Border radius tokens
   - Shadow definitions

2. Create theme documentation
   - `/docs/THEME.md` with all tokens
   - Usage examples
   - Do's and don'ts
   - Migration guide from raw Tailwind

**Decision Point**: CSS Layers vs Namespacing
- Recommendation: Use Tailwind v4's @layer directive for clean separation

### 12:00-13:00: Lunch Break & Review

### 13:00-14:30: State Management Architecture
**Goal**: Set up Zustand and TanStack Query for scalable state management

**Tasks**:
1. Install dependencies
   ```bash
   pnpm add zustand @tanstack/react-query @tanstack/react-query-devtools
   ```

2. Create store structure
   - `/stores/ui-store.ts` - Sidebar, modals, preferences
   - `/stores/user-store.ts` - User data, auth state
   - `/stores/filter-store.ts` - Persistent search filters

3. Set up TanStack Query
   - `/lib/api/query-client.ts` with defaults
   - Stale time: 5 minutes
   - Cache time: 10 minutes  
   - Retry logic: 3 attempts with exponential backoff

4. Create typed hooks
   ```typescript
   useGymData(gymId: string)
   useAnalytics(dateRange: DateRange)
   useUserPreferences()
   ```

**Critical Decision**: Do we need Redux Toolkit?
- Answer: No - Zustand is simpler and sufficient for our scope

### 14:30-16:00: Mock Service Worker Infrastructure
**Goal**: Enable 6+ weeks of development without backend APIs

**Tasks**:
1. Install MSW and utilities
   ```bash
   pnpm add -D msw @mswjs/data @faker-js/faker
   ```

2. Create mock handlers
   - `/mocks/handlers.ts` - REST endpoints
   - `/mocks/factories/gym.ts` - Gym data factory
   - `/mocks/factories/analytics.ts` - Time-series generators
   - `/mocks/factories/user.ts` - User/role variations

3. Build realistic data generators
   - Peak hours distribution (6-8 AM, 5-7 PM peaks)
   - Seasonal membership trends
   - Equipment usage patterns
   - Revenue streams with daily variance

4. Set up mock scenarios
   - Success responses (200ms delay)
   - Network errors (500, 503)
   - Slow network (3s delay)
   - Auth expiration

5. Browser and Node integration
   - `/mocks/browser.ts` for development
   - `/mocks/server.ts` for tests

**Key Decision**: REST mocks with GraphQL-ready structure

### 16:00-17:00: First 5 Reference Components
**Goal**: Build components that demonstrate all patterns

**Components to Build**:
1. **MetricCard** (`/components/analytics/MetricCard.tsx`)
   - Combines shadcn Card with Tremor metrics
   - Shows theme integration
   - Loading/error states

2. **GymSearchBar** (`/components/search/GymSearchBar.tsx`)
   - shadcn Input + Combobox
   - Debounced search
   - Zustand filter integration

3. **DateRangePicker** (`/components/ui/DateRangePicker.tsx`)
   - shadcn Calendar base
   - Preset ranges (Last 7, 30, 90 days)
   - Mobile-friendly

4. **AnalyticsChart** (`/components/analytics/AnalyticsChart.tsx`)
   - Tremor AreaChart wrapper
   - Responsive sizing
   - Loading skeleton

5. **UserAvatar** (`/components/user/UserAvatar.tsx`)
   - shadcn Avatar + DropdownMenu
   - User state from Zustand
   - Role-based menu items

**Each component must have**:
- Full TypeScript types
- Loading and error states
- Storybook story (if time permits)
- Usage documentation

### 17:00-17:30: Documentation & Handoff
**Goal**: Enable team to work independently on Day 3

**Create documentation**:
1. `/docs/STATE.md` - State management patterns
2. `/docs/MOCKS.md` - How to add mock endpoints  
3. `/docs/COMPONENTS.md` - Component patterns

**Final checklist**:
- [ ] All TypeScript errors resolved
- [ ] Lint passes
- [ ] Build succeeds
- [ ] Basic tests for critical paths

## Critical Decisions Log

### CSS Variable Strategy
**Options Considered**:
1. Namespace everything (--app-, --ui-, --tremor-)
2. Override conflicts only
3. CSS layers (@layer base, @layer ui)

**Decision**: Use CSS layers with Tailwind v4
**Rationale**: Cleaner separation, better performance, future-proof

### State Management Boundaries
**Decision**:
- **Zustand**: UI state, user preferences, filters
- **TanStack Query**: All server state
- **React Hook Form**: Form state (Day 3)
- **Local Storage**: Via Zustand persist middleware

### Mock Data Architecture
**Decision**: 
- REST-first with GraphQL-compatible structure
- Realistic time-series data with patterns
- WebSocket simulation via polling

## Success Metrics

### Morning (12:00)
- [ ] Theme provider working
- [ ] Dark mode toggles smoothly
- [ ] No CSS conflicts
- [ ] Design tokens documented

### Afternoon (15:00)  
- [ ] Zustand stores typed and working
- [ ] TanStack Query fetching mock data
- [ ] Loading states functional

### End of Day (17:30)
- [ ] MSW intercepting API calls
- [ ] 5 components built and documented
- [ ] Team can build new components
- [ ] No blocking issues for Day 3

## Risk Mitigation

### If Behind Schedule
- **10:30**: Simplify theme to dark/light only
- **14:00**: Skip advanced Zustand patterns
- **16:00**: Reduce to 3 core components
- **17:00**: Prioritize documentation over polish

### Technical Risks
1. **Tailwind v4 incompatibility**
   - Mitigation: Have v3 fallback ready
   
2. **MSW WebSocket limitations**
   - Mitigation: Use polling for real-time

3. **Performance issues**
   - Mitigation: Monitor bundle size from start

## Team Coordination

### Required Skills
- React Context API
- TypeScript generics  
- CSS variables
- REST API patterns

### Handoff Materials
- Pattern examples
- Storybook (if ready)
- Slack channel for questions
- 30-minute end-of-day demo

## Dependencies for Day 3

Day 2 must deliver:
1. Working theme system
2. State management patterns
3. Mock API infrastructure
4. Component examples

This enables Day 3 parallel development:
- Team A: Landing pages
- Team B: Dashboard shell
- Team C: Search features

---
*Created: 2025-07-05*  
*Status: Ready for execution*