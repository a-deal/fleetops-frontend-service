# FleetOps System Architecture Guide

> **Purpose**: High-level system design and IoT architecture documentation
> **Last Updated**: 2025-07-06
> **Status**: Reference architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [IoT Architecture](#iot-architecture)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Backend Services](#backend-services)
5. [Security Architecture](#security-architecture)
6. [Network Architecture](#network-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [Scalability Considerations](#scalability-considerations)
9. [Related Documentation](#related-documentation)

## System Overview

FleetOps is an industrial IoT platform designed for real-time monitoring of heavy equipment in remote field operations. The architecture prioritizes reliability, field resilience, and safety-critical performance.

### System Components

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Field Devices │────▶│  Edge Gateway    │────▶│  Cloud Backend  │
│   (Sensors)     │     │  (Optional)      │     │  (TimescaleDB)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                                                 │
         │                                                 │
         ▼                                                 ▼
┌─────────────────┐                               ┌─────────────────┐
│  Field Tablets  │◀──────── WebSocket ──────────▶│   Frontend App  │
│  (Offline PWA)  │                               │   (Next.js)     │
└─────────────────┘                               └─────────────────┘
```

### Key Architecture Decisions

1. **Direct sensor-to-cloud** where possible (reduces complexity)
2. **Optional edge processing** for bandwidth-constrained sites
3. **TimescaleDB** for time-series data (PostgreSQL compatible)
4. **WebSocket** for real-time updates (not MQTT)
5. **PWA-first** for field deployment (no app stores)

## IoT Architecture

### Sensor Layer

```typescript
interface SensorTypes {
  temperature: { range: [-40, 150], unit: "°C", frequency: "1Hz" },
  pressure: { range: [0, 1000], unit: "PSI", frequency: "10Hz" },
  vibration: { range: [0, 100], unit: "mm/s", frequency: "100Hz" },
  flow: { range: [0, 10000], unit: "L/min", frequency: "1Hz" },
  level: { range: [0, 100], unit: "%", frequency: "0.1Hz" }
}
```

### Communication Protocols

#### Direct Connection (Preferred)
```
Sensor → 4G/5G Modem → Cloud API
- Low latency (<100ms)
- No edge infrastructure
- Suitable for 80% of sites
```

#### Edge Gateway (When Needed)
```
Sensors → RS485/LoRa → Edge Gateway → 4G/Satellite → Cloud
- Local aggregation
- Store-and-forward
- For remote/underground sites
```

### Data Formats

```typescript
// Raw sensor reading
interface TelemetryReading {
  sensorId: string;        // "PUMP-101-TEMP-1"
  timestamp: number;       // Unix timestamp (ms)
  value: number;          // 45.7
  unit: string;           // "°C"
  quality: number;        // 0-100 confidence
}

// Aggregated data (1-second windows)
interface TelemetryAggregate {
  sensorId: string;
  timestamp: number;
  min: number;
  max: number;
  avg: number;
  count: number;
  stdDev?: number;
}
```

## Data Flow Architecture

### Real-Time Data Path

```
1. Sensor Reading (100Hz)
     ↓
2. Edge Aggregation (1 second windows)
     ↓
3. HTTPS POST to API Gateway
     ↓
4. Message Queue (for reliability)
     ↓
5. TimescaleDB Insert
     ↓
6. WebSocket Broadcast
     ↓
7. Frontend Update (Zustand)
     ↓
8. UI Render (React 18)
```

### Offline Data Path

```
1. Sensor Reading
     ↓
2. IndexedDB Queue (on tablet)
     ↓
3. Background Sync (when online)
     ↓
4. Bulk Upload API
     ↓
5. Conflict Resolution
     ↓
6. Database Merge
```

### Historical Data Access

```typescript
// Efficient time-series queries
SELECT 
  time_bucket('1 minute', timestamp) AS minute,
  sensor_id,
  AVG(value) as avg_value,
  MAX(value) as max_value,
  MIN(value) as min_value
FROM telemetry
WHERE 
  sensor_id = 'PUMP-101-TEMP-1' 
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY minute, sensor_id
ORDER BY minute DESC;
```

## Backend Services

### Service Architecture

```
┌─────────────────────────────────────────────────────┐
│                   API Gateway                        │
│              (Authentication, Routing)               │
└─────────────┬──────────────┬──────────────┬────────┘
              │              │              │
     ┌────────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
     │   Telemetry   │ │Equipment │ │   Alert    │
     │   Service     │ │ Service  │ │  Service   │
     └───────┬───────┘ └────┬─────┘ └─────┬──────┘
             │              │              │
     ┌───────▼──────────────▼──────────────▼──────┐
     │            TimescaleDB Cluster              │
     │         (Sharded by sensor_id)              │
     └─────────────────────────────────────────────┘
```

### Service Responsibilities

#### Telemetry Service
- Ingests sensor data
- Validates readings
- Performs aggregations
- Manages data retention

#### Equipment Service
- Equipment registry
- Maintenance schedules
- Threshold management
- Health calculations

#### Alert Service
- Real-time monitoring
- Alert generation
- Notification dispatch
- Acknowledgment tracking

### Database Schema

```sql
-- Hypertable for time-series data
CREATE TABLE telemetry (
  time        TIMESTAMPTZ NOT NULL,
  sensor_id   TEXT NOT NULL,
  value       DOUBLE PRECISION NOT NULL,
  unit        TEXT NOT NULL,
  quality     SMALLINT
);

-- Convert to hypertable
SELECT create_hypertable('telemetry', 'time');

-- Optimized indexing
CREATE INDEX ON telemetry (sensor_id, time DESC);

-- Compression policy (after 7 days)
SELECT add_compression_policy('telemetry', INTERVAL '7 days');

-- Retention policy (after 90 days)
SELECT add_retention_policy('telemetry', INTERVAL '90 days');
```

## Security Architecture

### Security Layers

```
1. Device Security
   - Unique device certificates
   - Secure element for keys
   - Firmware signing
   
2. Transport Security
   - TLS 1.3 minimum
   - Certificate pinning
   - VPN for critical sites
   
3. API Security
   - JWT authentication
   - Rate limiting
   - Request signing
   
4. Data Security
   - Encryption at rest
   - Column-level encryption for PII
   - Audit logging
```

### Authentication Flow

```typescript
// Device authentication
POST /api/v1/auth/device
{
  "deviceId": "TABLET-FIELD-001",
  "certificate": "-----BEGIN CERTIFICATE-----...",
  "signature": "..."
}

// Response
{
  "accessToken": "eyJ0eXAiOiJKV1Q...",
  "refreshToken": "...",
  "expiresIn": 3600,
  "permissions": ["telemetry:read", "alerts:acknowledge"]
}
```

### Field Security Considerations

1. **Offline Authentication**
   - Cache tokens for 7 days
   - Gradual permission degradation
   - Emergency override codes

2. **Device Management**
   - Remote wipe capability
   - Geofencing for sensitive sites
   - Usage analytics

## Network Architecture

### Network Topology

```
Field Sites                    Cloud Region
┌──────────┐                  ┌─────────────┐
│ Site A   │                  │             │
│ ┌──────┐ │     Internet     │   CDN       │
│ │Tablet│ ├──────────────────┤  (Static)   │
│ └──────┘ │                  │             │
│ ┌──────┐ │                  ├─────────────┤
│ │Sensor│ │                  │             │
│ └──────┘ │                  │ App Servers │
└──────────┘                  │  (Dynamic)  │
                              │             │
┌──────────┐                  ├─────────────┤
│ Site B   │     Private      │             │
│ ┌──────┐ │      Network     │  Database   │
│ │Gateway├──────────────────┤  Cluster    │
│ └──────┘ │                  │             │
└──────────┘                  └─────────────┘
```

### Bandwidth Optimization

```typescript
// Adaptive quality based on network
const getDataQuality = (bandwidth: number): DataQuality => {
  if (bandwidth > 1000) return 'full';      // >1 Mbps
  if (bandwidth > 100) return 'standard';   // >100 Kbps
  if (bandwidth > 10) return 'basic';       // >10 Kbps
  return 'minimal';                          // <10 Kbps
};

// Quality affects:
// - Sampling rate (100Hz → 10Hz → 1Hz)
// - Aggregation window (1s → 10s → 60s)
// - Decimal precision (3 → 2 → 1)
```

## Deployment Architecture

### Cloud Deployment

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: telemetry-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: telemetry
  template:
    spec:
      containers:
      - name: telemetry
        image: fleetops/telemetry:v1.0.0
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: DB_CONNECTION
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: connection-string
```

### Edge Deployment

```dockerfile
# Edge gateway container
FROM alpine:3.18
RUN apk add --no-cache python3 py3-pip
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY edge-gateway.py .
CMD ["python3", "edge-gateway.py"]

# Minimal footprint: <50MB
# Memory usage: <128MB
# CPU: ARM64 compatible
```

### Frontend Deployment

```typescript
// Vercel deployment config
{
  "functions": {
    "app/api/*": {
      "maxDuration": 10
    }
  },
  "regions": ["syd1", "sin1", "fra1"],
  "env": {
    "NEXT_PUBLIC_WS_URL": "@websocket-url",
    "DATABASE_URL": "@database-url"
  }
}
```

## Scalability Considerations

### Horizontal Scaling

```
Current Scale:
- 100 sites
- 10,000 sensors
- 100M readings/day

Target Scale (2025):
- 1,000 sites
- 100,000 sensors
- 1B readings/day

Architecture supports:
- 10,000 sites
- 1M sensors
- 10B readings/day
```

### Scaling Strategies

1. **Database Sharding**
   ```sql
   -- Shard by site_id for data locality
   CREATE TABLE telemetry_shard_1 PARTITION OF telemetry
   FOR VALUES FROM ('SITE-001') TO ('SITE-100');
   ```

2. **Read Replicas**
   ```
   Primary (Writes) → Replica 1 (Analytics)
                   → Replica 2 (Reporting)
                   → Replica 3 (Backup)
   ```

3. **Caching Strategy**
   ```typescript
   // Redis for hot data
   const getCachedReading = async (sensorId: string) => {
     const cached = await redis.get(`sensor:${sensorId}`);
     if (cached) return JSON.parse(cached);
     
     const fresh = await db.getLatestReading(sensorId);
     await redis.setex(`sensor:${sensorId}`, 60, JSON.stringify(fresh));
     return fresh;
   };
   ```

### Performance Benchmarks

| Metric | Current | Target | Theoretical Max |
|--------|---------|--------|-----------------|
| Ingestion Rate | 1K/sec | 10K/sec | 100K/sec |
| Query Latency | 50ms | 20ms | 5ms |
| WebSocket Connections | 1K | 10K | 100K |
| Storage Efficiency | 10B/reading | 8B/reading | 4B/reading |

## Related Documentation

- [Frontend Implementation](./frontend-implementation-guide.md) - UI architecture
- [Telemetry Guide](./telemetry-comprehensive-guide.md) - Data processing
- [PWA Architecture](./PWA-What-Why-How.md) - Offline capabilities
- [Security Policies](./archive/security-considerations.md) - Detailed security

### External References
- [TimescaleDB Docs](https://docs.timescale.com/) - Database documentation
- [Industrial IoT Standards](https://www.isa.org/) - Industry standards
- [OPC UA Specification](https://opcfoundation.org/) - Protocol reference

---

This architecture is designed to scale with your field operations while maintaining the reliability your technicians depend on.