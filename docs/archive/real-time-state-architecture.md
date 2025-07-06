> ⚠️ **ARCHIVED**: This is the v1 architecture, superseded by v2.
> See [telemetry-comprehensive-guide.md](../telemetry-comprehensive-guide.md) for current implementation.

# Real-Time State Management Architecture

## Overview

This document defines the state management architecture for FleetOps' real-time telemetry system, supporting 1Hz sensor updates, offline caching, and WebSocket integration for field operations.

## Requirements

### Functional Requirements
- Handle 1Hz telemetry updates from 100+ sensors per equipment
- Queue data during offline periods
- Sync automatically when connection restored
- Support Last-Write-Wins conflict resolution
- Maintain 24-hour sliding window of telemetry data
- Integrate with WebSocket for real-time updates

### Non-Functional Requirements
- Memory efficient (<100MB for telemetry cache)
- CPU efficient (no UI jank at 1Hz updates)
- Work on low-end field devices
- Support 2G/3G network conditions
- Battery conscious implementation

## Technology Decision

After evaluating options, we've selected **Zustand** for state management because:

1. **Lightweight**: 8KB bundle size vs 44KB (Redux Toolkit)
2. **Simple API**: Less boilerplate for rapid development
3. **TypeScript First**: Excellent type inference
4. **React 18 Ready**: Supports concurrent features
5. **Performance**: Uses subscription model, updates only affected components

## Architecture Design

### Layer Structure

```
┌─────────────────────────────────────────────┐
│             UI Components                    │
│         (React Components)                   │
├─────────────────────────────────────────────┤
│          Custom Hooks Layer                  │
│    (useTelemetry, useEquipment)            │
├─────────────────────────────────────────────┤
│         Zustand Stores                       │
│  (TelemetryStore, EquipmentStore)          │
├─────────────────────────────────────────────┤
│      Middleware & Persistence               │
│  (IndexedDB, Queue, Sync Manager)          │
├─────────────────────────────────────────────┤
│        WebSocket Manager                     │
│    (Connection, Retry, Events)              │
└─────────────────────────────────────────────┘
```

### Store Structure

#### 1. Telemetry Store (`/lib/stores/telemetry-store.ts`)

```typescript
interface TelemetryStore {
  // State
  telemetryData: Map<string, TelemetryReading[]>; // equipmentId -> readings
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  lastSync: Date | null;
  
  // Actions
  addReading: (equipmentId: string, reading: TelemetryReading) => void;
  batchAddReadings: (readings: TelemetryBatch) => void;
  pruneOldData: () => void; // Remove data older than 24h
  
  // Selectors
  getLatestReading: (equipmentId: string, sensorType: string) => TelemetryReading | null;
  getReadingsInRange: (equipmentId: string, start: Date, end: Date) => TelemetryReading[];
}
```

#### 2. Equipment Store (`/lib/stores/equipment-store.ts`)

```typescript
interface EquipmentStore {
  // State
  equipment: Map<string, Equipment>;
  activeEquipmentId: string | null;
  filter: EquipmentFilter;
  
  // Actions
  setEquipment: (equipment: Equipment[]) => void;
  updateEquipmentStatus: (id: string, status: EquipmentStatus) => void;
  setActiveEquipment: (id: string) => void;
  
  // Selectors
  getEquipmentById: (id: string) => Equipment | null;
  getFilteredEquipment: () => Equipment[];
  getEquipmentWithAlerts: () => Equipment[];
}
```

#### 3. Offline Queue Store (`/lib/stores/offline-queue-store.ts`)

```typescript
interface OfflineQueueStore {
  // State
  queue: QueuedAction[];
  syncInProgress: boolean;
  
  // Actions
  enqueue: (action: QueuedAction) => void;
  dequeue: (actionId: string) => void;
  startSync: () => Promise<void>;
  
  // Selectors
  getQueueSize: () => number;
  getFailedActions: () => QueuedAction[];
}
```

### WebSocket Integration

```typescript
// /lib/websocket/websocket-manager.ts
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  
  connect(url: string): void {
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'telemetry':
          useTelemetryStore.getState().batchAddReadings(data.payload);
          break;
        case 'equipment-status':
          useEquipmentStore.getState().updateEquipmentStatus(
            data.equipmentId,
            data.status
          );
          break;
      }
    };
    
    this.ws.onerror = () => this.handleReconnect();
    this.ws.onclose = () => this.handleReconnect();
  }
  
  private handleReconnect(): void {
    // Exponential backoff with max 30s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimer = setTimeout(() => this.connect(this.url), delay);
    this.reconnectAttempts++;
  }
}
```

### Persistence Layer

Using Dexie.js for IndexedDB abstraction:

```typescript
// /lib/db/telemetry-db.ts
import Dexie, { Table } from 'dexie';

interface TelemetryRecord {
  id?: number;
  equipmentId: string;
  sensorType: string;
  value: number;
  timestamp: Date;
  synced: boolean;
}

class TelemetryDatabase extends Dexie {
  telemetry!: Table<TelemetryRecord>;
  
  constructor() {
    super('FleetOpsTelemetry');
    
    this.version(1).stores({
      telemetry: '++id, [equipmentId+timestamp], timestamp, synced'
    });
  }
  
  async pruneOldRecords(): Promise<void> {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await this.telemetry.where('timestamp').below(cutoff).delete();
  }
}
```

### Custom Hooks

```typescript
// /lib/hooks/use-telemetry.ts
export function useTelemetry(equipmentId: string, sensorType?: string) {
  const telemetryData = useTelemetryStore(
    (state) => state.getLatestReading(equipmentId, sensorType)
  );
  
  const historicalData = useTelemetryStore(
    (state) => state.getReadingsInRange(
      equipmentId,
      new Date(Date.now() - 60 * 60 * 1000), // Last hour
      new Date()
    )
  );
  
  return {
    current: telemetryData,
    historical: historicalData,
    isStale: telemetryData ? 
      Date.now() - telemetryData.timestamp > 5000 : true
  };
}
```

## Implementation Phases

### Phase 1: Core State Management (Today)
1. Set up Zustand stores
2. Implement telemetry store with memory management
3. Create WebSocket manager with reconnection
4. Add basic custom hooks

### Phase 2: Persistence Layer (Day 3)
1. Integrate Dexie.js for IndexedDB
2. Implement 24-hour sliding window
3. Add sync status tracking
4. Create pruning mechanism

### Phase 3: Offline Queue (Day 4)
1. Implement action queue store
2. Add background sync integration
3. Create conflict resolution
4. Test offline/online transitions

### Phase 4: Performance Optimization (Day 5)
1. Add React.memo to heavy components
2. Implement virtual scrolling for lists
3. Add telemetry data sampling for UI
4. Profile and optimize hot paths

## Performance Considerations

### Memory Management
- Keep only 24 hours of telemetry in memory
- Sample data for UI display (show every 10th point)
- Use WeakMap for component subscriptions
- Implement aggressive pruning

### Update Optimization
- Batch WebSocket updates (100ms window)
- Use subscription selectors to limit re-renders
- Implement shouldComponentUpdate for charts
- Throttle UI updates to 10Hz max

### Network Efficiency
- Compress WebSocket messages
- Batch sync operations
- Use delta encoding for telemetry
- Implement adaptive sync frequency

## Testing Strategy

### Unit Tests
```typescript
describe('TelemetryStore', () => {
  it('should maintain 24-hour sliding window', () => {
    // Test pruning logic
  });
  
  it('should handle 1Hz updates without memory leak', () => {
    // Test memory management
  });
});
```

### Integration Tests
- WebSocket connection/reconnection
- Offline queue sync
- IndexedDB persistence
- State hydration

### Performance Tests
- Memory usage under load
- UI responsiveness at 1Hz
- Sync performance on slow network
- Battery usage monitoring

## Security Considerations

1. **WebSocket Security**
   - Use WSS (WebSocket Secure)
   - Implement token-based auth
   - Add message validation

2. **Data Encryption**
   - Encrypt sensitive telemetry at rest
   - Use Web Crypto API for IndexedDB

3. **Access Control**
   - Validate equipment access rights
   - Implement row-level security

## Migration Path

For future scaling:
1. **Multi-tenant**: Add tenant isolation to stores
2. **GraphQL**: Replace REST with subscriptions
3. **Worker Threads**: Move heavy processing off main thread
4. **WASM**: Consider for data processing

## Code Examples

### Creating the Telemetry Store

```typescript
// /lib/stores/telemetry-store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TelemetryState {
  telemetryData: Map<string, TelemetryReading[]>;
  connectionStatus: ConnectionStatus;
  lastSync: Date | null;
}

interface TelemetryActions {
  addReading: (equipmentId: string, reading: TelemetryReading) => void;
  batchAddReadings: (readings: TelemetryBatch) => void;
  pruneOldData: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const useTelemetryStore = create<TelemetryState & TelemetryActions>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      telemetryData: new Map(),
      connectionStatus: 'disconnected',
      lastSync: null,
      
      // Actions
      addReading: (equipmentId, reading) => set((state) => {
        if (!state.telemetryData.has(equipmentId)) {
          state.telemetryData.set(equipmentId, []);
        }
        
        const readings = state.telemetryData.get(equipmentId)!;
        readings.push(reading);
        
        // Keep only last 24 hours
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        const filtered = readings.filter(r => r.timestamp > cutoff);
        state.telemetryData.set(equipmentId, filtered);
      }),
      
      batchAddReadings: (batch) => set((state) => {
        // Efficient batch update logic
      }),
      
      pruneOldData: () => set((state) => {
        // Prune all data older than 24h
      }),
      
      setConnectionStatus: (status) => set((state) => {
        state.connectionStatus = status;
        if (status === 'connected') {
          state.lastSync = new Date();
        }
      }),
    }))
  )
);
```

---

## Next Steps

1. **Immediate** (Next 2 hours):
   - Create store structure
   - Implement WebSocket manager
   - Add basic telemetry store

2. **Today**:
   - Complete all three stores
   - Add custom hooks
   - Create demo component

3. **This Week**:
   - Add IndexedDB persistence
   - Implement offline queue
   - Performance optimization

This architecture provides a solid foundation for FleetOps' real-time telemetry needs while maintaining flexibility for future enhancements.