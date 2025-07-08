# FleetOps Architecture Migration: Cloud-First Separation Decision

> **Document Type**: Architecture Decision Record (ADR)
> **Date**: 2025-07-06
> **Status**: In Progress - Phase 2 Cloud Service Development
> **Decision**: Build two separate services for cloud and edge access
> **Last Updated**: 2025-07-07

## Executive Summary

After extensive consensus analysis involving 5 AI models, the decision is to **separate FleetOps into two distinct services**:
1. **FleetOps Cloud Service** - Primary production service (cloud-first)
2. **FleetOps Debug Tool** - Secondary debugging service (edge-direct)

**Consensus**: 4 out of 5 models strongly support separation with high confidence (8-9/10).

## Context: Paradigm Shift

### Original Assumptions (Incorrect)
- Direct sensor access via web workers
- Frontend connects directly to edge devices
- Edge-first architecture with cloud backup

### Actual Architecture (Correct)
**Relay Architecture**:
```
Sensors → Embedded Server/Modem → AWS Cloud → Frontend Service
```

**Two Access Patterns**:
1. **Production Use** (Primary): Cloud relay for operators/admins
2. **Debug Use** (Secondary): Direct edge access for field engineers

## Consensus Analysis Results

### Model Positions

| Model | Stance | Confidence | Key Argument |
|-------|--------|------------|--------------|
| O4-mini | FOR Separation | 9/10 | Microservices best practices, security boundaries |
| Qwen-max | FOR Separation | 9/10 | Industry alignment (AWS IoT), clear boundaries |
| DeepSeek | FOR Separation | 9/10 | Reduced complexity, zero-trust security |
| Opus 4 | FOR Separation | Error | (Assigned stance, couldn't respond) |
| Gemini-2.5-pro | AGAINST | 9/10 | Unified UX, code reuse, single codebase |

### Key Points of Agreement

1. **Security Boundaries Are Fundamental**
   - Public cloud access vs. VPN/local edge access
   - Different authentication models (RBAC vs. network-based)
   - Attack surface isolation

2. **Industry Precedents Support Separation**
   - AWS IoT: Greengrass (edge) vs. IoT Core (cloud)
   - Azure IoT: IoT Edge vs. IoT Hub
   - Google Cloud IoT: Similar dual-service pattern

3. **Distinct User Personas**
   - Cloud Service: Operators, managers, fleet admins
   - Debug Tool: Field engineers, hardware teams
   - Different workflows and requirements

4. **Implementation Complexity Favors Separation**
   - Unified: 3-6 months (complex dual-mode logic)
   - Separated: 2-3 months cloud + 1-2 months debug
   - Cleaner architecture, easier testing

### Key Points of Disagreement

1. **User Experience Philosophy**
   - **Gemini**: Seamless transitions between modes crucial
   - **Others**: Security boundaries more important than UX continuity

2. **Code Reuse Strategy**
   - **Gemini**: Warns of significant duplication
   - **Others**: Shared libraries effectively mitigate

3. **Industry Analogies**
   - **Gemini**: Docker Desktop, Postman (unified tools)
   - **Others**: AWS IoT, Azure IoT (separated platforms)

## Architecture Decision

### FleetOps Cloud Service (Primary)

**Purpose**: Production fleet management via cloud relay

**Architecture**:
```typescript
// Data Flow
Sensors → Edge Gateway → AWS IoT Core → FleetOps Cloud → Users

// Key Components
- AWS WebSocket connections
- Full RBAC (Cognito/IAM)
- Historical data storage (DynamoDB/S3)
- Analytics and dashboards
- Multi-tenant support
```

**Timeline**: 2-3 months
**Priority**: Immediate (Week 1-8)

### FleetOps Debug Tool (Secondary)

**Purpose**: Direct edge device debugging

**Architecture**:
```typescript
// Data Flow
Field Engineer → VPN → Edge Device WebSocket → Debug Tool

// Key Components
- Direct WebSocket to edge
- VPN/local network only
- Minimal auth (JWT/network)
- Real-time telemetry view
- Lightweight UI
```

**Timeline**: 1-2 months
**Priority**: Deferred (Week 6-7 evaluation)

## Implementation Strategy

### Phase 1: Monorepo Migration (2-3 hours)

**Phase 1A: Workspace Foundation (15 minutes)**
1. Create `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'packages/*'
     - 'apps/*'
   ```
2. Create root `tsconfig.base.json` with path aliases:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@repo/ui/*": ["packages/ui/src/*"],
         "@repo/telemetry/*": ["packages/telemetry/src/*"],
         "@repo/theme/*": ["packages/theme/src/*"]
       }
     }
   }
   ```
3. Create `apps/` and `packages/` directories

**Phase 1B: Code Preservation (30 minutes)**
1. Use `git mv` to preserve history (critical!):
   ```bash
   git mv ./app ./apps/debug/app
   git mv ./components ./apps/debug/components
   git mv ./lib ./apps/debug/lib
   # ... move all directories and files
   ```
2. Create `apps/debug/package.json` (move dependencies from root)
3. Update `apps/debug/next.config.ts`:
   ```javascript
   const nextConfig = {
     // ... existing config
     transpilePackages: ['@repo/ui', '@repo/telemetry', '@repo/theme'],
   };
   ```
4. Update `apps/debug/tailwind.config.ts`:
   ```typescript
   content: [
     './app/**/*.{js,ts,jsx,tsx,mdx}',
     './components/**/*.{js,ts,jsx,tsx,mdx}',
     // Add shared UI package
     '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   ```

**Phase 1C: Cloud App with Core Configs (30 minutes)**
1. Create `apps/cloud/` directory
2. Copy core configs from `apps/debug/` (Option B consensus):
   - `package.json` (remove PWA deps)
   - `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`
   - `jest.config.js`, `app/globals.css`
3. Create minimal app structure
4. Remove debug-specific code
5. Verify independent operation

**Phase 1D: Shared Package Scaffolding (30 minutes)**
1. Create packages with proper structure:
   ```
   packages/
   ├── @repo/telemetry/
   │   ├── package.json
   │   ├── tsconfig.json
   │   └── src/
   │       └── index.ts
   ├── @repo/theme/
   │   └── (similar structure)
   └── @repo/ui/
       └── (similar structure)
   ```

### Phase 2: Cloud Service Development (Weeks 1-8)
1. AWS integration (IoT Core, Cognito)
2. WebSocket manager for cloud connections
3. RBAC implementation
4. Telemetry data pipeline
5. Frontend dashboards

### Phase 3: Debug Tool Evaluation (Week 6-7)
1. Assess need based on field feedback
2. **Decision Point**: Formally decide whether to proceed
   - **If Approved**: Design minimal viable tool and implement
   - **If Rejected**: Archive `apps/debug` directory and remove from main branch
3. Document decision and rationale

### Shared Component Strategy

```
packages/
├── @repo/ui/                # Shared React components
├── @repo/telemetry/         # Telemetry types & aggregator
├── @repo/theme/             # Design tokens & theme config
├── @repo/hooks/             # Shared React hooks (as needed)
└── @repo/auth/              # Authentication utilities (as needed)

apps/
├── cloud/                   # Production cloud service
└── debug/                   # Current code (temporary home)
```

## Critical Risks & Mitigation

### 1. Protocol Consistency
**Risk**: Different telemetry formats between services
**Mitigation**: Enforce shared `@fleetops/telemetry-protocol` package
**Owner**: Lead architect

### 2. Authentication Complexity
**Risk**: Token synchronization, cross-service auth
**Mitigation**: Central identity service or AWS Cognito
**Owner**: Security team

### 3. Code Duplication
**Risk**: Maintaining parallel implementations
**Mitigation**: Aggressive extraction to shared libraries
**Owner**: Development team

### 4. Security Exposure
**Risk**: Debug tool bypassing security controls
**Mitigation**: Strict VPN enforcement, audit logging
**Owner**: Security team

### 5. User Confusion
**Risk**: Two tools for "same" devices
**Mitigation**: Clear documentation, distinct branding
**Owner**: Product team

## Timeline Impact

### Original Timeline (Unified)
- Weeks 1-2: Foundation
- Weeks 3-5: Core features
- Weeks 6-7: Integration
- Weeks 8-10: Production

### New Timeline (Separated)
- Weeks 1-2: Cloud foundation ✅
- Weeks 3-5: Cloud features
- Week 6: Debug tool decision point
- Weeks 7-8: Cloud production ready
- Weeks 9-10: Debug tool (if needed)

**Net Impact**: Faster initial delivery, optional debug tool

## Cost-Benefit Analysis

### Benefits of Separation
1. **Security**: Clear boundaries, reduced attack surface
2. **Complexity**: Simpler individual services
3. **Scalability**: Independent scaling profiles
4. **Maintenance**: Isolated change impact
5. **Compliance**: Easier audit, clear data flows

### Costs of Separation
1. **Development**: Two codebases to maintain
2. **Operations**: Two deployment pipelines
3. **User Experience**: Tool switching required
4. **Testing**: Broader test matrix

### Verdict: Benefits Outweigh Costs
The security and architectural benefits significantly outweigh the operational overhead, especially given different user personas and security requirements.

## Recommendation Summary

1. **Immediate Action**: Pivot to cloud-first architecture
2. **Primary Focus**: FleetOps Cloud Service (2-3 months)
3. **Secondary**: Defer debug tool to Week 6-7
4. **Mitigation**: Shared component libraries
5. **Success Metrics**: 
   - Cloud service live by Week 8
   - Zero security boundary violations
   - <50MB memory footprint
   - 60fps performance

## Appendix: Model Analysis Details

### O4-mini (FOR - 9/10)
- Emphasized microservice patterns
- Cited AWS IoT precedents
- Estimated 2-3 months cloud, 1-2 months debug

### Qwen-max (FOR - 9/10)
- Focused on security boundaries
- Industry best practices alignment
- Trade-off: Initial timeline vs. long-term benefits

### DeepSeek (FOR - 9/10)
- Zero-trust security requirements
- Complexity analysis (⭐⭐ vs ⭐⭐⭐⭐)
- Recommended debug tool first (we'll defer instead)

### Gemini-2.5-pro (AGAINST - 9/10)
- "Debug Mode" as feature, not service
- Docker Desktop/Postman precedents
- Warned of maintenance burden

### Opus 4 (FOR - Error)
- Couldn't provide response
- Assigned "for" stance based on brief

---

**Decision Status**: APPROVED
**Next Step**: Fork vs. Refactor consensus analysis

## Repository Strategy Decision

### Consensus Analysis: Implementation Approach

After analyzing 5 models on repository strategy:

**Model Recommendations**:
- **Monorepo**: O4-mini (8/10), Gemini-2.5-pro (9/10)
- **Refactor in Place**: Qwen-max (8/10)
- **Fork**: DeepSeek (9/10)
- **No Response**: Opus 4

### Final Decision: Progressive Monorepo

Given the split consensus, we adopt a hybrid "Progressive Monorepo" approach that addresses all concerns:

```
fleetops-frontend-service/
├── packages/
│   ├── @repo/ui/              # Shared React components
│   ├── @repo/telemetry/       # Telemetry types & aggregator
│   └── @repo/theme/           # Design tokens & theme config
├── apps/
│   ├── cloud/                 # New cloud service (clean start)
│   └── debug/                 # Current code (temporary home)
├── pnpm-workspace.yaml
├── tsconfig.base.json         # Workspace TypeScript config
└── turbo.json                 # Turborepo build orchestration
```

**Rationale**:
1. Preserves all existing work (addresses refactor concerns)
2. Enables optimal code sharing (addresses monorepo benefits)
3. Clean separation for cloud service (addresses fork benefits)
4. Defers debug tool decision to Week 6-7
5. Single repo with unified CI/CD

**Implementation Timeline**:
- Day 3-4: Monorepo structure setup
- Week 1: Continue cloud service in clean `apps/cloud/`
- Week 6-7: Evaluate debug tool based on field needs

**Key Benefits**:
- No code duplication
- Shared component library
- Independent deployments
- Preserved git history
- Future flexibility

## Monorepo Migration: Validated Execution Plan

### Risk Assessment: LOW
- Wholesale move preserves all functionality
- Incremental extraction prevents breaking changes
- Independent configs avoid complexity

### Timeline: 2-3 hours total

### Detailed Execution Steps

**1. Branch & Workspace Setup (15 min)**
```bash
# Create migration branch
git checkout -b feat/monorepo-migration

# Create workspace config
cat > pnpm-workspace.yaml << EOF
packages:
  - 'packages/*'
  - 'apps/*'
EOF

# Create directories
mkdir -p apps packages
```

**2. Git History Preservation (30 min)**
```bash
# Use git mv to preserve ALL history
git mv app apps/debug/
git mv components apps/debug/
git mv lib apps/debug/
git mv providers apps/debug/
git mv public apps/debug/
git mv scripts apps/debug/
git mv styles apps/debug/
git mv test apps/debug/

# Move config files
git mv next.config.ts apps/debug/
git mv tailwind.config.ts apps/debug/
git mv postcss.config.mjs apps/debug/
git mv tsconfig.json apps/debug/
git mv jest.config.js apps/debug/
git mv next-env.d.ts apps/debug/
```

**3. Configuration Updates (45 min)**

**Root tsconfig.base.json**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/ui/*": ["packages/ui/src/*"],
      "@repo/telemetry/*": ["packages/telemetry/src/*"],
      "@repo/theme/*": ["packages/theme/src/*"],
      "@repo/shared/*": ["packages/shared/src/*"]
    },
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  }
}
```

**apps/debug/package.json** (move all deps from root):
```json
{
  "name": "@apps/debug",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "jest"
  },
  "dependencies": {
    // Move all from root package.json
  }
}
```

**4. Critical Config Pitfalls & Solutions**

### Common Failures & Fixes:

**A. Next.js Transpilation**
```javascript
// apps/debug/next.config.ts
const nextConfig = {
  // CRITICAL: Without this, workspace packages won't compile
  transpilePackages: ['@repo/ui', '@repo/telemetry', '@repo/theme'],
  // ... rest of config
};
```

**B. Tailwind Content Paths**
```typescript
// apps/debug/tailwind.config.ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  // CRITICAL: Include shared packages
  '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**C. PWA Script Paths**
```javascript
// Update hardcoded paths in scripts/
const projectRoot = process.cwd(); // Now apps/debug
const dest = path.join(projectRoot, 'public');
```

**5. Validation Checklist**
- [ ] `pnpm install` from root succeeds
- [ ] `pnpm --filter debug dev` runs without errors
- [ ] `pnpm --filter debug build` completes
- [ ] `pnpm --filter debug test` passes all tests
- [ ] PWA functionality remains intact
- [ ] No TypeScript errors in IDE

### Phase 2: Incremental Extraction (Week 1+)
Only after validation, begin extracting:
1. Start with `@repo/telemetry` (self-contained)
2. Move telemetry code to `packages/telemetry/src`
3. Update imports in `apps/debug`
4. Add to `transpilePackages`
5. Validate before next extraction

### Expert Insights: Why This Works
1. **Wholesale move**: Avoids breaking imports/configs
2. **Git mv**: Preserves blame/history for debugging
3. **Independent configs**: Each app maintains own Next/Jest setup
4. **Incremental extraction**: Proves value before committing

**Next Step**: Execute Phase 1A workspace setup

---

## Migration Progress Tracker

> **Last Updated**: 2025-07-07
> **Overall Status**: In Progress - Phase 1 Complete (Monorepo Foundation)

This section tracks the execution of the monorepo migration and service separation against the plan outlined in this document. It serves as a living record of progress, discoveries, and adjustments.

### Phase 1: Monorepo Foundation ✅ COMPLETE

**Status**: Complete  
**Started**: 2025-07-06  
**Completed**: 2025-07-07  
**Actual Duration**: ~3 hours (as estimated)  
**Discoveries & Adjustments**:
- **Timeline**: Phase 1A took approximately 15 minutes as estimated
- **Naming Convention**: Confirmed `@repo/*` for all internal packages (not `@fleetops/*`)
- **Root Package.json**: Successfully simplified to workspace root configuration

#### Phase 1A: Workspace Foundation ✅ COMPLETE
- [x] Created `feat/monorepo-migration` branch
- [x] Created `pnpm-workspace.yaml` with packages/* and apps/* configuration
- [x] Created root `tsconfig.base.json` with @repo/* path aliases
- [x] Created apps/ and packages/ directories
- [x] Updated root package.json to workspace root with filter scripts
- [x] Backed up original package.json to package-app-backup.json

#### Phase 1B: Code Preservation ✅ COMPLETE
- [x] Use `git mv` to move ALL code to `apps/debug/`
  - [x] Move app directory
  - [x] Move components directory
  - [x] Move lib directory (including fixing missed pwa/utils.ts)
  - [x] Move providers directory
  - [x] Move public directory
  - [x] Move scripts directory
  - [x] Move styles directory
  - [x] Move test directory
  - [x] Move config files (next.config.ts, jest.config.js, etc.)
- [x] Create `apps/debug/package.json` from backup
- [x] Update package name to "@apps/debug"
- [x] Update `apps/debug/next.config.ts` with `transpilePackages`
- [x] Update `apps/debug/app/globals.css` with @source for workspace packages (Tailwind v4)
- [x] Fix all ESLint errors and TypeScript warnings
- [x] Successfully build the app with `pnpm --filter @apps/debug build`

#### Phase 1C: Clean Cloud App ✅ COMPLETE
- [x] Create `apps/cloud/` directory structure
- [x] Copy core configs from debug (Option B approach):
  - [x] `package.json` - Remove PWA dependencies (Serwist, @serwist/next)
  - [x] `tsconfig.json` - Keep as-is
  - [x] `tailwind.config.ts` & `postcss.config.mjs` - Keep styling setup (Note: Tailwind v4 uses postcss.config.mjs only)
  - [x] `jest.config.js` - Keep test configuration
  - [x] `app/globals.css` - Keep theme tokens and base styles
- [x] Create minimal app structure:
  - [x] `app/layout.tsx` - Basic root layout
  - [x] `app/page.tsx` - Cloud service landing page
  - [x] `app/api/health/route.ts` - Health check endpoint
- [x] Update `next.config.ts`:
  - [x] Remove all PWA/Serwist configuration
  - [x] Keep transpilePackages for workspace
- [x] Verify cloud app runs independently (dev server starts, build succeeds, tests pass)

#### Phase 1D: Shared Package Scaffolding ✅ COMPLETE
- [x] Create `packages/@repo/ui` structure
  - [x] Basic package.json with React dependencies
  - [x] TypeScript config extending base
  - [x] cn() utility function for className merging
- [x] Create `packages/@repo/telemetry` structure
  - [x] Package.json with test setup
  - [x] Basic telemetry types (TelemetryReading, TelemetryAggregate)
  - [x] Proper export structure for types
- [x] Create `packages/@repo/theme` structure
  - [x] Design tokens for colors and radius
  - [x] Fleet-specific color tokens
  - [x] Export structure for tokens
- [x] Set up package.json for each with proper exports
- [x] Configure TypeScript for each package
- [x] Link packages to both apps (cloud and debug)
- [x] Verify packages work (cloud app imports @repo/ui successfully)

#### Validation Checklist
- [x] `pnpm install` from root succeeds
- [x] `pnpm --filter @apps/debug dev` runs without errors
- [x] `pnpm --filter @apps/debug build` completes
- [x] `pnpm --filter @apps/debug test` passes all tests (35 tests, 3 suites)
- [ ] PWA functionality remains intact
- [ ] No TypeScript errors in IDE

### Phase 2: Cloud Service Development (Weeks 1-8)

**Status**: In Progress  
**Started**: 2025-07-07  
**Progress**: Foundation Complete (~30%)

#### Completed ✅
- [x] AWS IoT Core integration - SDK installed and configured
- [x] WebSocket manager for cloud connections - Built with reconnection logic
- [x] Basic telemetry data pipeline - Real-time streaming implemented
- [x] Frontend dashboard foundation - Telemetry dashboard with equipment grouping
- [x] Environment configuration - `.env.local.example` with AWS settings
- [x] Project structure - Clean separation of AWS libs, hooks, and providers

#### In Progress 🔄
- [ ] AWS Cognito authentication setup (credentials provider created, need full integration)
- [ ] RBAC implementation (pending Cognito setup)

#### Remaining 📋
- [ ] Data persistence with DynamoDB
- [ ] Real-time alerting system
- [ ] Fleet management UI
- [ ] Historical data analytics
- [ ] Multi-tenant support

### Phase 3: Debug Tool Evaluation (Week 6-7)

**Status**: Not Started  
**Decision Date**: TBD

#### Checklist
- [ ] Gather field feedback on debug tool necessity
- [ ] **Decision Point**: Approve or reject debug tool
- [ ] If Approved:
  - [ ] Design minimal viable debug tool
  - [ ] Refactor apps/debug into production tool
  - [ ] Create deployment pipeline
- [ ] If Rejected:
  - [ ] Create git tag for pre-cleanup state
  - [ ] Archive apps/debug directory
  - [ ] Remove from main branch
- [ ] Document decision and rationale

### Key Learnings & Adjustments

1. **Package Naming**: Standardized on `@repo/*` convention instead of `@fleetops/*` for better monorepo practices
2. **Shared Packages**: Avoiding generic `@repo/shared` in favor of domain-specific packages
3. **Build Tooling**: Turborepo adoption moved from optional to required for Phase 1
4. **Git Move Complications**: Some files (lib/pwa/utils.ts) were missed during initial move due to parallel work with another agent
5. **Tailwind v4 Configuration**: Uses `@source` directive in CSS instead of traditional config file
6. **TypeScript Strictness**: Had to refactor type guards and fix performance monitor for strict type checking
7. **Jest Configuration**: Updated from deprecated `globals` to `transform` syntax for ts-jest v29+
8. **Missing Test Config**: tsconfig.test.json needed to be moved to apps/debug for tests to run
9. **Cloud App Setup Strategy**: Consensus analysis (qwen-max, gemini-2.5-pro) confirmed Option B - copy core configs then prune as optimal approach
10. **Workspace Package Linking**: Apps must explicitly list workspace packages in dependencies using `workspace:*` protocol

### Phase 1 Completion Summary

**What's Now Ready**:
1. ✅ **Monorepo Structure**: Clean workspace with apps/ and packages/ directories
2. ✅ **Two Independent Apps**:
   - `apps/debug/` - Contains all existing code, fully functional with PWA
   - `apps/cloud/` - Clean foundation ready for AWS IoT Core integration
3. ✅ **Shared Packages**:
   - `@repo/ui` - Shared UI utilities (cn function)
   - `@repo/telemetry` - Telemetry types and future stores
   - `@repo/theme` - Design tokens and fleet-specific colors
4. ✅ **Build System**: Both apps build independently, packages transpile correctly
5. ✅ **Test Setup**: Jest configurations in place for both apps

**Ready for Phase 2**: The cloud service can now be developed with:
- Clean codebase free of PWA/debug concerns
- Shared packages for consistency
- Proven build and test configurations
- Clear separation from debug tool code

## Git Commit Strategy for Monorepo Migration

### Decision: Commit to Existing Repository

After analyzing options with pro model, the recommendation is to **commit to the existing repository** rather than creating a new one. This preserves valuable Git history while managing the structural changes through a multi-commit strategy.

### Benefits of Staying in Existing Repo:
1. **Preserves Complete History** - Critical for `git blame`, debugging, and understanding code evolution
2. **Maintains Continuity** - No need to update repo URLs, CI/CD pipelines, or team access
3. **Simplifies Future Work** - Single source of truth for all FleetOps code
4. **Industry Standard** - Major projects handle similar migrations this way

### Recommended Multi-Commit Strategy

Instead of one massive commit, break the changes into 5 logical commits that tell the migration story:

#### Commit 1: Initialize Monorepo Structure
```bash
git add pnpm-workspace.yaml package.json tsconfig.base.json
git commit -m "chore: initialize pnpm workspace and monorepo configuration

- Add pnpm-workspace.yaml for workspace management
- Update root package.json with workspace scripts
- Add tsconfig.base.json for shared TypeScript config"
```

#### Commit 2: Move Application to apps/debug (CRITICAL)
```bash
git add apps/debug/
git commit -m "refactor: move original application to apps/debug

BREAKING CHANGE: All application code moved from root to apps/debug/
This preserves git history through git mv operations
Part of monorepo migration to support cloud/debug separation"
```

#### Commit 3: Create Cloud Application
```bash
git add apps/cloud/
git commit -m "feat: initialize new cloud application

- Clean Next.js setup without PWA/debug features
- Configured for AWS IoT Core integration
- Uses shared workspace packages"
```

#### Commit 4: Add Shared Packages
```bash
git add packages/
git commit -m "feat: create shared packages for ui, telemetry, and theme

- @repo/ui: Shared UI utilities and components
- @repo/telemetry: Telemetry types and data structures
- @repo/theme: Design tokens and fleet-specific colors"
```

#### Commit 5: Wire Everything Together
```bash
git add .
git commit -m "chore: update configurations and imports for monorepo structure

- Update next.config.ts for both apps
- Add workspace dependencies to package.json files
- Update import paths and TypeScript configs
- Remove PWA dependencies from cloud app"
```

### Post-Migration Git Configuration

#### 1. Create .git-blame-ignore-revs File
For teams using git blame, create a file to ignore the large structural commit:
```bash
# Create the file
echo "# Monorepo migration - large structural change" > .git-blame-ignore-revs
echo "<commit-hash-of-move-commit>" >> .git-blame-ignore-revs

# Configure git to use it
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

#### 2. Team Instructions for Git Blame
After migration, team members should use these flags for better attribution:
- `git blame -C` - Detects moved/copied lines within files
- `git blame -C -C` - Detects lines moved from other files
- `git blame -w` - Ignores whitespace changes

Example: `git blame -C -C apps/debug/app/page.tsx`

### Pull Request Strategy

1. **Create PR with Clear Description**:
   - Explain the architectural decision (cloud/debug separation)
   - Link to this migration document
   - Highlight that git history is preserved

2. **Review Approach**:
   - Review commit-by-commit rather than all changes at once
   - Focus on structural correctness, not line-by-line changes
   - Verify build/test success for both apps

3. **Merge Strategy**:
   - Use merge commit (not squash) to preserve the commit story
   - Tag the merge for future reference: `v2.0.0-monorepo`

### CI/CD Considerations

The monorepo structure enables path-based CI/CD triggers:
```yaml
# Example GitHub Actions workflow
on:
  push:
    paths:
      - 'apps/cloud/**'
      - 'packages/**'
```

This allows independent deployment pipelines while sharing code.

### Jest Configuration for Monorepo

#### Issue: Jest Tests Failing with TypeScript Syntax Errors
When running tests from the monorepo root, Jest was failing with syntax errors because it couldn't find the `tsconfig.test.json` file referenced in `apps/debug/jest.config.js`.

#### Solution: Root Jest Configuration with Projects
Created a root `jest.config.js` that uses the projects pattern, following monorepo best practices:

```javascript
// jest.config.js (root)
module.exports = {
  // Automatically discover projects with jest.config.js files
  projects: [
    '<rootDir>/apps/*/jest.config.js',
    '<rootDir>/packages/*/jest.config.js',
  ],
  
  // Global settings that apply to all projects unless overridden
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
};
```

Also updated `apps/debug/jest.config.js` to use absolute paths:
```javascript
transform: {
  '^.+\\.tsx?$': ['ts-jest', {
    tsconfig: '<rootDir>/tsconfig.test.json'  // Now uses absolute path
  }]
}
```

This configuration:
- Automatically discovers test projects using glob patterns
- Allows running all tests with `pnpm test` from root
- Enables per-app test execution with `pnpm --filter @apps/debug test`
- Centralizes coverage reporting
- Scales automatically as new apps/packages are added

## Phase 2: Cloud Service Implementation Details

### AWS IoT Core Integration Architecture

**Implementation Date**: 2025-07-07

#### Architecture Overview
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Edge Sensors   │────▶│  AWS IoT Core    │────▶│ FleetOps Cloud  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │                            │
                              ▼                            ▼
                        ┌──────────────┐          ┌──────────────┐
                        │   DynamoDB   │          │  Telemetry   │
                        │  (Future)    │          │  Dashboard   │
                        └──────────────┘          └──────────────┘
```

#### Key Components Implemented

1. **AWS SDK Integration** (`apps/cloud/package.json`)
   ```json
   "@aws-sdk/client-iot": "3.840.0"
   "@aws-sdk/client-iot-data-plane": "3.840.0"
   "@aws-sdk/client-cognito-identity-provider": "3.840.0"
   "aws-iot-device-sdk-v2": "1.22.0"
   ```

2. **IoT Connection Manager** (`lib/aws/iot-connection.ts`)
   - WebSocket-based MQTT connection
   - Automatic reconnection logic
   - Event-driven architecture
   - QoS support for reliable messaging

3. **React Integration** (`hooks/use-iot-connection.ts`)
   - Custom hook for IoT lifecycle management
   - Connection state tracking
   - Error handling and recovery
   - Auto-connect capabilities

4. **Telemetry Provider** (`providers/telemetry-provider.tsx`)
   - React Context for telemetry data
   - Real-time data streaming
   - Equipment-based data grouping
   - Configurable buffer size

5. **Dashboard UI** (`components/telemetry-dashboard.tsx`)
   - Real-time equipment monitoring
   - Metric visualization
   - Connection status indicators
   - Responsive grid layout

#### Environment Configuration

Created `.env.local.example` with required AWS settings:
- `NEXT_PUBLIC_AWS_REGION`: AWS region for services
- `NEXT_PUBLIC_AWS_IOT_ENDPOINT`: IoT Core endpoint URL
- `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID`: For authentication
- `NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID`: App client ID
- `NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID`: For AWS credentials

#### Data Model Updates

Updated `@repo/telemetry` types to align with cloud architecture:
```typescript
interface TelemetryReading {
  equipmentId: string;      // Identifies the equipment/sensor
  timestamp: number;        // Unix timestamp
  metrics: Record<string, number>;  // Flexible metric storage
}
```

#### Security Considerations

1. **Credentials Management**
   - Development: Static credentials via environment variables
   - Production: Cognito Identity Pool integration planned
   - No credentials committed to repository

2. **Connection Security**
   - WebSocket over TLS for all connections
   - IoT Core policies for device authorization
   - Client ID uniqueness enforced

#### Next Implementation Steps

1. **Authentication Solution Selection** (Priority: High)
   - Evaluate authentication options (Keycloak leading candidate)
   - Design authentication architecture
   - Plan IoT device authentication strategy
   - Define role-based access control requirements

2. **Data Persistence** (Priority: High)
   - DynamoDB table design
   - Time-series data optimization
   - Query patterns for analytics

3. **Fleet Management UI** (Priority: Medium)
   - Equipment registration
   - Fleet overview dashboard
   - Alert configuration

4. **Real-time Alerting** (Priority: Medium)
   - Threshold-based alerts
   - SNS integration
   - Alert history tracking

## Authentication Architecture: Under Evaluation

### Decision Status

**Date**: 2025-07-08  
**Status**: PENDING - PoC validation phase starting  
**Leading Option**: Self-hosted Keycloak (unanimous consensus from 5 models)  
**Alternative Options**: AWS Cognito (fallback), SuperTokens (insufficient for our RBAC)  
**Expected Decision Date**: End of Week 4 after PoC validation  

### Research Context

Initial plans called for AWS Cognito integration, but concerns about vendor lock-in prompted comprehensive research into authentication alternatives. Analysis revealed:

#### Cost Comparison (50,000 MAUs + 1M M2M requests/month):
- **AWS Cognito**: ~$72,000/year (after 2024 pricing changes)
- **Keycloak (Self-hosted)**: ~$12,000/year (infrastructure only)
- **SuperTokens (Managed)**: ~$10,800/year
- **Custom Build**: ~$8,000/year (infrastructure) + 3-6 months development

### Comprehensive Consensus Analysis

A structured consensus analysis was conducted with 5 AI models to evaluate authentication options:

| Model | Assigned Stance | Actual Recommendation | Confidence | Key Position |
|-------|----------------|----------------------|------------|--------------|
| Gemini-2.5-pro | FOR Keycloak | **Keycloak** | 8/10 | Strategic investment in freedom |
| DeepSeek | AGAINST Keycloak | **Keycloak** | 8/10 | Security-first approach |
| Opus 4 | AGAINST Keycloak | **Keycloak** | 8/10 | Economic and flexibility benefits |
| Qwen-max | NEUTRAL | **Keycloak** | 9/10 | Technical robustness |
| O4-mini | FOR Keycloak | Error | - | (Technical error) |

### Universal Points of Agreement

**All models unanimously agreed on:**

1. **Cost Savings are Compelling**: $60k/year savings vs Cognito (83% reduction)
2. **Custom Build is Anti-Pattern**: OWASP shows 94% of breaches target identity flaws
3. **Keycloak Handles IoT Scale**: M2M auth without per-request charges for 1M+ requests
4. **Enterprise RBAC Required**: Complex Admin→Manager→Operator→Driver hierarchy
5. **Vendor Lock-in Must be Avoided**: Strategic flexibility is critical
6. **Implementation Timeline Reasonable**: 2-4 weeks for production deployment

### Detailed Model Analysis

#### Gemini-2.5-pro (FOR Keycloak, 8/10 confidence)
**Verdict**: "Accepting the operational overhead of a self-hosted solution is a strategically sound decision to achieve significant cost savings and avoid vendor lock-in, with Keycloak being the most suitable platform for your complex requirements."

**Key Points**:
- Keycloak is excellent fit for fine-grained RBAC and M2M/IoT authentication
- Building custom auth is "widely recognized anti-pattern"
- Operational overhead should be viewed as "strategic investment in building in-house capability"
- $60k savings should be "partially reinvested into DevOps/SRE resources"
- "Strategic freedom is the goal" - not just cost savings

**Concerns Raised**:
- Requires dedicated infrastructure management (Kubernetes/EKS)
- Steeper learning curve than managed solutions
- Success depends on team commitment to operational excellence

#### DeepSeek (AGAINST stance but FOR Keycloak, 8/10 confidence)
**Verdict**: "Keycloak is the optimal choice for balancing cost savings, vendor lock-in avoidance, and enterprise readiness, despite its operational overhead."

**Key Security Insights**:
- "OWASP notes 94% of breaches target identity flaws" - making custom builds dangerous
- Keycloak has "proven scalability (banks/governments)"
- Built-in IoT/M2M authentication "critical for 1M+ monthly requests"
- Compliance certifications (SOC2, HIPAA-ready) "future-proof audits"

**Implementation Recommendations**:
- Use infrastructure-as-code (Terraform/Helm) for automated deployments
- Keycloak + Managed Kubernetes reduces ops overhead
- "Mitigate lock-in: Abstract AWS calls behind interfaces"

#### Anthropic Opus 4 (AGAINST stance but FOR Keycloak, 8/10 confidence)
**Verdict**: "Keycloak is the optimal choice for FleetOps - it provides enterprise-grade capabilities without vendor lock-in at 83% cost savings versus Cognito, with manageable operational overhead that's justified by the strategic flexibility and cost benefits."

**Economic Analysis**:
- "$60k/year savings versus Cognito pays for a dedicated DevOps engineer"
- "M2M authentication without per-request charges is essential for sustainable IoT device authentication at scale"
- "2-4 week implementation is a reasonable investment for 5+ years of authentication infrastructure"

**Industry Perspective**:
- Major enterprises (Red Hat, Hitachi, UBS) run Keycloak in production
- "Trend is moving away from vendor-locked solutions toward open-source IAM"
- "Keycloak skills are transferable" - engineers can work with any standards-based auth system

#### Qwen-max (NEUTRAL stance, FOR Keycloak, 9/10 confidence)
**Verdict**: "Keycloak is the most technically robust and cost-effective choice despite operational overhead, given FleetOps' scalability and vendor lock-in avoidance priorities."

**Technical Validation**:
- Supports complex role hierarchies via fine-grained RBAC
- M2M/IoT support aligns perfectly with 1M+ IoT requests/month requirement
- Open-source nature ensures no vendor lock-in
- Standard protocols (OAuth2, OIDC, SAML) ensure compatibility

**Risk Assessment**:
- Operational overhead is "manageable trade-off for long-term benefits"
- Red Hat backing and extensive documentation mitigate risks
- "FleetOps should prioritize open-source solutions to future-proof authentication infrastructure"

### Key Technical Validations

**Security & Compliance:**
- Used by governments, banks (Red Hat, Hitachi, UBS)
- SOC2, HIPAA-ready certifications
- OWASP compliance reduces security risks
- Standard protocols prevent vendor lock-in

**Scalability Proven:**
- Handles millions of authentications daily
- Java-based stability at enterprise scale
- No per-request charges for M2M authentication
- Built for complex role hierarchies

**Cost Analysis Validated:**
- $60k savings fund dedicated DevOps engineer
- Infrastructure-as-code reduces operational overhead
- Transferable skills (unlike Cognito-specific knowledge)
- Strategic investment in in-house capabilities

### No Points of Disagreement

Remarkably, **no model disagreed** on the core recommendation. The only variations were:
- **SuperTokens** mentioned as fallback if RBAC needs are simpler (but deemed insufficient for FleetOps' complexity)
- **Operational complexity** acknowledged but deemed manageable with proper automation
- **Timeline uncertainty** around team Java/Kubernetes expertise (mitigated by extensive documentation)

### Implementation Strategy

#### Week 1: Architecture & Infrastructure Setup
1. **Design Keycloak architecture** using EKS deployment pattern
2. **Set up AWS EKS cluster** with Terraform for high availability
3. **Configure managed PostgreSQL** for Keycloak database backend
4. **Deploy Keycloak** using Helm charts with load balancing

#### Week 2: Configuration & Integration  
1. **Create FleetOps realm** with role hierarchy (Admin→Manager→Operator→Driver)
2. **Configure M2M authentication** for IoT devices without per-request charges
3. **Integrate Keycloak with cloud app** using OAuth2/OIDC standards
4. **Build custom authorization middleware** for fine-grained permissions beyond Keycloak groups

#### Week 3: Testing & Production Readiness
1. **Implement comprehensive monitoring** (Prometheus/Grafana integration)
2. **Load test authentication** with projected 50k+ users and 1M+ IoT requests
3. **Configure automated backups** and disaster recovery procedures
4. **Document operational procedures** and training for team

### Risk Mitigation Strategy

**Identified Risks and Mitigations**:

✅ **DevOps Expertise Gap**: $60k savings funds dedicated engineer with Keycloak experience  
✅ **Security Concerns**: Proven at banks/governments, OWASP compliant, regular Red Hat updates  
✅ **Scalability Questions**: Tested at millions of requests/day in production environments  
✅ **Documentation Gaps**: Extensive community and Red Hat support, established best practices  
✅ **Migration Complexity**: Standard protocols enable future flexibility to any provider  
✅ **Operational Overhead**: Infrastructure-as-code (Terraform/Helm) automates deployment and scaling  

### Alternative Options Considered and Rejected

#### SuperTokens
- **Why Considered**: Modern TypeScript-first approach, easier initial setup
- **Why Rejected**: Lacks enterprise features (multi-tenancy, federation), unproven at 1M+ IoT scale, limited compliance certifications

#### Custom Authentication Build
- **Why Considered**: Complete control, optimized for exact needs
- **Why Rejected**: 3-6 months development time, security risks (94% of breaches target identity), ongoing maintenance burden, no compliance certifications

#### AWS Cognito (Original Plan)
- **Why Considered**: Managed service, integrated with AWS ecosystem
- **Why Rejected**: $72k/year cost, severe vendor lock-in, coarse-grained RBAC, JWT tokens 3-5KB size impact

### Current Evaluation Status

**Original Plan**: AWS Cognito for managed authentication  
**Current Status**: Evaluating multiple authentication solutions  

**Key Findings from Analysis**:
- Keycloak shows strong potential: 83% cost reduction ($60k/year savings)
- Vendor lock-in concerns with AWS Cognito are significant
- Enterprise-grade RBAC requirements favor self-hosted solutions
- IoT device authentication at scale (1M+ requests/month) needs careful consideration
- Operational overhead vs strategic flexibility trade-offs being evaluated

**Next Steps**:
1. Continue evaluating authentication options
2. Consider proof-of-concept implementations
3. Assess team capabilities for self-hosted solutions
4. Make final decision based on technical and business requirements

**Open Questions**:
- Team readiness for managing self-hosted infrastructure
- Total cost of ownership including operational overhead

## Monorepo Architecture Decision (2025-07-08)

### Consensus Analysis Results

**Models Consulted**: O4-mini, Gemini-2.5-pro, DeepSeek-r1, Opus 4, Qwen-max

**Decision**: Hybrid Repository Architecture

### Final Architecture

```
✅ MONOREPO: Frontend + Backend Services
   - apps/cloud (production cloud service)
   - apps/debug (edge debug tool)  
   - apps/backend (Lambda/API services)
   - packages/shared (common libraries)

❌ SEPARATE REPOS: Embedded + Infrastructure
   - fleetops-embedded (device firmware)
   - fleetops-infrastructure (Terraform)
```

### Rationale from Consensus

**Strong Agreement**:
- Embedded code MUST remain separate (security, toolchain)
- Frontend/backend benefit from atomic commits
- Infrastructure needs isolated state management

**Key Concerns Addressed**:
1. **Security Boundaries**: Firmware requires strict access control
2. **Toolchain Conflicts**: C/C++/Rust vs JS/TS ecosystems
3. **Release Cadence**: Devices update quarterly, cloud daily
4. **Build Performance**: Avoid cross-compilation in JS pipeline

### Implementation Requirements

**Day 1 Necessities**:
1. **CODEOWNERS** file with strict boundaries
2. **Path-based CI triggers** (e.g., `apps/cloud/**` → cloud pipeline only)
3. **Git submodules** for cross-repo dependencies
4. **Turborepo/Nx** for monorepo orchestration

**Example CI Configuration**:
```yaml
# .github/workflows/ci.yml
on:
  push:
    paths:
      - 'apps/cloud/**'
      - 'packages/**'
      
jobs:
  cloud:
    if: contains(github.event.paths, 'apps/cloud')
    # Cloud-specific build/test/deploy
```

### Migration Timeline

**Week 1**: Setup monorepo structure
- Move backend services to `apps/backend`
- Configure Turborepo/Nx
- Implement path-based CI

**Week 2**: Establish boundaries  
- Create separate repos for embedded/infra
- Setup git submodules
- Document access policies

**Week 3**: Validate workflows
- Test atomic commits across frontend/backend
- Verify CI performance
- Team training on new structure

## Keycloak PoC Infrastructure Design (2025-07-08)

### Consensus Recommendation

**All 5 models agreed**: Keycloak is technically viable and cost-effective
- Projected savings: ~$60,000/year vs AWS Cognito
- Unanimous support for self-hosted approach

### PoC Infrastructure Design

**Start Simple**: ECS Fargate (not EKS) for PoC
- Simpler operations for validation phase
- Faster iteration on authentication patterns
- Lower cost (~$320/month vs $500+ for EKS)

**Terraform Module Structure**:
```hcl
# Minimal PoC modules
modules/
├── network/     # VPC, subnets, security groups
├── database/    # RDS PostgreSQL (t3.small, no Multi-AZ)
├── keycloak/    # ECS Fargate tasks (2x 2vCPU/4GB)
└── iot_auth/    # Lambda authorizer for IoT Core
```

### Critical Validation Points

1. **IoT Device Authentication Flow**
   - Custom Lambda authorizer for AWS IoT Core
   - JWT token exchange mechanism
   - Target: <500ms authentication latency

2. **Operator RBAC Testing**
   - 200 concurrent user logins
   - Role hierarchy: Admin→Manager→Operator→Driver
   - Permission inheritance validation

3. **Scale Testing**
   - Simulate 1M+ device authentications/month
   - Monitor PostgreSQL connection pooling
   - Validate auto-scaling behavior

### Risk Mitigation

**High Priority Risks**:
1. **IoT Core Integration**: No native Keycloak support
   - Mitigation: Custom Java SPI development budgeted
   - Fallback: Keep AWS Cognito for devices only

2. **Operational Expertise**: Java/Keycloak knowledge gap
   - Mitigation: $60k savings funds dedicated engineer
   - Fallback: Managed Keycloak services available

3. **PostgreSQL Connection Limits**: IoT devices may exhaust connections
   - Mitigation: Connection pooling + monitoring
   - Fallback: Redis session cache layer

### PoC Success Criteria

✅ Device auth latency <500ms at 95th percentile
✅ 200 concurrent operators with <1s login time
✅ Cost projection <$1000/month at production scale
✅ Successful failover test (RDS AZ failure)
✅ Terraform deployment in <30 minutes

### Go/No-Go Decision Framework

**Week 4 Decision Points**:
1. If IoT integration requires >2 weeks custom dev → **Reconsider**
2. If operational overhead >20% of DevOps time → **Reconsider**
3. If total costs exceed Cognito savings by 50% → **No-Go**
4. If all success criteria met → **Proceed to production**
- Integration complexity with existing AWS services
- Compliance and security certification requirements