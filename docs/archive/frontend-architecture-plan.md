> ⚠️ **ARCHIVED**: Architecture details moved to system-architecture-guide.md
> See [system-architecture-guide.md](../system-architecture-guide.md) for current version.

# Enterprise Fleet Management & Prediction Platform Frontend Architecture Plan

## Executive Summary
This document outlines the comprehensive plan for building a new enterprise-level frontend service for industrial fleet management and predictive maintenance. The platform enables smarter industrial machines that monitor and maintain themselves, starting with hydraulics monitoring through embedded sensors that analyze fluid quality in real-time to flag wear, leaks, and contamination before failures occur.

## Technology Stack

### Final Recommended Stack (After Consensus Analysis)
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS v4 (direct adoption)
- **Component Libraries**: 
  - shadcn/ui (core components)
  - Aceternity UI (landing page animations)
  - Tremor (analytics visualizations)
- **State Management**: TanStack Query + Zustand
- **API Layer**: GraphQL (Apollo Client)
- **Testing**: Vitest + Playwright
- **Type Safety**: TypeScript (strict mode)

## Architecture Overview

```
├── Public Section (SEO-optimized)
│   ├── Landing Pages (SSG)
│   ├── Fleet Overview (SSR with search)
│   └── Equipment Profiles (ISR)
├── Operations Dashboard (CSR)
│   ├── Authentication Layer (Multi-tenant)
│   ├── Real-time Telemetry
│   ├── Action Item Management
│   └── Fleet Analytics
└── Shared Components
    ├── UI Kit (shadcn/ui)
    └── Industrial Telemetry Logic
```

## Best Practices for Enterprise Frontend Development (2025)

### Scalable Architecture
- **Component-Driven Development (CDD)**: Build UIs from the bottom up with tools like Storybook
- **Modular Codebase (Feature Slicing)**: Organize by feature rather than file type
- **Strict Typing**: TypeScript with strict mode enabled

### Maintainability & Developer Experience
- **Automated Tooling**: ESLint, Prettier, Stylelint with pre-commit hooks (Husky)
- **Robust Testing Strategy**:
  - Unit/Integration: Vitest or Jest with React Testing Library
  - End-to-End: Playwright or Cypress
- **Centralized API Layer**: Dedicated module for all API interactions

### Performance & Security
- **Aggressive Code Splitting**: Route-based and component-level splitting
- **Observability**: Error tracking (Sentry, Datadog) and analytics from day one
- **Dependency Management**: Regular audits with npm audit or Snyk/Dependabot

## Technology Evaluation

### Next.js vs Plain React+Vite
**Recommendation**: Next.js
- **Why**: SEO requirements for public-facing gym discovery pages
- **Benefits**: SSR/SSG/ISR capabilities, file-based routing, integrated optimizations
- **Trade-off**: More opinionated than plain Vite setup

### Tailwind CSS v4 Decision (January 2025)
- **Current Status**: Production ready with 95%+ plugin compatibility
- **Performance**: 5x faster full builds, 100x faster incremental builds
- **Decision**: Direct v4 adoption to avoid migration complexity
- **Benefits**: Native CSS variables, smaller bundles, better DX from day one

### State Management Strategy
```typescript
// Global State (Zustand)
- User preferences
- UI state (sidebar, modals)
- Cached filters
- Tenant context
- Alert preferences

// Server State (TanStack Query)
- Telemetry data streams
- Fleet metrics
- Equipment status
- Action items
- User/permission data

// Local State (useState/useReducer)
- Form inputs
- Component-specific UI
- Offline queue
```

## Implementation Timeline (Final Revision)

### Total Duration: 8-10 Weeks (Accelerated MVP)

#### Phase 1: Foundation & Design System (2 weeks)
- Week 1: Infrastructure, shadcn/ui setup, design tokens
- Week 2: Component library integration, API setup, core patterns

#### Phase 2: Core Development (3-4 weeks)
- **Team**: 4 senior full-stack developers
- Landing pages with Aceternity animations
- Dashboard with shadcn/ui components
- Analytics with Tremor charts
- GraphQL API integration

#### Phase 3: Polish & Launch (2 weeks)
- Performance optimization
- Mobile responsiveness
- User testing (continuous)
- Production deployment

#### Phase 4: Post-MVP Stabilization (1-2 weeks)
- Technical debt registry review
- Critical bug fixes
- Performance monitoring
- Plan V1.5 improvements

## Week 1 Actionable Steps

```bash
# Day 1: Project Foundation
1. npx create-next-app@latest fleetops --typescript --app --tailwind
2. npm install -D tailwindcss@latest postcss autoprefixer
3. Configure Tailwind CSS v4 with native CSS variables
4. Set up TypeScript strict mode, path aliases, and env structure
5. Initialize Vercel deployment + GitHub repository

# Day 2: UI Framework Setup
1. npx shadcn-ui@latest init
2. Add core shadcn components (button, card, dialog, form, input)
3. Install Tremor: npm install @tremor/react
4. Copy key Aceternity components for landing page
5. Create unified theme configuration

# Day 3: Design System & Patterns
1. Define color palette, typography scale, spacing system
2. Create component wrapper patterns for consistency
3. Set up /components folder structure (ui, telemetry, fleet, actions)
4. Build first composite components
5. Document component usage guidelines

# Day 4: API & State Setup
1. Set up Apollo Client with GraphQL Code Generator
2. npm install @apollo/client graphql
3. Configure TanStack Query for server state
4. Set up Zustand for UI state
5. Create type-safe API client patterns

# Day 5: Developer Experience
1. npm install -D eslint prettier husky lint-staged
2. Configure pre-commit hooks and formatters
3. Set up GitHub Actions CI/CD pipeline
4. Initialize Technical Debt Registry
5. Create team onboarding documentation
```

## Performance Optimization Strategies

1. **Code Splitting**
   - Route-based splitting by default with Next.js
   - Component-level splitting for heavy visualizations
   - Dynamic imports for third-party libraries

2. **Data Management**
   - Implement cursor-based pagination
   - Use virtual scrolling for large lists
   - Cache API responses with TanStack Query
   - Implement optimistic updates

3. **Asset Optimization**
   - Use Next.js Image component
   - Implement progressive image loading
   - Lazy load non-critical components
   - Use SVGs for icons

4. **Real-time Telemetry**
   - MQTT → Redis Streams → WebSocket pipeline
   - Implement selective subscriptions per equipment
   - Batch updates to prevent re-renders
   - Circuit breaker for network resilience
   - Fallback to polling for degraded connections

## Risk Mitigation Plan

1. **Timeline Buffers**
   - Built-in 4-week buffer across phases
   - Weekly sprint reviews to catch delays early
   - Clear MVP vs post-MVP feature delineation

2. **Technology Risks**
   - ECharts validation in Week 1 (fallback: Chart.js)
   - Tailwind v4 plugin validation early
   - Performance benchmarks from day 1
   - Real-time requirements clarification before implementation

3. **Team Scaling**
   - Start with 3-4 senior developers
   - Add team members only after patterns established
   - Clear code ownership boundaries
   - Comprehensive onboarding documentation

4. **Complexity Management**
   - Feature flags for progressive rollout
   - Component isolation with Storybook
   - Automated testing from start
   - Regular architecture reviews

## MVP Features (8-Week Sprint)

### Week 1-2: Foundation
- ✅ Beautiful landing page with animations
- ✅ Component library setup (shadcn/ui)
- ✅ Design system implementation
- ✅ Basic routing and navigation

### Week 3-5: Core Features
- 🎯 Fleet overview with "God view"
- 🎯 Equipment status grid
- 🎯 Real-time telemetry dashboards
- 🎯 Action item management system
- 🎯 Multi-tenant authentication

### Week 6-7: Polish
- 💎 Advanced equipment filtering
- 💎 Hydraulics monitoring charts (Tremor/ECharts)
- 💎 Mobile + offline optimization
- 💎 Alert system with notifications

### Week 8: Launch
- 🚀 Production deployment
- 🚀 Monitoring setup
- 🚀 User feedback collection
- 🚀 Technical debt documentation

## Success Metrics

- **Performance**: Core Web Vitals all green
- **SEO**: 90+ Lighthouse score on public pages
- **Developer Experience**: <2s hot reload, <30s build time
- **User Experience**: <3s initial dashboard load
- **Code Quality**: 80%+ test coverage, 0 critical issues

## Key Consensus Points (Final)

### Technology Decisions
- **UI Framework**: shadcn/ui + Aceternity + Tremor hybrid for stunning aesthetics
- **Styling**: Tailwind CSS v4 direct adoption
- **API**: GraphQL for flexibility (not tRPC)
- **Timeline**: 8-10 weeks accelerated MVP
- **Team**: 4 senior full-stack developers

### Strategic Approach
1. **Aesthetics First**: Beautiful UI is non-negotiable competitive advantage
2. **Velocity Focus**: Ship to production quickly, iterate based on feedback
3. **Technical Debt Management**: Registry from Day 1, V1.5 stabilization sprint
4. **Component Ownership**: Copy-paste model for full control
5. **Continuous Deployment**: Daily releases with feature flags

## Additional Technologies to Consider

1. **Authentication**: NextAuth.js for comprehensive auth solution
2. **Forms**: React Hook Form + Zod for type-safe forms
3. **Maps**: For fleet distribution visualization (Mapbox or Google Maps)
4. **Analytics**: PostHog or Mixpanel for product analytics
5. **Error Monitoring**: Sentry for production error tracking

## Team Composition Recommendation (Phased)

### Phase 1-2 (Weeks 1-6): Core Team
- 1 Tech Lead/Architect
- 2-3 Senior Frontend Engineers
- Focus: Architecture, patterns, core features

### Phase 3+ (Weeks 7+): Scaled Team
- Original core team
- +2 Frontend Engineers
- +1 QA Engineer
- Focus: Parallel feature development

### Support Roles (As Needed)
- DevOps Engineer (part-time)
- UX Designer (consulting)
- Performance Specialist (sprints)

## Implementation Philosophy

1. **Start Simple**: Begin with Next.js but use basic features initially
2. **Validate Early**: Week 1 PoCs for critical technology decisions
3. **Scale Gradually**: Add complexity only when metrics justify
4. **User-Driven**: Regular testing sessions guide feature prioritization
5. **Performance First**: Monitor Core Web Vitals from day one

## High-Level System Architecture

### Three-Layer IoT Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        EDGE LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Sensors    │  │   Gateway   │  │ Edge Compute│         │
│  │  (Pressure,  │  │  (Protocol  │  │  (Anomaly   │         │
│  │Temperature,  │  │ Conversion) │  │ Detection)  │         │
│  │   Flow)      │  │             │  │             │         │
│  └──────┬───────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                           │ MQTT/HTTP
┌───────────────────────────┼──────────────────────────────────┐
│                        CLOUD LAYER                           │
│  ┌─────────────────────────┴──────────────────────────┐     │
│  │              Ingestion & Processing                 │     │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────────────┐   │     │
│  │  │   Load   │  │  Redis  │  │   TimescaleDB    │   │     │
│  │  │ Balancer │→ │ Streams │→ │  (Time-series)   │   │     │
│  │  └─────────┘  └─────────┘  └──────────────────┘   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              Application Services                   │     │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────────────┐   │     │
│  │  │   API    │  │WebSocket│  │   ML Pipeline    │   │     │
│  │  │ (GraphQL)│  │ Server  │  │ (Python/FastAPI) │   │     │
│  │  └─────────┘  └─────────┘  └──────────────────┘   │     │
│  └─────────────────────────────────────────────────────┘     │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                           │ HTTPS/WSS
┌───────────────────────────┼──────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │    Web App   │  │  Mobile PWA │  │  Operator Apps   │    │
│  │  (Next.js)   │  │  (Offline)  │  │   (Field Use)    │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
1. Sensor Data Collection
   Sensors → Edge Gateway → MQTT/HTTP → Cloud Ingestion
   
2. Real-time Processing
   Ingestion → Redis Streams → Stream Processor → TimescaleDB
                    ↓
               WebSocket → Client Dashboards
               
3. Batch Analytics
   TimescaleDB → Scheduled Jobs → Aggregated Metrics
                                          ↓
                                   Analytics Dashboard
                                   
4. ML Pipeline (Post-MVP)
   TimescaleDB → Feature Engineering → Model Training
                                              ↓
                                     Prediction Service
                                              ↓
                                      Alert Generation
```

### Security Architecture

```
Device Layer:
- X.509 certificates for device authentication
- TLS 1.3 for all communications
- Secure boot for edge devices

API Layer:
- OAuth 2.0 / JWT tokens
- API rate limiting per tenant
- Input validation & sanitization

Data Layer:
- Encryption at rest (AES-256)
- Row-level security (RLS)
- Audit logging for compliance

Network Layer:
- VPC isolation per environment
- WAF for public endpoints
- DDoS protection (Cloudflare)
```

## Fleet Management Specific Architecture

### Dashboard Hierarchy (4-tier)
1. **"God View"**: Global fleet health overview
   - Aggregate system health metrics
   - Critical alerts across all equipment
   - Predictive maintenance indicators
   
2. **Site/Region View**: Location-based groupings
   - Regional equipment clusters
   - Site-specific performance metrics
   - Local maintenance teams
   
3. **Machine View**: Individual equipment status
   - Real-time operational metrics
   - Historical performance trends
   - Maintenance history
   
4. **Component View**: Hydraulics subsystem details
   - Fluid quality analysis
   - Pressure/temperature readings
   - Wear indicators
   - Contamination levels

### Real-time Telemetry Architecture
```typescript
// Data Pipeline
Sensor → MQTT → Redis Streams → WebSocket/SSE → Next.js

// Frontend Integration
- TanStack Query subscriptions for live data
- Zustand for alert state management
- Optimistic UI updates for actions
- Graceful degradation to polling
```

### Multi-tenant Implementation
1. **Tenant Isolation**
   - Path-based routing: `/[tenant]/dashboard`
   - PostgreSQL Row-Level Security (RLS)
   - Tenant context in React Context API
   
2. **Permission System**
   - Role-Based Access Control (RBAC)
   - Granular equipment permissions
   - Action item assignment workflows
   - Audit logging for compliance

### Offline-First Features
1. **PWA Implementation**
   - Service worker for asset caching
   - IndexedDB for telemetry data
   - Background sync for action items
   - Offline indicator UI component
   
2. **Field Operations Support**
   - Download equipment data for offline access
   - Queue maintenance actions
   - Sync when connectivity restored
   - Conflict resolution for concurrent edits

### Industrial Visualization Components
1. **Tremor Extensions**
   - Time-series charts for sensor data
   - Gauge components for pressure readings
   - Heatmaps for fleet health overview
   
2. **Custom Components**
   - Equipment status cards
   - Alert notification system
   - Action item cards with priority
   - Predictive failure timeline

### Data Models
```typescript
interface Equipment {
  id: string;
  tenantId: string;
  type: EquipmentType;
  location: GeoLocation;
  subsystems: Subsystem[];
  status: OperationalStatus;
  lastMaintenance: Date;
  nextScheduledMaintenance: Date;
}

interface HydraulicsData {
  pressure: number;
  temperature: number;
  fluidQuality: FluidAnalysis;
  contaminationLevel: number;
  wearIndicators: WearMetrics;
  timestamp: Date;
}

interface ActionItem {
  id: string;
  equipmentId: string;
  priority: Priority;
  type: ActionType;
  assignee?: User;
  dueDate: Date;
  status: ActionStatus;
  description: string;
}
```

This architecture provides a robust foundation for the fleet management platform while leveraging 70-80% of the existing gym analytics infrastructure.

## Definitive Architecture Decisions (Post-Consensus)

### Core Assumptions Validated
1. **70-80% code reuse** from gym analytics is realistic (UI components, state management, dashboard patterns)
2. **Industrial IoT requirements** differ significantly from consumer analytics (latency, reliability, offline needs)
3. **Field operations** require offline-first Progressive Web App capabilities
4. **Predictive maintenance** is the key differentiator but should be deferred post-MVP
5. **Multi-tenant architecture** essential for enterprise but can be deferred for MVP

### Key Architectural Decisions

#### 1. Real-time Architecture
**Decision**: WebSocket-first for MVP, MQTT post-MVP
```
MVP: Sensors → HTTP/WebSocket → Load Balancer → Redis → TimescaleDB
Post-MVP: Sensors → MQTT → Kafka → WebSocket → TimescaleDB
```
**Rationale**: Reduces complexity by 40% while maintaining upgrade path

#### 2. Multi-tenancy Strategy  
**Decision**: Single-tenant MVP, subdomain-based multi-tenant post-MVP
- MVP: Single deployment per customer
- Post-MVP: `customer1.fleetops.com` subdomain isolation
**Rationale**: Subdomain provides better enterprise security isolation

#### 3. Database Architecture
**Decision**: TimescaleDB from day one
- Hypertable for sensor data (automatic partitioning)
- PostgreSQL compatibility (leverage existing skills)
- Built-in compression for historical data
**Rationale**: Avoids costly migration, handles time-series efficiently

#### 4. Offline Strategy
**Decision**: Progressive Web App (PWA) with IndexedDB
- Service workers for offline caching
- Background sync for action items
- Conflict resolution: Last-Write-Wins (LWW)
**Rationale**: 60% less complexity than native apps

#### 5. ML Integration Timeline
**Decision**: Data collection MVP, ML models post-MVP
- MVP: Focus on high-quality telemetry collection
- Month 4-6: Random Forest for anomaly detection  
- Month 7-9: LSTM for failure prediction
- Month 10+: Advanced models (1D-CNN, ensemble methods)
**Rationale**: Requires 6+ months of labeled failure data

### MVP Scope (10 Weeks)

#### Core Features
1. **Fleet Overview Dashboard**
   - "God view" with equipment status grid
   - Real-time health metrics (5-second updates)
   - Critical alert notifications

2. **Equipment Monitoring**
   - Individual equipment dashboards
   - Hydraulics subsystem focus
   - Time-series visualizations (Tremor/ECharts)
   
3. **Action Item Management**
   - Task creation and assignment
   - Priority-based queuing
   - Offline sync capability
   
4. **Basic Analytics**
   - Utilization reports
   - Maintenance history
   - Simple threshold alerts

#### Technical Constraints
- Single-tenant deployment
- ≤1,000 sensors per deployment
- 5-second update latency acceptable
- 7-day data retention in hot storage

### Post-MVP Roadmap

#### Phase 1 (Months 4-6): Scale & Multi-tenancy
- MQTT integration for reliable sensor communication
- Subdomain-based multi-tenant architecture
- Increase to 10,000+ sensors support
- 30-day hot storage, 1-year cold storage

#### Phase 2 (Months 7-9): Predictive Intelligence
- Random Forest anomaly detection
- LSTM-based failure prediction
- Maintenance scheduling optimization
- ROI/cost savings dashboard

#### Phase 3 (Months 10-12): Advanced Features
- Digital twin 3D visualization
- Edge computing integration
- Advanced ML ensemble models
- Mobile native app (if needed)

### Backend Architecture & Dependencies

#### Core Services Required
```yaml
API Layer:
  - Node.js/Express or Fastify
  - GraphQL with Apollo Server
  - WebSocket server (ws or Socket.io)
  
Data Layer:
  - TimescaleDB (primary)
  - Redis (caching & pub/sub)
  - S3/MinIO (cold storage)
  
Ingestion Pipeline:
  - Redis Streams (MVP buffer)
  - Apache Kafka (post-MVP)
  - MQTT Broker (post-MVP)
  
ML Infrastructure (Post-MVP):
  - Python FastAPI service
  - TensorFlow/PyTorch
  - MLflow for model management
```

#### External Dependencies
- **Authentication**: Auth0 or AWS Cognito
- **Monitoring**: Datadog or Prometheus/Grafana
- **Error Tracking**: Sentry
- **CDN**: Cloudflare or AWS CloudFront

### Data Modeling Requirements

#### Time-Series Schema
```sql
CREATE TABLE sensor_data (
  time TIMESTAMPTZ NOT NULL,
  sensor_id UUID NOT NULL,
  equipment_id UUID NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  quality_score SMALLINT,
  PRIMARY KEY (sensor_id, time)
);

-- Convert to hypertable
SELECT create_hypertable('sensor_data', 'time',
  chunk_time_interval => INTERVAL '1 day');

-- Add compression policy
ALTER TABLE sensor_data SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'sensor_id'
);
```

#### Aggregation Views
```sql
-- Continuous aggregate for hourly averages
CREATE MATERIALIZED VIEW hourly_metrics
WITH (timescaledb.continuous) AS
SELECT 
  time_bucket('1 hour', time) AS hour,
  equipment_id,
  metric_type,
  AVG(value) as avg_value,
  MAX(value) as max_value,
  MIN(value) as min_value
FROM sensor_data
GROUP BY hour, equipment_id, metric_type;
```

### ML Strategy & Path to Predictive Analytics

#### Data Collection Phase (MVP)
- High-frequency sampling (1Hz for critical sensors)
- Comprehensive metadata capture
- Failure event logging with root cause
- Environmental context (temperature, humidity)

#### Feature Engineering Pipeline
```python
# Time-domain features
- Rolling statistics (mean, std, skew)
- Rate of change
- Peak detection
- Trend analysis

# Frequency-domain features  
- FFT for vibration analysis
- Spectral entropy
- Dominant frequencies

# Domain-specific features
- Pressure drop patterns
- Temperature correlations
- Contamination indicators
```

#### Model Evolution
1. **Threshold-based Rules** (MVP)
   - Simple if-then logic
   - Industry-standard limits
   
2. **Anomaly Detection** (Month 4)
   - Isolation Forest
   - One-class SVM
   - Statistical process control
   
3. **Failure Prediction** (Month 7)
   - Random Forest with time windows
   - LSTM for sequential patterns
   - Gradient boosting for interpretability
   
4. **Advanced Models** (Month 10+)
   - Ensemble methods
   - Transfer learning across equipment types
   - Reinforcement learning for maintenance optimization

### Industry Best Practices Applied

1. **Data Quality**
   - Sensor health monitoring
   - Automated outlier detection
   - Missing data interpolation
   
2. **Scalability**
   - Horizontal partitioning by time
   - Read replicas for analytics
   - Caching layer for dashboards
   
3. **Security**
   - End-to-end encryption
   - API rate limiting
   - Row-level security in database
   
4. **Reliability**
   - Circuit breakers for external services
   - Graceful degradation
   - Automated failover